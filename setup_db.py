#!/usr/bin/env python3
"""
Script para inicializar la base de datos local.
Uso: python setup_db.py
"""

import sys
import os

# Agregar ruta del proyecto
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.database import init_db, SessionLocal, engine
from app.models.buyer import Buyer
from app.models.price import Price
from app.models.budget import Budget
from app.config import get_settings

def create_sample_data():
    """Crea datos de ejemplo para demostración."""
    db = SessionLocal()
    
    try:
        # Verificar si ya existen datos
        existing_buyers = db.query(Buyer).count()
        if existing_buyers > 0:
            print("⚠️  Ya existen datos en la base de datos. Omitiendo datos de ejemplo.")
            return
        
        print("\n📝 Creando datos de ejemplo...")
        
        # Crear compradores de ejemplo
        sample_buyers = [
            Buyer(
                ruc="20123456789",
                name="Minería del Perú S.A.",
                address="Av. Nicolás de Piérola 123, Trujillo, La Libertad",
                phone="+51 44 123456",
                email="contacto@mineriaperu.com",
                website="https://www.mineriaperu.com",
                classification="minería",
                certificates="ISO 9001, ISO 14001",
                status="verified"
            ),
            Buyer(
                ruc="20234567890",
                name="Comprador de Metales Trujillo",
                address="Jr. Mansiche 456, Trujillo, La Libertad",
                phone="+51 44 654321",
                email="compras@metaltrujillo.com",
                website="https://www.metaltrujillo.com",
                classification="comprador",
                certificates="RUC Activo",
                status="verified"
            ),
            Buyer(
                ruc="20345678901",
                name="Metalúrgica La Libertad E.I.R.L.",
                address="Km 5 Panamericana Norte, Trujillo",
                phone="+51 44 789123",
                email="gerencia@metallibertad.pe",
                website="https://www.metallibertad.pe",
                classification="metalúrgica",
                certificates="OSINERGMIN",
                status="pending"
            ),
        ]
        
        for buyer in sample_buyers:
            db.add(buyer)
            print(f"  ✓ Añadido comprador: {buyer.name}")
        
        db.commit()
        print("\n✅ Datos de ejemplo creados exitosamente.")
        
    except Exception as e:
        db.rollback()
        print(f"❌ Error al crear datos de ejemplo: {e}")
    finally:
        db.close()

def main():
    settings = get_settings()
    
    print("\n" + "="*60)
    print("🏔️  MINERAL-AGENT - Inicializador de Base de Datos")
    print("="*60)
    
    print(f"\n📂 Base de datos: {settings.database_url}")
    print(f"🔑 API Gemini: {'✅ Configurada' if settings.gemini_api_key else '❌ No configurada'}")
    print(f"📊 Log level: {settings.log_level}")
    print(f"📁 Log file: {settings.log_file}")
    
    # Crear directorio de logs si no existe
    log_dir = os.path.dirname(settings.log_file)
    if log_dir and not os.path.exists(log_dir):
        os.makedirs(log_dir, exist_ok=True)
        print(f"📁 Directorio de logs creado: {log_dir}")
    
    print("\n⏳ Inicializando base de datos...")
    
    try:
        # Importar todos los modelos
        from app.models import buyer, price, budget
        
        # Inicializar BD
        init_db()
        
        # Crear datos de ejemplo
        create_sample_data()
        
        print("\n" + "="*60)
        print("✅ ¡Base de datos inicializada correctamente!")
        print("="*60)
        print("\n🚀 Para iniciar la aplicación, ejecuta:")
        print("   python -m uvicorn app.main:app --reload")
        print("\n📖 Documentación interactiva: http://localhost:8000/docs")
        print("="*60 + "\n")
        
    except Exception as e:
        print(f"\n❌ Error durante la inicialización: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
