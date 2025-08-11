import SheetData from '~~/tire/SheetTable'

import axios from 'axios'

export type SheetTable = {
  identifiedColumnsInfo: {
    columnIndex: number
    headerValues: string[]
  }[]
  data: {
    [key: string]: string | number
  }[]
}

export type CachedSheet = {
  id: string
  token: string
  data: SheetTable
  created_at: string
  updated_at: string
}

type CachedSheetResponse = {
  data: SheetTable
  cached?: boolean
  stale?: boolean
  lastUpdated?: string
  error?: string
}

async function getSheetData(token: string): Promise<{data: SheetTable | null; error: string | null; cached?: boolean; stale?: boolean}> {
  try {
    const baseUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000'

    const response = await axios.get<CachedSheetResponse>(`${baseUrl}/api/tire/${encodeURIComponent(token)}`, {
      timeout: 20000,
    })

    const apiResponse = response.data

    if (apiResponse.error) {
      return {data: null, error: apiResponse.error}
    }

    return {
      data: apiResponse.data,
      error: null,
      cached: apiResponse.cached,
      stale: apiResponse.stale,
    }
  } catch (error) {
    console.error('Error fetching sheet data:', error)

    if (axios.isAxiosError(error)) {
      if (error.code === 'ECONNABORTED') {
        return {data: null, error: 'Request timeout. Please try again.'}
      }
      if (error.response) {
        const errorData = error.response.data as {error?: string}
        return {data: null, error: errorData.error || `Server error: ${error.response.status}`}
      }
      if (error.request) {
        return {data: null, error: 'Network error. Please check your connection.'}
      }
    }

    return {data: null, error: 'Internal server error'}
  }
}

export default async function Sheet({token}: {token: string}) {
  const {data, error, cached, stale} = await getSheetData(token)

  return <SheetData token={token} initialData={data} initialError={error} cached={cached} stale={stale} />
}
