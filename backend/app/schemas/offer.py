from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class OfferBase(BaseModel):
    title: str
    discount_badge: str
    coupon_code: str
    description: str
    validity: str
    terms: Optional[str] = None
    is_active: bool = True

class OfferCreate(OfferBase):
    pass

class OfferResponse(OfferBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True
