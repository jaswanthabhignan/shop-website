from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from app.schemas.store import StoreResponse

class EnquiryCreate(BaseModel):
    store_id: Optional[int] = None
    product_id: Optional[int] = None
    customer_name: str = Field(..., min_length=2, max_length=100)
    customer_mobile: str = Field(..., min_length=10, max_length=15) # e.g. "9876543210"
    enquiry_type: str = "call_back" # 'call_back' or 'whatsapp_click' or 'general_contact'
    message: Optional[str] = None

class EnquiryUpdateStatus(BaseModel):
    status: str # 'pending', 'contacted', 'completed', 'cancelled'
    admin_notes: Optional[str] = None

class ProductSimple(BaseModel):
    id: int
    name: str
    slug: str
    brand: str
    model: str
    selling_price: float
    image_url: Optional[str] = None

    class Config:
        from_attributes = True

class EnquiryResponse(BaseModel):
    id: int
    store_id: Optional[int]
    product_id: Optional[int]
    customer_name: str
    customer_mobile: str
    enquiry_type: str
    message: Optional[str]
    status: str
    admin_notes: Optional[str]
    created_at: datetime
    store: Optional[StoreResponse] = None
    product: Optional[ProductSimple] = None

    class Config:
        from_attributes = True
