// Detectar si estamos en desarrollo o producción
const isDevelopment = import.meta.env.DEV

// En desarrollo, usar localhost
// En producción, usar la URL relativa
export const API_URL = '/api'

console.log('🔧 Frontend Configuration:')
console.log('  API URL (relativo):', API_URL)
console.log('  Vite proxy redirige /api a http://127.0.0.1:8000')
