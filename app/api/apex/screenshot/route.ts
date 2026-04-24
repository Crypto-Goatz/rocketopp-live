/**
 * POST /api/apex/screenshot — fetch a real screenshot of the user's site.
 *
 * The original Apex app shipped with a MOCK — always the same image — so
 * the "analysis" users got was meaningless. This route calls Microlink
 * (free tier, no key required for basic use) and returns a stable image
 * URL the vision route can consume directly.
 *
 * Falls back to a zero-state payload rather than throwing — the chat flow
 * can proceed without the screenshot.
 */

import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const maxDuration = 30

function normalizeUrl(raw: string): string | null {
  try {
    const trimmed = raw.trim()
    const withProto = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`
    const url = new URL(withProto)
    return url.toString()
  } catch {
    return null
  }
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({})) as { url?: string }
  const url = normalizeUrl(body.url || '')
  if (!url) return NextResponse.json({ error: 'invalid_url' }, { status: 400 })

  // Microlink free tier: https://api.microlink.io?url=...&screenshot=true
  const mlUrl = new URL('https://api.microlink.io')
  mlUrl.searchParams.set('url', url)
  mlUrl.searchParams.set('screenshot', 'true')
  mlUrl.searchParams.set('meta', 'false')
  mlUrl.searchParams.set('embed', 'screenshot.url')

  try {
    const res = await fetch(mlUrl.toString(), {
      signal: AbortSignal.timeout(25_000),
      headers: { 'User-Agent': 'apex-assessment/1.0 (rocketopp.com)' },
    })
    if (!res.ok) {
      return NextResponse.json({ ok: false, error: 'screenshot_provider_failed', status: res.status })
    }
    // `embed=screenshot.url` makes microlink 302 to the image — chase the
    // redirect chain until we land on a concrete URL.
    const finalUrl = res.url
    return NextResponse.json({ ok: true, imageUrl: finalUrl, source: 'microlink' })
  } catch (err) {
    return NextResponse.json({ ok: false, error: 'server_error', detail: err instanceof Error ? err.message : 'unknown' })
  }
}
