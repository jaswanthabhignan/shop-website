from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app.models.enquiry import Enquiry
from app.models.store import Store
from app.models.product import Product
from app.schemas.enquiry import EnquiryCreate, EnquiryResponse, EnquiryUpdateStatus

router = APIRouter(prefix="/enquiries", tags=["Enquiries"])

@router.post("", response_model=EnquiryResponse)
def submit_enquiry(payload: EnquiryCreate, db: Session = Depends(get_db)):
    """Submit a new customer enquiry or call-back request."""
    # Optional check: store existence
    if payload.store_id:
        store = db.query(Store).filter(Store.id == payload.store_id).first()
        if not store:
            raise HTTPException(status_code=400, detail="Specified store does not exist")

    # Optional check: product existence
    if payload.product_id:
        prod = db.query(Product).filter(Product.id == payload.product_id).first()
        if not prod:
            raise HTTPException(status_code=400, detail="Specified product does not exist")

    # Sanitize phone number (strip spaces/dashes)
    clean_phone = "".join(filter(str.isdigit, payload.customer_mobile))
    if len(clean_phone) < 10:
        raise HTTPException(status_code=422, detail="Mobile number must contain at least 10 digits")

    enquiry = Enquiry(
        store_id=payload.store_id,
        product_id=payload.product_id,
        customer_name=payload.customer_name.strip(),
        customer_mobile=clean_phone,
        enquiry_type=payload.enquiry_type,
        message=payload.message,
        status="pending"
    )
    db.add(enquiry)
    db.commit()
    db.refresh(enquiry)
    return enquiry

@router.get("", response_model=List[EnquiryResponse])
def get_enquiries(
    store_id: Optional[int] = Query(None),
    status: Optional[str] = Query(None),
    limit: int = Query(50, ge=1, le=200),
    db: Session = Depends(get_db)
):
    """Retrieve enquiries for store managers or admin."""
    query = db.query(Enquiry)
    if store_id:
        query = query.filter(Enquiry.store_id == store_id)
    if status:
        query = query.filter(Enquiry.status == status)

    enquiries = query.order_by(Enquiry.created_at.desc()).limit(limit).all()
    return enquiries

@router.patch("/{enquiry_id}/status", response_model=EnquiryResponse)
def update_enquiry_status(
    enquiry_id: int, 
    payload: EnquiryUpdateStatus, 
    db: Session = Depends(get_db)
):
    """Update enquiry status (pending -> contacted -> completed / cancelled)."""
    enquiry = db.query(Enquiry).filter(Enquiry.id == enquiry_id).first()
    if not enquiry:
        raise HTTPException(status_code=404, detail="Enquiry not found")

    enquiry.status = payload.status
    if payload.admin_notes is not None:
        enquiry.admin_notes = payload.admin_notes

    db.commit()
    db.refresh(enquiry)
    return enquiry
