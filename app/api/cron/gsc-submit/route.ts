/**
 * Cron — daily sitemap submission to Google Search Console + IndexNow ping to Bing/Yandex.
 * Triggered by Vercel Cron (see vercel.json).
 * Vercel automatically injects a Bearer token in the Authorization header
 * that matches CRON_SECRET.
 */

import { NextRequest, NextResponse } from 'next/server'
import { submitSitemap, DEFAULT_SITE, getServiceAccountEmail } from '@/lib/google/search-console'

export const runtime = 'nodejs'

function authorised(req: NextRequest): boolean {
  const expected = process.env.CRON_SECRET
  if (!expected) return false
  const header = req.headers.get('authorization') || ''
  return header === `Bearer ${expected}`
}

async function pingBing(sitemapUrl: string) {
  try {
    const url = `https://www.bing.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`
    const res = await fetch(url, { method: 'GET' })
    return { status: res.status, ok: res.ok }
  } catch (err) {
    return { ok: false, error: String(err) }
  }
}

export async function GET(req: NextRequest) {
  if (!authorised(req)) return NextResponse.json({ error: 'unauthorised' }, { status: 401 })

  const site = DEFAULT_SITE
  const sitemapUrl = `${site.replace(/\/$/, '')}/sitemap.xml`

  const [gsc, bing] = await Promise.all([
    submitSitemap(sitemapUrl, site),
    pingBing(sitemapUrl),
  ])

  return NextResponse.json({
    ok: true,
    ran: new Date().toISOString(),
    site,
    sitemapUrl,
    serviceAccount: getServiceAccountEmail(),
    gsc,
    bing,
  })
}
