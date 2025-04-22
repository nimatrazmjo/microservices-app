from fastapi import APIRouter, HTTPException, Depends, Query
from typing import List, Optional
from bson import ObjectId

def convert_objectid_to_str(doc):
    if "_id" in doc and isinstance(doc["_id"], ObjectId):
        doc["_id"] = str(doc["_id"])
    return doc

from app.crud.product import (
    create_product,
    get_product,
    get_products,
    update_product,
    delete_product,
    search_products
)
from app.schemas.product import Product, ProductCreate, ProductUpdate, ProductSearchResults
from app.models.product import ProductModel

router = APIRouter()

@router.post("/", response_model=Product)
async def create_new_product(product: ProductCreate):
    product_model = ProductModel(**product.dict())
    db_product = await create_product(product_model)
    if db_product is None:
        raise HTTPException(status_code=400, detail="Product not created")
    return  Product(**db_product)

@router.get("/", response_model=List[Product])
async def read_products(skip: int = 0, limit: int = 100):
    products = await get_products(skip=skip, limit=limit)
    return products

@router.get("/{product_id}", response_model=Product)
async def read_product(product_id: str):
    if not ObjectId.is_valid(product_id):
        raise HTTPException(status_code=400, detail="Invalid product ID")

    product = await get_product(product_id)
    if product is None:
        raise HTTPException(status_code=404, detail="Product not found")
    return product

@router.put("/{product_id}", response_model=Product)
async def update_existing_product(product_id: str, product: ProductUpdate):
    if not ObjectId.is_valid(product_id):
        raise HTTPException(status_code=400, detail="Invalid product ID")

    db_product = await update_product(product_id, product)
    if db_product is None:
        raise HTTPException(status_code=404, detail="Product not found")
    return db_product

@router.delete("/{product_id}")
async def delete_existing_product(product_id: str):
    if not ObjectId.is_valid(product_id):
        raise HTTPException(status_code=400, detail="Invalid product ID")

    success = await delete_product(product_id)
    if not success:
        raise HTTPException(status_code=404, detail="Product not found")
    return {"message": "Product deleted successfully"}

@router.get("/search/", response_model=ProductSearchResults)
async def search_products_endpoint(
    query: str = Query(..., min_length=1),
    category_id: Optional[str] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    skip: int = 0,
    limit: int = 100
):
    if category_id and not ObjectId.is_valid(category_id):
        raise HTTPException(status_code=400, detail="Invalid category ID")

    results = await search_products(
        query=query,
        category_id=category_id,
        min_price=min_price,
        max_price=max_price,
        skip=skip,
        limit=limit
    )
    return results