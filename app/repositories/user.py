from app.repositories.base import BaseRepository
from app.models.models import User
from sqlmodel import select
from typing import Optional

class UserRepository(BaseRepository[User]):
    async def get_by_phone(self, phone_number: str) -> Optional[User]:
        statement = select(User).where(User.phone_number == phone_number)
        results = await self.db.execute(statement)
        return results.scalars().first()
