import React, { useState, useEffect } from 'react'
import { RefreshCw } from 'lucide-react'
import toast from 'react-hot-toast'

const API_URL = 'http://localhost:8000'

export default function Prices() {
  const [prices, setPrices] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    refreshPrices()
  }, [])

  const refreshPrices = async () => {
    setLoading(true)
    try {
      const response = await fetch(`${API_URL}/prices/latest`)
      const data = await response.json()
      setPrices(data.data || {})
      toast.success('Cotizaciones actualizadas')
    } catch (error) {
      toast.error('Error al obtener cotizaciones')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const mineralNames = {
    'oro': { name: '🟡 Oro', color: 'from-yellow-400 to-yellow-600' },
    'plata': { name: '⚪ Plata', color: 'from-gray-300 to-gray-500' },
    'cobre': { name: '🟠 Cobre', color: 'from-orange-400 to-orange-600' },
    'usd_pen': { name: '💵 USD/PEN', color: 'from-green-400 to-green-600' },
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold text-gray-900">📈 Cotizaciones de Metales</h1>
        <button
          onClick={refreshPrices}
          disabled={loading}
          className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-secondary transition-colors flex items-center gap-2 font-semibold disabled:opacity-50"
        >
          <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
          Actualizar
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando cotizaciones...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Object.entries(prices).map(([key, value]) => {
            const mineral = mineralNames[key] || { name: key, color: 'from-blue-400 to-blue-600' }
            return (
              <div
                key={key}
                className={`bg-gradient-to-r ${mineral.color} text-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow`}
              >
                <h3 className="text-lg font-bold mb-2">{mineral.name}</h3>
                <div className="text-4xl font-bold mb-2">${value.price.toFixed(2)}</div>
                <div className="text-sm opacity-90">{value.unit || 'USD'}</div>
                <div className="text-xs opacity-75 mt-2">Fuente: {value.source || 'N/A'}</div>
              </div>
            )
          })}
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">📊 Gráfico Histórico</h2>
        <div className="flex items-center justify-center h-64 text-gray-500">
          <p>Gráfico en desarrollo</p>
        </div>
      </div>
    </div>
  )
}
