#!/bin/bash

echo "╔════════════════════════════════════════════════════════════╗"
echo "║  🔍 MINERAL-AGENT - Diagnóstico de Conexión              ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Colores
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

print_ok() { echo -e "${GREEN}✅${NC} $1"; }
print_error() { echo -e "${RED}❌${NC} $1"; }
print_info() { echo -e "${BLUE}ℹ️${NC} $1"; }
print_warning() { echo -e "${YELLOW}⚠️${NC} $1"; }

echo "1️⃣  Verificando que el backend escucha en puerto 8000..."
if ss -ltnp 2>/dev/null | grep -q ":8000"; then
    print_ok "Backend está escuchando en puerto 8000"
    ss -ltnp 2>/dev/null | grep ":8000"
else
    print_error "Backend NO está escuchando en puerto 8000"
    echo "   Por favor inicia: python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000"
fi

echo ""
echo "2️⃣  Verificando que el frontend escucha en puerto 3000..."
if ss -ltnp 2>/dev/null | grep -q ":3000"; then
    print_ok "Frontend está escuchando en puerto 3000"
    ss -ltnp 2>/dev/null | grep ":3000"
else
    print_warning "Frontend NO está escuchando en puerto 3000"
    echo "   Por favor inicia: cd frontend && npm run dev"
fi

echo ""
echo "3️⃣  Probando conexión al backend desde el contenedor..."
if curl -s http://127.0.0.1:8000/health > /dev/null 2>&1; then
    print_ok "Backend responde a /health"
    echo "   Respuesta:"
    curl -s http://127.0.0.1:8000/health | python -m json.tool
else
    print_error "Backend NO responde a http://127.0.0.1:8000/health"
fi

echo ""
echo "4️⃣  Verificando configuración del frontend..."
if [ -f "frontend/.env" ]; then
    print_ok "Archivo frontend/.env existe"
    echo "   Contenido:"
    cat frontend/.env | sed 's/^/      /'
else
    print_warning "Archivo frontend/.env NO existe"
fi

echo ""
echo "5️⃣  Verificando vite.config.js..."
if grep -q "proxy:" frontend/vite.config.js; then
    print_ok "Proxy de Vite configurado"
    echo "   Verificar que la URL sea: http://127.0.0.1:8000"
else
    print_error "Proxy de Vite NO configurado"
fi

echo ""
echo "════════════════════════════════════════════════════════════"
echo "📋 Resumen:"
echo ""
print_info "Para que funcione correctamente:"
print_info "1. Backend debe correr en: 0.0.0.0:8000"
print_info "2. Frontend debe correr en: 0.0.0.0:3000"
print_info "3. Vite proxy debe redirigir /api a http://127.0.0.1:8000"
print_info "4. Abrir navegador en: http://localhost:3000"
echo ""
echo "════════════════════════════════════════════════════════════"
