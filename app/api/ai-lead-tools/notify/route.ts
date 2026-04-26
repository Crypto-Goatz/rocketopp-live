/**
 * POST /api/ai-lead-tools/notify
 *
 * Captures a notify-me intent for an AI Lead Tool that hasn't shipped
 * yet. Forwards to the RocketOpp CRM so the lead lands tagged
 * "ai-lead-tools-waitlist" + the specific tool slug.
 */

import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'

const WEBHOOK = process.env.AI_LEAD_TOOLS_WEBHOOK_URL
  || process.env.APEX_CRM_WEBHOOK_URL
  || 'https://services.leadconnectorhq.com/hooks/6MSqx0trfxgLxeHBJE1k/webhook-trigger/16e971d9-d576-4b5d-a90f-4cf8224c67e9'

interface Body {
  email?:     string
  name?:      string
  toolSlug?:  string
  toolName?:  string
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({})) as Body
  const email = (body.email || '').trim().toLowerCase()
  if (!email) return NextResponse.json({ error: 'email_required' }, { status: 400 })

  const payload = {
    email,
    name:           body.name || '',
    tool_slug:      body.toolSlug || 'general',
    tool_name:      body.toolName || 'AI Lead Tools',
    intent:         'waitlist',
    tags:           ['ai-lead-tools-waitlist', `tool:${body.toolSlug || 'general'}`],
    source:         'rocketopp.com/ai-lead-tools/notify',
    submitted_at:   new Date().toISOString(),
  }

  try {
    const r = await fetch(WEBHOOK, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(15_000),
    })
    return NextResponse.json({ ok: r.ok, status: r.status })
  } catch (err) {
    return NextResponse.json({ ok: false, error: err instanceof Error ? err.message : 'unknown' }, { status: 502 })
  }
}
