import { NextRequest, NextResponse } from 'next/server'
import { checkBotId } from 'botid/server'
import { registerUser, createSession } from '@/lib/auth/session'
import { scoreSpam } from '@/lib/crm/spam'

export async function POST(req: NextRequest) {
  try {
    const { email, password, name } = await req.json()
    // 2026-11-04: bots registered accounts with gibberish names and then hit forgot-password, so the CRM
    // mailed \"RESET YOUR PASSWORD\" to harvested addresses from the RocketOpp sender. Gate both doors.
    const bot = await checkBotId().catch(() => ({ isBot: false }))
    const verdict = scoreSpam({ email, fullName: name, bot: bot.isBot })
    if (verdict.spam) {
      console.warn(`[register] blocked (score ${verdict.score}): ${verdict.reasons.join(', ')} — ${String(email).slice(0, 80)}`)
      return NextResponse.json({ error: 'We could not verify this sign-up. Please contact support.' }, { status: 403 })
    }

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters' },
        { status: 400 }
      )
    }

    const { user, error } = await registerUser(email, password, name)

    if (error) {
      return NextResponse.json({ error }, { status: 400 })
    }

    if (!user) {
      return NextResponse.json(
        { error: 'Failed to create account' },
        { status: 500 }
      )
    }

    // Create session
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || undefined
    const userAgent = req.headers.get('user-agent') || undefined
    await createSession(user.id, ip, userAgent)

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      }
    })
  } catch (error) {
    console.error('Register error:', error)
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    )
  }
}
