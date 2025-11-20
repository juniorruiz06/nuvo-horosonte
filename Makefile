.PHONY: help install setup dev backend frontend clean install-node

help:
	@echo "🏔️  MINERAL-AGENT - Comandos disponibles"
	@echo ""
	@echo "  make install-node  - Instalar Node.js y dependencias"
	@echo "  make install       - Instalar todas las dependencias"
	@echo "  make setup         - Setup completo (install + db-init)"
	@echo "  make backend       - Iniciar servidor backend"
	@echo "  make frontend      - Iniciar servidor frontend"
	@echo "  make dev           - Iniciar ambos servidores (requiere 2 terminales)"
	@echo "  make clean         - Limpiar archivos temporales"
	@echo ""

install-node:
	@echo "📦 Instalando Node.js..."
	@bash setup-node.sh

install:
	@echo "📦 Instalando dependencias..."
	@pip install -r requirements.txt
	@cd frontend && npm install

setup: install
	@echo "💾 Inicializando base de datos..."
	@python setup_db.py

backend:
	@echo "🚀 Iniciando backend..."
	@python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

frontend:
	@echo "🚀 Iniciando frontend..."
	@cd frontend && npm run dev

dev:
	@echo "🚀 Iniciar ambos servidores:"
	@echo "   Terminal 1: make backend"
	@echo "   Terminal 2: make frontend"
	@echo "   Navegador: http://localhost:3000"

clean:
	@echo "🧹 Limpiando archivos temporales..."
	@find . -type d -name __pycache__ -exec rm -rf {} + 2>/dev/null || true
	@find . -type f -name "*.pyc" -delete
	@cd frontend && rm -rf node_modules .vite dist 2>/dev/null || true
	@echo "✅ Limpieza completada"

format:
	@echo "🎨 Formateando código..."
	@black app/ setup_db.py
	@isort app/ setup_db.py
	@echo "✅ Código formateado"

lint:
	@echo "🔍 Verificando código..."
	@flake8 app/ setup_db.py
