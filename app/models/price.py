from sqlalchemy import Column, Integer, String, Float, DateTime, Enum
from sqlalchemy.sql import func
from app.database import Base
import enum

class CommodityType(str, enum.Enum):
    GOLD = "oro"
    SILVER = "plata"
    COPPER = "cobre"
    USD_PEN = "usd_pen"

class Price(Base):
    __tablename__ = "prices"
    
    id = Column(Integer, primary_key=True, index=True)
    commodity = Column(Enum(CommodityType), index=True)
    price = Column(Float)
    unit = Column(String(50))  # USD/oz, USD/kg, PEN/USD
    source = Column(String(100))
    fetched_at = Column(DateTime, server_default=func.now(), index=True)
    created_at = Column(DateTime, server_default=func.now())
