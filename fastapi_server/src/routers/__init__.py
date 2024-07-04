from fastapi import APIRouter

from routers import user, video

api_router = APIRouter()
api_router.include_router(video.router, tags=["Video"])
