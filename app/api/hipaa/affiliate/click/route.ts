/**
 * POST /api/hipaa/affiliate/click
 *
 * Logs a referral click. Called by the affiliate tracker when a visitor lands
 * with ?ref= in the URL.
 */

import { NextRequest, NextResponse } from 'next/server'
import { createHash } from 'node:crypto'
import { supabaseAdmin } from '@/lib/db/supabase'

export const runtime = 'nodejs'

function hashIp(ip: string): string {
  return createHash('sha256').update(ip).digest('hex').slice(0, 32)
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({})) as {
    slug?: string
    landingPath?: string
    referrer?: string
    utmSource?: string
    utmMedium?: string
    utmCampaign?: string
  }
  const slug = (body.slug || '').trim()
  if (!slug) return NextResponse.json({ error: 'slug required' }, { status: 400 })

  const { data: aff } = await supabaseAdmin
    .from('hipaa_affiliates')
    .select('id, total_clicks')
    .eq('slug', slug)
    .maybeSingle()

  const forwarded = req.headers.get('x-forwarded-for') || ''
  const rawIp = forwarded.split(',')[0].trim() || req.headers.get('x-real-ip') || ''
  const ipHash = rawIp ? hashIp(rawIp) : null

  await supabaseAdmin.from('hipaa_affiliate_clicks').insert({
    affiliate_id: aff?.id || null,
    slug,
    landing_path: body.landingPath || null,
    referrer: body.referrer || null,
    utm_source: body.utmSource || null,
    utm_medium: body.utmMedium || null,
    utm_campaign: body.utmCampaign || null,
    ip_hash: ipHash,
    user_agent: req.headers.get('user-agent') || null,
  })

  if (aff?.id) {
    await supabaseAdmin
      .from('hipaa_affiliates')
      .update({ total_clicks: (aff.total_clicks ?? 0) + 1 })
      .eq('id', aff.id)
  }

  return NextResponse.json({ ok: true, tracked: !!aff?.id })
}
