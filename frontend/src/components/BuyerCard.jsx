import React from 'react'
import { Mail, MapPin, Phone, Globe, Send } from 'lucide-react'

export default function BuyerCard({ buyer }) {
  const statusConfig = {
    verified: { bg: 'bg-green-100', text: 'text-green-800', label: 'Verificado ✅' },
    pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Pendiente ⏳' },
    informal: { bg: 'bg-red-100', text: 'text-red-800', label: 'Informal ⚠️' },
    suspicious: { bg: 'bg-red-200', text: 'text-red-900', label: 'Sospechoso 🚫' },
  }

  const status = statusConfig[buyer.status] || statusConfig.pending

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all p-6 border-l-4 border-primary">
      <div className="mb-3">
        <h3 className="text-lg font-bold text-gray-900">{buyer.name}</h3>
        <p className="text-sm text-gray-600">RUC: {buyer.ruc}</p>
      </div>

      <div className="mb-3">
        <span className="inline-block bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full mr-2">
          {buyer.classification}
        </span>
        <span className={`inline-block ${status.bg} ${status.text} text-xs px-3 py-1 rounded-full font-semibold`}>
          {status.label}
        </span>
      </div>

      <div className="space-y-2 text-sm text-gray-700 mb-4">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-primary" />
          <span>{buyer.address}</span>
        </div>
        <div className="flex items-center gap-2">
          <Phone className="w-4 h-4 text-primary" />
          <span>{buyer.phone}</span>
        </div>
        <div className="flex items-center gap-2">
          <Mail className="w-4 h-4 text-primary" />
          <span className="truncate">{buyer.email}</span>
        </div>
        {buyer.website && (
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-primary" />
            <a href={buyer.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
              Visitar sitio
            </a>
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <a
          href={`mailto:${buyer.email}`}
          className="flex-1 bg-primary text-white px-3 py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-secondary transition-colors text-sm font-semibold"
        >
          <Mail className="w-4 h-4" />
          Email
        </a>
        <a
          href={`https://wa.me/?text=Hola%20${buyer.name},%20soy%20vendedor%20de%20minerales`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 bg-green-500 text-white px-3 py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-green-600 transition-colors text-sm font-semibold"
        >
          <Send className="w-4 h-4" />
          WhatsApp
        </a>
      </div>
    </div>
  )
}
