import React, { useState, useRef, useEffect } from 'react'
import { Send } from 'lucide-react'
import toast from 'react-hot-toast'

const API_URL = 'http://localhost:8000'

export default function Chat() {
  const [messages, setMessages] = useState([
    { id: 1, sender: 'bot', text: '¡Hola! Soy MINERAL-AGENT, tu asistente inteligente. ¿En qué puedo ayudarte hoy?' }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async () => {
    if (!input.trim()) return

    const userMessage = {
      id: messages.length + 1,
      sender: 'user',
      text: input
    }
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setLoading(true)

    try {
      const response = await fetch(`${API_URL}/chat/ask`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: input,
          context: 'Soy un vendedor de minerales en Trujillo, Perú'
        })
      })

      const data = await response.json()
      const botMessage = {
        id: messages.length + 2,
        sender: 'bot',
        text: data.response || 'No pude procesar tu pregunta'
      }
      setMessages(prev => [...prev, botMessage])
    } catch (error) {
      toast.error('Error al conectar con el asistente')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const quickActions = [
    'Analiza el mercado del oro en Perú',
    '¿Cuáles son los mejores compradores de minerales en Trujillo?',
    'Genera una plantilla de correo para contactar compradores',
    'Genera un mensaje WhatsApp profesional',
  ]

  return (
    <div className="space-y-6 flex flex-col h-full">
      <h1 className="text-4xl font-bold text-gray-900">💬 Asistente IA (Gemini)</h1>

      <div className="bg-white rounded-lg shadow-md flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map(msg => (
            <div
              key={msg.id}
              className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs px-4 py-2 rounded-lg ${
                  msg.sender === 'user'
                    ? 'bg-primary text-white rounded-br-none'
                    : 'bg-gray-100 text-gray-900 rounded-bl-none border border-gray-200'
                }`}
              >
                <p className="text-sm">{msg.text}</p>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 text-gray-900 px-4 py-2 rounded-lg border border-gray-200">
                <div className="flex gap-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="border-t border-gray-200 p-6 space-y-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Escribe tu pregunta..."
              disabled={loading}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-100"
            />
            <button
              onClick={handleSendMessage}
              disabled={loading || !input.trim()}
              className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-secondary transition-colors disabled:opacity-50 flex items-center gap-2 font-semibold"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
        <h3 className="font-bold text-gray-900">⚡ Acciones Rápidas</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {quickActions.map((action, index) => (
            <button
              key={index}
              onClick={() => {
                setInput(action)
              }}
              className="text-left px-4 py-3 border-2 border-primary text-primary rounded-lg hover:bg-primary hover:text-white transition-colors font-semibold text-sm"
            >
              {action}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
