from enum import Enum
from datetime import datetime
from typing import Optional, List, Any
from uuid import UUID, uuid4
from sqlmodel import SQLModel, Field, Relationship, Column, TIMESTAMP, text
from geoalchemy2 import Geography

class UserRole(str, Enum):
    passenger = "passenger"
    driver = "driver"
    admin = "admin"
    super_admin = "super_admin"

class VerificationStatus(str, Enum):
    pending = "pending"
    approved = "approved"
    rejected = "rejected"

class RideStatus(str, Enum):
    requested = "requested"
    accepted = "accepted"
    active = "active"
    awaiting_confirmation = "awaiting_confirmation"
    completed = "completed"
    cancelled = "cancelled"

class FlagReason(str, Enum):
    reckless_driving = "reckless_driving"
    unpunctual = "unpunctual"
    inappropriate_behavior = "inappropriate_behavior"
    asked_for_cash = "asked_for_cash"
    other = "other"

class User(SQLModel, table=True):
    __tablename__ = "users"

    user_id: UUID = Field(default_factory=uuid4, primary_key=True)
    phone_number: str = Field(unique=True, index=True, max_length=15)
    full_name: str = Field(max_length=100)
    role: UserRole = Field(default=UserRole.passenger)
    is_banned: bool = Field(default=False)
    created_at: datetime = Field(
        default_factory=datetime.utcnow,
        sa_column=Column(TIMESTAMP(timezone=True), server_default=text("CURRENT_TIMESTAMP"), nullable=False)
    )

    kyc: Optional["KYCVerification"] = Relationship(back_populates="user")
    ledger_entries: List["CreditLedger"] = Relationship(back_populates="user")

class KYCVerification(SQLModel, table=True):
    __tablename__ = "kyc_verifications"

    kyc_id: UUID = Field(default_factory=uuid4, primary_key=True)
    user_id: UUID = Field(foreign_key="users.user_id", unique=True)
    document_type: str = Field(max_length=50)
    document_number: str = Field(unique=True, max_length=50)
    driver_license_number: Optional[str] = Field(default=None, unique=True, max_length=50)
    identity_front_url: str
    identity_back_url: str
    driver_license_url: Optional[str] = Field(default=None)
    status: VerificationStatus = Field(default=VerificationStatus.pending)
    reviewed_by: Optional[UUID] = Field(default=None, foreign_key="users.user_id")
    reviewed_at: Optional[datetime] = Field(default=None, sa_column=Column(TIMESTAMP(timezone=True)))
    rejection_reason: Optional[str] = Field(default=None)

    user: User = Relationship(back_populates="kyc")

class DriverRoute(SQLModel, table=True):
    __tablename__ = "driver_routes"

    route_id: UUID = Field(default_factory=uuid4, primary_key=True)
    driver_id: UUID = Field(foreign_key="users.user_id")
    # PostGIS columns are tricky with SQLModel, might need sa_column
    start_location: Any = Field(sa_column=Column(Geography(geometry_type='POINT', srid=4326), nullable=False))
    destination_location: Any = Field(sa_column=Column(Geography(geometry_type='POINT', srid=4326), nullable=False))
    departure_time: datetime = Field(sa_column=Column(TIMESTAMP(timezone=True), nullable=False))
    available_seats: int = Field(gt=0)
    is_active: bool = Field(default=True)
    created_at: datetime = Field(
        default_factory=datetime.utcnow,
        sa_column=Column(TIMESTAMP(timezone=True), server_default=text("CURRENT_TIMESTAMP"), nullable=False)
    )

class Ride(SQLModel, table=True):
    __tablename__ = "rides"

    ride_id: UUID = Field(default_factory=uuid4, primary_key=True)
    route_id: UUID = Field(foreign_key="driver_routes.route_id")
    passenger_id: UUID = Field(foreign_key="users.user_id")
    status: RideStatus = Field(default=RideStatus.requested)
    fixed_fare_credits: int = Field(gt=0)
    seat_count: int = Field(default=1, gt=0)
    started_at: Optional[datetime] = Field(default=None, sa_column=Column(TIMESTAMP(timezone=True)))
    ended_at: Optional[datetime] = Field(default=None, sa_column=Column(TIMESTAMP(timezone=True)))
    created_at: datetime = Field(
        default_factory=datetime.utcnow,
        sa_column=Column(TIMESTAMP(timezone=True), server_default=text("CURRENT_TIMESTAMP"), nullable=False)
    )
    updated_at: datetime = Field(
        default_factory=datetime.utcnow,
        sa_column=Column(TIMESTAMP(timezone=True), server_default=text("CURRENT_TIMESTAMP"), nullable=False)
    )

class RideReview(SQLModel, table=True):
    __tablename__ = "ride_reviews"

    review_id: UUID = Field(default_factory=uuid4, primary_key=True)
    ride_id: UUID = Field(foreign_key="rides.ride_id")
    reviewer_id: UUID = Field(foreign_key="users.user_id")
    reviewee_id: UUID = Field(foreign_key="users.user_id")
    is_good: bool = Field(description="True for Good Experience, False for Bad Experience")
    flag_reason: Optional[FlagReason] = Field(default=None)
    comment: Optional[str] = Field(default=None, max_length=500)
    created_at: datetime = Field(
        default_factory=datetime.utcnow,
        sa_column=Column(TIMESTAMP(timezone=True), server_default=text("CURRENT_TIMESTAMP"), nullable=False)
    )

class LocationUpdate(SQLModel, table=True):
    __tablename__ = "location_updates"

    update_id: UUID = Field(default_factory=uuid4, primary_key=True)
    ride_id: UUID = Field(foreign_key="rides.ride_id")
    driver_id: UUID = Field(foreign_key="users.user_id")
    location: Any = Field(sa_column=Column(Geography(geometry_type='POINT', srid=4326), nullable=False))
    timestamp: datetime = Field(
        default_factory=datetime.utcnow,
        sa_column=Column(TIMESTAMP(timezone=True), server_default=text("CURRENT_TIMESTAMP"), nullable=False)
    )

class SOSAlert(SQLModel, table=True):
    __tablename__ = "sos_alerts"

    sos_id: UUID = Field(default_factory=uuid4, primary_key=True)
    ride_id: UUID = Field(foreign_key="rides.ride_id")
    user_id: UUID = Field(foreign_key="users.user_id")
    location: Any = Field(sa_column=Column(Geography(geometry_type='POINT', srid=4326), nullable=False))
    is_resolved: bool = Field(default=False)
    created_at: datetime = Field(
        default_factory=datetime.utcnow,
        sa_column=Column(TIMESTAMP(timezone=True), server_default=text("CURRENT_TIMESTAMP"), nullable=False)
    )

class CreditLedger(SQLModel, table=True):
    __tablename__ = "credit_ledger"

    ledger_id: Optional[int] = Field(default=None, primary_key=True)
    ride_id: Optional[UUID] = Field(default=None, foreign_key="rides.ride_id")
    user_id: UUID = Field(foreign_key="users.user_id")
    amount: int = Field(description="Positive for credit in, negative for credit out")
    description: str = Field(max_length=255)
    created_at: datetime = Field(
        default_factory=datetime.utcnow,
        sa_column=Column(TIMESTAMP(timezone=True), server_default=text("CURRENT_TIMESTAMP"), nullable=False)
    )

    user: User = Relationship(back_populates="ledger_entries")
