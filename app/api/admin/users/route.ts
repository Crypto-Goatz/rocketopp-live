import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { requireAdmin, logAdminAction } from '@/lib/auth/admin'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(request: Request) {
  try {
    await requireAdmin()

    const url = new URL(request.url)
    const limit = parseInt(url.searchParams.get('limit') || '50')
    const offset = parseInt(url.searchParams.get('offset') || '0')

    const { data: users, count } = await supabase
      .from('rocketopp_users')
      .select('id, email, name, is_admin, role, fuel_credits, subscription_status, created_at', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    return NextResponse.json({
      users: users || [],
      total: count || 0
    })
  } catch (error) {
    console.error('Admin users error:', error)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  }
}

export async function PATCH(request: Request) {
  try {
    const admin = await requireAdmin()
    const body = await request.json()
    const { userId, role, is_admin, fuel_credits } = body

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 })
    }

    const updates: Record<string, any> = {}
    if (role !== undefined) updates.role = role
    if (is_admin !== undefined) updates.is_admin = is_admin
    if (fuel_credits !== undefined) updates.fuel_credits = fuel_credits

    await supabase
      .from('rocketopp_users')
      .update(updates)
      .eq('id', userId)

    await logAdminAction(admin.id, 'update_user', 'user', userId, updates)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Admin update user error:', error)
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 })
  }
}
