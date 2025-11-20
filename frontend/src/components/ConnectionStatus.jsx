import React, { useState } from 'react'
import { AlertCircle, CheckCircle } from 'lucide-react'

export default function ConnectionStatus({ isConnected, apiUrl }) {
  const [showDetails, setShowDetails] = useState(!isConnected)

  if (isConnected) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
        <div className="flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-green-600" />
          <span className="text-green-800 font-semibold">✅ Backend Conectado</span>
        </div>
        <p className="text-green-700 text-sm mt-1">
          Conectado a: <code className="bg-green-100 px-2 py-1 rounded">{apiUrl}</code>
        </p>
      </div>
    )
  }

  return (
    <div className="bg-red-50 border-2 border-red-300 rounded-lg p-4 mb-4">
      <div className="flex items-center gap-2 mb-2">
        <AlertCircle className="w-6 h-6 text-red-600 animate-pulse" />
        <span className="text-red-900 font-bold text-lg">⚠️ Backend No Conectado</span>
      </div>
      
      <p className="text-red-800 mb-3">
        No puedo conectar a: <code className="bg-red-100 px-2 py-1 rounded text-sm">{apiUrl}</code>
      </p>

      <button
        onClick={() => setShowDetails(!showDetails)}
        className="text-red-700 hover:text-red-900 font-semibold text-sm mb-3"
      >
        {showDetails ? '▼ Ocultar instrucciones' : '▶ Ver instrucciones'}
      </button>

      {showDetails && (
        <div className="bg-red-100 p-3 rounded mb-3 space-y-2 text-sm text-red-800">
          <p><strong>🆘 SOLUCIÓN RÁPIDA:</strong></p>
          
          <p><strong>1️⃣ Abre una NUEVA terminal</strong></p>
          
          <p><strong>2️⃣ Ejecuta:</strong></p>
          <code className="bg-red-900 text-yellow-300 px-2 py-1 rounded block font-mono">
            cd /workspaces/nuvo-horosonte
          </code>
          
          <code className="bg-red-900 text-yellow-300 px-2 py-1 rounded block font-mono">
            bash start-backend.sh
          </code>

          <p><strong>3️⃣ Espera a ver "Application startup complete"</strong></p>
          
          <p><strong>4️⃣ Recarga esta página (F5)</strong></p>

          <div className="bg-red-900 text-yellow-300 p-2 rounded mt-2 font-mono text-xs">
            <p><strong>Puertos:</strong></p>
            <p>Backend: 0.0.0.0:8000</p>
            <p>Frontend: 0.0.0.0:3000</p>
            <p>API URL: {apiUrl}</p>
          </div>
        </div>
      )}
    </div>
  )
}
