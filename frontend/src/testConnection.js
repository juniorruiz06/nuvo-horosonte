import { API_URL } from './config'

export async function testBackendConnection() {
  const fullUrl = `${API_URL}/health`
  console.log('🔍 Probando conexión al backend...')
  console.log('  URL:', fullUrl)

  try {
    console.log('  Enviando solicitud GET...')
    const response = await fetch(fullUrl, { 
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })

    console.log('  Respuesta recibida:', response.status, response.statusText)

    if (response.ok) {
      const data = await response.json()
      console.log('✅ Conexión exitosa al backend:', data)
      return { success: true, data }
    } else {
      console.error('❌ Error en la respuesta del backend:', response.status)
      return { success: false, error: `HTTP ${response.status}` }
    }
  } catch (error) {
    console.error('❌ Error conectando al backend:', error)
    console.error('  Tipo:', error.constructor.name)
    console.error('  Mensaje:', error.message)
    return { success: false, error: error.message }
  }
}
