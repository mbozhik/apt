import type {SheetTable} from '~~/tire/Sheet'

import {supabase} from '@/lib/supabase'

import {NextRequest, NextResponse} from 'next/server'
import axios from 'axios'

async function fetchFromGoogleSheets(token: string): Promise<SheetTable | null> {
  try {
    const SHEET_URL = process.env.NEXT_PUBLIC_GOOGLE_SHEETS_URL
    if (!SHEET_URL) {
      throw new Error('Google Sheets URL not configured')
    }

    const response = await axios.get<{[key: string]: SheetTable}>(SHEET_URL, {
      timeout: 20000,
      headers: {
        Accept: 'application/json',
      },
    })

    const responseData = response.data

    if (!responseData || !responseData[token]) {
      return null
    }

    return responseData[token]
  } catch (error) {
    console.error('Error fetching from Google Sheets:', error)
    throw error
  }
}

async function saveCachedData(token: string, sheetTable: SheetTable): Promise<void> {
  const {error} = await supabase.from('tire_cache').upsert(
    {
      token: token,
      data: sheetTable,
      updated_at: new Date().toISOString(),
    },
    {
      onConflict: 'token',
    },
  )

  if (error) {
    console.error('Error saving to Supabase:', error)
    throw error
  }
}

export async function POST(request: NextRequest, {params}: {params: Promise<{token: string}>}) {
  try {
    const {token} = await params

    if (!token) {
      return NextResponse.json({error: 'Token is required'}, {status: 400})
    }

    // Принудительно получаем свежие данные
    const freshData = await fetchFromGoogleSheets(token)

    if (!freshData) {
      return NextResponse.json({error: `Data for token "${token}" not found`}, {status: 404})
    }

    // Сохраняем в кэш
    await saveCachedData(token, freshData)

    return NextResponse.json({
      data: freshData,
      cached: false,
      forced: true,
      lastUpdated: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Force refresh API Error:', error)
    return NextResponse.json({error: 'Failed to refresh data'}, {status: 500})
  }
}
