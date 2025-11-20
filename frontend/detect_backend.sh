#!/usr/bin/env bash
# Detecta la IP del gateway (host desde contenedor) y escribe frontend/.env con VITE_API_URL
set -e

echo "🔎 Detectando IP del gateway (host) desde el contenedor..."

# Obtiene la IP de la puerta de enlace por defecto (funciona en la mayoría de contenedores/dev containers)
GATEWAY_IP=$(ip route 2>/dev/null | awk '/default/ {print $3; exit}')

# Fallbacks comunes
if [ -z "$GATEWAY_IP" ]; then
  # mac/linux host in some environments
  GATEWAY_IP="host.docker.internal"
fi

API_URL="http://${GATEWAY_IP}:8000"
ENV_FILE=".env"

echo "✅ Detectado: ${GATEWAY_IP}"
echo "🔧 Escribiendo ${ENV_FILE} con VITE_API_URL=${API_URL}"

cat > ${ENV_FILE} <<EOF
# Autogenerado por detect_backend.sh
VITE_API_URL=${API_URL}
EOF

echo "✅ Archivo ${ENV_FILE} creado."
echo "📌 Ahora ejecuta: npm run dev (en frontend) y asegúrate que el backend corre en 0.0.0.0:8000"
