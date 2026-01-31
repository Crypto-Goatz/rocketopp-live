import { NextRequest, NextResponse } from 'next/server'
import { validateSSOToken, type SSOProduct } from '@/lib/auth/sso'

export async function POST(request: NextRequest) {
  try {
    const { token, product } = await request.json()

    if (!token || !product) {
      return NextResponse.json({ error: 'Token and product required' }, { status: 400 })
    }

    const payload = await validateSSOToken(token, product as SSOProduct)

    if (!payload) {
      return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 })
    }

    return NextResponse.json({
      success: true,
      user: payload
    })
  } catch (error) {
    console.error('SSO validate error:', error)
    return NextResponse.json({ error: 'Failed to validate SSO token' }, { status: 500 })
  }
}
