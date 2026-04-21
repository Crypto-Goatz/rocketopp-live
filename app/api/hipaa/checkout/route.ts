/**
 * HIPAA Scan Checkout — creates Stripe checkout session
 * POST /api/hipaa/checkout
 */

import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'

const PRICES = {
  current: 'price_1TOSjPHThmAuKVQMHOjWI74H',   // $149 — Current Law Scan
  nprm2026: 'price_1TOSjeHThmAuKVQMKEojYwMT',   // $249 — 2026 NPRM Scan
} as const

export async function POST(req: NextRequest) {
  try {
    const { scanType, email, publicUrl, dashboardUrl, entityType, state } = await req.json()

    if (!scanType || !email || !publicUrl) {
      return NextResponse.json(
        { error: 'scanType, email, and publicUrl are required' },
        { status: 400 }
      )
    }

    const priceId = PRICES[scanType as keyof typeof PRICES]
    if (!priceId) {
      return NextResponse.json({ error: 'Invalid scan type' }, { status: 400 })
    }

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://rocketopp.com'

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      customer_email: email,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${baseUrl}/hipaa/results?session_id={CHECKOUT_SESSION_ID}&scanType=${scanType}&url=${encodeURIComponent(publicUrl)}&dashboardUrl=${encodeURIComponent(dashboardUrl || publicUrl)}&entityType=${entityType || 'unsure'}&state=${state || ''}`,
      cancel_url: `${baseUrl}/hipaa?cancelled=true`,
      metadata: {
        type: 'hipaa-scan',
        scan_type: scanType,
        public_url: publicUrl,
        dashboard_url: dashboardUrl || publicUrl,
        entity_type: entityType || 'unsure',
        state: state || '',
      },
      allow_promotion_codes: true,
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('HIPAA checkout error:', error)
    return NextResponse.json({ error: 'Failed to create checkout' }, { status: 500 })
  }
}
