import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { getSession } from '@/lib/auth/session'
import { z } from 'zod'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const profileSchema = z.object({
  name: z.string().min(1).optional(),
  phone: z.string().optional(),
  job_title: z.string().optional(),
  bio: z.string().max(280).optional(),
  notifications: z.object({
    product_updates: z.boolean().optional(),
    marketing_emails: z.boolean().optional(),
    fuel_alerts: z.boolean().optional(),
  }).optional(),
})

export async function GET() {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: user, error } = await supabase
      .from('rocketopp_users')
      .select('name, phone, job_title, bio, settings')
      .eq('id', session.id)
      .single()

    if (error) {
      return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      profile: {
        ...user,
        notifications: user.settings?.notifications || {
          product_updates: true,
          marketing_emails: false,
          fuel_alerts: true,
        }
      }
    })
  } catch (error) {
    console.error('Profile fetch error:', error)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validated = profileSchema.parse(body)

    // Get current settings to merge notifications
    const { data: currentUser } = await supabase
      .from('rocketopp_users')
      .select('settings')
      .eq('id', session.id)
      .single()

    const updateData: Record<string, any> = {}

    if (validated.name !== undefined) updateData.name = validated.name
    if (validated.phone !== undefined) updateData.phone = validated.phone
    if (validated.job_title !== undefined) updateData.job_title = validated.job_title
    if (validated.bio !== undefined) updateData.bio = validated.bio

    if (validated.notifications) {
      updateData.settings = {
        ...(currentUser?.settings || {}),
        notifications: {
          ...(currentUser?.settings?.notifications || {}),
          ...validated.notifications,
        }
      }
    }

    const { error } = await supabase
      .from('rocketopp_users')
      .update(updateData)
      .eq('id', session.id)

    if (error) {
      console.error('Profile update error:', error)
      return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: 'Profile updated successfully' })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 })
    }
    console.error('Profile update error:', error)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}
