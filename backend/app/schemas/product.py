from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from datetime import datetime
from app.schemas.category import CategoryResponse, SubcategoryResponse

class ProductBase(BaseModel):
    name: str
    slug: str
    brand: str
    model: str
    sku: str
    category_id: int
    subcategory_id: Optional[int] = None
    selling_price: float
    mrp: float
    discount_percent: int = 0
    image_url: Optional[str] = None
    short_description: Optional[str] = None
    description: Optional[str] = None
    warranty_info: str = "12 months warranty. Keep the GST invoice from the store for warranty service."
    key_features: List[str] = []
    specifications: Dict[str, Any] = {}
    is_featured: bool = False
    is_price_drop: bool = False
    is_available: bool = True

class ProductCreate(ProductBase):
    pass

class ProductUpdate(BaseModel):
    name: Optional[str] = None
    brand: Optional[str] = None
    selling_price: Optional[float] = None
    mrp: Optional[float] = None
    discount_percent: Optional[int] = None
    image_url: Optional[str] = None
    short_description: Optional[str] = None
    description: Optional[str] = None
    warranty_info: Optional[str] = None
    key_features: Optional[List[str]] = None
    specifications: Optional[Dict[str, Any]] = None
    is_featured: Optional[bool] = None
    is_price_drop: Optional[bool] = None
    is_available: Optional[bool] = None

class ProductResponse(ProductBase):
    id: int
    created_at: datetime
    category: Optional[CategoryResponse] = None
    subcategory: Optional[SubcategoryResponse] = None

    class Config:
        from_attributes = True

class ProductListResponse(BaseModel):
    items: List[ProductResponse]
    total: int
    page: int
    limit: int
    pages: int
    facets: Optional[Dict[str, Any]] = None
