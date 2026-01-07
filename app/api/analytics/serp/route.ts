import { NextRequest, NextResponse } from 'next/server'
import { serpApi } from '@/lib/analytics/clients'

export async function GET(request: NextRequest) {
  const url = new URL(request.url)
  const keyword = url.searchParams.get('keyword')
  const domain = url.searchParams.get('domain') || 'rocketopp.com'

  if (!keyword) {
    return NextResponse.json(
      { success: false, error: 'keyword parameter is required' },
      { status: 400 }
    )
  }

  try {
    const data = await serpApi.checkRanking(keyword, domain)

    if (!data) {
      return NextResponse.json(
        { success: false, error: 'Failed to fetch SERP data' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data,
    })
  } catch (error: any) {
    console.error('SERP API error:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

// POST endpoint for checking multiple keywords
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { keywords, domain = 'rocketopp.com' } = body

    if (!keywords || !Array.isArray(keywords)) {
      return NextResponse.json(
        { success: false, error: 'keywords array is required' },
        { status: 400 }
      )
    }

    // Limit to 10 keywords per request to avoid rate limiting
    const limitedKeywords = keywords.slice(0, 10)

    const data = await serpApi.checkMultipleKeywords(limitedKeywords, domain)

    return NextResponse.json({
      success: true,
      data,
      checkedCount: data.length,
    })
  } catch (error: any) {
    console.error('SERP API error:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
