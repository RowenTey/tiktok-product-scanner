import io
import os
import json
import shutil
import whisper
import base64
import requests
import subprocess
import numpy as np
import moviepy.editor as mp
from PIL import Image
from moviepy.video.io.VideoFileClip import VideoFileClip


# Load your OLLAMA API configuration
OLLAMA_API_ENDPOINT = "https://ollama-api.leejacksonz.com/api/generate"
OLLAMA_API_KEY = "your_ollama_api_key"


def extract_frames(video_path, num_frames=9):
    """
    Extracts a specified number of frames from a video.
    """
    print(f"Extracting {num_frames} frames from {video_path}...")
    clip = VideoFileClip(video_path)
    duration = clip.duration
    interval = duration / num_frames

    frames = []
    for i in range(num_frames):
        frame = clip.get_frame(i * interval)
        frames.append(frame)
    return frames


def extract_keyframes(video_path, output_directory="keyframes", threshold=0.3):
    """
    Extracts key frames from a video using FFmpeg and saves them in the specified output directory.

    Parameters:
        video_path (str): Path to the input video file.
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

    # Construct the FFmpeg command
    ffmpeg_command = [
        "ffmpeg",
        "-i", video_path,
        "-vf", f"select='gt(scene,{threshold})'",
        "-vsync", "vfr",
        os.path.join(output_directory, "keyframe_%03d.png")
    ]

    try:
        # Execute the FFmpeg command
        subprocess.run(ffmpeg_command, check=True)
        print(
            f"Key frames extracted successfully and saved in '{output_directory}'")
    except subprocess.CalledProcessError as e:
        print(f"Error extracting key frames: {e}")


def ensure_minimum_keyframes(video_path, output_directory="keyframes", min_frames=9, start_threshold=0.3, step=0.01, min_threshold=0.025):
    """
    Ensures at least a minimum number of keyframes are extracted by progressively lowering the threshold.

    Parameters:
        video_path (str): Path to the input video file.
        output_directory (str): Directory to save the extracted key frames.
        min_frames (int): Minimum number of keyframes to extract.
        start_threshold (float): Initial scene change detection threshold for FFmpeg.
        step (float): Step by which to lower the threshold in each iteration.
        min_threshold (float): Minimum threshold value to stop the iterations.
    """
    current_threshold = start_threshold

    while current_threshold >= min_threshold:
        # Extract keyframes with the current threshold
        extract_keyframes(video_path, output_directory, current_threshold)

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


def load_images_from_folder(folder):
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


def create_image_grid(frames, output_path="grid.png"):
    """
    Creates a 3x3 grid of images from the extracted frames with no white space.
    """
    print("Creating image grid...")

    # Check if there are exactly 9 frames
    assert len(frames) == 9, "You must provide exactly 9 frames."

    # Assuming all frames are the same size
    frame_width, frame_height = frames[0].size

    # Create a new image with the size to fit a 3x3 grid
    grid_width = frame_width * 3
    grid_height = frame_height * 3
    grid_image = Image.new('RGB', (grid_width, grid_height))

    # Paste each frame into the correct position in the grid
    for index, frame in enumerate(frames):
        x = (index % 3) * frame_width
        y = (index // 3) * frame_height
        grid_image.paste(frame, (x, y))

    # Save the final grid image
    grid_image.save(output_path)


def create_image_grid_dynamic(frames, output_path="grid.png"):
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


def create_image_row(frames, output_path="row.png"):
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


def extract_audio(video_path, audio_output_path="audio.wav"):
    """
    Extracts audio from a video file.
    """
    print(f"Extracting audio from {video_path}...")
    clip = mp.VideoFileClip(video_path)
    clip.audio.write_audiofile(audio_output_path, codec='pcm_s16le')


def transcribe_audio(audio_path):
    """
    Transcribes audio using OpenAI's Whisper model.
    """
    print(f"Transcribing audio from {audio_path}...")
    model = whisper.load_model("base")
    result = model.transcribe(audio_path)
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


def send_to_ollama(transcription, image_path="grid.png"):
    """
    Send the image and transcription to the OLLAMA model and get the response.
    """
    print("Sending to OLLAMA...")

    image_base64: list
    image_base64 = [image_to_base64(image_path)]

    payload = {
        "model": "bakllava:7b-v1-q8_0",
        "prompt": f"""
The 3x3 image shows video frames in sequence from left to right. Describe in detail what do you see in each frame, 
use the brand name of the product if you know it.

You also can hear the following audio track: \n{transcription}\n. Mention what you can hear in the audio.
        """,
        "images": image_base64,
        "stream": False,
    }

    # Prepare the headers
    headers = {
        "Content-Type": "application/json",
        "CF-Access-Client-Id": "d7e8e6e22ffae2581a2c7b8785343fa9.access",
        "CF-Access-Client-Secret": "aa5746f8dc9873caabbb7070167d8bc0fde0362611b24d8dca8e23794a5b5b9f"
    }

    # Make the API request
    response = requests.post(
        OLLAMA_API_ENDPOINT, data=json.dumps(payload), headers=headers)

    if response.status_code != 200:
        print(f"Error: {response.status_code} - {response.text}")
        return {}

    return response.json()["response"]


def main(video_path):
    # Extract frames and create grid
    frames = extract_frames(video_path)
    create_image_grid(convert_frames_to_pil(frames))

    # Extract and transcribe audio
    audio_path = "audio.wav"
    extract_audio(video_path, audio_path)
    transcription = transcribe_audio(audio_path)

    print("Transcription:")
    print(transcription)

    # Save transcription to a file
    with open("transcription.txt", "w") as f:
        f.write(transcription)

    # Send to OLLAMA
    response = send_to_ollama(transcription, "grid.png")
    print(f"OLLAMA Model Response: {response}")


if __name__ == "__main__":
    # video_path = "macbook.mp4"
    video_path = "supermarket.MP4"

    # main(video_path)
    ensure_minimum_keyframes(video_path)

    # Step 2: Load keyframes and create the grid
    frames = load_images_from_folder("keyframes")
    create_image_grid_dynamic(frames)
    create_image_row(frames)
