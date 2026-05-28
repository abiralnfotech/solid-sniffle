from app.repositories.base import BaseRepository
from app.models.models import CreditLedger
from sqlmodel import select, func
from uuid import UUID
from typing import List

class CreditRepository(BaseRepository[CreditLedger]):
    async def get_balance(self, user_id: UUID) -> int:
        statement = select(func.sum(CreditLedger.amount)).where(CreditLedger.user_id == user_id)
        results = await self.db.execute(statement)
        balance = results.scalar()
        return balance if balance is not None else 0

    async def get_history(self, user_id: UUID) -> List[CreditLedger]:
        statement = select(CreditLedger).where(CreditLedger.user_id == user_id).order_by(CreditLedger.created_at.desc())
        results = await self.db.execute(statement)
        return results.scalars().all()
