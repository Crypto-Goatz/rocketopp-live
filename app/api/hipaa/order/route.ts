/**
 * POST /api/hipaa/order — proxy to 0ncore.com with the shared webhook secret.
 *
 * Keeps the HIPAA_WEBHOOK_SECRET server-side; the browser never sees it.
 */

import { NextRequest, NextResponse } from 'next/server'

const ONCORE_URL = process.env.ONCORE_API_URL || process.env.ONCORE_URL || 'https://0ncore.com'
const SECRET     = process.env.HIPAA_WEBHOOK_SECRET || ''

export const runtime = 'nodejs'
export const maxDuration = 60

export async function POST(req: NextRequest) {
  if (!SECRET) {
    return NextResponse.json({ error: 'server_not_configured' }, { status: 500 })
  }
  const body = await req.json().catch(() => ({}))
  if (!body?.assessmentId || !body?.customerEmail) {
    return NextResponse.json({ error: 'assessmentId + customerEmail required' }, { status: 400 })
  }

  try {
    const r = await fetch(`${ONCORE_URL}/api/hipaa/order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-hipaa-webhook-secret': SECRET,
      },
      body: JSON.stringify({
        assessmentId:  body.assessmentId,
        customerEmail: body.customerEmail,
        customerName:  body.customerName || null,
        sourceSite:    body.sourceSite || 'rocketopp.com',
        referralCode:  body.referralCode || null,
        creditHidden:  Boolean(body.creditHidden),
      }),
    })
    const data = await r.json().catch(() => ({}))
    return NextResponse.json(data, { status: r.status })
  } catch (e) {
    return NextResponse.json({ error: 'proxy_failed', detail: e instanceof Error ? e.message : 'unknown' }, { status: 502 })
  }
}
