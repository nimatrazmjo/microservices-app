# app/api/v1/dependencies.py
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt, JWTError
from app.core.config import get_settings

security = HTTPBearer()
settings = get_settings()

async def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        token = credentials.credentials
        payload = jwt.decode(
            token,
            settings.secret_key,  # Make sure you have this in your Settings
        )
        return {"user_id": payload.get("userId") or payload.get("sub")}  # Use whichever claim contains user ID
    except JWTError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )