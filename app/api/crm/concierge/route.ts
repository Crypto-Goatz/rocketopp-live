import { NextRequest, NextResponse } from 'next/server'
import { handleRequest, replyToCrm } from '@/lib/admin/requests'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * POST /api/crm/concierge — the CRM door of the passthrough.
 * Wire a CRM workflow: trigger "Customer Replied" (the owner's contact, on the
 * concierge number / chat widget) → Custom Webhook to this URL with
 *   { "secret": "<CRM_CONCIERGE_SECRET>", "message": "{{message.body}}", "contactId": "{{contact.id}}", "channel": "SMS" }
 * The reply is sent straight back into that conversation. Questions are
 * answered now; changes are queued as a job and the result follows when done.
 */
export async function POST(req: NextRequest) {
  let body: { secret?: string; message?: string; contactId?: string; conversationId?: string; channel?: 'SMS' | 'Email' | 'Live_Chat'; email?: string }
  try { body = await req.json() } catch { return NextResponse.json({ ok: false, error: 'bad json' }, { status: 400 }) }
  const secret = process.env.CRM_CONCIERGE_SECRET
  if (!secret || body.secret !== secret) return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })
  const message = (body.message || '').trim().slice(0, 4000)
  if (!message || !body.contactId) return NextResponse.json({ ok: false, error: 'message and contactId required' }, { status: 400 })
  try {
    const row = await handleRequest({ source: 'crm', requested_by: body.email || null, contact_id: body.contactId, conversation_id: body.conversationId || null, message })
    const text = row.reply || (row.status === 'queued' ? 'Got it — queued for the build agent. I will reply here when it is done.' : 'Got it.')
    const sent = await replyToCrm(body.contactId, text, body.channel || 'SMS')
    return NextResponse.json({ ok: true, reply: text, request: { id: row.id, kind: row.kind, status: row.status, task: row.ontask_task_id }, sent })
  } catch (e) { return NextResponse.json({ ok: false, error: (e as Error).message }, { status: 500 }) }
}
