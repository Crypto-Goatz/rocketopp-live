/**
 * GET  /api/serp/keywords         — list keywords (filter by ?domain= optional)
 * POST /api/serp/keywords         — { domain, query, location?, device?, label?, notes? }
 *
 * Backed by the dashboard view so list responses already include the latest
 * position + delta + AI-Overview flag in one round trip.
 */

import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/db/supabase'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const domain = searchParams.get('domain')
  const label = searchParams.get('label')

  let query = supabaseAdmin.from('v_serp_dashboard').select('*').order('domain').order('query')
  if (domain) query = query.eq('domain', domain)
  if (label) query = query.eq('label', label)

  const { data, error } = await query
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  return NextResponse.json({ keywords: data ?? [] })
}

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const domain = String(body.domain ?? '').trim().toLowerCase().replace(/^https?:\/\//, '').replace(/\/.*/, '')
  const query = String(body.query ?? '').trim()
  const location = String(body.location ?? 'United States').trim()
  const device = body.device === 'mobile' ? 'mobile' : 'desktop'
  const label = body.label ? String(body.label).trim() : null
  const notes = body.notes ? String(body.notes).trim() : null

  if (!domain || !query) {
    return NextResponse.json({ error: 'domain and query required' }, { status: 400 })
  }

  const { data, error } = await supabaseAdmin
    .from('serp_keywords')
    .upsert(
      { domain, query, location, device, label, notes, active: true },
      { onConflict: 'domain,query,location,device' },
    )
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  return NextResponse.json({ keyword: data }, { status: 201 })
}
