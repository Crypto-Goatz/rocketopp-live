import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { getSession } from '@/lib/auth/session'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET() {
  const user = await getSession()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    // Get visitors active in last 5 minutes
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString()

    const { data: recentPageviews } = await supabase
      .from('analytics_pageviews')
      .select('visitor_id, session_id, path, device_type, country, city, created_at')
      .gte('created_at', fiveMinutesAgo)
      .order('created_at', { ascending: false })

    // Get unique active visitors
    const activeVisitors = new Map<string, {
      visitor_id: string
      session_id: string
      current_page: string
      device: string
      location: string
      last_seen: string
    }>()

    recentPageviews?.forEach(pv => {
      if (!activeVisitors.has(pv.visitor_id)) {
        activeVisitors.set(pv.visitor_id, {
          visitor_id: pv.visitor_id,
          session_id: pv.session_id,
          current_page: pv.path,
          device: pv.device_type || 'desktop',
          location: pv.city && pv.country ? `${pv.city}, ${pv.country}` : pv.country || 'Unknown',
          last_seen: pv.created_at,
        })
      }
    })

    // Get active pages
    const activePagesCount: Record<string, number> = {}
    recentPageviews?.forEach(pv => {
      activePagesCount[pv.path] = (activePagesCount[pv.path] || 0) + 1
    })

    const activePages = Object.entries(activePagesCount)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([page, count]) => ({ page, count }))

    // Get last 30 minutes of pageviews for the chart
    const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000).toISOString()

    const { data: last30Min } = await supabase
      .from('analytics_pageviews')
      .select('created_at')
      .gte('created_at', thirtyMinutesAgo)

    // Group by minute
    const minuteData: Record<string, number> = {}
    for (let i = 29; i >= 0; i--) {
      const minute = new Date(Date.now() - i * 60 * 1000)
      const key = minute.toISOString().slice(0, 16) // YYYY-MM-DDTHH:MM
      minuteData[key] = 0
    }

    last30Min?.forEach(pv => {
      const key = new Date(pv.created_at).toISOString().slice(0, 16)
      if (minuteData[key] !== undefined) {
        minuteData[key]++
      }
    })

    const realtimeChart = Object.entries(minuteData).map(([time, count]) => ({
      time: new Date(time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      pageviews: count,
    }))

    // Get recent events
    const { data: recentEvents } = await supabase
      .from('analytics_events')
      .select('event_name, event_label, page, created_at')
      .gte('created_at', fiveMinutesAgo)
      .order('created_at', { ascending: false })
      .limit(10)

    return NextResponse.json({
      activeVisitorCount: activeVisitors.size,
      activeVisitors: Array.from(activeVisitors.values()),
      activePages,
      realtimeChart,
      recentEvents: recentEvents || [],
    })
  } catch (error) {
    console.error('Realtime analytics error:', error)
    return NextResponse.json({ error: 'Failed to fetch realtime data' }, { status: 500 })
  }
}
