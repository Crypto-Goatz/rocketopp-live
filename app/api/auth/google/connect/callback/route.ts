import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/db/supabase'

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID!
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET!
const GOOGLE_REDIRECT_URI = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/google/connect/callback`

interface GoogleTokenResponse {
  access_token: string
  refresh_token?: string
  expires_in: number
  token_type: string
  scope: string
}

export async function GET(request: NextRequest) {
  const url = new URL(request.url)
  const code = url.searchParams.get('code')
  const state = url.searchParams.get('state')
  const error = url.searchParams.get('error')

  if (error) {
    console.error('Google OAuth error:', error)
    return NextResponse.redirect(
      new URL('/dashboard/settings?error=oauth_denied', process.env.NEXT_PUBLIC_APP_URL!)
    )
  }

  if (!code || !state) {
    return NextResponse.redirect(
      new URL('/dashboard/settings?error=missing_params', process.env.NEXT_PUBLIC_APP_URL!)
    )
  }

  try {
    // Decode state
    const stateData = JSON.parse(Buffer.from(state, 'base64').toString())
    const { userId, services } = stateData

    if (!userId) {
      return NextResponse.redirect(
        new URL('/dashboard/settings?error=invalid_state', process.env.NEXT_PUBLIC_APP_URL!)
      )
    }

    // Exchange code for tokens
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        redirect_uri: GOOGLE_REDIRECT_URI,
        grant_type: 'authorization_code',
      }),
    })

    if (!tokenRes.ok) {
      const err = await tokenRes.text()
      console.error('Token exchange failed:', err)
      return NextResponse.redirect(
        new URL('/dashboard/settings?error=token_exchange', process.env.NEXT_PUBLIC_APP_URL!)
      )
    }

    const tokens: GoogleTokenResponse = await tokenRes.json()

    // Calculate token expiry
    const expiresAt = new Date(Date.now() + tokens.expires_in * 1000)

    // Upsert the connection
    const { error: upsertError } = await supabaseAdmin
      .from('user_google_connections')
      .upsert({
        user_id: userId,
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token || null,
        token_expires_at: expiresAt.toISOString(),
        services: services,
        connected_at: new Date().toISOString(),
        last_refresh: new Date().toISOString(),
        status: 'active',
      }, {
        onConflict: 'user_id',
      })

    if (upsertError) {
      console.error('Failed to save connection:', upsertError)
      return NextResponse.redirect(
        new URL('/dashboard/settings?error=save_failed', process.env.NEXT_PUBLIC_APP_URL!)
      )
    }

    // Success - redirect to settings
    return NextResponse.redirect(
      new URL('/dashboard/settings?connected=true', process.env.NEXT_PUBLIC_APP_URL!)
    )
  } catch (err) {
    console.error('Google connect error:', err)
    return NextResponse.redirect(
      new URL('/dashboard/settings?error=unknown', process.env.NEXT_PUBLIC_APP_URL!)
    )
  }
}
