#!/usr/bin/env python3
"""
Script para verificar que todo está instalado correctamente.
"""

import sys
import os

def check_package(package_name, import_name=None):
    """Verifica si un paquete está instalado."""
    if import_name is None:
        import_name = package_name.replace("-", "_")
    
    try:
        __import__(import_name)
        print(f"  ✅ {package_name}")
        return True
    except ImportError:
        print(f"  ❌ {package_name}")
        return False

def check_files():
    """Verifica que los archivos necesarios existen."""
    required_files = [
        "requirements.txt",
        ".env",
        "app/main.py",
        "app/config.py",
        "app/database.py",
    ]
    
    print("\n📁 Verificando archivos...")
    all_exist = True
    for file in required_files:
        if os.path.exists(file):
            print(f"  ✅ {file}")
        else:
            print(f"  ❌ {file} - NO ENCONTRADO")
            all_exist = False
    
    return all_exist

def check_env():
    """Verifica las variables de entorno."""
    print("\n🔐 Verificando variables de entorno...")
    
    if not os.path.exists(".env"):
        print("  ❌ Archivo .env no encontrado")
        return False
    
    from dotenv import load_dotenv
    load_dotenv()
    
    required_vars = [
        "DATABASE_URL",
        "GEMINI_API_KEY",
        "LOG_LEVEL",
    ]
    
    all_set = True
    for var in required_vars:
        value = os.getenv(var)
        if value:
            print(f"  ✅ {var}")
        else:
            print(f"  ❌ {var} - NO CONFIGURADA")
            all_set = False
    
    return all_set

def main():
    print("\n" + "="*60)
    print("🏔️  MINERAL-AGENT - Verificador de Instalación")
    print("="*60)
    
    print("\n📦 Verificando paquetes Python...")
    packages = [
        ("fastapi", "fastapi"),
        ("sqlalchemy", "sqlalchemy"),
        ("pydantic", "pydantic"),
        ("google-generativeai", "google.generativeai"),
        ("python-dotenv", "dotenv"),
        ("requests", "requests"),
        ("beautifulsoup4", "bs4"),
    ]
    
    packages_ok = sum(check_package(pkg, imp) for pkg, imp in packages)
    
    files_ok = check_files()
    env_ok = check_env()
    
    print("\n" + "="*60)
    
    if packages_ok == len(packages) and files_ok and env_ok:
        print("✅ ¡Todo está correctamente configurado!")
        print("\n🚀 Para iniciar el servidor:")
        print("   python -m uvicorn app.main:app --reload")
        print("\n📖 Documentación disponible en:")
        print("   http://localhost:8000/docs")
        return 0
    else:
        print("⚠️  Hay problemas en la configuración")
        print("\n📋 Pendiente:")
        if packages_ok < len(packages):
            print("  • Instalar dependencias: pip install -r requirements.txt")
        if not files_ok:
            print("  • Verificar estructura de archivos")
        if not env_ok:
            print("  • Configurar variables en .env")
        return 1

if __name__ == "__main__":
    sys.exit(main())
