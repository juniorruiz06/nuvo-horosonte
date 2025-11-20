from sqlalchemy import Column, Integer, String, Float, Text, DateTime, ForeignKey
from sqlalchemy.sql import func
from app.database import Base

class Budget(Base):
    __tablename__ = "budgets"
    
    id = Column(Integer, primary_key=True, index=True)
    buyer_id = Column(Integer, ForeignKey("buyers.id"))
    mineral_type = Column(String(50))  # oro, plata, cobre
    quantity_kg = Column(Float)
    law_percentage = Column(Float)  # pureza
    recovery_percentage = Column(Float)
    base_price_usd = Column(Float)
    fx_rate = Column(Float)  # USD/PEN
    freight_cost_pen = Column(Float)
    discounts_percentage = Column(Float)
    taxes_percentage = Column(Float)
    total_amount_pen = Column(Float)
    net_amount_pen = Column(Float)
    details_json = Column(Text)  # JSON con detalles de cálculo
    created_at = Column(DateTime, server_default=func.now())
