#!/bin/bash

echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║  🏔️  MINERAL-AGENT - Frontend React                     ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Colores
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

# Matar procesos en puerto 3000
echo "Limpiando puerto 3000..."
lsof -ti:3000 | xargs kill -9 2>/dev/null || true
sleep 1

cd frontend

echo ""
echo "📦 Verificando dependencias Node.js..."
if [ ! -d "node_modules" ]; then
    echo "Instalando dependencias npm..."
    npm install > /dev/null 2>&1
fi

echo ""
echo -e "${GREEN}✅ Iniciando Frontend en 0.0.0.0:3000${NC}"
echo ""
echo "URLs disponibles:"
echo -e "${BLUE}  🌐 Frontend: http://localhost:3000${NC}"
echo ""
echo "Presiona Ctrl+C para detener"
echo ""

# Iniciar frontend
npm run dev
