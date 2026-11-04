import { NextRequest, NextResponse } from 'next/server'
import { readSessionFromRequest } from '@/lib/admin/auth'
import { updateRequest, replyToCrm, type RequestRow } from '@/lib/admin/requests'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * PATCH /api/admin/requests/:id {status, result} — the WORKER's report-back.
 * Accepts the admin session OR the worker secret (x-cron-secret = CRON_SECRET).
 * When the request came from a CRM conversation, the result is pushed back to
 * that contact so the person who asked hears the answer where they asked.
 */
export async function PATCH(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params
  const worker = req.headers.get('x-cron-secret') && req.headers.get('x-cron-secret') === process.env.CRON_SECRET
  if (!worker && !readSessionFromRequest(req)) return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })
  let body: { status?: RequestRow['status']; result?: string; reply?: string }
  try { body = await req.json() } catch { return NextResponse.json({ ok: false, error: 'bad json' }, { status: 400 }) }
  const patch: Partial<RequestRow> = {}
  if (body.status && ['new', 'queued', 'working', 'done', 'blocked', 'answered'].includes(body.status)) patch.status = body.status
  if (typeof body.result === 'string') patch.result = body.result.slice(0, 8000)
  if (typeof body.reply === 'string') patch.reply = body.reply.slice(0, 4000)
  try {
    const row = await updateRequest(id, patch)
    if (!row) return NextResponse.json({ ok: false, error: 'not found' }, { status: 404 })
    let crm: { ok: boolean; error?: string } | null = null
    if (row.source === 'crm' && row.contact_id && (body.result || body.reply) && (patch.status === 'done' || patch.status === 'blocked')) {
      crm = await replyToCrm(row.contact_id, `${patch.status === 'done' ? 'Done' : 'Need something from you'}: ${body.result || body.reply}`, (row.meta?.channel as 'SMS' | 'Email' | 'Live_Chat') || 'SMS')
    }
    return NextResponse.json({ ok: true, request: row, crm })
  } catch (e) { return NextResponse.json({ ok: false, error: (e as Error).message }, { status: 500 }) }
}
