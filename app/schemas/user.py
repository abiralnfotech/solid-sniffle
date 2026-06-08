from pydantic import BaseModel, Field, field_validator
import re
from typing import Optional
from uuid import UUID


class UserBase(BaseModel):
    phone_number: str = Field(..., description="Nepalese mobile number starting with +9779")
    full_name: str

    @field_validator('phone_number')
    @classmethod
    def validate_nepal_phone(cls, v: str) -> str:
        if not re.match(r'^\+9779[78]\d{8}$', v):
            raise ValueError('Invalid Nepalese phone number format')
        return v

class UserCreate(UserBase):
    pass

class UserRead(UserBase):
    user_id: UUID
    role: str
    is_banned: bool
    profile_picture_url: Optional[str] = None
    credit_balance: float = 0.0
    is_verified: bool = False
    rating: float = 5.0

    class Config:
        from_attributes = True

class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    profile_picture_url: Optional[str] = None

class UserStatus(BaseModel):
    is_active: bool
    suspension_reason: Optional[str] = None
