import { useState, useEffect } from 'react'
import APIService from '../services/api'

/**
 * Hook personalizado para hacer fetch automáticament al montar
 */
export function useFetch(endpoint, options = {}) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      const result = await APIService.get(endpoint)

      if (result.success) {
        setData(result.data)
        setError(null)
      } else {
        setError(result.error)
        setData(null)
      }

      setLoading(false)
    }

    fetchData()
  }, [endpoint])

  return { data, loading, error }
}

/**
 * Hook para realizar operaciones manuales
 */
export function useAPI() {
  const [loading, setLoading] = useState(false)

  const execute = async (method, endpoint, data = null) => {
    setLoading(true)
    try {
      let result
      if (method === 'GET') {
        result = await APIService.get(endpoint)
      } else if (method === 'POST') {
        result = await APIService.post(endpoint, data)
      } else if (method === 'PUT') {
        result = await APIService.put(endpoint, data)
      } else if (method === 'DELETE') {
        result = await APIService.delete(endpoint)
      }

      return result
    } finally {
      setLoading(false)
    }
  }

  return { execute, loading }
}
