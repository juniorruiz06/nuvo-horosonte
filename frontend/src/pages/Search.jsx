import React, { useState } from 'react'
import { Search as SearchIcon } from 'lucide-react'
import BuyerCard from '../components/BuyerCard'
import toast from 'react-hot-toast'

const API_URL = 'http://localhost:8000'

export default function Search() {
  const [mineral, setMineral] = useState('')
  const [city, setCity] = useState('Trujillo')
  const [state, setState] = useState('La Libertad')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)

  const handleSearch = async (e) => {
    e.preventDefault()

    if (!mineral) {
      toast.error('Por favor selecciona un mineral')
      return
    }

    setLoading(true)
    try {
      const response = await fetch(`${API_URL}/buyers/?skip=0&limit=50`)
      const buyers = await response.json()
      setResults(buyers)
      toast.success(`Se encontraron ${buyers.length} compradores`)
    } catch (error) {
      toast.error('Error al buscar compradores')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-bold text-gray-900">🔍 Buscar Compradores de Minerales</h1>

      <form onSubmit={handleSearch} className="bg-white rounded-lg shadow-md p-6 space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Selecciona el mineral:
          </label>
          <select
            value={mineral}
            onChange={(e) => setMineral(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="">-- Seleccionar --</option>
            <option value="oro">🟡 Oro</option>
            <option value="plata">⚪ Plata</option>
            <option value="cobre">🟠 Cobre</option>
            <option value="todos">🔍 Todos</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Ciudad:</label>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Ej: Trujillo"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Región:</label>
            <input
              type="text"
              value={state}
              onChange={(e) => setState(e.target.value)}
              placeholder="Ej: La Libertad"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-primary to-secondary text-white font-bold py-3 rounded-lg hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
        >
          <SearchIcon className="w-5 h-5" />
          {loading ? 'Buscando...' : 'Buscar Compradores'}
        </button>
      </form>

      {results.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            🎯 Se encontraron {results.length} compradores
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.map((buyer) => (
              <BuyerCard key={buyer.id} buyer={buyer} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
