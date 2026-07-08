import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded

from app.api.v1.router import api_router
from app.core.config import settings

log = logging.getLogger(__name__)

@asynccontextmanager
async def lifespan(app: FastAPI):
    log.info("Starting Aivora Backend Microservice...")
    yield
    log.info("Shutting down Aivora Backend Microservice...")

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Aivora Platform FastAPI AI Microservice",
    lifespan=lifespan,
    docs_url="/docs",
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
)

# Security: CORS Middleware
if settings.BACKEND_CORS_ORIGINS:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[str(origin) for origin in settings.BACKEND_CORS_ORIGINS],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

# Exception Handlers
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# Routers
app.include_router(api_router, prefix=settings.API_V1_STR)

@app.get("/health", tags=["Health"])
async def health_check() -> dict[str, str]:
    return {"status": "healthy"}
