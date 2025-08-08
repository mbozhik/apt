import {unstable_cacheTag as cacheTag, unstable_cacheLife as cacheLife, revalidateTag} from 'next/cache'

import axios from 'axios'

import SheetData from '~~/tire/SheetData'

type SheetDataType = {
  identifiedColumnsInfo: {
    columnIndex: number
    headerValues: string[]
  }[]
  data: {
    [key: string]: string | number
  }[]
}

async function fetchSheetData(token: string): Promise<{data: SheetDataType | null; error: string | null}> {
  'use cache'

  console.log('[fetchSheetData] Starting fetch for token:', token, 'at', new Date().toISOString())

  cacheTag(`sheet-data-${token.toLowerCase()}`)
  cacheLife({
    stale: 604800, // 7 days
    revalidate: 86400, // 1 day
    expire: 1209600, // 14 days
  })

  try {
    const SHEET_URL = process.env.NEXT_PUBLIC_GOOGLE_SHEETS_URL
    if (!SHEET_URL) {
      console.log('[fetchSheetData] ERROR: Google Sheets URL not configured')
      return {data: null, error: 'Google Sheets URL not configured'}
    }

    console.log('[fetchSheetData] Making request to Google Sheets API for token:', token)

    const response = await axios.get<{[key: string]: SheetDataType}>(SHEET_URL, {
      timeout: 20000,

      validateStatus: (status) => status < 500,
    })

    const responseData = response.data

    if (!responseData || !responseData[token]) {
      console.log('[fetchSheetData] ERROR: Data not found for token:', token)
      return {data: null, error: `Data for token "${token}" not found`}
    }

    console.log('[fetchSheetData] SUCCESS: Data fetched for token:', token, 'rows:', responseData[token]?.data?.length || 0)
    return {data: responseData[token], error: null}
  } catch (error) {
    console.error('[fetchSheetData] ERROR fetching sheet data for token:', token, 'at', new Date().toISOString(), error)

    if (axios.isAxiosError(error)) {
      if (error.code === 'ECONNABORTED') {
        console.log('[fetchSheetData] TIMEOUT error for token:', token)
        return {data: null, error: 'The waiting time for a response from Google Sheets has been exceeded. Try again later.'}
      }
      if (error.response) {
        console.log('[fetchSheetData] HTTP error for token:', token, 'status:', error.response.status)
        return {data: null, error: `Server error: ${error.response.status}`}
      } else if (error.request) {
        console.log('[fetchSheetData] NETWORK error for token:', token)
        return {data: null, error: 'Network error or Google Sheets is not responding'}
      }
    }

    console.log('[fetchSheetData] UNKNOWN error for token:', token)
    return {data: null, error: 'Internal server error'}
  }
}

async function revalidateSheetData(token: string): Promise<void> {
  'use server'

  revalidateTag(`sheet-data-${token.toLowerCase()}`)
}

export default async function Sheet({token}: {token: string}) {
  console.log('[Sheet] Component rendering for token:', token, 'at', new Date().toISOString())

  const {data, error} = await fetchSheetData(token)

  console.log('[Sheet] fetchSheetData completed for token:', token, 'hasData:', !!data, 'hasError:', !!error)

  return <SheetData token={token} initialData={data} initialError={error} revalidate={revalidateSheetData} />
}
