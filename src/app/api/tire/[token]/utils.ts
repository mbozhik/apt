import type {SheetTable, CachedSheet} from '~~/tire/Sheet'
import {supabaseAdmin} from '@/lib/supabase'

export async function fetchFromGoogleSheets(token: string): Promise<SheetTable | null> {
  const MAX_RETRIES = 3
  const TIMEOUT_MS = 30000 // 30 seconds
  
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const SHEET_URL = process.env.NEXT_PUBLIC_GOOGLE_SHEETS_URL
      if (!SHEET_URL) {
        throw new Error('Google Sheets URL not configured')
      }

      console.log(`🚀 Fetching from Google Sheets (attempt ${attempt}/${MAX_RETRIES})`)

      // Create AbortController for timeout
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS)

      const response = await fetch(SHEET_URL, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'User-Agent': 'Mozilla/5.0 (compatible; apt-catalog/1.0)',
        },
        redirect: 'follow',
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status} ${response.statusText}`)
      }

      const responseData = (await response.json()) as {[key: string]: SheetTable}

      if (!responseData || !responseData[token]) {
        console.log(`⚠️ Token "${token}" not found in response`)
        return null
      }

      console.log(`✅ Successfully fetched data for token: ${token}`)
      return responseData[token]
    } catch (error) {
      console.error(`❌ Fetch attempt ${attempt} failed:`, error)

      // If this is the last attempt, throw the error
      if (attempt === MAX_RETRIES) {
        throw error
      }

      // Wait before retrying (exponential backoff)
      const waitTime = Math.pow(2, attempt - 1) * 1000 // 1s, 2s, 4s
      await new Promise(resolve => setTimeout(resolve, waitTime))
    }
  }

  throw new Error('All retry attempts failed')
}

export async function getCachedData(token: string): Promise<CachedSheet | null> {
  const {data, error} = await supabaseAdmin.from('tire_cache').select('*').eq('token', token).single()

  if (error || !data) {
    return null
  }

  return data
}

export async function saveCachedData(token: string, sheetTable: SheetTable): Promise<void> {
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
    console.error('❌ Error saving to cache:', error)
    throw error
  }
  
  console.log(`✅ Data saved to cache for token: ${token}`)
}

export function isDataStale(cachedData: CachedSheet, staleDays: number = 7): boolean {
  const cacheDate = new Date(cachedData.updated_at)
  const now = new Date()
  const diffInDays = (now.getTime() - cacheDate.getTime()) / (1000 * 60 * 60 * 24)
  return diffInDays >= staleDays
}
