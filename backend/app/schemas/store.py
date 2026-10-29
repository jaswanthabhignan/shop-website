from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class StoreBase(BaseModel):
    code: str
    name: str
    area: str
    city: str
    state: str = "Andhra Pradesh"
    pincode: str
    phone: str
    whatsapp_number: str
    opening_hours_weekday: str = "09:30–21:30"
    opening_hours_sunday: str = "10:00–20:00"
    map_link: Optional[str] = None
    is_active: bool = True

class StoreCreate(StoreBase):
    pass

class StoreResponse(StoreBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True
