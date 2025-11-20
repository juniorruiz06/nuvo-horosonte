from fastapi import APIRouter, HTTPException
from app.services.sunat_service import SUNATService
from app.utils.logger import logger

router = APIRouter(prefix="/sunat", tags=["sunat"])

@router.get("/search-ruc/{ruc}")
def search_ruc(ruc: str):
    """
    Busca empresa por RUC en SUNAT
    
    Ejemplo: GET /sunat/search-ruc/20123456789
    """
    logger.info(f"Buscando RUC: {ruc}")
    
    result = SUNATService.search_by_ruc(ruc)
    
    if not result["success"]:
        raise HTTPException(status_code=404, detail=result["error"])
    
    return {
        "status": "success",
        "data": result["data"]
    }

@router.get("/search-dni/{dni}")
def search_dni(dni: str):
    """
    Busca persona natural por DNI
    
    Ejemplo: GET /sunat/search-dni/12345678
    """
    logger.info(f"Buscando DNI: {dni}")
    
    result = SUNATService.search_by_dni(dni)
    
    if not result["success"]:
        raise HTTPException(status_code=404, detail=result["error"])
    
    return {
        "status": "success",
        "data": result["data"]
    }

@router.post("/verify-company")
def verify_company(ruc: str):
    """
    Verifica si una empresa existe y obtiene sus datos
    """
    result = SUNATService.search_by_ruc(ruc)
    
    return {
        "ruc": ruc,
        "verified": result["success"],
        "data": result["data"],
        "message": result["error"] if not result["success"] else "Empresa verificada"
    }
