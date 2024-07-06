from contextlib import asynccontextmanager
from fastapi import FastAPI
from routers import api_router
from core.transformer import phi3Vision
from core.kafka_client import kafkaClient
from core.minio_client import minioClient
from core.video import process_video
from starlette.middleware.cors import CORSMiddleware
import uvicorn
import logging

def handle_message(message):
    print(f'Received: {message}')
    process_video(message['id'], message['bucket'], message['fileName'])

@asynccontextmanager
async def lifespan(app: FastAPI):
    # # Load the ML model
    # phi3Vision.load_model()
    # print("Loaded model!")
    
    kafkaClient.start_consumer("process-video", handle_message)
    kafkaClient.start_producer()
    
    minioClient.connect()

    yield

    # Clean up the ML model and release the resources
    # print("Cleaning up...")
    # phi3Vision.cleanup()
    
    # kafkaClient.close_consumer()
    kafkaClient.close_producer()


app = FastAPI(lifespan=lifespan)
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"Hello": "World"}

app.include_router(api_router)

if __name__ == "__main__":
    uvicorn.run(
        app="main:app",
        host="0.0.0.0",
        port=8001,
        log_level=logging.WARNING,
        reload=False,
        reload_excludes="C:\\Users\\leeja\\Documents\\VSCode\\fastapi_server\\output\\"
    )
