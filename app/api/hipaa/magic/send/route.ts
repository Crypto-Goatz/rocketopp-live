import { NextRequest, NextResponse } from 'next/server'

const ONCORE_URL = process.env.ONCORE_API_URL || 'https://0ncore.com'
const SECRET     = process.env.HIPAA_WEBHOOK_SECRET || ''

export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  if (!SECRET) return NextResponse.json({ error: 'server_not_configured' }, { status: 500 })
  const body = await req.json().catch(() => ({}))
  if (!body?.email) return NextResponse.json({ error: 'email_required' }, { status: 400 })

  const r = await fetch(`${ONCORE_URL}/api/hipaa/magic/send`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-hipaa-webhook-secret': SECRET },
    body: JSON.stringify({
      email: body.email,
      website: body.website || null,
      companyName: body.companyName || null,
      returnTo: 'https://rocketopp.com/dashboard/hipaa',
    }),
  })
  const data = await r.json().catch(() => ({}))
  return NextResponse.json(data, { status: r.status })
}
