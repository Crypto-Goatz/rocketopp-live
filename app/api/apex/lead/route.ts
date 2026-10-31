/**
 * POST /api/apex/lead — forward lead + conversation + assessment to the
 * RocketOpp CRM webhook. Keeps the webhook URL server-side so the client
 * can't be spoofed.
 *
 * The webhook payload shape mirrors the original Apex app so the existing
 * GHL workflow trigger keeps working without remapping.
 */

import { NextRequest, NextResponse } from 'next/server'
import { notifyFormSubmission } from '@/lib/crm/notify'

export const runtime = 'nodejs'
export const maxDuration = 20

const WEBHOOK = process.env.APEX_CRM_WEBHOOK_URL
  || 'https://services.leadconnectorhq.com/hooks/6MSqx0trfxgLxeHBJE1k/webhook-trigger/16e971d9-d576-4b5d-a90f-4cf8224c67e9'

interface Collected { question: string; answer: string }

interface Body {
  name?: string
  email?: string
  phone?: string
  company?: string
  website?: string
  zipCode?: string
  industry?: string
  blueprintUrl?: string | null
  assessment?: unknown
  conversation?: Collected[]
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({})) as Body
  if (!body.email && !body.name) {
    return NextResponse.json({ error: 'name_or_email_required' }, { status: 400 })
  }

  const payload = {
    name:                 body.name || '',
    email:                body.email || '',
    phone:                body.phone || '',
    company_name:         body.company || '',
    website:              body.website || '',
    zip_code:             body.zipCode || '',
    industry:             body.industry || '',
    blueprint_url:        body.blueprintUrl || null,
    assessment_summary:   body.assessment ? JSON.stringify(body.assessment, null, 2) : '',
    conversation_history: (body.conversation || [])
      .map(c => `Q: ${c.question}\nA: ${c.answer}`)
      .join('\n\n---\n\n'),
    source:               'apex.rocketopp.com',
    submitted_at:         new Date().toISOString(),
  }

  const hookP = fetch(WEBHOOK, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(15_000),
  }).then((r) => r.ok).catch((err) => { console.error('[apex/lead] webhook failed:', err); return false })

  // The shared path needs an email to key the CRM contact (estate rule: email is the identity).
  const result = body.email
    ? await notifyFormSubmission({
        email: body.email,
        fullName: body.name || undefined,
        phone: body.phone || undefined,
        company: body.company || undefined,
        source: 'rocketopp-apex-assessment',
        formName: 'Apex AI Assessment',
        pageUrl: req.headers.get('referer') || 'https://rocketopp.com/apex',
        tags: ['Website Lead', 'Apex Assessment'],
        extras: {
          website: payload.website, zip_code: payload.zip_code, industry: payload.industry,
          conversation: payload.conversation_history.slice(0, 4000),
        },
        userAgent: req.headers.get('user-agent'),
      })
    : null
  const hook = await hookP
  if (!hook && !result?.received) {
    return NextResponse.json({ ok: false, error: "We couldn't save your details" }, { status: 502 })
  }
  return NextResponse.json({ ok: true })
}
