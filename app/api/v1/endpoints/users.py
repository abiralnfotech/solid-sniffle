from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import get_db
from app.schemas.user import UserCreate, UserRead
from app.repositories.user import UserRepository
from app.services.user_service import UserService
from app.models.models import User
from typing import List

router = APIRouter()

async def get_user_service(db: AsyncSession = Depends(get_db)) -> UserService:
    repo = UserRepository(User, db)
    return UserService(repo)

@router.post("/", response_model=UserRead, status_code=status.HTTP_201_CREATED)
async def create_user(
    user_in: UserCreate,
    service: UserService = Depends(get_user_service)
):
    """
    Register a new user with a Nepalese phone number.
    """
    user = User(**user_in.model_dump())
    return await service.create_user(user)

@router.get("/{user_id}", response_model=UserRead)
async def get_user(
    user_id: str,
    service: UserService = Depends(get_user_service)
):
    """
    Get user details by ID.
    """
    return await service.get_user(user_id)
