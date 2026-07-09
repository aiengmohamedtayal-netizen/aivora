from fastapi import APIRouter, HTTPException, status, Depends, Request
from supabase import Client
from app.schemas.schema import LeadCreate
from app.api.deps import get_supabase_client
from app.core.limiter import limiter
import logging

logger = logging.getLogger(__name__)
router = APIRouter()

@router.post("/", status_code=status.HTTP_201_CREATED)
@limiter.limit("5/minute")
async def create_lead(
    request: Request,
    payload: LeadCreate, 
    supabase: Client = Depends(get_supabase_client)
):
    """
    Accepts a validated lead payload and inserts it into the Supabase 'leads' table.
    """
    try:
        data = {
            "name": payload.name,
            "email": payload.email,
            "company": payload.company,
            "message": payload.message,
            "status": "new"
        }
        
        # Insert using Supabase Python client
        response = supabase.table("leads").insert(data).execute()
        
        # Execute returns an APIResponse; verify if data exists
        if not response.data:
            raise HTTPException(status_code=500, detail="Failed to insert lead.")
            
        return {"success": True, "data": response.data[0]}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Lead insertion failed: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")
