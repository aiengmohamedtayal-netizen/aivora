from fastapi import APIRouter, Depends, Request
from app.schemas.schema import ChatQuery
from app.services.ai_service import AIService
from app.services.streaming import create_streaming_response
from app.api.deps import get_ai_service
from app.core.limiter import limiter

from uuid import UUID

router = APIRouter()

@router.get("/sessions/{session_id}/messages")
@limiter.limit("20/minute")
async def get_history(
    request: Request,
    session_id: UUID, 
    ai_service: AIService = Depends(get_ai_service)
):
    """
    H-05: Returns formatted chat history for a session without exposing internal DB structure.
    Validates session_id as UUID and applies rate limiting.
    """
    messages = await ai_service.get_session_history(session_id=str(session_id))
    return {"messages": messages}

from fastapi import BackgroundTasks

@router.post("/chat")
@limiter.limit("10/minute")  # C-04: Enforce 10 requests/minute per IP
async def chat_endpoint(
    request: Request,  # Required by slowapi for IP key extraction
    payload: ChatQuery,
    background_tasks: BackgroundTasks,
    ai_service: AIService = Depends(get_ai_service)
):
    """
    Accepts a query from the AI Business Assistant and returns an SSE stream.
    Rate-limited to 10 requests per minute per IP address.
    """
    stream_generator = ai_service.stream_chat(
        query=payload.query, 
        session_id=payload.session_id,
        background_tasks=background_tasks
    )
    return create_streaming_response(stream_generator)
