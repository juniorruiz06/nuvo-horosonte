# 🏔️ MINERAL-AGENT - Guía de Instalación

## Requisitos Previos

- Ubuntu 24.04.3 LTS (ya disponible en el dev container)
- Acceso a internet
- Permisos de sudo

## Instalación Rápida

### Opción 1: Script Automatizado (Recomendado)

```bash
cd /workspaces/nuvo-horosonte
bash setup-node.sh
```

Este script hará automáticamente:
- ✅ Instalar/verificar Node.js 20
- ✅ Instalar/verificar npm
- ✅ Limpiar caché de npm
- ✅ Instalar todas las dependencias
- ✅ Mostrar información de estado

### Opción 2: Instalación Manual

Si prefieres instalar paso a paso:

```bash
# 1. Actualizar sistema
sudo apt-get update
sudo apt-get upgrade -y

# 2. Instalar Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# 3. Verificar instalación
node --version  # Debería mostrar v20.x.x
npm --version   # Debería mostrar 10.x.x

# 4. Instalar dependencias del frontend
cd /workspaces/nuvo-horosonte/frontend
npm install

# 5. Iniciar servidor de desarrollo
npm run dev
```

## Iniciar la Aplicación

### Terminal 1 - Backend (FastAPI)

```bash
cd /workspaces/nuvo-horosonte

# Instalar dependencias Python (si no lo has hecho)
pip install -r requirements.txt

# Inicializar base de datos
python setup_db.py

# Iniciar servidor
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Terminal 2 - Frontend (React)

```bash
cd /workspaces/nuvo-horosonte/frontend

# Instalar dependencias (si no lo has hecho)
npm install

# Iniciar servidor de desarrollo
npm run dev
```

### Terminal 3 - Abrir en navegador

```bash
# Espera a que ambos servidores estén corriendo, luego:
"$BROWSER" http://localhost:3000
```

## Verificación de la Instalación

```bash
# Verificar Node.js
node --version
npm --version

# Verificar estructura del frontend
ls -la /workspaces/nuvo-horosonte/frontend/

# Verificar que npm reconoce las dependencias
npm list --depth=0
```

## Solución de Problemas

### Error: "npm: command not found"

```bash
# Reinstalar Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### Error: "EACCES: permission denied"

```bash
# Limpiar caché y reinstalar
npm cache clean --force
cd /workspaces/nuvo-horosonte/frontend
rm -rf node_modules package-lock.json
npm install
```

### Error: "Port 3000 already in use"

```bash
# Encontrar proceso usando puerto 3000
lsof -i :3000

# Matar proceso (reemplaza PID con el número mostrado)
kill -9 <PID>

# O usar otro puerto
npm run dev -- --port 3001
```

### Error: "Cannot find module"

```bash
# Verificar package.json
cat /workspaces/nuvo-horosonte/frontend/package.json

# Reinstalar dependencias
cd /workspaces/nuvo-horosonte/frontend
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

## URLs Importantes

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **Swagger Docs**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## Scripts Disponibles

### Frontend

```bash
npm run dev      # Inicia servidor de desarrollo
npm run build    # Compila para producción
npm run preview  # Preview de la compilación
npm start        # Alias para dev
```

### Backend

```bash
python -m uvicorn app.main:app --reload  # Servidor de desarrollo
python setup_db.py                        # Inicializar BD
python verify_installation.py             # Verificar instalación
```

## Estructura del Proyecto

