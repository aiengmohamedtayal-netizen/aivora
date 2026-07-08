from fastapi import APIRouter, HTTPException, status, Depends
from supabase import Client
from app.schemas.schema import LeadCreate
from app.api.deps import get_supabase_client

router = APIRouter()

@router.post("/", status_code=status.HTTP_201_CREATED)
async def create_lead(payload: LeadCreate, supabase: Client = Depends(get_supabase_client)):
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
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
