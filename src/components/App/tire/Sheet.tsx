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

  cacheLife({
    stale: 604800, // 7 days
    revalidate: 86400, // 1 day
    expire: 1209600, // 14 days
  })

  try {
    const SHEET_URL = process.env.NEXT_PUBLIC_GOOGLE_SHEETS_URL
    if (!SHEET_URL) {
      return {data: null, error: 'Google Sheets URL not configured'}
    }

    cacheTag(`sheet-data-${token.toLowerCase()}`)

    const response = await axios.get<{[key: string]: SheetDataType}>(SHEET_URL, {
      timeout: 20000,

      validateStatus: (status) => status < 500,
    })

    const responseData = response.data

    if (!responseData || !responseData[token]) {
      return {data: null, error: `Data for token "${token}" not found`}
    }

    return {data: responseData[token], error: null}
  } catch (error) {
    console.error('Error fetching sheet data:', error)

    if (axios.isAxiosError(error)) {
      if (error.code === 'ECONNABORTED') {
        return {data: null, error: 'The waiting time for a response from Google Sheets has been exceeded. Try again later.'}
      }
      if (error.response) {
        return {data: null, error: `Server error: ${error.response.status}`}
      } else if (error.request) {
        return {data: null, error: 'Network error or Google Sheets is not responding'}
      }
    }

    return {data: null, error: 'Internal server error'}
  }
}

async function revalidateSheetData(token: string): Promise<void> {
  'use server'

  revalidateTag(`sheet-data-${token.toLowerCase()}`)
}

export default async function Sheet({token}: {token: string}) {
  const {data, error} = await fetchSheetData(token)

  return <SheetData token={token} initialData={data} initialError={error} revalidate={revalidateSheetData} />
}
