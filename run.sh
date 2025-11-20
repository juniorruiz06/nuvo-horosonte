#!/bin/bash

echo "🏔️  MINERAL-AGENT - Sistema de ejecución"
echo "========================================"
echo ""

# Verificar que estamos en el directorio correcto
if [ ! -f "requirements.txt" ]; then
    echo "❌ Error: requirements.txt no encontrado"
    echo "Por favor ejecuta este script desde /workspaces/nuvo-horosonte"
    exit 1
fi

# Crear directorios si no existen
mkdir -p app/{models,schemas,crud,routers,services,tasks,utils}
mkdir -p frontend
mkdir -p logs
mkdir -p tests

echo "📦 Instalando dependencias..."
pip install -r requirements.txt

echo ""
echo "✅ Instalación completada"
echo ""
echo "💾 Inicializando base de datos..."
python setup_db.py

echo ""
echo "🚀 Iniciando servidor..."
echo "📖 Documentación: http://localhost:8000/docs"
echo ""

python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
