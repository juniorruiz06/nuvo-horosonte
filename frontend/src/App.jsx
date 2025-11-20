import React, { useState, useEffect } from 'react'
import { Toaster } from 'react-hot-toast'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import ConnectionStatus from './components/ConnectionStatus'
import Dashboard from './pages/Dashboard'
import Search from './pages/Search'
import RUCSearch from './pages/RUCSearch'
import Buyers from './pages/Buyers'
import Prices from './pages/Prices'
import Budget from './pages/Budget'
import Chat from './pages/Chat'
import AIAnalysis from './pages/AIAnalysis'
import TaskAssignment from './pages/TaskAssignment'
import { testBackendConnection } from './testConnection'

function App() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [isConnected, setIsConnected] = useState(false)
  const [checkingConnection, setCheckingConnection] = useState(true)

  useEffect(() => {
    checkBackendStatus()
    const interval = setInterval(checkBackendStatus, 5000)
    return () => clearInterval(interval)
  }, [])

  const checkBackendStatus = async () => {
    setCheckingConnection(true)
    const result = await testBackendConnection()
    setIsConnected(result.success)
    setCheckingConnection(false)
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />
      case 'search':
        return <Search />
      case 'ruc-search':
        return <RUCSearch />
      case 'buyers':
        return <Buyers />
      case 'prices':
        return <Prices />
      case 'budget':
        return <Budget />
      case 'chat':
        return <Chat />
      case 'ai-analysis':
        return <AIAnalysis />
      case 'task-assignment':
        return <TaskAssignment />
      default:
        return <Dashboard />
    }
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <Navbar isConnected={isConnected} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <main className="flex-1 overflow-y-auto">
          <div className="p-8">
            {checkingConnection ? (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <div className="flex items-center gap-2">
                  <div className="animate-spin w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full"></div>
                  <span className="text-blue-800 font-semibold">Verificando conexión...</span>
                </div>
              </div>
            ) : (
              <ConnectionStatus isConnected={isConnected} />
            )}
            {renderContent()}
          </div>
        </main>
      </div>
      <Toaster position="bottom-right" />
    </div>
  )
}

export default App
