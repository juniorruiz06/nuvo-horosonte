from sqlalchemy.orm import Session
from app.models.buyer import Buyer, BuyerStatus
from app.schemas.buyer import BuyerCreate

def get_buyer_by_ruc(db: Session, ruc: str):
    return db.query(Buyer).filter(Buyer.ruc == ruc).first()

def get_buyers(db: Session, skip: int = 0, limit: int = 10):
    return db.query(Buyer).offset(skip).limit(limit).all()

def create_buyer(db: Session, buyer: BuyerCreate):
    db_buyer = Buyer(**buyer.dict())
    db.add(db_buyer)
    db.commit()
    db.refresh(db_buyer)
    return db_buyer

def update_buyer_status(db: Session, buyer_id: int, status: BuyerStatus, risk_notes: str = None):
    db_buyer = db.query(Buyer).filter(Buyer.id == buyer_id).first()
    if db_buyer:
        db_buyer.status = status
        if risk_notes:
            db_buyer.risk_notes = risk_notes
        db.commit()
        db.refresh(db_buyer)
    return db_buyer

def get_verified_buyers(db: Session):
    return db.query(Buyer).filter(Buyer.status == BuyerStatus.VERIFIED).all()
