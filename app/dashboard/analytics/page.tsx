'use client'

import { useState, useEffect } from 'react'
import {
  BarChart3, Users, Eye, MousePointer, TrendingUp, TrendingDown,
  Globe, Monitor, Smartphone, Tablet, Clock, Target, ArrowUpRight,
  RefreshCw, Calendar, Zap, UserPlus, DollarSign, Activity,
  Search, FileText, Download, ExternalLink
} from 'lucide-react'
import { Button } from '@/components/ui/button'

interface AnalyticsData {
  period: string
  summary: {
    pageviews: number
    uniqueVisitors: number
    sessions: number
    leads: number
    conversions: number
    conversionValue: number
    bounceRate: number
    avgPagesPerSession: string
  }
  topPages: { page: string; views: number }[]
  trafficSources: { source: string; sessions: number }[]
  devices: { desktop: number; mobile: number; tablet: number }
  browsers: { browser: string; count: number }[]
  countries: { country: string; visitors: number }[]
  trend: { date: string; pageviews: number; visitors: number }[]
  recentEvents: { event_name: string; event_label: string; created_at: string }[]
}

interface RealtimeData {
  activeVisitorCount: number
  activeVisitors: {
    visitor_id: string
    current_page: string
    device: string
    location: string
    last_seen: string
  }[]
  activePages: { page: string; count: number }[]
  realtimeChart: { time: string; pageviews: number }[]
}

interface GA4Data {
  overview: {
    sessions: number
    users: number
    pageviews: number
    bounceRate: number
    avgSessionDuration: number
    newUsers: number
  }
  trafficSources: { source: string; sessions: number; percentage: number }[]
  topPages: { path: string; title: string; pageviews: number; avgTime: number; bounceRate: number }[]
  devices: { device: string; sessions: number; percentage: number }[]
  countries: { country: string; sessions: number; percentage: number }[]
}

interface SearchConsoleData {
  overview: {
    totalClicks: number
    totalImpressions: number
    averageCtr: number
    averagePosition: number
  }
  queries: { query: string; clicks: number; impressions: number; ctr: number; position: number }[]
  pages: { page: string; clicks: number; impressions: number; ctr: number; position: number }[]
}

interface SerpResult {
  keyword: string
  position: number | null
  url: string | null
  topCompetitors: { position: number; title: string; domain: string }[]
}

