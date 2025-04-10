from fastapi import APIRouter, HTTPException, status, Depends
from pymongo.errors import DuplicateKeyError
from app.models.category import CategoryModel
from app.schemas.category import Category, CategoryCreate
from app.database.mongodb import get_db
from motor.motor_asyncio import AsyncIOMotorDatabase
from bson import ObjectId

router = APIRouter()


def convert_objectid_to_str(doc):
    if "_id" in doc and isinstance(doc["_id"], ObjectId):
        doc["_id"] = str(doc["_id"])
    return doc

@router.post("/", response_model=Category, status_code=status.HTTP_201_CREATED)
async def create_new_category(
    category: CategoryCreate,
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    # Convert empty parent_id to None
    parent_id = category.parent_id if category.parent_id else None

    try:
        # Create the model
        category_model = CategoryModel(
            name=category.name,
            description=category.description,
            parent_id=parent_id
        )

        # Check for existing category
        if await db.categories.find_one({"name": category_model.name}):
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=f"Category '{category_model.name}' already exists"
            )

        # Insert new category
        result = await db.categories.insert_one(category_model.dict(by_alias=True))
        created_category = await db.categories.find_one({"_id": result.inserted_id})

        if not created_category:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to create category"
            )

        return convert_objectid_to_str(created_category)

    except DuplicateKeyError:
        existing = await db.categories.find_one({"name": category_model.name})
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail={
                "error": "DUPLICATE_CATEGORY",
                "message": f"Category '{category_model.name}' was just created",
                "existing_id": str(existing["_id"])
            }
        )