#!/bin/bash

set -e  # Salir si hay error

echo ""
echo "╔════════════════════════════════════════════════════════╗"
echo "║   🏔️  MINERAL-AGENT - Instalador de Dependencias      ║"
echo "╚════════════════════════════════════════════════════════╝"
echo ""

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
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

# Verificar Python
echo "📋 Verificando requisitos previos..."
echo ""

if ! command -v python3 &> /dev/null; then
    print_error "Python 3 no está instalado"
    exit 1
fi

PYTHON_VERSION=$(python3 --version | cut -d' ' -f2)
print_status "Python $PYTHON_VERSION encontrado"

# Verificar pip
if ! command -v pip3 &> /dev/null; then
    print_error "pip3 no está instalado"
    exit 1
fi

PIP_VERSION=$(pip3 --version | cut -d' ' -f2)
print_status "pip $PIP_VERSION encontrado"

# Crear entorno virtual si no existe
echo ""
echo "🔧 Configurando entorno virtual..."

if [ ! -d "venv" ]; then
    print_info "Creando entorno virtual..."
    python3 -m venv venv
    print_status "Entorno virtual creado"
else
    print_info "Entorno virtual ya existe"
fi

# Activar entorno virtual
source venv/bin/activate
print_status "Entorno virtual activado"

# Actualizar pip
echo ""
echo "📦 Actualizando pip..."
pip install --upgrade pip setuptools wheel > /dev/null 2>&1
print_status "pip actualizado"

# Instalar dependencias
echo ""
echo "📥 Instalando dependencias de requirements.txt..."
echo ""

if [ ! -f "requirements.txt" ]; then
    print_error "requirements.txt no encontrado"
    exit 1
fi

pip install -r requirements.txt

print_status "Todas las dependencias instaladas correctamente"

# Verificar instalación
echo ""
echo "🔍 Verificando instalación..."
echo ""

PACKAGES=("fastapi" "sqlalchemy" "google.generativeai" "python-dotenv" "pydantic")

for package in "${PACKAGES[@]}"; do
    if python3 -c "import ${package//./_}" 2>/dev/null; then
        print_status "$package instalado"
    else
        print_warning "$package no se pudo verificar"
    fi
done

# Crear directorios necesarios
echo ""
echo "📁 Creando directorios necesarios..."

mkdir -p app/{models,schemas,crud,routers,services,tasks,utils}
mkdir -p frontend
mkdir -p logs
mkdir -p tests
mkdir -p migrations/versions

print_status "Directorios creados"

# Verificar .env
echo ""
echo "🔐 Verificando configuración..."

if [ -f ".env" ]; then
    print_status "Archivo .env encontrado"
    if grep -q "GEMINI_API_KEY" .env; then
        print_status "GEMINI_API_KEY configurada"
    else
        print_warning "GEMINI_API_KEY no está en .env"
    fi
else
    print_warning "Archivo .env no encontrado"
    print_info "Asegúrate de crear .env con tus credenciales"
fi

# Resumen final
echo ""
echo "╔════════════════════════════════════════════════════════╗"
echo "║              ✅ ¡Instalación Completada!              ║"
echo "╚════════════════════════════════════════════════════════╝"
echo ""
echo "📝 Próximos pasos:"
echo ""
echo "  1. Activar entorno virtual:"
echo "     ${BLUE}source venv/bin/activate${NC}"
echo ""
echo "  2. Inicializar base de datos:"
echo "     ${BLUE}python setup_db.py${NC}"
echo ""
echo "  3. Iniciar servidor:"
echo "     ${BLUE}python -m uvicorn app.main:app --reload${NC}"
echo ""
echo "  4. Acceder a documentación:"
echo "     ${BLUE}http://localhost:8000/docs${NC}"
echo ""
echo "════════════════════════════════════════════════════════"
echo ""
