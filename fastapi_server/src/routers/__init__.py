from fastapi import APIRouter

from src.routers import user

api_router = APIRouter()
api_router.include_router(user.router, tags=["User"])