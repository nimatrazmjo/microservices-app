# main.py
from fastapi import FastAPI, HTTPException, Depends, Header
import motor.motor_asyncio
from model import UserProfile, UserProfileUpdate
from bson import ObjectId
from typing import List
from dotenv import load_dotenv
import os

load_dotenv()

app = FastAPI()

# MongoDB setup
MONGO_DB_URL = os.getenv("MONGO_DB_URL", "mongodb://localhost:27017")
client = motor.motor_asyncio.AsyncIOMotorClient(MONGO_DB_URL)
db = client.user_service
profiles = db.profiles

# Verify the auth token with auth service
async def verify_token(authorization: str = Header(...)):
    # In a real implementation, you would call your auth service to validate the token
    # For now, we'll just extract the user ID from a mock token
    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Invalid token format")

    token = authorization.split(" ")[1]
    # In production, you would validate this token with your auth service
    # For this example, we'll assume the token contains the user ID
    return {"user_id": token}

@app.post("/profiles/", response_model=UserProfile)
async def create_profile(profile: UserProfile, auth: dict = Depends(verify_token)):
    # Ensure the user is creating their own profile
    if profile.user_id != auth["user_id"]:
        raise HTTPException(status_code=403, detail="Cannot create profile for another user")

    existing_profile = await profiles.find_one({"user_id": profile.user_id})
    if existing_profile:
        raise HTTPException(status_code=400, detail="Profile already exists")

    profile_dict = profile.dict()
    result = await profiles.insert_one(profile_dict)
    return await profiles.find_one({"_id": result.inserted_id})

@app.get("/profiles/me", response_model=UserProfile)
async def read_own_profile(auth: dict = Depends(verify_token)):
    profile = await profiles.find_one({"user_id": auth["user_id"]})
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    return profile

@app.patch("/profiles/me", response_model=UserProfile)
async def update_own_profile(update: UserProfileUpdate, auth: dict = Depends(verify_token)):
    update_data = {k: v for k, v in update.dict().items() if v is not None}

    if not update_data:
        raise HTTPException(status_code=400, detail="No data provided for update")

    await profiles.update_one(
        {"user_id": auth["user_id"]},
        {"$set": update_data}
    )
    return await profiles.find_one({"user_id": auth["user_id"]})

@app.get("/profiles/{user_id}", response_model=UserProfile)
async def read_profile(user_id: str, auth: dict = Depends(verify_token)):
    # In a real app, you might want to check permissions here
    profile = await profiles.find_one({"user_id": user_id})
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    return profile