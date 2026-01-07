import { NextRequest, NextResponse } from 'next/server'
import { ga4Api } from '@/lib/analytics/clients'

export async function GET(request: NextRequest) {
  const url = new URL(request.url)
  const range = url.searchParams.get('range') || '7d'

  try {
    const data = await ga4Api.getMetrics(range)

    return NextResponse.json({
      success: true,
      range,
      data,
    })
  } catch (error: any) {
    console.error('GA4 API error:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
