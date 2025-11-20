import React, { useState } from 'react'
import { Search, TrendingUp, Users, FileText, Loader } from 'lucide-react'
import toast from 'react-hot-toast'
import APIService from '../services/api'

export default function AIAnalysis() {
  const [mineralType, setMineralType] = useState('')
  const [analysisType, setAnalysisType] = useState('providers')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)

  const handleAnalysis = async (e) => {
    e.preventDefault()

    if (!mineralType) {
      toast.error('Por favor selecciona un mineral')
      return
    }

    setLoading(true)
    try {
      let endpoint = ''
      
      if (analysisType === 'providers') {
        endpoint = `/ai/search-providers/${mineralType}`
      } else if (analysisType === 'prices') {
        endpoint = `/ai/analyze-prices/${mineralType}`
      } else if (analysisType === 'report') {
        endpoint = `/ai/generate-report/${mineralType}`
      }

      const result = await APIService.get(endpoint)

      if (result.success) {
        setResult(result.data)
        toast.success('Análisis completado ✅')
      } else {
        toast.error(result.error || 'Error en análisis')
      }
    } catch (error) {
      toast.error('Error al realizar análisis')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-bold text-gray-900">🤖 Análisis con IA</h1>

      <form onSubmit={handleAnalysis} className="bg-white rounded-lg shadow-md p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Selecciona mineral:
            </label>
            <select
              value={mineralType}
              onChange={(e) => setMineralType(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
            >
              <option value="">-- Seleccionar --</option>
              <option value="oro">🟡 Oro</option>
              <option value="plata">⚪ Plata</option>
              <option value="cobre">🟠 Cobre</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Tipo de análisis:
            </label>
            <select
              value={analysisType}
              onChange={(e) => setAnalysisType(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
            >
              <option value="providers">👥 Buscar Proveedores</option>
              <option value="prices">💰 Analizar Precios</option>
              <option value="report">📊 Generar Reporte</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-primary to-secondary text-white font-bold py-3 rounded-lg hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader className="w-5 h-5 animate-spin" />
              Analizando con IA...
            </>
          ) : (
            <>
              <Search className="w-5 h-5" />
              Ejecutar Análisis
            </>
          )}
        </button>
      </form>

      {result && (
        <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
          <h2 className="text-2xl font-bold text-gray-900">📊 Resultados del Análisis</h2>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <pre className="text-sm overflow-auto max-h-96">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>

          <button
            onClick={() => {
              const dataStr = JSON.stringify(result, null, 2)
              const element = document.createElement('a')
              element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(dataStr))
              element.setAttribute('download', `reporte_${mineralType}_${new Date().toISOString()}.json`)
              element.click()
            }}
            className="w-full bg-primary text-white px-4 py-2 rounded-lg hover:bg-secondary transition-colors font-semibold"
          >
            📥 Descargar Reporte
          </button>
        </div>
      )}
    </div>
  )
}
