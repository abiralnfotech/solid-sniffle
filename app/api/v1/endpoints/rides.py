from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import get_db
from app.schemas.ride import RideCreate, RideRead, RideSearchResult, RideRequestCreate, RideRequestResponse, PassengerRequest, RideRequestUpdate, RideCreateRequest
from app.repositories.ride import RideRepository
from app.repositories.route import RouteRepository
from app.repositories.credit import CreditRepository
from app.services.ride_service import RideService
from app.services.credit_service import CreditService
from app.models.models import Ride, DriverRoute, CreditLedger, User
from app.api.v1.deps import get_current_user
from typing import List
from uuid import UUID, uuid4
from datetime import datetime, timedelta, timezone

router = APIRouter()

async def get_ride_service(db: AsyncSession = Depends(get_db)) -> RideService:
    ride_repo = RideRepository(Ride, db)
    route_repo = RouteRepository(DriverRoute, db)
    credit_repo = CreditRepository(CreditLedger, db)
    credit_service = CreditService(credit_repo)
    return RideService(ride_repo, route_repo, credit_service)

@router.get("/search", response_model=List[RideSearchResult])
async def search_rides(
    pickup_lat: float,
    pickup_lng: float,
    dropoff_lat: float,
    dropoff_lng: float,
    service: RideService = Depends(get_ride_service)
):
    """
    Search for available rides based on location and destination.
    """
    results = await service.ride_repo.search_available_rides(pickup_lat, pickup_lng, dropoff_lat, dropoff_lng)

    ride_results = []
    for r in results:
        ride_results.append(RideSearchResult(
            ride_id=r["ride_id"],
            driver_name=r["driver_name"],
            driver_rating=4.8,
            vehicle_info="Suzuki Gixxer • Blue",
            available_seats=r["available_seats"],
            goodwill_cost=45,
            departure_time=r["departure_time"],
            pickup_distance=round(r["pickup_distance"], 2)
        ))

    # Fallback to mock if empty for demo purposes
    if not ride_results:
        ride_results.append(RideSearchResult(
            ride_id=uuid4(),
            driver_name="Binod Thapa",
            driver_rating=4.8,
            vehicle_info="Suzuki Gixxer • Blue",
            available_seats=1,
            goodwill_cost=45,
            departure_time=datetime.now(timezone.utc) + timedelta(minutes=10),
            pickup_distance=0.5
        ))
    return ride_results

@router.post("/create", response_model=RideRead, status_code=status.HTTP_201_CREATED)
async def create_ride_offer(
    ride_in: RideCreateRequest,
    current_user: User = Depends(get_current_user),
    service: RideService = Depends(get_ride_service)
):
    """
    Create a new ride offering (Driver Mode).
    """
    route = DriverRoute(
        driver_id=current_user.user_id,
        start_location=f"POINT({ride_in.origin_lng} {ride_in.origin_lat})",
        destination_location=f"POINT({ride_in.destination_lng} {ride_in.destination_lat})",
        departure_time=ride_in.departure_time,
        available_seats=ride_in.total_seats
    )
    db_route = await service.route_repo.create(route)

    return RideRead(
        ride_id=uuid4(),
        route_id=db_route.route_id,
        passenger_id=current_user.user_id,
        status="active",
        fixed_fare_credits=50,
        created_at=datetime.now(timezone.utc),
        updated_at=datetime.now(timezone.utc)
    )

@router.post("/{ride_id}/request", response_model=RideRequestResponse, status_code=status.HTTP_201_CREATED)
async def request_seat(
    ride_id: UUID,
    request_in: RideRequestCreate,
    current_user: User = Depends(get_current_user),
    service: RideService = Depends(get_ride_service)
):
    """
    Request a seat in a specific ride.
    """
    # For now, we assume ride_id in request matches route_id in model or something similar
    ride = await service.request_ride(current_user.user_id, ride_id, request_in.seats)
    return RideRequestResponse(request_id=ride.ride_id)

