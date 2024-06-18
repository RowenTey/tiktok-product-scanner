#!/bin/bash

# Ensure the script receives a video file as input
if [ "$#" -ne 1 ]; then
    echo "Usage: $0 <video_file>"
    exit 1
fi

input_video=$1
output_directory="output"
mkdir -p $output_directory

echo "Input video: $input_video"
echo "Output directory: $output_directory"

# Get the duration of the video in seconds
duration=$(ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "$input_video")
echo "duration: $duration"

if [ $? -ne 0 ]; then
    echo "Error getting video duration"
    exit 1
fi

# Calculate the frame extraction interval (divide by 9)
interval=$(awk -v dur="$duration" 'BEGIN {print dur / 9}')
fps=$(awk -v interval="$interval" 'BEGIN {printf "%.5f\n", 1 / interval}')
echo "Frame extraction interval: $interval seconds"
echo "FPS for frame extraction: $fps"

# # Extract frames from the video (at even intervals)
echo "Extracting frames every $interval seconds..."
ffmpeg -i "$input_video" -vf "fps=$fps" "$output_directory/frame_%03d.png"
if [ $? -ne 0 ]; then
    echo "Error extracting frames"
    exit 1
fi

# Extract audio from the video
echo "Extracting audio..."
ffmpeg -i "$input_video" -q:a 0 -map a "$output_directory/audio.mp3"
if [ $? -ne 0 ]; then
    echo "Error extracting audio"
    exit 1
fi

# echo "Press any key to continue..."
# read -n 1 -s