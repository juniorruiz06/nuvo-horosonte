from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.config import get_settings
from app.database import Base, engine, init_db
from app.routers import buyers, prices, budgets, chat, sunat
import os

settings = get_settings()

# Inicializar base de datos
init_db()

# Crear tablas
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.api_title,
    version=settings.api_version,
    description="Asistente automatizado para vendedores de minerales en Trujillo, Perú"
)

# CORS - Permitir todas las origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Permitir todos los orígenes
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(buyers.router)
app.include_router(prices.router)
app.include_router(budgets.router)
app.include_router(chat.router)
app.include_router(sunat.router)

# Servir archivos estáticos
if os.path.exists("frontend"):
    app.mount("/static", StaticFiles(directory="frontend"), name="static")

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
            "sunat": "/sunat"
        }
    }

@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "database": "connected",
        "gemini_api": "configured" if settings.gemini_api_key else "not configured"
    }
