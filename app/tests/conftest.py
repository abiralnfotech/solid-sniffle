import pytest
import pytest_asyncio
from httpx import AsyncClient, ASGITransport
from unittest.mock import AsyncMock, MagicMock
from app.main import app
from app.db.session import get_db
from app.api.v1.deps import get_current_user
from app.models.models import User, UserRole
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
async def override_dependencies(mock_db):
    async def _get_db_override():
        yield mock_db
    
    mock_user = User(
        user_id=uuid4(),
        phone_number="+9779812345678",
        full_name="Test User",
        role=UserRole.passenger,
        is_banned=False
    )

    app.dependency_overrides[get_db] = _get_db_override
    app.dependency_overrides[get_current_user] = lambda: mock_user
    # Ensure OAuth2 scheme doesn't block
    from app.api.v1.deps import oauth2_scheme
    app.dependency_overrides[oauth2_scheme] = lambda: "mock_token"


    yield
    app.dependency_overrides.clear()

@pytest_asyncio.fixture
async def client():
    headers = {"Authorization": "Bearer mock_token"}
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test", headers=headers) as ac:
        yield ac
