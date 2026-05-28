from app.repositories.base import BaseRepository
from app.models.models import DriverLocationStream, EmergencySOSAlert
from sqlmodel import select
from uuid import UUID
from typing import List, Optional

class LocationRepository(BaseRepository[DriverLocationStream]):
    async def get_latest_for_ride(self, ride_id: UUID) -> Optional[DriverLocationStream]:
        statement = select(DriverLocationStream).where(DriverLocationStream.ride_id == ride_id).order_by(DriverLocationStream.captured_at.desc()).limit(1)
        results = await self.db.execute(statement)
        return results.scalars().first()

class SOSRepository(BaseRepository[EmergencySOSAlert]):
    async def get_active_alerts(self) -> List[EmergencySOSAlert]:
        statement = select(EmergencySOSAlert).where(EmergencySOSAlert.is_resolved == False)
        results = await self.db.execute(statement)
        return results.scalars().all()
