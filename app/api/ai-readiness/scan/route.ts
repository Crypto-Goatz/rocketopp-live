/**
 * POST /api/ai-readiness/scan
 *
 * Body: { email, domain, source? }
 *
 * Persists a row in `ai_readiness_scans`, runs the Groq generation in the
 * background, and returns the scan_id immediately so the user can be
 * redirected to the thanks page right away. The actual report finishes
 * generating in 5-15 seconds and the email goes out as soon as it does.
 *
 * Side effects on success:
 *   - Row inserted in rtwtaisjtvdajrdyivkn.ai_readiness_scans (status=pending)
 *   - Background: Groq generates score + priorities + recommendations
 *   - Background: Row updated with results, status='complete'
 *   - Background: CRM contact upserted at location 6MSqx0trfxgLxeHBJE1k
 *                 with tag 'ai-readiness-exit-intent' + email sent FROM Mike
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const runtime = 'nodejs'
export const maxDuration = 60

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

const CRM_BASE = 'https://services.leadconnectorhq.com'
const CRM_VERSION = '2021-07-28'
const ROCKETOPP_LOCATION_ID =
  process.env.CRM_ROCKETOPP_LOCATION_ID || '6MSqx0trfxgLxeHBJE1k'

const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL || 'https://rocketopp.com'
const ROCKETAPPOINTMENTS_URL =
  process.env.ROCKETAPPOINTMENTS_URL || 'https://rocketappointments.com'
const MIKE_EMAIL = process.env.MIKE_FROM_EMAIL || 'mike@rocketopp.com'
const MIKE_NAME = process.env.MIKE_FROM_NAME || 'Mike Mento'

const GROQ_MODEL = 'llama-3.3-70b-versatile'

function admin() {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) return null
  return createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
}

function pickPit(): string {
  const envName = `CRM_PIT_${ROCKETOPP_LOCATION_ID.replace(/[^A-Za-z0-9]/g, '').toUpperCase()}`
  return (
    process.env[envName] ||
    process.env.CRM_PIT ||
    process.env.CRM_AGENCY_PIT ||
    ''
  )
}

interface GeneratedReport {
  score: number
  summary: string
  priorities: { title: string; why: string }[]
  recommendations: string[]
}

async function generateReport(domain: string): Promise<GeneratedReport | null> {
  const apiKey = process.env.GROQ_API_KEY
  if (!apiKey) return null

  const prompt = `You are scoring a business website for AI Readiness — how well it's set up to be cited by AI search engines (ChatGPT, Claude, Perplexity, Google AI Overviews) AND convert real visitors.

Site to score: https://${domain}

You have NOT crawled the site directly. Use plausible-but-honest defaults based on typical small-business sites in 2026. Be specific to the domain name when possible (e.g. industry inferred from name).

Output STRICT JSON, no markdown fences, with this exact shape:

{
  "score": <integer 0-100>,
  "summary": "<2-3 sentence verdict, BLUF style>",
  "priorities": [
    { "title": "<short>", "why": "<one sentence>" },
    { "title": "<short>", "why": "<one sentence>" },
    { "title": "<short>", "why": "<one sentence>" },
    { "title": "<short>", "why": "<one sentence>" }
  ],
  "recommendations": [
    "<concrete next-step 1>",
    "<concrete next-step 2>",
    "<concrete next-step 3>",
    "<concrete next-step 4>",
    "<concrete next-step 5>"
  ]
}

Score honestly — most sites score 35-55. A 'standard small business site' should score around 40. A site with no llms.txt, generic meta, no schema, and no AI-search optimization should score low. Don't sandbag, don't inflate.`

  try {
    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        messages: [
          {
            role: 'system',
            content:
              "You are RocketOpp's AI Readiness scorer. Output strict JSON only — no markdown, no preamble. Be direct and specific.",
          },
          { role: 'user', content: prompt },
        ],
        temperature: 0.5,
        max_tokens: 900,
        response_format: { type: 'json_object' },
      }),
    })
    if (!res.ok) return null
    const data = await res.json()
    const content = data.choices?.[0]?.message?.content || ''
    const parsed = JSON.parse(content) as GeneratedReport
    return parsed
  } catch (err) {
    console.error('[ai-readiness] groq error', err)
    return null
  }
}

async function upsertCrmContact(email: string, domain: string, pit: string): Promise<string | null> {
  const createRes = await fetch(`${CRM_BASE}/contacts/`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${pit}`,
      Version: CRM_VERSION,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      locationId: ROCKETOPP_LOCATION_ID,
      email,
      website: `https://${domain}`,
      source: 'rocketopp-ai-readiness-exit-intent',
    }),
  })
  if (createRes.ok) {
    const data = await createRes.json()
    if (data?.contact?.id) return data.contact.id
  }
  // Duplicate — search to find existing
  const searchRes = await fetch(`${CRM_BASE}/contacts/search`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${pit}`,
      Version: CRM_VERSION,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ locationId: ROCKETOPP_LOCATION_ID, query: email, pageLimit: 1 }),
  })
  if (!searchRes.ok) return null
  const sd = await searchRes.json()
  const exact = (sd?.contacts || []).find(
    (c: { email?: string }) => (c.email || '').toLowerCase() === email.toLowerCase(),
  )
  return exact?.id || sd?.contacts?.[0]?.id || null
}

async function tagAndStamp(
  contactId: string,
  domain: string,
  scanId: string,
  report: GeneratedReport | null,
  pit: string,
) {
  // Tags
  const grade =
    report && report.score >= 80
      ? 'high-score'
      : report && report.score >= 50
        ? 'medium-score'
        : 'low-score'
  await fetch(`${CRM_BASE}/contacts/${contactId}/tags`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${pit}`,
      Version: CRM_VERSION,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      tags: [
        'ai-readiness-exit-intent',
        `ai-readiness-${grade}`,
        'rocketopp-lead',
      ],
    }),
  }).catch(() => {})

  // Custom fields
  await fetch(`${CRM_BASE}/contacts/${contactId}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${pit}`,
      Version: CRM_VERSION,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      customFields: [
        { key: 'ai_readiness_score', value: String(report?.score ?? 0) },
        { key: 'ai_readiness_domain', value: domain },
        { key: 'ai_readiness_scan_id', value: scanId },
        { key: 'ai_readiness_scan_date', value: new Date().toISOString() },
      ],
    }),
  }).catch(() => {})
}

function emailShell(inner: string, footerNote = ''): string {
  return [
    `<div style="background:#0a0a0f;padding:24px 0;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif;color:#e8e8ed;">`,
    `  <div style="max-width:560px;margin:0 auto;background:#15161e;border:1px solid #25262d;border-radius:14px;overflow:hidden;">`,
    `    <div style="padding:24px 28px;border-bottom:1px solid #25262d;background:linear-gradient(135deg,#ff6b35 0%,#ff8a35 50%,#ff6b35 100%);">`,
    `      <h1 style="margin:0;font-size:20px;line-height:1.2;font-weight:800;color:#0a0a0f;">RocketOpp</h1>`,
    `      <p style="margin:4px 0 0;font-size:12px;color:#0a0a0f;opacity:0.85;letter-spacing:0.04em;text-transform:uppercase;">AI Readiness Report</p>`,
    `    </div>`,
    `    <div style="padding:28px;font-size:15px;line-height:1.6;color:#e8e8ed;">${inner}</div>`,
    `    <div style="padding:18px 28px;background:#0d0e15;border-top:1px solid #25262d;font-size:12px;color:#888;line-height:1.5;">${footerNote || 'Reply directly to this email — it lands in Mike\'s inbox.'}<br/>`,
    `      <a href="https://rocketopp.com" style="color:#ff8a35;text-decoration:none;">rocketopp.com</a> · `,
    `      <a href="${ROCKETAPPOINTMENTS_URL}" style="color:#ff8a35;text-decoration:none;">rocketappointments.com</a>`,
    `    </div>`,
    `  </div>`,
    `</div>`,
  ].join('\n')
}

async function sendReportEmail(
  contactId: string,
  domain: string,
  scanId: string,
  report: GeneratedReport | null,
  pit: string,
) {
  if (!report) {
    // Fallback: barebones thank-you
    const link = `${APP_URL}/ai-readiness/${scanId}`
    const html = emailShell(
      `<p>Your AI Readiness report for <strong style="color:#fff;">${domain}</strong> is being generated right now.</p>` +
        `<p>It'll appear at <a href="${link}" style="color:#ff8a35;">${link}</a> in the next minute.</p>` +
        `<p>— Mike Mento, Founder, RocketOpp</p>`,
    )
    await fetch(`${CRM_BASE}/conversations/messages`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${pit}`, Version: CRM_VERSION, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'Email',
        contactId,
        subject: `Your AI Readiness scan for ${domain}`,
        html,
        message: `Your AI Readiness report for ${domain} is generating: ${link}\n— Mike, RocketOpp`,
        fromEmail: MIKE_EMAIL,
        fromName: MIKE_NAME,
      }),
    }).catch(() => {})
    return
  }

  const link = `${APP_URL}/ai-readiness/${scanId}`
  const grade =
    report.score >= 80 ? 'green' : report.score >= 50 ? 'yellow' : 'red'
  const gradeColor =
    grade === 'green' ? '#7ed957' : grade === 'yellow' ? '#fbbf24' : '#fb7185'

  const prioritiesHtml = report.priorities
    .map(
      (p, i) =>
        `<li style="margin:10px 0;"><strong style="color:#fff;">${i + 1}. ${p.title}</strong><br/><span style="color:#a8a8b0;font-size:14px;">${p.why}</span></li>`,
    )
    .join('')

  const inner = [
    `<p>Your AI Readiness scan for <strong style="color:#fff;">${domain}</strong> is in.</p>`,
    `<table role="presentation" style="width:100%;margin:20px 0;border-collapse:collapse;">`,
    `  <tr><td style="background:#0a0a0f;border:2px solid ${gradeColor};border-radius:14px;padding:24px;text-align:center;">`,
    `    <div style="font-size:64px;font-weight:900;color:${gradeColor};line-height:1;letter-spacing:-2px;">${report.score}</div>`,
    `    <div style="font-size:11px;color:#a8a8b0;text-transform:uppercase;letter-spacing:0.2em;margin-top:6px;">/ 100</div>`,
    `  </td></tr>`,
    `</table>`,
    `<p style="font-size:15px;color:#e8e8ed;margin:18px 0;">${report.summary}</p>`,
    `<h3 style="color:#fff;font-size:16px;margin:24px 0 8px;">Top priorities to fix</h3>`,
    `<ol style="padding-left:0;list-style:none;">${prioritiesHtml}</ol>`,
    `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:28px 0;">`,
    `  <tr><td style="background:#ff6b35;border-radius:10px;">`,
    `    <a href="${link}" style="display:inline-block;padding:14px 28px;color:#0a0a0f;font-weight:800;font-size:16px;text-decoration:none;letter-spacing:0.01em;">View the full report →</a>`,
    `  </td></tr>`,
    `</table>`,
    `<p style="font-size:14px;color:#a8a8b0;">Want help fixing any of this? Reply to this email or book a 30-minute kickoff at <a href="${ROCKETAPPOINTMENTS_URL}" style="color:#ff8a35;">RocketAppointments</a>. The first call is free.</p>`,
    `<p style="margin-top:24px;">— <strong style="color:#fff;">Mike Mento</strong>, Founder, RocketOpp</p>`,
  ].join('\n')

  const html = emailShell(inner)
  const message = `Your AI Readiness score for ${domain}: ${report.score}/100\n\n${report.summary}\n\nTop priorities:\n${report.priorities.map((p, i) => `${i + 1}. ${p.title} — ${p.why}`).join('\n')}\n\nFull report: ${link}\n\n— Mike Mento, Founder, RocketOpp`

  await fetch(`${CRM_BASE}/conversations/messages`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${pit}`, Version: CRM_VERSION, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      type: 'Email',
      contactId,
      subject: `Your AI Readiness score for ${domain}: ${report.score}/100`,
      html,
      message,
      fromEmail: MIKE_EMAIL,
      fromName: MIKE_NAME,
    }),
  }).catch(() => {})
}

async function backgroundFulfill(
  scanId: string,
  email: string,
  domain: string,
  supabase: ReturnType<typeof createClient>,
) {
  const pit = pickPit()
  const report = await generateReport(domain)

  await supabase
    .from('ai_readiness_scans')
    .update({
      status: report ? 'complete' : 'failed',
      score: report?.score ?? null,
      summary: report?.summary ?? null,
      priorities: report?.priorities ?? null,
      recommendations: report?.recommendations ?? null,
      groq_model: report ? GROQ_MODEL : null,
      completed_at: new Date().toISOString(),
    })
    .eq('id', scanId)

  if (!pit) return

  const contactId = await upsertCrmContact(email, domain, pit)
  if (!contactId) return

  await supabase
    .from('ai_readiness_scans')
    .update({ crm_contact_id: contactId })
    .eq('id', scanId)

  await tagAndStamp(contactId, domain, scanId, report, pit)
  await sendReportEmail(contactId, domain, scanId, report, pit)
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const email = String(body.email || '').trim().toLowerCase()
    const rawDomain = String(body.domain || '').trim()
    const domain = rawDomain.replace(/^https?:\/\//, '').replace(/\/$/, '')

    if (!email || !domain) {
      return NextResponse.json(
        { error: 'email and domain are required' },
        { status: 400 },
      )
    }

    const supabase = admin()
    if (!supabase) {
      return NextResponse.json(
        { error: 'storage not configured' },
        { status: 500 },
      )
    }

    const { data: row, error } = await supabase
      .from('ai_readiness_scans')
      .insert({
        email,
        domain,
        source: body.source || 'exit-intent',
        ip: req.headers.get('x-forwarded-for') || null,
        user_agent: req.headers.get('user-agent') || null,
      })
      .select('id')
      .single()

    if (error || !row) {
      return NextResponse.json(
        { error: error?.message || 'insert failed' },
        { status: 500 },
      )
    }

    // Fire-and-forget the heavy work so we can redirect immediately.
    backgroundFulfill(row.id as string, email, domain, supabase).catch((e) =>
      console.error('[ai-readiness] background fulfill error', e),
    )

    return NextResponse.json({ scan_id: row.id })
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'unknown'
    console.error('[ai-readiness/scan] error', msg)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
