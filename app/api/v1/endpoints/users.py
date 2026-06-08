from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import get_db
from app.schemas.user import UserCreate, UserRead, UserUpdate, UserStatus
from app.repositories.user import UserRepository
from app.services.user_service import UserService
from app.models.models import User
from app.api.v1.deps import get_current_user
from typing import List
import uuid

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

@router.get("/me", response_model=UserRead)
async def get_my_profile(
    current_user: User = Depends(get_current_user),
    service: UserService = Depends(get_user_service)
):
    """
    Retrieve current user profile details.
    """
    user = await service.get_user(str(current_user.user_id))
    data = user.model_dump()
    data.update({
        "credit_balance": 500,
        "is_verified": True,
        "rating": 4.8
    })
    return data

@router.patch("/me", response_model=UserRead)
async def update_my_profile(
    user_in: UserUpdate,
    current_user: User = Depends(get_current_user),
    service: UserService = Depends(get_user_service)
):
    """
    Update user profile (name, profile picture).
    """
    return await service.update_user(str(current_user.user_id), user_in)

@router.get("/status", response_model=UserStatus)
async def get_account_status(
    current_user: User = Depends(get_current_user),
    service: UserService = Depends(get_user_service)
):
    """
    Check if account is active or suspended.
    """
    user = await service.get_user(str(current_user.user_id))
    return UserStatus(is_active=not user.is_banned, suspension_reason=None)

@router.get("/{user_id}", response_model=UserRead)
async def get_user(
    user_id: str,
    service: UserService = Depends(get_user_service)
):
    """
    Get user details by ID.
    """
    user = await service.get_user(user_id)
    data = user.model_dump()
    data.update({
        "credit_balance": 500,
        "is_verified": True,
        "rating": 4.8
    })
    return data
