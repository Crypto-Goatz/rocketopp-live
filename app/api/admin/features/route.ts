import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { requireAdmin, logAdminAction } from '@/lib/auth/admin'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET() {
  try {
    await requireAdmin()

    const { data } = await supabase
      .from('feature_flags')
      .select('name, enabled, description, rollout_percentage')
      .order('name')

    return NextResponse.json(data || [])
  } catch (error) {
    console.error('Admin features error:', error)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  }
}

export async function PATCH(request: Request) {
  try {
    const admin = await requireAdmin()
    const body = await request.json()
    const { name, enabled, rollout_percentage } = body

    if (!name) {
      return NextResponse.json({ error: 'Feature name required' }, { status: 400 })
    }

    const updates: Record<string, any> = {
      updated_at: new Date().toISOString()
    }
    if (enabled !== undefined) updates.enabled = enabled
    if (rollout_percentage !== undefined) updates.rollout_percentage = rollout_percentage

    await supabase
      .from('feature_flags')
      .update(updates)
      .eq('name', name)

    await logAdminAction(admin.id, 'toggle_feature', 'feature_flag', undefined, { name, ...updates })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Admin toggle feature error:', error)
    return NextResponse.json({ error: 'Failed to update feature' }, { status: 500 })
  }
}
