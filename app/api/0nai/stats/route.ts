/**
 * GET /api/0nai/stats?window=1h|24h|7d|30d
 *
 * Unified analytics backend for /0nai. Aggregates the shared cro9_events
 * store for site_rocketopp and returns:
 *   - totals (pageviews, unique visitors, sessions)
 *   - top pages
 *   - top sources (referrer domain)
 *   - top utm_campaigns
 *   - device + country split
 *   - recent events (last 50) for the live feed
 *
 * Env: CRO9_SUPABASE_URL + CRO9_SUPABASE_SERVICE_KEY
 */

import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'

const CRO9_URL = process.env.CRO9_SUPABASE_URL || ''
const CRO9_KEY = process.env.CRO9_SUPABASE_SERVICE_KEY || ''
const SITE_ID = 'site_rocketopp'

const WINDOWS: Record<string, number> = {
  '1h': 60 * 60 * 1000,
  '24h': 24 * 60 * 60 * 1000,
  '7d': 7 * 24 * 60 * 60 * 1000,
  '30d': 30 * 24 * 60 * 60 * 1000,
}

interface Cro9EventRow {
  type: string
  visitor_id: string | null
  session_id: string | null
  utm_source: string | null
  utm_medium: string | null
  utm_campaign: string | null
  path: string | null
  url: string | null
  referrer: string | null
  country: string | null
  device: string | null
  browser: string | null
  timestamp: string
  data: Record<string, unknown> | null
}

function referrerDomain(ref: string | null): string {
  if (!ref) return '(direct)'
  try {
    const u = new URL(ref)
    return u.hostname.replace(/^www\./, '')
  } catch {
    return '(unknown)'
  }
}

export async function GET(req: NextRequest) {
  if (!CRO9_URL || !CRO9_KEY) {
    return NextResponse.json({ error: 'cro9_not_configured' }, { status: 500 })
  }

  const { searchParams } = new URL(req.url)
  const windowKey = searchParams.get('window') || '24h'
  const windowMs = WINDOWS[windowKey] ?? WINDOWS['24h']
  const since = new Date(Date.now() - windowMs).toISOString()

  const qs = new URLSearchParams({
    site_id: `eq.${SITE_ID}`,
    timestamp: `gte.${since}`,
    order: 'timestamp.desc',
    limit: '10000',
  }).toString()

  const res = await fetch(`${CRO9_URL}/rest/v1/cro9_events?${qs}`, {
    headers: { apikey: CRO9_KEY, Authorization: `Bearer ${CRO9_KEY}` },
    cache: 'no-store',
  })
  if (!res.ok) {
    return NextResponse.json({ error: 'query_failed', status: res.status }, { status: 500 })
  }
  const rows = (await res.json()) as Cro9EventRow[]

  // ----- totals -----
  const pageviews = rows.filter((r) => r.type === 'pageview').length
  const visitorSet = new Set(rows.map((r) => r.visitor_id).filter(Boolean) as string[])
  const sessionSet = new Set(rows.map((r) => r.session_id).filter(Boolean) as string[])

  // live (last 5 min)
  const liveCutoff = Date.now() - 5 * 60 * 1000
  const liveVisitors = new Set(
    rows
      .filter((r) => new Date(r.timestamp).getTime() > liveCutoff)
      .map((r) => r.visitor_id)
      .filter(Boolean) as string[],
  ).size

  // ----- top pages -----
  const pageCounts = new Map<string, number>()
  for (const r of rows.filter((r) => r.type === 'pageview')) {
    const key = r.path || '/'
    pageCounts.set(key, (pageCounts.get(key) || 0) + 1)
  }
  const top_pages = Array.from(pageCounts.entries())
    .map(([path, count]) => ({ path, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 12)

  // ----- top sources (referrer domain) -----
  const srcCounts = new Map<string, number>()
  for (const r of rows.filter((r) => r.type === 'pageview')) {
    const key = referrerDomain(r.referrer)
    srcCounts.set(key, (srcCounts.get(key) || 0) + 1)
  }
  const top_sources = Array.from(srcCounts.entries())
    .map(([source, count]) => ({ source, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10)

  // ----- top utm_campaigns -----
  const campCounts = new Map<string, number>()
  for (const r of rows) {
    if (!r.utm_campaign) continue
    campCounts.set(r.utm_campaign, (campCounts.get(r.utm_campaign) || 0) + 1)
  }
  const top_campaigns = Array.from(campCounts.entries())
    .map(([campaign, count]) => ({ campaign, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10)

  // ----- device + country split -----
  const deviceCounts = new Map<string, number>()
  const countryCounts = new Map<string, number>()
  for (const r of rows.filter((r) => r.type === 'pageview')) {
    if (r.device) deviceCounts.set(r.device, (deviceCounts.get(r.device) || 0) + 1)
    const c = r.country || 'unknown'
    countryCounts.set(c, (countryCounts.get(c) || 0) + 1)
  }
  const device_split = Array.from(deviceCounts.entries())
    .map(([device, count]) => ({ device, count }))
    .sort((a, b) => b.count - a.count)
  const country_split = Array.from(countryCounts.entries())
    .map(([country, count]) => ({ country, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10)

  // ----- event type histogram -----
  const typeCounts = new Map<string, number>()
  for (const r of rows) typeCounts.set(r.type, (typeCounts.get(r.type) || 0) + 1)
  const event_types = Array.from(typeCounts.entries())
    .map(([type, count]) => ({ type, count }))
    .sort((a, b) => b.count - a.count)

  // ----- recent feed (50) -----
  const recent = rows.slice(0, 50).map((r) => ({
    type: r.type,
    path: r.path,
    referrer_domain: referrerDomain(r.referrer),
    utm_campaign: r.utm_campaign,
    utm_source: r.utm_source,
    country: r.country,
    device: r.device,
    timestamp: r.timestamp,
    visitor_id: r.visitor_id,
  }))

  return NextResponse.json({
    site_id: SITE_ID,
    window: windowKey,
    since,
    generated_at: new Date().toISOString(),
    totals: {
      pageviews,
      unique_visitors: visitorSet.size,
      sessions: sessionSet.size,
      live_visitors: liveVisitors,
      total_events: rows.length,
    },
    top_pages,
    top_sources,
    top_campaigns,
    device_split,
    country_split,
    event_types,
    recent,
  })
}
