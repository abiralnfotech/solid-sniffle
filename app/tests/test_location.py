import pytest
from uuid import uuid4
from datetime import datetime, timezone
from unittest.mock import MagicMock, AsyncMock
from app.models.models import DriverLocationStream, EmergencySOSAlert

@pytest.mark.asyncio
async def test_update_location(client, mock_db):
    driver_id = uuid4()
    ride_id = uuid4()
    location_data = {
        "ride_id": str(ride_id),
        "location": [85.3240, 27.7172]
    }

    # Mock the database response for LocationRepository.create
    # The repository calls db.add(obj_in), db.commit(), db.refresh(obj_in)
    # Since we're using SQLModel, the object we return from the mock should have the expected fields.
    def mock_create(obj):
        obj.stream_id = 1
        obj.captured_at = datetime.now(timezone.utc)
        return obj
    
    mock_db.commit = AsyncMock()
    mock_db.refresh = AsyncMock(side_effect=mock_create)

    response = await client.post(f"/api/v1/location/update?driver_id={driver_id}", json=location_data)
    assert response.status_code == 201
    data = response.json()
    assert data["ride_id"] == str(ride_id)
    assert data["stream_id"] == 1

@pytest.mark.asyncio
async def test_get_latest_location(client, mock_db):
    ride_id = uuid4()
    
    mock_location = MagicMock()
    mock_location.ride_id = ride_id
    mock_location.driver_id = uuid4()
    mock_location.current_gps_coordinate = "POINT(85.3240 27.7172)"
    mock_location.captured_at = datetime.now(timezone.utc)
    
    mock_execute_result = MagicMock()
    mock_execute_result.scalars.return_value.first.return_value = mock_location
    mock_db.execute.return_value = mock_execute_result
    
    response = await client.get(f"/api/v1/location/{ride_id}/latest")
    assert response.status_code == 200
    data = response.json()
    assert data["ride_id"] == str(ride_id)

@pytest.mark.asyncio
async def test_trigger_sos(client, mock_db):
    user_id = uuid4()
    ride_id = uuid4()
    sos_data = {
        "ride_id": str(ride_id),
        "location": [85.3240, 27.7172]
    }

    def mock_create_sos(obj):
        obj.sos_id = uuid4()
        obj.is_resolved = False
        obj.created_at = datetime.now(timezone.utc)
        return obj

    mock_db.commit = AsyncMock()
    mock_db.refresh = AsyncMock(side_effect=mock_create_sos)
    
    response = await client.post(f"/api/v1/location/sos?user_id={user_id}", json=sos_data)
    assert response.status_code == 201
    data = response.json()
    assert data["ride_id"] == str(ride_id)
    assert data["user_id"] == str(user_id)
