from pydantic import BaseModel
from typing import Optional
from uuid import UUID
from datetime import datetime

class CreditLedgerRead(BaseModel):
    ledger_id: int
    ride_id: Optional[UUID]
    user_id: UUID
    amount: int
    description: str
    created_at: datetime

    class Config:
        from_attributes = True

class CreditBalance(BaseModel):
    user_id: UUID
    balance: int
