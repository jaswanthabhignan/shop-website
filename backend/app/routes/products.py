from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_, and_, func
from typing import Optional, List, Dict, Any
from app.database import get_db
from app.models.product import Product
from app.models.category import Category, Subcategory
from app.schemas.product import ProductResponse, ProductListResponse, ProductDetailResponse

router = APIRouter(prefix="/products", tags=["Products"])

@router.get("", response_model=ProductListResponse)
@router.get("/", response_model=ProductListResponse, include_in_schema=False)
def get_products(
    category: Optional[str] = Query(None, description="Category slug"),
    subcategory: Optional[str] = Query(None, description="Subcategory slug"),
    brand: Optional[str] = Query(None, description="Brand name or comma-separated brands"),
    min_price: Optional[float] = Query(None, description="Minimum price"),
    max_price: Optional[float] = Query(None, description="Maximum price"),
    is_featured: Optional[bool] = Query(None),
    is_price_drop: Optional[bool] = Query(None),
    search: Optional[str] = Query(None, description="Search keyword"),
    sort: Optional[str] = Query("default", description="Sort option: price_asc, price_desc, discount_desc, newest"),
    page: int = Query(1, ge=1),
    limit: int = Query(12, ge=1, le=100),
    # Common spec filters
    tonnage: Optional[str] = Query(None, description="AC Tonnage, e.g. 1 ton, 1.5 ton, 2 ton"),
    star_rating: Optional[int] = Query(None, description="Star rating: 2, 3, 4, 5"),
    inverter: Optional[bool] = Query(None, description="Inverter compressor"),
    db: Session = Depends(get_db)
):
    """List products with advanced filtering, facets, and pagination."""
    query = db.query(Product).filter(Product.is_available == True)

    # Category filter
    if category and category.lower() != "all":
        cat = db.query(Category).filter(Category.slug == category.lower()).first()
        if cat:
            query = query.filter(Product.category_id == cat.id)
        else:
            query = query.filter(Product.id == -1)

    # Subcategory filter
    if subcategory:
        sub = db.query(Subcategory).filter(Subcategory.slug == subcategory.lower()).first()
        if sub:
            query = query.filter(Product.subcategory_id == sub.id)
        else:
            query = query.filter(Product.id == -1)

    # Brand filter (supports comma-separated, case-insensitive)
    if brand:
        brand_list = [b.strip() for b in brand.split(",") if b.strip()]
        if brand_list:
            query = query.filter(func.lower(Product.brand).in_([b.lower() for b in brand_list]))

    # Price range
    if min_price is not None:
        query = query.filter(Product.selling_price >= min_price)
    if max_price is not None:
        query = query.filter(Product.selling_price <= max_price)

    # Boolean flags
    if is_featured is not None:
        query = query.filter(Product.is_featured == is_featured)
    if is_price_drop is not None:
        query = query.filter(Product.is_price_drop == is_price_drop)

    # Search query
    if search:
        search_term = f"%{search.strip()}%"
        query = query.filter(
            or_(
                Product.name.ilike(search_term),
                Product.brand.ilike(search_term),
                Product.model.ilike(search_term),
                Product.sku.ilike(search_term),
                Product.description.ilike(search_term)
            )
        )

    # Execute facet calculation on the filtered base (before specs/pagination)
    base_products = query.all()

    # Dynamic specs filtering in Python for cross-DB compatibility (PostgreSQL + SQLite)
    filtered_items = []
    for p in base_products:
        specs = p.specifications or {}
        
        # Tonnage check
        if tonnage:
            spec_tonnage = str(specs.get("tonnage", "")).strip().lower()
            if not spec_tonnage or tonnage.strip().lower() not in spec_tonnage:
                continue
                
        # Star rating check
        if star_rating is not None:
            spec_star = specs.get("star_rating")
            if spec_star is None:
                continue
            try:
                if int(spec_star) != star_rating:
                    continue
            except (ValueError, TypeError):
                continue
                
        # Inverter check
        if inverter is not None:
            if "inverter" not in specs or specs.get("inverter") is None:
                continue
            if bool(specs.get("inverter")) != inverter:
                continue
                
        filtered_items.append(p)

    # Compute Facet counts
    brands_count: Dict[str, int] = {}
    tonnages_count: Dict[str, int] = {}
    star_ratings_count: Dict[str, int] = {}
    inverter_count: Dict[str, int] = {"yes": 0, "no": 0}

    for p in base_products:
        brands_count[p.brand] = brands_count.get(p.brand, 0) + 1
        specs = p.specifications or {}
        if "tonnage" in specs:
            t = str(specs["tonnage"])
            tonnages_count[t] = tonnages_count.get(t, 0) + 1
        if "star_rating" in specs:
            s = f"{specs['star_rating']} Star"
            star_ratings_count[s] = star_ratings_count.get(s, 0) + 1
        if "inverter" in specs:
            if specs["inverter"]:
                inverter_count["yes"] += 1
            else:
                inverter_count["no"] += 1

    facets = {
        "brands": [{"name": k, "count": v} for k, v in sorted(brands_count.items())],
        "tonnages": [{"name": k, "count": v} for k, v in sorted(tonnages_count.items())],
        "star_ratings": [{"name": k, "count": v} for k, v in sorted(star_ratings_count.items())],
        "inverter": inverter_count
    }

    # Sorting
    if sort == "price_asc":
        filtered_items.sort(key=lambda x: x.selling_price or 0.0)
    elif sort == "price_desc":
        filtered_items.sort(key=lambda x: x.selling_price or 0.0, reverse=True)
    elif sort == "discount_desc":
        filtered_items.sort(key=lambda x: x.discount_percent or 0, reverse=True)
    elif sort == "name_asc":
        filtered_items.sort(key=lambda x: x.name or "")
    else: # newest
        filtered_items.sort(key=lambda x: x.id, reverse=True)

    # Pagination
    total = len(filtered_items)
    offset = (page - 1) * limit
    paginated_items = filtered_items[offset : offset + limit]
    pages = (total + limit - 1) // limit if total > 0 else 1

    return ProductListResponse(
        items=paginated_items,
        total=total,
        page=page,
        limit=limit,
        pages=pages,
        facets=facets
    )

@router.get("/{slug_or_id}", response_model=ProductDetailResponse)
def get_product(slug_or_id: str, db: Session = Depends(get_db)):
    """Fetch single product details along with related products in same category."""
    if slug_or_id.isdigit():
        product = db.query(Product).filter(Product.id == int(slug_or_id)).first()
    else:
        product = db.query(Product).filter(Product.slug == slug_or_id).first()

    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    # Fetch related products
    related = (
        db.query(Product)
        .filter(
            Product.category_id == product.category_id,
            Product.id != product.id,
            Product.is_available == True
        )
        .limit(4)
        .all()
    )

    return {
        "product": product,
        "related": related
    }
