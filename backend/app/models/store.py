from sqlalchemy import Column, Integer, String, Boolean, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base

class Store(Base):
    __tablename__ = "stores"

    id = Column(Integer, primary_key=True, index=True)
    code = Column(String(20), unique=True, index=True, nullable=False) # e.g. 'nlr', 'gdr', 'gnt', 'vja'
    name = Column(String(100), nullable=False) # e.g. 'Nellore', 'Gudur'
    area = Column(String(200), nullable=False) # e.g. 'Trunk Road'
    city = Column(String(100), nullable=False)
    state = Column(String(100), default="Andhra Pradesh")
    pincode = Column(String(20), nullable=False)
    phone = Column(String(50), nullable=False) # e.g. '+91 861 000 0001'
    whatsapp_number = Column(String(50), nullable=False) # e.g. '919000000001'
    opening_hours_weekday = Column(String(50), default="09:30–21:30")
    opening_hours_sunday = Column(String(50), default="10:00–20:00")
    map_link = Column(String(500), nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    enquiries = relationship("Enquiry", back_populates="store")
