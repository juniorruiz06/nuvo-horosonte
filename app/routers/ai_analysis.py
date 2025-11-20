from fastapi import APIRouter, HTTPException
import asyncio
from app.services.ai_agents import (
    AIAgent,
    ProviderSearchAgent,
    PriceAnalysisAgent,
    ScrapingAgent,
    ReportAgent
)
from app.utils.logger import logger

router = APIRouter(prefix="/ai", tags=["ai-analysis"])


@router.get("/search-providers/{mineral_type}")
async def search_providers(mineral_type: str, location: str = "Trujillo"):
    """
    Busca proveedores de minerales usando IA
    
    Ejemplo: GET /ai/search-providers/oro?location=Trujillo
    """
    try:
        logger.info(f"Buscando proveedores de {mineral_type}")
        result = await ProviderSearchAgent.search_providers(mineral_type, location)
        
        if result["success"]:
            return {
                "status": "success",
                "data": result
            }
        else:
            raise HTTPException(status_code=500, detail=result.get("error", "Error desconocido"))
    except Exception as e:
        logger.error(f"Error en búsqueda de proveedores: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/analyze-prices/{mineral_type}")
async def analyze_prices(mineral_type: str):
    """
    Analiza precios de minerales usando múltiples IA
    
    Ejemplo: GET /ai/analyze-prices/oro
    """
    try:
        logger.info(f"Analizando precios de {mineral_type}")
        result = await PriceAnalysisAgent.analyze_prices(mineral_type)
        
        if result["success"]:
            return {
                "status": "success",
                "data": result
            }
        else:
            raise HTTPException(status_code=500, detail=result.get("error", "Error desconocido"))
    except Exception as e:
        logger.error(f"Error en análisis de precios: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/generate-report/{mineral_type}")
async def generate_report(mineral_type: str):
    """
    Genera reporte completo del mercado mineral
    
    Ejemplo: GET /ai/generate-report/oro
    """
    try:
        logger.info(f"Generando reporte para {mineral_type}")
        result = await ReportAgent.generate_market_report(mineral_type)
        
        if result["success"]:
            return {
                "status": "success",
                "data": result
            }
        else:
            raise HTTPException(status_code=500, detail=result.get("error", "Error desconocido"))
    except Exception as e:
        logger.error(f"Error generando reporte: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/ask-claude")
async def ask_claude(query: str, context: str = ""):
    """
    Realiza pregunta a Claude 4 Sonnet
    """
    try:
        result = AIAgent.claude_search(query, context)
        return {
            "status": "success" if result["success"] else "error",
            "data": result
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/ask-gpt4")
async def ask_gpt4(data: dict, analysis_type: str = "general"):
    """
    Realiza análisis con GPT-4o
    """
    try:
        result = AIAgent.gpt4_analyze(data, analysis_type)
        return {
            "status": "success" if result["success"] else "error",
            "data": result
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
