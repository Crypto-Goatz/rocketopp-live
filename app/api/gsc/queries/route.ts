/**
 * GET /api/gsc/queries — top search queries for the property.
 * ?days=28 (default) &dim=query|page|device|country &limit=50
 */

import { NextRequest, NextResponse } from 'next/server'
import { queryAnalytics, DEFAULT_SITE } from '@/lib/google/search-console'

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

function ymd(d: Date) { return d.toISOString().slice(0, 10) }

export async function GET(req: NextRequest) {
  if (!authorised(req)) return NextResponse.json({ error: 'unauthorised' }, { status: 401 })

  const params = new URL(req.url).searchParams
  const days = Math.max(1, Math.min(90, Number(params.get('days') || 28)))
  const dim = (params.get('dim') || 'query') as 'query' | 'page' | 'device' | 'country'
  const limit = Math.max(1, Math.min(1000, Number(params.get('limit') || 50)))
  const site = params.get('site') || DEFAULT_SITE

  const end = new Date()
  const start = new Date(Date.now() - days * 86_400_000)

  const result = await queryAnalytics(
    { startDate: ymd(start), endDate: ymd(end), dimensions: [dim], rowLimit: limit },
    site
  )

  return NextResponse.json({
    site,
    range: { start: ymd(start), end: ymd(end), days },
    dimension: dim,
    ...result,
  })
}
