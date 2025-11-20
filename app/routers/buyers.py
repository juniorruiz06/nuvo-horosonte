from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.crud import buyer as crud_buyer
from app.schemas.buyer import BuyerCreate, BuyerResponse
from app.services.sunat_verifier import SUNATVerifier
from app.models.buyer import BuyerStatus

router = APIRouter(prefix="/buyers", tags=["buyers"])

@router.post("/", response_model=BuyerResponse)
def create_buyer(buyer: BuyerCreate, db: Session = Depends(get_db)):
    db_buyer = crud_buyer.get_buyer_by_ruc(db, ruc=buyer.ruc)
    if db_buyer:
        raise HTTPException(status_code=400, detail="Buyer with this RUC already exists")
    return crud_buyer.create_buyer(db=db, buyer=buyer)

@router.get("/", response_model=list[BuyerResponse])
def list_buyers(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    return crud_buyer.get_buyers(db, skip=skip, limit=limit)

@router.get("/{buyer_id}", response_model=BuyerResponse)
def get_buyer(buyer_id: int, db: Session = Depends(get_db)):
    db_buyer = db.query(crud_buyer.Buyer).filter(crud_buyer.Buyer.id == buyer_id).first()
    if not db_buyer:
        raise HTTPException(status_code=404, detail="Buyer not found")
    return db_buyer

@router.post("/{buyer_id}/verify")
def verify_buyer(buyer_id: int, db: Session = Depends(get_db)):
    db_buyer = db.query(crud_buyer.Buyer).filter(crud_buyer.Buyer.id == buyer_id).first()
    if not db_buyer:
        raise HTTPException(status_code=404, detail="Buyer not found")
    
    verification = SUNATVerifier.verify_ruc(db_buyer.ruc)
    
    if verification.get("verified"):
        crud_buyer.update_buyer_status(db, buyer_id, BuyerStatus.VERIFIED)
    else:
        crud_buyer.update_buyer_status(db, buyer_id, BuyerStatus.SUSPICIOUS, 
                                       risk_notes=verification.get("error"))
    
    return {"ruc": db_buyer.ruc, "verification": verification}

@router.get("/verified/list")
def get_verified_buyers(db: Session = Depends(get_db)):
    return crud_buyer.get_verified_buyers(db)
