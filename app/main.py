from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.core.exceptions import AppException, app_exception_handler, general_exception_handler
from app.core.middleware import LoggingMiddleware
from app.api.v1.api import api_router

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
)

# Set all CORS enabled origins
if settings.CORS_ORIGINS:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[str(origin) for origin in settings.CORS_ORIGINS],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

app.add_middleware(LoggingMiddleware)

# Exception handlers
app.add_exception_handler(AppException, app_exception_handler)
app.add_exception_handler(Exception, general_exception_handler)

# Health check
@app.get("/health", tags=["health"])
async def health_check():
    return {"status": "ok"}

# API routes
app.include_router(api_router, prefix=settings.API_V1_STR)
