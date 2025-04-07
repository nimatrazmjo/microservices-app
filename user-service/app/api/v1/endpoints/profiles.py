from fastapi import APIRouter, Depends, HTTPException, status
from app.db.mongodb import get_db
from app.api.v1.models import (
    UserProfileCreate,
    UserProfileUpdate,
    UserProfileInDB
)
from app.api.v1.dependencies import verify_token
from typing import Annotated
from bson import ObjectId

router = APIRouter(prefix="/profiles", tags=["profiles"])

@router.post("/", response_model=UserProfileInDB, status_code=status.HTTP_201_CREATED)
async def create_profile(
    profile: UserProfileCreate,
    auth: Annotated[dict, Depends(verify_token)],
    db=Depends(get_db)
):
    """Create a new user profile"""
    # The user_id comes from the JWT token
    profile.user_id = auth["user_id"]

    if await db.profiles.find_one({"user_id": profile.user_id}):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Profile already exists"
        )

    result = await db.profiles.insert_one(profile.model_dump())
    created_profile = await db.profiles.find_one({"_id": result.inserted_id})
    return UserProfileInDB(**created_profile)

@router.get("/", response_model=UserProfileInDB)
async def get_my_profile(
    auth: Annotated[dict, Depends(verify_token)],
    db=Depends(get_db)
):
    print(auth)
    """Get the current user's profile"""
    profile = await db.profiles.find_one({"user_id": auth["user_id"]})
    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Profile not found"
        )

    return UserProfileInDB(**profile)

@router.put("/", response_model=UserProfileInDB)
async def update_my_profile(
    profile_update: UserProfileUpdate,
    auth: Annotated[dict, Depends(verify_token)],
    db=Depends(get_db)
):
    """Update the current user's profile"""
    # Remove None values from the update
    update_data = profile_update.model_dump(exclude_unset=True)

    if not update_data:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No data provided for update"
        )

    result = await db.profiles.update_one(
        {"user_id": auth["user_id"]},
        {"$set": update_data}
    )

    if result.matched_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Profile not found"
        )

    updated_profile = await db.profiles.find_one({"user_id": auth["user_id"]})
    return UserProfileInDB(**updated_profile)

@router.delete("/", status_code=status.HTTP_204_NO_CONTENT)
async def delete_my_profile(
    auth: Annotated[dict, Depends(verify_token)],
    db=Depends(get_db)
):
    """Delete the current user's profile"""
    result = await db.profiles.delete_one({"user_id": auth["user_id"]})
    if result.deleted_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Profile not found"
        )

    return None