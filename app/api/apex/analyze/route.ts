/**
 * POST /api/apex/analyze — Groq vision analysis of a website screenshot.
 *
 * Body: { imageUrl: string }  OR  { imageBase64: string, mimeType: string }
 *
 * Returns a small structured result with `seo` + `mobile` blocks. Kept
 * deliberately small so downstream UI rendering stays predictable.
 *
 * Replaces the old Gemini vision call — same information shape, cheaper
 * model (Groq llama-3.2-90b-vision-preview), and runs server-side so the
 * API key never leaves the server.
 */

import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const maxDuration = 60

const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions'
const GROQ_VISION_MODEL = 'llama-3.2-90b-vision-preview'

const PROMPT = `Analyze this website screenshot for a small-business website assessment.

Return EXACTLY this JSON shape with no prose outside the JSON:
{
  "seo": { "title": "On-Page SEO Observations", "text": "<2-3 sentences on H1 presence, primary CTA, nav clarity, trust signals, content structure>" },
  "mobile": { "title": "Mobile Readiness", "text": "<2-3 sentences inferring mobile responsiveness from this desktop view>" }
}

Tone: direct, professional, like a senior conversion strategist. No hedging. One concrete observation per sentence.`

interface Body {
  imageUrl?: string
  imageBase64?: string
  mimeType?: string
}

export async function POST(req: NextRequest) {
  const apiKey = process.env.GROQ_API_KEY
  if (!apiKey) return NextResponse.json({ error: 'groq_not_configured' }, { status: 500 })

  const body = await req.json().catch(() => ({})) as Body
  if (!body.imageUrl && !body.imageBase64) {
    return NextResponse.json({ error: 'image_required' }, { status: 400 })
  }

  const imageSource = body.imageUrl
    ? { type: 'image_url' as const, image_url: { url: body.imageUrl } }
    : { type: 'image_url' as const, image_url: { url: `data:${body.mimeType || 'image/png'};base64,${body.imageBase64}` } }

  try {
    const res = await fetch(GROQ_URL, {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: GROQ_VISION_MODEL,
        temperature: 0.3,
        max_tokens: 600,
        messages: [{
          role: 'user',
          content: [
            { type: 'text', text: PROMPT },
            imageSource,
          ],
        }],
      }),
      signal: AbortSignal.timeout(30_000),
    })

    if (!res.ok) {
      const errText = await res.text().catch(() => '')
      return NextResponse.json({ error: 'groq_error', detail: errText.slice(0, 500) }, { status: 502 })
    }

    const data = await res.json() as { choices?: Array<{ message?: { content?: string } }> }
    const text = data.choices?.[0]?.message?.content?.trim() || ''

    // Carve out the JSON defensively — Groq sometimes appends stray chars.
    const start = text.indexOf('{')
    const end = text.lastIndexOf('}')
    if (start < 0 || end < 0) {
      return NextResponse.json({ seo: null, mobile: null, raw: text }, { status: 200 })
    }
    try {
      const parsed = JSON.parse(text.slice(start, end + 1))
      return NextResponse.json(parsed)
    } catch {
      return NextResponse.json({ seo: null, mobile: null, raw: text })
    }
  } catch (err) {
    return NextResponse.json({ error: 'server_error', detail: err instanceof Error ? err.message : 'unknown' }, { status: 500 })
  }
}