export default function AnalyticsDashboard() {
  const [period, setPeriod] = useState<'24h' | '7d' | '30d' | '90d'>('7d')
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [realtime, setRealtime] = useState<RealtimeData | null>(null)
  const [ga4Data, setGa4Data] = useState<GA4Data | null>(null)
  const [searchConsole, setSearchConsole] = useState<SearchConsoleData | null>(null)
  const [loading, setLoading] = useState(true)
  const [realtimeLoading, setRealtimeLoading] = useState(true)
  const [reportLoading, setReportLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<'overview' | 'search' | 'serp'>('overview')

  // Map period to API range format
  const getRangeParam = () => {
    if (period === '24h') return '7d' // Minimum 7d for GA4
    return period
  }

  // Fetch analytics data
  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      try {
        // Fetch legacy stats
        const statsRes = await fetch(`/api/analytics/stats?period=${period}`)
        if (statsRes.ok) {
          const statsJson = await statsRes.json()
          setData(statsJson)
        }

        // Fetch GA4 data
        const ga4Res = await fetch(`/api/analytics/ga4?range=${getRangeParam()}`)
        if (ga4Res.ok) {
          const ga4Json = await ga4Res.json()
          if (ga4Json.success) setGa4Data(ga4Json.data)
        }

        // Fetch Search Console data
        const scRes = await fetch(`/api/analytics/search-console?range=${getRangeParam()}`)
        if (scRes.ok) {
          const scJson = await scRes.json()
          if (scJson.success) setSearchConsole(scJson.data)
        }
      } catch (error) {
        console.error('Failed to fetch analytics:', error)
      }
      setLoading(false)
    }
    fetchData()
  }, [period])

  // Fetch realtime data
  useEffect(() => {
    async function fetchRealtime() {
      try {
        const res = await fetch('/api/analytics/realtime')
        if (res.ok) {
          const json = await res.json()
          setRealtime(json)
        }
      } catch (error) {
        console.error('Failed to fetch realtime:', error)
      }
      setRealtimeLoading(false)
    }

    fetchRealtime()
    const interval = setInterval(fetchRealtime, 30000) // Refresh every 30s
    return () => clearInterval(interval)
  }, [])

  // Generate and download report
  const handleGenerateReport = async () => {
    setReportLoading(true)
    try {
      const res = await fetch('/api/analytics/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ range: getRangeParam(), format: 'markdown' }),
      })
      const json = await res.json()
      if (json.success && json.markdown) {
        // Download as markdown file
        const blob = new Blob([json.markdown], { type: 'text/markdown' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `analytics-report-${new Date().toISOString().split('T')[0]}.md`
        a.click()
        URL.revokeObjectURL(url)
      }
    } catch (error) {
      console.error('Failed to generate report:', error)
    }
    setReportLoading(false)
  }

  const periods = [
    { value: '24h', label: '24 Hours' },
    { value: '7d', label: '7 Days' },
    { value: '30d', label: '30 Days' },
    { value: '90d', label: '90 Days' },
  ]

  return (
    <div className="p-6 md:p-8 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
            Analytics Dashboard
          </h1>
          <p className="text-white/50">
            Track your website performance and visitor behavior
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex bg-zinc-900/50 rounded-lg p-1">
            {periods.map((p) => (
              <button
                key={p.value}
                onClick={() => setPeriod(p.value as typeof period)}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
                  period === p.value
                    ? 'bg-primary text-white'
                    : 'text-white/50 hover:text-white'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleGenerateReport}
            disabled={reportLoading}
          >
            {reportLoading ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Download className="w-4 h-4" />
            )}
            <span className="ml-2 hidden sm:inline">Report</span>
          </Button>
          <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex bg-zinc-900/50 rounded-lg p-1 mb-6 w-fit">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 text-sm font-medium rounded-md transition-all flex items-center gap-2 ${
            activeTab === 'overview'
              ? 'bg-primary text-white'
              : 'text-white/50 hover:text-white'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          Overview
        </button>
        <button
          onClick={() => setActiveTab('search')}
          className={`px-4 py-2 text-sm font-medium rounded-md transition-all flex items-center gap-2 ${
            activeTab === 'search'
              ? 'bg-primary text-white'
              : 'text-white/50 hover:text-white'
          }`}
        >
          <Search className="w-4 h-4" />
          Search Console
        </button>
        <button
          onClick={() => setActiveTab('serp')}
          className={`px-4 py-2 text-sm font-medium rounded-md transition-all flex items-center gap-2 ${
            activeTab === 'serp'
              ? 'bg-primary text-white'
              : 'text-white/50 hover:text-white'
          }`}
        >
          <Target className="w-4 h-4" />
          Rankings
        </button>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
      <>
      {/* Real-time Banner */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
              <div className="absolute inset-0 w-3 h-3 bg-green-500 rounded-full animate-ping" />
            </div>
            <div>
              <p className="text-sm font-medium text-white">
                <span className="text-2xl font-bold text-green-400 mr-2">
                  {realtimeLoading ? '—' : realtime?.activeVisitorCount || 0}
                </span>
                active visitors right now
              </p>
            </div>
          </div>
          <Activity className="w-5 h-5 text-green-400" />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard
          icon={Eye}
          label="Pageviews"
          value={data?.summary.pageviews || 0}
          loading={loading}
          color="blue"
        />
        <StatCard
          icon={Users}
          label="Unique Visitors"
          value={data?.summary.uniqueVisitors || 0}
          loading={loading}
          color="purple"
        />
        <StatCard
          icon={UserPlus}
          label="Leads"
          value={data?.summary.leads || 0}
          loading={loading}
          color="green"
        />
        <StatCard
          icon={Target}
          label="Conversions"
          value={data?.summary.conversions || 0}
          subValue={data?.summary.conversionValue ? `$${data.summary.conversionValue}` : undefined}
          loading={loading}
          color="orange"
        />
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard
          icon={MousePointer}
          label="Sessions"
          value={data?.summary.sessions || 0}
          loading={loading}
          color="cyan"
          small
        />
        <StatCard
          icon={TrendingDown}
          label="Bounce Rate"
          value={`${data?.summary.bounceRate || 0}%`}
          loading={loading}
          color="red"
          small
        />
        <StatCard
          icon={BarChart3}
          label="Pages/Session"
          value={data?.summary.avgPagesPerSession || '0'}
          loading={loading}
          color="yellow"
          small
        />
        <StatCard
          icon={DollarSign}
          label="Conv. Value"
          value={`$${data?.summary.conversionValue || 0}`}
          loading={loading}
          color="emerald"
          small
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        {/* Top Pages */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-zinc-900/50 border border-white/5">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Eye className="w-5 h-5 text-blue-400" />
            Top Pages
          </h2>
          <div className="space-y-3">
            {loading ? (
              Array(5).fill(0).map((_, i) => (
                <div key={i} className="h-10 bg-white/5 rounded animate-pulse" />
              ))
            ) : data?.topPages.length ? (
              data.topPages.map((page, i) => (
                <div key={page.page} className="flex items-center gap-3">
                  <span className="text-xs text-white/30 w-5">{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm text-white truncate">{page.page}</p>
                      <span className="text-sm text-white/50">{page.views}</span>
                    </div>
                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"
                        style={{
                          width: `${(page.views / (data.topPages[0]?.views || 1)) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-white/40 text-center py-8">No data yet</p>
            )}
          </div>
        </div>

        {/* Traffic Sources */}
        <div className="p-6 rounded-2xl bg-zinc-900/50 border border-white/5">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Globe className="w-5 h-5 text-purple-400" />
            Traffic Sources
          </h2>
          <div className="space-y-3">
            {loading ? (
              Array(5).fill(0).map((_, i) => (
                <div key={i} className="h-8 bg-white/5 rounded animate-pulse" />
              ))
            ) : data?.trafficSources.length ? (
              data.trafficSources.map((source) => (
                <div key={source.source} className="flex items-center justify-between">
                  <span className="text-sm text-white capitalize">{source.source}</span>
                  <span className="text-sm text-white/50">{source.sessions}</span>
                </div>
              ))
            ) : (
              <p className="text-sm text-white/40 text-center py-8">No data yet</p>
            )}
          </div>
        </div>
      </div>

      {/* Devices & Geo */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* Devices */}
        <div className="p-6 rounded-2xl bg-zinc-900/50 border border-white/5">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Monitor className="w-5 h-5 text-cyan-400" />
            Devices
          </h2>
          <div className="space-y-4">
            <DeviceBar icon={Monitor} label="Desktop" value={data?.devices.desktop || 0} loading={loading} />
            <DeviceBar icon={Smartphone} label="Mobile" value={data?.devices.mobile || 0} loading={loading} />
            <DeviceBar icon={Tablet} label="Tablet" value={data?.devices.tablet || 0} loading={loading} />
          </div>
        </div>

        {/* Browsers */}
        <div className="p-6 rounded-2xl bg-zinc-900/50 border border-white/5">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Globe className="w-5 h-5 text-orange-400" />
            Browsers
          </h2>
          <div className="space-y-3">
            {loading ? (
              Array(4).fill(0).map((_, i) => (
                <div key={i} className="h-6 bg-white/5 rounded animate-pulse" />
              ))
            ) : data?.browsers.length ? (
              data.browsers.map((b) => (
                <div key={b.browser} className="flex items-center justify-between">
                  <span className="text-sm text-white">{b.browser}</span>
                  <span className="text-sm text-white/50">{b.count}</span>
                </div>
              ))
            ) : (
              <p className="text-sm text-white/40 text-center py-4">No data</p>
            )}
          </div>
        </div>

        {/* Countries */}
        <div className="p-6 rounded-2xl bg-zinc-900/50 border border-white/5">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Globe className="w-5 h-5 text-green-400" />
            Top Countries
          </h2>
          <div className="space-y-3">
            {loading ? (
              Array(5).fill(0).map((_, i) => (
                <div key={i} className="h-6 bg-white/5 rounded animate-pulse" />
              ))
            ) : data?.countries.length ? (
              data.countries.slice(0, 5).map((c) => (
                <div key={c.country} className="flex items-center justify-between">
                  <span className="text-sm text-white">{c.country}</span>
                  <span className="text-sm text-white/50">{c.visitors}</span>
                </div>
              ))
            ) : (
              <p className="text-sm text-white/40 text-center py-4">No data</p>
            )}
          </div>
        </div>
      </div>

      {/* Active Visitors */}
      {realtime && realtime.activeVisitorCount > 0 && (
        <div className="p-6 rounded-2xl bg-zinc-900/50 border border-white/5 mb-8">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5 text-green-400" />
            Active Visitors Right Now
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs text-white/40 uppercase">
                  <th className="pb-3 font-medium">Page</th>
                  <th className="pb-3 font-medium">Device</th>
                  <th className="pb-3 font-medium">Location</th>
                  <th className="pb-3 font-medium">Last Seen</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {realtime.activeVisitors.slice(0, 10).map((v) => (
                  <tr key={v.visitor_id}>
                    <td className="py-3 text-sm text-white">{v.current_page}</td>
                    <td className="py-3 text-sm text-white/60 capitalize">{v.device}</td>
                    <td className="py-3 text-sm text-white/60">{v.location}</td>
                    <td className="py-3 text-sm text-white/40">
                      {new Date(v.last_seen).toLocaleTimeString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Recent Events */}
      <div className="p-6 rounded-2xl bg-zinc-900/50 border border-white/5">
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5 text-yellow-400" />
          Recent Events
        </h2>
        <div className="space-y-2">
          {loading ? (
            Array(5).fill(0).map((_, i) => (
              <div key={i} className="h-10 bg-white/5 rounded animate-pulse" />
            ))
          ) : data?.recentEvents.length ? (
            data.recentEvents.slice(0, 10).map((event, i) => (
              <div key={i} className="flex items-center justify-between p-2 rounded-lg hover:bg-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <span className="text-sm text-white">{event.event_name}</span>
                  {event.event_label && (
                    <span className="text-xs text-white/40">• {event.event_label}</span>
                  )}
                </div>
                <span className="text-xs text-white/30">
                  {new Date(event.created_at).toLocaleString()}
                </span>
              </div>
            ))
          ) : (
            <p className="text-sm text-white/40 text-center py-8">No events yet</p>
          )}
        </div>
      </div>
      </>
      )}

      {/* Search Console Tab */}
      {activeTab === 'search' && (
        <>
          {/* Search Overview Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <StatCard
              icon={MousePointer}
              label="Total Clicks"
              value={searchConsole?.overview.totalClicks || 0}
              loading={loading}
              color="blue"
            />
            <StatCard
              icon={Eye}
              label="Impressions"
              value={searchConsole?.overview.totalImpressions || 0}
              loading={loading}
              color="purple"
            />
            <StatCard
              icon={Target}
              label="Avg CTR"
              value={`${(searchConsole?.overview.averageCtr || 0).toFixed(1)}%`}
              loading={loading}
              color="green"
            />
            <StatCard
              icon={TrendingUp}
              label="Avg Position"
              value={(searchConsole?.overview.averagePosition || 0).toFixed(1)}
              loading={loading}
              color="orange"
            />
          </div>

          {/* Top Queries */}
          <div className="p-6 rounded-2xl bg-zinc-900/50 border border-white/5 mb-8">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Search className="w-5 h-5 text-blue-400" />
              Top Search Queries
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-xs text-white/40 uppercase">
                    <th className="pb-3 font-medium">Query</th>
                    <th className="pb-3 font-medium text-right">Clicks</th>
                    <th className="pb-3 font-medium text-right">Impressions</th>
                    <th className="pb-3 font-medium text-right">CTR</th>
                    <th className="pb-3 font-medium text-right">Position</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {loading ? (
                    Array(5).fill(0).map((_, i) => (
                      <tr key={i}>
                        <td colSpan={5} className="py-3">
                          <div className="h-6 bg-white/5 rounded animate-pulse" />
                        </td>
                      </tr>
                    ))
                  ) : searchConsole?.queries.length ? (
                    searchConsole.queries.map((q, i) => (
                      <tr key={i}>
                        <td className="py-3 text-sm text-white">{q.query}</td>
                        <td className="py-3 text-sm text-white/60 text-right">{q.clicks.toLocaleString()}</td>
                        <td className="py-3 text-sm text-white/60 text-right">{q.impressions.toLocaleString()}</td>
                        <td className="py-3 text-sm text-white/60 text-right">{q.ctr.toFixed(1)}%</td>
                        <td className="py-3 text-sm text-white/60 text-right">{q.position.toFixed(1)}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="py-8 text-sm text-white/40 text-center">No data yet</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Top Pages by Search */}
          <div className="p-6 rounded-2xl bg-zinc-900/50 border border-white/5">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-purple-400" />
              Top Pages in Search
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-xs text-white/40 uppercase">
                    <th className="pb-3 font-medium">Page</th>
                    <th className="pb-3 font-medium text-right">Clicks</th>
                    <th className="pb-3 font-medium text-right">Impressions</th>
                    <th className="pb-3 font-medium text-right">CTR</th>
                    <th className="pb-3 font-medium text-right">Position</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {loading ? (
                    Array(5).fill(0).map((_, i) => (
                      <tr key={i}>
                        <td colSpan={5} className="py-3">
                          <div className="h-6 bg-white/5 rounded animate-pulse" />
                        </td>
                      </tr>
                    ))
                  ) : searchConsole?.pages.length ? (
                    searchConsole.pages.map((p, i) => (
                      <tr key={i}>
                        <td className="py-3 text-sm text-white truncate max-w-xs">
                          <a href={p.page} target="_blank" rel="noopener noreferrer" className="hover:text-primary flex items-center gap-1">
                            {p.page.replace('https://rocketopp.com', '')}
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </td>
                        <td className="py-3 text-sm text-white/60 text-right">{p.clicks.toLocaleString()}</td>
                        <td className="py-3 text-sm text-white/60 text-right">{p.impressions.toLocaleString()}</td>
                        <td className="py-3 text-sm text-white/60 text-right">{p.ctr.toFixed(1)}%</td>
                        <td className="py-3 text-sm text-white/60 text-right">{p.position.toFixed(1)}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="py-8 text-sm text-white/40 text-center">No data yet</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* SERP Rankings Tab */}
      {activeTab === 'serp' && (
        <div className="space-y-6">
          {/* Info Banner */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20">
            <div className="flex items-start gap-3">
              <Target className="w-5 h-5 text-blue-400 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-white mb-1">SERP Ranking Checker</p>
                <p className="text-xs text-white/60">
                  Track your Google search rankings for target keywords. Rankings are checked via SerpApi and show your position in the top 100 results.
                </p>
              </div>
            </div>
          </div>

          {/* Keywords Table */}
          <div className="p-6 rounded-2xl bg-zinc-900/50 border border-white/5">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Target className="w-5 h-5 text-orange-400" />
              Tracked Keywords
            </h2>
            <div className="space-y-4">
              {/* Default tracked keywords info */}
              <div className="text-sm text-white/60 mb-4">
                <p>Currently tracking rankings for:</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {['ai agency', 'digital agency ai', 'ai web development', 'custom ai applications', 'rocketopp'].map((kw) => (
                    <span key={kw} className="px-2 py-1 text-xs rounded-full bg-white/5 border border-white/10">
                      {kw}
                    </span>
                  ))}
                </div>
              </div>

              {/* Rankings will be fetched via the report API */}
              <p className="text-sm text-white/40 text-center py-8">
                Click the "Report" button above to generate a full ranking report with SERP data.
              </p>
            </div>
          </div>

          {/* Tips Section */}
          <div className="p-6 rounded-2xl bg-zinc-900/50 border border-white/5">
            <h2 className="text-lg font-semibold text-white mb-4">SEO Tips</h2>
            <ul className="space-y-3 text-sm text-white/60">
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                Focus on keywords ranking positions 5-20 for quick wins
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                Improve content for queries with high impressions but low CTR
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                Target related questions for featured snippet opportunities
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                Monitor competitors ranking above you for content gaps
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}

// Stat Card Component
function StatCard({
  icon: Icon,
  label,
  value,
  subValue,
  loading,
  color,
  small,
}: {
  icon: React.ElementType
  label: string
  value: number | string
  subValue?: string
  loading: boolean
  color: string
  small?: boolean
}) {
  const colors: Record<string, string> = {
    blue: 'from-blue-500/20 to-cyan-500/20 text-blue-400',
    purple: 'from-purple-500/20 to-pink-500/20 text-purple-400',
    green: 'from-green-500/20 to-emerald-500/20 text-green-400',
    orange: 'from-orange-500/20 to-red-500/20 text-orange-400',
    cyan: 'from-cyan-500/20 to-blue-500/20 text-cyan-400',
    red: 'from-red-500/20 to-pink-500/20 text-red-400',
    yellow: 'from-yellow-500/20 to-orange-500/20 text-yellow-400',
    emerald: 'from-emerald-500/20 to-green-500/20 text-emerald-400',
  }

  return (
    <div className={`p-${small ? '3' : '4'} rounded-xl bg-zinc-900/50 border border-white/5`}>
      <div className="flex items-center gap-3 mb-2">
        <div className={`w-${small ? '8' : '10'} h-${small ? '8' : '10'} rounded-lg bg-gradient-to-br ${colors[color]} flex items-center justify-center`}>
          <Icon className={`w-${small ? '4' : '5'} h-${small ? '4' : '5'}`} />
        </div>
      </div>
      {loading ? (
        <div className={`h-${small ? '6' : '8'} w-20 bg-white/5 rounded animate-pulse`} />
      ) : (
        <>
          <p className={`${small ? 'text-xl' : 'text-2xl'} font-bold text-white`}>
            {typeof value === 'number' ? value.toLocaleString() : value}
          </p>
          {subValue && <p className="text-xs text-green-400">{subValue}</p>}
        </>
      )}
      <p className="text-xs text-white/40 mt-1">{label}</p>
    </div>
  )
}

// Device Bar Component
function DeviceBar({
  icon: Icon,
  label,
  value,
  loading,
}: {
  icon: React.ElementType
  label: string
  value: number
  loading: boolean
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <Icon className="w-4 h-4 text-white/50" />
          <span className="text-sm text-white">{label}</span>
        </div>
        <span className="text-sm text-white/50">{loading ? '—' : `${value}%`}</span>
      </div>
      <div className="h-2 bg-white/5 rounded-full overflow-hidden">
        {!loading && (
          <div
            className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all"
            style={{ width: `${value}%` }}
          />
        )}
      </div>
    </div>
  )
}
