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
  try {
    const SHEET_URL = process.env.NEXT_PUBLIC_GOOGLE_SHEETS_URL
    if (!SHEET_URL) {
      return {data: null, error: 'Google Sheets URL not configured'}
    }

    const response = await axios.get<{[key: string]: SheetDataType}>(SHEET_URL, {
      timeout: 10000,
    })

    const responseData = response.data

    if (!responseData || !responseData[token]) {
      return {data: null, error: `Data for token "${token}" not found`}
    }

    return {data: responseData[token], error: null}
  } catch (error) {
    console.error('Error fetching sheet data:', error)

    if (axios.isAxiosError(error)) {
      if (error.response) {
        return {data: null, error: `Server error: ${error.response.status}`}
      } else if (error.request) {
        return {data: null, error: 'Network error or server not responding'}
      }
    }

    return {data: null, error: 'Internal server error'}
  }
}

export default async function Sheet({token}: {token: string}) {
  const {data: sheetData, error} = await fetchSheetData(token)

  return <SheetData token={token} initialData={sheetData} initialError={error} />
}
