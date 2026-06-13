import logging
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel, Field
from typing import Optional
from uuid import UUID

from app.database import get_db
from app.models import Business, User
from app.services.security import get_current_user
from app.config import settings

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/integrations/instagram", tags=["Instagram Integration"])

class InstagramAuthRequest(BaseModel):
    code: str = Field(..., description="The auth code or username for Instagram connection")
    username: Optional[str] = Field(None, description="Instagram username handle")
    page_id: Optional[str] = Field(None, description="Real Instagram Page ID")
    access_token: Optional[str] = Field(None, description="Real Meta Page Access Token")

class InstagramStatusResponse(BaseModel):
    connected: bool
    provider: Optional[str] = None
    page_id: Optional[str] = None
    username: Optional[str] = None
    verify_token: Optional[str] = None

@router.get("/status", response_model=InstagramStatusResponse)
def get_instagram_status(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Retrieves current Instagram connection settings and webhook details."""
    biz = db.query(Business).filter(Business.id == current_user.business_id).first()
    if not biz:
        raise HTTPException(status_code=404, detail="Business not found.")
        
    api_settings = biz.api_settings or {}
    connected = api_settings.get("instagram_provider") == "meta"
    
    return InstagramStatusResponse(
        connected=connected,
        provider=api_settings.get("instagram_provider"),
        page_id=api_settings.get("instagram_page_id"),
        username=api_settings.get("instagram_username"),
        verify_token=api_settings.get("instagram_verify_token")
    )

@router.post("/auth")
async def exchange_instagram_auth(
    payload: InstagramAuthRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Simulates/exchanges credentials to activate Instagram DM taking over."""
    biz = db.query(Business).filter(Business.id == current_user.business_id).first()
    if not biz:
        raise HTTPException(status_code=404, detail="Business not found.")
        
    username = payload.username or "@" + biz.name.lower().replace(" ", "_")
    if not username.startswith("@"):
        username = "@" + username
        
    instagram_settings = {
        "instagram_provider": "meta",
        "instagram_access_token": payload.access_token or "EAAQ_MOCK_INSTAGRAM_ACCESS_TOKEN_XYZ",
        "instagram_page_id": payload.page_id or ("insta_page_" + biz.id.hex[:8]),
        "instagram_username": username,
        "instagram_verify_token": f"anytimellm_instagram_verify_{biz.id.hex[:12]}"
    }
    
    biz.api_settings = {**biz.api_settings, **instagram_settings}
    db.commit()
    db.refresh(biz)
    
    return {
        "status": "success",
        "message": "Instagram connected successfully",
        "details": {
            "username": username,
            "page_id": instagram_settings["instagram_page_id"]
        }
    }

@router.post("/disconnect")
def disconnect_instagram(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Disconnect Instagram channel."""
    biz = db.query(Business).filter(Business.id == current_user.business_id).first()
    if not biz:
        raise HTTPException(status_code=404, detail="Business not found.")
        
    updated = dict(biz.api_settings or {})
    updated["instagram_provider"] = "mock"
    updated.pop("instagram_username", None)
    updated.pop("instagram_page_id", None)
    updated.pop("instagram_access_token", None)
    
    biz.api_settings = updated
    db.commit()
    db.refresh(biz)
    
    return {"status": "success", "message": "Instagram disconnected successfully"}
