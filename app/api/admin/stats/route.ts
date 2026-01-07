import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { requireAdmin } from '@/lib/auth/admin'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET() {
  try {
    await requireAdmin()

    // Get user counts
    const { count: totalUsers } = await supabase
      .from('rocketopp_users')
      .select('*', { count: 'exact', head: true })

    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
    const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()

    const { count: newUsersWeek } = await supabase
      .from('rocketopp_users')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', weekAgo)

    const { count: newUsersMonth } = await supabase
      .from('rocketopp_users')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', monthAgo)

    // Get leads count
    const { count: totalLeads } = await supabase
      .from('analytics_leads')
      .select('*', { count: 'exact', head: true })

    const { count: newLeadsWeek } = await supabase
      .from('analytics_leads')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', weekAgo)

    // Get active subscriptions
    const { count: activeSubscriptions } = await supabase
      .from('user_purchases')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active')

    // Get today's pageviews
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const todayISO = today.toISOString()

    const { count: pageviewsToday } = await supabase
      .from('analytics_pageviews')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', todayISO)

    const { data: visitorData } = await supabase
      .from('analytics_pageviews')
      .select('visitor_id')
      .gte('created_at', todayISO)

    const uniqueVisitors = new Set(visitorData?.map(v => v.visitor_id) || [])

    return NextResponse.json({
      total_users: totalUsers || 0,
      new_users_week: newUsersWeek || 0,
      new_users_month: newUsersMonth || 0,
      total_leads: totalLeads || 0,
      new_leads_week: newLeadsWeek || 0,
      active_subscriptions: activeSubscriptions || 0,
      pageviews_today: pageviewsToday || 0,
      visitors_today: uniqueVisitors.size,
    })
  } catch (error) {
    console.error('Admin stats error:', error)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  }
}
