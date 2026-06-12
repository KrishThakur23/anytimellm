import jwt
import bcrypt
from datetime import datetime, timedelta, timezone
from typing import Optional
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from uuid import UUID
import uuid

from app.config import settings
from app.database import get_db
from app.models import User

# In-memory blocklist for revoked tokens (ideally use Redis or DB in production)
token_blocklist = set()

def is_token_revoked(jti: str) -> bool:
    return jti in token_blocklist

def revoke_token(jti: str):
    token_blocklist.add(jti)

# Using HTTPBearer to support standard Authorization: Bearer <token> headers
security_scheme = HTTPBearer()

def hash_password(password: str) -> str:
    """Hash a password using bcrypt with 12 rounds as per OWASP recommendation."""
    salt = bcrypt.gensalt(rounds=12)
    hashed = bcrypt.hashpw(password.encode("utf-8"), salt)
    return hashed.decode("utf-8")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a plain password against its hashed value using bcrypt."""
    try:
        return bcrypt.checkpw(plain_password.encode("utf-8"), hashed_password.encode("utf-8"))
    except Exception:
        return False

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """Generate a signed JWT token containing user and tenant session information."""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        # Access tokens should be short-lived (e.g., 15 minutes)
        expire = datetime.now(timezone.utc) + timedelta(minutes=15)
    to_encode.update({"exp": expire, "jti": str(uuid.uuid4()), "type": "access"})
    encoded_jwt = jwt.encode(to_encode, settings.JWT_SECRET_KEY, algorithm=settings.JWT_ALGORITHM)
    return encoded_jwt

def create_refresh_token(data: dict) -> str:
    """Generate a long-lived JWT refresh token."""
    to_encode = data.copy()
    # Refresh tokens last longer (e.g., 7 days)
    expire = datetime.now(timezone.utc) + timedelta(days=7)
    to_encode.update({"exp": expire, "jti": str(uuid.uuid4()), "type": "refresh"})
    encoded_jwt = jwt.encode(to_encode, settings.JWT_SECRET_KEY, algorithm=settings.JWT_ALGORITHM)
    return encoded_jwt

def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security_scheme),
    db: Session = Depends(get_db)
) -> User:
    """FastAPI dependency to extract and validate the JWT bearer token, resolving the authenticated User."""
    token = credentials.credentials
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, settings.JWT_SECRET_KEY, algorithms=[settings.JWT_ALGORITHM])
        user_id_str: str = payload.get("user_id")
        business_id_str: str = payload.get("business_id")
        token_type: str = payload.get("type", "access")
        jti: str = payload.get("jti")
        
        if user_id_str is None or business_id_str is None or token_type != "access":
            raise credentials_exception
            
        if jti and is_token_revoked(jti):
            raise credentials_exception
        
        user_id = UUID(user_id_str)
    except (jwt.PyJWTError, ValueError):
        raise credentials_exception
        
    user = db.query(User).filter(User.id == user_id).first()
    if user is None:
        raise credentials_exception
    return user
