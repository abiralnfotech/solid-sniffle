from app.repositories.base import BaseRepository
from app.models.models import LocationUpdate, SOSAlert
from sqlmodel import select
from uuid import UUID
from typing import List, Optional

class LocationRepository(BaseRepository[LocationUpdate]):
    async def get_latest_for_ride(self, ride_id: UUID) -> Optional[LocationUpdate]:
        statement = select(LocationUpdate).where(LocationUpdate.ride_id == ride_id).order_by(LocationUpdate.timestamp.desc()).limit(1)
        results = await self.db.execute(statement)
        return results.scalars().first()

class SOSRepository(BaseRepository[SOSAlert]):
    async def get_active_alerts(self) -> List[SOSAlert]:
        statement = select(SOSAlert).where(SOSAlert.is_resolved == False)
        results = await self.db.execute(statement)
        return results.scalars().all()
