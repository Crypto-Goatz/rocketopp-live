/**
 * RANK TRACKING FROM SEARCH CONSOLE, replacing SerpAPI.
 *
 * WHY THE SWAP. SerpAPI's free plan is 250 searches a month and the tracker ran
 * ~50 keywords a day. Measured across four months of serp_rankings: 10 days of
 * data in May, 5 in June, 4 in July, 5 in August — it burned the entire month's
 * quota in five days and wrote nothing for the other twenty-five, every month,
 * since it was built. It was never daily tracking; it was a five-day sample
 * wearing a cron.
 *
 * WHAT CHANGES, AND IT IS AN UPGRADE. Search Console reports the position
 * Google actually served, averaged over every real impression, for free and
 * with no quota worth worrying about. A SERP scrape is one query from one
 * location at one instant, which is a sample of the same thing with more noise
 * in it.
 *
 * WHAT IS LOST, STATED PLAINLY BECAUSE IT MATTERS:
 *   · competitor positions — GSC reports YOUR site and nothing else
 *   · AI Overview citation — SerpAPI's google_ai_overview block has no free
 *     equivalent, so ai_cited and ai_overview_position stop being written
 *     rather than being filled with a false `false`
 *   · keywords with zero impressions — a term you rank nowhere for is absent
 *     from GSC entirely, so it reports null (not measured) instead of a
 *     position we could not have known
 *
 * The third is the one that changes behaviour: under SerpAPI an unranked term
 * returned "not in the top 100". Here it returns null. Those are different
 * facts and the dashboard must not render them the same way.
 */
import { queryAnalytics } from '@/lib/google/search-console'

export type RankSnapshot = {
  position: number | null
  url: string | null
  impressions: number
  clicks: number
  ctr: number
  /** false = looked and the query is absent from GSC. Never means "rank 100". */
  found: boolean
}

/** GSC needs the property id, which for a domain property is `sc-domain:<host>`. */
export function propertyFor(domain: string): string {
  return `sc-domain:${domain.replace(/^https?:\/\//, '').replace(/^www\./, '').replace(/\/+$/, '')}`
}

function isoDaysAgo(n: number): string {
  return new Date(Date.now() - n * 86_400_000).toISOString().slice(0, 10)
}

/**
 * One call per DOMAIN, not per keyword.
 *
 * The SerpAPI loop made one paid request per keyword and slept 350ms between
 * them; a 50-keyword run was 50 requests and 17 seconds of deliberate delay.
 * GSC returns every query for a property in a single response, so a domain with
 * fifty tracked terms costs one call. That is the whole reason the quota
 * problem disappears rather than moving.
 *
 * The 3-day lag is not a bug: Search Console finalises data on a delay, and
 * asking for today returns an empty set that looks exactly like "you rank for
 * nothing".
 */
export async function ranksForDomain(
  domain: string,
  opts: { days?: number; rowLimit?: number } = {},
): Promise<{ byQuery: Map<string, RankSnapshot>; error: string | null }> {
  const days = opts.days ?? 28
  // site is the SECOND argument, not a field on opts.
  const res = await queryAnalytics(
    {
      startDate: isoDaysAgo(days + 3),
      endDate: isoDaysAgo(3),
      dimensions: ['query', 'page'],
      rowLimit: opts.rowLimit ?? 25_000,
    },
    propertyFor(domain),
  )

  if (res && typeof res === 'object' && 'error' in res) {
    return { byQuery: new Map(), error: String((res as { error: string }).error) }
  }

  const rows = ((res as { rows?: Array<{ keys: string[]; clicks: number; impressions: number; ctr: number; position: number }> })?.rows) ?? []
  const byQuery = new Map<string, RankSnapshot>()

  for (const r of rows) {
    const q = (r.keys?.[0] ?? '').toLowerCase().trim()
    if (!q) continue
    const prev = byQuery.get(q)
    /*
      A query appears once per page it ranks with. The row that matters is the
      one Google actually serves most, so the highest-impression page wins —
      taking the first row would pick whichever page the API happened to order
      first and make the tracked position jump between URLs for no reason.
    */
    if (!prev || r.impressions > prev.impressions) {
      byQuery.set(q, {
        position: r.position ?? null,
        url: r.keys?.[1] ?? null,
        impressions: r.impressions ?? 0,
        clicks: r.clicks ?? 0,
        ctr: r.ctr ?? 0,
        found: true,
      })
    }
  }

  return { byQuery, error: null }
}

/** Absent from GSC. Explicitly not a position. */
export const NOT_FOUND: RankSnapshot = {
  position: null, url: null, impressions: 0, clicks: 0, ctr: 0, found: false,
}
