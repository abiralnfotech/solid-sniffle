from pydantic import BaseModel, Field, field_validator
from typing import Tuple, Any
from uuid import UUID
from datetime import datetime

class RouteBase(BaseModel):
    start_location: Tuple[float, float] = Field(..., description="Longitude, Latitude")
    destination_location: Tuple[float, float] = Field(..., description="Longitude, Latitude")
    departure_time: datetime
    available_seats: int = Field(..., gt=0)

class RouteCreate(RouteBase):
    pass

class RouteRead(BaseModel):
    route_id: UUID
    driver_id: UUID
    start_location: Any
    destination_location: Any
    departure_time: datetime
    available_seats: int
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True
