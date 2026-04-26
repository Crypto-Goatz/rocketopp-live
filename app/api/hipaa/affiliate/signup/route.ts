/**
 * POST /api/hipaa/affiliate/signup
 *
 * Creates a HIPAA affiliate:
 *   1. Upsert row in hipaa_affiliates (generates unique slug)
 *   2. Create/find CRM contact in RocketOpp location with affiliate tag
 *   3. Return affiliate slug + portal URL
 *
 * Payouts are wired up later via the /dashboard/affiliate payment form.
 */

import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/db/supabase'
import { crmPost } from '@/lib/crm/client'
import { sendAffiliateWelcomeEmail } from '@/lib/affiliate-kit/welcome-email'

export const runtime = 'nodejs'

const ROCKETOPP_LOCATION = '6MSqx0trfxgLxeHBJE1k'

function slugify(first: string, last: string): string {
  const base = `${first}-${last}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 32) || 'partner'
  const suffix = Math.random().toString(36).slice(2, 6)
  return `${base}-${suffix}`
}

async function ensureUniqueSlug(first: string, last: string): Promise<string> {
  for (let attempt = 0; attempt < 5; attempt++) {
    const slug = slugify(first, last)
    const { data } = await supabaseAdmin
      .from('hipaa_affiliates')
      .select('id')
      .eq('slug', slug)
      .maybeSingle()
    if (!data) return slug
  }
  return `${slugify(first, last)}-${Date.now().toString(36)}`
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({})) as {
    firstName?: string
    lastName?: string
    email?: string
    company?: string
    linkedinUrl?: string
    referralSource?: string
    acceptedTerms?: boolean
  }

  const firstName = (body.firstName || '').trim()
  const lastName  = (body.lastName || '').trim()
  const email     = (body.email || '').trim().toLowerCase()

  if (!firstName || !lastName || !email || !body.acceptedTerms) {
    return NextResponse.json(
      { error: 'first_name, last_name, email, and accepted_terms are required' },
      { status: 400 },
    )
  }

  const existing = await supabaseAdmin
    .from('hipaa_affiliates')
    .select('id, slug')
    .eq('email', email)
    .maybeSingle()

  if (existing.data) {
    return NextResponse.json({
      ok: true,
      existing: true,
      slug: existing.data.slug,
      referralUrl: `https://rocketopp.com/hipaa?ref=${existing.data.slug}`,
      portalUrl: '/dashboard/affiliate',
    })
  }

  const slug = await ensureUniqueSlug(firstName, lastName)

  let crmContactId: string | null = null
  try {
    const crmRes = await crmPost('/contacts/', ROCKETOPP_LOCATION, {
      firstName,
      lastName,
      email,
      companyName: body.company || undefined,
      tags: ['affiliate-hipaa', 'partner-signup'],
      source: 'hipaa-affiliate-signup',
      customFields: [
        ...(slug          ? [{ key: 'affiliate_slug',        field_value: slug }] : []),
        ...(body.linkedinUrl    ? [{ key: 'linkedin_url',    field_value: body.linkedinUrl }] : []),
        ...(body.referralSource ? [{ key: 'referral_source', field_value: body.referralSource }] : []),
      ],
    })
    if (crmRes.ok) {
      const payload = await crmRes.json().catch(() => ({})) as { contact?: { id?: string }; id?: string }
      crmContactId = payload?.contact?.id || payload?.id || null
    }
  } catch (err) {
    console.error('[affiliate.signup] CRM contact create failed', err)
  }

  const insert = await supabaseAdmin
    .from('hipaa_affiliates')
    .insert({
      slug,
      email,
      first_name: firstName,
      last_name: lastName,
      company: body.company || null,
      linkedin_url: body.linkedinUrl || null,
      referral_source: body.referralSource || null,
      crm_contact_id: crmContactId,
      location_id: ROCKETOPP_LOCATION,
      accepted_terms_at: new Date().toISOString(),
    })
    .select('id, slug')
    .single()

  if (insert.error || !insert.data) {
    return NextResponse.json(
      { error: 'db_insert_failed', detail: insert.error?.message },
      { status: 500 },
    )
  }

  // Welcome email — fire-and-forget. We mark the row whether it lands or not
  // so a single CRM hiccup doesn't block the signup, and we can audit failures.
  const referralUrl = `https://rocketopp.com/hipaa?ref=${insert.data.slug}`
  const emailRes = await sendAffiliateWelcomeEmail({
    firstName,
    email,
    slug:        insert.data.slug,
    referralUrl,
    contactId:   crmContactId,
    locationId:  ROCKETOPP_LOCATION,
  }).catch(err => ({ ok: false, error: err instanceof Error ? err.message : 'unknown' }))

  await supabaseAdmin
    .from('hipaa_affiliates')
    .update({ welcome_email_sent_at: emailRes.ok ? new Date().toISOString() : null })
    .eq('id', insert.data.id)

  return NextResponse.json({
    ok:           true,
    existing:     false,
    slug:         insert.data.slug,
    referralUrl,
    portalUrl:    '/dashboard/affiliate',
    welcomeEmail: emailRes.ok ? 'sent' : `failed:${emailRes.error || ''}`,
  })
}
