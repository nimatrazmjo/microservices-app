from datetime import datetime
from typing import Optional, List
from bson import ObjectId
from pydantic import BaseModel, Field, validator, GetCoreSchemaHandler
from pydantic_core import core_schema

class PyObjectId(ObjectId):
    @classmethod
    def __get_pydantic_core_schema__(
        cls,
        _source_type: type[ObjectId],
        _handler: GetCoreSchemaHandler
    ) -> core_schema.CoreSchema:
        return core_schema.no_info_after_validator_function(
            cls.validate,
            core_schema.str_schema(),
            serialization=core_schema.to_string_ser_schema(),
        )

    @classmethod
    def validate(cls, v):
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid ObjectId")
        return ObjectId(v)

class ProductModel(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    name: str = Field(...)
    description: str = Field(...)
    price: float = Field(...)
    category_id: PyObjectId = Field(...)
    tags: List[str] = Field(default_factory=list)
    stock: int = Field(default=0)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}
        json_schema_extra = {
            "example": {
                "name": "Premium Wireless Headphones",
                "description": "Noise cancelling wireless headphones with 30hr battery",
                "price": 299.99,
                "category_id": "507f1f77bcf86cd799439011",
                "tags": ["electronics", "audio", "wireless"],
                "stock": 50
            }
        }

    @validator('updated_at')
    def update_timestamp(cls, v, values):
        return datetime.utcnow()