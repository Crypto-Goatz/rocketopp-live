/**
 * GET /api/cron/serp-track
 *
 * Daily Vercel cron — runs every active keyword through SerpAPI and writes
 * a row into serp_rankings. Wired in vercel.json.
 *
 * Auth: Vercel sets `x-vercel-cron: 1` for native cron requests; we also
 * accept a CRON_SECRET bearer for manual triggers.
 */

import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const cronSecret = process.env.CRON_SECRET
  const auth = req.headers.get('authorization') ?? ''
  const isVercelCron = req.headers.get('x-vercel-cron') === '1'
  if (!isVercelCron && cronSecret && auth !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://rocketopp.com'
  const res = await fetch(`${baseUrl}/api/serp/track`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-cron-secret': cronSecret ?? '',
    },
    body: JSON.stringify({}),
  })

  const data = (await res.json().catch(() => ({}))) as Record<string, unknown>

  /*
    `ok` IS WHETHER A RANKING WAS WRITTEN, not whether the inner call answered.

    This returned `ok: res.ok` — the HTTP status of its own fetch — so it stayed
    green for months while SerpAPI refused every keyword for quota and nothing
    was stored. A check that can pass for a reason other than the thing it is
    checking is not a check.
  */
  const written = typeof data.written === 'number' ? data.written : 0
  if (!res.ok || written === 0) {
    console.error(`[serp-track] wrote ${written} ranking(s); upstream ${res.status} ${JSON.stringify(data).slice(0, 300)}`)
  }

  return NextResponse.json({
    ok: res.ok && written > 0,
    upstream_status: res.status,
    ...data,
  })
}
