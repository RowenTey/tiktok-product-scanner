from fastapi import APIRouter
from starlette.responses import JSONResponse
from src.core.responses import success_response

router = APIRouter()

@router.get("/users")
async def get_users() -> JSONResponse:
    users = {"name": "Rowen"}
    return success_response(users)