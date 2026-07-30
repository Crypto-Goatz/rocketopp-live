import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

import { stripe } from '@/lib/stripe'
import { quote } from '@/lib/offer'

/**
 * POST /api/offer/deposit
 *
 * Creates a Stripe Checkout session for the SIGNUP payment against the website
 * build — $250 standard, or $375 with the WordPress option.
 *
 * mode is always 'payment'. The $50 (or $80 with WordPress) monthly is billed
 * through the CRM's SaaS billing, so a Stripe subscription here would double-bill.
 *
 * Uses inline `price_data` rather than a pre-created price ID so this works
 * without anyone having to create a Stripe product first — one less thing to
 * configure and one less thing to get out of sync with the page.
 *
 * The description states the remaining balance explicitly. A deposit page that
 * does not say what is still owed is a bait-and-switch, and Stripe shows this
 * text on the checkout page itself.
 */

// Amounts come from lib/offer.ts PRICING so this endpoint can never drift from
// what the pages and emails quote.

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
    const withWordPress = body.wordpress === true || body.wordpress === 'true'

    const q = quote(withWordPress)

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
            unit_amount: q.signupCents,
            product_data: {
              name: withWordPress
                ? 'Website Build — Signup Payment (WordPress)'
                : 'Website Build — Signup Payment',
              // Stripe renders this on the checkout page, so the remaining
              // balance AND the monthly must be stated here. A deposit page that
              // discloses the balance but hides a recurring fee is worse than one
              // that hides both.
              description: withWordPress
                ? `Website build in WordPress. Reserves your slot and starts the work. ${q.launch} due at launch (build total ${q.buildTotal} = $497 + $250 WordPress). Then ${q.monthly}/month once live, covering hosting and AI management — billed separately by us.`
                : `Reserves your build slot and starts the work. ${q.launch} due at launch (build total ${q.buildTotal}). Then ${q.monthly}/month once your site is live — billed separately by us.`,
            },
          },
        },
      ],
      success_url: `${origin}/497-website/start?paid=1&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/497-website/start?cancelled=1`,
      allow_promotion_codes: true,
      // NOTE: mode is 'payment', never 'subscription'. The $50/$80 monthlies are
      // billed through the CRM's SaaS billing — adding a Stripe subscription here
      // would double-charge every client.
      metadata: {
        kind: 'website_offer_deposit',
        offer: '497-website',
        plan: withWordPress ? 'wordpress' : 'platform',
        signup_usd: String(q.signupCents / 100),
        launch_due_usd: String(q.launchCents / 100),
        build_total_usd: String(q.buildTotalCents / 100),
        monthly_usd: String(q.monthlyCents / 100),
        monthly_billed_by: 'crm-saas',
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
