import {NextRequest, NextResponse} from 'next/server'
import axios from 'axios'

type SheetData = {
  identifiedColumnsInfo: {
    columnIndex: number
    headerValues: string[]
  }[]
  data: {
    [key: string]: string | number
  }[]
}

type ApiResponse = {
  [key: string]: SheetData
}

interface CacheItem {
  data: ApiResponse
  timestamp: number
}

const CACHE_TTL = 7 * 24 * 60 * 60 * 1000 // cache for 1 week (7 days)
const cache = new Map<string, CacheItem>()

function cleanupCache() {
  const now = Date.now()
  for (const [key, item] of cache.entries()) {
    if (now - item.timestamp > CACHE_TTL) {
      cache.delete(key)
    }
  }
}

function getFromCache(key: string): ApiResponse | null {
  const item = cache.get(key)
  if (!item) return null

  if (Date.now() - item.timestamp > CACHE_TTL) {
    cache.delete(key)
    return null
  }

  return item.data
}

function setCache(key: string, data: ApiResponse) {
  cache.set(key, {
    data,
    timestamp: Date.now(),
  })

  if (Math.random() < 0.01) {
    cleanupCache()
  }
}

export async function GET(request: NextRequest, {params}: {params: Promise<{token: string}>}) {
  try {
    const {token} = await params

    if (!token) {
      return NextResponse.json({error: 'Token is required'}, {status: 400})
    }

    const SHEET_URL = process.env.NEXT_PUBLIC_GOOGLE_SHEETS_URL
    if (!SHEET_URL) {
      return NextResponse.json({error: 'Google Sheets URL not configured'}, {status: 500})
    }

    const cacheKey = `sheet_${token}`
    const cachedData = getFromCache(cacheKey)

    if (cachedData && cachedData[token]) {
      console.log(`Cache hit for token: ${token}`)

      return NextResponse.json(cachedData[token], {
        headers: {
          'Cache-Control': 'public, max-age=604800, stale-while-revalidate=86400', // 1 week cache, 1 day stale
          'X-Cache-Status': 'HIT',
        },
      })
    }

    console.log(`Cache miss for token: ${token}, fetching from Google Sheets`)

    const response = await axios.get<ApiResponse>(SHEET_URL, {
      timeout: 10000,
    })

    const responseData = response.data

    if (!responseData || !responseData[token]) {
      return NextResponse.json({error: `Data for token "${token}" not found`}, {status: 404})
    }

    setCache(cacheKey, responseData)

    return NextResponse.json(responseData[token], {
      headers: {
        'Cache-Control': 'public, max-age=604800, stale-while-revalidate=86400', // 1 week cache, 1 day stale
        'X-Cache-Status': 'MISS',
      },
    })
  } catch (error) {
    console.error('Error fetching sheet data:', error)

    if (axios.isAxiosError(error)) {
      if (error.response) {
        return NextResponse.json({error: `Server error: ${error.response.status}`}, {status: error.response.status})
      } else if (error.request) {
        return NextResponse.json({error: 'Network error or server not responding'}, {status: 503})
      }
    }

    return NextResponse.json({error: 'Internal server error'}, {status: 500})
  }
}
