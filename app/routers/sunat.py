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
    try:
        logger.info(f"Buscando RUC: {ruc}")
        
        result = SUNATService.search_by_ruc(ruc)
        
        if not result["success"]:
            logger.warning(f"RUC no encontrado: {ruc}")
            raise HTTPException(status_code=404, detail=result["error"])
        
        logger.info(f"RUC encontrado: {ruc}")
        return {
            "status": "success",
            "data": result["data"]
        }
    except Exception as e:
        logger.error(f"Error en search_ruc: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/search-dni/{dni}")
def search_dni(dni: str):
    """
    Busca persona natural por DNI
    
    Ejemplo: GET /sunat/search-dni/12345678
    """
    try:
        logger.info(f"Buscando DNI: {dni}")
        
        result = SUNATService.search_by_dni(dni)
        
        if not result["success"]:
            logger.warning(f"DNI no encontrado: {dni}")
            raise HTTPException(status_code=404, detail=result["error"])
        
        logger.info(f"DNI encontrado: {dni}")
        return {
            "status": "success",
            "data": result["data"]
        }
    except Exception as e:
        logger.error(f"Error en search_dni: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/verify-company")
def verify_company(ruc: str):
    """
    Verifica si una empresa existe y obtiene sus datos
    """
    try:
        result = SUNATService.search_by_ruc(ruc)
        
        return {
            "ruc": ruc,
            "verified": result["success"],
            "data": result["data"],
            "message": result["error"] if not result["success"] else "Empresa verificada"
        }
    except Exception as e:
        logger.error(f"Error en verify_company: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
