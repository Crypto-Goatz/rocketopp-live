import { NextRequest, NextResponse } from 'next/server'
import { checkBotId } from 'botid/server'
import { createClient } from '@supabase/supabase-js'

import { FormSources, notifyFormSubmission } from '@/lib/crm/notify'
import { OFFER_PRICE_DISPLAY, nextDeadline } from '@/lib/offer'

/**
 * $497 website offer — application intake.
 *
 * Every submission must do three things, in this order of importance:
 *   1. Create/update the contact in the CRM (notifyFormSubmission → upsert)
 *   2. Email Mike so a lead is never silently lost
 *   3. Send the applicant a thank-you
 *
 * notifyFormSubmission already does all three plus the legacy webhook. We
 * surface each result flag in the response so a partial failure is visible
 * rather than silently swallowed.
 */
export async function POST(request: NextRequest) {
  try {
    // BotID: reject automated submissions before we create a record, charge a
    // card, or email anyone. Must run first — the point is to spend nothing on a bot.
    const bot = await checkBotId()
    if (bot.isBot) {
      return NextResponse.json({ error: 'Access denied.' }, { status: 403 })
    }

    const data = await request.json()

    const name = String(data.name || '').trim()
    const email = String(data.email || '').trim()

    if (!name || !email) {
      return NextResponse.json(
        { success: false, error: 'Name and email are required.' },
        { status: 400 },
      )
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { success: false, error: 'That email address does not look right.' },
        { status: 400 },
      )
    }

    // Honeypot — bots fill hidden fields, humans do not.
    if (data.website) {
      return NextResponse.json({ success: true, leadId: null, spam: true })
    }

    const parts = name.split(' ')
    const firstName = parts[0]
    const lastName = parts.slice(1).join(' ') || ''

    const business = String(data.business || '').trim()
    const phone = String(data.phone || '').trim()
    const currentSite = String(data.currentSite || '').trim()
    const about = String(data.about || '').trim()

    // Best-effort local record. A Supabase failure must never cost us the lead,
    // so this is logged and stepped over rather than returned as an error.
    let leadId: string | null = null
    try {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
      )
      // Column names must match the real contact_submissions schema — it has
      // form_name/page_url/raw/is_spam, NOT status/metadata. Getting this wrong
      // fails the insert silently, which is exactly what /api/contact/submit
      // had been doing.
      const { data: row, error } = await supabase
        .from('contact_submissions')
        .insert({
          form_name: `${OFFER_PRICE_DISPLAY} Website Offer`,
          name,
          first_name: firstName,
          last_name: lastName,
          email,
          phone: phone || null,
          company: business || null,
          message: about || null,
          page_url: request.headers.get('referer') || 'https://rocketopp.com/497-website',
          source: 'offer_497',
          user_agent: request.headers.get('user-agent'),
          raw: {
            current_site: currentSite || null,
            offer: OFFER_PRICE_DISPLAY,
            deadline: nextDeadline().toISOString(),
          },
        })
        .select()
        .single()
      if (error) console.error('[offer] supabase insert failed:', error.message)
      leadId = row?.id ?? null
    } catch (e) {
      console.error('[offer] supabase unavailable:', e)
    }

    const result = await notifyFormSubmission({
      email,
      firstName,
      lastName,
      fullName: name,
      phone: phone || undefined,
      company: business || undefined,
      message: about || undefined,
      service: `${OFFER_PRICE_DISPLAY} Website Offer`,
      source: FormSources.WEBSITE_OFFER,
      formName: `${OFFER_PRICE_DISPLAY} Website Offer`,
      pageUrl: request.headers.get('referer') || 'https://rocketopp.com/497-website',
      tags: ['Website Lead', '497 Offer', 'web0n'],
      customFields: {
        'Current Website': currentSite || 'None',
        'Offer': OFFER_PRICE_DISPLAY,
      },
      extras: {
        Business: business || '—',
        'Current website': currentSite || 'None',
        'About the business': about || '—',
        'Offer deadline': nextDeadline().toISOString(),
      },
    })

    if (leadId && result.contactId) {
      try {
        const supabase = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.SUPABASE_SERVICE_ROLE_KEY!,
        )
        await supabase
          .from('contact_submissions')
          .update({ ghl_contact_id: result.contactId })
          .eq('id', leadId)
      } catch {
        /* non-fatal */
      }
    }

    if (!result.contactId && !result.mikeEmailed && !result.webhookFired) {
      // Nothing landed anywhere — tell the applicant rather than showing a
      // success screen for a lead we did not actually capture.
      console.error('[offer] submission reached no destination', result)
      return NextResponse.json(
        {
          success: false,
          error:
            'We could not record that just now. Please call (878) 888-1230 — we do not want to lose your enquiry.',
        },
        { status: 502 },
      )
    }

    return NextResponse.json({
      success: true,
      leadId,
      contactId: result.contactId,
      mikeEmailed: result.mikeEmailed,
      leadThanked: result.leadThanked,
    })
  } catch (error) {
    console.error('[offer] submission failed:', error)
    return NextResponse.json(
      { success: false, error: 'Something went wrong. Please call (878) 888-1230.' },
      { status: 500 },
    )
  }
}
