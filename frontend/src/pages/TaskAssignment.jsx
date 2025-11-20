import React, { useState, useEffect } from 'react'
import { Send, Loader, CheckCircle, AlertCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import APIService from '../services/api'

export default function TaskAssignment() {
  const [taskType, setTaskType] = useState('search_buyers')
  const [description, setDescription] = useState('')
  const [parameters, setParameters] = useState({
    mineral_type: 'oro',
    location: 'Trujillo'
  })
  const [tasks, setTasks] = useState([])
  const [selectedTaskId, setSelectedTaskId] = useState(null)
  const [loading, setLoading] = useState(false)

  // Cargar tareas al iniciar
  useEffect(() => {
    loadAllTasks()
    const interval = setInterval(loadAllTasks, 3000) // Actualizar cada 3 segundos
    return () => clearInterval(interval)
  }, [])

  const loadAllTasks = async () => {
    try {
      const result = await APIService.get('/tasks/all')
      if (result.success) {
        setTasks(result.data.tasks || [])
      }
    } catch (error) {
      console.error('Error cargando tareas:', error)
    }
  }

  const handleParameterChange = (key, value) => {
    setParameters(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const handleCreateTask = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      let endpoint = ''
      let params = {}

      // Preparar parámetros según el tipo de tarea
      if (taskType === 'search_buyers') {
        endpoint = `/tasks/search-buyers?mineral_type=${parameters.mineral_type}&location=${parameters.location}`
      } else if (taskType === 'generate_budget_buy') {
        endpoint = '/tasks/budget/buy'
        params = {
          weight_kg: parseFloat(parameters.weight_kg || 1),
          mineral_type: parameters.mineral_type,
          law_percentage: parseFloat(parameters.law_percentage || 100),
          recovery_percentage: parseFloat(parameters.recovery_percentage || 95),
          freight_cost: parseFloat(parameters.freight_cost || 0),
          commission_percentage: parseFloat(parameters.commission_percentage || 3),
          price_usd_oz: parseFloat(parameters.price_usd_oz || 2000),
          fx_rate: parseFloat(parameters.fx_rate || 3.70)
        }
      } else if (taskType === 'generate_budget_sell') {
        endpoint = '/tasks/budget/sell'
        params = {
          weight_kg: parseFloat(parameters.weight_kg || 1),
          mineral_type: parameters.mineral_type,
          law_percentage: parseFloat(parameters.law_percentage || 100),
          recovery_percentage: parseFloat(parameters.recovery_percentage || 95),
          transport_cost: parseFloat(parameters.transport_cost || 100),
          intermediary_percentage: parseFloat(parameters.intermediary_percentage || 2),
          taxes_percentage: parseFloat(parameters.taxes_percentage || 5),
          price_usd_oz: parseFloat(parameters.price_usd_oz || 2000),
          fx_rate: parseFloat(parameters.fx_rate || 3.70)
        }
      }

      // Crear tarea
      const result = await APIService.post(endpoint, params)

      if (result.success) {
        toast.success('✅ Tarea creada y en ejecución')
        setDescription('')
        setParameters({ mineral_type: 'oro', location: 'Trujillo' })
        loadAllTasks()
      } else {
        toast.error(result.error || 'Error al crear tarea')
      }
    } catch (error) {
      toast.error('Error al crear tarea')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const selectedTask = tasks.find(t => t.id === selectedTaskId)

  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-bold text-gray-900">🤖 Asignador de Tareas IA</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Formulario de creación de tareas */}
        <div className="lg:col-span-1">
          <form onSubmit={handleCreateTask} className="bg-white rounded-lg shadow-md p-6 space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Tipo de Tarea:
              </label>
              <select
                value={taskType}
                onChange={(e) => setTaskType(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
              >
                <option value="search_buyers">🔍 Buscar Compradores</option>
                <option value="generate_budget_buy">📥 Presupuesto de Compra</option>
                <option value="generate_budget_sell">📤 Presupuesto de Venta</option>
                <option value="analyze_market">📊 Análisis de Mercado</option>
                <option value="verify_company">✔️ Verificar Empresa</option>
                <option value="get_price_analysis">💹 Análisis de Precios</option>
                <option value="generate_report">📄 Generar Reporte</option>
              </select>
            </div>

            {/* Parámetros dinámicos */}
            {taskType === 'search_buyers' && (
              <>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Mineral:
                  </label>
                  <select
                    value={parameters.mineral_type}
                    onChange={(e) => handleParameterChange('mineral_type', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="oro">🟡 Oro</option>
                    <option value="plata">⚪ Plata</option>
                    <option value="cobre">🟠 Cobre</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Ubicación:
                  </label>
                  <input
                    type="text"
                    value={parameters.location}
                    onChange={(e) => handleParameterChange('location', e.target.value)}
                    placeholder="Ej: Trujillo"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </>
            )}

            {taskType.includes('budget') && (
              <>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Mineral:
                  </label>
                  <select
                    value={parameters.mineral_type}
                    onChange={(e) => handleParameterChange('mineral_type', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="oro">🟡 Oro</option>
                    <option value="plata">⚪ Plata</option>
                    <option value="cobre">🟠 Cobre</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Peso (kg):
                  </label>
                  <input
                    type="number"
                    value={parameters.weight_kg || ''}
                    onChange={(e) => handleParameterChange('weight_kg', e.target.value)}
                    placeholder="1.5"
                    step="0.01"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    % Ley:
                  </label>
                  <input
                    type="number"
                    value={parameters.law_percentage || ''}
                    onChange={(e) => handleParameterChange('law_percentage', e.target.value)}
                    placeholder="95"
                    max="100"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Precio USD/oz:
                  </label>
                  <input
                    type="number"
                    value={parameters.price_usd_oz || ''}
                    onChange={(e) => handleParameterChange('price_usd_oz', e.target.value)}
                    placeholder="2000"
                    step="0.01"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-primary to-secondary text-white font-bold py-2 rounded-lg hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  Creando...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Asignar Tarea
                </>
              )}
            </button>
          </form>
        </div>

        {/* Lista de tareas */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-2xl font-bold text-gray-900">📋 Tareas Activas</h2>

          {tasks.length === 0 ? (
            <div className="bg-gray-100 rounded-lg p-6 text-center text-gray-600">
              No hay tareas
            </div>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {tasks.map(task => (
                <button
                  key={task.id}
                  onClick={() => setSelectedTaskId(task.id)}
                  className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                    selectedTaskId === task.id
                      ? 'border-primary bg-primary bg-opacity-10'
                      : 'border-gray-200 hover:border-primary'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-gray-900">{task.type}</p>
                      <p className="text-sm text-gray-600">{task.description}</p>
                    </div>
                    <div>
                      {task.status === 'completed' && (
                        <CheckCircle className="w-6 h-6 text-green-500" />
                      )}
                      {task.status === 'processing' && (
                        <Loader className="w-6 h-6 text-blue-500 animate-spin" />
                      )}
                      {task.status === 'failed' && (
                        <AlertCircle className="w-6 h-6 text-red-500" />
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Detalle de tarea seleccionada */}
      {selectedTask && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">📊 Detalles de la Tarea</h2>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">ID:</p>
                <p className="font-mono text-sm font-semibold">{selectedTask.id}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Estado:</p>
                <p className="font-semibold">
                  {selectedTask.status === 'completed' && '✅ Completada'}
                  {selectedTask.status === 'processing' && '⏳ Procesando'}
                  {selectedTask.status === 'failed' && '❌ Error'}
                  {selectedTask.status === 'pending' && '⏱️ Pendiente'}
                </p>
              </div>
            </div>

            {selectedTask.result && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm font-semibold text-gray-900 mb-2">Resultado:</p>
                <pre className="text-xs overflow-auto max-h-64">
                  {JSON.stringify(selectedTask.result, null, 2)}
                </pre>
              </div>
            )}

            {selectedTask.error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-sm font-semibold text-gray-900 mb-2">Error:</p>
                <p className="text-red-700">{selectedTask.error}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
