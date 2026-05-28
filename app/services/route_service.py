from app.repositories.route import RouteRepository
from app.models.models import DriverRoute
from uuid import UUID
from typing import List

class RouteService:
    def __init__(self, route_repo: RouteRepository):
        self.route_repo = route_repo

    async def create_route(self, route_in: DriverRoute) -> DriverRoute:
        return await self.route_repo.create(route_in)

    async def search_routes(self, lon: float, lat: float, radius: int = 5000) -> List[DriverRoute]:
        return await self.route_repo.search_routes(lon, lat, radius)

    async def get_route(self, route_id: UUID) -> DriverRoute:
        return await self.route_repo.get(route_id)
