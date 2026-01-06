import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { getSession } from '@/lib/auth/session'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(request: NextRequest) {
  const user = await getSession()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const searchParams = request.nextUrl.searchParams
  const status = searchParams.get('status') // new, contacted, qualified, converted
  const source = searchParams.get('source')
  const limit = parseInt(searchParams.get('limit') || '50')
  const offset = parseInt(searchParams.get('offset') || '0')

  try {
    let query = supabase
      .from('analytics_leads')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (status) {
      query = query.eq('status', status)
    }

    if (source) {
      query = query.eq('source', source)
    }

    const { data: leads, count, error } = await query

    if (error) throw error

    // Get lead sources for filter
    const { data: sources } = await supabase
      .from('analytics_leads')
      .select('source')

    const uniqueSources = [...new Set(sources?.map(s => s.source) || [])]

    // Get status counts
    const { data: statusCounts } = await supabase
      .from('analytics_leads')
      .select('status')

    const statusBreakdown = {
      new: statusCounts?.filter(s => s.status === 'new').length || 0,
      contacted: statusCounts?.filter(s => s.status === 'contacted').length || 0,
      qualified: statusCounts?.filter(s => s.status === 'qualified').length || 0,
      converted: statusCounts?.filter(s => s.status === 'converted').length || 0,
    }

    return NextResponse.json({
      leads: leads || [],
      total: count || 0,
      sources: uniqueSources,
      statusBreakdown,
    })
  } catch (error) {
    console.error('Leads fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch leads' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  const user = await getSession()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { id, status, notes, assigned_to } = await request.json()

    const updates: Record<string, unknown> = {}
    if (status) updates.status = status
    if (notes !== undefined) updates.notes = notes
    if (assigned_to !== undefined) updates.assigned_to = assigned_to

    const { error } = await supabase
      .from('analytics_leads')
      .update(updates)
      .eq('id', id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Lead update error:', error)
    return NextResponse.json({ error: 'Failed to update lead' }, { status: 500 })
  }
}
