from pydantic import BaseModel, Field
from typing import Optional
from uuid import UUID
from datetime import datetime
from app.models.models import FlagReason

class RideReviewBase(BaseModel):
    is_good: bool
    flag_reason: Optional[FlagReason] = None
    comment: Optional[str] = Field(None, max_length=500)

class RideReviewCreate(RideReviewBase):
    ride_id: UUID

class RideReviewRead(BaseModel):
    review_id: UUID
    ride_id: UUID
    reviewer_id: UUID
    reviewee_id: UUID
    is_good: bool = Field(validation_alias="is_good_experience")
    flag_reason: Optional[FlagReason] = None
    comment: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True
