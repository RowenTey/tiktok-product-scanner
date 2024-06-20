import whisper
import matplotlib.pyplot as plt
import moviepy.editor as mp
from moviepy.video.io.VideoFileClip import VideoFileClip


def extract_frames(video_path, num_frames=9):
    """
    Extracts a specified number of frames from a video.
    """
    clip = VideoFileClip(video_path)
    duration = clip.duration
    interval = duration / num_frames

    frames = []
    for i in range(num_frames):
        frame = clip.get_frame(i * interval)
        frames.append(frame)
    return frames


def create_image_grid(frames, output_path="grid.png"):
    """
    Creates a 3x3 grid of images from the extracted frames.
    """
    # fig, axes = plt.subplots(3, 3, figsize=(10, 10))
    # for i, ax in enumerate(axes.flat):
    #     if i < len(frames):
    #         ax.imshow(frames[i])
    #     ax.axis('off')
    # plt.savefig(output_path)
    # plt.close(fig)

    # fig, axes = plt.subplots(3, 3, figsize=(10, 10))

    # # Turn off spacing between subplots
    # plt.subplots_adjust(wspace=0, hspace=0)

    # for i, ax in enumerate(axes.flat):
    #     if i < len(frames):
    #         ax.imshow(frames[i])
    #         ax.set_xticks([])
    #         ax.set_yticks([])
    #         ax.set_frame_on(False)

    # # Adjust the subplots so that they take up the full figure area
    # plt.subplots_adjust(left=0, right=1, top=1, bottom=0)

    # plt.savefig(output_path, bbox_inches='tight', pad_inches=0)
    # plt.close(fig)

    fig, axes = plt.subplots(3, 3, figsize=(10, 10))

    # Turn off spacing between subplots
    plt.subplots_adjust(wspace=0, hspace=0, left=0, right=1, top=1, bottom=0)

    for i, ax in enumerate(axes.flat):
        if i < len(frames):
            ax.imshow(frames[i])
            ax.set_xticks([])
            ax.set_yticks([])
            ax.set_frame_on(False)

    # Remove any remaining white space
    plt.subplots_adjust(wspace=0, hspace=0)
    plt.margins(0, 0)
    plt.gca().xaxis.set_major_locator(plt.NullLocator())
    plt.gca().yaxis.set_major_locator(plt.NullLocator())

    plt.savefig(output_path, bbox_inches='tight', pad_inches=0)
    plt.close(fig)


def extract_audio(video_path, audio_output_path="audio.wav"):
    """
    Extracts audio from a video file.
    """
    clip = mp.VideoFileClip(video_path)
    clip.audio.write_audiofile(audio_output_path, codec='pcm_s16le')


def transcribe_audio(audio_path):
    """
    Transcribes audio using OpenAI's Whisper model.
    """
    model = whisper.load_model("base")
    result = model.transcribe(audio_path)
    return result["text"]


def main(video_path):
    # Extract frames and create grid
    frames = extract_frames(video_path)
    create_image_grid(frames)

    # Extract and transcribe audio
    audio_path = "audio.wav"
    extract_audio(video_path, audio_path)
    transcription = transcribe_audio(audio_path)

    # Save transcription to a file
    with open("transcription.txt", "w") as f:
        f.write(transcription)

    print("Transcription:")
    print(transcription)


if __name__ == "__main__":
    video_path = "macbook.mp4"
    main(video_path)
