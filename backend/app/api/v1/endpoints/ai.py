from fastapi import APIRouter
from app.schemas.schema import ChatQuery
from app.services.ai_service import ai_service
from app.services.streaming import create_streaming_response

router = APIRouter()

@router.post("/chat")
async def chat_endpoint(payload: ChatQuery):
    """
    Accepts a query from the Intelligence workspace and returns an SSE stream.
    """
    stream_generator = ai_service.stream_chat(query=payload.query, session_id=payload.session_id)
    return create_streaming_response(stream_generator)
