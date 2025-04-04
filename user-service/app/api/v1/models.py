from pydantic import BaseModel
from typing import Optional

class UserProfileBase(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    date_of_birth: Optional[str] = None
    profile_picture: Optional[str] = None

class UserProfileCreate(UserProfileBase):
    user_id: str  # From auth service

class UserProfileUpdate(UserProfileBase):
    pass

class UserProfileInDB(UserProfileCreate):
    class Config:
        from_attributes = True