import React from 'react'
import { Mountain } from 'lucide-react'

export default function Navbar({ isConnected }) {
  return (
    <nav className="bg-gradient-to-r from-primary to-secondary text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Mountain className="w-8 h-8" />
          <h1 className="text-2xl font-bold">MINERAL-AGENT</h1>
        </div>
        <div className="flex items-center gap-3">
          <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`}></div>
          <span className="text-sm">
            {isConnected ? 'Conectado' : 'Desconectado'}
          </span>
        </div>
      </div>
    </nav>
  )
}
