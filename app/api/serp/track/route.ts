/**
 * POST /api/serp/track
 *
 * Body (optional):
 *   { keywordIds?: string[] }    — track specific keywords only
 *   {}                            — track every active keyword
 *
 * Runs SerpAPI for each, persists a row in serp_rankings, returns a per-
 * keyword summary. Hits SerpAPI sequentially with a small delay so we
 * stay under their rate limits.
 *
 * Auth: same-origin (browser dashboard) or x-cron-secret header (Vercel cron).
 */

import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/db/supabase'
import { searchSerp } from '@/lib/serp'

const RATE_DELAY_MS = 350 // ~3 calls/sec — well under SerpAPI's typical 100/min limit

function isAuthorized(req: NextRequest): boolean {
  const cronSecret = process.env.CRON_SECRET
  const headerSecret = req.headers.get('x-cron-secret')
  if (cronSecret && headerSecret === cronSecret) return true
  if (req.headers.get('x-vercel-cron') === '1') return true
  // Same-origin (browser dashboard) — accept when origin is rocketopp.com or vercel preview
  const origin = req.headers.get('origin') ?? ''
  return (
    origin.endsWith('rocketopp.com') ||
    origin.endsWith('.vercel.app') ||
    origin === ''
  )
}

export async function POST(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = (await req.json().catch(() => ({}))) as { keywordIds?: string[] }
  const ids = body.keywordIds ?? []

  // Resolve keyword set
  let q = supabaseAdmin.from('serp_keywords').select('*').eq('active', true)
  if (ids.length > 0) q = q.in('id', ids)
  const { data: keywords, error } = await q
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  if (!keywords || keywords.length === 0) {
    return NextResponse.json({ tracked: 0, results: [] })
  }

  const results: Array<{
    keyword_id: string
    domain: string
    query: string
    position: number | null
    ai_cited: boolean
    error?: string
  }> = []

  for (const kw of keywords) {
    try {
      const snap = await searchSerp({
        q: kw.query,
        domain: kw.domain,
        location: kw.location,
        device: kw.device as 'desktop' | 'mobile',
      })
      const { error: insertErr } = await supabaseAdmin.from('serp_rankings').insert({
        keyword_id: kw.id,
        position: snap.position,
        url: snap.url,
        title: snap.title,
        snippet: snap.snippet,
        total_results: snap.total_results,
        ai_overview: snap.ai_overview,
        ai_cited: snap.ai_cited,
        ai_overview_position: snap.ai_overview_position,
        // Don't store the full raw blob on every snapshot — wasteful and SerpAPI
        // already keeps it on their side. Persist just enough to debug if needed.
        raw: null,
      })
      if (insertErr) throw new Error(insertErr.message)
      results.push({
        keyword_id: kw.id,
        domain: kw.domain,
        query: kw.query,
        position: snap.position,
        ai_cited: snap.ai_cited,
      })
    } catch (err) {
      results.push({
        keyword_id: kw.id,
        domain: kw.domain,
        query: kw.query,
        position: null,
        ai_cited: false,
        error: err instanceof Error ? err.message : 'unknown',
      })
    }
    if (RATE_DELAY_MS > 0 && keywords.length > 1) {
      await new Promise((r) => setTimeout(r, RATE_DELAY_MS))
    }
  }

  return NextResponse.json({
    tracked: results.length,
    successes: results.filter((r) => !r.error).length,
    failures: results.filter((r) => r.error).length,
    results,
  })
}
