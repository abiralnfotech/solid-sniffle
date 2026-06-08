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
    started_at: Optional[datetime] = None
    ended_at: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class RideSearchResult(BaseModel):
    ride_id: UUID
    driver_name: str
    driver_rating: float
    vehicle_info: str
    available_seats: int
    goodwill_cost: int
    departure_time: datetime
    pickup_distance: float

class RideRequestCreate(BaseModel):
    seats: int

class RideRequestResponse(BaseModel):
    request_id: UUID

class PassengerRequest(BaseModel):
    request_id: UUID
    passenger_name: str
    passenger_rating: float
    mutual_friends: int
    seats_requested: int
    pickup_location: str
    status: str

class RideRequestUpdate(BaseModel):
    status: str

class RideCreateRequest(BaseModel):
    origin: str
    destination: str
    origin_lat: float
    origin_lng: float
    destination_lat: float
    destination_lng: float
    departure_time: datetime
    total_seats: int
    vehicle_id: Optional[UUID] = None
