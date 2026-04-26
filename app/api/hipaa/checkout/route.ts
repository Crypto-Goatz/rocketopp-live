/**
 * POST /api/hipaa/checkout — creates Stripe checkout session for any of the
 * 4 HIPAA tiers.
 *
 * Body:
 *   scanType: 'cited-issues' | 'developer-fix-kit' | 'nprm-overview' | 'full-compliance'
 *   email:    string
 *   publicUrl: string         // the site being scanned
 *   dashboardUrl?: string
 *   entityType?: string
 *   state?: string
 *
 * Backwards-compat: still accepts the legacy `current` and `nprm2026`
 * scanTypes from the original HIPAA page so live links don't break.
 */

import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'

const PRICES: Record<string, string | undefined> = {
  // New 4-tier catalog (matches /shop slugs)
  'cited-issues':       process.env.STRIPE_PRICE_HIPAA_TIER_1,
  'developer-fix-kit':  process.env.STRIPE_PRICE_HIPAA_TIER_2,
  'nprm-overview':      process.env.STRIPE_PRICE_HIPAA_TIER_3,
  'full-compliance':    process.env.STRIPE_PRICE_HIPAA_TIER_4,
  // Legacy aliases — keep until the existing /hipaa CTAs are migrated
  'current':            process.env.STRIPE_PRICE_HIPAA_TIER_1,
  'nprm2026':           process.env.STRIPE_PRICE_HIPAA_TIER_3,
}

const TIER_LABELS: Record<string, string> = {
  'cited-issues':       'Cited Issues',
  'developer-fix-kit':  'Developer Fix Kit',
  'nprm-overview':      'NPRM Overview',
  'full-compliance':    'Full Compliance',
  'current':            'Cited Issues',
  'nprm2026':           'NPRM Overview',
}

export async function POST(req: NextRequest) {
  try {
    const { scanType, email, publicUrl, dashboardUrl, entityType, state, couponCode, affiliateRef } = await req.json()

    if (!scanType || !email || !publicUrl) {
      return NextResponse.json(
        { error: 'scanType, email, and publicUrl are required' },
        { status: 400 },
      )
    }

    const priceId = PRICES[scanType as string]
    if (!priceId) {
      return NextResponse.json({ error: `Unknown scanType "${scanType}"` }, { status: 400 })
    }

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://rocketopp.com'
    const tierLabel = TIER_LABELS[scanType] || scanType

    // Resolve coupon (if provided) — accept the coupon ID directly or a
    // promotion-code string. We look it up so an invalid code fails fast.
    let discounts: { coupon: string }[] | undefined = undefined
    let couponApplied: string | undefined
    if (typeof couponCode === 'string' && couponCode.trim()) {
      const code = couponCode.trim()
      try {
        const coupon = await stripe.coupons.retrieve(code).catch(() => null)
        if (coupon?.valid) {
          discounts = [{ coupon: coupon.id }]
          couponApplied = coupon.id
        } else {
          const promos = await stripe.promotionCodes.list({ code, active: true, limit: 1, expand: ['data.coupon'] })
          const promo = promos.data[0] as (typeof promos.data[0] & { coupon?: { id: string; valid?: boolean } }) | undefined
          if (promo?.coupon?.valid) {
            discounts = [{ coupon: promo.coupon.id }]
            couponApplied = promo.coupon.id
          }
        }
      } catch { /* fall through — invalid codes are silently ignored */ }
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      customer_email: email,
      line_items: [{ price: priceId, quantity: 1 }],
      // Stripe disallows allow_promotion_codes when discounts is set — we
      // strip the toggle if a code is already attached.
      ...(discounts ? { discounts } : { allow_promotion_codes: true }),
      success_url: `${baseUrl}/hipaa/results?session_id={CHECKOUT_SESSION_ID}&scanType=${encodeURIComponent(scanType)}&url=${encodeURIComponent(publicUrl)}&dashboardUrl=${encodeURIComponent(dashboardUrl || publicUrl)}&entityType=${encodeURIComponent(entityType || 'unsure')}&state=${encodeURIComponent(state || '')}`,
      cancel_url: `${baseUrl}/hipaa?cancelled=true`,
      metadata: {
        type:           'hipaa-scan',
        scan_type:      scanType,
        tier_label:     tierLabel,
        public_url:     publicUrl,
        dashboard_url:  dashboardUrl || publicUrl,
        entity_type:    entityType || 'unsure',
        state:          state || '',
        ...(couponApplied  ? { coupon_applied: couponApplied } : {}),
        ...(affiliateRef   ? { affiliate_ref: String(affiliateRef) } : {}),
      },
    })

    return NextResponse.json({ url: session.url, couponApplied })
  } catch (error) {
    console.error('HIPAA checkout error:', error)
    return NextResponse.json({ error: 'Failed to create checkout' }, { status: 500 })
  }
}
