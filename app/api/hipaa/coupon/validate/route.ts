/**
 * POST /api/hipaa/coupon/validate
 *
 * Looks up a coupon code on the RocketOpp Stripe account and returns the
 * shape the UI needs to show a discount preview ("$899 → $674.25 with
 * LAUNCH25"). Read-only — does NOT redeem. Redemption happens at Checkout
 * via `discounts: [{ coupon: id }]`.
 *
 * Lookup order: try as a coupon ID directly, then fall back to a
 * promotion-code lookup by code.
 *
 * Body: { code: string, baseAmountCents?: number }
 * Response:
 *   { ok: true, couponId, name?, percentOff?, amountOff?, currency?,
 *     finalCents?, savingsCents?, scope?: 'hipaa' | 'global' }
 *   { ok: false, error }
 */

import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'

interface Body { code?: string; baseAmountCents?: number }

interface DiscountInfo {
  couponId:        string
  name:            string | null
  percentOff:      number | null
  amountOff:       number | null
  currency:        string | null
  valid:           boolean
  duration:        string | null
  redeemBy:        number | null
  timesRedeemed:   number | null
  maxRedemptions:  number | null
}

function info(c: { id: string; name?: string | null; percent_off?: number | null; amount_off?: number | null; currency?: string | null; valid?: boolean; duration?: string | null; redeem_by?: number | null; times_redeemed?: number | null; max_redemptions?: number | null }): DiscountInfo {
  return {
    couponId:        c.id,
    name:            c.name || null,
    percentOff:      typeof c.percent_off === 'number' ? c.percent_off : null,
    amountOff:       typeof c.amount_off === 'number' ? c.amount_off : null,
    currency:        c.currency || null,
    valid:           c.valid !== false,
    duration:        c.duration || null,
    redeemBy:        c.redeem_by || null,
    timesRedeemed:   typeof c.times_redeemed === 'number' ? c.times_redeemed : null,
    maxRedemptions:  c.max_redemptions || null,
  }
}

function preview(d: DiscountInfo, baseCents: number): { finalCents: number; savingsCents: number } {
  if (d.percentOff != null) {
    const savings = Math.round(baseCents * (d.percentOff / 100))
    return { finalCents: Math.max(0, baseCents - savings), savingsCents: savings }
  }
  if (d.amountOff != null) {
    const savings = Math.min(baseCents, d.amountOff)
    return { finalCents: Math.max(0, baseCents - savings), savingsCents: savings }
  }
  return { finalCents: baseCents, savingsCents: 0 }
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({})) as Body
  const code = (body.code || '').trim()
  if (!code) return NextResponse.json({ ok: false, error: 'code required' }, { status: 400 })

  let discount: DiscountInfo | null = null

  // 1. Try as a coupon ID directly (e.g. "LAUNCH25").
  try {
    const c = await stripe.coupons.retrieve(code)
    if (c) discount = info(c)
  } catch { /* fall through */ }

  // 2. Try as a promotion code (case-sensitive lookup, expand the coupon).
  if (!discount) {
    try {
      const list = await stripe.promotionCodes.list({ code, active: true, limit: 1, expand: ['data.coupon'] })
      const promo = list.data[0] as (typeof list.data[0] & { coupon?: { id: string; name?: string | null; percent_off?: number | null; amount_off?: number | null; currency?: string | null; valid?: boolean; duration?: string | null; redeem_by?: number | null; times_redeemed?: number | null; max_redemptions?: number | null } }) | undefined
      if (promo?.coupon) discount = info(promo.coupon)
    } catch { /* fall through */ }
  }

  if (!discount || !discount.valid) {
    return NextResponse.json({ ok: false, error: 'invalid_or_expired_code' }, { status: 404 })
  }

  // Capacity check
  if (discount.maxRedemptions != null && discount.timesRedeemed != null && discount.timesRedeemed >= discount.maxRedemptions) {
    return NextResponse.json({ ok: false, error: 'fully_redeemed' }, { status: 410 })
  }
  if (discount.redeemBy && discount.redeemBy * 1000 < Date.now()) {
    return NextResponse.json({ ok: false, error: 'expired' }, { status: 410 })
  }

  const base = typeof body.baseAmountCents === 'number' ? body.baseAmountCents : null
  const previewBlock = base != null ? preview(discount, base) : null

  return NextResponse.json({
    ok:           true,
    couponId:     discount.couponId,
    name:         discount.name,
    percentOff:   discount.percentOff,
    amountOff:    discount.amountOff,
    currency:     discount.currency,
    duration:     discount.duration,
    finalCents:   previewBlock?.finalCents,
    savingsCents: previewBlock?.savingsCents,
  })
}
