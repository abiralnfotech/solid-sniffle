from fastapi import APIRouter
from app.api.v1.endpoints import users, kyc, routes, rides, credits, feedback, location, auth

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(kyc.router, prefix="/kyc", tags=["kyc"])
api_router.include_router(routes.router, prefix="/routes", tags=["routes"])
api_router.include_router(rides.router, prefix="/rides", tags=["rides"])
api_router.include_router(credits.router, prefix="/credits", tags=["credits"])
api_router.include_router(feedback.router, prefix="/feedback", tags=["feedback"])
api_router.include_router(location.router, prefix="/location", tags=["location"])
