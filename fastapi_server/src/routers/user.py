from fastapi import APIRouter, Query
from starlette.responses import JSONResponse
from core.responses import success_response
from schemas.models import User

router = APIRouter()


@router.get("/users")
async def get_users(
    offset: int = Query(default=0),
    limit: int = Query(default=10),
) -> JSONResponse:
    users = {"name": "Rowen", "offset": offset, "limit": limit}
    return success_response(users)


@router.post("/users")
async def add_user(
    user: User
) -> JSONResponse:
    return success_response(user)
