from pydantic import BaseModel, EmailStr, Field
from typing import Optional

class LeadCreate(BaseModel):
    name: str = Field(..., min_length=2, description="Full name of the contact")
    email: EmailStr = Field(..., description="Valid email address")
    company: Optional[str] = Field(None, description="Company name")
    message: str = Field(..., min_length=10, description="Inquiry message or project details")

class ChatQuery(BaseModel):
    query: str = Field(..., description="The command or query from the AI Engineering Workspace")
    session_id: Optional[str] = Field(None, description="Current session UUID for context continuation")
