from sqlalchemy import Column, Integer, String, Text, DateTime, Enum, Boolean
from sqlalchemy.sql import func
from app.database import Base
import enum

class BuyerStatus(str, enum.Enum):
    VERIFIED = "verified"
    INFORMAL = "informal"
    SUSPICIOUS = "suspicious"
    PENDING = "pending"

class Buyer(Base):
    __tablename__ = "buyers"
    
    id = Column(Integer, primary_key=True, index=True)
    ruc = Column(String(11), unique=True, index=True)
    name = Column(String(255), index=True)
    address = Column(Text)
    phone = Column(String(20))
    email = Column(String(255))
    website = Column(String(255))
    classification = Column(String(50))  # comprador, minería, metalúrgica
    certificates = Column(Text)  # JSON list
    status = Column(Enum(BuyerStatus), default=BuyerStatus.PENDING)
    sunat_verification_url = Column(String(255))
    verification_date = Column(DateTime)
    risk_notes = Column(Text)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())
