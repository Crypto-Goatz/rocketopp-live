// ============================================================
// Daily Blog Generation Cron Job
// ============================================================
// Triggered daily by Vercel Cron to generate fresh blog content
// Runs at 6:00 AM UTC (1:00 AM EST / 10:00 PM PST)
// ============================================================

import { NextRequest, NextResponse } from 'next/server'

export const maxDuration = 60 // Allow up to 60 seconds for AI generation
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  // Verify cron secret (Vercel sends this in the Authorization header)
  const authHeader = request.headers.get('authorization')
  const cronSecret = process.env.CRON_SECRET

  // In production, verify the cron secret
  if (process.env.NODE_ENV === 'production' && authHeader !== `Bearer ${cronSecret}`) {
    console.log('[Daily Blog Cron] Unauthorized request')
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  console.log('[Daily Blog Cron] Starting daily blog generation...')

  try {
    // Call the blog generation endpoint
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://rocketopp.com'
    const response = await fetch(`${baseUrl}/api/blog/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${cronSecret}`
      },
      body: JSON.stringify({
        autoPublish: true
      })
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Generation failed')
    }

    const result = await response.json()

    console.log(`[Daily Blog Cron] Successfully generated: ${result.post?.title}`)

    return NextResponse.json({
      success: true,
      message: 'Daily blog post generated',
      post: result.post
    })

  } catch (error) {
    console.error('[Daily Blog Cron] Error:', error)

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to generate daily blog'
      },
      { status: 500 }
    )
  }
}
