#!/bin/bash

set -e

echo "╔════════════════════════════════════════════════════╗"
echo "║  🏔️  MINERAL-AGENT - Inicializador Completo      ║"
echo "╚════════════════════════════════════════════════════╝"
echo ""

# Colores
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Función para imprimir
print_status() { echo -e "${GREEN}✅${NC} $1"; }
print_info() { echo -e "${BLUE}ℹ️${NC} $1"; }
print_warning() { echo -e "${YELLOW}⚠️${NC} $1"; }

# Verificar directorio
if [ ! -f "requirements.txt" ] || [ ! -f "frontend/package.json" ]; then
    echo "❌ No estás en /workspaces/nuvo-horosonte"
    exit 1
fi

# Paso 1: Backend
echo ""
echo "════════════════════════════════════════════════════"
echo "1️⃣  Iniciando Backend FastAPI"
echo "════════════════════════════════════════════════════"
echo ""

print_info "Verificando dependencias Python..."
if ! python3 -c "import fastapi" 2>/dev/null; then
    print_warning "Instalando dependencias Python..."
    pip install -r requirements.txt > /dev/null
fi

print_info "Inicializando base de datos..."
python setup_db.py > /dev/null 2>&1 || true

print_status "Iniciando servidor Backend en puerto 8000..."
echo ""
echo -e "${BLUE}Backend iniciado. Mantén esta terminal abierta.${NC}"
echo -e "${BLUE}Presiona Ctrl+C para detener${NC}"
echo ""

# Iniciar backend en background
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000 &
BACKEND_PID=$!

sleep 2

# Paso 2: Frontend
if [ -t 1 ]; then
    echo ""
    echo "════════════════════════════════════════════════════"
    print_warning "Para el Frontend, abre OTRA terminal y ejecuta:"
    echo ""
    echo -e "${BLUE}  cd /workspaces/nuvo-horosonte/frontend${NC}"
    echo -e "${BLUE}  npm run dev${NC}"
    echo ""
    echo "════════════════════════════════════════════════════"
    echo ""
fi

# Resumen
echo ""
echo "╔════════════════════════════════════════════════════╗"
echo "║         🚀 Sistema Iniciado Correctamente         ║"
echo "╚════════════════════════════════════════════════════╝"
echo ""
echo "📋 Servicios Activos:"
echo ""
echo "  ✅ Backend FastAPI"
echo "     📍 URL: http://localhost:8000"
echo "     📖 Docs: http://localhost:8000/docs"
echo ""
echo "  ⏳ Frontend React (Abre otra terminal)"
echo "     📍 URL: http://localhost:3000"
echo ""
echo "════════════════════════════════════════════════════"
echo ""

# Mantener proceso activo
wait $BACKEND_PID
