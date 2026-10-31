// ============================================================
// RocketOpp CRM Notify — adopted from 0nCore
// ============================================================
// Central helper for all form submissions:
//   1. Upsert lead contact in CRM
//   2. Fire lead-capture webhook (legacy workflow compat)
//   3. Send direct email to Mike via CRM /conversations/messages
// Guarantees Mike is notified on every submission, regardless of
// whether a CRM workflow is configured.
// ============================================================

import { renderTemplate, formKindFromSource, type TemplateContext } from './email-templates'
import { scoreSpam } from './spam'
import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const CRM_API_BASE = 'https://services.leadconnectorhq.com'
const CRM_API_VERSION = '2021-07-28'

const MIKE_EMAIL = process.env.MIKE_EMAIL || 'mike@rocketopp.com'
const FROM_EMAIL = process.env.CRM_FROM_EMAIL || 'noreply@0nmcp.com'
const LOCATION_ID =
  process.env.CRM_LOCATION_ID ||
  process.env.GHL_LOCATION_ID ||
  '6MSqx0trfxgLxeHBJE1k'
const LOCATION_PIT =
  process.env.CRM_PIT_ROCKETOPP ||
  process.env.CRM_PIT ||
  process.env.CRM_LOCATION_PIT ||
  process.env.GHL_LOCATION_PIT ||
  process.env.GHL_LOCATION_API_KEY ||
  ''

// Legacy lead-capture webhook — keeps existing CRM workflows working
const LEGACY_WEBHOOK_URL =
  'https://services.leadconnectorhq.com/hooks/6MSqx0trfxgLxeHBJE1k/webhook-trigger/888494a8-27e2-4a7d-b3fc-e56243dc86be'

export const FormSources = {
  CONTACT_FORM: 'rocketopp-contact-form',
  INQUIRY_MODAL: 'rocketopp-inquiry-modal',
  ASSESSMENT: 'rocketopp-ai-assessment',
  REQUEST_APP: 'rocketopp-request-app',
  PITCH_IDEA: 'rocketopp-pitch-idea',
  SUPPORT: 'rocketopp-support',
  WEBSITE_OFFER: 'rocketopp-497-website-offer',
  GENERAL: 'rocketopp-website',
} as const

export type FormSource = typeof FormSources[keyof typeof FormSources]

export interface FormSubmission {
  email: string
  firstName?: string
  lastName?: string
  fullName?: string
  phone?: string
  company?: string
  message?: string
  service?: string
  project?: string
  source: FormSource | string
  formName?: string
  pageUrl?: string
  tags?: string[]
  customFields?: Record<string, string | number | boolean>
  // Free-form extras rendered into the notification email body
  extras?: Record<string, string | number | boolean | null | undefined>
  // Hidden honeypot field — real users never fill it; bots do. Forms may pass
  // it straight through; a non-empty value counts toward the spam score (it is
  // no longer decisive alone: browser autofill fills it for real people).
  honeypot?: string
  /** Row already written to contact_submissions by the route — update it instead of inserting a second one. */
  submissionId?: string
  /** Set false when the route sends the visitor its own email (a report, a booking confirmation). Default true. */
  thankLead?: boolean
  userAgent?: string | null
}

export interface NotifyResult {
  success: boolean
  contactId: string | null
  webhookFired: boolean
  mikeEmailed: boolean
  leadThanked: boolean
  error?: string
  /** Set when the submission was blocked as spam before any CRM write. */
  spam?: boolean
  /** contact_submissions row id, when the submission was stored. */
  submissionId?: string | null
  /** True when the submission is safely somewhere: stored, in the CRM, or in Mike's inbox. */
  received: boolean
}

/**
 * Every outbound call in this file gets a hard 10 s ceiling. Without it a slow
 * CRM answer held the route open until the visitor's browser gave up, and the
 * submission looked lost even when it was not.
 */
