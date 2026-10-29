from fastapi import APIRouter, Depends, HTTPException, Header
from sqlalchemy.orm import Session
from typing import Optional, List
from app.database import get_db
from app.models.store import Store
from app.models.product import Product
from app.models.category import Category
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

    recent_enquiries = db.query(Enquiry).order_by(Enquiry.created_at.desc()).limit(5).all()

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
                "created_at": e.created_at.isoformat()
            } for e in recent_enquiries
        ]
    }

@router.post("/products", response_model=ProductResponse)
def create_product(payload: ProductCreate, db: Session = Depends(get_db)):
    """Add a new product to catalogue."""
    existing = db.query(Product).filter(Product.slug == payload.slug).first()
    if existing:
        raise HTTPException(status_code=400, detail="Product slug already exists")
    
    product = Product(**payload.dict())
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

    update_data = payload.dict(exclude_unset=True)
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

    db.delete(product)
    db.commit()
    return {"message": "Product successfully deleted", "id": product_id}

@router.post("/offers", response_model=OfferResponse)
def create_offer(payload: OfferCreate, db: Session = Depends(get_db)):
    """Create a new promotional coupon offer."""
    offer = Offer(**payload.dict())
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
