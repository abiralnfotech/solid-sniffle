from pydantic import BaseModel, Field
from typing import Optional
from uuid import UUID
from datetime import datetime
from app.models.models import VerificationStatus

class KYCBase(BaseModel):
    document_type: str = Field(..., max_length=50)
    document_number: str = Field(..., max_length=50)
    driver_license_number: Optional[str] = Field(None, max_length=50)
    identity_front_url: str
    identity_back_url: str
    driver_license_url: Optional[str] = None

class KYCCreate(KYCBase):
    pass

class KYCRead(KYCBase):
    kyc_id: UUID
    user_id: UUID
    status: VerificationStatus
    reviewed_by: Optional[UUID] = None
    reviewed_at: Optional[datetime] = None
    rejection_reason: Optional[str] = None

    class Config:
        from_attributes = True

class KYCReview(BaseModel):
    status: VerificationStatus
    rejection_reason: Optional[str] = None
