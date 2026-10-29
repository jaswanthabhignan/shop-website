from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base

class Enquiry(Base):
    __tablename__ = "enquiries"

    id = Column(Integer, primary_key=True, index=True)
    store_id = Column(Integer, ForeignKey("stores.id"), nullable=True, index=True)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=True, index=True)
    
    customer_name = Column(String(100), nullable=False)
    customer_mobile = Column(String(20), nullable=False) # 10-digit number
    enquiry_type = Column(String(50), default="call_back") # 'call_back', 'whatsapp_click', 'general_contact'
    message = Column(Text, nullable=True) # "Interested in Godrej 1.5 Ton AC"
    
    status = Column(String(50), default="pending", index=True) # 'pending', 'contacted', 'completed', 'cancelled'
    admin_notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    store = relationship("Store", back_populates="enquiries")
    product = relationship("Product", back_populates="enquiries")
