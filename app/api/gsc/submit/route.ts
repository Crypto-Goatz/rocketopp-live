/**
 * POST /api/gsc/submit — submit sitemap to Google Search Console.
 * Requires x-admin-token header matching ADMIN_SYNC_TOKEN
 * (or ?token= query param, or cron secret auth).
 */

import { NextRequest, NextResponse } from 'next/server'
import { submitSitemap, listSitemaps, DEFAULT_SITE, getServiceAccountEmail } from '@/lib/google/search-console'

export const runtime = 'nodejs'

function authorised(req: NextRequest): boolean {
  const adminExpected = process.env.ADMIN_SYNC_TOKEN
  const cronExpected = process.env.CRON_SECRET
  const header = req.headers.get('x-admin-token') || new URL(req.url).searchParams.get('token') || ''
  const cronHeader = req.headers.get('authorization') || ''
  if (adminExpected && header === adminExpected) return true
  if (cronExpected && cronHeader === `Bearer ${cronExpected}`) return true
  return false
}

export async function POST(req: NextRequest) {
  if (!authorised(req)) return NextResponse.json({ error: 'unauthorised' }, { status: 401 })

  const site = (await req.json().catch(() => ({})))?.site || DEFAULT_SITE
  const sitemapUrl = `${site.replace(/\/$/, '')}/sitemap.xml`

  const result = await submitSitemap(sitemapUrl, site)
  return NextResponse.json({
    site,
    sitemapUrl,
    serviceAccount: getServiceAccountEmail(),
    submitted: !('error' in (result as any)),
    result,
  })
}

export async function GET(req: NextRequest) {
  if (!authorised(req)) return NextResponse.json({ error: 'unauthorised' }, { status: 401 })
  const site = new URL(req.url).searchParams.get('site') || DEFAULT_SITE
  const list = await listSitemaps(site)
  return NextResponse.json({
    site,
    serviceAccount: getServiceAccountEmail(),
    ...list,
  })
}
