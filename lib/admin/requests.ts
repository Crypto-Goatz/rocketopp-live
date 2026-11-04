import { supabaseAdmin } from '@/lib/db/supabase'

/**
 * The passthrough. A request (from the dashboard or from a CRM conversation)
 * is triaged: a QUESTION is answered on the spot; a CHANGE (website update,
 * marketing ask) becomes a job — a row here and a task on 0nTask assigned to
 * the AI — and the worker (Claude Code with the /rocketAI skill, through the
 * 0nTask work queue) does it, reports back, and the reply is pushed to wherever
 * the request came from (dashboard row, or the same CRM conversation).
 *
 * The CRM's own AI is NOT the builder: its actions are CRM-native only. The CRM
 * is the chat surface; the work runs on our side through 0n3 as ONE identity.
 */
export type RequestRow = {
  id: string; created_at: string; updated_at: string; site: string; source: string; requested_by: string | null;
  contact_id: string | null; conversation_id: string | null; message: string; kind: 'answer' | 'change';
  status: 'new' | 'queued' | 'working' | 'done' | 'blocked' | 'answered'; reply: string | null; result: string | null; ontask_task_id: string | null; meta: Record<string, unknown>;
}
export const SITE = 'rocketopp.com'
const ON3_URL = (process.env.ON3_URL || 'https://0n3.app').replace(/\/$/, '')
const ON3_TOKEN = process.env.ON3_TOKEN || ''

/* ───────── triage (Groq, free tier) ───────── */
const SYSTEM = `You are the website and marketing concierge for RocketOpp (rocketopp.com), talking to the OWNER, Mike.
Decide whether a message is a QUESTION (answer it: about the site, the CRM, marketing, what something does, status) or a CHANGE REQUEST (anything that asks to edit, add, remove, publish, send, launch, build, fix, post, schedule, or set up something on the website, in the CRM, or in marketing).
Reply ONLY with JSON: {"kind":"answer","reply":"..."} or {"kind":"change","reply":"one sentence confirming what will be done and that it is queued for the build agent","title":"short task title (max 70 chars)"}.
Never invent prices, dates, results, or claim something is already done. Be brief and warm.`

export async function triage(message: string): Promise<{ kind: 'answer' | 'change'; reply: string; title?: string }> {
  const key = process.env.GROQ_API_KEY
  const fallback = { kind: 'change' as const, reply: 'Got it — queued for the build agent. You will see it move on the dashboard.', title: message.slice(0, 70) }
  if (!key) return fallback
  try {
    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST', headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: process.env.GROQ_MODEL || 'llama-3.3-70b-versatile', temperature: 0.2, max_tokens: 400, response_format: { type: 'json_object' }, messages: [{ role: 'system', content: SYSTEM }, { role: 'user', content: message }] }),
    })
    if (!res.ok) throw new Error(`groq ${res.status}`)
    const j = await res.json(); const txt = j.choices?.[0]?.message?.content || '{}'
    const p = JSON.parse(txt)
    if (p.kind === 'answer' && p.reply) return { kind: 'answer', reply: String(p.reply) }
    if (p.kind === 'change') return { kind: 'change', reply: String(p.reply || fallback.reply), title: String(p.title || fallback.title) }
    return fallback
  } catch (e) { console.warn('[requests] triage failed:', (e as Error).message); return fallback }
}

/* ───────── 0nTask job through 0n3 (one identity) ───────── */
async function on3ApiCall(service: string, endpoint: string, params: Record<string, unknown>): Promise<{ ok: boolean; data?: unknown; error?: string }> {
  if (!ON3_TOKEN) return { ok: false, error: 'ON3_TOKEN not set' }
  const body = { jsonrpc: '2.0', id: 1, method: 'tools/call', params: { name: 'api_call', arguments: { service, endpoint, params } } }
  const res = await fetch(`${ON3_URL}/mcp`, { method: 'POST', headers: { Authorization: `Bearer ${ON3_TOKEN}`, 'Content-Type': 'application/json', Accept: 'application/json, text/event-stream' }, body: JSON.stringify(body), cache: 'no-store' })
  const text = await res.text()
  const line = text.split('\n').find((l) => l.startsWith('data: '))
  try {
    const m = JSON.parse((line ?? text).replace(/^data: /, ''))
    const payload = JSON.parse(m.result?.content?.[0]?.text ?? '{}')
    if (payload.success === false) return { ok: false, error: JSON.stringify(payload.data || payload.error || '').slice(0, 300) }
    return { ok: true, data: payload.data ?? payload }
  } catch { return { ok: false, error: `0n3 ${res.status}: ${text.slice(0, 200)}` } }
}

