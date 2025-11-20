// Detectar si estamos en desarrollo o producción
const isDevelopment = import.meta.env.DEV

// En desarrollo, usar localhost
// En producción, usar la URL relativa
export const API_URL = isDevelopment 
  ? 'http://localhost:8000' 
  : import.meta.env.VITE_API_URL || '/api'

console.log('🔧 Configuración:')
console.log('  Entorno:', isDevelopment ? 'Desarrollo' : 'Producción')
console.log('  API URL:', API_URL)
console.log('  Frontend URL:', window.location.origin)
