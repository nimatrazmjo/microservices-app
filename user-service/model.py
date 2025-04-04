# models.py
from pydantic import BaseModel, EmailStr
from typing import Optional
from enum import Enum

class UserProfile(BaseModel):
    user_id: str  # This will reference the auth service's user ID
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    date_of_birth: Optional[str] = None
    profile_picture: Optional[str] = None

class UserProfileUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    date_of_birth: Optional[str] = None
    profile_picture: Optional[str] = None