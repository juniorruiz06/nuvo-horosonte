from pydantic import BaseModel
from datetime import datetime

class PriceResponse(BaseModel):
    commodity: str
    price: float
    unit: str
    source: str
    fetched_at: datetime
    
    class Config:
        from_attributes = True
