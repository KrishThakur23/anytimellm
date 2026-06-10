import logging
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from uuid import UUID

from app.database import get_db
from app.models import Business, User
from app.schemas import UserRegister, UserLogin, TokenOut, UserOut, BusinessOut, GoogleAuthPayload, GoogleAuthResponse
from app.services.security import hash_password, verify_password, create_access_token, get_current_user


logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/auth", tags=["User Authentication"])

@router.post("/register", response_model=TokenOut, status_code=status.HTTP_201_CREATED)
def register_user(payload: UserRegister, db: Session = Depends(get_db)):
    """Register a new business tenant and its primary administrator account."""
    # Check if user email already exists
    existing_user = db.query(User).filter(User.email == payload.email.lower().strip()).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A user with this email address already exists."
        )

    try:
        # Create Business
        new_biz = Business(
            name=payload.business_name,
            api_settings={
                "system_prompt": f"You are a helpful virtual assistant for {payload.business_name}. You can answer customer questions about our products, check availability in our database, or help place an order."
            }
        )
        db.add(new_biz)
        db.commit()
        db.refresh(new_biz)

        # Create Admin User linked to Business
        new_user = User(
            business_id=new_biz.id,
            email=payload.email.lower().strip(),
            hashed_password=hash_password(payload.password)
        )
        db.add(new_user)
        db.commit()
        db.refresh(new_user)

        # Generate JWT Token
        token_data = {
            "user_id": str(new_user.id),
            "business_id": str(new_biz.id)
        }
        access_token = create_access_token(token_data)

        return TokenOut(
            access_token=access_token,
            token_type="bearer",
            business_id=new_biz.id
        )

    except Exception as e:
        db.rollback()
        logger.error(f"Error registering user: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to register workspace."
        )

@router.post("/login", response_model=TokenOut)
def login_user(payload: UserLogin, db: Session = Depends(get_db)):
    """Log in as an administrator to retrieve access tokens for console management."""
    user = db.query(User).filter(User.email == payload.email.lower().strip()).first()
    if not user or not verify_password(payload.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password."
        )

    token_data = {
        "user_id": str(user.id),
        "business_id": str(user.business_id)
    }
    access_token = create_access_token(token_data)

    return TokenOut(
        access_token=access_token,
        token_type="bearer",
        business_id=user.business_id
    )

@router.get("/me", response_model=UserOut)
def get_user_profile(current_user: User = Depends(get_current_user)):
    """Retrieve details of the currently authenticated admin user."""
    return current_user

@router.get("/business", response_model=BusinessOut)
def get_user_business(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Retrieve business tenant settings for the currently authenticated admin user."""
    biz = db.query(Business).filter(Business.id == current_user.business_id).first()
    if not biz:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Business not found.")
    return biz


def verify_google_token(token: str, client_id: str):
    """Verifies a Google ID token (JWT) using Google API Client Library, with a local fallback for mock testing."""
    if not client_id or "mock" in client_id or token.startswith("mock_token_"):
        print(f"[GOOGLE AUTH] Bypassing token verification (Mock Mode). Client ID: {client_id}")
        parts = token.split("_")
        email = "test-google@example.com"
        name = "Test Google User"
        if len(parts) >= 4:
            email = parts[2]
            name = parts[3]
        elif len(parts) >= 3:
            email = parts[1]
            name = parts[2]
        return {"email": email, "name": name}
    
    from google.oauth2 import id_token
    from google.auth.transport import requests as google_requests
    
    idinfo = id_token.verify_oauth2_token(token, google_requests.Request(), client_id)
    return idinfo


@router.post("/google", response_model=GoogleAuthResponse)
def google_auth(payload: GoogleAuthPayload, db: Session = Depends(get_db)):
    """Authenticate via Google Sign-In. Registers user and business if registration is not yet completed."""
    from app.config import settings
    
    try:
        idinfo = verify_google_token(payload.credential, settings.GOOGLE_CLIENT_ID)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Google authentication failed: {str(e)}"
        )
        
    email = idinfo.get("email", "").lower().strip()
    name = idinfo.get("name", "Google User")
    
    if not email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Google token does not contain an email address."
        )
        
    user = db.query(User).filter(User.email == email).first()
    
    if user:
        token_data = {
            "user_id": str(user.id),
            "business_id": str(user.business_id)
        }
        access_token = create_access_token(token_data)
        
        return GoogleAuthResponse(
            is_registered=True,
            access_token=access_token,
            business_id=user.business_id
        )
        
    if not payload.business_name:
        return GoogleAuthResponse(
            is_registered=False
        )
        
    try:
        new_biz = Business(
            name=payload.business_name,
            api_settings={
                "system_prompt": f"You are a helpful virtual assistant for {payload.business_name}. You can answer customer questions about our products, check availability in our database, or help place an order."
            }
        )
        db.add(new_biz)
        db.commit()
        db.refresh(new_biz)
        
        import secrets
        random_pwd = secrets.token_urlsafe(32)
        
        new_user = User(
            business_id=new_biz.id,
            email=email,
            hashed_password=hash_password(random_pwd)
        )
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        
        token_data = {
            "user_id": str(new_user.id),
            "business_id": str(new_biz.id)
        }
        access_token = create_access_token(token_data)
        
        return GoogleAuthResponse(
            is_registered=True,
            access_token=access_token,
            business_id=new_biz.id
        )
    except Exception as e:
        db.rollback()
        logger.error(f"Error creating Google user/business: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to register Google workspace tenant."
        )