function crmFetch(input: string, init: RequestInit = {}): Promise<Response> {
  return fetch(input, { ...init, signal: init.signal ?? AbortSignal.timeout(10_000) })
}

function crmHeaders() {
  return {
    Authorization: `Bearer ${LOCATION_PIT}`,
    'Content-Type': 'application/json',
    Version: CRM_API_VERSION,
  }
}

// ── Custom fields ────────────────────────────────────────────────────────────
// Contacts/upsert takes customFields as [{ id, field_value }] — it needs the
// field's ID, not its name. We resolve names → ids once and cache them; if a
// named field doesn't exist yet we create it (TEXT). Best-effort: any failure
// just drops that field rather than blocking the submission.

const customFieldIdCache = new Map<string, string>()

async function resolveCustomFieldId(name: string): Promise<string | null> {
  const key = name.trim().toLowerCase()
  const cached = customFieldIdCache.get(key)
  if (cached) return cached
  if (!LOCATION_PIT) return null

  try {
    const listRes = await crmFetch(
      `${CRM_API_BASE}/locations/${LOCATION_ID}/customFields`,
      { headers: crmHeaders() },
    )
    if (listRes.ok) {
      const data = await listRes.json()
      const fields: Array<{ id?: string; name?: string }> =
        data?.customFields || data?.customField || []
      const match = fields.find((f) => (f.name || '').trim().toLowerCase() === key)
      if (match?.id) {
        customFieldIdCache.set(key, match.id)
        return match.id
      }
    }

    // Not found — create it as a TEXT field on the contact model.
    const createRes = await crmFetch(
      `${CRM_API_BASE}/locations/${LOCATION_ID}/customFields`,
      {
        method: 'POST',
        headers: crmHeaders(),
        body: JSON.stringify({ name, dataType: 'TEXT', model: 'contact' }),
      },
    )
    if (createRes.ok) {
      const data = await createRes.json()
      const id: string | undefined = data?.customField?.id || data?.id
      if (id) {
        customFieldIdCache.set(key, id)
        return id
      }
    } else {
      console.error(
        '[CRM Notify] create custom field failed:',
        createRes.status,
        await createRes.text(),
      )
    }
  } catch (err) {
    console.error('[CRM Notify] resolve custom field error:', err)
  }
  return null
}

/** Turn { "Service Interested in": "…" } into CRM [{ id, field_value }]. */
async function buildContactCustomFields(
  fields?: Record<string, string | number | boolean>,
): Promise<Array<{ id: string; field_value: string }>> {
  if (!fields) return []
  const entries = Object.entries(fields)
  const resolved = await Promise.all(
    entries.map(async ([name, value]) => {
      const id = await resolveCustomFieldId(name)
      return id ? { id, field_value: String(value) } : null
    }),
  )
  return resolved.filter((x): x is { id: string; field_value: string } => x !== null)
}

async function upsertLeadContact(sub: FormSubmission): Promise<string | null> {
  if (!LOCATION_PIT) return null
  const firstName = sub.firstName || sub.fullName?.split(' ')[0] || ''
  const lastName = sub.lastName || sub.fullName?.split(' ').slice(1).join(' ') || ''
  // Resolve any named custom fields (e.g. "Service Interested in") to CRM ids
  // so they're written onto the contact itself — the value overwrites on each
  // submission, so the field always reflects the most recent interest.
  const customFields = await buildContactCustomFields(sub.customFields)
  try {
    const res = await crmFetch(`${CRM_API_BASE}/contacts/upsert`, {
      method: 'POST',
      headers: crmHeaders(),
      body: JSON.stringify({
        locationId: LOCATION_ID,
        email: sub.email,
        firstName,
        lastName,
        phone: sub.phone || undefined,
        companyName: sub.company || undefined,
        source: sub.formName || 'RocketOpp Website',
        tags: sub.tags || ['website-lead', sub.source],
        ...(customFields.length ? { customFields } : {}),
      }),
    })
    if (!res.ok) {
      console.error('[CRM Notify] upsert contact failed:', res.status, await res.text())
      return null
    }
    const data = await res.json()
    return data?.contact?.id || data?.id || null
  } catch (err) {
    console.error('[CRM Notify] upsert contact error:', err)
    return null
  }
}

