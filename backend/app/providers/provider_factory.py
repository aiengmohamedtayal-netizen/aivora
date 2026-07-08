from .base import AIProvider
from .openai_provider import OpenAIProvider

class ProviderFactory:
    @staticmethod
    def get_provider(provider_name: str = "openai") -> AIProvider:
        """
        Factory method to return the configured AI provider.
        """
        if provider_name.lower() == "openai":
            return OpenAIProvider()
        # Future providers (e.g., anthropic, gemini, openrouter) can be instantiated here.
        raise ValueError(f"Unknown provider: {provider_name}")
