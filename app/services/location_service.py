from app.repositories.location import LocationRepository, SOSRepository
from app.models.models import LocationUpdate, SOSAlert
from uuid import UUID

class LocationService:
    def __init__(self, location_repo: LocationRepository, sos_repo: SOSRepository):
        self.location_repo = location_repo
        self.sos_repo = sos_repo

    async def update_location(self, update_in: LocationUpdate) -> LocationUpdate:
        return await self.location_repo.create(update_in)

    async def get_latest_location(self, ride_id: UUID) -> LocationUpdate:
        return await self.location_repo.get_latest_for_ride(ride_id)

    async def trigger_sos(self, sos_in: SOSAlert) -> SOSAlert:
        return await self.sos_repo.create(sos_in)
