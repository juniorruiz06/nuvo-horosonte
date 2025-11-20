import React, { useState, useEffect } from 'react'
import { Users, Coins, TrendingUp } from 'lucide-react'
import StatCard from '../components/StatCard'
import { API_URL } from '../config'

export default function Dashboard() {
  const [stats, setStats] = useState({
    buyers: 0,
    goldPrice: 0,
    silverPrice: 0,
    copperPrice: 0
  })

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      const buyersRes = await fetch(`${API_URL}/buyers/?limit=100`)
      const buyers = await buyersRes.json()

      const pricesRes = await fetch(`${API_URL}/prices/latest`)
      const pricesData = await pricesRes.json()

      setStats({
        buyers: buyers.length || 0,
        goldPrice: pricesData.data?.oro?.price || 0,
        silverPrice: pricesData.data?.plata?.price || 0,
        copperPrice: pricesData.data?.cobre?.price || 0,
      })
    } catch (error) {
      console.error('Error loading dashboard:', error)
    }
  }

  const statCards = [
    {
      title: 'Compradores Verificados',
      value: stats.buyers,
      icon: Users,
      color: 'bg-blue-500'
    },
    {
      title: 'Precio Oro (USD/oz)',
      value: `$${stats.goldPrice.toFixed(2)}`,
      icon: Coins,
      color: 'bg-yellow-500'
    },
    {
      title: 'Precio Plata (USD/oz)',
      value: `$${stats.silverPrice.toFixed(2)}`,
      icon: Coins,
      color: 'bg-gray-400'
    },
    {
      title: 'Precio Cobre (USD/oz)',
      value: `$${stats.copperPrice.toFixed(2)}`,
      icon: TrendingUp,
      color: 'bg-orange-500'
    }
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">📊 Dashboard</h1>
        <p className="text-gray-600">Bienvenido a MINERAL-AGENT</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => (
          <StatCard
            key={index}
            title={card.title}
            value={card.value}
            icon={card.icon}
            color={card.color}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">🏆 Últimas Búsquedas</h2>
          <div className="text-gray-600">No hay búsquedas recientes</div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">⚡ Información Rápida</h2>
          <div className="space-y-2 text-sm text-gray-700">
            <p><strong>📍 Ubicación:</strong> Trujillo, La Libertad, Perú</p>
            <p><strong>🏭 Minerales:</strong> Oro, Plata, Cobre</p>
            <p><strong>🔍 Estado:</strong> Sistema Operativo</p>
            <p><strong>🕐 Última Actualización:</strong> {new Date().toLocaleTimeString('es-PE')}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
