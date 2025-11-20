#!/bin/bash

echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║  🏔️  MINERAL-AGENT - Iniciador Completo del Sistema      ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Colores
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Funciones
print_success() { echo -e "${GREEN}✅${NC} $1"; }
print_error() { echo -e "${RED}❌${NC} $1"; }
print_info() { echo -e "${BLUE}ℹ️${NC} $1"; }
print_warning() { echo -e "${YELLOW}⚠️${NC} $1"; }

# Validaciones
if [ ! -f "requirements.txt" ]; then
    print_error "No estás en /workspaces/nuvo-horosonte"
    exit 1
fi

# Limpieza de puertos
cleanup_ports() {
    print_info "Limpiando puertos..."
    lsof -ti:8000 | xargs kill -9 2>/dev/null || true
    lsof -ti:3000 | xargs kill -9 2>/dev/null || true
    sleep 1
}

cleanup_ports

echo ""
echo "════════════════════════════════════════════════════════════"
echo "PASO 1️⃣  - Iniciando BACKEND FastAPI"
echo "════════════════════════════════════════════════════════════"
echo ""

print_info "Verificando dependencias Python..."
if ! python3 -c "import fastapi" 2>/dev/null; then
    print_warning "Instalando dependencias..."
    pip install -r requirements.txt > /dev/null 2>&1
fi

print_info "Inicializando base de datos..."
python setup_db.py > /dev/null 2>&1 || true

print_success "Iniciando Backend en puerto 8000..."
echo ""

# Iniciar backend en background
cd /workspaces/nuvo-horosonte
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000 > /tmp/backend.log 2>&1 &
BACKEND_PID=$!

echo "Backend PID: $BACKEND_PID"
sleep 3

# Verificar si backend está corriendo
if kill -0 $BACKEND_PID 2>/dev/null; then
    print_success "Backend iniciado correctamente"
    echo -e "${GREEN}📍 URL Backend: http://localhost:8000${NC}"
    echo -e "${GREEN}📖 Documentación: http://localhost:8000/docs${NC}"
else
    print_error "Backend no se pudo iniciar"
    cat /tmp/backend.log
    exit 1
fi

echo ""
echo "════════════════════════════════════════════════════════════"
echo "PASO 2️⃣  - Iniciando FRONTEND React"
echo "════════════════════════════════════════════════════════════"
echo ""

print_info "Verificando dependencias Node.js..."
if [ ! -d "frontend/node_modules" ]; then
    print_warning "Instalando dependencias npm..."
    cd frontend
    npm install > /dev/null 2>&1
    cd ..
fi

print_success "Iniciando Frontend en puerto 3000..."
echo ""

# Iniciar frontend en background
cd frontend
npm run dev > /tmp/frontend.log 2>&1 &
FRONTEND_PID=$!

echo "Frontend PID: $FRONTEND_PID"
sleep 3

echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║       ✅ ¡SISTEMA INICIADO CORRECTAMENTE!               ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""
echo "📋 SERVICIOS ACTIVOS:"
echo ""
echo "  🔵 Backend FastAPI"
echo "     📍 API: http://localhost:8000"
echo "     📖 Docs: http://localhost:8000/docs"
echo "     Status: CORRIENDO ✅"
echo ""
echo "  🟣 Frontend React"
echo "     📍 URL: http://localhost:3000"
echo "     Status: CORRIENDO ✅"
echo ""
echo "════════════════════════════════════════════════════════════"
echo ""
echo "🌐 Abriendo navegador en 5 segundos..."
sleep 5

# Abrir navegador
if command -v xdg-open > /dev/null; then
    xdg-open "http://localhost:3000"
elif command -v open > /dev/null; then
    open "http://localhost:3000"
else
    echo "Por favor abre: http://localhost:3000"
fi

echo ""
echo "📝 Para detener todo, presiona Ctrl+C"
echo ""

# Mantener procesos activos
wait
