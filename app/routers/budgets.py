from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel
from app.database import get_db
from app.crud.price import get_latest_price
from app.models.price import CommodityType
import json

router = APIRouter(prefix="/budgets", tags=["budgets"])

class BudgetRequest(BaseModel):
    buyer_id: int
    mineral_type: str
    quantity_kg: float
    law_percentage: float
    recovery_percentage: float = 95.0
    freight_cost_pen: float = 0.0
    discounts_percentage: float = 0.0
    taxes_percentage: float = 18.0  # IGV

@router.post("/generate")
def generate_budget(request: BudgetRequest, db: Session = Depends(get_db)):
    # Mapear mineral a commodity
    commodity_map = {
        "oro": CommodityType.GOLD,
        "plata": CommodityType.SILVER,
        "cobre": CommodityType.COPPER
    }
    
    commodity = commodity_map.get(request.mineral_type.lower())
    if not commodity:
        return {"error": "Mineral type not supported"}
    
    # Obtener precios actuales
    metal_price = get_latest_price(db, commodity)
    fx_rate = get_latest_price(db, CommodityType.USD_PEN)
    
    if not metal_price or not fx_rate:
        return {"error": "Precios no disponibles"}
    
    # Cálculos
    usable_kg = request.quantity_kg * (request.law_percentage / 100) * (request.recovery_percentage / 100)
    base_price_usd = metal_price.price * usable_kg
    base_price_pen = base_price_usd * fx_rate.price
    
    discounted_price = base_price_pen * (1 - request.discounts_percentage / 100)
    freight_adjusted = discounted_price + request.freight_cost_pen
    net_before_tax = freight_adjusted
    taxes = net_before_tax * (request.taxes_percentage / 100)
    final_amount = net_before_tax + taxes
    
    details = {
        "usable_kg": usable_kg,
        "base_price_usd": base_price_usd,
        "base_price_pen": base_price_pen,
        "discounted_price": discounted_price,
        "freight_cost_pen": request.freight_cost_pen,
        "net_before_tax": net_before_tax,
        "taxes": taxes,
        "final_amount": final_amount
    }
    
    return {
        "status": "success",
        "buyer_id": request.buyer_id,
        "mineral_type": request.mineral_type,
        "quantity_kg": request.quantity_kg,
        "law_percentage": request.law_percentage,
        "recovery_percentage": request.recovery_percentage,
        "total_amount_pen": final_amount,
        "details": details,
        "metal_price_usd_oz": metal_price.price,
        "fx_rate": fx_rate.price
    }