async function findContactByEmail(email: string): Promise<string | null> {
  if (!LOCATION_PIT) return null
  try {
    const res = await crmFetch(
      `${CRM_API_BASE}/contacts/search/duplicate?locationId=${LOCATION_ID}&email=${encodeURIComponent(email)}`,
      { headers: crmHeaders() }
    )
    if (!res.ok) return null
    const data = await res.json()
    return data?.contact?.id || null
  } catch {
    return null
  }
}

async function ensureMikeContact(): Promise<string | null> {
  const existing = await findContactByEmail(MIKE_EMAIL)
  if (existing) return existing
  try {
    const res = await crmFetch(`${CRM_API_BASE}/contacts/upsert`, {
      method: 'POST',
      headers: crmHeaders(),
      body: JSON.stringify({
        locationId: LOCATION_ID,
        email: MIKE_EMAIL,
        firstName: 'Mike',
        lastName: 'Mento',
        tags: ['team', 'owner'],
      }),
    })
    if (!res.ok) return null
    const data = await res.json()
    return data?.contact?.id || data?.id || null
  } catch {
    return null
  }
}

function buildEmailBody(sub: FormSubmission): { subject: string; html: string } {
  const subject = `[RocketOpp] New ${sub.formName || sub.source} — ${sub.fullName || sub.email}`
  const rows: string[] = []
  const push = (k: string, v: unknown) => {
    if (v === undefined || v === null || v === '') return
    rows.push(
      `<tr><td style="padding:6px 10px;border-bottom:1px solid #eee;color:#666;font-weight:600;">${k}</td><td style="padding:6px 10px;border-bottom:1px solid #eee;">${String(v)}</td></tr>`
    )
  }
  push('Form', sub.formName || sub.source)
  push('Name', sub.fullName || `${sub.firstName || ''} ${sub.lastName || ''}`.trim())
  push('Email', sub.email)
  push('Phone', sub.phone)
  push('Company', sub.company)
  push('Service', sub.service)
  push('Project', sub.project)
  push('Message', sub.message)
  push('Page', sub.pageUrl)
  if (sub.extras) {
    for (const [k, v] of Object.entries(sub.extras)) push(k, v)
  }
  if (sub.customFields) {
    for (const [k, v] of Object.entries(sub.customFields)) push(k, v)
  }
  push('Submitted', new Date().toISOString())
  const html = `
<div style="font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif;max-width:640px;margin:0 auto;background:#fff;color:#111;">
  <div style="background:linear-gradient(90deg,#ff6b35,#ff3b00);padding:20px 24px;color:#fff;">
    <h1 style="margin:0;font-size:18px;font-weight:600;">New submission — ${sub.formName || sub.source}</h1>
  </div>
  <table style="width:100%;border-collapse:collapse;margin:0;">${rows.join('')}</table>
  <div style="padding:14px 24px;color:#999;font-size:12px;">rocketopp.com · notification</div>
</div>`
  return { subject, html }
}

async function emailMike(sub: FormSubmission): Promise<boolean> {
  if (!LOCATION_PIT) return false
  const mikeId = await ensureMikeContact()
  if (!mikeId) return false
  const { subject, html } = buildEmailBody(sub)
  try {
    const res = await crmFetch(`${CRM_API_BASE}/conversations/messages`, {
      method: 'POST',
      headers: crmHeaders(),
      body: JSON.stringify({
        type: 'Email',
        contactId: mikeId,
        subject,
        html,
        emailTo: MIKE_EMAIL,
        emailFrom: FROM_EMAIL,
      }),
    })
    if (!res.ok) {
      console.error('[CRM Notify] email Mike failed:', res.status, await res.text())
      return false
    }
    return true
  } catch (err) {
    console.error('[CRM Notify] email Mike error:', err)
    return false
  }
}

