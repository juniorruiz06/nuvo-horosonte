import React from 'react'
import { 
  Home, Search, Users, TrendingUp, 
  Calculator, MessageCircle, Building2, Zap, Cpu
} from 'lucide-react'

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: Home },
  { id: 'task-assignment', label: 'Asignar Tareas', icon: Cpu },
  { id: 'search', label: 'Buscar Compradores', icon: Search },
  { id: 'ruc-search', label: 'Buscar por RUC/DNI', icon: Building2 },
  { id: 'buyers', label: 'Compradores', icon: Users },
  { id: 'prices', label: 'Cotizaciones', icon: TrendingUp },
  { id: 'budget', label: 'Presupuestos', icon: Calculator },
  { id: 'chat', label: 'Asistente IA', icon: MessageCircle },
]

export default function Sidebar({ activeTab, setActiveTab }) {
  return (
    <aside className="w-64 bg-white shadow-lg overflow-y-auto hidden md:block">
      <div className="p-6 border-b">
        <h3 className="text-lg font-bold text-primary">🎯 Acciones</h3>
      </div>
      <nav className="space-y-2 p-4">
        {menuItems.map((item) => {
          const Icon = item.icon
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                activeTab === item.id
                  ? 'bg-gradient-to-r from-primary to-secondary text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </button>
          )
        })}
      </nav>
    </aside>
  )
}
