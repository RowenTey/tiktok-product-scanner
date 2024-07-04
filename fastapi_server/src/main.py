from fastapi import FastAPI
from routers import api_router
from core.transformer import phi3Vision
from starlette.middleware.cors import CORSMiddleware
import uvicorn

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def startup_event():
    phi3Vision.load_model()


@app.get("/")
def root():
    return {"Hello": "World"}


app.include_router(api_router)

if __name__ == "__main__":
    uvicorn.run(
        app="main:app",
        host="0.0.0.0",
        port=8001,
        reload=True,
    )
