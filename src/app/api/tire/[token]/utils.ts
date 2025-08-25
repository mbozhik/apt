import type {SheetTable, CachedSheet} from '~~/tire/Sheet'
import {supabaseAdmin} from '@/lib/supabase'

export async function fetchFromGoogleSheets(token: string): Promise<SheetTable | null> {
  try {
    const SHEET_URL = process.env.NEXT_PUBLIC_GOOGLE_SHEETS_URL
    if (!SHEET_URL) {
      throw new Error('Google Sheets URL not configured')
    }

    console.log(`🚀 Fetching data for token: ${token}`)
    console.log(`📍 URL: ${SHEET_URL}`)

    const response = await fetch(SHEET_URL, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'User-Agent': 'Mozilla/5.0 (compatible; apt-catalog/1.0)',
      },
      redirect: 'follow',
    })

    console.log(`📊 Response status: ${response.status} ${response.statusText}`)
    console.log(`📋 Response headers:`, Object.fromEntries(response.headers.entries()))

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`❌ HTTP error! status: ${response.status}`)
      console.error(`❌ Response body:`, errorText)
      throw new Error(`HTTP error! status: ${response.status} ${response.statusText}`)
    }

    const responseData = (await response.json()) as {[key: string]: SheetTable}
    console.log(`✅ Successfully fetched data. Available tokens:`, Object.keys(responseData))

    if (!responseData || !responseData[token]) {
      console.log(`⚠️ Token "${token}" not found in response`)
      return null
    }

    console.log(`🎯 Found data for token: ${token}`)
    return responseData[token]
  } catch (error) {
    console.error('❌ Error fetching from Google Sheets:', error)
    if (error instanceof Error) {
      console.error('❌ Error message:', error.message)
      console.error('❌ Error stack:', error.stack)
    }
    throw error
  }
}

export async function getCachedData(token: string): Promise<CachedSheet | null> {
  console.log(`🔍 Looking for cached data for token: ${token}`)

  const {data, error} = await supabaseAdmin.from('tire_cache').select('*').eq('token', token).single()

  if (error) {
    console.error(`❌ Supabase error getting cached data:`, error)
    return null
  }

  if (!data) {
    console.log(`📭 No cached data found for token: ${token}`)
    return null
  }

  console.log(`✅ Found cached data for token: ${token}, updated at: ${data.updated_at}`)
  return data
}

export async function saveCachedData(token: string, sheetTable: SheetTable): Promise<void> {
  console.log(`💾 Saving cached data for token: ${token}`)

  const {error} = await supabaseAdmin.from('tire_cache').upsert(
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
    console.error('❌ Error saving to Supabase:', error)
    throw error
  }

  console.log(`✅ Successfully saved cached data for token: ${token}`)
}

export function isDataStale(cachedData: CachedSheet, staleDays: number = 7): boolean {
  const cacheDate = new Date(cachedData.updated_at)
  const now = new Date()
  const diffInDays = (now.getTime() - cacheDate.getTime()) / (1000 * 60 * 60 * 24)
  return diffInDays >= staleDays
}

export async function updateDataInBackground(token: string): Promise<void> {
  try {
    const freshData = await fetchFromGoogleSheets(token)
    if (freshData) {
      await saveCachedData(token, freshData)
      console.log(`Background update completed for token: ${token}`)
    }
  } catch (error) {
    console.error(`Background update failed for token: ${token}`, error)
    throw error
  }
}
