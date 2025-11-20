#!/bin/bash

set -e

echo ""
echo "╔══════════════════════════════════════════════════════════╗"
echo "║  🏔️  MINERAL-AGENT - Inicio Rápido                      ║"
echo "╚══════════════════════════════════════════════════════════╝"
echo ""

# Colores
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

# Paso 1: Verificar Python
echo "1️⃣  Verificando Python..."
if ! command -v python3 &> /dev/null; then
    echo -e "${RED}❌ Python 3 no está instalado${NC}"
    exit 1
fi
PYTHON_VERSION=$(python3 --version | cut -d' ' -f2)
echo -e "${GREEN}✅ Python $PYTHON_VERSION${NC}"

# Paso 2: Crear estructura de directorios
echo ""
echo "2️⃣  Creando directorios..."
mkdir -p app/{models,schemas,crud,routers,services,tasks,utils}
mkdir -p frontend logs tests migrations/versions
echo -e "${GREEN}✅ Directorios creados${NC}"

# Paso 3: Instalar dependencias
echo ""
echo "3️⃣  Instalando dependencias..."
if [ -f "requirements.txt" ]; then
    pip install -r requirements.txt
    echo -e "${GREEN}✅ Dependencias instaladas${NC}"
else
    echo -e "${RED}❌ requirements.txt no encontrado${NC}"
    exit 1
fi

# Paso 4: Verificar .env
echo ""
echo "4️⃣  Verificando configuración..."
if [ -f ".env" ]; then
    echo -e "${GREEN}✅ Archivo .env encontrado${NC}"
else
    echo -e "${RED}❌ Archivo .env no encontrado${NC}"
    exit 1
fi

# Paso 5: Inicializar BD
echo ""
echo "5️⃣  Inicializando base de datos..."
if [ -f "setup_db.py" ]; then
    python setup_db.py
    echo -e "${GREEN}✅ Base de datos inicializada${NC}"
else
    echo -e "${BLUE}ℹ️  setup_db.py no encontrado (se creará después)${NC}"
fi

# Resumen
echo ""
echo "╔══════════════════════════════════════════════════════════╗"
echo "║              ✅ ¡Instalación Completada!                ║"
echo "╚══════════════════════════════════════════════════════════╝"
echo ""
echo "🚀 Para iniciar el servidor:"
echo -e "   ${BLUE}python -m uvicorn app.main:app --reload${NC}"
echo ""
echo "📖 Documentación interactiva:"
echo -e "   ${BLUE}http://localhost:8000/docs${NC}"
echo ""
echo "🔍 Verificar instalación:"
echo -e "   ${BLUE}python verify_installation.py${NC}"
echo ""
