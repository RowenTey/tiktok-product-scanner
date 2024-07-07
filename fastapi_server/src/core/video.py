import io
import os
import json
import shutil
import whisper
import base64
import subprocess
import numpy as np
import moviepy.editor as mp
from moviepy.video.io.VideoFileClip import VideoFileClip
from .transformer import phi3Vision
from .minio_client import minioClient
from .kafka_client import kafkaClient
from .inference import get_product_keywords
from enum import Enum
from PIL import Image

class FrameExtractionMode(Enum):
    KEYFRAMES = "keyframes"
    ONE_PER_SECOND = "one_per_second"
    FIXED = "fixed"

NUM_FIXED_FRAMES = 30

def remove_files_and_directories(target_directory, video_path, audio_path):
    """
    Removes all files and directories recursively from the target_directory.
    Also removes the video_path and audio_path if they exist.
    
    Parameters:
        target_directory (str): Path to the target directory.
        video_path (str): Path to the video file to be removed.
        audio_path (str): Path to the audio file to be removed.
    """
    # Remove all files and directories in the target directory
    if os.path.exists(target_directory):
        for root, dirs, files in os.walk(target_directory, topdown=False):
            for name in files:
                file_path = os.path.join(root, name)
                try:
                    os.remove(file_path)
                    # print(f"Removed file: {file_path}")
                except Exception as e:
                    print(f"Error removing file: {file_path}. Error: {e}")
            for name in dirs:
                dir_path = os.path.join(root, name)
                try:
                    os.rmdir(dir_path)
                    print(f"Removed directory: {dir_path}")
                except Exception as e:
                    print(f"Error removing directory: {dir_path}. Error: {e}")

    # Remove the video file if it exists
    if os.path.exists(video_path):
        try:
            os.remove(video_path)
            # print(f"Removed video file: {video_path}")
        except Exception as e:
            print(f"Error removing video file: {video_path}. Error: {e}")

    # Remove the audio file if it exists
    if os.path.exists(audio_path):
        try:
            os.remove(audio_path)
            # print(f"Removed audio file: {audio_path}")
        except Exception as e:
            print(f"Error removing audio file: {audio_path}. Error: {e}")


def ensure_minimum_keyframes(video_buffer=None, output_directory="output/keyframes", min_frames=9, start_threshold=0.3, step=0.01, min_threshold=0.025, mode=FrameExtractionMode.KEYFRAMES):
    """
    Ensures at least a minimum number of keyframes are extracted by progressively lowering the threshold.
    """
    if mode == FrameExtractionMode.ONE_PER_SECOND:
        extract_keyframes(video_buffer=video_buffer, output_directory=output_directory, mode=FrameExtractionMode.ONE_PER_SECOND)
    elif mode == FrameExtractionMode.KEYFRAMES:
        current_threshold = start_threshold
        while current_threshold >= min_threshold:
            # Extract keyframes with the current threshold
            extract_keyframes(
                video_buffer=video_buffer, output_directory=output_directory, threshold=current_threshold)

            # Count the number of extracted keyframes
            num_keyframes = len([name for name in os.listdir(
                output_directory) if os.path.isfile(os.path.join(output_directory, name))])

            # Check if we have extracted enough keyframes
            if num_keyframes >= min_frames:
                print(
                    f"Extracted {num_keyframes} keyframes with threshold {current_threshold}")
                return

            # Lower the threshold for the next iteration
            current_threshold -= step

        print(
            f"Minimum threshold reached. Extracted {num_keyframes} keyframes with threshold {current_threshold}")
    elif mode == FrameExtractionMode.FIXED:
        extract_keyframes(video_buffer=video_buffer, output_directory=output_directory, mode=FrameExtractionMode.FIXED)


