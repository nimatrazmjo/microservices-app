from typing import List, Optional
from bson import ObjectId
from fastapi.encoders import jsonable_encoder
from app.models.category import CategoryModel
from app.schemas.category import Category, CategoryUpdate
from app.database.mongodb import db

async def create_category(category: CategoryModel) -> Optional[Category]:
    # Check if category exists first
    if await db.categories.find_one({"name": category.name}):
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Category with name '{category.name}' already exists"
        )

    category_dict = jsonable_encoder(category)
    new_category = await db.categories.insert_one(category_dict)
    created_category = await db.categories.find_one({"_id": new_category.inserted_id})
    return created_category

async def get_category(category_id: str) -> Optional[Category]:
    if (category := await db.categories.find_one({"_id": ObjectId(category_id)})) is not None:
        return category
    return None

async def get_categories(skip: int = 0, limit: int = 100) -> List[Category]:
    categories = await db.categories.find().skip(skip).limit(limit).to_list(limit)
    return categories

async def get_categories_by_parent(parent_id: Optional[str] = None) -> List[Category]:
    filter = {"parent_id": ObjectId(parent_id)} if parent_id else {"parent_id": None}
    categories = await db.categories.find(filter).to_list(1000)
    return categories

async def update_category(category_id: str, category: CategoryUpdate) -> Optional[Category]:
    category_dict = {k: v for k, v in category.dict().items() if v is not None}

    if len(category_dict) >= 1:
        update_result = await db.categories.update_one(
            {"_id": ObjectId(category_id)}, {"$set": category_dict}
        )
        if update_result.modified_count == 1:
            if (updated_category := await db.categories.find_one({"_id": ObjectId(category_id)})) is not None:
                return updated_category
    return None

async def delete_category(category_id: str) -> bool:
    # Check if any products reference this category
    product_count = await db.products.count_documents({"category_id": ObjectId(category_id)})
    if product_count > 0:
        return False

    # Check if any subcategories reference this category as parent
    subcategory_count = await db.categories.count_documents({"parent_id": ObjectId(category_id)})
    if subcategory_count > 0:
        return False

    delete_result = await db.categories.delete_one({"_id": ObjectId(category_id)})
    return delete_result.deleted_count == 1