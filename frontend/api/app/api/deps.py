from typing import Generator
from fastapi import Depends
from supabase import create_client, Client
from app.core.config import settings
from app.services.ai_service import AIService
from app.providers.provider_factory import ProviderFactory

# Supabase Client Dependency
def get_supabase_client() -> Client:
    """
    Dependency that returns a configured Supabase client.
    """
    return create_client(settings.SUPABASE_URL, settings.SUPABASE_SERVICE_ROLE_KEY)

# AI Service Dependency
def get_ai_service(supabase: Client = Depends(get_supabase_client)) -> AIService:
    """
    Dependency that returns a configured AI service.
    """
    # In a larger application, this might be cached or injected 
    # depending on the request lifecycle.
    return AIService(supabase=supabase)
