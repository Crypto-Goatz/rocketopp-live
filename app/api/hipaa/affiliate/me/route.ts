/**
 * GET  /api/hipaa/affiliate/me?email=…
 *   Return the affiliate + last 50 clicks + payouts.
 *
 * PUT  /api/hipaa/affiliate/me
 *   Update payout info (email, method, details).
 *
 * Lightweight auth: the visitor claims their dashboard by email. Each email has
 * exactly one affiliate row and the slug/portal URL are shared with them on
 * signup. For production, swap the email match for an auth.uid() join once
 * Supabase auth is wired into the dashboard.
 */

import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/db/supabase'

export const runtime = 'nodejs'

export async function GET(req: NextRequest) {
  const email = (req.nextUrl.searchParams.get('email') || '').trim().toLowerCase()
  if (!email) return NextResponse.json({ error: 'email required' }, { status: 400 })

  const aff = await supabaseAdmin
    .from('hipaa_affiliates')
    .select('*')
    .eq('email', email)
    .maybeSingle()

  if (!aff.data) return NextResponse.json({ error: 'not_found' }, { status: 404 })

  const [clicks, payouts] = await Promise.all([
    supabaseAdmin
      .from('hipaa_affiliate_clicks')
      .select('id, created_at, converted, order_amount_cents, commission_cents, utm_source, utm_medium, landing_path')
      .eq('affiliate_id', aff.data.id)
      .order('created_at', { ascending: false })
      .limit(50),
    supabaseAdmin
      .from('hipaa_affiliate_payouts')
      .select('id, amount_cents, status, period_start, period_end, paid_at, method, reference')
      .eq('affiliate_id', aff.data.id)
      .order('created_at', { ascending: false }),
  ])

  return NextResponse.json({
    affiliate: aff.data,
    referralUrl: `https://rocketopp.com/hipaa?ref=${aff.data.slug}`,
    clicks: clicks.data || [],
    payouts: payouts.data || [],
  })
}

export async function PUT(req: NextRequest) {
  const body = await req.json().catch(() => ({})) as {
    email?: string
    payoutMethod?: string
    payoutEmail?: string
    payoutDetails?: Record<string, unknown>
  }
  const email = (body.email || '').trim().toLowerCase()
  if (!email) return NextResponse.json({ error: 'email required' }, { status: 400 })

  const update = await supabaseAdmin
    .from('hipaa_affiliates')
    .update({
      payout_method: body.payoutMethod || null,
      payout_email: body.payoutEmail || null,
      payout_details: body.payoutDetails || null,
    })
    .eq('email', email)
    .select('id, payout_method, payout_email')
    .maybeSingle()

  if (update.error || !update.data) {
    return NextResponse.json({ error: 'update_failed', detail: update.error?.message }, { status: 400 })
  }

  return NextResponse.json({ ok: true, affiliate: update.data })
}
