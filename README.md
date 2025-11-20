# 🏔️ MINERAL-AGENT

Asistente automatizado para vendedores de minerales en Trujillo, Perú.

## 🚀 Inicio Rápido

### Opción 1: Usando el script de instalación

```bash
bash install.sh
source venv/bin/activate
python setup_db.py
python -m uvicorn app.main:app --reload
```

### Opción 2: Usando Makefile

```bash
make setup
make dev
```

### Opción 3: Manual

```bash
# Crear entorno virtual
python3 -m venv venv
source venv/bin/activate

# Instalar dependencias
pip install -r requirements.txt

# Inicializar base de datos
python setup_db.py

# Iniciar servidor
python -m uvicorn app.main:app --reload
```

## 📋 Requisitos

- Python 3.11+
- pip
- SQLite (incluido en Python)

## 🔧 Configuración

### Variables de entorno (.env)

```env
DATABASE_URL=sqlite:///./mineral_agent.db
GEMINI_API_KEY=tu_api_key_aqui
LOG_LEVEL=INFO
```

## 📚 API Endpoints

- **Documentación interactiva**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc
- **Health check**: http://localhost:8000/health

## 📁 Estructura del Proyecto