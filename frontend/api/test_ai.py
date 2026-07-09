import asyncio
import os
from dotenv import load_dotenv

load_dotenv()

from app.api.deps import get_supabase_client
from app.services.ai_service import AIService

async def test():
    supabase = get_supabase_client()
    ai = AIService(supabase=supabase)
    
    print("Testing stream_chat...")
    try:
        generator = ai.stream_chat(query="Hello test")
        async for chunk in generator:
            print(chunk)
    except Exception as e:
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(test())
