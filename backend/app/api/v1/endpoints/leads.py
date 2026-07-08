from fastapi import APIRouter, HTTPException, status
from app.schemas.schema import LeadCreate
from app.core.config import settings
from supabase import create_client, Client

router = APIRouter()

# Initialize Supabase client globally for the backend
supabase: Client = create_client(settings.SUPABASE_URL, settings.SUPABASE_SERVICE_ROLE_KEY)

@router.post("/", status_code=status.HTTP_201_CREATED)
async def create_lead(payload: LeadCreate):
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
