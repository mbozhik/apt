import type {SheetTable, CachedSheet} from '~~/tire/Sheet'

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

async function getCachedData(token: string): Promise<CachedSheet | null> {
  const {data, error} = await supabase.from('tire_cache').select('*').eq('token', token).single()

  if (error || !data) {
    return null
  }

  return data
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

function isDataStale(cachedData: CachedSheet): boolean {
  const cacheDate = new Date(cachedData.updated_at)
  const now = new Date()
  const diffInDays = (now.getTime() - cacheDate.getTime()) / (1000 * 60 * 60 * 24)
  return diffInDays >= 7
}

async function updateDataInBackground(token: string): Promise<void> {
  try {
    const freshData = await fetchFromGoogleSheets(token)
    if (freshData) {
      await saveCachedData(token, freshData)
      console.log(`Background update completed for token: ${token}`)
    }
  } catch (error) {
    console.error(`Background update failed for token: ${token}`, error)
  }
}

export async function GET(request: NextRequest, {params}: {params: Promise<{token: string}>}) {
  try {
    const {token} = await params

    if (!token) {
      return NextResponse.json({error: 'Token is required'}, {status: 400})
    }

    // Получаем кэшированные данные
    const cachedData = await getCachedData(token)

    if (!cachedData) {
      // Первый запрос - получаем данные и сохраняем в кэш
      try {
        const freshData = await fetchFromGoogleSheets(token)
        if (!freshData) {
          return NextResponse.json({error: `Data for token "${token}" not found`}, {status: 404})
        }
        await saveCachedData(token, freshData)
        return NextResponse.json({data: freshData})
      } catch (error) {
        return NextResponse.json({error: 'Failed to fetch data from Google Sheets'}, {status: 500})
      }
    }

    // Проверяем актуальность данных
    if (isDataStale(cachedData)) {
      // Данные устарели - возвращаем кэш и обновляем в фоне
      updateDataInBackground(token) // Не ждем завершения

      return NextResponse.json({
        data: cachedData.data,
        cached: true,
        stale: true,
        lastUpdated: cachedData.updated_at,
      })
    }

    // Данные актуальны - возвращаем из кэша
    return NextResponse.json({
      data: cachedData.data,
      cached: true,
      stale: false,
      lastUpdated: cachedData.updated_at,
    })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({error: 'Internal server error'}, {status: 500})
  }
}
