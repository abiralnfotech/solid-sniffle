from app.repositories.base import BaseRepository
from app.models.models import Ride, DriverRoute, RideStatus
from sqlmodel import select, text
from typing import List
from uuid import UUID

class RideRepository(BaseRepository[Ride]):
    async def get_by_user(self, user_id: UUID) -> List[Ride]:
        statement = select(Ride).where((Ride.passenger_id == user_id))
        results = await self.db.execute(statement)
        return results.scalars().all()

    async def get_active_rides_for_driver(self, driver_id: UUID) -> List[Ride]:
        statement = select(Ride).join(DriverRoute).where(
            DriverRoute.driver_id == driver_id,
            Ride.status == RideStatus.active
        )
        results = await self.db.execute(statement)
        return results.scalars().all()

    async def search_available_rides(self, pickup_lat: float, pickup_lng: float, dropoff_lat: float, dropoff_lng: float) -> List[dict]:
        # This is a complex spatial query.
        statement = text("""
            SELECT
                dr.route_id as ride_id,
                u.full_name as driver_name,
                dr.available_seats,
                dr.departure_time,
                ST_Distance(dr.start_location, ST_MakePoint(:p_lng, :p_lat)::geography) / 1000 as pickup_distance
            FROM driver_routes dr
            JOIN users u ON dr.driver_id = u.user_id
            WHERE dr.is_active = TRUE
            AND dr.available_seats > 0
            AND ST_DWithin(dr.start_location, ST_MakePoint(:p_lng, :p_lat)::geography, 5000)
            ORDER BY pickup_distance ASC
            LIMIT 10
        """)
        results = await self.db.execute(statement, {"p_lat": pickup_lat, "p_lng": pickup_lng})
        return results.mappings().all()

    async def get_requests_for_ride(self, ride_id: UUID) -> List[Ride]:
        statement = select(Ride).where(Ride.route_id == ride_id, Ride.status == RideStatus.requested)
        results = await self.db.execute(statement)
        return results.scalars().all()
