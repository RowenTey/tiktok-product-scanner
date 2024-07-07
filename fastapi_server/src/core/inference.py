import json
from .transformer import phi3Vision
from .ollama import ollama


def get_product_keywords(image, transcript, is_grid):
    """Generate a detailed description and product recommendations based on the image and transcript."""
    prompt_1 = (
        "You are given a screenshot from a Tiktok video.\n"
        "Describe this image. Try recognising specific objects in the frame, use brand names as often as you can.\n"
        "Do not mention anything related to Tiktok in your response, such as Tiktok logo or the Tiktok username.\n"
    )


    # Generate description based on the image and prompt
    # check if image is PIL image or list of PIL images
    if not isinstance(image, list):
        image = [image]
        
    description = ""
    for i, img in enumerate(image):
        des = phi3Vision.run_inference_with_image(img, prompt_1)
    
        print(f"Frame {i}: " + des + "\n")
        description += f"Frame {i}: " + des + "\n"
        
    # unload model from GPU
    phi3Vision.cleanup()

    prompt_1_2 = (
        "You are a online shopping assistant tasked with helping a user find relevant products based on a given context.\n"
        "You are provided with 30 descriptions of video frames extracted from a Tiktok video.\n"
        "Try to describe what the video is about.\n"
        "Based on the information, describe products that are relevant to the video.\n"
        "Context:\n"
    )
    
    if transcript:
        prompt_1_2 += f" You may also use the audio transcript for further context: {transcript}"
    
    intermediate_resp = ollama.generate(prompt=prompt_1_2 + description, temperature=0.8)

    print("\n-----\n")
    print(intermediate_resp)

    # Prepare prompt for product recommendation
    prompt_2 = (
        "You are a online shopping search assistant\n"
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
