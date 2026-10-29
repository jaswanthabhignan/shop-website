from sqlalchemy import Column, Integer, String, Text, ForeignKey, Boolean, Float, DateTime, JSON
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base

class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False, index=True)
    slug = Column(String(255), unique=True, index=True, nullable=False)
    brand = Column(String(100), nullable=False, index=True)
    model = Column(String(100), nullable=False)
    sku = Column(String(100), nullable=False)
    
    category_id = Column(Integer, ForeignKey("categories.id"), nullable=False, index=True)
    subcategory_id = Column(Integer, ForeignKey("subcategories.id"), nullable=True, index=True)

    selling_price = Column(Float, nullable=False, default=0.0) # e.g. 25990
    mrp = Column(Float, nullable=False, default=0.0) # e.g. 31690
    discount_percent = Column(Integer, default=0) # e.g. 17
    
    image_url = Column(String(500), nullable=True)
    short_description = Column(String(500), nullable=True)
    description = Column(Text, nullable=True)
    warranty_info = Column(String(255), default="12 months warranty. Keep the GST invoice from the store for warranty service.")
    
    # JSON fields for flexible specs and feature lists
    key_features = Column(JSON, default=list) # e.g. ["Copper coil", "Dust filter", "Inverter compressor"]
    specifications = Column(JSON, default=dict) # e.g. {"tonnage": "1.5 ton", "star_rating": 3, "inverter": false}

    is_featured = Column(Boolean, default=False, index=True)
    is_price_drop = Column(Boolean, default=False, index=True)
    is_available = Column(Boolean, default=True)
    
    created_at = Column(DateTime, default=datetime.utcnow)

    category = relationship("Category", back_populates="products")
    subcategory = relationship("Subcategory", back_populates="products")
    enquiries = relationship("Enquiry", back_populates="product")
