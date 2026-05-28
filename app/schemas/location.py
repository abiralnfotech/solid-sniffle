from pydantic import BaseModel, Field
from typing import Tuple, Any
from uuid import UUID
from datetime import datetime

class LocationUpdateBase(BaseModel):
    location: Tuple[float, float] = Field(..., description="Longitude, Latitude")

class LocationUpdateCreate(LocationUpdateBase):
    ride_id: UUID

class LocationUpdateRead(BaseModel):
    update_id: UUID
    ride_id: UUID
    driver_id: UUID
    location: Any
    timestamp: datetime

    class Config:
        from_attributes = True

class SOSAlertCreate(LocationUpdateBase):
    ride_id: UUID

class SOSAlertRead(BaseModel):
    sos_id: UUID
    ride_id: UUID
    user_id: UUID
    location: Any
    is_resolved: bool
    created_at: datetime

    class Config:
        from_attributes = True
