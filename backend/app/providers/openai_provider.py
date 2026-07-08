from typing import AsyncGenerator, List, Dict, Any
from openai import AsyncOpenAI
from .base import AIProvider
from app.core.config import settings

class OpenAIProvider(AIProvider):
    def __init__(self):
        self.client = AsyncOpenAI(api_key=settings.OPENAI_API_KEY)

    async def generate_stream(
        self, 
        messages: List[Dict[str, str]], 
        model: str = settings.OPENAI_DEFAULT_MODEL, 
        **kwargs: Any
    ) -> AsyncGenerator[str, None]:
        
        response = await self.client.chat.completions.create(
            model=model,
            messages=messages, # type: ignore
            stream=True,
            **kwargs
        )
        
        async for chunk in response:
            content = chunk.choices[0].delta.content
            if content:
                yield content

    async def generate(
        self, 
        messages: List[Dict[str, str]], 
        model: str = settings.OPENAI_DEFAULT_MODEL, 
        **kwargs: Any
    ) -> str:
        
        response = await self.client.chat.completions.create(
            model=model,
            messages=messages, # type: ignore
            stream=False,
            **kwargs
        )
        
        return response.choices[0].message.content or ""
