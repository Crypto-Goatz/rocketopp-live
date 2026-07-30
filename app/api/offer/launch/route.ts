import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { checkBotId } from 'botid/server'

import { stripe } from '@/lib/stripe'
import { PRICING, STRIPE_PRICES, quote } from '@/lib/offer'

/**
 * POST /api/offer/launch
 *
 * The second half of the $497 order: collects the launch balance AND starts the
 * monthly, in ONE Checkout session.
 *
 * Why one session rather than two steps: Stripe Checkout in `subscription` mode
 * accepts a one-time line item alongside the recurring one. So a single link
 * charges the balance today and starts the subscription — no saved-card handling,
 * no second email, and no window where the balance is paid but the monthly never
 * begins.
 *
 *   Standard   $247 today  +  $50/month
 *   WordPress  $372 today  +  $80/month   (hosting + AI management)
 *
 * Amounts come from lib/offer.ts quote(), the same source the offer page, the
 * deposit endpoint and both emails read — so no surface can drift.
 *
 * The recurring price is created inline via price_data, so there is no Stripe
 * product to pre-create and nothing to keep in sync with the code.
 *
 * BILLING OWNERSHIP — DECIDED: Stripe collects the monthly, and the CRM is
 * connected to Stripe rather than billing separately. Do NOT arm a second
 * subscription workflow in the CRM against these customers; one collector only,
 * or they are charged twice.
 *
 * Both line items use REAL Stripe prices (lib/offer.ts STRIPE_PRICES), not inline
 * price_data. That matters specifically because of the CRM link: inline price_data
 * mints a new ad-hoc product on every checkout, so the CRM would see a different
 * product each time and nothing would reconcile. Falls back to inline if an id is
 * missing, so a bad env var degrades the reporting rather than the checkout.
 */
export async function POST(request: NextRequest) {
  try {
    const bot = await checkBotId()
    if (bot.isBot) {
      return NextResponse.json({ error: 'Access denied.' }, { status: 403 })
    }

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
    const balanceOnly = body.balanceOnly === true || body.balanceOnly === 'true'

    const q = quote(withWordPress)
    const monthlyCents = withWordPress
      ? PRICING.wordpress.monthlyCents
      : PRICING.base.monthlyCents

    const origin =
      request.headers.get('origin') ||
      process.env.NEXT_PUBLIC_SITE_URL ||
      'https://rocketopp.com'

    const balancePrice = withWordPress ? STRIPE_PRICES.balance.wordpress : STRIPE_PRICES.balance.base
    const monthlyPrice = withWordPress ? STRIPE_PRICES.monthly.wordpress : STRIPE_PRICES.monthly.base

    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [
      balancePrice
        ? { quantity: 1, price: balancePrice }
        : {
            quantity: 1,
            price_data: {
              currency: 'usd',
              unit_amount: q.launchCents,
              product_data: {
                name: withWordPress
                  ? 'Website Build — Launch Balance (WordPress)'
                  : 'Website Build — Launch Balance',
                description: `Final payment now your site is live. Build total ${q.buildTotal}.`,
              },
            },
          },
    ]

    if (!balanceOnly) {
      lineItems.push(
        monthlyPrice
          ? { quantity: 1, price: monthlyPrice }
          : {
              quantity: 1,
              price_data: {
                currency: 'usd',
                unit_amount: monthlyCents,
                recurring: { interval: 'month' },
                product_data: {
                  name: withWordPress
                    ? 'Website Hosting & AI Management (WordPress)'
                    : 'Website Hosting & Platform',
                  description: withWordPress
                    ? 'Managed WordPress hosting, updates, backups and AI management. Cancel any time.'
                    : 'Keeps your site hosted, running and on the platform. Cancel any time.',
                },
              },
            },
      )
    }

    const params: Stripe.Checkout.SessionCreateParams = {
      // subscription mode is required for the recurring item; the one-time balance
      // rides along in the same session. balanceOnly falls back to payment mode.
      mode: balanceOnly ? 'payment' : 'subscription',
      line_items: lineItems,
      success_url: `${origin}/497-website/launch?paid=1&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/497-website/launch?cancelled=1`,
      allow_promotion_codes: true,
      metadata: {
        kind: 'website_offer_launch',
        offer: '497-website',
        plan: withWordPress ? 'wordpress' : 'platform',
        balance_usd: String(q.launchCents / 100),
        monthly_usd: balanceOnly ? '0' : String(monthlyCents / 100),
        build_total_usd: String(q.buildTotalCents / 100),
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
    console.error('[offer/launch] failed:', err)
    return NextResponse.json(
      { error: 'Something went wrong. Please call (878) 888-1230.' },
      { status: 500 },
    )
  }
}
