from typing import Optional
from uuid import UUID, uuid4
import secrets
from datetime import datetime, timedelta, timezone
from jose import jwt
from app.core.config import settings
from app.models.models import User, UserDeviceAuth
from app.repositories.user import UserRepository
from app.core.exceptions import AppException
from fastapi import status

# Mock OTP storage for simplicity in this implementation
# In production, this should be in Redis
otp_storage = {}

class AuthService:
    def __init__(self, user_repo: UserRepository):
        self.user_repo = user_repo

    async def request_otp(self, phone_number: str) -> str:
        # Generate a 6-digit OTP
        otp = "".join([str(secrets.randbelow(10)) for _ in range(6)])
        # In a real app, send OTP via SMS here
        otp_storage[phone_number] = {
            "otp": otp,
            "expires": datetime.now(timezone.utc) + timedelta(minutes=5)
        }
        print(f"DEBUG: OTP for {phone_number} is {otp}")
        return otp

    async def verify_otp(self, phone_number: str, otp: str):
        if phone_number not in otp_storage:
            raise AppException("OTP not requested or expired", status_code=status.HTTP_400_BAD_REQUEST)

        stored_data = otp_storage[phone_number]
        if stored_data["expires"] < datetime.now(timezone.utc):
            del otp_storage[phone_number]
            raise AppException("OTP expired", status_code=status.HTTP_400_BAD_REQUEST)

        if stored_data["otp"] != otp:
            raise AppException("Invalid OTP", status_code=status.HTTP_400_BAD_REQUEST)

        # OTP verified, remove it
        del otp_storage[phone_number]

        # Get or create user
        user = await self.user_repo.get_by_phone(phone_number)
        onboarding_completed = False
        if not user:
            user = User(
                phone_number=phone_number,
                full_name="", # Will be filled during onboarding
            )
            user = await self.user_repo.create(user)
        else:
            if user.full_name:
                onboarding_completed = True

        # Generate an actual JWT token
        expire = datetime.now(timezone.utc) + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        to_encode = {"exp": expire, "sub": str(user.user_id)}
        access_token = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)

        return {
            "access_token": access_token,
            "token_type": "bearer",
            "user_id": user.user_id,
            "onboarding_completed": onboarding_completed
        }

    async def toggle_biometric(self, user_id: UUID, enabled: bool, device_id: str):
        # Implementation for biometric toggle
        # This would typically involve storing the device_id and public key
        return {"status": "ok"}
