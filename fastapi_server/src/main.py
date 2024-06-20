from fastapi import FastAPI
from src.routers import api_router
import uvicorn

app = FastAPI()

@app.get("/")
def root():
    return {"Hello": "World"}

app.include_router(api_router)

if __name__ == "__main__":
    uvicorn.run(
        app="main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
    )