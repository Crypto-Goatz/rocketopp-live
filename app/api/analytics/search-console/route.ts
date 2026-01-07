import { NextRequest, NextResponse } from 'next/server'
import { searchConsoleApi } from '@/lib/analytics/clients'

export async function GET(request: NextRequest) {
  const url = new URL(request.url)
  const range = url.searchParams.get('range') || '7d'
  const type = url.searchParams.get('type') || 'queries'

  try {
    const data = await searchConsoleApi.getSearchAnalytics(range, type)

    return NextResponse.json({
      success: true,
      range,
      type,
      data,
    })
  } catch (error: any) {
    console.error('Search Console API error:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
