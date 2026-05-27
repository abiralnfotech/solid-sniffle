from pydantic import BaseModel, Field, field_validator
import re

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
    user_id: str
    role: str
    is_banned: bool

    class Config:
        from_attributes = True
