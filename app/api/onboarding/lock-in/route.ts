/**
 * POST /api/onboarding/lock-in
 *
 * Records a price-lock intent and forwards it to the RocketOpp CRM
 * webhook so a strategist can pick it up within the hour. Used by the
 * onboarding stub at /onboarding/[slug] until the full AI builder
 * wizard ships.
 */

import { NextRequest, NextResponse } from 'next/server'
import { notifyFormSubmission } from '@/lib/crm/notify'

export const runtime = 'nodejs'

const WEBHOOK = process.env.ONBOARDING_CRM_WEBHOOK_URL
  || process.env.APEX_CRM_WEBHOOK_URL
  || 'https://services.leadconnectorhq.com/hooks/6MSqx0trfxgLxeHBJE1k/webhook-trigger/16e971d9-d576-4b5d-a90f-4cf8224c67e9'

interface Body {
  productSlug?: string
  productName?: string
  priceCents?: number
  priceLabel?: string
  recurring?: 'month' | null
  email?: string
  name?: string
  phone?: string
  notes?: string
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({})) as Body
  if (!body.email || !body.name) {
    return NextResponse.json({ error: 'name_and_email_required' }, { status: 400 })
  }
  if (!body.productSlug) {
    return NextResponse.json({ error: 'product_required' }, { status: 400 })
  }

  const payload = {
    name:          body.name,
    email:         body.email,
    phone:         body.phone || '',
    notes:         body.notes || '',
    product_slug:  body.productSlug,
    product_name:  body.productName || '',
    price_cents:   body.priceCents ?? 0,
    price_label:   body.priceLabel || '',
    recurring:     body.recurring || null,
    source:        'rocketopp.com/onboarding',
    submitted_at:  new Date().toISOString(),
    intent:        'price_lock',
  }

  const [hook, result] = await Promise.all([
    fetch(WEBHOOK, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(15_000),
    }).then((r) => r.ok).catch((err) => { console.error('[onboarding/lock-in] webhook failed:', err); return false }),
    notifyFormSubmission({
      email: body.email,
      fullName: body.name,
      phone: body.phone || undefined,
      message: body.notes || undefined,
      service: body.productName || body.productSlug,
      source: 'rocketopp-onboarding-lock-in',
      formName: `Onboarding Lock-In — ${body.productName || body.productSlug}`,
      pageUrl: req.headers.get('referer') || `https://rocketopp.com/onboarding/${body.productSlug}`,
      tags: ['Website Lead', 'Onboarding Lock-In', `product:${body.productSlug}`],
      extras: { product: body.productName || body.productSlug, price: body.priceLabel || '', recurring: body.recurring || '' },
      userAgent: req.headers.get('user-agent'),
    }),
  ])
  if (!hook && !result.received) {
    return NextResponse.json({ ok: false, error: "We couldn't save your request" }, { status: 502 })
  }
  return NextResponse.json({ ok: true })
}
