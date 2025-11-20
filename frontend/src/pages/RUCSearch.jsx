import React, { useState } from 'react'
import { Search, Building2, User, AlertCircle, CheckCircle, Loader } from 'lucide-react'
import toast from 'react-hot-toast'
import { API_URL } from '../config'

export default function RUCSearch() {
  const [searchType, setSearchType] = useState('ruc')
  const [searchQuery, setSearchQuery] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [debugInfo, setDebugInfo] = useState(null)

  const handleSearch = async (e) => {
    e.preventDefault()

    if (!searchQuery.trim()) {
      toast.error('Por favor ingresa un RUC o DNI')
      return
    }

    setLoading(true)
    setDebugInfo(null)
    
    try {
      let endpoint = ''
      let validationError = ''

      if (searchType === 'ruc') {
        if (searchQuery.length !== 11 || !/^\d+$/.test(searchQuery)) {
          validationError = 'El RUC debe tener 11 dígitos'
        }
        endpoint = `/api/sunat/search-ruc/${searchQuery}`
      } else {
        if (searchQuery.length !== 8 || !/^\d+$/.test(searchQuery)) {
          validationError = 'El DNI debe tener 8 dígitos'
        }
        endpoint = `/api/sunat/search-dni/${searchQuery}`
      }

      if (validationError) {
        toast.error(validationError)
        setLoading(false)
        return
      }

      const debugLog = {
        timestamp: new Date().toISOString(),
        searchType,
        query: searchQuery,
        endpoint,
        apiUrl: API_URL
      }

      console.log('🔍 Iniciando búsqueda SUNAT:', debugLog)
      setDebugInfo(debugLog)

      // Realizar la solicitud
      const response = await fetch(endpoint, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      console.log('📊 Respuesta recibida:', response.status, response.statusText)

      const data = await response.json()

      if (response.ok) {
        console.log('✅ Datos encontrados:', data)
        setResult({
          success: true,
          data: data.data
        })
        toast.success('✅ Datos encontrados en SUNAT')
      } else {
        console.error('❌ Error en la respuesta:', data)
        setResult({
          success: false,
          error: data.detail || 'No se encontraron resultados'
        })
        toast.error(data.detail || 'No se encontraron resultados')
      }
    } catch (error) {
      console.error('❌ Error en la solicitud:', {
        type: error.constructor.name,
        message: error.message,
        stack: error.stack
      })

      setDebugInfo(prev => ({
        ...prev,
        error: {
          type: error.constructor.name,
          message: error.message
        }
      }))

      setResult({
        success: false,
        error: 'Error de conexión. Verifica que el backend está corriendo.'
      })

      toast.error('Error al conectar con SUNAT')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-bold text-gray-900">🔍 Buscar en SUNAT</h1>

      <form onSubmit={handleSearch} className="bg-white rounded-lg shadow-md p-6 space-y-4">
        {/* Selector de tipo de búsqueda */}
        <div className="flex gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              value="ruc"
              checked={searchType === 'ruc'}
              onChange={(e) => {
                setSearchType(e.target.value)
                setSearchQuery('')
                setResult(null)
              }}
              className="w-4 h-4"
            />
            <Building2 className="w-5 h-5" />
            <span className="font-semibold">Buscar por RUC</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              value="dni"
              checked={searchType === 'dni'}
              onChange={(e) => {
                setSearchType(e.target.value)
                setSearchQuery('')
                setResult(null)
              }}
              className="w-4 h-4"
            />
            <User className="w-5 h-5" />
            <span className="font-semibold">Buscar por DNI</span>
          </label>
        </div>

        {/* Input de búsqueda */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            {searchType === 'ruc' ? 'Ingresa el RUC (11 dígitos)' : 'Ingresa el DNI (8 dígitos)'}
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value.replace(/\D/g, ''))}
              maxLength={searchType === 'ruc' ? 11 : 8}
              placeholder={searchType === 'ruc' ? 'Ej: 20123456789' : 'Ej: 12345678'}
              disabled={loading}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-100"
            />
          </div>
        </div>

        {/* Botón de búsqueda */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-primary to-secondary text-white font-bold py-3 rounded-lg hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader className="w-5 h-5 animate-spin" />
              Buscando...
            </>
          ) : (
            <>
              <Search className="w-5 h-5" />
              Buscar en SUNAT
            </>
          )}
        </button>
      </form>

      {/* Debug Info */}
      {debugInfo && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <details className="cursor-pointer">
            <summary className="font-semibold text-blue-900">🔧 Información de Debug</summary>
            <pre className="mt-2 text-xs bg-blue-900 text-blue-100 p-2 rounded overflow-auto">
              {JSON.stringify(debugInfo, null, 2)}
            </pre>
          </details>
        </div>
      )}

      {/* Resultados */}
      {result && result.success && (
        <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle className="w-6 h-6 text-green-500" />
            <h2 className="text-2xl font-bold text-gray-900">✅ Datos Encontrados</h2>
          </div>

          {searchType === 'ruc' && result.data && (
            <div className="space-y-3 bg-blue-50 p-4 rounded-lg">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">RUC</p>
                  <p className="text-lg font-bold text-gray-900">{result.data.ruc}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Estado</p>
                  <p className="text-lg font-bold text-green-600">{result.data.status}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-600">Razón Social</p>
                <p className="text-lg font-bold text-gray-900">{result.data.business_name || result.data.name}</p>
              </div>
              {result.data.address && (
                <div>
                  <p className="text-sm text-gray-600">Dirección</p>
                  <p className="text-gray-900">{result.data.address}</p>
                </div>
              )}
            </div>
          )}

          {searchType === 'dni' && result.data && (
            <div className="space-y-3 bg-green-50 p-4 rounded-lg">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">DNI</p>
                  <p className="text-lg font-bold text-gray-900">{result.data.dni}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Estado</p>
                  <p className="text-lg font-bold text-green-600">{result.data.status}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-600">Nombres</p>
                <p className="text-lg font-bold text-gray-900">{result.data.name}</p>
              </div>
            </div>
          )}

          <button className="w-full bg-primary text-white px-4 py-2 rounded-lg hover:bg-secondary transition-colors font-semibold">
            ➕ Agregar como Comprador
          </button>
        </div>
      )}

      {/* Error */}
      {result && !result.success && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center gap-2 mb-4">
            <AlertCircle className="w-6 h-6 text-red-500" />
            <h2 className="text-2xl font-bold text-gray-900">❌ Error</h2>
          </div>
          <p className="text-red-600 font-semibold">{result.error}</p>
          <p className="text-gray-600 mt-2">Por favor verifica el número e intenta nuevamente.</p>
        </div>
      )}
    </div>
  )
}
