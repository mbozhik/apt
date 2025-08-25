import {NextRequest, NextResponse} from 'next/server'

import {fetchFromGoogleSheets, saveCachedData} from '@/app/api/tire/[token]/utils'

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
