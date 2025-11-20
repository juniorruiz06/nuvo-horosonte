#!/bin/bash

set -e

echo "🚀 Instalador de Node.js y Dependencias"
echo "========================================"
echo ""

# Colores
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Función para imprimir con color
print_status() {
    echo -e "${GREEN}✅${NC} $1"
}

print_error() {
    echo -e "${RED}❌${NC} $1"
}

print_info() {
    echo -e "${BLUE}ℹ️${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠️${NC} $1"
}

# Verificar si estamos en el directorio correcto
if [ ! -f "frontend/package.json" ]; then
    print_error "frontend/package.json no encontrado"
    print_info "Por favor ejecuta este script desde /workspaces/nuvo-horosonte"
    exit 1
fi

# Paso 1: Actualizar lista de paquetes
echo ""
print_info "Actualizando lista de paquetes..."
sudo apt-get update > /dev/null 2>&1
print_status "Lista actualizada"

# Paso 2: Instalar Node.js y npm
echo ""
print_info "Verificando Node.js..."

if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    print_status "Node.js $NODE_VERSION ya está instalado"
else
    print_info "Instalando Node.js..."
    
    # Agregar repositorio de NodeSource
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash - > /dev/null 2>&1
    
    # Instalar Node.js
    sudo apt-get install -y nodejs > /dev/null 2>&1
    
    NODE_VERSION=$(node --version)
    print_status "Node.js $NODE_VERSION instalado"
fi

# Paso 3: Verificar npm
echo ""
print_info "Verificando npm..."

if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm --version)
    print_status "npm $NPM_VERSION está disponible"
else
    print_error "npm no se encontró"
    exit 1
fi

# Paso 4: Limpiar caché de npm
echo ""
print_info "Limpiando caché de npm..."
npm cache clean --force > /dev/null 2>&1
print_status "Caché limpiado"

# Paso 5: Instalar dependencias del frontend
echo ""
print_info "Instalando dependencias del frontend..."
cd frontend

# Eliminar node_modules y package-lock.json si existen
if [ -d "node_modules" ]; then
    print_info "Eliminando node_modules anterior..."
    rm -rf node_modules
fi

if [ -f "package-lock.json" ]; then
    print_info "Eliminando package-lock.json anterior..."
    rm -f package-lock.json
fi

# Instalar dependencias
npm install

print_status "Dependencias instaladas exitosamente"

cd ..

# Resumen final
echo ""
echo "╔════════════════════════════════════════════════════╗"
echo "║        ✅ ¡Instalación Completada!               ║"
echo "╚════════════════════════════════════════════════════╝"
echo ""
echo "📋 Información del Sistema:"
echo ""
echo "  Node.js: $(node --version)"
echo "  npm: $(npm --version)"
echo ""
echo "🚀 Para iniciar el desarrollo:"
echo ""
echo "  ${BLUE}cd /workspaces/nuvo-horosonte/frontend${NC}"
echo "  ${BLUE}npm run dev${NC}"
echo ""
echo "📖 El frontend estará disponible en:"
echo "  ${BLUE}http://localhost:3000${NC}"
echo ""
echo "════════════════════════════════════════════════════"
echo ""
