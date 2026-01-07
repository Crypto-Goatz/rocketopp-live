import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { getSession } from '@/lib/auth/session'
import Anthropic from '@anthropic-ai/sdk'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const FUEL_COST_PER_MESSAGE = 1

export async function POST(request: Request) {
  try {
    const user = await getSession()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get current fuel
    const { data: userData } = await supabase
      .from('rocketopp_users')
      .select('fuel_credits')
      .eq('id', user.id)
      .single()

    const currentFuel = userData?.fuel_credits || 0

    if (currentFuel < FUEL_COST_PER_MESSAGE) {
      return NextResponse.json({
        error: 'Insufficient fuel credits. Please add more fuel to continue.',
        remainingFuel: currentFuel
      }, { status: 402 })
    }

    const body = await request.json()
    const { message, history = [] } = body

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 })
    }

    // Build conversation history for Claude
    const messages = history.map((msg: { role: string; content: string }) => ({
      role: msg.role as 'user' | 'assistant',
      content: msg.content
    }))

    messages.push({
      role: 'user' as const,
      content: message
    })

    // Call Claude API
    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY!
    })

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      system: `You are "Nova" - the AI co-pilot for RocketOpp. You're sharp, friendly, and genuinely invested in helping users succeed.

PERSONALITY:
- Direct and action-oriented - no fluff, get straight to solutions
- Encouraging and supportive - you genuinely want users to succeed
- Business-focused - you understand marketing, SEO, leads, and growth
- Confident but not arrogant - you know your stuff but stay humble
- Casual and conversational - talk like a friend who happens to be an expert

COMMUNICATION STYLE:
- Keep responses concise and actionable
- Use simple language, avoid jargon unless necessary
- When explaining something complex, break it down
- Celebrate wins with the user, no matter how small
- If something's not working, be honest but solution-focused
- Use contractions (you're, it's, let's) to sound natural
- Occasionally use phrases like "let's crush it", "you got this", "solid move"

KNOWLEDGE:
- RocketOpp dashboard features: Analytics, SEO, Projects, AI Tools, Skills
- Google integrations: Analytics, Search Console, Ads
- Marketing concepts: conversion, lead gen, SEO, content strategy
- Business growth strategies

RULES:
- Never be condescending or overly formal
- Don't use corporate speak or buzzwords
- If you don't know something specific about their account, say so and point them to the right place
- Always leave them feeling motivated and clear on next steps
- Keep it real - if an idea needs work, say so constructively`,
      messages
    })

    const assistantMessage = response.content[0].type === 'text'
      ? response.content[0].text
      : 'I apologize, I could not generate a response.'

    // Deduct fuel
    const newFuel = currentFuel - FUEL_COST_PER_MESSAGE
    await supabase
      .from('rocketopp_users')
      .update({ fuel_credits: newFuel })
      .eq('id', user.id)

    // Log the usage (optional - for analytics)
    await supabase.from('analytics_events').insert({
      visitor_id: user.id,
      session_id: user.id,
      event_name: 'ai_chat_message',
      event_category: 'ai',
      event_label: 'chat',
      page: '/dashboard',
    }).catch(() => {}) // Silently fail if table doesn't exist

    return NextResponse.json({
      response: assistantMessage,
      remainingFuel: newFuel,
      fuelUsed: FUEL_COST_PER_MESSAGE
    })

  } catch (error) {
    console.error('AI Chat error:', error)
    return NextResponse.json(
      { error: 'Failed to process message' },
      { status: 500 }
    )
  }
}
