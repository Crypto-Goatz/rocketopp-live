/**
 * HIPAA remediation progress — proxy to 0ncore.
 *
 *   GET  /api/hipaa/progress?orderId=...&t=<view-token>
 *     → returns { resolved: { [checkId]: iso-timestamp } }
 *
 *   POST /api/hipaa/progress
 *     body: { orderId, token, checkId, resolved: boolean }
 *     → persists the toggle server-side
 *
 * If the 0ncore side hasn't wired this yet, returns 204/empty — the client
 * falls back to its localStorage state, so the UX never breaks.
 */

import { NextRequest, NextResponse } from 'next/server'

const ONCORE_URL = process.env.ONCORE_API_URL || 'https://0ncore.com'
const SECRET = process.env.HIPAA_WEBHOOK_SECRET || ''

export const runtime = 'nodejs'

export async function GET(req: NextRequest) {
  const url = new URL(req.url)
  const orderId = url.searchParams.get('orderId')
  const token = url.searchParams.get('t') || ''
  if (!orderId) return NextResponse.json({ error: 'orderId_required' }, { status: 400 })
  if (!SECRET) return NextResponse.json({ resolved: {} })

  try {
    const r = await fetch(
      `${ONCORE_URL}/api/hipaa/progress?orderId=${encodeURIComponent(orderId)}&t=${encodeURIComponent(token)}`,
      {
        headers: { 'x-hipaa-webhook-secret': SECRET },
        cache: 'no-store',
      },
    )
    if (!r.ok) return NextResponse.json({ resolved: {} })
    const data = await r.json().catch(() => ({ resolved: {} }))
    return NextResponse.json(data)
  } catch {
    // Backend not wired yet — UI falls back to localStorage.
    return NextResponse.json({ resolved: {} })
  }
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}))
  const orderId = body?.orderId
  const checkId = body?.checkId
  if (!orderId || !checkId) {
    return NextResponse.json({ error: 'orderId_and_checkId_required' }, { status: 400 })
  }
  if (!SECRET) return NextResponse.json({ ok: true, persisted: false })

  try {
    const r = await fetch(`${ONCORE_URL}/api/hipaa/progress`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-hipaa-webhook-secret': SECRET,
      },
      body: JSON.stringify({
        orderId,
        token: body.token || null,
        checkId,
        resolved: Boolean(body.resolved),
      }),
    })
    if (!r.ok) return NextResponse.json({ ok: true, persisted: false })
    return NextResponse.json({ ok: true, persisted: true })
  } catch {
    return NextResponse.json({ ok: true, persisted: false })
  }
}
