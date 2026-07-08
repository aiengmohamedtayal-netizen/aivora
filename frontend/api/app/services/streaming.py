from typing import AsyncGenerator
from fastapi.responses import StreamingResponse

def create_streaming_response(generator: AsyncGenerator[str, None], media_type: str = "text/event-stream") -> StreamingResponse:
    """
    Creates a standardized streaming response wrapping an asynchronous generator.
    By default, uses Server-Sent Events (SSE) format compatible with the frontend.
    """
    return StreamingResponse(generator, media_type=media_type)