async function fireLegacyWebhook(sub: FormSubmission): Promise<boolean> {
  try {
    const firstName = sub.firstName || sub.fullName?.split(' ')[0] || ''
    const lastName = sub.lastName || sub.fullName?.split(' ').slice(1).join(' ') || ''
    const payload = {
      first_name: firstName,
      last_name: lastName,
      full_name: sub.fullName || `${firstName} ${lastName}`.trim(),
      email: sub.email,
      phone: sub.phone || '',
      company_name: sub.company || '',
      message: sub.message || '',
      service_interested: sub.service || '',
      project_description: sub.project || '',
      source: sub.source,
      form_name: sub.formName || 'RocketOpp Website',
      page_url: sub.pageUrl || 'https://rocketopp.com',
      tags: sub.tags || ['Website Lead'],
      ...(sub.customFields || {}),
      ...(sub.extras || {}),
      submitted_at: new Date().toISOString(),
      send_thank_you_email: true,
      notify_mike: true,
      notification_email: MIKE_EMAIL,
      site_name: 'RocketOpp',
    }
    const res = await crmFetch(LEGACY_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    return res.ok
  } catch (err) {
    console.error('[CRM Notify] legacy webhook error:', err)
    return false
  }
}

async function sendThankYou(sub: FormSubmission, leadContactId: string | null): Promise<boolean> {
  if (!LOCATION_PIT || !leadContactId) return false
  const kind = formKindFromSource(sub.source)
  const ctx: TemplateContext = {
    firstName: sub.firstName || sub.fullName?.split(' ')[0],
    ticketId: sub.customFields?.ticket_id as string | number | undefined,
  }
  const { subject, html, text } = renderTemplate(kind, ctx)
  try {
    const res = await crmFetch(`${CRM_API_BASE}/conversations/messages`, {
      method: 'POST',
      headers: crmHeaders(),
      body: JSON.stringify({
        type: 'Email',
        contactId: leadContactId,
        subject,
        html,
        text,
        emailTo: sub.email,
        emailFrom: FROM_EMAIL,
      }),
    })
    if (!res.ok) {
      console.error('[CRM Notify] thank-you failed:', res.status, await res.text())
      return false
    }
    return true
  } catch (err) {
    console.error('[CRM Notify] thank-you error:', err)
    return false
  }
}

/**
 * Send a password-reset email to a user via the CRM /conversations/messages
 * channel (same transport used for all transactional email on this site).
 * The contact is upserted first so the message has a valid contactId.
 * Returns true if the email was accepted by the CRM.
 */
export async function sendPasswordResetEmail(
  email: string,
  resetUrl: string,
  name?: string
): Promise<boolean> {
  if (!LOCATION_PIT) {
    console.error('[CRM Notify] password reset email skipped: no CRM PIT configured')
    return false
  }
  const firstName = name?.split(' ')[0] || ''
  const lastName = name?.split(' ').slice(1).join(' ') || ''
  let contactId: string | null = null
  try {
    const res = await crmFetch(`${CRM_API_BASE}/contacts/upsert`, {
      method: 'POST',
      headers: crmHeaders(),
      body: JSON.stringify({
        locationId: LOCATION_ID,
        email,
        firstName,
        lastName,
        source: 'RocketOpp Password Reset',
      }),
    })
    if (res.ok) {
      const data = await res.json()
      contactId = data?.contact?.id || data?.id || null
    }
  } catch (err) {
    console.error('[CRM Notify] reset upsert error:', err)
  }
  if (!contactId) contactId = await findContactByEmail(email)
  if (!contactId) {
    console.error('[CRM Notify] password reset email skipped: no contact id')
    return false
  }

  const subject = 'Reset your RocketOpp password'
  const html = `
<div style="font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif;max-width:640px;margin:0 auto;background:#fff;color:#111;">
  <div style="background:linear-gradient(90deg,#ff6b35,#ff3b00);padding:24px;color:#fff;">
    <h1 style="margin:0;font-size:20px;font-weight:600;">Reset your password</h1>
  </div>
  <div style="padding:24px;">
    <p style="margin:0 0 16px;font-size:15px;line-height:1.6;">Hi${firstName ? ` ${firstName}` : ''},</p>
    <p style="margin:0 0 16px;font-size:15px;line-height:1.6;">We received a request to reset the password for your RocketOpp account. Click the button below to choose a new password. This link expires in 1 hour.</p>
    <p style="margin:0 0 24px;text-align:center;">
      <a href="${resetUrl}" style="display:inline-block;background:linear-gradient(90deg,#ff6b35,#ff3b00);color:#fff;text-decoration:none;font-weight:600;padding:12px 28px;border-radius:10px;font-size:15px;">Reset password</a>
    </p>
    <p style="margin:0 0 8px;font-size:13px;color:#666;line-height:1.6;">If the button doesn't work, copy and paste this link into your browser:</p>
    <p style="margin:0 0 24px;font-size:13px;color:#ff6b35;word-break:break-all;">${resetUrl}</p>
    <p style="margin:0;font-size:13px;color:#999;line-height:1.6;">If you didn't request this, you can safely ignore this email — your password won't change.</p>
  </div>
  <div style="padding:14px 24px;color:#999;font-size:12px;border-top:1px solid #eee;">rocketopp.com · RocketOpp LLC</div>
</div>`
  const text = `Reset your RocketOpp password\n\nWe received a request to reset your password. Open this link to choose a new password (expires in 1 hour):\n\n${resetUrl}\n\nIf you didn't request this, ignore this email.`

  try {
    const res = await crmFetch(`${CRM_API_BASE}/conversations/messages`, {
      method: 'POST',
      headers: crmHeaders(),
      body: JSON.stringify({
        type: 'Email',
        contactId,
        subject,
        html,
        text,
        emailTo: email,
        emailFrom: FROM_EMAIL,
      }),
    })
    if (!res.ok) {
      console.error('[CRM Notify] password reset email failed:', res.status, await res.text())
      return false
    }
    return true
  } catch (err) {
    console.error('[CRM Notify] password reset email error:', err)
    return false
  }
}

// ── Storage ─────────────────────────────────────────────────────────────────
// Every submission from every form lands in contact_submissions (Rocket+ master
// DB), whatever happens in the CRM afterwards. One table, so "did anyone submit
// anything" is one query, not a tour of five systems.

let adminClient: SupabaseClient | null | undefined
function admin(): SupabaseClient | null {
  if (adminClient !== undefined) return adminClient
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  adminClient = url && key ? createClient(url, key, { auth: { persistSession: false } }) : null
  if (!adminClient) console.error('[FORM STORE FAILED] Supabase env missing — submissions are not being stored')
  return adminClient
}

async function storeSubmission(sub: FormSubmission, spam: { is: boolean; reason?: string }): Promise<string | null> {
  const db = admin()
  if (!db) return null
  const fullName = sub.fullName || `${sub.firstName || ''} ${sub.lastName || ''}`.trim()
  const row = {
    form_name: sub.formName || sub.source,
    name: fullName || null,
    first_name: sub.firstName || fullName.split(' ')[0] || null,
    last_name: sub.lastName || fullName.split(' ').slice(1).join(' ') || null,
    email: sub.email,
    phone: sub.phone || null,
    company: sub.company || null,
    message: sub.message || null,
    page_url: sub.pageUrl || null,
    source: sub.source,
    user_agent: sub.userAgent || null,
    is_spam: spam.is,
    spam_reason: spam.reason || null,
    raw: {
      service: sub.service, project: sub.project, tags: sub.tags,
      customFields: sub.customFields, extras: sub.extras,
    },
  }
  try {
    if (sub.submissionId) {
      if (spam.is) {
        const { error } = await db.from('contact_submissions')
          .update({ is_spam: true, spam_reason: spam.reason || null }).eq('id', sub.submissionId)
        if (error) console.error('[FORM STORE FAILED] spam flag update:', error.message)
      }
      return sub.submissionId
    }
    const { data, error } = await db.from('contact_submissions').insert(row).select('id').single()
    if (error) {
      console.error(`[FORM STORE FAILED] ${row.form_name} from ${sub.email}:`, error.message)
      return null
    }
    return (data as { id: string } | null)?.id ?? null
  } catch (err) {
    console.error(`[FORM STORE FAILED] ${row.form_name} from ${sub.email}:`, err)
    return null
  }
}

async function recordOutcome(id: string | null, contactId: string | null, problems: string[]) {
  const db = admin()
  if (!db || !id) return
  const { error } = await db.from('contact_submissions').update({
    ghl_contact_id: contactId,
    ghl_synced_at: contactId ? new Date().toISOString() : null,
    ghl_error: problems.length ? problems.join('; ') : null,
  }).eq('id', id)
  if (error) console.error('[FORM STORE FAILED] outcome update:', error.message)
}

/**
 * One-call for every form: store, upsert the lead, fire the webhook, email
 * Mike, and (unless thankLead is false) thank the lead.
 *
 * Never throws and never blocks the visitor on a notification problem — but
 * every failure is logged with a "[FORM NOTIFY FAILED]" prefix (searchable in
 * the Vercel runtime logs) and written to contact_submissions.ghl_error, so a
 * silent outage cannot hide.
 */
export async function notifyFormSubmission(sub: FormSubmission): Promise<NotifyResult> {
  sub = { ...sub, email: (sub.email || '').trim().toLowerCase() }
  // Spam gate — one guard for every form on the site. A blocked submission is
  // stored (is_spam = true) but never reaches the CRM, the webhook, or Mike's
  // inbox. Logged so a false positive is visible and the thresholds can be tuned.
  const verdict = scoreSpam({
    email: sub.email,
    firstName: sub.firstName,
    lastName: sub.lastName,
    fullName: sub.fullName,
    message: sub.message,
    honeypot: sub.honeypot,
  })
  if (verdict.spam) {
    console.warn(`[CRM Notify] blocked spam (score ${verdict.score}): ${verdict.reasons.join(', ')} — ${sub.email} (${sub.formName || sub.source})`)
    const id = await storeSubmission(sub, { is: true, reason: verdict.reasons.join(', ') })
    return { success: false, contactId: null, webhookFired: false, mikeEmailed: false, leadThanked: false, spam: true, submissionId: id, received: Boolean(id) }
  }

  const submissionId = await storeSubmission(sub, { is: false })
  const contactId = await upsertLeadContact(sub)
  const [webhookFired, mikeEmailed, leadThanked] = await Promise.all([
    fireLegacyWebhook(sub),
    emailMike(sub),
    sub.thankLead === false ? Promise.resolve(false) : sendThankYou(sub, contactId),
  ])

  const problems: string[] = []
  if (!LOCATION_PIT) problems.push('no CRM PIT configured')
  if (!contactId) problems.push('CRM contact upsert failed')
  if (!mikeEmailed) problems.push('owner email failed')
  if (problems.length) {
    console.error(
      `[FORM NOTIFY FAILED] ${sub.formName || sub.source} from ${sub.email}: ${problems.join('; ')} — submission ${submissionId ?? 'NOT STORED'}`,
    )
  }
  await recordOutcome(submissionId, contactId, problems)

  return {
    success: Boolean(contactId || webhookFired || mikeEmailed),
    contactId,
    webhookFired,
    mikeEmailed,
    leadThanked,
    submissionId,
    received: Boolean(submissionId || contactId || webhookFired || mikeEmailed),
  }
}
