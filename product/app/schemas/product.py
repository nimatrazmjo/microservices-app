from typing import Optional, List
from pydantic import BaseModel, Field
from datetime import datetime

class ProductBase(BaseModel):
    name: str
    description: str
    price: float
    category_id: str
    tags: Optional[List[str]] = []
    stock: Optional[int] = 0

class ProductCreate(ProductBase):
    pass

class ProductUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = None
    category_id: Optional[str] = None
    tags: Optional[List[str]] = None
    stock: Optional[int] = None

class Product(ProductBase):
    id: str = Field(alias="_id")
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
        populate_by_name = True

class ProductSearchResults(BaseModel):
    results: List[Product]
    total: int