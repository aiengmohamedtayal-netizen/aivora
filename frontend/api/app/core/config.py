from typing import List, Union

from pydantic import AnyHttpUrl
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env", env_ignore_empty=True, extra="ignore"
    )

    PROJECT_NAME: str = "Aivora Platform API"
    VERSION: str = "0.1.0"
    API_V1_STR: str = "/api/v1"

    # CORS settings
    BACKEND_CORS_ORIGINS: List[Union[AnyHttpUrl, str]] = ["http://localhost:3000"]

    # Supabase Auth
    SUPABASE_URL: str = ""
    SUPABASE_SERVICE_ROLE_KEY: str = ""

    # OpenAI Integration
    OPENAI_API_KEY: str = ""
    OPENAI_DEFAULT_MODEL: str = "gpt-4o-mini"

    # Rate Limiting & Redis
    REDIS_URL: str = "redis://localhost:6379"

settings = Settings()
