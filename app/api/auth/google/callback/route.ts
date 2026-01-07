import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/db/supabase'
import { createSession } from '@/lib/auth/session'

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID!
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET!
const GOOGLE_REDIRECT_URI = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/google/callback`

interface GoogleTokenResponse {
  access_token: string
  id_token: string
  refresh_token?: string
  expires_in: number
  token_type: string
}

interface GoogleUserInfo {
  id: string
  email: string
  verified_email: boolean
  name: string
  given_name: string
  family_name?: string
  picture: string
}

export async function GET(request: NextRequest) {
  const url = new URL(request.url)
  const code = url.searchParams.get('code')
  const error = url.searchParams.get('error')

  if (error) {
    console.error('Google OAuth error:', error)
    return NextResponse.redirect(
      new URL('/login?error=oauth_denied', process.env.NEXT_PUBLIC_APP_URL!)
    )
  }

  if (!code) {
    return NextResponse.redirect(
      new URL('/login?error=no_code', process.env.NEXT_PUBLIC_APP_URL!)
    )
  }

  try {
    // Exchange code for tokens
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        redirect_uri: GOOGLE_REDIRECT_URI,
        grant_type: 'authorization_code'
      })
    })

    if (!tokenRes.ok) {
      const err = await tokenRes.text()
      console.error('Token exchange failed:', err)
      return NextResponse.redirect(
        new URL('/login?error=token_exchange', process.env.NEXT_PUBLIC_APP_URL!)
      )
    }

    const tokens: GoogleTokenResponse = await tokenRes.json()

    // Get user info
    const userRes = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${tokens.access_token}` }
    })

    if (!userRes.ok) {
      console.error('Failed to get user info')
      return NextResponse.redirect(
        new URL('/login?error=user_info', process.env.NEXT_PUBLIC_APP_URL!)
      )
    }

    const googleUser: GoogleUserInfo = await userRes.json()

    // Check if user exists
    const { data: existingUser } = await supabaseAdmin
      .from('rocketopp_users')
      .select('*')
      .eq('email', googleUser.email.toLowerCase())
      .single()

    let userId: string

    if (existingUser) {
      // Update existing user with Google info if not already linked
      if (!existingUser.google_id) {
        await supabaseAdmin
          .from('rocketopp_users')
          .update({
            google_id: googleUser.id,
            avatar_url: existingUser.avatar_url || googleUser.picture,
            name: existingUser.name || googleUser.name,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingUser.id)
      }
      userId = existingUser.id
    } else {
      // Create new user
      const { data: newUser, error: createError } = await supabaseAdmin
        .from('rocketopp_users')
        .insert({
          email: googleUser.email.toLowerCase(),
          name: googleUser.name,
          google_id: googleUser.id,
          avatar_url: googleUser.picture,
          auth_provider: 'google',
          password_hash: '', // No password for OAuth users
          fuel_credits: 10, // Start with 10 free credits
        })
        .select()
        .single()

      if (createError || !newUser) {
        console.error('Failed to create user:', createError)
        return NextResponse.redirect(
          new URL('/login?error=create_user', process.env.NEXT_PUBLIC_APP_URL!)
        )
      }
      userId = newUser.id
    }

    // Create session
    const ip = request.headers.get('x-forwarded-for') || 'unknown'
    const userAgent = request.headers.get('user-agent') || 'unknown'
    await createSession(userId, ip, userAgent)

    // Redirect to dashboard
    return NextResponse.redirect(
      new URL('/dashboard', process.env.NEXT_PUBLIC_APP_URL!)
    )
  } catch (err) {
    console.error('Google OAuth error:', err)
    return NextResponse.redirect(
      new URL('/login?error=unknown', process.env.NEXT_PUBLIC_APP_URL!)
    )
  }
}
