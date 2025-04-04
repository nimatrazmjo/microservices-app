from fastapi import APIRouter, Depends, HTTPException
from app.db.mongodb import get_db
from app.api.v1.models import (
    UserProfileCreate,
    UserProfileUpdate,
    UserProfileInDB
)
from app.api.v1.dependencies import verify_token
from typing import Annotated

router = APIRouter(prefix="/profiles", tags=["profiles"])

@router.post("/", response_model=UserProfileInDB)
async def create_profile(
    profile: UserProfileCreate,
    auth: Annotated[dict, Depends(verify_token)],
    db=Depends(get_db)
):
    if profile.user_id != auth["user_id"]:
        raise HTTPException(403, "Cannot create profile for another user")

    if await db.profiles.find_one({"user_id": profile.user_id}):
        raise HTTPException(400, "Profile already exists")

    result = await db.profiles.insert_one(profile.model_dump())
    return await db.profiles.find_one({"_id": result.inserted_id})

# ... other endpoints with similar structure ...