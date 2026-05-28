from pydantic import BaseModel, Field
from typing import Optional
from uuid import UUID
from datetime import datetime
from app.models.models import RideStatus

class RideBase(BaseModel):
    route_id: UUID
    seat_count: int = Field(default=1, gt=0)

class RideCreate(RideBase):
    pass

class RideRead(RideBase):
    ride_id: UUID
    passenger_id: UUID
    status: RideStatus
    fixed_fare_credits: int
    started_at: Optional[datetime]
    ended_at: Optional[datetime]
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
