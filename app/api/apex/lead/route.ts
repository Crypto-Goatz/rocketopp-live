/**
 * POST /api/apex/lead — forward lead + conversation + assessment to the
 * RocketOpp CRM webhook. Keeps the webhook URL server-side so the client
 * can't be spoofed.
 *
 * The webhook payload shape mirrors the original Apex app so the existing
 * GHL workflow trigger keeps working without remapping.
 */

import { NextRequest, NextResponse } from 'next/server'

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

  try {
    const res = await fetch(WEBHOOK, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(15_000),
    })
    return NextResponse.json({ ok: res.ok, status: res.status })
  } catch (err) {
    return NextResponse.json({ ok: false, error: err instanceof Error ? err.message : 'unknown' }, { status: 502 })
  }
}
