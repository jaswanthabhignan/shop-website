from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload
from typing import Optional, List
from app.database import get_db
from app.models.store import Store
from app.models.product import Product
from app.models.category import Category, Subcategory
from app.models.offer import Offer
from app.models.enquiry import Enquiry
from app.schemas.product import ProductCreate, ProductUpdate, ProductResponse
from app.schemas.offer import OfferCreate, OfferResponse

router = APIRouter(prefix="/admin", tags=["Admin"])

@router.get("/stats")
def get_admin_stats(db: Session = Depends(get_db)):
    """Fetch metrics and dashboard statistics."""
    total_products = db.query(Product).count()
    total_stores = db.query(Store).count()
    total_categories = db.query(Category).count()
    total_offers = db.query(Offer).count()
    total_enquiries = db.query(Enquiry).count()
    
    pending_enquiries = db.query(Enquiry).filter(Enquiry.status == "pending").count()
    contacted_enquiries = db.query(Enquiry).filter(Enquiry.status == "contacted").count()
    completed_enquiries = db.query(Enquiry).filter(Enquiry.status == "completed").count()

    recent_enquiries = (
        db.query(Enquiry)
        .options(joinedload(Enquiry.store), joinedload(Enquiry.product))
        .order_by(Enquiry.created_at.desc())
        .limit(5)
        .all()
    )

    return {
        "total_products": total_products,
        "total_stores": total_stores,
        "total_categories": total_categories,
        "total_offers": total_offers,
        "total_enquiries": total_enquiries,
        "enquiry_breakdown": {
            "pending": pending_enquiries,
            "contacted": contacted_enquiries,
            "completed": completed_enquiries
        },
        "recent_enquiries": [
            {
                "id": e.id,
                "customer_name": e.customer_name,
                "customer_mobile": e.customer_mobile,
                "status": e.status,
                "store": e.store.name if e.store else "General",
                "product": e.product.name if e.product else "General Enquiry",
                "created_at": e.created_at.isoformat() if e.created_at else None
            } for e in recent_enquiries
        ]
    }

@router.post("/products", response_model=ProductResponse)
def create_product(payload: ProductCreate, db: Session = Depends(get_db)):
    """Add a new product to catalogue."""
    existing = db.query(Product).filter(Product.slug == payload.slug).first()
    if existing:
        raise HTTPException(status_code=400, detail="Product slug already exists")

    cat = db.query(Category).filter(Category.id == payload.category_id).first()
    if not cat:
        raise HTTPException(status_code=400, detail="Specified category does not exist")

    if payload.subcategory_id:
        sub = db.query(Subcategory).filter(Subcategory.id == payload.subcategory_id).first()
        if not sub:
            raise HTTPException(status_code=400, detail="Specified subcategory does not exist")
    
    prod_data = payload.model_dump() if hasattr(payload, "model_dump") else payload.dict()
    product = Product(**prod_data)
    db.add(product)
    db.commit()
    db.refresh(product)
    return product

@router.put("/products/{product_id}", response_model=ProductResponse)
def update_product(product_id: int, payload: ProductUpdate, db: Session = Depends(get_db)):
    """Update existing product details or prices."""
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    update_data = payload.model_dump(exclude_unset=True) if hasattr(payload, "model_dump") else payload.dict(exclude_unset=True)

    if "category_id" in update_data:
        cat = db.query(Category).filter(Category.id == update_data["category_id"]).first()
        if not cat:
            raise HTTPException(status_code=400, detail="Specified category does not exist")

    if "subcategory_id" in update_data and update_data["subcategory_id"] is not None:
        sub = db.query(Subcategory).filter(Subcategory.id == update_data["subcategory_id"]).first()
        if not sub:
            raise HTTPException(status_code=400, detail="Specified subcategory does not exist")

    for field, val in update_data.items():
        setattr(product, field, val)

    db.commit()
    db.refresh(product)
    return product

@router.delete("/products/{product_id}")
def delete_product(product_id: int, db: Session = Depends(get_db)):
    """Delete a product."""
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    # Disassociate enquiries pointing to this product to prevent foreign key errors
    db.query(Enquiry).filter(Enquiry.product_id == product_id).update({Enquiry.product_id: None})

    db.delete(product)
    db.commit()
    return {"message": "Product successfully deleted", "id": product_id}

@router.post("/offers", response_model=OfferResponse)
def create_offer(payload: OfferCreate, db: Session = Depends(get_db)):
    """Create a new promotional coupon offer."""
    code = payload.coupon_code.upper().strip()
    existing = db.query(Offer).filter(Offer.coupon_code == code).first()
    if existing:
        raise HTTPException(status_code=400, detail="Coupon code already exists")

    offer_data = payload.model_dump() if hasattr(payload, "model_dump") else payload.dict()
    offer_data["coupon_code"] = code
    offer = Offer(**offer_data)
    db.add(offer)
    db.commit()
    db.refresh(offer)
    return offer

@router.delete("/offers/{offer_id}")
def delete_offer(offer_id: int, db: Session = Depends(get_db)):
    """Delete a promotional offer."""
    offer = db.query(Offer).filter(Offer.id == offer_id).first()
    if not offer:
        raise HTTPException(status_code=404, detail="Offer not found")

    db.delete(offer)
    db.commit()
    return {"message": "Offer deleted", "id": offer_id}
