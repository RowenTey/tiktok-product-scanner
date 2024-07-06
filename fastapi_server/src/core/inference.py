import json
from .transformer import phi3Vision
from .ollama import ollama


def get_product_keywords(image, transcript, is_grid):
    """Generate a detailed description and product recommendations based on the image and transcript."""
    prompt_1 = (
        "You must follow these instructions EXACTLY.\n"
        f"You are given {'a collage of video frames' if not is_grid else 'a collage of video frames arranged in a 3 by 3 grid'} ordered from left to right.\n"
        "Describe each frame of the video with as much details as possible. Try recognising specific objects in the frame, use brand names as often as you can.\n"
        "Try to describe the video as a whole.\n"
    )

    if transcript:
        prompt_1 += f" You may also use the audio transcript for further context: {transcript}"

    # Generate description based on the image and prompt
    description = phi3Vision.run_inference_with_image(image, prompt_1)
    print(description)
    phi3Vision.cleanup()

    prompt_1_2 = (
        "You are a shopping assistant tasked with helping a user find relevant products based on a given context.\n"
        "Based on the information, describe relevant, useful or related products that are applicable. Suggest 3 relevant search keywords for such products.\n"
        "Be specific with the product search keywords you suggest.\n"
        "Context:\n"
    )

    intermediate_resp = ollama.generate(prompt_1_2 + description)

    print("\n-----\n")
    print(intermediate_resp)

    # Prepare prompt for product recommendation
    prompt_2 = (
        "Provide 3 most relevant product search keywords for online shopping platforms from this analysis:\n"
        "You MUST ONLY respond with a JSON array in this exact format: [\"keyword1\", \"keyword2\", \"keyword3\"].\n"
        "Do not include any other output in your response."
    )

    # response = self.run_inference(prompt_2 + description)
    response = ollama.generate(prompt_2 + intermediate_resp)

    print("\n-----\n")
    print(response)
    ollama.cleanup()

    keywords = json.loads(response.replace("`", "").replace("json", "").strip())
    print(keywords)
    
    return keywords



if __name__ == "__main__":
    print("nothing for now")  