export async function createJob(row: RequestRow, title: string): Promise<{ taskId: string | null; error?: string }> {
  const description = `${row.message}\n\n— Request ${row.id} from ${row.source}${row.requested_by ? ` (${row.requested_by})` : ''} on ${SITE}.\nWhen done: PATCH https://${SITE}/api/admin/requests/${row.id} with {status:"done", result:"what changed + link"} (header x-cron-secret), or mark blocked with what you need. The reply is pushed back to the requester automatically.`
  const r = await on3ApiCall('ontask', 'create_task', { title: `[${SITE}] ${title}`, description, priority: 'high', assignee: 'ai', tags: ['passthrough', SITE] })
  if (!r.ok) return { taskId: null, error: r.error }
  const d = r.data as { task?: { id?: string }; id?: string; data?: { id?: string } }
  const id = d?.task?.id || d?.id || d?.data?.id || null
  return { taskId: id ? String(id) : null }
}

/* ───────── rows ───────── */
export async function insertRequest(input: { source: string; requested_by?: string | null; contact_id?: string | null; conversation_id?: string | null; message: string; kind: 'answer' | 'change'; status: RequestRow['status']; reply?: string | null; meta?: Record<string, unknown> }): Promise<RequestRow> {
  const { data, error } = await supabaseAdmin.from('admin_requests').insert({ site: SITE, ...input, meta: input.meta ?? {} }).select('*').single()
  if (error) throw new Error(`admin_requests insert: ${error.message}`)
  return data as RequestRow
}
export async function updateRequest(id: string, patch: Partial<RequestRow>): Promise<RequestRow | null> {
  const { data, error } = await supabaseAdmin.from('admin_requests').update({ ...patch, updated_at: new Date().toISOString() }).eq('id', id).eq('site', SITE).select('*').maybeSingle()
  if (error) throw new Error(`admin_requests update: ${error.message}`)
  return (data as RequestRow) || null
}
export async function listRequests(limit = 50): Promise<RequestRow[]> {
  const { data, error } = await supabaseAdmin.from('admin_requests').select('*').eq('site', SITE).order('created_at', { ascending: false }).limit(limit)
  if (error) throw new Error(`admin_requests list: ${error.message}`)
  return (data as RequestRow[]) || []
}

/** One entry point for both doors: triage, store, queue, and return the reply to send. */
export async function handleRequest(input: { source: 'dashboard' | 'crm'; requested_by?: string | null; contact_id?: string | null; conversation_id?: string | null; message: string }): Promise<RequestRow> {
  const t = await triage(input.message)
  if (t.kind === 'answer') return insertRequest({ ...input, kind: 'answer', status: 'answered', reply: t.reply })
  const row = await insertRequest({ ...input, kind: 'change', status: 'new', reply: t.reply })
  const job = await createJob(row, t.title || input.message.slice(0, 70))
  const upd = await updateRequest(row.id, job.taskId ? { status: 'queued', ontask_task_id: job.taskId } : { status: 'blocked', result: `could not create the 0nTask job: ${job.error}` })
  return upd || row
}

/* ───────── reply into the CRM conversation the request came from ───────── */
export async function replyToCrm(contactId: string, text: string, type: 'SMS' | 'Email' | 'Live_Chat' = 'SMS'): Promise<{ ok: boolean; error?: string }> {
  const token = process.env.CRM_PIT_ROCKETOPP || process.env.CRM_PIT || ''
  if (!token) return { ok: false, error: 'no_crm_pit' }
  const body: Record<string, unknown> = { type, contactId, message: text }
  if (type === 'Email') { body.subject = 'RocketOpp website concierge'; body.html = `<p>${text.replace(/\n/g, '<br>')}</p>`; body.emailFrom = process.env.CRM_FROM_EMAIL || 'noreply@rocketopp.com' }
  const res = await fetch('https://services.leadconnectorhq.com/conversations/messages', { method: 'POST', headers: { Authorization: `Bearer ${token}`, Version: '2021-04-15', 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
  if (!res.ok) return { ok: false, error: `crm_${res.status}_${(await res.text().catch(() => '')).slice(0, 120)}` }
  return { ok: true }
}
