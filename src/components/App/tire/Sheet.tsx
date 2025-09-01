import SheetData from '~~/tire/SheetTable'
import {getCachedData, isDataStale} from '@/app/api/tire/[token]/utils'

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
    // Validate token
    if (!token || token === 'undefined' || token === 'null') {
      console.error(`❌ Invalid token: "${token}"`)
      return {data: null, error: 'Invalid or missing token'}
    }
    
    // Only get cached data, no automatic fetching
    const cachedData = await getCachedData(token)

    if (!cachedData) {
      console.log(`📭 No cached data for token: ${token}`)
      return {
        data: null, 
        error: 'Нет данных в кэше. Нажмите кнопку обновления для загрузки.',
        cached: false
      }
    }

    // Return cached data regardless of age
    return {
      data: cachedData.data,
      error: null,
      cached: true,
      stale: isDataStale(cachedData), // Just for display purposes
    }
  } catch (error) {
    console.error('❌ Error getting cached data:', error)
    return {data: null, error: 'Ошибка получения данных из кэша'}
  }
}export default async function Sheet({token}: {token: string}) {
  const {data, error, cached, stale} = await getSheetData(token)

  return <SheetData token={token} initialData={data} initialError={error} cached={cached} stale={stale} />
}
