import pytest
from uuid import uuid4
from datetime import datetime
from app.models.models import CreditLedger

@pytest.mark.asyncio
async def test_get_balance(client, mock_db):
    user_id = uuid4()
    
    mock_execute_result = MagicMock()
    # CreditRepository.get_balance calls results.scalar()
    mock_execute_result.scalar.return_value = 100
    mock_db.execute.return_value = mock_execute_result
    
    response = await client.get(f"/api/v1/credits/balance?user_id={user_id}")
    assert response.status_code == 200
    data = response.json()
    assert data["balance"] == 100

@pytest.mark.asyncio
async def test_get_history(client, mock_db):
    user_id = uuid4()
    
    mock_history_item = CreditLedger(
        ledger_id=1,
        user_id=user_id,
        amount=50,
        description="Test transaction",
        created_at=datetime.utcnow()
    )
    
    mock_execute_result = MagicMock()
    mock_execute_result.scalars.return_value.all.return_value = [mock_history_item]
    mock_db.execute.return_value = mock_execute_result
    
    response = await client.get(f"/api/v1/credits/history?user_id={user_id}")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 1
    assert data[0]["amount"] == 50
from unittest.mock import MagicMock
