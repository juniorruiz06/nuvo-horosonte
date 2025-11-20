from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, Dict, Any
from app.services.task_agent import (
    TaskAgent,
    TaskType,
)
from app.utils.logger import logger

router = APIRouter(prefix="/tasks", tags=["tasks"])


class TaskRequest(BaseModel):
    """Modelo para crear una tarea"""
    type: str
    description: str
    parameters: Dict[str, Any]


@router.post("/create")
async def create_task(request: TaskRequest):
    """
    Crea una nueva tarea para que la ejecute un agente IA
    
    Tipos de tareas:
    - search_buyers: Buscar compradores
    - generate_budget_buy: Presupuesto de compra
    - generate_budget_sell: Presupuesto de venta
    - analyze_market: Análisis de mercado
    - verify_company: Verificar empresa
    - get_price_analysis: Análisis de precios
    - generate_report: Generar reporte
    """
    try:
        # Validar tipo de tarea
        task_type = TaskType[request.type.upper()]
        
        # Crear tarea
        task_id = TaskAgent.create_task(
            task_type=task_type,
            description=request.description,
            parameters=request.parameters
        )
        
        logger.info(f"✅ Tarea creada: {task_id}")
        
        return {
            "status": "success",
            "task_id": task_id,
            "message": f"Tarea creada y en proceso de ejecución"
        }
    except KeyError:
        raise HTTPException(
            status_code=400,
            detail=f"Tipo de tarea no válido: {request.type}"
        )
    except Exception as e:
        logger.error(f"Error creando tarea: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/status/{task_id}")
async def get_task_status(task_id: str):
    """Obtiene el estado de una tarea"""
    task = TaskAgent.get_task(task_id)
    
    if not task:
        raise HTTPException(status_code=404, detail="Tarea no encontrada")
    
    return {
        "status": "success",
        "task": task.to_dict()
    }


@router.get("/all")
async def get_all_tasks():
    """Obtiene todas las tareas"""
    tasks = TaskAgent.get_all_tasks()
    
    return {
        "status": "success",
        "total": len(tasks),
        "tasks": tasks
    }


# Endpoints específicos para tareas comunes

@router.post("/search-buyers")
async def search_buyers(mineral_type: str, location: str = "Trujillo"):
    """Busca compradores de un mineral"""
    task_id = TaskAgent.create_task(
        task_type=TaskType.SEARCH_BUYERS,
        description=f"Buscar compradores de {mineral_type} en {location}",
        parameters={
            "mineral_type": mineral_type,
            "location": location
        }
    )
    
    return {
        "status": "success",
        "task_id": task_id,
        "message": f"Buscando compradores de {mineral_type}"
    }


@router.post("/budget/buy")
async def generate_budget_buy(
    weight_kg: float,
    mineral_type: str,
    law_percentage: float = 100,
    recovery_percentage: float = 95,
    freight_cost: float = 0,
    commission_percentage: float = 3,
    price_usd_oz: float = 2000,
    fx_rate: float = 3.70
):
    """Genera presupuesto para COMPRA de mineral"""
    task_id = TaskAgent.create_task(
        task_type=TaskType.GENERATE_BUDGET_BUY,
        description=f"Presupuesto de compra: {weight_kg}kg de {mineral_type}",
        parameters={
            "weight_kg": weight_kg,
            "mineral_type": mineral_type,
            "law_percentage": law_percentage,
            "recovery_percentage": recovery_percentage,
            "freight_cost": freight_cost,
            "commission_percentage": commission_percentage,
            "price_usd_oz": price_usd_oz,
            "fx_rate": fx_rate
        }
    )
    
    return {
        "status": "success",
        "task_id": task_id,
        "message": f"Calculando presupuesto de compra"
    }


@router.post("/budget/sell")
async def generate_budget_sell(
    weight_kg: float,
    mineral_type: str,
    law_percentage: float = 100,
    recovery_percentage: float = 95,
    transport_cost: float = 100,
    intermediary_percentage: float = 2,
    taxes_percentage: float = 5,
    price_usd_oz: float = 2000,
    fx_rate: float = 3.70
):
    """Genera presupuesto para VENTA de mineral"""
    task_id = TaskAgent.create_task(
        task_type=TaskType.GENERATE_BUDGET_SELL,
        description=f"Presupuesto de venta: {weight_kg}kg de {mineral_type}",
        parameters={
            "weight_kg": weight_kg,
            "mineral_type": mineral_type,
            "law_percentage": law_percentage,
            "recovery_percentage": recovery_percentage,
            "transport_cost": transport_cost,
            "intermediary_percentage": intermediary_percentage,
            "taxes_percentage": taxes_percentage,
            "price_usd_oz": price_usd_oz,
            "fx_rate": fx_rate
        }
    )
    
    return {
        "status": "success",
        "task_id": task_id,
        "message": f"Calculando presupuesto de venta"
    }
