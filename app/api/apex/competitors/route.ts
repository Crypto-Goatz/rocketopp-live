/**
 * POST /api/apex/competitors — real Google Places nearby search.
 *
 * Replaces the old MOCK that returned randomized fake competitor names.
 * Requires GOOGLE_PLACES_API_KEY. Falls back to an empty array (not an
 * error) so the chat flow can keep moving even if Places is down.
 *
 * We geocode the zip first, then run a nearby places search by keyword.
 */

import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const maxDuration = 25

const GEOCODE_URL = 'https://maps.googleapis.com/maps/api/geocode/json'
const NEARBY_URL  = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json'
const TEXT_URL    = 'https://maps.googleapis.com/maps/api/place/textsearch/json'

const INDUSTRY_KEYWORD: Record<string, string> = {
  'Restaurant':             'restaurant',
  'Home Services':          'home services contractor',
  'Retail':                 'retail store',
  'Automotive':             'auto repair',
  'Professional Services':  'professional services',
}

interface Body {
  companyName?: string
  zipCode?: string
  industry?: string
}

interface Competitor {
  name: string
  rating: number
  userRatingsTotal: number
  isPlayer: boolean
}

async function geocodeZip(key: string, zip: string): Promise<{ lat: number; lng: number } | null> {
  try {
    const res = await fetch(`${GEOCODE_URL}?address=${encodeURIComponent(zip)}&key=${key}`, { signal: AbortSignal.timeout(8_000) })
    if (!res.ok) return null
    const j = await res.json() as { results?: Array<{ geometry?: { location?: { lat: number; lng: number } } }> }
    return j.results?.[0]?.geometry?.location || null
  } catch { return null }
}

async function nearbySearch(key: string, loc: { lat: number; lng: number }, keyword: string) {
  const res = await fetch(
    `${NEARBY_URL}?location=${loc.lat},${loc.lng}&radius=8000&keyword=${encodeURIComponent(keyword)}&key=${key}`,
    { signal: AbortSignal.timeout(10_000) },
  )
  if (!res.ok) return []
  const j = await res.json() as { results?: Array<{ name?: string; rating?: number; user_ratings_total?: number }> }
  return (j.results || [])
    .filter(r => r.name && typeof r.rating === 'number')
    .slice(0, 8)
}

async function textSearchFallback(key: string, zip: string, keyword: string) {
  const res = await fetch(
    `${TEXT_URL}?query=${encodeURIComponent(`${keyword} in ${zip}`)}&key=${key}`,
    { signal: AbortSignal.timeout(10_000) },
  )
  if (!res.ok) return []
  const j = await res.json() as { results?: Array<{ name?: string; rating?: number; user_ratings_total?: number }> }
  return (j.results || [])
    .filter(r => r.name && typeof r.rating === 'number')
    .slice(0, 8)
}

export async function POST(req: NextRequest) {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY || ''
  const body = await req.json().catch(() => ({})) as Body
  const { companyName = '', zipCode = '', industry = '' } = body

  if (!apiKey) {
    // Return a minimal structure so the UI still proceeds.
    return NextResponse.json({ ok: false, error: 'places_not_configured', competitors: [{ name: companyName || 'Your business', rating: 0, userRatingsTotal: 0, isPlayer: true }] })
  }

  const keyword = INDUSTRY_KEYWORD[industry] || industry || 'business'
  const loc = zipCode ? await geocodeZip(apiKey, zipCode) : null

  let raw = loc ? await nearbySearch(apiKey, loc, keyword) : []
  if (raw.length === 0) raw = await textSearchFallback(apiKey, zipCode, keyword)

  const you: Competitor = { name: companyName || 'Your business', rating: 0, userRatingsTotal: 0, isPlayer: true }
  const others: Competitor[] = raw
    .filter(r => r.name && r.name.toLowerCase() !== companyName.toLowerCase())
    .map(r => ({
      name: r.name!,
      rating: r.rating || 0,
      userRatingsTotal: r.user_ratings_total || 0,
      isPlayer: false,
    }))

  const all = [you, ...others].sort((a, b) => b.rating - a.rating)
  return NextResponse.json({ ok: true, competitors: all })
}
