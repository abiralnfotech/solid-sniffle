from app.repositories.base import BaseRepository
from app.models.models import Ride, RideStatus
from sqlmodel import select
from typing import List
from uuid import UUID

class RideRepository(BaseRepository[Ride]):
    async def get_by_user(self, user_id: UUID) -> List[Ride]:
        statement = select(Ride).where((Ride.passenger_id == user_id))
        results = await self.db.execute(statement)
        return results.scalars().all()

    async def get_active_rides_for_driver(self, driver_id: UUID) -> List[Ride]:
        # Need to join with DriverRoute
        from app.models.models import DriverRoute
        statement = select(Ride).join(DriverRoute).where(
            DriverRoute.driver_id == driver_id,
            Ride.status == RideStatus.active
        )
        results = await self.db.execute(statement)
        return results.scalars().all()
