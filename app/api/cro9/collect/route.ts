/**
 * CRO9 event collector — rocketopp.com edition.
 *
 * Writes every pageview / scan_started / scan_completed / outbound_click
 * event into the shared cro9_events table on the 0nAI Supabase (same DB
 * used by sxowebsite.com). site_id segments the data per property.
 *
 * Env:
 *   CRO9_SUPABASE_URL
 *   CRO9_SUPABASE_SERVICE_KEY
 */

import { NextRequest, NextResponse } from 'next/server'

const CRO9_URL = process.env.CRO9_SUPABASE_URL || ''
const CRO9_KEY = process.env.CRO9_SUPABASE_SERVICE_KEY || ''

export const runtime = 'nodejs'

interface CollectBody {
  site_id?: string
  type?: string
  visitor_id?: string
  session_id?: string
  timestamp?: string
  url?: string
  path?: string
  referrer?: string | null
  utm_source?: string | null
  utm_medium?: string | null
  utm_campaign?: string | null
  device?: string | null
  browser?: string | null
  data?: Record<string, unknown>
}

export async function POST(request: NextRequest) {
  try {
    if (!CRO9_URL || !CRO9_KEY) {
      return NextResponse.json({ error: 'cro9_not_configured' }, { status: 500 })
    }

    const body = (await request.json()) as CollectBody
    const {
      site_id,
      type,
      visitor_id,
      session_id,
      timestamp,
      url,
      path,
      referrer,
      utm_source,
      utm_medium,
      utm_campaign,
      device,
      browser,
      data,
    } = body

    if (!site_id || !type || !visitor_id || !session_id || !url || !path) {
      return NextResponse.json({ error: 'missing_required_fields' }, { status: 400 })
    }

    const country =
      request.headers.get('x-vercel-ip-country') ||
      request.headers.get('cf-ipcountry') ||
      null

    const row = {
      site_id,
      type,
      visitor_id,
      session_id,
      timestamp: timestamp || new Date().toISOString(),
      url,
      path,
      referrer,
      utm_source,
      utm_medium,
      utm_campaign,
      country,
      device,
      browser,
      data,
    }

    const res = await fetch(`${CRO9_URL}/rest/v1/cro9_events`, {
      method: 'POST',
      headers: {
        apikey: CRO9_KEY,
        Authorization: `Bearer ${CRO9_KEY}`,
        'Content-Type': 'application/json',
        Prefer: 'return=minimal',
      },
      body: JSON.stringify(row),
    })

    if (!res.ok) {
      const text = await res.text().catch(() => '')
      console.error('[CRO9] Insert failed:', res.status, text.slice(0, 200))
      return NextResponse.json({ error: 'insert_failed' }, { status: 500 })
    }

    return new NextResponse(null, {
      status: 204,
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
        'Access-Control-Allow-Origin': '*',
      },
    })
  } catch (e) {
    console.error('[CRO9] Collect error:', e)
    return NextResponse.json({ error: 'internal_error' }, { status: 500 })
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}
