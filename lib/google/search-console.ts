/**
 * Google Search Console API client using a service account.
 *
 * Prereq: The service account's email (visible via getServiceAccountEmail())
 * must be added as a user on the GSC property (Settings → Users and permissions
 * → Add user → paste SA email → Owner or Full).
 *
 * Docs: https://developers.google.com/webmaster-tools/v1/
 */

import { getGoogleAccessToken } from './auth'

const SCOPE = 'https://www.googleapis.com/auth/webmasters'
const API = 'https://searchconsole.googleapis.com/webmasters/v3'

export const DEFAULT_SITE = process.env.GSC_SITE_URL || 'https://rocketopp.com/'

function encodeSite(site: string): string {
  return encodeURIComponent(site)
}

async function call<T = unknown>(
  path: string,
  init: RequestInit = {}
): Promise<T | { error: string; status?: number }> {
  const token = await getGoogleAccessToken(SCOPE)
  if (!token) return { error: 'no-credentials' }
  const res = await fetch(`${API}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...(init.headers || {}),
    },
  })
  if (res.status === 204) return {} as T
  const text = await res.text()
  let body: unknown
  try { body = text ? JSON.parse(text) : {} } catch { body = text }
  if (!res.ok) return { error: typeof body === 'string' ? body : JSON.stringify(body), status: res.status }
  return body as T
}

// ----- Sitemap management -----

export async function listSitemaps(site: string = DEFAULT_SITE) {
  return call<{ sitemap?: Array<{ path: string; lastSubmitted?: string; isPending?: boolean; isSitemapsIndex?: boolean; errors?: number; warnings?: number; contents?: Array<{ type: string; submitted: string; indexed: string }> }> }>(
    `/sites/${encodeSite(site)}/sitemaps`
  )
}

export async function submitSitemap(sitemapUrl: string, site: string = DEFAULT_SITE) {
  return call(
    `/sites/${encodeSite(site)}/sitemaps/${encodeURIComponent(sitemapUrl)}`,
    { method: 'PUT' }
  )
}

export async function deleteSitemap(sitemapUrl: string, site: string = DEFAULT_SITE) {
  return call(
    `/sites/${encodeSite(site)}/sitemaps/${encodeURIComponent(sitemapUrl)}`,
    { method: 'DELETE' }
  )
}

// ----- Site listing -----

export async function listSites() {
  return call<{ siteEntry?: Array<{ siteUrl: string; permissionLevel: string }> }>('/sites')
}

// ----- Search analytics -----

export interface SearchAnalyticsRow {
  keys: string[]
  clicks: number
  impressions: number
  ctr: number
  position: number
}

export async function queryAnalytics(
  opts: {
    startDate: string // YYYY-MM-DD
    endDate: string
    dimensions?: Array<'query' | 'page' | 'country' | 'device' | 'date' | 'searchAppearance'>
    rowLimit?: number
    startRow?: number
    aggregationType?: 'auto' | 'byPage' | 'byProperty'
    type?: 'web' | 'image' | 'video' | 'news' | 'discover' | 'googleNews'
    dimensionFilterGroups?: unknown[]
  },
  site: string = DEFAULT_SITE
) {
  const body = {
    startDate: opts.startDate,
    endDate: opts.endDate,
    dimensions: opts.dimensions || ['query'],
    rowLimit: opts.rowLimit ?? 100,
    startRow: opts.startRow ?? 0,
    aggregationType: opts.aggregationType || 'auto',
    type: opts.type || 'web',
    ...(opts.dimensionFilterGroups ? { dimensionFilterGroups: opts.dimensionFilterGroups } : {}),
  }
  return call<{ rows?: SearchAnalyticsRow[] }>(
    `/sites/${encodeSite(site)}/searchAnalytics/query`,
    { method: 'POST', body: JSON.stringify(body) }
  )
}

// ----- URL Inspection (indexation check) -----

const INSPECT_API = 'https://searchconsole.googleapis.com/v1/urlInspection/index:inspect'

export async function inspectUrl(url: string, site: string = DEFAULT_SITE) {
  const token = await getGoogleAccessToken(SCOPE)
  if (!token) return { error: 'no-credentials' as const }
  const res = await fetch(INSPECT_API, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ inspectionUrl: url, siteUrl: site, languageCode: 'en-US' }),
  })
  const text = await res.text()
  let body: unknown
  try { body = text ? JSON.parse(text) : {} } catch { body = text }
  if (!res.ok) return { error: typeof body === 'string' ? body : JSON.stringify(body), status: res.status }
  return body
}

export { getServiceAccountEmail } from './auth'
