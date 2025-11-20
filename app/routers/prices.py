from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.crud.price import get_latest_prices_all
from app.services.price_fetcher import PriceFetcher

router = APIRouter(prefix="/prices", tags=["prices"])

@router.get("/latest")
def get_latest_prices(db: Session = Depends(get_db)):
    prices = get_latest_prices_all(db)
    return {
        "status": "success",
        "data": prices,
        "message": "Últimas cotizaciones disponibles"
    }

@router.post("/refresh")
def refresh_prices(db: Session = Depends(get_db)):
    PriceFetcher.store_prices(db)
    return {"status": "success", "message": "Precios actualizados"}
