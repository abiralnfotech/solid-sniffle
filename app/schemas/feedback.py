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

class RideReviewRead(RideReviewBase):
    review_id: UUID
    ride_id: UUID
    reviewer_id: UUID
    reviewee_id: UUID
    created_at: datetime

    class Config:
        from_attributes = True
