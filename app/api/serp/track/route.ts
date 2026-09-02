/**
 * POST /api/serp/track — record today's position for every tracked keyword.
 *
 * Body (optional):
 *   { keywordIds?: string[] }   track specific keywords only
 *   {}                          track every active keyword
 *
 * SOURCE IS SEARCH CONSOLE, NOT SERPAPI (changed 2026-09-02).
 *
 * SerpAPI's free plan is 250 searches a month against ~50 keywords a day, so
 * the job burned the whole month's quota in five days and then wrote nothing
 * for twenty-five — measured every month since it was built, and reported as
 * success the whole time because the cron returned the HTTP status of its own
 * inner call rather than whether a ranking was written.
 *
 * ONE CALL PER DOMAIN, not per keyword. GSC returns every query for a property
 * in a single response, so fifty tracked terms on one domain is one request.
 * The old loop made fifty paid requests with a 350ms sleep between them. That
 * is why the quota problem disappears rather than moving somewhere else.
 *
 * Auth is unchanged: cron secret, Vercel cron header, or same-origin.
 */

import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/db/supabase'
import { ranksForDomain, NOT_FOUND, type RankSnapshot } from '@/lib/gsc-rank'

function isAuthorized(req: NextRequest): boolean {
  const cronSecret = process.env.CRON_SECRET
  const headerSecret = req.headers.get('x-cron-secret')
  if (cronSecret && headerSecret === cronSecret) return true
  if (req.headers.get('x-vercel-cron') === '1') return true
  const origin = req.headers.get('origin') ?? ''
  return origin.endsWith('rocketopp.com') || origin.endsWith('.vercel.app') || origin === ''
}

type Keyword = { id: string; domain: string; query: string }

export async function POST(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = (await req.json().catch(() => ({}))) as { keywordIds?: string[] }
  const ids = body.keywordIds ?? []

  let q = supabaseAdmin.from('serp_keywords').select('id, domain, query').eq('active', true)
  if (ids.length > 0) q = q.in('id', ids)
  const { data: keywords, error } = await q
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  if (!keywords || keywords.length === 0) {
    return NextResponse.json({ ok: true, tracked: 0, written: 0, results: [] })
  }

  // Group by domain so each property is fetched exactly once.
  const byDomain = new Map<string, Keyword[]>()
  for (const k of keywords as Keyword[]) {
    const list = byDomain.get(k.domain) ?? []
    list.push(k)
    byDomain.set(k.domain, list)
  }

  const results: Array<{
    keyword_id: string; domain: string; query: string
    position: number | null; found: boolean; error?: string
  }> = []
  const rows: Record<string, unknown>[] = []
  const domainErrors: Record<string, string> = {}

  for (const [domain, kws] of byDomain) {
    const { byQuery, error: gscErr } = await ranksForDomain(domain)
    if (gscErr) {
      /*
        A domain we cannot read is recorded as an error against every one of its
        keywords, and NOTHING is written for them. Writing a null position for a
        domain whose Search Console we could not reach would be indistinguishable
        from a domain that genuinely ranks for nothing.
      */
      domainErrors[domain] = gscErr
      for (const k of kws) {
        results.push({ keyword_id: k.id, domain, query: k.query, position: null, found: false, error: gscErr })
      }
      continue
    }

    for (const k of kws) {
      const snap: RankSnapshot = byQuery.get(k.query.toLowerCase().trim()) ?? NOT_FOUND
      rows.push({
        keyword_id: k.id,
        position: snap.position,
        url: snap.url,
        title: null,
        snippet: null,
        total_results: null,
        /*
          ai_overview / ai_cited / ai_overview_position are LEFT NULL, not false.
          Only SerpAPI's google_ai_overview block could fill them, and a `false`
          here would claim we looked and found no citation when we did not look
          at all. Null is the honest value and the dashboard renders it as
          "not measured".
        */
        ai_overview: null,
        ai_cited: null,
        ai_overview_position: null,
        impressions: snap.impressions,
        clicks: snap.clicks,
        source: 'gsc',
        raw: null,
      })
      results.push({ keyword_id: k.id, domain, query: k.query, position: snap.position, found: snap.found })
    }
  }

  let written = 0
  if (rows.length) {
    const { error: insErr, count } = await supabaseAdmin
      .from('serp_rankings')
      .insert(rows, { count: 'exact' })
    if (insErr) {
      return NextResponse.json({ ok: false, error: insErr.message, tracked: keywords.length, written: 0 }, { status: 500 })
    }
    written = count ?? rows.length
  }

  /*
    `ok` is whether a RANKING WAS WRITTEN, not whether the request returned 200.
    The old cron reported ok:true from the HTTP status of its inner call, so it
    stayed green for months while every keyword failed and nothing was stored.
  */
  return NextResponse.json({
    ok: written > 0,
    source: 'search-console',
    tracked: keywords.length,
    written,
    found: results.filter((r) => r.found).length,
    domains: byDomain.size,
    ...(Object.keys(domainErrors).length ? { domainErrors } : {}),
    results,
  })
}
