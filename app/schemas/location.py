from pydantic import BaseModel, Field
from typing import Tuple, Any
from uuid import UUID
from datetime import datetime

class LocationUpdateBase(BaseModel):
    location: Tuple[float, float] = Field(..., description="Longitude, Latitude")

class LocationUpdateCreate(LocationUpdateBase):
    ride_id: UUID

class LocationUpdateRead(BaseModel):
    stream_id: int = Field(validation_alias="stream_id")
    ride_id: UUID
    driver_id: UUID
    location: Any = Field(validation_alias="current_gps_coordinate")
    timestamp: datetime = Field(validation_alias="captured_at")


    class Config:
        from_attributes = True

class SOSAlertCreate(LocationUpdateBase):
    ride_id: UUID

class SOSAlertRead(BaseModel):
    sos_id: UUID
    ride_id: UUID
    user_id: UUID = Field(validation_alias="triggered_by")
    location: Any = Field(validation_alias="last_known_gps")
    is_resolved: bool
    created_at: datetime

    class Config:
        from_attributes = True
