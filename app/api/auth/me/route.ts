import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth/session'

export async function GET() {
  try {
    const user = await getSession()

    if (!user) {
      return NextResponse.json({ user: null })
    }

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        subscription_status: user.subscription_status,
        subscription_tier: user.subscription_tier
      }
    })
  } catch (error) {
    console.error('Get session error:', error)
    return NextResponse.json({ user: null })
  }
}
