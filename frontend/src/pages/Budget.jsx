import React, { useState, useEffect } from 'react'
import { Calculator, Download, Share2 } from 'lucide-react'
import toast from 'react-hot-toast'
import APIService from '../services/api'

export default function Budget() {
  const [buyers, setBuyers] = useState([])
  const [formData, setFormData] = useState({
    buyer_id: '',
    mineral_type: '',
    quantity_kg: '',
    law_percentage: '',
    recovery_percentage: 95,
    freight_cost_pen: 0,
    discounts_percentage: 0,
    taxes_percentage: 18,
  })
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadBuyers()
  }, [])

  const loadBuyers = async () => {
    try {
      const result = await APIService.get('/buyers/?limit=100')
      if (result.success) {
        setBuyers(result.data)
      }
    } catch (error) {
      console.error(error)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'buyer_id' ? parseInt(value) : parseFloat(value) || value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.buyer_id || !formData.mineral_type || !formData.quantity_kg || !formData.law_percentage) {
      toast.error('Por favor completa todos los campos')
      return
    }

    setLoading(true)
    try {
      const result = await APIService.post('/budgets/generate', formData)

      if (result.success) {
        setResult(result.data)
        toast.success('Presupuesto generado correctamente')
      } else {
        toast.error(result.error || 'Error al generar presupuesto')
      }
    } catch (error) {
      toast.error('Error al generar presupuesto')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-bold text-gray-900">💰 Generador de Presupuestos</h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Comprador:</label>
            <select
              name="buyer_id"
              value={formData.buyer_id}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="">-- Seleccionar --</option>
              {buyers.map(buyer => (
                <option key={buyer.id} value={buyer.id}>
                  {buyer.name} ({buyer.ruc})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Mineral:</label>
            <select
              name="mineral_type"
              value={formData.mineral_type}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="">-- Seleccionar --</option>
              <option value="oro">Oro</option>
              <option value="plata">Plata</option>
              <option value="cobre">Cobre</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Cantidad (kg):</label>
            <input
              type="number"
              name="quantity_kg"
              value={formData.quantity_kg}
              onChange={handleChange}
              step="0.01"
              placeholder="0.00"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">% Ley (Pureza):</label>
            <input
              type="number"
              name="law_percentage"
              value={formData.law_percentage}
              onChange={handleChange}
              min="0"
              max="100"
              step="0.01"
              placeholder="95.00"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">% Recuperación:</label>
            <input
              type="number"
              name="recovery_percentage"
              value={formData.recovery_percentage}
              onChange={handleChange}
              min="0"
              max="100"
              step="0.01"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Flete (PEN):</label>
            <input
              type="number"
              name="freight_cost_pen"
              value={formData.freight_cost_pen}
              onChange={handleChange}
              step="0.01"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">% Descuento:</label>
            <input
              type="number"
              name="discounts_percentage"
              value={formData.discounts_percentage}
              onChange={handleChange}
              min="0"
              max="100"
              step="0.01"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">% Impuesto (IGV):</label>
            <input
              type="number"
              name="taxes_percentage"
              value={formData.taxes_percentage}
              onChange={handleChange}
              min="0"
              max="100"
              step="0.01"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-primary to-secondary text-white font-bold py-3 rounded-lg hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
        >
          <Calculator className="w-5 h-5" />
          {loading ? 'Generando...' : 'Generar Presupuesto'}
        </button>
      </form>

      {result && (
        <div className="bg-gradient-to-r from-primary to-secondary text-white rounded-lg shadow-lg p-8 space-y-4">
          <h2 className="text-2xl font-bold">📋 Presupuesto Generado</h2>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="opacity-90">Mineral</p>
              <p className="text-lg font-bold">{result.mineral_type}</p>
            </div>
            <div>
              <p className="opacity-90">Cantidad</p>
              <p className="text-lg font-bold">{result.quantity_kg} kg</p>
            </div>
            <div>
              <p className="opacity-90">% Ley</p>
              <p className="text-lg font-bold">{result.law_percentage}%</p>
            </div>
            <div>
              <p className="opacity-90">Kg Utilizables</p>
              <p className="text-lg font-bold">{result.details?.usable_kg?.toFixed(4)} kg</p>
            </div>
            <div>
              <p className="opacity-90">Precio Unitario</p>
              <p className="text-lg font-bold">${result.metal_price_usd_oz?.toFixed(2)}</p>
            </div>
            <div>
              <p className="opacity-90">Tasa USD/PEN</p>
              <p className="text-lg font-bold">{result.fx_rate?.toFixed(2)}</p>
            </div>
          </div>

          <div className="bg-white bg-opacity-20 rounded-lg p-4 border-2 border-white">
            <p className="opacity-90">MONTO TOTAL</p>
            <p className="text-4xl font-bold">S/ {result.details?.final_amount?.toFixed(2)}</p>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="opacity-90">Antes de Impuestos</p>
              <p className="font-bold">S/ {result.details?.net_before_tax?.toFixed(2)}</p>
            </div>
            <div>
              <p className="opacity-90">Impuestos</p>
              <p className="font-bold">S/ {result.details?.taxes?.toFixed(2)}</p>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button className="flex-1 bg-white text-primary px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors flex items-center justify-center gap-2 font-semibold">
              <Download className="w-5 h-5" />
              Descargar PDF
            </button>
            <button className="flex-1 bg-white text-primary px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors flex items-center justify-center gap-2 font-semibold">
              <Share2 className="w-5 h-5" />
              Compartir
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
