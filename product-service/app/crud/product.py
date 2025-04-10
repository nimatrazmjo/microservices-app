from typing import List, Optional
from bson import ObjectId
from datetime import datetime
from fastapi.encoders import jsonable_encoder
from app.models.product import ProductModel
from app.schemas.product import Product, ProductUpdate, ProductSearchResults
from app.database.mongodb import db

async def create_product(product: ProductModel) -> Product:
    product.created_at = product.updated_at = datetime.utcnow()
    product_dict = jsonable_encoder(product)
    new_product = await db.products.insert_one(product_dict)
    created_product = await db.products.find_one({"_id": new_product.inserted_id})
    return created_product

async def get_product(product_id: str) -> Optional[Product]:
    if (product := await db.products.find_one({"_id": ObjectId(product_id)})) is not None:
        return product
    return None

async def get_products(skip: int = 0, limit: int = 100) -> List[Product]:
    products = await db.products.find().skip(skip).limit(limit).to_list(limit)
    return products

async def update_product(product_id: str, product: ProductUpdate) -> Optional[Product]:
    product_dict = {k: v for k, v in product.dict().items() if v is not None}
    product_dict["updated_at"] = datetime.utcnow()

    if len(product_dict) >= 1:
        update_result = await db.products.update_one(
            {"_id": ObjectId(product_id)}, {"$set": product_dict}
        )
        if update_result.modified_count == 1:
            if (updated_product := await db.products.find_one({"_id": ObjectId(product_id)})) is not None:
                return updated_product
    return None

async def delete_product(product_id: str) -> bool:
    delete_result = await db.products.delete_one({"_id": ObjectId(product_id)})
    return delete_result.deleted_count == 1

async def search_products(
    query: str,
    category_id: Optional[str] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    skip: int = 0,
    limit: int = 100
) -> ProductSearchResults:
    search_filter = {"$text": {"$search": query}}

    if category_id:
        search_filter["category_id"] = ObjectId(category_id)

    price_filter = {}
    if min_price is not None:
        price_filter["$gte"] = min_price
    if max_price is not None:
        price_filter["$lte"] = max_price
    if price_filter:
        search_filter["price"] = price_filter

    cursor = db.products.find(search_filter).skip(skip).limit(limit)
    products = await cursor.to_list(length=limit)
    total = await db.products.count_documents(search_filter)

    return ProductSearchResults(results=products, total=total)