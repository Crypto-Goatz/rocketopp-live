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
      .from('site_settings')
      .select('key, value, description, category')
      .order('category')

    return NextResponse.json(data || [])
  } catch (error) {
    console.error('Admin settings error:', error)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  }
}

export async function PUT(request: Request) {
  try {
    const admin = await requireAdmin()
    const body = await request.json()
    const { key, value, description, category } = body

    if (!key) {
      return NextResponse.json({ error: 'Setting key required' }, { status: 400 })
    }

    await supabase
      .from('site_settings')
      .upsert({
        key,
        value,
        description,
        category,
        updated_by: admin.id,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'key'
      })

    await logAdminAction(admin.id, 'update_setting', 'site_setting', undefined, { key, value })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Admin update setting error:', error)
    return NextResponse.json({ error: 'Failed to update setting' }, { status: 500 })
  }
}
