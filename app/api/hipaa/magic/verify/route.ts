/**
 * POST /api/hipaa/magic/verify  { token }
 *   → proxies to 0ncore, sets the session cookie, returns { email }.
 *
 * GET  /api/hipaa/magic/verify
 *   → reads the session cookie, proxies to 0ncore, returns { email, orders }.
 *
 * POST /api/hipaa/magic/verify?logout=1
 *   → clears the cookie.
 */

import { NextRequest, NextResponse } from 'next/server'

const ONCORE_URL = process.env.ONCORE_API_URL || 'https://0ncore.com'
const SECRET     = process.env.HIPAA_WEBHOOK_SECRET || ''
const COOKIE     = 'rop_hipaa_session'

export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  if (!SECRET) return NextResponse.json({ error: 'server_not_configured' }, { status: 500 })
  const url = new URL(req.url)
  if (url.searchParams.get('logout') === '1') {
    const res = NextResponse.json({ ok: true })
    res.cookies.set(COOKIE, '', { path: '/', maxAge: 0 })
    return res
  }
  const body = await req.json().catch(() => ({}))
  if (!body?.token) return NextResponse.json({ error: 'token_required' }, { status: 400 })

  const r = await fetch(`${ONCORE_URL}/api/hipaa/magic/verify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-hipaa-webhook-secret': SECRET },
    body: JSON.stringify({ token: body.token }),
  })
  const data = await r.json().catch(() => ({}))
  if (!r.ok || !data?.sessionCookie) return NextResponse.json(data, { status: r.status || 400 })

  const res = NextResponse.json({ ok: true, email: data.email })
  res.cookies.set(COOKIE, data.sessionCookie, {
    path: '/', maxAge: 30 * 86400, httpOnly: true, sameSite: 'lax', secure: true,
  })
  return res
}

export async function GET(req: NextRequest) {
  if (!SECRET) return NextResponse.json({ email: null })
  const c = req.cookies.get(COOKIE)?.value
  if (!c) return NextResponse.json({ email: null })
  const r = await fetch(`${ONCORE_URL}/api/hipaa/magic/verify?cookie=${encodeURIComponent(c)}`, {
    headers: { 'x-hipaa-webhook-secret': SECRET },
  })
  const data = await r.json().catch(() => ({}))
  return NextResponse.json(data, { status: r.status })
}
