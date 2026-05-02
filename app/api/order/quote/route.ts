/**
 * POST /api/order/quote
 * Body: { selected, contact }
 *
 * Generates an AI-written kickoff brief from the user's selections + answers.
 * Uses Groq (per the GROQ ONLY rule) — never Anthropic/OpenAI in prod.
 */

import { NextRequest, NextResponse } from 'next/server'
import {
  SERVICES,
  formatUsd,
} from '@/lib/order/services-catalog'
import { calculateQuote } from '@/lib/order/order-store'
import type { SelectedService, OrderContact } from '@/lib/order/order-store'

export const runtime = 'nodejs'

const GROQ_MODEL = 'llama-3.3-70b-versatile'

interface Body {
  selected: SelectedService[]
  contact: OrderContact
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as Body
    const apiKey = process.env.GROQ_API_KEY
    if (!apiKey) {
      return NextResponse.json(
        { error: 'GROQ_API_KEY not configured' },
        { status: 500 },
      )
    }

    const quote = calculateQuote(body.selected || [])
    if (quote.lines.length === 0) {
      return NextResponse.json(
        { error: 'Cart is empty' },
        { status: 400 },
      )
    }

    const lineSummary = quote.lines
      .map((l) => {
        const parts = [`• ${l.service.name}`]
        if (l.scope) parts.push(`  scope: ${l.scope.label}`)
        if (l.oneTimeCents > 0)
          parts.push(`  build cost: ${formatUsd(l.oneTimeCents)}`)
        if (l.recurringCents > 0)
          parts.push(`  recurring: ${formatUsd(l.recurringCents)}/mo`)
        return parts.join('\n')
      })
      .join('\n')

    const userPrompt = `Generate a concise kickoff brief for a new customer at RocketOpp.

Customer:
  Name: ${body.contact.name || '(not provided)'}
  Company: ${body.contact.company || '(not provided)'}
  Industry: ${body.contact.industry || '(not provided)'}
  Timeline: ${body.contact.timeline || 'flexible'}
  Notes: ${body.contact.notes || '(none)'}

Selected services:
${lineSummary}

Totals:
  One-time build: ${formatUsd(quote.oneTimeTotal)}
  Monthly retainer: ${formatUsd(quote.recurringTotal)}/mo

Write 4-6 short sections, ~200-280 words total:

1. **Outcome (BLUF)** — one sentence on what they'll have when we're done.
2. **Sequencing** — order the work in 2-4 build phases (which goes first, why).
3. **Quick wins (week 1)** — concrete things they'll see in 7 days.
4. **Risks / tradeoffs** — what they should know honestly.
5. **What we need from you** — assets, accounts, decisions.

Tone: direct, confident, no fluff. Skip preamble. Use markdown bold for section headers.`

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
              'You are Mike Mento, founder of RocketOpp. Write short, direct kickoff briefs — no buzzwords, no marketing fluff. You ship fast and tell customers the truth. Always use the BLUF (Bottom Line Up Front) pattern.',
          },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.6,
        max_tokens: 700,
      }),
    })

    if (!res.ok) {
      const errText = await res.text()
      return NextResponse.json(
        { error: `Groq ${res.status}: ${errText.slice(0, 300)}` },
        { status: 500 },
      )
    }

    const data = await res.json()
    const summary: string =
      data.choices?.[0]?.message?.content?.trim() ||
      'Unable to generate brief — please try again.'

    return NextResponse.json({ summary })
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'unknown'
    console.error('[order/quote] error:', msg)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
