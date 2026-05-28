import pytest
from uuid import uuid4
from app.models.models import KYCVerification, VerificationStatus

@pytest.mark.asyncio
async def test_submit_kyc(client, mock_db):
    user_id = str(uuid4())
    kyc_data = {
        "document_type": "nagarikta",
        "document_number": "123-456",
        "identity_front_url": "http://example.com/front.jpg",
        "identity_back_url": "http://example.com/back.jpg"
    }
    
    response = await client.post(f"/api/v1/kyc/?user_id={user_id}", json=kyc_data)
    assert response.status_code == 201
    data = response.json()
    assert data["document_number"] == kyc_data["document_number"]
    assert data["status"] == "pending"

@pytest.mark.asyncio
async def test_review_kyc(client, mock_db):
    kyc_id = str(uuid4())
    reviewer_id = str(uuid4())
    review_data = {
        "status": "approved"
    }
    
    mock_kyc = KYCVerification(
        kyc_id=kyc_id,
        user_id=uuid4(),
        document_type="nagarikta",
        document_number="123-456",
        identity_front_url="http://example.com/front.jpg",
        identity_back_url="http://example.com/back.jpg",
        status=VerificationStatus.pending
    )
    mock_db.get.return_value = mock_kyc
    
    response = await client.post(
        f"/api/v1/kyc/{kyc_id}/review?reviewer_id={reviewer_id}", 
        json=review_data
    )
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "approved"
