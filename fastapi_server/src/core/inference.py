import json
from .transformer import phi3Vision
from .ollama import ollama


def get_product_keywords(image, transcript):
    """Generate a detailed description and product recommendations based on the image and transcript."""
    prompt_1 = (
        "You are given a video frame of a Tiktok video.\n"
        "Describe the video frame in as much detail as possible.\n"
        "Try recognising objects in the frame, refer to the commonly known brand names of the objects.\n"
        "NEVER mention or include anything related to Tiktok in your response, such as Tiktok logo or the Tiktok username.\n"
    )

    # Generate description based on the image and prompt
    # check if image is PIL image or list of PIL images
    if not isinstance(image, list):
        image = [image]
        
    # cleanup ollama just in case
    ollama.cleanup()
    phi3Vision.load_model()
    print("Loaded model!")
        
    description = ""
    for i, img in enumerate(image):
        des = phi3Vision.run_inference_with_image(img, prompt_1)
    
        print(f"Frame {i}: " + des + "\n")
        description += f"Frame {i}: " + des + "\n"
        
    # unload model from GPU
    phi3Vision.cleanup()

    prompt_1_2 = (
        "You are a expert shopping assistant tasked with providing product recommendations.\n"
        "You are provided with 30 descriptions of video frames extracted from a Tiktok video\n"
        "Try to describe what the video is about, and based on that, suggest 3 products relevant to the context of the video.\n"
        "Based on the information, describe products relevant to the context of the video.\n"
        "Context:\n"
    )
    
    if transcript:
        prompt_1_2 += f" You may also use the audio transcript for further context: {transcript}"
    
    intermediate_resp = ollama.generate(prompt=prompt_1_2 + description, temperature=0.4)

    print("\n-----\n")
    print(intermediate_resp)

    # Prepare prompt for product recommendation
    prompt_2 = (
        "You are a online shopping assistant.\n"
        "Provide 3 product search keywords for online shopping platforms from this analysis:\n"
        "You MUST ONLY respond with a JSON array in this exact format: [\"keyword1\", \"keyword2\", \"keyword3\"].\n"
        "Do not include any other output in your response."
    )
    
    response = ollama.generate(prompt=prompt_2 + intermediate_resp, temperature=0.2)

    print("\n-----\n")
    print(response)
    ollama.cleanup()

    keywords = json.loads(response.replace("`", "").replace("json", "").strip())
    print(keywords)
    
    return keywords


if __name__ == "__main__":
    print("nothing for now")  
