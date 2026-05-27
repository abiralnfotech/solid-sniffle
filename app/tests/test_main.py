import pytest
from httpx import AsyncClient
from app.main import app

from httpx import ASGITransport

@pytest.mark.asyncio
async def test_health_check():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        response = await ac.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}

@pytest.mark.asyncio
async def test_user_schema_validation():
    from app.schemas.user import UserCreate
    from pydantic import ValidationError

    # Valid phone
    user = UserCreate(phone_number="+9779812345678", full_name="John Doe")
    assert user.phone_number == "+9779812345678"

    # Invalid phone
    with pytest.raises(ValidationError):
        UserCreate(phone_number="12345", full_name="John Doe")
