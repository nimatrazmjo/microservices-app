from typing import Optional
from pydantic import BaseModel, Field
from bson import ObjectId
from app.models.category import PyObjectId

class CategoryBase(BaseModel):
    name: str
    description: Optional[str] = None
    parent_id: Optional[str] = None

class CategoryCreate(BaseModel):
    name: str
    description: Optional[str] = None
    parent_id: Optional[str] = None  # Accepts string or None

    class Config:
        json_schema_extra = {
            "example": {
                "name": "Fruits",
                "description": "Fresh fruits",
                "parent_id": None  # or "507f1f77bcf86cd799439011"
            }
        }

class CategoryUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    parent_id: Optional[str] = None

class Category(CategoryBase):
    id: PyObjectId = Field(alias="_id")  # Map MongoDB _id to id
    class Config:
        from_attributes = True