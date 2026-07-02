/**
 * POST /api/store/deposit
 *
 * Body: { items: [{ slug, quantity, discountPct? }], email, name? }
 *
 * The "lock in the offer" step of the Service Recommendation Engine.
 * Takes a 25% deposit (DEPOSIT_PCT) of the DISCOUNTED total and creates a
 * single one-time Stripe Checkout session. The 20% recommend discount is
 * applied server-side and clamped to MAX_ITEM_DISCOUNT_PCT so a tampered
 * cart can't beat the public offer.
 *
 * The full quote (discounted subtotal, deposit, remaining balance, per-item
 * breakdown, crm tags) rides in metadata so the stripe-store webhook can
 * upsert + tag the CRM contact and follow up with the balance.
 *
 * Subscriptions are included at their first-period (monthly) price for the
 * deposit math; the actual recurring plan is set up at project kickoff.
 */

import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { PRODUCTS } from '@/lib/store/products'
import { clampDiscount } from '@/lib/store/pricing'
import { DEPOSIT_PCT, RECOMMEND_PROMO_CODE } from '@/lib/recommend/issue-map'

export const runtime = 'nodejs'

interface ItemIn {
  slug: string
  quantity?: number
  discountPct?: number
}

function formatUsd(cents: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(cents / 100)
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as {
      items?: ItemIn[]
      email?: string
      name?: string
    }
    const rawItems = (body.items || []).filter((i) => i?.slug)

    if (!body.email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }
    if (rawItems.length === 0) {
      return NextResponse.json({ error: 'No services selected' }, { status: 400 })
    }

    // Re-derive everything server-side (anti-tamper). Unknown slug → 400.
    const expanded = rawItems.map((i) => {
      const product = PRODUCTS.find((p) => p.slug === i.slug)
      if (!product) throw new Error(`Unknown product: ${i.slug}`)
      const quantity = Math.max(1, Math.min(i.quantity ?? 1, 50))
      const discountPct = clampDiscount(i.discountPct)
      const grossCents = product.priceCents * quantity
      const netCents = Math.round(product.priceCents * (1 - discountPct / 100)) * quantity
      return { product, quantity, discountPct, grossCents, netCents }
    })

    const grossTotal = expanded.reduce((s, e) => s + e.grossCents, 0)
    const discountedTotal = expanded.reduce((s, e) => s + e.netCents, 0)
    const savings = grossTotal - discountedTotal
    const depositCents = Math.max(100, Math.round(discountedTotal * (DEPOSIT_PCT / 100)))
    const remainingCents = discountedTotal - depositCents

    const orderId = `rec_${Math.random().toString(36).slice(2, 10)}${Date.now().toString(36)}`
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://rocketopp.com'

    const crmTags = [
      'deposit-paid',
      'recommend-offer',
      RECOMMEND_PROMO_CODE.toLowerCase(),
      ...expanded.map((e) => e.product.crmTag),
    ]

    const breakdown = expanded.map((e) => ({
      slug: e.product.slug,
      qty: e.quantity,
      off: e.discountPct,
      net: e.netCents,
    }))

    const metadata: Record<string, string> = {
      source: 'rocketopp-recommend-deposit',
      order_id: orderId,
      promo: RECOMMEND_PROMO_CODE,
      contact_name: (body.name || '').slice(0, 100),
      contact_email: (body.email || '').slice(0, 100),
      cart_breakdown: JSON.stringify(breakdown).slice(0, 480),
      crm_tags: crmTags.join(',').slice(0, 480),
      gross_total_cents: String(grossTotal),
      discounted_total_cents: String(discountedTotal),
      savings_cents: String(savings),
      deposit_cents: String(depositCents),
      remaining_cents: String(remainingCents),
    }

    const productNames = expanded.map((e) => e.product.name).join(', ')

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: 'usd',
            unit_amount: depositCents,
            product_data: {
              name: `${DEPOSIT_PCT}% Deposit — locks your ${RECOMMEND_DISCOUNT_LABEL(expanded)} pricing`,
              description:
                `Secures ${formatUsd(discountedTotal)} in recommended services (${productNames}) ` +
                `at your discounted rate. Balance of ${formatUsd(remainingCents)} is due at project kickoff. Order ${orderId}.`,
              metadata: { order_id: orderId },
            },
          },
        },
      ],
      success_url: `${baseUrl}/order/success?session_id={CHECKOUT_SESSION_ID}&order_id=${orderId}`,
      cancel_url: `${baseUrl}/recommend?cancelled=1`,
      customer_email: body.email,
      metadata,
      payment_intent_data: { metadata },
    })

    return NextResponse.json({
      url: session.url,
      order_id: orderId,
      deposit_cents: depositCents,
      discounted_total_cents: discountedTotal,
      remaining_cents: remainingCents,
    })
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'unknown error'
    console.error('[store/deposit] error:', msg)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}

/** Human label for the discount on the deposit line item (e.g. "20% off"). */
function RECOMMEND_DISCOUNT_LABEL(
  expanded: { discountPct: number }[],
): string {
  const max = expanded.reduce((m, e) => Math.max(m, e.discountPct), 0)
  return max > 0 ? `${max}% off` : 'locked-in'
}
