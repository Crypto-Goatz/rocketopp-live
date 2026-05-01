/**
 * SerpAPI client — minimal wrapper for the Google Search engine.
 *
 * Used by /api/serp/track and the cron job that runs daily. Returns a
 * normalized snapshot we can persist directly into serp_rankings.
 *
 * Docs: https://serpapi.com/search-api
 */

const SERP_BASE = 'https://serpapi.com/search.json'

export interface SerpQuery {
  q: string
  domain: string
  location?: string
  device?: 'desktop' | 'mobile'
  hl?: string
  gl?: string
}

export interface SerpSnapshot {
  position: number | null
  url: string | null
  title: string | null
  snippet: string | null
  total_results: number | null
  ai_overview: boolean
  ai_cited: boolean
  ai_overview_position: number | null
  raw: unknown
}

/**
 * Run a single SerpAPI query, find the tracked domain in the organic
 * results + AI Overview citations, return the normalized snapshot.
 *
 * Returns position=null when the domain is not in the top 100 organic
 * results AND not in any AI Overview citation.
 */
export async function searchSerp({
  q,
  domain,
  location = 'United States',
  device = 'desktop',
  hl = 'en',
  gl = 'us',
}: SerpQuery): Promise<SerpSnapshot> {
  const key = process.env.SERP_API_KEY
  if (!key) throw new Error('SERP_API_KEY not configured')

  const params = new URLSearchParams({
    q,
    api_key: key,
    engine: 'google',
    location,
    hl,
    gl,
    num: '100',
    device,
  })

  const res = await fetch(`${SERP_BASE}?${params}`, {
    headers: { accept: 'application/json' },
    // SerpAPI handles caching on their side; we don't want Next.js cache.
    cache: 'no-store',
  })
  if (!res.ok) {
    const err = await res.text()
    throw new Error(`SerpAPI ${res.status}: ${err.slice(0, 200)}`)
  }
  const data = await res.json()
  return normalize(domain, data)
}

function normalize(domain: string, data: Record<string, unknown>): SerpSnapshot {
  const target = domain.toLowerCase().replace(/^www\./, '')

  // ─── Organic results lookup ───────────────────────────────────────
  const organic = (data.organic_results as Array<Record<string, unknown>>) ?? []
  let position: number | null = null
  let url: string | null = null
  let title: string | null = null
  let snippet: string | null = null

  for (const r of organic) {
    const rUrl = (r.link as string) ?? ''
    if (rUrl) {
      try {
        const host = new URL(rUrl).hostname.toLowerCase().replace(/^www\./, '')
        if (host === target || host.endsWith('.' + target)) {
          position = (r.position as number) ?? null
          url = rUrl
          title = (r.title as string) ?? null
          snippet = (r.snippet as string) ?? null
          break
        }
      } catch {
        // ignore malformed URLs
      }
    }
  }

  // ─── AI Overview presence + citation check ─────────────────────────
  const aiOverview = data.ai_overview as Record<string, unknown> | undefined
  const ai_overview = !!aiOverview
  let ai_cited = false
  let ai_overview_position: number | null = null

  if (aiOverview) {
    const refs = (aiOverview.references as Array<Record<string, unknown>>) ?? []
    refs.forEach((ref, idx) => {
      const refUrl = (ref.link as string) ?? ''
      if (!refUrl || ai_cited) return
      try {
        const host = new URL(refUrl).hostname.toLowerCase().replace(/^www\./, '')
        if (host === target || host.endsWith('.' + target)) {
          ai_cited = true
          ai_overview_position = idx + 1
        }
      } catch {
        // ignore
      }
    })
  }

  // ─── Total result count ────────────────────────────────────────────
  const search_info = (data.search_information as Record<string, unknown>) ?? {}
  const total_results = (search_info.total_results as number) ?? null

  return {
    position,
    url,
    title,
    snippet,
    total_results,
    ai_overview,
    ai_cited,
    ai_overview_position,
    raw: data,
  }
}
