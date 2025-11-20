from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class BuyerBase(BaseModel):
    ruc: str
    name: str
    address: str
    phone: str
    email: str
    website: Optional[str] = None
    classification: str
    certificates: Optional[str] = None

class BuyerCreate(BuyerBase):
    pass

class BuyerResponse(BuyerBase):
    id: int
    status: str
    verification_date: Optional[datetime]
    risk_notes: Optional[str]
    created_at: datetime
    
    class Config:
        from_attributes = True
