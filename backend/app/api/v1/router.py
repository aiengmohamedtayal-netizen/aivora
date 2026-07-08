from fastapi import APIRouter

from app.api.v1.endpoints import ai, leads

api_router = APIRouter()

api_router.include_router(ai.router, prefix="/ai", tags=["AI Sandbox"])
api_router.include_router(leads.router, prefix="/leads", tags=["Leads"])
