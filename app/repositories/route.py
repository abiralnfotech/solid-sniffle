from app.repositories.base import BaseRepository
from app.models.models import DriverRoute
from sqlmodel import select, func
from typing import List
from sqlalchemy import text

class RouteRepository(BaseRepository[DriverRoute]):
    async def search_routes(self, lon: float, lat: float, radius_meters: int = 5000) -> List[DriverRoute]:
        # Spatial query using PostGIS ST_DWithin
        # SQLModel / SQLAlchemy core syntax for Geography
        point = f"POINT({lon} {lat})"
        statement = select(DriverRoute).where(
            func.ST_DWithin(DriverRoute.start_location, func.ST_GeogFromText(point), radius_meters),
            DriverRoute.is_active == True
        )
        results = await self.db.execute(statement)
        return results.scalars().all()
