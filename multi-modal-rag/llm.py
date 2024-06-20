import base64
import requests
import json

# Load your OLLAMA API configuration
OLLAMA_API_ENDPOINT = "https://ollama-api.leejacksonz.com/api/generate"
OLLAMA_API_KEY = "your_ollama_api_key"


def image_to_base64(image_path):
    """
    Convert an image to a base64 encoded string.
    """
    with open(image_path, "rb") as image_file:
        return base64.b64encode(image_file.read()).decode('utf-8')


def send_to_ollama(image_path, transcription):
    """
    Send the image and transcription to the OLLAMA model and get the response.
    """
    image_base64 = image_to_base64(image_path)
    payload = {
        "model": "bakllava:7b-v1-q8_0",
        "prompt": f"""
The 3x3 image shows video frames in sequence. Describe in detail what’s likely going on in each frame.

You also can hear following in the audio track: \n{transcription}\n. Mention what you can hear in the audio.
        """,
        "images": [image_base64],
        "stream": False,
    }

    # print(json.dumps(payload))

    # Prepare the headers
    headers = {
        "Content-Type": "application/json",
        "CF-Access-Client-Id": "d7e8e6e22ffae2581a2c7b8785343fa9.access",
        "CF-Access-Client-Secret": "aa5746f8dc9873caabbb7070167d8bc0fde0362611b24d8dca8e23794a5b5b9f"
    }

    # Make the API request
    response = requests.post(
        OLLAMA_API_ENDPOINT, data=json.dumps(payload), headers=headers)

    if response.status_code == 200:
        return response.json()
    else:
        print(f"Error: {response.status_code} - {response.text}")
        return {}


def main():
    image_path = "grid.png"
    transcription_path = "transcription.txt"

    # Read the transcription
    with open(transcription_path, "r") as f:
        transcription = f.read()

    # Send to OLLAMA
    response = send_to_ollama(image_path, transcription)
    print(f"OLLAMA Model Response: {json.dumps(response, indent=2)}")


if __name__ == "__main__":
    main()
