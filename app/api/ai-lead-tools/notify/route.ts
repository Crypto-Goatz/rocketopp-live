/**
 * POST /api/ai-lead-tools/notify
 *
 * Captures a notify-me intent for an AI Lead Tool that hasn't shipped
 * yet. Forwards to the RocketOpp CRM so the lead lands tagged
 * "ai-lead-tools-waitlist" + the specific tool slug.
 */

import { NextRequest, NextResponse } from 'next/server'
import { notifyFormSubmission } from '@/lib/crm/notify'

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

  // Legacy workflow webhook (best effort) + the shared path: store, CRM contact, email Mike.
  const [hook, result] = await Promise.all([
    fetch(WEBHOOK, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(15_000),
    }).then((r) => r.ok).catch((err) => { console.error('[ai-lead-tools/notify] webhook failed:', err); return false }),
    notifyFormSubmission({
      email,
      fullName: body.name || undefined,
      source: 'rocketopp-ai-lead-tools-waitlist',
      formName: `AI Lead Tools Waitlist — ${payload.tool_name}`,
      pageUrl: req.headers.get('referer') || 'https://rocketopp.com/ai-lead-tools/notify',
      tags: payload.tags,
      extras: { tool: payload.tool_name, tool_slug: payload.tool_slug },
      userAgent: req.headers.get('user-agent'),
    }),
  ])
  if (!hook && !result.received) {
    return NextResponse.json({ ok: false, error: "We couldn't save your request" }, { status: 502 })
  }
  return NextResponse.json({ ok: true })
}
