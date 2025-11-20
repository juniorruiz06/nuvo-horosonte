/**
 * Servicio centralizado para todas las llamadas a la API
 * Usa el proxy de Vite configurado en vite.config.js
 * Todas las solicitudes a /api serán reenviadas al backend
 */

const API_BASE = '/api'

class APIService {
  /**
   * Realiza una solicitud GET
   */
  static async get(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'GET' })
  }

  /**
   * Realiza una solicitud POST
   */
  static async post(endpoint, data, options = {}) {
    return this.request(endpoint, { ...options, method: 'POST', body: JSON.stringify(data) })
  }

  /**
   * Realiza una solicitud PUT
   */
  static async put(endpoint, data, options = {}) {
    return this.request(endpoint, { ...options, method: 'PUT', body: JSON.stringify(data) })
  }

  /**
   * Realiza una solicitud DELETE
   */
  static async delete(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'DELETE' })
  }

  /**
   * Método base para todas las solicitudes
   */
  static async request(endpoint, options = {}) {
    const url = `${API_BASE}${endpoint}`

    const defaultHeaders = {
      'Content-Type': 'application/json',
      ...options.headers
    }

    const config = {
      ...options,
      headers: defaultHeaders
    }

    try {
      console.log(`📤 ${config.method} ${url}`)

      const response = await fetch(url, config)

      console.log(`📥 ${response.status} ${url}`)

      // Si la respuesta no es OK, lanzar error
      if (!response.ok) {
        let errorMessage = `HTTP ${response.status}`
        try {
          const errorData = await response.json()
          errorMessage = errorData.detail || errorMessage
        } catch (e) {
          // Si no podemos parsear JSON, usar mensaje genérico
        }
        throw new Error(errorMessage)
      }

      // Parsear la respuesta JSON
      const data = await response.json()
      return { success: true, data }
    } catch (error) {
      console.error(`❌ Error en ${url}:`, error)

      // Retornar error en formato consistente
      return {
        success: false,
        error: error.message,
        details: error
      }
    }
  }
}

export default APIService
