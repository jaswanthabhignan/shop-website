from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.offer import Offer
from app.schemas.offer import OfferResponse

router = APIRouter(prefix="/offers", tags=["Offers"])

@router.get("", response_model=List[OfferResponse])
def get_offers(db: Session = Depends(get_db)):
    """Fetch all active coupon offers and promotions."""
    offers = db.query(Offer).filter(Offer.is_active == True).order_by(Offer.id.asc()).all()
    return offers
