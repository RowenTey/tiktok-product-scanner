import requests
import json
import time

class Ollama:
    def __init__(self, endpoint="localhost:11434") -> None:
        self.endpoint = endpoint
        self.last_used = ""

    def generate(self, prompt, model="llama3:8b-instruct-q8_0"):

        payload = json.dumps({
          "model": model,
          "prompt": prompt,
          "stream": False,
          "options": {
                "temperature": 0.4
          }
        })
        
        headers = {
          'Content-Type': 'application/json'
        }

        response = requests.request("POST", f"http://{self.endpoint}/api/generate", headers=headers, data=payload)
        if response.status_code == 200:
            self.last_used = model
            return response.json().get("response")
        else:
            return None
        
    def cleanup(self):
        print(f"Unloading {self.last_used} from ollama...")
        payload = json.dumps({
            "model": self.last_used,
            "keep_alive": 0
        })
        
        headers = {
            'Content-Type': 'application/json'
        }

        response = requests.request("POST", f"http://{self.endpoint}/api/generate", headers=headers, data=payload)
        if response.status_code == 200:
            self.last_used = ""
        else:
            return None

ollama = Ollama()
