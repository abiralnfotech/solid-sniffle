from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import get_db
from app.schemas.route import RouteCreate, RouteRead
from app.repositories.route import RouteRepository
from app.services.route_service import RouteService
from app.models.models import DriverRoute
from typing import List
from uuid import UUID

router = APIRouter()

async def get_route_service(db: AsyncSession = Depends(get_db)) -> RouteService:
    repo = RouteRepository(DriverRoute, db)
    return RouteService(repo)

@router.post("/", response_model=RouteRead, status_code=status.HTTP_201_CREATED)
async def create_route(
    route_in: RouteCreate,
    driver_id: UUID, # Simplified: should come from auth
    service: RouteService = Depends(get_route_service)
):
    # Convert Tuple to PostGIS Point
    lon, lat = route_in.start_location
    d_lon, d_lat = route_in.destination_location

    route = DriverRoute(
        driver_id=driver_id,
        start_location=f"POINT({lon} {lat})",
        destination_location=f"POINT({d_lon} {d_lat})",
        departure_time=route_in.departure_time,
        available_seats=route_in.available_seats
    )
    return await service.create_route(route)

@router.get("/search", response_model=List[RouteRead])
async def search_routes(
    lon: float,
    lat: float,
    radius: int = 5000,
    service: RouteService = Depends(get_route_service)
):
    return await service.search_routes(lon, lat, radius)
