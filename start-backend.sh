#!/bin/bash

echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║  🏔️  MINERAL-AGENT - Backend FastAPI                    ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Colores
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

# Matar procesos en puerto 8000
echo "Limpiando puerto 8000..."
lsof -ti:8000 | xargs kill -9 2>/dev/null || true
sleep 1

echo ""
echo "📦 Verificando dependencias Python..."
if ! python3 -c "import fastapi" 2>/dev/null; then
    echo "Instalando dependencias..."
    pip install -r requirements.txt > /dev/null
fi

echo ""
echo "💾 Inicializando base de datos..."
python setup_db.py > /dev/null 2>&1 || true

echo ""
echo -e "${GREEN}✅ Iniciando Backend en 0.0.0.0:8000${NC}"
echo ""
echo "URLs disponibles:"
echo -e "${BLUE}  📍 API: http://localhost:8000${NC}"
echo -e "${BLUE}  📖 Docs: http://localhost:8000/docs${NC}"
echo -e "${BLUE}  📖 ReDoc: http://localhost:8000/redoc${NC}"
echo ""
echo "Presiona Ctrl+C para detener"
echo ""

# Iniciar backend en 0.0.0.0 (todas las interfaces)
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
