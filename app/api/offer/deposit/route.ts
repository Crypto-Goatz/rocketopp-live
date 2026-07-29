import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

import { stripe } from '@/lib/stripe'

/**
 * POST /api/offer/deposit
 *
 * Creates a Stripe Checkout session for the $247 deposit against the $497
 * website build.
 *
 * Uses inline `price_data` rather than a pre-created price ID so this works
 * without anyone having to create a Stripe product first — one less thing to
 * configure and one less thing to get out of sync with the page.
 *
 * The description states the remaining balance explicitly. A deposit page that
 * does not say what is still owed is a bait-and-switch, and Stripe shows this
 * text on the checkout page itself.
 */

export const DEPOSIT_CENTS = 24700
export const TOTAL_CENTS = 49700

export async function POST(request: NextRequest) {
  try {
    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json(
        { error: 'Payments are not configured yet. Please call (878) 888-1230.' },
        { status: 503 },
      )
    }

    const body = await request.json().catch(() => ({}))
    const email = typeof body.email === 'string' ? body.email.trim() : ''
    const business = typeof body.business === 'string' ? body.business.trim() : ''

    const origin =
      request.headers.get('origin') ||
      process.env.NEXT_PUBLIC_SITE_URL ||
      'https://rocketopp.com'

    const params: Stripe.Checkout.SessionCreateParams = {
      mode: 'payment',
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: 'usd',
            unit_amount: DEPOSIT_CENTS,
            product_data: {
              name: '$497 Website — Build Deposit',
              description:
                'Reserves your build slot and starts the work. Remaining balance of $250 is due when the site goes live (total $497).',
            },
          },
        },
      ],
      success_url: `${origin}/497-website/start?paid=1&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/497-website/start?cancelled=1`,
      allow_promotion_codes: true,
      metadata: {
        kind: 'website_offer_deposit',
        offer: '497-website',
        deposit_usd: '247',
        balance_usd: '250',
        business: business.slice(0, 200),
      },
    }

    if (email) params.customer_email = email

    const session = await stripe.checkout.sessions.create(params)

    if (!session.url) {
      return NextResponse.json(
        { error: 'Could not start checkout. Please call (878) 888-1230.' },
        { status: 502 },
      )
    }

    return NextResponse.json({ url: session.url, id: session.id })
  } catch (err) {
    console.error('[offer/deposit] failed:', err)
    return NextResponse.json(
      { error: 'Something went wrong starting checkout. Please call (878) 888-1230.' },
      { status: 500 },
    )
  }
}
