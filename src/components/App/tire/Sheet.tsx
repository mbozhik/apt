import SheetData from '~~/tire/SheetTable'
import {fetchFromGoogleSheets, getCachedData, saveCachedData, isDataStale, updateDataInBackground} from '@/app/api/tire/[token]/utils'

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

async function getSheetData(token: string): Promise<{data: SheetTable | null; error: string | null; cached?: boolean; stale?: boolean}> {
  try {
    console.log(`🔍 Server-side: Getting sheet data for token: ${token}`)

    // Get cached data first
    const cachedData = await getCachedData(token)

    if (!cachedData) {
      // No cache - fetch fresh data
      console.log(`📭 No cached data found, fetching fresh data for token: ${token}`)

      try {
        const freshData = await fetchFromGoogleSheets(token)
        if (!freshData) {
          return {data: null, error: `Data for token "${token}" not found`}
        }

        // Save to cache for next time
        try {
          await saveCachedData(token, freshData)
          console.log(`💾 Saved fresh data to cache for token: ${token}`)
        } catch (saveError) {
          console.error('Failed to save to cache, but continuing with fresh data:', saveError)
        }

        return {data: freshData, error: null, cached: false}
      } catch (error) {
        console.error('Error fetching fresh data:', error)
        return {data: null, error: 'Failed to fetch data from Google Sheets'}
      }
    }

    // Check if data is stale
    if (isDataStale(cachedData)) {
      console.log(`⏰ Data is stale for token: ${token}, starting background update`)
      // Start background update but don't wait for it
      updateDataInBackground(token).catch((error) => {
        console.error('Background update failed:', error)
      })

      return {
        data: cachedData.data,
        error: null,
        cached: true,
        stale: true,
      }
    }

    // Fresh cached data
    console.log(`✅ Returning fresh cached data for token: ${token}`)
    return {
      data: cachedData.data,
      error: null,
      cached: true,
      stale: false,
    }
  } catch (error) {
    console.error('❌ Server-side error fetching sheet data:', error)

    if (error instanceof Error) {
      return {data: null, error: error.message}
    }

    return {data: null, error: 'Internal server error'}
  }
}

export default async function Sheet({token}: {token: string}) {
  const {data, error, cached, stale} = await getSheetData(token)

  return <SheetData token={token} initialData={data} initialError={error} cached={cached} stale={stale} />
}
