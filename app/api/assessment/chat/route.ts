// ============================================================
// Assessment Chat API - Handles AI conversation
// ============================================================
// Uses Claude AI to conduct the APEX business assessment
// ============================================================

import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { SYSTEM_INSTRUCTION } from '@/lib/assessment/constants'

export async function POST(request: NextRequest) {
  console.log('[Assessment Chat] Processing chat request')

  try {
    // Check for API key
    if (!process.env.ANTHROPIC_API_KEY) {
      console.error('[Assessment Chat] ANTHROPIC_API_KEY not configured')
      return NextResponse.json(
        { error: 'AI service not configured' },
        { status: 500 }
      )
    }

    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    })

    const { messages, context } = await request.json()

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Messages array is required' },
        { status: 400 }
      )
    }

    // Build the system prompt with any additional context
    let systemPrompt = SYSTEM_INSTRUCTION
    if (context) {
      systemPrompt += `\n\n**User Context:**\n${JSON.stringify(context, null, 2)}`
    }

    // Convert messages to Anthropic format
    const anthropicMessages = messages.map((msg: { role: string; content: string }) => ({
      role: msg.role as 'user' | 'assistant',
      content: msg.content,
    }))

    console.log('[Assessment Chat] Sending to Claude, messages:', anthropicMessages.length)

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2048,
      system: systemPrompt,
      messages: anthropicMessages,
    })

    // Extract text from response
    const text = response.content
      .filter((block): block is Anthropic.TextBlock => block.type === 'text')
      .map((block) => block.text)
      .join('')

    console.log('[Assessment Chat] Response received, length:', text.length)

    return NextResponse.json({
      success: true,
      text,
      usage: response.usage,
    })
  } catch (error) {
    console.error('[Assessment Chat] Error:', error)

    // Check for specific Anthropic errors
    if (error instanceof Anthropic.APIError) {
      console.error('[Assessment Chat] Anthropic API error:', error.status, error.message)
      return NextResponse.json(
        { error: `AI service error: ${error.message}` },
        { status: error.status || 500 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to process chat request' },
      { status: 500 }
    )
  }
}
