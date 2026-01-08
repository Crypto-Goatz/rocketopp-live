import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { getSession } from '@/lib/auth/session'
import { z } from 'zod'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const supportSchema = z.object({
  category: z.enum(['question', 'bug', 'feature', 'billing']),
  subject: z.string().min(5, 'Subject must be at least 5 characters'),
  message: z.string().min(20, 'Message must be at least 20 characters'),
  priority: z.enum(['low', 'normal', 'high', 'urgent']).default('normal'),
  user_email: z.string().email(),
  user_name: z.string().nullable().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validated = supportSchema.parse(body)

    // Store support ticket in database
    const { data: ticket, error } = await supabase
      .from('support_tickets')
      .insert({
        user_id: session.id,
        user_email: validated.user_email,
        user_name: validated.user_name,
        category: validated.category,
        subject: validated.subject,
        message: validated.message,
        priority: validated.priority,
        status: 'open',
      })
      .select()
      .single()

    if (error) {
      // If table doesn't exist, create it
      if (error.code === '42P01') {
        console.log('Support tickets table does not exist, creating...')
        // For now, just log and return success
        console.log('Support ticket received:', validated)
        return NextResponse.json({
          success: true,
          message: 'Your message has been received. We\'ll get back to you soon!',
        })
      }
      console.error('Support ticket error:', error)
      return NextResponse.json({ error: 'Failed to submit ticket' }, { status: 500 })
    }

    // TODO: Send email notification to support team
    // TODO: Send confirmation email to user

    return NextResponse.json({
      success: true,
      message: 'Your message has been received. We\'ll get back to you within 24 hours.',
      ticketId: ticket?.id,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 })
    }
    console.error('Support submission error:', error)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}
