/**
 * GTM Reality Check — Stripe Checkout
 * POST /api/gtm/checkout
 *
 * Accepts the 5-question assessment + contact info.
 * Creates a Stripe session. On success, Stripe redirects to /gtm/book?session_id=...
 *
 * Required env vars:
 *   GTM_STRIPE_PRICE_ID   — Stripe Price ID for the $49 GTM Reality Check product
 *   NEXT_PUBLIC_APP_URL   — e.g. https://rocketopp.com
 */

import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { q1, q2, q3, q4, q5, email, firstName } = body

    if (!email || !firstName) {
      return NextResponse.json(
        { error: 'email and firstName are required' },
        { status: 400 }
      )
    }

    const priceId = process.env.GTM_STRIPE_PRICE_ID
    if (!priceId) {
      return NextResponse.json(
        { error: 'GTM_STRIPE_PRICE_ID env var not set' },
        { status: 500 }
      )
    }

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://rocketopp.com'

    // Store assessment answers in Stripe metadata (max 500 chars per value)
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      customer_email: email,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${baseUrl}/gtm/book?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url:  `${baseUrl}/gtm?cancelled=true`,
      metadata: {
        type:        'gtm-reality-check',
        first_name:  firstName,
        email,
        q1:          (q1 || '').slice(0, 499),
        q2:          q2  || '',
        q3:          q3  || '',
        q4:          Array.isArray(q4) ? q4.join(', ') : (q4 || ''),
        q5:          (q5 || '').slice(0, 499),
      },
      allow_promotion_codes: true,
      payment_intent_data: {
        description: `GTM Reality Check — ${firstName} (${email})`,
      },
    })

    return NextResponse.json({ url: session.url })
  } catch (error: any) {
    console.error('[gtm/checkout] error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}
