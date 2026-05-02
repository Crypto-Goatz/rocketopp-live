/**
 * POST /api/store/checkout
 *
 * Body: { items: [{ slug, quantity }], email?, name? }
 *
 * Creates a Stripe Checkout Session with line items derived server-side
 * from lib/store/products (so a tampered cart can't change the amount).
 * Stores cart contents in metadata so the webhook can:
 *   - upsert the CRM contact
 *   - tag with each product's crmTag
 *   - kick off the thank-you 0nFlow / Conversations email
 *
 * v1 rule: a Stripe Checkout Session is single-mode. If the cart mixes
 * one_time + subscription items we return 400 and ask the user to
 * checkout the subscription separately.
 */

import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { PRODUCTS } from '@/lib/store/products'

export const runtime = 'nodejs'

interface ItemIn {
  slug: string
  quantity?: number
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as {
      items?: ItemIn[]
      email?: string
      name?: string
    }
    const items = (body.items || []).filter((i) => i?.slug)

    if (items.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 })
    }

    // Re-derive product info from server-side source. Bail if any slug is unknown.
    const expanded = items.map((i) => {
      const product = PRODUCTS.find((p) => p.slug === i.slug)
      if (!product) throw new Error(`Unknown product: ${i.slug}`)
      const quantity = Math.max(1, Math.min(i.quantity ?? 1, 50))
      return { product, quantity }
    })

    const hasSubscription = expanded.some(
      (e) => e.product.billing === 'subscription',
    )
    const hasOneTime = expanded.some((e) => e.product.billing === 'one_time')

    if (hasSubscription && hasOneTime) {
      return NextResponse.json(
        {
          error:
            'Stripe Checkout supports either subscriptions OR one-time items per session. Please check out the subscription separately.',
        },
        { status: 400 },
      )
    }

    const mode: 'subscription' | 'payment' = hasSubscription
      ? 'subscription'
      : 'payment'

    const baseUrl =
      process.env.NEXT_PUBLIC_APP_URL || 'https://rocketopp.com'

    const lineItems = expanded.map(({ product, quantity }) => ({
      quantity,
      price_data: {
        currency: 'usd',
        product_data: {
          name: product.name,
          description: product.tagline,
          metadata: {
            slug: product.slug,
            shipsIn: product.shipsIn,
          },
        },
        unit_amount: product.priceCents,
        ...(product.billing === 'subscription'
          ? { recurring: { interval: product.interval ?? 'month' } }
          : {}),
      },
    }))

    // Slim, safe metadata (Stripe keys cap at 50 chars, values 500).
    const metadata: Record<string, string> = {
      source: 'rocketopp-store',
      mode,
      cart_items: JSON.stringify(
        expanded.map((e) => ({
          slug: e.product.slug,
          qty: e.quantity,
          tag: e.product.crmTag,
        })),
      ).slice(0, 480),
      crm_tags: expanded
        .map((e) => e.product.crmTag)
        .join(',')
        .slice(0, 480),
    }

    const session = await stripe.checkout.sessions.create({
      mode,
      line_items: lineItems,
      success_url: `${baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/checkout?cancelled=1`,
      allow_promotion_codes: true,
      automatic_tax: { enabled: false },
      customer_email: body.email,
      metadata,
      ...(mode === 'subscription'
        ? { subscription_data: { metadata } }
        : {
            payment_intent_data: { metadata },
          }),
    })

    return NextResponse.json({ url: session.url })
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'unknown error'
    console.error('[store/checkout] error:', msg)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
