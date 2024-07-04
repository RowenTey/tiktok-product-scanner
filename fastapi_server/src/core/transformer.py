import os
import json
from PIL import Image
from transformers import AutoProcessor, AutoModelForCausalLM


# Generation arguments for the model
GENERATION_ARGS = {
    "max_new_tokens": 4096,
    "do_sample": False,
}

# Set environment variable for Hugging Face Hub
os.environ['HF_HUB_ENABLE_HF_TRANSFER'] = '1'


class Phi3Vision:
    model = None
    processor = None

    def load_model(self):
        # Model and Processor IDs
        MODEL_ID = "microsoft/Phi-3-vision-128k-instruct"

        # Load model and processor
        self.model = AutoModelForCausalLM.from_pretrained(
            MODEL_ID,
            device_map="cuda",
            trust_remote_code=True,
            torch_dtype="auto"
        )

        self.processor = AutoProcessor.from_pretrained(
            MODEL_ID, trust_remote_code=True)

    def run_inference(self, image, prompt):
        """Generate a response using the Phi-3 model given an image and a prompt."""
        messages = [{"role": "user", "content": f"<|image_1|>\n{prompt}"}]
        prompt_text = self.processor.tokenizer.apply_chat_template(
            messages, tokenize=False, add_generation_prompt=True)

        inputs = self.processor(
            prompt_text, [image], return_tensors="pt").to("cuda:0")
        generate_ids = self.model.generate(
            **inputs, eos_token_id=self.processor.tokenizer.eos_token_id, **GENERATION_ARGS)

        # Remove input tokens from the generated output
        generate_ids = generate_ids[:, inputs['input_ids'].shape[1]:]
        response = self.processor.batch_decode(
            generate_ids, skip_special_tokens=True, clean_up_tokenization_spaces=False)[0]

        return response

    def get_product_keywords(self, image, transcript, is_grid):
        """Generate a detailed description and product recommendations based on the image and transcript."""
        prompt = (
            f"You must follow these instructions EXACTLY.\n"
            f"You are given {'a collage of video frames' if not is_grid else 'a collage of video frames arranged in a 3 by 3 grid'} ordered from left to right.\n"
            f"Describe each frame of the video with great detail, and use possible name brand items as often as you can.\n"
            f"Perform text recognition whenever possible."
        )

        if transcript:
            prompt += f" You may also use the audio transcript for further context: {transcript}"

        # Generate description based on the image and prompt
        description = self.run_inference(image, prompt)
        print(description)

        # Prepare prompt for product recommendation
        prompt2 = (
            "Respond with JSON array.\n"
            "You are a shopping assistant tasked with helping a user find relevant products based on a given context.\n"
            "Suggest 3 most relevant product search terms for online shopping platforms given the context:\n"
        )

        messages = [{"role": "user", "content": f"{prompt2 + description}"}]
        prompt_text = self.processor.tokenizer.apply_chat_template(
            messages, tokenize=False, add_generation_prompt=True)

        inputs = self.processor(prompt_text, return_tensors="pt").to("cuda:0")
        generate_ids = self.model.generate(
            **inputs, eos_token_id=self.processor.tokenizer.eos_token_id, **GENERATION_ARGS)

        # Remove input tokens from the generated output
        generate_ids = generate_ids[:, inputs['input_ids'].shape[1]:]
        response = self.processor.batch_decode(
            generate_ids, skip_special_tokens=True, clean_up_tokenization_spaces=False)[0]

        print("\n-----\n")
        print(response)

        keywords = json.loads(response.replace(
            "`", "").replace("json", "").strip())
        print(keywords)

        return keywords


phi3Vision = Phi3Vision()

if __name__ == "__main__":
    image_path = "C:\\Users\\leeja\\Documents\\VSCode\\fastapi_server\\output\\keyframe_grid.png"
    image = Image.open(image_path)
    transcript = ""

    phi3Vision = Phi3Vision()
    phi3Vision.load_model()

    # Generate product recommendations
    phi3Vision.get_product_keywords(image, transcript, True)
