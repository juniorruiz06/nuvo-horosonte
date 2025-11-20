from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import get_settings
from app.database import Base, engine, init_db
from app.routers import buyers, prices, budgets, chat, sunat, tasks

settings = get_settings()

# Inicializar base de datos
init_db()

app = FastAPI(
    title=settings.api_title,
    version=settings.api_version,
    description="Asistente automatizado para vendedores de minerales en Trujillo, Perú"
)

# ✅ CORS configurado correctamente
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # En producción: ["http://tu-dominio.com"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
)

# Routers
app.include_router(buyers.router)
app.include_router(prices.router)
app.include_router(budgets.router)
app.include_router(chat.router)
app.include_router(sunat.router)
app.include_router(tasks.router)  # Nuevo router de tareas

@app.get("/")
def root():
    return {
        "status": "operational",
        "service": "MINERAL-AGENT",
        "version": settings.api_version,
        "endpoints": {
            "docs": "/docs",
            "buyers": "/buyers",
            "prices": "/prices",
            "budgets": "/budgets",
            "chat": "/chat",
            "sunat": "/sunat",
            "ai_analysis": "/ai-analysis"
        }
    }

@app.get("/health")
def health_check():
    """Endpoint de verificación de salud del backend"""
    return {
        "status": "healthy",
        "service": "MINERAL-AGENT",
        "database": "connected",
        "gemini_api": "configured" if settings.gemini_api_key else "not configured"
    }
