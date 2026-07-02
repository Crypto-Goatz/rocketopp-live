/**
 * GET /api/settings/crm-connection
 *
 * Read-only health + capability probe for the RocketOpp CRM sub-location
 * (6MSqx0trfxgLxeHBJE1k, which also carries agency permissions).
 *
 * It resolves the same credential the rest of the app uses (OAuth install or
 * PIT, via lib/crm/client) and pings a representative endpoint per capability
 * so the settings card shows what this location can actually do — not a
 * hardcoded list. Nothing is written; every probe is a GET.
 *
 * Dashboard-session gated.
 */

import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth/session'
import { getAuthForLocation, crmGet } from '@/lib/crm/client'

export const runtime = 'nodejs'

const CRM_API = 'https://services.leadconnectorhq.com'
const CRM_VERSION = '2021-07-28'
const LOCATION_ID =
  process.env.CRM_ROCKETOPP_LOCATION_ID || '6MSqx0trfxgLxeHBJE1k'

/** Location-scoped capability probes (crmGet appends ?locationId=…). */
const CAPABILITY_PROBES: { key: string; label: string; path: string }[] = [
  { key: 'contacts', label: 'Contacts', path: '/contacts/' },
  { key: 'opportunities', label: 'Opportunities & Pipelines', path: '/opportunities/pipelines' },
  { key: 'calendars', label: 'Calendars & Booking', path: '/calendars/' },
  { key: 'workflows', label: 'Workflows', path: '/workflows/' },
  { key: 'customFields', label: 'Custom Fields', path: `/locations/${LOCATION_ID}/customFields` },
  { key: 'tags', label: 'Tags', path: `/locations/${LOCATION_ID}/tags` },
  { key: 'users', label: 'Users & Staff', path: '/users/' },
]

async function probe(path: string): Promise<{ ok: boolean; status: number }> {
  try {
    const res = await crmGet(path, LOCATION_ID)
    return { ok: res.ok, status: res.status }
  } catch {
    return { ok: false, status: 0 }
  }
}

export async function GET() {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  const auth = await getAuthForLocation(LOCATION_ID)
  const hasToken = Boolean(auth.token)

  // Location read → connection status + display name.
  let connected = false
  let locationName: string | null = null
  if (hasToken) {
    try {
      const res = await crmGet(`/locations/${LOCATION_ID}`, LOCATION_ID)
      if (res.ok) {
        const data = await res.json()
        locationName = data?.location?.name || data?.name || null
        connected = true
      }
    } catch {
      // leave connected=false
    }
  }

  // Capability matrix (parallel).
  const capabilities = hasToken
    ? await Promise.all(
        CAPABILITY_PROBES.map(async (p) => ({
          key: p.key,
          label: p.label,
          ...(await probe(p.path)),
        })),
      )
    : CAPABILITY_PROBES.map((p) => ({ key: p.key, label: p.label, ok: false, status: 0 }))

  // Agency-level probe: listing sub-accounts only works with an agency-scoped
  // token. Direct fetch (no locationId append) so the endpoint isn't polluted.
  let agencyAccess = false
  if (hasToken) {
    try {
      const res = await fetch(`${CRM_API}/locations/search?limit=1`, {
        headers: {
          Authorization: `Bearer ${auth.token}`,
          Version: CRM_VERSION,
        },
        cache: 'no-store',
      })
      agencyAccess = res.ok
    } catch {
      agencyAccess = false
    }
  }

  return NextResponse.json({
    connected,
    locationId: LOCATION_ID,
    locationName,
    authSource: auth.source, // 'oauth' | 'pit'
    hasToken,
    agencyAccess,
    capabilities,
  })
}
