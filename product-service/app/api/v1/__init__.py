from fastapi import APIRouter
from .products import router as products_router
from .categories import router as categories_router

router = APIRouter()
router.include_router(products_router, prefix="/products", tags=["products"])
router.include_router(categories_router, prefix="/categories", tags=["categories"])

__all__ = ["router"]