#!/bin/bash

echo "🏔️  MINERAL-AGENT - Inicializador de Desarrollo"
echo "=================================================="

# Crear estructura de directorios
mkdir -p app/{models,schemas,crud,routers,services,tasks,utils}
mkdir -p frontend
mkdir -p logs
mkdir -p tests

echo "✅ Directorios creados"

# Instalar dependencias
echo ""
echo "📦 Instalando dependencias..."
pip install -r requirements.txt

echo "✅ Dependencias instaladas"

# Inicializar base de datos
echo ""
echo "💾 Inicializando base de datos..."
python setup_db.py

echo ""
echo "=================================================="
echo "✅ ¡Inicialización completada!"
echo ""
echo "Para iniciar el servidor:"
echo "  python -m uvicorn app.main:app --reload"
echo ""
echo "Accede a:"
echo "  📖 http://localhost:8000/docs (Documentación interactiva)"
echo "  💬 http://localhost:8000/health (Estado de salud)"
echo "=================================================="
