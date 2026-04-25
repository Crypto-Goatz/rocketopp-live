/**
 * POST /api/onboarding/lock-in
 *
 * Records a price-lock intent and forwards it to the RocketOpp CRM
 * webhook so a strategist can pick it up within the hour. Used by the
 * onboarding stub at /onboarding/[slug] until the full AI builder
 * wizard ships.
 */

import { NextRequest, NextResponse } from 'next/server'

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

  try {
    const r = await fetch(WEBHOOK, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(15_000),
    })
    return NextResponse.json({ ok: r.ok, status: r.status })
  } catch (err) {
    return NextResponse.json({ ok: false, error: err instanceof Error ? err.message : 'unknown' }, { status: 502 })
  }
}
