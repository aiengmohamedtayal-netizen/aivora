from typing import AsyncGenerator
from app.providers.provider_factory import ProviderFactory
from app.core.prompts import PromptComposer

class AIService:
    def __init__(self, provider_name: str = "openai"):
        self.provider = ProviderFactory.get_provider(provider_name)

    async def stream_chat(self, query: str, session_id: str = None) -> AsyncGenerator[str, None]:
        """
        Processes an incoming query, attaches the composed system prompt,
        and streams the response through the configured AI provider.
        """
        system_prompt = PromptComposer.get_workspace_system_prompt()
        
        # Build strict message payload
        messages = [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": query}
        ]
        
        async for chunk in self.provider.generate_stream(messages=messages):
            yield chunk

# Singleton instance
ai_service = AIService()
