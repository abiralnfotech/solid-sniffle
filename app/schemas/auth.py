from pydantic import BaseModel
from uuid import UUID
from typing import Optional

class OTPRequest(BaseModel):
    phone_number: str

class OTPVerify(BaseModel):
    phone_number: str
    otp: str

class Token(BaseModel):
    access_token: str
    token_type: str
    user_id: UUID
    onboarding_completed: bool

class BiometricToggle(BaseModel):
    enabled: bool
    device_id: str
