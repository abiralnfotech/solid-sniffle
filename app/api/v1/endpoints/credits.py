from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import get_db
from app.schemas.credit import CreditLedgerRead, CreditBalance
from app.repositories.credit import CreditRepository
from app.services.credit_service import CreditService
from app.models.models import CreditLedger
from typing import List
from uuid import UUID

router = APIRouter()

async def get_credit_service(db: AsyncSession = Depends(get_db)) -> CreditService:
    repo = CreditRepository(CreditLedger, db)
    return CreditService(repo)

@router.get("/balance", response_model=CreditBalance)
async def get_balance(
    user_id: UUID, # Simplified: should come from auth
    service: CreditService = Depends(get_credit_service)
):
    balance = await service.get_balance(user_id)
    return CreditBalance(user_id=user_id, balance=balance)

@router.get("/history", response_model=List[CreditLedgerRead])
async def get_history(
    user_id: UUID, # Simplified: should come from auth
    service: CreditService = Depends(get_credit_service)
):
    return await service.get_history(user_id)
