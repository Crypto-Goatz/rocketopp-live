// ============================================================
// Admin: push all RocketOpp email templates into CRM
// ============================================================
// POST /api/admin/sync-email-templates
//   body: { token: <ADMIN_SYNC_TOKEN> }  (or header x-admin-token)
//
// Creates six thank-you templates in CRM's email builder so they
// appear in Mike's template library and can be attached to
// workflows. Safe to re-run — existing templates are overwritten.
// ============================================================

import { NextRequest, NextResponse } from 'next/server'
import { ALL_KINDS, renderTemplate, CRM_TEMPLATE_SLUGS, type FormKind } from '@/lib/crm/email-templates'

const CRM_API_BASE = 'https://services.leadconnectorhq.com'
const CRM_API_VERSION = '2021-07-28'

function resolvePit(): string {
  return (
    process.env.CRM_PIT_ROCKETOPP ||
    process.env.CRM_PIT ||
    process.env.CRM_LOCATION_PIT ||
    process.env.GHL_LOCATION_PIT ||
    process.env.GHL_LOCATION_API_KEY ||
    ''
  )
}

function resolveLocationId(): string {
  return (
    process.env.CRM_LOCATION_ID ||
    process.env.GHL_LOCATION_ID ||
    '6MSqx0trfxgLxeHBJE1k'
  )
}

function headers(pit: string) {
  return {
    Authorization: `Bearer ${pit}`,
    'Content-Type': 'application/json',
    Version: CRM_API_VERSION,
  }
}

const LABELS: Record<FormKind, string> = {
  contact: 'Thank You — Contact Form',
  support: 'Thank You — Support Ticket',
  general: 'Thank You — General Inquiry',
  request_app: 'Thank You — App Request',
  pitch_idea: 'Thank You — Idea Pitch',
  assessment: 'Thank You — AI Assessment',
}

async function listExisting(pit: string, locationId: string): Promise<Map<string, string>> {
  const map = new Map<string, string>()
  try {
    const res = await fetch(
      `${CRM_API_BASE}/emails/builder?locationId=${locationId}&limit=100`,
      { headers: headers(pit) }
    )
    if (!res.ok) return map
    const data = await res.json()
    const rows = data?.data || data?.builderList || data?.templates || data?.emails || []
    for (const row of rows) {
      const title: string = row?.name || row?.title || ''
      const id: string = row?.id || row?._id || ''
      if (title && id) map.set(title, id)
    }
  } catch {}
  return map
}

async function createOrUpdate(pit: string, locationId: string, existing: Map<string, string>, kind: FormKind) {
  const label = LABELS[kind]
  const { subject, html } = renderTemplate(kind, { firstName: '{{contact.first_name}}' })
  const existingId = existing.get(label)

  // The CRM Email Builder accepts either `templateType: 'html'` with a raw html string
  // or a visual-editor JSON. We use html mode since we've already rendered the shell.
  const basePayload: Record<string, unknown> = {
    locationId,
    name: label,
    title: label,
    subject,
    templateType: 'html',
    html,
    category: 'Transactional',
    tags: ['rocketopp', 'auto-reply', 'thankyou', kind],
  }

  let res: Response
  if (existingId) {
    res = await fetch(`${CRM_API_BASE}/emails/builder/${existingId}`, {
      method: 'PUT',
      headers: headers(pit),
      body: JSON.stringify({ ...basePayload, id: existingId }),
    })
  } else {
    res = await fetch(`${CRM_API_BASE}/emails/builder`, {
      method: 'POST',
      headers: headers(pit),
      body: JSON.stringify(basePayload),
    })
  }

  let body: unknown = null
  try { body = await res.json() } catch { body = await res.text() }

  return {
    kind,
    slug: CRM_TEMPLATE_SLUGS[kind],
    label,
    action: existingId ? 'updated' : 'created',
    status: res.status,
    ok: res.ok,
    body,
  }
}

function authorised(req: NextRequest): boolean {
  const expected = process.env.ADMIN_SYNC_TOKEN
  if (!expected) return false
  const header = req.headers.get('x-admin-token') || ''
  return header === expected
}

export async function POST(req: NextRequest) {
  if (!authorised(req)) {
    return NextResponse.json({ error: 'unauthorised' }, { status: 401 })
  }

  const pit = resolvePit()
  const locationId = resolveLocationId()
  if (!pit) {
    return NextResponse.json({ error: 'CRM PIT not configured' }, { status: 500 })
  }

  const existing = await listExisting(pit, locationId)
  const results = []
  for (const kind of ALL_KINDS) {
    results.push(await createOrUpdate(pit, locationId, existing, kind))
  }

  const ok = results.filter(r => r.ok).length
  return NextResponse.json({
    locationId,
    total: results.length,
    ok,
    failed: results.length - ok,
    results,
  })
}

// GET returns a dry-run preview without calling CRM
export async function GET(req: NextRequest) {
  if (!authorised(req)) {
    return NextResponse.json({ error: 'unauthorised' }, { status: 401 })
  }
  const preview = ALL_KINDS.map((kind) => {
    const { subject } = renderTemplate(kind, { firstName: 'Sample' })
    return { kind, label: LABELS[kind], subject, slug: CRM_TEMPLATE_SLUGS[kind] }
  })
  return NextResponse.json({ locationId: resolveLocationId(), templates: preview })
}
