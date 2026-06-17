import { NextRequest, NextResponse } from 'next/server'
import { randomBytes } from 'crypto'
import { supabaseAdmin } from '@/lib/db/supabase'
import { sendPasswordResetEmail } from '@/lib/crm/notify'

const RESET_DURATION = 60 * 60 * 1000 // 1 hour

function appUrl(): string {
  return (
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    'https://rocketopp.com'
  ).replace(/\/$/, '')
}

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json()

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    // Always return success to avoid leaking which emails are registered.
    const { data: user } = await supabaseAdmin
      .from('rocketopp_users')
      .select('id, email, name')
      .eq('email', email.toLowerCase())
      .single()

    if (user) {
      const token = randomBytes(32).toString('hex')
      const expiresAt = new Date(Date.now() + RESET_DURATION)

      await supabaseAdmin.from('rocketopp_password_resets').insert({
        user_id: user.id,
        token,
        expires_at: expiresAt.toISOString(),
      })

      const resetUrl = `${appUrl()}/reset-password?token=${token}`
      await sendPasswordResetEmail(user.email, resetUrl, user.name || undefined)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Forgot password error:', error)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}