def extract_keyframes(video_buffer = None, output_directory="output/keyframes", threshold=None, mode=FrameExtractionMode.KEYFRAMES):
    """
    Extracts key frames from a video buffer using FFmpeg and saves them in the specified output directory.

    Parameters:
        video_buffer (io.BytesIO): Video buffer.
        output_directory (str): Directory to save the extracted key frames. Default is "keyframes".
        threshold (float): Scene change detection threshold for FFmpeg.
    """
    # Ensure the output directory exists
    if not os.path.exists(output_directory):
        os.makedirs(output_directory)

    # If the directory exists, delete all the current content
    for file_name in os.listdir(output_directory):
        file_path = os.path.join(output_directory, file_name)
        if os.path.isfile(file_path):
            os.remove(file_path)
        elif os.path.isdir(file_path):
            shutil.rmtree(file_path)

    # Write the buffer to a temporary file to use with FFmpeg
    temp_video_path = "output/temp_video.mp4"
    if video_buffer is not None and not os.path.exists(temp_video_path):
        with open(temp_video_path, "wb") as temp_file:
            temp_file.write(video_buffer.read())
        print("Video buffer written to temporary file")

    if mode == FrameExtractionMode.KEYFRAMES:
        assert threshold is not None, "Threshold cannot be None"
        ffmpeg_command = [
            "C:\\Users\\leeja\\Documents\\VSCode\\ffmpeg\\bin\\ffmpeg.exe",
            "-i", temp_video_path,
            "-vf", f"select='gt(scene,{threshold})'",
            "-vsync", "vfr",
            os.path.join(output_directory, "keyframe_%03d.png")
        ]

        try:
            # Execute the FFmpeg command
            subprocess.run(ffmpeg_command, check=True, stdout=subprocess.DEVNULL)
            print(
                f"Key frames extracted successfully and saved in '{output_directory}'")
        except subprocess.CalledProcessError as e:
            print(f"Error extracting key frames: {e}")
    elif mode == FrameExtractionMode.ONE_PER_SECOND:
        ffmpeg_command = [
             "C:\\Users\\leeja\\Documents\\VSCode\\ffmpeg\\bin\\ffmpeg.exe",
            "-i", temp_video_path,
            "-vf", "fps=1",
            "-vsync", "vfr",
            os.path.join(output_directory, "keyframe_%03d.png")
        ]

        try:
            # Execute the FFmpeg command
            subprocess.run(ffmpeg_command, check=True, stdout=subprocess.DEVNULL)
            print(
                f"Key frames extracted successfully and saved in '{output_directory}'")
        except subprocess.CalledProcessError as e:
            print(f"Error extracting key frames: {e}")
    elif mode == FrameExtractionMode.FIXED:
        clip = VideoFileClip(temp_video_path)
        duration = clip.duration
        interval = duration / NUM_FIXED_FRAMES

        for i in range(NUM_FIXED_FRAMES):
            print(f"Extracting frame: {i+1}")
            frame = clip.get_frame(i * interval)
            img = Image.fromarray(np.uint8(frame))
            output_path = os.path.join(output_directory, f"keyframe_{i + 1:04d}.png")
            img.save(output_path)

    

def load_images_from_folder(folder="output/keyframes"):
    """
    Loads all images from a given folder.

    Parameters:
        folder (str): Path to the folder containing images.

    Returns:
        List of PIL Image objects.
    """
    images = []
    for filename in sorted(os.listdir(folder)):
        if filename.endswith(".png"):
            img = Image.open(os.path.join(folder, filename))
            images.append(img)
    return images


def convert_frames_to_pil(frames):
    """
    Converts a list of frames (numpy arrays) to PIL Images.
    """
    pil_images = []
    for frame in frames:
        # Convert numpy array to PIL Image
        image = Image.fromarray(np.uint8(frame))
        pil_images.append(image)
    return pil_images


