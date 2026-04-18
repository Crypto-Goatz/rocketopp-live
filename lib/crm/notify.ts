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
}

export interface NotifyResult {
  success: boolean
  contactId: string | null
  webhookFired: boolean
  mikeEmailed: boolean
  leadThanked: boolean
  error?: string
}

function crmHeaders() {
  return {
    Authorization: `Bearer ${LOCATION_PIT}`,
    'Content-Type': 'application/json',
    Version: CRM_API_VERSION,
  }
}

async function upsertLeadContact(sub: FormSubmission): Promise<string | null> {
  if (!LOCATION_PIT) return null
  const firstName = sub.firstName || sub.fullName?.split(' ')[0] || ''
  const lastName = sub.lastName || sub.fullName?.split(' ').slice(1).join(' ') || ''
  try {
    const res = await fetch(`${CRM_API_BASE}/contacts/upsert`, {
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
    const res = await fetch(
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
    const res = await fetch(`${CRM_API_BASE}/contacts/upsert`, {
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
    const res = await fetch(`${CRM_API_BASE}/conversations/messages`, {
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
    const res = await fetch(LEGACY_WEBHOOK_URL, {
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
    const res = await fetch(`${CRM_API_BASE}/conversations/messages`, {
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
 * One-call: upsert lead, fire webhook, email Mike, and thank the lead.
 * Upsert runs first to get the contact ID, then the remaining three run in
 * parallel. Partial failures are reported but never throw.
 */
export async function notifyFormSubmission(sub: FormSubmission): Promise<NotifyResult> {
  const contactId = await upsertLeadContact(sub)
  const [webhookFired, mikeEmailed, leadThanked] = await Promise.all([
    fireLegacyWebhook(sub),
    emailMike(sub),
    sendThankYou(sub, contactId),
  ])
  return {
    success: Boolean(contactId || webhookFired || mikeEmailed),
    contactId,
    webhookFired,
    mikeEmailed,
    leadThanked,
  }
}
