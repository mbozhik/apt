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

    console.log(`Fetching data for token: ${token} from Google Sheets`)

    const response = await axios.get<ApiResponse>(SHEET_URL, {
      timeout: 10000,
    })

    const responseData = response.data

    if (!responseData || !responseData[token]) {
      return NextResponse.json({error: `Data for token "${token}" not found`}, {status: 404})
    }

    return NextResponse.json(responseData[token])
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
