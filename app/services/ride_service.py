from app.repositories.ride import RideRepository
from app.repositories.route import RouteRepository
from app.services.credit_service import CreditService
from app.models.models import Ride, RideStatus, DriverRoute
from app.core.exceptions import AppException
from fastapi import status
from uuid import UUID
from datetime import datetime

class RideService:
    def __init__(self, ride_repo: RideRepository, route_repo: RouteRepository, credit_service: CreditService):
        self.ride_repo = ride_repo
        self.route_repo = route_repo
        self.credit_service = credit_service

    async def request_ride(self, passenger_id: UUID, route_id: UUID, seat_count: int) -> Ride:
        route = await self.route_repo.get(route_id)
        if not route or not route.is_active:
            raise AppException("Route not found or inactive", status_code=status.HTTP_404_NOT_FOUND)

        if route.available_seats < seat_count:
            raise AppException("Not enough seats available", status_code=status.HTTP_400_BAD_REQUEST)

        # Calculate fixed fare (e.g., 1 credit per 3km - simplified here as a constant for now)
        # In a real app, we'd use ST_Distance between route start and destination
        fixed_fare = 10 * seat_count

        balance = await self.credit_service.get_balance(passenger_id)
        if balance < fixed_fare:
            raise AppException("Insufficient credits", status_code=status.HTTP_400_BAD_REQUEST)

        ride = Ride(
            route_id=route_id,
            passenger_id=passenger_id,
            fixed_fare_credits=fixed_fare,
            seat_count=seat_count,
            status=RideStatus.requested
        )
        ride = await self.ride_repo.create(ride)

        # Escrow: Debit credits from passenger
        await self.credit_service.add_transaction(
            passenger_id, -fixed_fare, f"Escrow for ride {ride.ride_id}", ride_id=ride.ride_id
        )

        return ride

    async def accept_ride(self, ride_id: UUID, driver_id: UUID) -> Ride:
        ride = await self.ride_repo.get(ride_id)
        if not ride:
            raise AppException("Ride not found", status_code=status.HTTP_404_NOT_FOUND)

        route = await self.route_repo.get(ride.route_id)
        if route.driver_id != driver_id:
            raise AppException("Unauthorized", status_code=status.HTTP_401_UNAUTHORIZED)

        if ride.status != RideStatus.requested:
            raise AppException("Ride already handled", status_code=status.HTTP_400_BAD_REQUEST)

        ride.status = RideStatus.accepted
        return await self.ride_repo.update(ride, {"status": RideStatus.accepted})

    async def start_ride(self, ride_id: UUID, driver_id: UUID) -> Ride:
        ride = await self.ride_repo.get(ride_id)
        if not ride:
            raise AppException("Ride not found", status_code=status.HTTP_404_NOT_FOUND)

        route = await self.route_repo.get(ride.route_id)
        if not route:
            raise AppException("Route not found", status_code=status.HTTP_404_NOT_FOUND)

        if route.driver_id != driver_id:
            raise AppException("Unauthorized", status_code=status.HTTP_401_UNAUTHORIZED)

        return await self.ride_repo.update(ride, {"status": RideStatus.active, "started_at": datetime.utcnow()})

    async def end_ride(self, ride_id: UUID, driver_id: UUID) -> Ride:
        ride = await self.ride_repo.get(ride_id)
        if not ride:
            raise AppException("Ride not found", status_code=status.HTTP_404_NOT_FOUND)

        route = await self.route_repo.get(ride.route_id)
        if not route:
            raise AppException("Route not found", status_code=status.HTTP_404_NOT_FOUND)

        if route.driver_id != driver_id:
            raise AppException("Unauthorized", status_code=status.HTTP_401_UNAUTHORIZED)

        return await self.ride_repo.update(ride, {"status": RideStatus.awaiting_confirmation, "ended_at": datetime.utcnow()})

    async def confirm_arrival(self, ride_id: UUID, passenger_id: UUID) -> Ride:
        ride = await self.ride_repo.get(ride_id)
        if not ride:
            raise AppException("Ride not found", status_code=status.HTTP_404_NOT_FOUND)

        if ride.passenger_id != passenger_id:
            raise AppException("Unauthorized", status_code=status.HTTP_401_UNAUTHORIZED)

        if ride.status != RideStatus.awaiting_confirmation:
            raise AppException("Ride not in awaiting confirmation state", status_code=status.HTTP_400_BAD_REQUEST)

        ride = await self.ride_repo.update(ride, {"status": RideStatus.completed})

        # Settle: Credit the driver
        route = await self.route_repo.get(ride.route_id)
        if route:
            await self.credit_service.add_transaction(
                route.driver_id, ride.fixed_fare_credits, f"Payment for ride {ride.ride_id}", ride_id=ride.ride_id
            )

        return ride
