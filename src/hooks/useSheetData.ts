import {useState, useEffect, useCallback, useRef} from 'react'
import axios, {AxiosError} from 'axios'

type SheetData = {
  identifiedColumnsInfo: {
    columnIndex: number
    headerValues: string[]
  }[]
  data: {
    [key: string]: string | number
  }[]
}

interface UseSheetDataOptions {
  enabled?: boolean
  retryCount?: number
  retryDelay?: number
}

interface UseSheetDataReturn {
  data: SheetData | null
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
  isFromCache: boolean
}

const DEFAULT_RETRY_COUNT = 3
const DEFAULT_RETRY_DELAY = 1000

export function useSheetData(token: string, options: UseSheetDataOptions = {}): UseSheetDataReturn {
  const {enabled = true, retryCount = DEFAULT_RETRY_COUNT, retryDelay = DEFAULT_RETRY_DELAY} = options

  const [data, setData] = useState<SheetData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isFromCache, setIsFromCache] = useState(false)

  const abortControllerRef = useRef<AbortController | null>(null)
  const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const isInitializedRef = useRef(false)

  const fetchData = useCallback(
    async (attempt = 0): Promise<void> => {
      if (!token) {
        setError('Token не предоставлен')
        setLoading(false)
        return
      }

      // Отменяем предыдущий запрос
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }

      abortControllerRef.current = new AbortController()

      try {
        setLoading(true)
        setError(null)

        // Делаем запрос к нашему API route
        const response = await axios.get<SheetData>(`/api/sheets/${token}`, {
          signal: abortControllerRef.current.signal,
          timeout: 15000, // 15 секунд таймаут
        })

        const responseData = response.data

        // Проверяем заголовок кэша
        const cacheStatus = response.headers['x-cache-status']
        setIsFromCache(cacheStatus === 'HIT')

        setData(responseData)
        setError(null)
      } catch (err) {
        if (axios.isCancel(err)) {
          // Запрос был отменен, не обрабатываем как ошибку
          return
        }

        const axiosError = err as AxiosError
        let errorMessage = 'Неизвестная ошибка'

        if (axiosError.response) {
          // Сервер ответил с кодом ошибки
          const responseData = axiosError.response.data as any
          if (responseData && responseData.error) {
            errorMessage = responseData.error
          } else {
            errorMessage = `Ошибка сервера: ${axiosError.response.status}`
          }
        } else if (axiosError.request) {
          // Запрос был сделан, но ответа не было
          errorMessage = 'Сеть недоступна или сервер не отвечает'
        } else {
          // Ошибка при настройке запроса
          errorMessage = axiosError.message || 'Ошибка при выполнении запроса'
        }

        // Пытаемся повторить запрос
        if (attempt < retryCount) {
          console.warn(`Попытка ${attempt + 1} неудачна, повторяем через ${retryDelay}мс:`, errorMessage)

          retryTimeoutRef.current = setTimeout(() => {
            fetchData(attempt + 1)
          }, retryDelay * Math.pow(2, attempt)) // Экспоненциальная задержка

          return
        }

        // Если все попытки исчерпаны, показываем ошибку
        setError(errorMessage)
        console.error('Ошибка загрузки данных Google Sheets:', err)
      } finally {
        setLoading(false)
      }
    },
    [token, retryCount, retryDelay],
  )

  const refetch = useCallback(async () => {
    await fetchData(0)
  }, [fetchData])

  useEffect(() => {
    if (!enabled || !token || isInitializedRef.current) return

    isInitializedRef.current = true
    fetchData()

    // Cleanup функция
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current)
      }
      isInitializedRef.current = false
    }
  }, [enabled, token, fetchData])

  return {
    data,
    loading,
    error,
    refetch,
    isFromCache,
  }
}
