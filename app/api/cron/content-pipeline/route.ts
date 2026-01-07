import { NextRequest, NextResponse } from 'next/server'

// Vercel Cron endpoint
// Runs daily at 9 AM UTC (configured in vercel.json)

export async function GET(request: NextRequest) {
  // Verify this is from Vercel Cron
  const authHeader = request.headers.get('authorization')

  // In production, Vercel Cron sends a specific header
  // For now, we'll use our pipeline secret
  const cronSecret = process.env.CRON_SECRET || process.env.CONTENT_PIPELINE_SECRET

  if (authHeader !== `Bearer ${cronSecret}`) {
    // Allow if coming from Vercel's internal cron
    const userAgent = request.headers.get('user-agent') || ''
    if (!userAgent.includes('vercel-cron')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
  }

  // Call the main pipeline endpoint
  const pipelineUrl = new URL('/api/content/pipeline', request.url)

  try {
    const response = await fetch(pipelineUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.CONTENT_PIPELINE_SECRET}`,
      },
      body: JSON.stringify({ source: 'vercel-cron' }),
    })

    const result = await response.json()

    return NextResponse.json({
      success: true,
      message: 'Content pipeline triggered',
      ...result,
    })
  } catch (error: any) {
    console.error('Cron trigger failed:', error)
    return NextResponse.json({
      success: false,
      error: error.message,
    }, { status: 500 })
  }
}
