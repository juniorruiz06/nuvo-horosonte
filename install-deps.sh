#!/bin/bash

echo "🔧 Instalador de Todas las Dependencias"
echo "======================================"
echo ""

# Colores
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

# Paso 1: Instalar Node.js
echo "Paso 1: Instalando Node.js..."
if ! command -v node &> /dev/null; then
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash - > /dev/null 2>&1
    sudo apt-get install -y nodejs > /dev/null 2>&1
    echo -e "${GREEN}✅ Node.js instalado${NC}"
else
    echo -e "${GREEN}✅ Node.js ya está instalado$(node --version)${NC}"
fi

# Paso 2: Limpiar caché npm
echo ""
echo "Paso 2: Limpiando caché de npm..."
npm cache clean --force > /dev/null 2>&1
echo -e "${GREEN}✅ Caché limpiado${NC}"

# Paso 3: Instalar dependencias del frontend
echo ""
echo "Paso 3: Instalando dependencias del frontend..."
cd frontend
rm -rf node_modules package-lock.json 2>/dev/null
npm install
echo -e "${GREEN}✅ Frontend instalado${NC}"
cd ..

# Resumen
echo ""
echo "╔════════════════════════════════════════════════════╗"
echo "║        ✅ ¡Instalación Completada!               ║"
echo "╚════════════════════════════════════════════════════╝"
echo ""
echo -e "${BLUE}Próximas acciones:${NC}"
echo ""
echo "1. Backend:"
echo "   cd /workspaces/nuvo-horosonte"
echo "   python -m uvicorn app.main:app --reload"
echo ""
echo "2. Frontend:"
echo "   cd /workspaces/nuvo-horosonte/frontend"
echo "   npm run dev"
echo ""
echo "3. Acceder:"
echo "   http://localhost:3000"
echo ""
