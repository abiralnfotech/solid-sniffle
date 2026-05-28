from app.repositories.credit import CreditRepository
from app.models.models import CreditLedger
from uuid import UUID
from typing import List

class CreditService:
    def __init__(self, credit_repo: CreditRepository):
        self.credit_repo = credit_repo

    async def get_balance(self, user_id: UUID) -> int:
        return await self.credit_repo.get_balance(user_id)

    async def grant_genesis_credits(self, user_id: UUID, amount: int = 100):
        ledger = CreditLedger(
            user_id=user_id,
            amount=amount,
            description="Genesis Credits"
        )
        await self.credit_repo.create(ledger)

    async def add_transaction(self, user_id: UUID, amount: int, description: str, ride_id: UUID = None):
        ledger = CreditLedger(
            user_id=user_id,
            amount=amount,
            description=description,
            ride_id=ride_id
        )
        await self.credit_repo.create(ledger)

    async def get_history(self, user_id: UUID) -> List[CreditLedger]:
        return await self.credit_repo.get_history(user_id)
