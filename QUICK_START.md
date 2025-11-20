# 🏔️ MINERAL-AGENT - Inicio Rápido

## ⚡ La Forma MÁS FÁCIL (Recomendado)

### Opción 1: Script Automatizado (TODO EN UNO)

Abre una terminal y ejecuta:

```bash
cd /workspaces/nuvo-horosonte
bash start-all.sh
```

Esto:
- ✅ Matará procesos anteriores
- ✅ Iniciará Backend en puerto 8000
- ✅ Iniciará Frontend en puerto 3000
- ✅ Abrirá el navegador automáticamente
- ✅ Mostrará todas las URLs necesarias

**¡Espera 5-10 segundos a que cargue todo!**

---

## 📋 Opción 2: Manual (Dos Terminales)

### Terminal 1 - Backend

```bash
cd /workspaces/nuvo-horosonte
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Esperarás ver algo como:
