import pytest
from uuid import uuid4
from unittest.mock import MagicMock
from app.models.models import User, UserRole

@pytest.mark.asyncio
async def test_create_user(client, mock_db):
    user_data = {
        "phone_number": "+9779812345678",
        "full_name": "John Doe"
    }
    
    response = await client.post("/api/v1/users/", json=user_data)
    assert response.status_code == 201
    data = response.json()
    assert data["phone_number"] == user_data["phone_number"]
    assert data["full_name"] == user_data["full_name"]
    assert "user_id" in data

@pytest.mark.asyncio
async def test_get_user(client, mock_db):
    user_id = str(uuid4())
    mock_user = User(
        user_id=user_id,
        phone_number="+9779812345678",
        full_name="John Doe",
        role=UserRole.passenger,
        is_banned=False
    )
    
    mock_db.get.return_value = mock_user
    
    response = await client.get(f"/api/v1/users/{user_id}")
    assert response.status_code == 200
    data = response.json()
    assert data["user_id"] == user_id
    assert data["phone_number"] == "+9779812345678"