def create_image_grid_dynamic(frames, output_path="output/keyframe_grid.png"):
    """
    Creates a grid of images from the extracted frames with no white space.

    Parameters:
        frames (list): List of PIL Image objects.
        output_path (str): Path to save the output grid image.
    """
    print("Creating image grid...")

    # Determine grid size based on the number of frames
    num_frames = len(frames)
    # Minimum grid size 3x3, maximum 5x5
    grid_size = min(max(int(num_frames**0.5), 3), 5)

    # Assuming all frames are the same size
    frame_width, frame_height = frames[0].size

    # Create a new image with the size to fit the grid
    grid_width = frame_width * grid_size
    grid_height = frame_height * grid_size
    grid_image = Image.new('RGB', (grid_width, grid_height))

    # Paste each frame into the correct position in the grid
    for index, frame in enumerate(frames):
        if index >= grid_size * grid_size:
            break  # Stop if we exceed the maximum grid size
        x = (index % grid_size) * frame_width
        y = (index // grid_size) * frame_height
        grid_image.paste(frame, (x, y))

    # Save the final grid image
    grid_image.save(output_path)
    print(f"Image grid saved to '{output_path}'")

    return grid_image

    # Reduce the resolution by half
    new_width = grid_image.width // 2
    new_height = grid_image.height // 2
    resized_grid_image = grid_image.resize((new_width, new_height), Image.BICUBIC)

    # Optionally save the resized image (if needed)
    resized_output_path = output_path.replace(".png", "_resized.png")
    resized_grid_image.save(resized_output_path)
    print(f"Resized image row saved to '{resized_output_path}'")

    return resized_grid_image


def create_image_row_dynamic(frames, output_path="output/keyframe_row.png"):
    """
    Creates a row of images from the extracted frames with no white space.

    Parameters:
        frames (list): List of PIL Image objects.
        output_path (str): Path to save the output row image.
    """
    print("Creating image row...")

    # Ensure we use a maximum of 25 frames
    max_frames = 25
    frames = frames[:max_frames]

    # Assuming all frames are the same size
    frame_width, frame_height = frames[0].size

    # Create a new image with the size to fit the frames in a row
    row_width = frame_width * len(frames)
    row_height = frame_height
    row_image = Image.new('RGB', (row_width, row_height))

    # Paste each frame into the correct position in the row
    for index, frame in enumerate(frames):
        x = index * frame_width
        row_image.paste(frame, (x, 0))

    # Save the final row image
    row_image.save(output_path)
    print(f"Image row saved to '{output_path}'")

    return row_image

    # Reduce the resolution by half
    new_width = row_image.width // 2
    new_height = row_image.height // 2
    resized_row_image = row_image.resize((new_width, new_height), Image.BICUBIC)

    # Optionally save the resized image (if needed)
    resized_output_path = output_path.replace(".png", "_resized.png")
    resized_row_image.save(resized_output_path)
    print(f"Resized image row saved to '{resized_output_path}'")

    return resized_row_image


def extract_audio_from_buffer(video_path="output/temp_video.mp4", audio_output_path="output/audio.wav"):
    """
    Extracts audio from a video buffer.
    """
    if not os.path.exists(video_path):
        return ""

    print("Extracting audio from video buffer...")
    clip = mp.VideoFileClip(video_path)
    clip.audio.write_audiofile(audio_output_path, codec='pcm_s16le')


def transcribe_audio(audio_path="output/audio.wav"):
    """
    Transcribes audio using OpenAI's Whisper model.
    """
    if not os.path.exists(audio_path):
        return ""

    print(f"Transcribing audio from {audio_path}...")
    model = whisper.load_model("large")
    # audio = whisper.load_audio(audio_path)
    # audio = whisper.pad_or_trim(audio)
    # mel = whisper.log_mel_spectrogram(audio).to(model.device)
    
    # _, probs = model.detect_language(mel)
    # print(f"Detected language: {max(probs, key=probs.get)}")

    # result = model.transcribe(audio_path, language=max(probs, key=probs.get))
    # # options = whisper.DecodingOptions()
    # # result = whisper.decode(model, mel, options)
    result = model.transcribe(audio_path, language="en")
    return result["text"]


def frames_to_base64(frames):
    """
    Converts a list of frames to a list of base64 encoded strings.
    """
    print("Converting frames to base64...")
    base64_images = []
    for frame in frames:
        # Convert the frame (numpy array) to an image
        image = Image.fromarray(np.uint8(frame))

        # Save the image to a bytes buffer
        buffered = io.BytesIO()
        image.save(buffered, format="PNG")

        # Encode the image bytes to base64
        base64_image = base64.b64encode(buffered.getvalue()).decode("utf-8")
        base64_images.append(base64_image)

    return base64_images


def image_to_base64(image_path):
    """
    Convert an image to a base64 encoded string.
    """
    print(f"Converting image to base64: {image_path}")
    with open(image_path, "rb") as image_file:
        return base64.b64encode(image_file.read()).decode('utf-8')


def process_video_buffer(video_buffer):
    print("Starting processing of video...")

    # Extract keyframes from the video buffer
    ensure_minimum_keyframes(video_buffer=video_buffer, mode=FrameExtractionMode.FIXED)

    extract_audio_from_buffer()
    transcript = transcribe_audio()
    print(transcript)

    # Load the extracted keyframes
    keyframes = load_images_from_folder()

    keywords = []

    # Inferencing
    print("Starting inference on row")
    keywords.extend(get_product_keywords(keyframes, transcript))

    # clean up
    print("Cleaning up...")
    remove_files_and_directories("output", "output/temp_video.mp4", "output/audio.wav")

    return keywords

def process_video(id, bucket, filename):
    print("Starting processing of video...")

    minioClient.download_file(bucket, filename, "output/temp_video.mp4")

    # Extract keyframes from the video buffer
    ensure_minimum_keyframes(mode=FrameExtractionMode.FIXED)

    extract_audio_from_buffer()
    transcript = transcribe_audio()
    print(transcript)

    # Load the extracted keyframes
    keyframes = load_images_from_folder()

    keywords = []

    # Inferencing
    print("Getting product keywords...")
    keywords.extend(get_product_keywords(keyframes, transcript))

    # clean up
    print("Cleaning up...")
    remove_files_and_directories("output", "output/temp_video.mp4", "output/audio.wav")

    kafkaClient.send_message(
        "process-video-complete", 
        json.dumps({"keywords": keywords, "filename": filename, "id": id})
    )

    return True
