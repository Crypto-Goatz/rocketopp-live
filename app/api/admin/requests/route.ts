import { NextRequest, NextResponse } from 'next/server'
import { readSessionFromRequest } from '@/lib/admin/auth'
import { handleRequest, listRequests } from '@/lib/admin/requests'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/** GET → the request log. POST {message} → triage + queue; returns the row (reply included). Session-gated. */
export async function GET(req: NextRequest) {
  if (!readSessionFromRequest(req)) return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })
  try { return NextResponse.json({ ok: true, requests: await listRequests(100) }) }
  catch (e) { return NextResponse.json({ ok: false, error: (e as Error).message }, { status: 500 }) }
}
export async function POST(req: NextRequest) {
  const s = readSessionFromRequest(req)
  if (!s) return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })
  let body: { message?: string }
  try { body = await req.json() } catch { return NextResponse.json({ ok: false, error: 'bad json' }, { status: 400 }) }
  const message = (body.message || '').trim().slice(0, 4000)
  if (!message) return NextResponse.json({ ok: false, error: 'message required' }, { status: 400 })
  try { return NextResponse.json({ ok: true, request: await handleRequest({ source: 'dashboard', requested_by: s.email, message }) }) }
  catch (e) { return NextResponse.json({ ok: false, error: (e as Error).message }, { status: 500 }) }
}
