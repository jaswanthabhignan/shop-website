from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base

class Category(Base):
    __tablename__ = "categories"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False) # 'Air Conditioners'
    slug = Column(String(100), unique=True, index=True, nullable=False) # 'air-conditioners'
    description = Column(Text, nullable=True)
    icon_name = Column(String(50), nullable=True) # Lucide icon name, e.g. 'Wind', 'Tv', 'Refrigerator', 'WashingMachine'
    display_order = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)

    subcategories = relationship("Subcategory", back_populates="category", cascade="all, delete-orphan")
    products = relationship("Product", back_populates="category")

class Subcategory(Base):
    __tablename__ = "subcategories"

    id = Column(Integer, primary_key=True, index=True)
    category_id = Column(Integer, ForeignKey("categories.id", ondelete="CASCADE"), nullable=False)
    name = Column(String(100), nullable=False) # 'Split AC', 'Window AC'
    slug = Column(String(100), unique=True, index=True, nullable=False) # 'split-ac'
    description = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    category = relationship("Category", back_populates="subcategories")
    products = relationship("Product", back_populates="subcategory")
