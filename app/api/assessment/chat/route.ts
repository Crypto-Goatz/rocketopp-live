// ============================================================
// Assessment Chat API — handles AI conversation
// ============================================================
// Uses canonical lib/ai-call SOP: CRM Agent → Groq → heuristic
// ============================================================

import { NextRequest, NextResponse } from 'next/server'
import { askAI } from '@/lib/ai-call'
import { SYSTEM_INSTRUCTION } from '@/lib/assessment/constants'

export async function POST(request: NextRequest) {
  console.log('[Assessment Chat] Processing chat request')

  try {
    const { messages, context } = await request.json()

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Messages array is required' },
        { status: 400 }
      )
    }

    // Build the system prompt + serialized history into a single prompt.
    // ai-call sends a single user message; we prepend the system instruction
    // and any context, then replay the conversation as labeled turns.
    let systemPrompt = SYSTEM_INSTRUCTION
    if (context) {
      systemPrompt += `\n\n**User Context:**\n${JSON.stringify(context, null, 2)}`
    }

    const transcript = messages
      .map((m: { role: string; content: string }) => `${m.role.toUpperCase()}: ${m.content}`)
      .join('\n\n')

    const prompt = `${systemPrompt}\n\n--- CONVERSATION ---\n${transcript}\n\nASSISTANT:`

    console.log('[Assessment Chat] Sending via ai-call SOP, turns:', messages.length)

    const { text, source, degraded } = await askAI(prompt, {
      maxTokens: 2048,
      temperature: 0.4,
    })

    if (!text) {
      return NextResponse.json(
        { error: 'AI service unavailable' },
        { status: 503 }
      )
    }

    console.log(`[Assessment Chat] Response received via ${source}, length:`, text.length, 'degraded:', degraded)

    return NextResponse.json({
      success: true,
      text,
      source,
      degraded,
    })
  } catch (error) {
    console.error('[Assessment Chat] Error:', error)
    return NextResponse.json(
      { error: 'Failed to process chat request' },
      { status: 500 }
    )
  }
}
