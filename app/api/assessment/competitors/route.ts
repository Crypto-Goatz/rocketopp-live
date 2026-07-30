// ============================================================
// Competitors API — finds the user's real local competitors
// ============================================================

import { NextRequest, NextResponse } from 'next/server'
import type { Competitor } from '@/lib/assessment/types'

/**
 * WHAT CHANGED AND WHY — read before touching this file.
 *
 * This route used to invent competitors. With no working data source it returned a
 * hard-coded pool ("Elite Advisory", "Strategic Partners LLC", "Local Experts Inc")
 * with randomised star ratings and review counts, and the UI presented them to the
 * prospect as "Your Competitive Landscape". Those fake names then went into the CRM
 * as `competitors_analyzed`, and into the AI conversation as fact.
 *
 * It was firing on every single assessment, because the Google Places key on this
 * project has HTTP-referer restrictions — Google answers a server-side call with
 * "API keys with referer restrictions cannot be used with this API", the try/catch
 * swallowed it, and the mock path ran. Verified against production's own key.
 *
 * NOTHING IS INVENTED NOW. Either we have real data or we say we do not, and the UI
 * asks the visitor to name their own competitors — which is better input for the
 * assessment anyway, because they know their market better than a text search does.
 *
 * TO TURN REAL LOOKUPS BACK ON, either:
 *   - add a Google Maps key with NO referer restriction (restrict by IP instead) as
 *     GOOGLE_PLACES_SERVER_KEY — a browser-restricted key can never work here; or
 *   - top up the SerpAPI account (SERP_API_KEY exists but is out of searches).
 * Both paths below are live and will be used the moment either credential works.
 */

type Source = 'places' | 'serpapi' | 'unavailable'

export async function POST(request: NextRequest) {
  try {
    const { company, zipCode, industry } = await request.json()
    const name = String(company || '').trim()
    const zip = String(zipCode || '').trim()
    const trade = String(industry || '').trim()

    const self: Competitor = { name: name || 'Your business', rating: 0, userRatingsTotal: 0, isPlayer: true }

    // ── 1. Google Places, if a server-usable key exists ──
    const placesKey = process.env.GOOGLE_PLACES_SERVER_KEY || process.env.GOOGLE_PLACES_API_KEY
    if (placesKey && trade && zip) {
      const found = await searchGooglePlaces(name, zip, trade, placesKey)
      if (found.length) return json(self, found, 'places')
    }

    // ── 2. SerpAPI Google Maps, if the account has searches left ──
    if (process.env.SERP_API_KEY && trade && zip) {
      const found = await searchSerpApi(name, zip, trade, process.env.SERP_API_KEY)
      if (found.length) return json(self, found, 'serpapi')
    }

    // ── 3. No real data. Say so; do not invent any. ──
    return NextResponse.json({
      success: true,
      competitors: [self],
      source: 'unavailable' satisfies Source,
      // The client uses this to switch the step to "type your competitors" instead
      // of showing an empty list or, worse, made-up ones.
      needsManualEntry: true,
    })
  } catch (error) {
    console.error('[Assessment Competitors] error:', error)
    return NextResponse.json({ error: 'Failed to search competitors' }, { status: 500 })
  }
}

function json(self: Competitor, found: Competitor[], source: Source) {
  const hasSelf = found.some((c) => c.isPlayer)
  return NextResponse.json({
    success: true,
    competitors: hasSelf ? found : [self, ...found],
    source,
    needsManualEntry: false,
  })
}

/**
 * Places API (New). The legacy textsearch endpoint is deprecated, and this one
 * returns ratings and review counts in a single field mask.
 *
 * Returns [] on any failure — a thrown error here used to become fabricated data,
 * so the contract is now "real results or none".
 */
async function searchGooglePlaces(
  company: string,
  zipCode: string,
  industry: string,
  apiKey: string,
): Promise<Competitor[]> {
  try {
    const res = await fetch('https://places.googleapis.com/v1/places:searchText', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': apiKey,
        'X-Goog-FieldMask': 'places.displayName,places.rating,places.userRatingCount',
      },
      body: JSON.stringify({ textQuery: `${industry} near ${zipCode}`, maxResultCount: 8 }),
      cache: 'no-store',
    })

    if (!res.ok) {
      const text = await res.text().catch(() => '')
      console.error('[Assessment Competitors] Places denied:', res.status, text.slice(0, 200))
      return []
    }

    const data = (await res.json()) as {
      places?: Array<{
        displayName?: { text?: string }
        rating?: number
        userRatingCount?: number
      }>
    }

    const lower = company.toLowerCase()
    return (data.places || [])
      .map((p) => ({
        name: p.displayName?.text || '',
        rating: p.rating || 0,
        userRatingsTotal: p.userRatingCount || 0,
        isPlayer: Boolean(company) && (p.displayName?.text || '').toLowerCase().includes(lower),
      }))
      .filter((c) => c.name)
      .slice(0, 6)
  } catch (err) {
    console.error('[Assessment Competitors] Places threw:', err)
    return []
  }
}

/** SerpAPI Google Maps fallback. Same contract: real results or none. */
async function searchSerpApi(
  company: string,
  zipCode: string,
  industry: string,
  apiKey: string,
): Promise<Competitor[]> {
  try {
    const qs = new URLSearchParams({
      engine: 'google_maps',
      q: `${industry} near ${zipCode}`,
      type: 'search',
      api_key: apiKey,
    })
    const res = await fetch(`https://serpapi.com/search.json?${qs}`, { cache: 'no-store' })
    const data = (await res.json()) as {
      error?: string
      local_results?: Array<{ title?: string; rating?: number; reviews?: number }>
    }
    if (data.error) {
      console.error('[Assessment Competitors] SerpAPI:', data.error)
      return []
    }

    const lower = company.toLowerCase()
    return (data.local_results || [])
      .map((r) => ({
        name: r.title || '',
        rating: r.rating || 0,
        userRatingsTotal: r.reviews || 0,
        isPlayer: Boolean(company) && (r.title || '').toLowerCase().includes(lower),
      }))
      .filter((c) => c.name)
      .slice(0, 6)
  } catch (err) {
    console.error('[Assessment Competitors] SerpAPI threw:', err)
    return []
  }
}
