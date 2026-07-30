import { NextRequest, NextResponse } from 'next/server'

import { supabaseAdmin } from '@/lib/db/supabase'

/**
 * POST /api/assessment/progress
 *
 * Saves a PARTIAL assessment as the visitor works through it.
 *
 * WHY THIS EXISTS: the assessment asks for name, company, ZIP, industry and website,
 * then runs a full AI conversation — and only asks for an email at the very END.
 * Before this route, abandoning at any point threw all of it away, leaving no record
 * that the person had ever been on the page.
 *
 * A CRM contact still cannot be created without an email or phone (the API needs an
 * identifier), so partials land in Supabase `contact_submissions` instead, and the
 * final /api/assessment/submit is what promotes a finished one into the CRM. Nothing
 * collected is discarded either way.
 *
 * One row per session, updated in place — keyed by a client-generated sessionId in
 * `raw`, so a 12-question assessment leaves one row, not twelve.
 *
 * Deliberately NOT BotID-protected: it fires repeatedly mid-session on a page a human
 * is already interacting with, it creates no contact and sends no email, and a failed
 * check here would silently break progress saving. The submit endpoint at the end is
 * the guarded one.
 */
export const runtime = 'nodejs'

const FORM_NAME = 'Rocket AI Assessment (in progress)'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}))
    const sessionId = String(body.sessionId || '').trim()
    if (!sessionId || sessionId.length > 100) {
      return NextResponse.json({ error: 'sessionId required' }, { status: 400 })
    }

    const p = (body.personalization || {}) as Record<string, string>
    const answers = Array.isArray(body.collectedData) ? body.collectedData : []

    const row = {
      form_name: FORM_NAME,
      name: String(p.name || '').slice(0, 200) || null,
      company: String(p.company || '').slice(0, 200) || null,
      email: String(body.email || '').slice(0, 200) || null,
      phone: String(body.phone || '').slice(0, 60) || null,
      page_url: 'https://rocketopp.com/assessment',
      source: 'rocketopp-ai-assessment',
      // Truncated so one runaway session cannot bloat the table.
      message: answers
        .map((d: { question?: string; answer?: string }) => `Q: ${d.question}\nA: ${d.answer}`)
        .join('\n\n')
        .slice(0, 8000),
      raw: {
        sessionId,
        stage: String(body.stage || 'unknown').slice(0, 60),
        personalization: p,
        answerCount: answers.length,
        completed: body.completed === true,
        updatedAt: new Date().toISOString(),
      },
      user_agent: (request.headers.get('user-agent') || '').slice(0, 500),
    }

    // Find this session's existing row, then update it rather than adding another.
    const { data: existing } = await supabaseAdmin
      .from('contact_submissions')
      .select('id')
      .eq('form_name', FORM_NAME)
      .eq('raw->>sessionId', sessionId)
      .limit(1)
      .maybeSingle()

    if (existing?.id) {
      const { error } = await supabaseAdmin
        .from('contact_submissions')
        .update(row)
        .eq('id', existing.id)
      if (error) {
        console.error('[assessment/progress] update failed:', error.message)
        return NextResponse.json({ error: 'save failed' }, { status: 500 })
      }
      return NextResponse.json({ ok: true, id: existing.id, mode: 'updated' })
    }

    const { data, error } = await supabaseAdmin
      .from('contact_submissions')
      .insert(row)
      .select('id')
      .maybeSingle()
    if (error) {
      console.error('[assessment/progress] insert failed:', error.message)
      return NextResponse.json({ error: 'save failed' }, { status: 500 })
    }
    return NextResponse.json({ ok: true, id: data?.id, mode: 'created' })
  } catch (err) {
    console.error('[assessment/progress] threw:', err)
    return NextResponse.json({ error: 'save failed' }, { status: 500 })
  }
}
