import pytest
from uuid import uuid4
from datetime import datetime, timezone
from unittest.mock import MagicMock
from app.models.models import DriverRoute

@pytest.mark.asyncio
async def test_create_route(client, mock_db):
    driver_id = str(uuid4())
    route_data = {
        "start_location": [85.3240, 27.7172],
        "destination_location": [85.3333, 27.7000],
        "departure_time": datetime.now(timezone.utc).isoformat(),
        "available_seats": 3
    }
    
    response = await client.post(f"/api/v1/routes/?driver_id={driver_id}", json=route_data)
    assert response.status_code == 201
    data = response.json()
    assert data["available_seats"] == 3
    assert "route_id" in data

@pytest.mark.asyncio
async def test_search_routes(client, mock_db):
    # Mock search results
    mock_route = MagicMock()
    mock_route.route_id = uuid4()
    mock_route.driver_id = uuid4()
    mock_route.start_location = "POINT(85.3240 27.7172)"
    mock_route.destination_location = "POINT(85.3333 27.7000)"
    mock_route.departure_time = datetime.now(timezone.utc)
    mock_route.available_seats = 3
    mock_route.is_active = True
    
    mock_execute_result = MagicMock()
    mock_execute_result.scalars.return_value.all.return_value = [mock_route]
    mock_db.execute.return_value = mock_execute_result
    
    response = await client.get("/api/v1/routes/search?lon=85.3240&lat=27.7172")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 1
    assert data[0]["available_seats"] == 3
