from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.store import Store
from app.schemas.store import StoreResponse, StoreCreate

router = APIRouter(prefix="/stores", tags=["Stores"])

@router.get("", response_model=List[StoreResponse])
def get_stores(db: Session = Depends(get_db)):
    """Fetch all active stores."""
    stores = db.query(Store).filter(Store.is_active == True).order_by(Store.id.asc()).all()
    return stores

@router.get("/{code_or_id}", response_model=StoreResponse)
def get_store(code_or_id: str, db: Session = Depends(get_db)):
    """Fetch single store by slug code (e.g. 'nlr', 'gdr') or integer ID."""
    if code_or_id.isdigit():
        store = db.query(Store).filter(Store.id == int(code_or_id)).first()
    else:
        store = db.query(Store).filter(Store.code == code_or_id.lower()).first()
    
    if not store:
        raise HTTPException(status_code=404, detail="Store not found")
    return store

@router.post("", response_model=StoreResponse)
def create_store(payload: StoreCreate, db: Session = Depends(get_db)):
    """Create a new store location."""
    existing = db.query(Store).filter(Store.code == payload.code.lower()).first()
    if existing:
        raise HTTPException(status_code=400, detail="Store code already exists")
    
    store = Store(
        code=payload.code.lower(),
        name=payload.name,
        area=payload.area,
        city=payload.city,
        state=payload.state,
        pincode=payload.pincode,
        phone=payload.phone,
        whatsapp_number=payload.whatsapp_number,
        opening_hours_weekday=payload.opening_hours_weekday,
        opening_hours_sunday=payload.opening_hours_sunday,
        map_link=payload.map_link,
        is_active=payload.is_active
    )
    db.add(store)
    db.commit()
    db.refresh(store)
    return store
