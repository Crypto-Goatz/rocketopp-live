import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth/session'

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID!
const GOOGLE_REDIRECT_URI = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/google/connect/callback`

// All available Google API scopes
const SERVICE_SCOPES = {
  // Analytics scopes
  analytics: [
    'https://www.googleapis.com/auth/analytics.readonly',
  ],
  // Search Console scopes
  search_console: [
    'https://www.googleapis.com/auth/webmasters.readonly',
  ],
  // Google Ads scopes
  ads: [
    'https://www.googleapis.com/auth/adwords',
  ],
  // Calendar scopes
  calendar: [
    'https://www.googleapis.com/auth/calendar.readonly',
    'https://www.googleapis.com/auth/calendar.events.readonly',
  ],
}

export async function GET(request: NextRequest) {
  // Require authentication
  const session = await getSession()
  if (!session) {
    return NextResponse.redirect(
      new URL('/login?redirect=/dashboard/settings', process.env.NEXT_PUBLIC_APP_URL!)
    )
  }

  const url = new URL(request.url)
  const servicesParam = url.searchParams.get('services') || 'analytics,search_console'
  const requestedServices = servicesParam.split(',').filter(s => s in SERVICE_SCOPES)

  // Build scope list
  const scopes = [
    'openid',
    'email',
    'profile',
  ]

  for (const service of requestedServices) {
    scopes.push(...(SERVICE_SCOPES as any)[service])
  }

  // Store requested services in state for callback
  const state = Buffer.from(JSON.stringify({
    userId: session.id,
    services: requestedServices,
  })).toString('base64')

  const params = new URLSearchParams({
    client_id: GOOGLE_CLIENT_ID,
    redirect_uri: GOOGLE_REDIRECT_URI,
    response_type: 'code',
    scope: scopes.join(' '),
    access_type: 'offline',
    prompt: 'consent', // Force consent to get refresh token
    state,
  })

  return NextResponse.redirect(
    `https://accounts.google.com/o/oauth2/v2/auth?${params}`
  )
}
