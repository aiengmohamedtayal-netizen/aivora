from typing import Generator
from fastapi import Depends
from supabase import create_client, Client
from app.core.config import settings
from app.services.ai_service import AIService
from app.providers.provider_factory import ProviderFactory

# H-01: Global singleton to prevent connection pool exhaustion
_supabase_client: Client | None = None

def get_supabase_client() -> Client:
    """
    Dependency that returns a configured, singleton Supabase client.
    """
    global _supabase_client
    if _supabase_client is None:
        _supabase_client = create_client(settings.SUPABASE_URL, settings.SUPABASE_SERVICE_ROLE_KEY)
    return _supabase_client

# AI Service Dependency
def get_ai_service(supabase: Client = Depends(get_supabase_client)) -> AIService:
    """
    Dependency that returns a configured AI service.
    """
    # In a larger application, this might be cached or injected 
    # depending on the request lifecycle.
    return AIService(supabase=supabase)
