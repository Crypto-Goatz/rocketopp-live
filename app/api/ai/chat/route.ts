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
      system: `You are a helpful AI assistant for RocketOpp, a premium client portal platform.
You help clients with questions about their business, analytics, leads, and account management.
Be concise, professional, and helpful. If you don't know something specific about their account,
suggest they check the relevant dashboard section or contact their account manager.
Keep responses focused and actionable.`,
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
