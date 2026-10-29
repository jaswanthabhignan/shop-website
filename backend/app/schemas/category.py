from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class SubcategoryBase(BaseModel):
    name: str
    slug: str
    description: Optional[str] = None

class SubcategoryResponse(SubcategoryBase):
    id: int
    category_id: int
    created_at: datetime

    class Config:
        from_attributes = True

class CategoryBase(BaseModel):
    name: str
    slug: str
    description: Optional[str] = None
    icon_name: Optional[str] = None
    display_order: int = 0

class CategoryResponse(CategoryBase):
    id: int
    created_at: datetime
    subcategories: List[SubcategoryResponse] = []

    class Config:
        from_attributes = True
