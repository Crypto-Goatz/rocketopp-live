import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth/session'
import { generateSSOToken } from '@/lib/canny/client'

export async function GET() {
  try {
    const user = await getSession()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const ssoToken = generateSSOToken({
      id: user.id,
      email: user.email,
      name: user.name || user.email.split('@')[0],
      avatarURL: user.avatar_url || undefined,
      companies: user.company_name ? [{
        id: user.id,
        name: user.company_name,
      }] : undefined,
    })

    return NextResponse.json({ ssoToken })
  } catch (error: any) {
    console.error('Canny SSO error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
