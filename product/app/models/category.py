from bson import ObjectId
from pydantic import BaseModel, Field, GetCoreSchemaHandler
from pydantic_core import core_schema
from typing import Optional

class PyObjectId(ObjectId):
    @classmethod
    def __get_pydantic_core_schema__(cls, _source_type, _handler):
        return core_schema.union_schema([
            # Handle None case first
            core_schema.none_schema(),
            # Then handle string ObjectIds
            core_schema.no_info_after_validator_function(
                cls.validate,
                core_schema.str_schema(),
                serialization=core_schema.to_string_ser_schema(),
            )
        ])

    @classmethod
    def validate(cls, v):
        if v is None:
            return None
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid ObjectId")
        return ObjectId(v)

class CategoryModel(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    name: str = Field(..., min_length=1, max_length=50)
    description: Optional[str] = Field(None, max_length=200)
    parent_id: Optional[PyObjectId] = Field(None)

    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}
        json_schema_extra = {
            "example": {
                "name": "Beverages",
                "description": "Drinks and liquids",
                "parent_id": None  # Explicitly show None is allowed
            }
        }