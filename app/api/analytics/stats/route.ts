import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { getSession } from '@/lib/auth/session'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(request: NextRequest) {
  // Auth check
  const user = await getSession()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const searchParams = request.nextUrl.searchParams
  const period = searchParams.get('period') || '7d' // 24h, 7d, 30d, 90d

  // Calculate date range
  const now = new Date()
  let startDate = new Date()

  switch (period) {
    case '24h':
      startDate.setHours(startDate.getHours() - 24)
      break
    case '7d':
      startDate.setDate(startDate.getDate() - 7)
      break
    case '30d':
      startDate.setDate(startDate.getDate() - 30)
      break
    case '90d':
      startDate.setDate(startDate.getDate() - 90)
      break
  }

  try {
    // Get pageviews
    const { data: pageviews, count: pageviewCount } = await supabase
      .from('analytics_pageviews')
      .select('*', { count: 'exact' })
      .gte('created_at', startDate.toISOString())

    // Get unique visitors
    const { data: visitors } = await supabase
      .from('analytics_pageviews')
      .select('visitor_id')
      .gte('created_at', startDate.toISOString())

    const uniqueVisitors = new Set(visitors?.map(v => v.visitor_id) || []).size

    // Get unique sessions
    const { data: sessions } = await supabase
      .from('analytics_pageviews')
      .select('session_id')
      .gte('created_at', startDate.toISOString())

    const uniqueSessions = new Set(sessions?.map(s => s.session_id) || []).size

    // Get leads
    const { count: leadsCount } = await supabase
      .from('analytics_leads')
      .select('*', { count: 'exact' })
      .gte('created_at', startDate.toISOString())

    // Get conversions
    const { data: conversions } = await supabase
      .from('analytics_events')
      .select('*')
      .eq('event_name', 'conversion')
      .gte('created_at', startDate.toISOString())

    const conversionCount = conversions?.length || 0
    const conversionValue = conversions?.reduce((sum, c) => sum + (c.event_value || 0), 0) || 0

    // Get top pages
    const pageCounts: Record<string, number> = {}
    pageviews?.forEach(pv => {
      pageCounts[pv.path] = (pageCounts[pv.path] || 0) + 1
    })

    const topPages = Object.entries(pageCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([page, views]) => ({ page, views }))

    // Get traffic sources
    const sourceCounts: Record<string, number> = {}
    pageviews?.forEach(pv => {
      const source = pv.utm_source || 'direct'
      sourceCounts[source] = (sourceCounts[source] || 0) + 1
    })

    const trafficSources = Object.entries(sourceCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([source, sessions]) => ({ source, sessions }))

    // Get device breakdown
    const deviceCounts: Record<string, number> = { desktop: 0, mobile: 0, tablet: 0 }
    pageviews?.forEach(pv => {
      const device = pv.device_type || 'desktop'
      deviceCounts[device] = (deviceCounts[device] || 0) + 1
    })

    const totalDevices = Object.values(deviceCounts).reduce((a, b) => a + b, 0)
    const devices = {
      desktop: Math.round((deviceCounts.desktop / totalDevices) * 100) || 0,
      mobile: Math.round((deviceCounts.mobile / totalDevices) * 100) || 0,
      tablet: Math.round((deviceCounts.tablet / totalDevices) * 100) || 0,
    }

    // Get browser breakdown
    const browserCounts: Record<string, number> = {}
    pageviews?.forEach(pv => {
      const browser = pv.browser || 'unknown'
      browserCounts[browser] = (browserCounts[browser] || 0) + 1
    })

    const browsers = Object.entries(browserCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([browser, count]) => ({ browser, count }))

    // Get country breakdown
    const countryCounts: Record<string, number> = {}
    pageviews?.forEach(pv => {
      const country = pv.country || 'Unknown'
      countryCounts[country] = (countryCounts[country] || 0) + 1
    })

    const countries = Object.entries(countryCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([country, visitors]) => ({ country, visitors }))

    // Get daily trend data
    const dailyData: Record<string, { pageviews: number; visitors: Set<string> }> = {}
    pageviews?.forEach(pv => {
      const date = new Date(pv.created_at).toISOString().split('T')[0]
      if (!dailyData[date]) {
        dailyData[date] = { pageviews: 0, visitors: new Set() }
      }
      dailyData[date].pageviews++
      dailyData[date].visitors.add(pv.visitor_id)
    })

    const trend = Object.entries(dailyData)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, data]) => ({
        date,
        pageviews: data.pageviews,
        visitors: data.visitors.size,
      }))

    // Get recent events
    const { data: recentEvents } = await supabase
      .from('analytics_events')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(20)

    // Calculate bounce rate (single page sessions)
    const sessionPageCounts: Record<string, number> = {}
    pageviews?.forEach(pv => {
      sessionPageCounts[pv.session_id] = (sessionPageCounts[pv.session_id] || 0) + 1
    })

    const totalSessions = Object.keys(sessionPageCounts).length
    const bouncedSessions = Object.values(sessionPageCounts).filter(count => count === 1).length
    const bounceRate = totalSessions > 0 ? Math.round((bouncedSessions / totalSessions) * 100) : 0

    // Average pages per session
    const avgPagesPerSession = totalSessions > 0
      ? (Object.values(sessionPageCounts).reduce((a, b) => a + b, 0) / totalSessions).toFixed(1)
      : '0'

    return NextResponse.json({
      period,
      summary: {
        pageviews: pageviewCount || 0,
        uniqueVisitors,
        sessions: uniqueSessions,
        leads: leadsCount || 0,
        conversions: conversionCount,
        conversionValue,
        bounceRate,
        avgPagesPerSession,
      },
      topPages,
      trafficSources,
      devices,
      browsers,
      countries,
      trend,
      recentEvents: recentEvents || [],
    })
  } catch (error) {
    console.error('Analytics stats error:', error)
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 })
  }
}
