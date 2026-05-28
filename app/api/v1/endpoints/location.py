from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import get_db
from app.schemas.location import LocationUpdateCreate, LocationUpdateRead, SOSAlertCreate, SOSAlertRead
from app.repositories.location import LocationRepository, SOSRepository
from app.services.location_service import LocationService
from app.models.models import LocationUpdate, SOSAlert
from typing import List
from uuid import UUID

router = APIRouter()

async def get_location_service(db: AsyncSession = Depends(get_db)) -> LocationService:
    location_repo = LocationRepository(LocationUpdate, db)
    sos_repo = SOSRepository(SOSAlert, db)
    return LocationService(location_repo, sos_repo)

@router.post("/update", response_model=LocationUpdateRead, status_code=status.HTTP_201_CREATED)
async def update_location(
    update_in: LocationUpdateCreate,
    driver_id: UUID, # Simplified: should come from auth
    service: LocationService = Depends(get_location_service)
):
    lon, lat = update_in.location
    update = LocationUpdate(
        ride_id=update_in.ride_id,
        driver_id=driver_id,
        location=f"POINT({lon} {lat})"
    )
    return await service.update_location(update)

@router.get("/{ride_id}/latest", response_model=LocationUpdateRead)
async def get_latest_location(
    ride_id: UUID,
    service: LocationService = Depends(get_location_service)
):
    return await service.get_latest_location(ride_id)

@router.post("/sos", response_model=SOSAlertRead, status_code=status.HTTP_201_CREATED)
async def trigger_sos(
    sos_in: SOSAlertCreate,
    user_id: UUID, # Simplified: should come from auth
    service: LocationService = Depends(get_location_service)
):
    lon, lat = sos_in.location
    sos = SOSAlert(
        ride_id=sos_in.ride_id,
        user_id=user_id,
        location=f"POINT({lon} {lat})"
    )
    return await service.trigger_sos(sos)
