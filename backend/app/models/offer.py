from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime
from datetime import datetime
from app.database import Base

class Offer(Base):
    __tablename__ = "offers"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), nullable=False) # 'Welcome offer: 10% off, up to ₹2,000'
    discount_badge = Column(String(100), nullable=False) # '10% off, up to ₹2,000'
    coupon_code = Column(String(50), nullable=False, unique=True, index=True) # 'WELCOME10'
    description = Column(Text, nullable=False) # 'Use code WELCOME10 at the billing counter.'
    validity = Column(String(100), nullable=False) # 'Valid 1 Apr 2026 – 31 Mar 2027 · at all stores'
    terms = Column(Text, nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
