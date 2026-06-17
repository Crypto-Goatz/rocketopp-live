import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/db/supabase'
import { hashPassword } from '@/lib/auth/session'

export async function POST(req: NextRequest) {
  try {
    const { token, password } = await req.json()

    if (!token || typeof token !== 'string') {
      return NextResponse.json({ error: 'Reset token is required' }, { status: 400 })
    }

    if (!password || typeof password !== 'string' || password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters' },
        { status: 400 }
      )
    }

    const { data: reset } = await supabaseAdmin
      .from('rocketopp_password_resets')
      .select('id, user_id, expires_at, used_at')
      .eq('token', token)
      .single()

    if (!reset || reset.used_at) {
      return NextResponse.json(
        { error: 'This reset link is invalid or has already been used' },
        { status: 400 }
      )
    }

    if (new Date(reset.expires_at) < new Date()) {
      return NextResponse.json(
        { error: 'This reset link has expired. Please request a new one.' },
        { status: 400 }
      )
    }

    const passwordHash = await hashPassword(password)

    const { error: updateError } = await supabaseAdmin
      .from('rocketopp_users')
      .update({ password_hash: passwordHash })
      .eq('id', reset.user_id)

    if (updateError) {
      return NextResponse.json({ error: 'Failed to update password' }, { status: 500 })
    }

    // Mark token used and invalidate existing sessions for safety.
    await supabaseAdmin
      .from('rocketopp_password_resets')
      .update({ used_at: new Date().toISOString() })
      .eq('id', reset.id)

    await supabaseAdmin
      .from('rocketopp_sessions')
      .delete()
      .eq('user_id', reset.user_id)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Reset password error:', error)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}
