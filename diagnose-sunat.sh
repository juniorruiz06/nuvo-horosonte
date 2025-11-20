#!/bin/bash

echo "🔍 Diagnóstico de SUNAT"
echo "======================="
echo ""

# Probar endpoint de RUC
echo "1️⃣  Probando endpoint /sunat/search-ruc/..."
curl -v http://127.0.0.1:8000/sunat/search-ruc/20123456789

echo ""
echo "2️⃣  Probando endpoint /sunat/search-dni/..."
curl -v http://127.0.0.1:8000/sunat/search-dni/12345678

echo ""
echo "3️⃣  Verificando que el backend tiene el router SUNAT..."
curl -s http://127.0.0.1:8000/docs | grep -i "sunat" && echo "✅ SUNAT encontrado en docs" || echo "❌ SUNAT NO encontrado"
