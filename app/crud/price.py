from sqlalchemy.orm import Session
from sqlalchemy import desc
from app.models.price import Price, CommodityType

def create_price(db: Session, commodity: CommodityType, price: float, unit: str, source: str):
    db_price = Price(commodity=commodity, price=price, unit=unit, source=source)
    db.add(db_price)
    db.commit()
    db.refresh(db_price)
    return db_price

def get_latest_price(db: Session, commodity: CommodityType):
    return db.query(Price).filter(Price.commodity == commodity).order_by(desc(Price.fetched_at)).first()

def get_latest_prices_all(db: Session):
    commodities = [CommodityType.GOLD, CommodityType.SILVER, CommodityType.COPPER, CommodityType.USD_PEN]
    prices = {}
    for commodity in commodities:
        price = get_latest_price(db, commodity)
        if price:
            prices[commodity.value] = {"price": price.price, "unit": price.unit, "fetched_at": price.fetched_at}
    return prices
