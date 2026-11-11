from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.store import Store
from app.schemas.store import StoreResponse, StoreCreate

router = APIRouter(prefix="/stores", tags=["Stores"])

@router.get("", response_model=List[StoreResponse])
@router.get("/", response_model=List[StoreResponse], include_in_schema=False)
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
@router.post("/", response_model=StoreResponse, include_in_schema=False)
def create_store(payload: StoreCreate, db: Session = Depends(get_db)):
    """Create a new store location."""
    code = payload.code.lower().strip()
    existing = db.query(Store).filter(Store.code == code).first()
    if existing:
        raise HTTPException(status_code=400, detail="Store code already exists")
    
    store_data = payload.model_dump() if hasattr(payload, "model_dump") else payload.dict()
    store_data["code"] = code
    store = Store(**store_data)
    db.add(store)
    db.commit()
    db.refresh(store)
    return store
