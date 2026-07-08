from fastapi import APIRouter, Depends
from app.schemas.schema import ChatQuery
from app.services.ai_service import AIService
from app.services.streaming import create_streaming_response
from app.api.deps import get_ai_service

router = APIRouter()

@router.post("/chat")
async def chat_endpoint(payload: ChatQuery, ai_service: AIService = Depends(get_ai_service)):
    """
    Accepts a query from the Intelligence workspace and returns an SSE stream.
    """
    stream_generator = ai_service.stream_chat(query=payload.query, session_id=payload.session_id)
    return create_streaming_response(stream_generator)
