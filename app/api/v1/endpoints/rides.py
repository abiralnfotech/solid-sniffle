from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import get_db
from app.schemas.ride import RideCreate, RideRead
from app.repositories.ride import RideRepository
from app.repositories.route import RouteRepository
from app.repositories.credit import CreditRepository
from app.services.ride_service import RideService
from app.services.credit_service import CreditService
from app.models.models import Ride, DriverRoute, CreditLedger
from typing import List
from uuid import UUID

router = APIRouter()

async def get_ride_service(db: AsyncSession = Depends(get_db)) -> RideService:
    ride_repo = RideRepository(Ride, db)
    route_repo = RouteRepository(DriverRoute, db)
    credit_repo = CreditRepository(CreditLedger, db)
    credit_service = CreditService(credit_repo)
    return RideService(ride_repo, route_repo, credit_service)

@router.post("/", response_model=RideRead, status_code=status.HTTP_201_CREATED)
async def request_ride(
    ride_in: RideCreate,
    passenger_id: UUID, # Simplified: should come from auth
    service: RideService = Depends(get_ride_service)
):
    return await service.request_ride(passenger_id, ride_in.route_id, ride_in.seat_count)

@router.post("/{ride_id}/accept", response_model=RideRead)
async def accept_ride(
    ride_id: UUID,
    driver_id: UUID, # Simplified: should come from auth
    service: RideService = Depends(get_ride_service)
):
    return await service.accept_ride(ride_id, driver_id)

@router.post("/{ride_id}/start", response_model=RideRead)
async def start_ride(
    ride_id: UUID,
    driver_id: UUID, # Simplified: should come from auth
    service: RideService = Depends(get_ride_service)
):
    return await service.start_ride(ride_id, driver_id)

@router.post("/{ride_id}/end", response_model=RideRead)
async def end_ride(
    ride_id: UUID,
    driver_id: UUID, # Simplified: should come from auth
    service: RideService = Depends(get_ride_service)
):
    return await service.end_ride(ride_id, driver_id)

@router.post("/{ride_id}/confirm", response_model=RideRead)
async def confirm_arrival(
    ride_id: UUID,
    passenger_id: UUID, # Simplified: should come from auth
    service: RideService = Depends(get_ride_service)
):
    return await service.confirm_arrival(ride_id, passenger_id)

@router.get("/{ride_id}", response_model=RideRead)
async def get_ride(
    ride_id: UUID,
    service: RideService = Depends(get_ride_service)
):
    return await service.get_ride(ride_id)
