from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.category import Category, Subcategory
from app.schemas.category import CategoryResponse, SubcategoryResponse

router = APIRouter(prefix="/categories", tags=["Categories"])

@router.get("", response_model=List[CategoryResponse])
def get_categories(db: Session = Depends(get_db)):
    """Fetch all categories along with their subcategories ordered by display_order."""
    categories = db.query(Category).order_by(Category.display_order.asc(), Category.id.asc()).all()
    return categories

@router.get("/{slug}", response_model=CategoryResponse)
def get_category_by_slug(slug: str, db: Session = Depends(get_db)):
    """Fetch a single category by slug."""
    category = db.query(Category).filter(Category.slug == slug).first()
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    return category

@router.get("/{category_slug}/subcategories", response_model=List[SubcategoryResponse])
def get_subcategories(category_slug: str, db: Session = Depends(get_db)):
    """Fetch subcategories belonging to a category."""
    category = db.query(Category).filter(Category.slug == category_slug).first()
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    return category.subcategories
