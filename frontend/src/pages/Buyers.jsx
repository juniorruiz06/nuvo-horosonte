import React, { useState, useEffect } from 'react'
import { RefreshCw, Search } from 'lucide-react'
import BuyerCard from '../components/BuyerCard'
import toast from 'react-hot-toast'
import APIService from '../services/api'

export default function Buyers() {
  const [buyers, setBuyers] = useState([])
  const [filteredBuyers, setFilteredBuyers] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadBuyers()
  }, [])

  useEffect(() => {
    const filtered = buyers.filter(buyer =>
      buyer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      buyer.ruc.includes(searchTerm)
    )
    setFilteredBuyers(filtered)
  }, [searchTerm, buyers])

  const loadBuyers = async () => {
    setLoading(true)
    try {
      const result = await APIService.get('/buyers/?skip=0&limit=100')

      if (result.success) {
        setBuyers(result.data)
        setFilteredBuyers(result.data)
        toast.success(`Se cargaron ${result.data.length} compradores`)
      } else {
        toast.error(result.error || 'Error al cargar compradores')
        setBuyers([])
      }
    } catch (error) {
      toast.error('Error al cargar compradores')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-bold text-gray-900">🤝 Compradores Verificados</h1>

      <div className="bg-white rounded-lg shadow-md p-6 flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Buscar por nombre o RUC..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
        <button
          onClick={loadBuyers}
          className="bg-gray-200 text-gray-900 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors flex items-center gap-2 font-semibold"
        >
          <RefreshCw className="w-5 h-5" />
          Actualizar
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando compradores...</p>
        </div>
      ) : filteredBuyers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBuyers.map((buyer) => (
            <BuyerCard key={buyer.id} buyer={buyer} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg shadow-md">
          <p className="text-gray-600">No hay compradores registrados</p>
        </div>
      )}
    </div>
  )
}
