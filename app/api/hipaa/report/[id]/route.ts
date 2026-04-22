/**
 * GET /api/hipaa/report/:id?t=<view-token>
 *
 * Proxy to 0ncore.com — keeps HIPAA_WEBHOOK_SECRET server-side.
 * The `t` query param is the report_view_token bound to the order.
 */

import { NextRequest, NextResponse } from 'next/server'

const ONCORE_URL = process.env.ONCORE_API_URL || 'https://0ncore.com'
const SECRET     = process.env.HIPAA_WEBHOOK_SECRET || ''

export const runtime = 'nodejs'

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  if (!SECRET) return NextResponse.json({ error: 'server_not_configured' }, { status: 500 })
  const t = new URL(req.url).searchParams.get('t') || ''
  const r = await fetch(`${ONCORE_URL}/api/hipaa/reports/${id}?t=${encodeURIComponent(t)}`, {
    headers: { 'x-hipaa-webhook-secret': SECRET },
  })
  const data = await r.json().catch(() => ({}))
  return NextResponse.json(data, { status: r.status })
}