@router.get("/{ride_id}/requests", response_model=List[PassengerRequest])
async def get_ride_requests(
    ride_id: UUID,
    service: RideService = Depends(get_ride_service)
):
    """
    Get list of passenger requests for a specific ride.
    """
    requests = await service.ride_repo.get_requests_for_ride(ride_id)
    passenger_requests = []
    for r in requests:
        passenger_requests.append(PassengerRequest(
            request_id=r.ride_id,
            passenger_name="Aayush Shrestha",
            passenger_rating=4.5,
            mutual_friends=4,
            seats_requested=r.seat_count,
            pickup_location="Thapathali Gate",
            status=r.status.value
        ))

    # Fallback to mock if empty
    if not passenger_requests:
        passenger_requests.append(PassengerRequest(
            request_id=uuid4(),
            passenger_name="Aayush Shrestha",
            passenger_rating=4.5,
            mutual_friends=4,
            seats_requested=1,
            pickup_location="Thapathali Gate",
            status="pending"
        ))
    return passenger_requests

@router.get("/{ride_id}", response_model=RideRead)
async def get_ride_details(
    ride_id: UUID,
    service: RideService = Depends(get_ride_service)
):
    """
    Get complete details of an active ride.
    """
    ride = await service.ride_repo.get(ride_id)
    if not ride:
        # Mock for now if not found
        from datetime import datetime, timezone
        return RideRead(
            ride_id=ride_id,
            route_id=uuid.uuid4(),
            passenger_id=uuid.uuid4(),
            status="active",
            fixed_fare_credits=50,
            created_at=datetime.now(timezone.utc),
            updated_at=datetime.now(timezone.utc)
        )
    return ride

@router.post("/{ride_id}/feedback", status_code=status.HTTP_200_OK)
async def submit_ride_feedback(
    ride_id: UUID,
    feedback_in: dict, # rating, comment
    current_user: User = Depends(get_current_user),
    service: RideService = Depends(get_ride_service)
):
    """
    Submit feedback and rating after a ride.
    """
    # In a real app, call feedback service
    return {"status": "ok"}

@router.patch("/ride-requests/{request_id}", response_model=RideRead)
async def update_ride_request(
    request_id: UUID,
    update_in: RideRequestUpdate,
    current_user: User = Depends(get_current_user),
    service: RideService = Depends(get_ride_service)
):
    """
    Accept or decline a ride request.
    """
    # Mapping "accepted"/"declined" to our internal status if necessary
    if update_in.status == "accepted":
        return await service.accept_ride(request_id, current_user.user_id)
    else:
        # Handle decline
        ride = await service.ride_repo.get(request_id)
        if ride:
            return await service.ride_repo.update(ride, {"status": "cancelled"})
        return None # Should probably raise 404

@router.post("/{ride_id}/accept", response_model=RideRead)
async def accept_ride(
    ride_id: UUID,
    current_user: User = Depends(get_current_user),
    service: RideService = Depends(get_ride_service)
):
    return await service.accept_ride(ride_id, current_user.user_id)

@router.post("/{ride_id}/start", response_model=RideRead)
async def start_ride(
    ride_id: UUID,
    current_user: User = Depends(get_current_user),
    service: RideService = Depends(get_ride_service)
):
    return await service.start_ride(ride_id, current_user.user_id)

@router.post("/{ride_id}/end", response_model=RideRead)
async def end_ride(
    ride_id: UUID,
    current_user: User = Depends(get_current_user),
    service: RideService = Depends(get_ride_service)
):
    return await service.end_ride(ride_id, current_user.user_id)

@router.post("/{ride_id}/confirm", response_model=RideRead)
async def confirm_arrival(
    ride_id: UUID,
    current_user: User = Depends(get_current_user),
    service: RideService = Depends(get_ride_service)
):
    return await service.confirm_arrival(ride_id, current_user.user_id)
