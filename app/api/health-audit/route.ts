/**
 * POST /api/health-audit
 *   body: { url, categories, email, firstName?, company? }
 *
 * Returns immediately with {queued:true}. The audit runs in the
 * background via `after()` and emails the user + notifies Mike on
 * completion. ~30-55s runtime.
 */

import { NextRequest, NextResponse } from 'next/server'
import { after } from 'next/server'
import { runAudit } from '@/lib/audit/runner'
import { renderAuditEmail } from '@/lib/audit/report'
import { notifyFormSubmission, FormSources } from '@/lib/crm/notify'
import type { TestCategory } from '@/lib/audit/types'

export const runtime = 'nodejs'
export const maxDuration = 60

const CRM_API_BASE = 'https://services.leadconnectorhq.com'
const CRM_API_VERSION = '2021-07-28'
const FROM_EMAIL = process.env.CRM_FROM_EMAIL || 'noreply@0nmcp.com'
const LOCATION_ID =
  process.env.CRM_LOCATION_ID ||
  process.env.GHL_LOCATION_ID ||
  '6MSqx0trfxgLxeHBJE1k'
const LOCATION_PIT =
  process.env.CRM_PIT_ROCKETOPP ||
  process.env.CRM_PIT ||
  process.env.GHL_LOCATION_PIT ||
  process.env.GHL_LOCATION_API_KEY ||
  ''

async function sendReport(toEmail: string, contactId: string, subject: string, html: string, text: string) {
  if (!LOCATION_PIT || !contactId) return false
  try {
    const res = await fetch(`${CRM_API_BASE}/conversations/messages`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${LOCATION_PIT}`,
        'Content-Type': 'application/json',
        Version: CRM_API_VERSION,
      },
      body: JSON.stringify({
        type: 'Email',
        contactId,
        subject,
        html,
        text,
        emailTo: toEmail,
        emailFrom: FROM_EMAIL,
      }),
    })
    return res.ok
  } catch {
    return false
  }
}

export async function POST(req: NextRequest) {
  let body: any
  try { body = await req.json() } catch { return NextResponse.json({ error: 'invalid json' }, { status: 400 }) }

  const { url, categories, email, firstName, lastName, company } = body || {}

  if (!url || typeof url !== 'string') return NextResponse.json({ error: 'url is required' }, { status: 400 })
  if (!email || typeof email !== 'string' || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email))
    return NextResponse.json({ error: 'valid email is required' }, { status: 400 })

  const cats: TestCategory[] = Array.isArray(categories) ? categories.filter((c): c is TestCategory => [
    'infrastructure', 'tls', 'headers', 'stack', 'paths', 'assets',
  ].includes(c)) : []

  // Register the lead + notify Mike synchronously so it never gets lost
  const notifyResult = await notifyFormSubmission({
    email,
    firstName,
    lastName,
    fullName: [firstName, lastName].filter(Boolean).join(' ') || undefined,
    company,
    source: 'rocketopp-health-audit',
    formName: 'CRO9 Stack Health Audit',
    pageUrl: 'https://rocketopp.com/health-check',
    tags: ['Website Lead', 'Stack Audit', 'Health Check'],
    extras: {
      target_url: url,
      requested_categories: cats.join(', ') || 'all',
    },
  })

  // Run the audit + send the report in the background after response
  after(async () => {
    try {
      const report = await runAudit({ url, categories: cats })
      const { subject, html, text } = renderAuditEmail(report)

      if (notifyResult.contactId) {
        await sendReport(email, notifyResult.contactId, subject, html, text)
      }

      // Also ping Mike with the grade for quick triage
      const mikeBody = {
        type: 'Email',
        contactId: notifyResult.contactId, // reuse same thread; CRM will route
        subject: `[Audit] ${report.target} → ${report.grade} (${report.score})`,
        html: `<p>Audit completed for <strong>${report.target}</strong>.</p>
               <p>Grade: <strong>${report.grade}</strong> (${report.score}/100)</p>
               <p>Requested by: ${email}${firstName ? ` (${firstName})` : ''}${company ? ` — ${company}` : ''}</p>
               <p>Critical: ${report.findings.filter(f=>f.severity==='critical').length} · High: ${report.findings.filter(f=>f.severity==='high').length} · Medium: ${report.findings.filter(f=>f.severity==='medium').length}</p>`,
        emailTo: process.env.MIKE_EMAIL || 'mike@rocketopp.com',
        emailFrom: FROM_EMAIL,
      }
      if (LOCATION_PIT && notifyResult.contactId) {
        await fetch(`${CRM_API_BASE}/conversations/messages`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${LOCATION_PIT}`,
            'Content-Type': 'application/json',
            Version: CRM_API_VERSION,
          },
          body: JSON.stringify(mikeBody),
        }).catch(() => {})
      }
    } catch (err) {
      console.error('[health-audit] background error:', err)
    }
  })

  return NextResponse.json({
    queued: true,
    leadCaptured: notifyResult.success,
    contactId: notifyResult.contactId,
    message: 'Audit queued. You will receive your report by email within 5-10 minutes.',
  })
}
