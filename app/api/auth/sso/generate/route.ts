import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth/session'
import { generateSSOToken, getSSORedirectUrl, type SSOProduct } from '@/lib/auth/sso'

const VALID_PRODUCTS: SSOProduct[] = [
  'sxo', 'rocket-plus', 'mcpfed', 'cro9', 'rocketpost', 'botcoaches', 'rocketeq'
]

export async function POST(request: NextRequest) {
  try {
    const user = await getSession()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { product, redirect } = await request.json()

    if (!product || !VALID_PRODUCTS.includes(product)) {
      return NextResponse.json({ error: 'Invalid product' }, { status: 400 })
    }

    // Get client IP
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] ||
               request.headers.get('x-real-ip') ||
               'unknown'

    // Generate SSO token
    const token = await generateSSOToken(user.id, product as SSOProduct, ip)

    // Get redirect URL
    const redirectUrl = redirect || getSSORedirectUrl(product as SSOProduct, token)

    return NextResponse.json({
      success: true,
      token,
      redirectUrl
    })
  } catch (error) {
    console.error('SSO generate error:', error)
    return NextResponse.json({ error: 'Failed to generate SSO token' }, { status: 500 })
  }
}
