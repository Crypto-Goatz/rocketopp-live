/**
 * POST /api/apex/chat — APEX conversation turn via Groq.
 *
 * Body: { messages: [{ role: 'user' | 'assistant', content: string }, ...] }
 * Returns: { text: string }
 *
 * The system prompt asks for JSON-only output. The client parses the
 * returned text and branches on "ASSESSMENT_COMPLETE:" for the final.
 *
 * Streaming is intentionally off for v1 — the UI waits on a single JSON
 * object per turn anyway, so a non-stream call keeps the parser trivial.
 */

import { NextRequest, NextResponse } from 'next/server'
import { APEX_SYSTEM_PROMPT } from '@/lib/apex/prompt'

export const runtime = 'nodejs'
export const maxDuration = 60

const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions'
const GROQ_MODEL = 'llama-3.3-70b-versatile'

interface ChatMessage { role: 'user' | 'assistant'; content: string }

export async function POST(req: NextRequest) {
  const apiKey = process.env.GROQ_API_KEY
  if (!apiKey) return NextResponse.json({ error: 'groq_not_configured' }, { status: 500 })

  const body = await req.json().catch(() => ({})) as { messages?: ChatMessage[] }
  const messages = Array.isArray(body.messages) ? body.messages : []
  if (messages.length === 0) return NextResponse.json({ error: 'messages_required' }, { status: 400 })

  // Sanitize — server-side whitelist of roles; truncate excessive payloads.
  const clean = messages
    .filter(m => m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string')
    .map(m => ({ role: m.role, content: m.content.slice(0, 8000) }))
    .slice(-40) // Protect against runaway histories

  try {
    const res = await fetch(GROQ_URL, {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: GROQ_MODEL,
        temperature: 0.6,
        max_tokens: 1500,
        messages: [
          { role: 'system', content: APEX_SYSTEM_PROMPT },
          ...clean,
        ],
        // Groq supports response_format for JSON, but our prompt also emits a
        // non-JSON prefix ("ASSESSMENT_COMPLETE:"), so we leave it free-form
        // and parse client-side. The system prompt is strict enough.
      }),
      signal: AbortSignal.timeout(30_000),
    })

    if (!res.ok) {
      const errText = await res.text().catch(() => '')
      return NextResponse.json({ error: 'groq_error', detail: errText.slice(0, 500) }, { status: 502 })
    }

    const data = await res.json() as { choices?: Array<{ message?: { content?: string } }> }
    const text = data.choices?.[0]?.message?.content?.trim() || ''
    if (!text) return NextResponse.json({ error: 'empty_response' }, { status: 502 })

    return NextResponse.json({ text })
  } catch (err) {
    return NextResponse.json({ error: 'server_error', detail: err instanceof Error ? err.message : 'unknown' }, { status: 500 })
  }
}
