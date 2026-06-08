from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import get_db
from app.schemas.auth import OTPRequest, OTPVerify, Token, BiometricToggle
from app.services.auth_service import AuthService
from app.repositories.user import UserRepository
from app.models.models import User
from app.api.v1.deps import get_current_user

router = APIRouter()

async def get_auth_service(db: AsyncSession = Depends(get_db)) -> AuthService:
    repo = UserRepository(User, db)
    return AuthService(repo)

@router.post("/request-otp", status_code=status.HTTP_200_OK)
async def request_otp(
    payload: OTPRequest,
    service: AuthService = Depends(get_auth_service)
):
    await service.request_otp(payload.phone_number)
    return {"message": "OTP sent successfully"}

@router.post("/verify-otp", response_model=Token)
async def verify_otp(
    payload: OTPVerify,
    service: AuthService = Depends(get_auth_service)
):
    return await service.verify_otp(payload.phone_number, payload.otp)

@router.post("/biometric-toggle")
async def biometric_toggle(
    payload: BiometricToggle,
    current_user: User = Depends(get_current_user),
    service: AuthService = Depends(get_auth_service)
):
    return await service.toggle_biometric(current_user.user_id, payload.enabled, payload.device_id)
