import pytest
import pytest_asyncio
from httpx import AsyncClient, ASGITransport
from unittest.mock import AsyncMock, MagicMock
from app.main import app
from app.db.session import get_db
from uuid import uuid4
from datetime import datetime

@pytest_asyncio.fixture
async def mock_db():
    mock = MagicMock()
    
    # Mock for UserRepository.get_by_phone (select(User).where(...))
    mock_execute_result = MagicMock()
    mock_execute_result.scalars.return_value.first.return_value = None
    mock_execute_result.scalars.return_value.all.return_value = []
    mock.execute = AsyncMock(return_value=mock_execute_result)
    
    mock.get = AsyncMock()
    mock.add = MagicMock()
    mock.commit = AsyncMock()
    mock.refresh = AsyncMock()
    mock.delete = AsyncMock()
    return mock

@pytest_asyncio.fixture(autouse=True)
async def override_get_db(mock_db):
    async def _get_db_override():
        yield mock_db
    
    app.dependency_overrides[get_db] = _get_db_override
    yield
    app.dependency_overrides.clear()

@pytest_asyncio.fixture
async def client():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        yield ac
