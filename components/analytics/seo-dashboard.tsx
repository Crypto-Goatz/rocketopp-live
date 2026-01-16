'use client'

// ============================================================
// SEO & Analytics Dashboard
// ============================================================
// Comprehensive real-time SEO and analytics tracking
// Inspired by professional SEO Chrome extensions
// ============================================================

import { useState, useEffect } from 'react'
import {
  TrendingUp,
  TrendingDown,
  Users,
  Eye,
  Clock,
  Globe,
  Search,
  BarChart3,
  Activity,
  Zap,
  Target,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  ExternalLink,
  Smartphone,
  Monitor,
  Shield,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Info,
  ChevronRight,
  MousePointer,
  FileText,
  Link2,
  Image as ImageIcon,
  Code,
  Gauge
} from 'lucide-react'

interface AnalyticsData {
  visitors: {
    total: number
    change: number
    live: number
  }
  pageViews: {
    total: number
    change: number
    unique: number
  }
  avgSessionDuration: {
    value: string
    change: number
  }
  bounceRate: {
    value: number
    change: number
  }
  topPages: Array<{
    path: string
    views: number
    avgTime: string
  }>
  trafficSources: Array<{
    source: string
    visitors: number
    percentage: number
  }>
  devices: {
    desktop: number
    mobile: number
    tablet: number
  }
  seoScore: number
  seoIssues: Array<{
    type: 'error' | 'warning' | 'info'
    message: string
    count?: number
  }>
  coreWebVitals: {
    lcp: { value: number; status: 'good' | 'needs-improvement' | 'poor' }
    fid: { value: number; status: 'good' | 'needs-improvement' | 'poor' }
    cls: { value: number; status: 'good' | 'needs-improvement' | 'poor' }
    ttfb: { value: number; status: 'good' | 'needs-improvement' | 'poor' }
  }
  keywords: Array<{
    keyword: string
    position: number
    change: number
    volume: number
  }>
}

const mockData: AnalyticsData = {
  visitors: { total: 12847, change: 12.5, live: 47 },
  pageViews: { total: 48293, change: 8.3, unique: 31847 },
  avgSessionDuration: { value: '3:24', change: 5.2 },
  bounceRate: { value: 42.3, change: -3.1 },
  topPages: [
    { path: '/', views: 8432, avgTime: '2:15' },
    { path: '/marketplace', views: 5621, avgTime: '4:32' },
    { path: '/marketplace/rocket-plus', views: 3847, avgTime: '5:18' },
    { path: '/services', views: 2934, avgTime: '3:45' },
    { path: '/blog', views: 2156, avgTime: '6:12' },
  ],
  trafficSources: [
    { source: 'Organic Search', visitors: 5847, percentage: 45.5 },
    { source: 'Direct', visitors: 3421, percentage: 26.6 },
    { source: 'Social', visitors: 1893, percentage: 14.7 },
    { source: 'Referral', visitors: 1102, percentage: 8.6 },
    { source: 'Email', visitors: 584, percentage: 4.6 },
  ],
  devices: { desktop: 58, mobile: 38, tablet: 4 },
  seoScore: 87,
  seoIssues: [
    { type: 'warning', message: 'Some images missing alt text', count: 3 },
    { type: 'info', message: 'Consider adding more internal links', count: 5 },
    { type: 'error', message: 'Broken links detected', count: 1 },
  ],
  coreWebVitals: {
    lcp: { value: 1.8, status: 'good' },
    fid: { value: 45, status: 'good' },
    cls: { value: 0.08, status: 'good' },
    ttfb: { value: 420, status: 'needs-improvement' },
  },
  keywords: [
    { keyword: 'AI automation tools', position: 3, change: 2, volume: 2400 },
    { keyword: 'CRM automation', position: 7, change: -1, volume: 1800 },
    { keyword: 'business AI software', position: 5, change: 4, volume: 3200 },
    { keyword: 'MCP server', position: 2, change: 0, volume: 890 },
    { keyword: 'workflow automation', position: 12, change: 3, volume: 5600 },
  ],
}

function StatCard({
  title,
  value,
  change,
  icon: Icon,
  suffix = '',
  prefix = '',
  invertChange = false,
}: {
  title: string
  value: string | number
  change: number
  icon: React.ElementType
  suffix?: string
  prefix?: string
  invertChange?: boolean
}) {
  const isPositive = invertChange ? change < 0 : change > 0
  return (
    <div className="p-5 rounded-2xl bg-zinc-900/50 border border-white/5 hover:border-primary/20 transition-all">
      <div className="flex items-start justify-between mb-3">
        <div className="p-2 rounded-lg bg-primary/10">
          <Icon className="w-5 h-5 text-primary" />
        </div>
        <div className={`flex items-center gap-1 text-sm ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
          {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
          {Math.abs(change)}%
        </div>
      </div>
      <p className="text-sm text-zinc-400 mb-1">{title}</p>
      <p className="text-2xl font-bold text-white">
        {prefix}{typeof value === 'number' ? value.toLocaleString() : value}{suffix}
      </p>
    </div>
  )
}

function SEOScoreGauge({ score }: { score: number }) {
  const getScoreColor = (s: number) => {
    if (s >= 80) return 'text-green-400'
    if (s >= 60) return 'text-yellow-400'
    return 'text-red-400'
  }

  const getScoreLabel = (s: number) => {
    if (s >= 80) return 'Excellent'
    if (s >= 60) return 'Good'
    return 'Needs Work'
  }

  return (
    <div className="relative flex flex-col items-center justify-center">
      <svg className="w-32 h-32 -rotate-90" viewBox="0 0 100 100">
        {/* Background circle */}
        <circle
          cx="50"
          cy="50"
          r="40"
          fill="none"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth="8"
        />
        {/* Progress circle */}
        <circle
          cx="50"
          cy="50"
          r="40"
          fill="none"
          stroke="currentColor"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={`${score * 2.51} 251.2`}
          className={getScoreColor(score)}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={`text-4xl font-bold ${getScoreColor(score)}`}>{score}</span>
        <span className="text-xs text-zinc-400">{getScoreLabel(score)}</span>
      </div>
    </div>
  )
}

function CoreWebVitalCard({
  name,
  value,
  unit,
  status,
}: {
  name: string
  value: number
  unit: string
  status: 'good' | 'needs-improvement' | 'poor'
}) {
  const statusConfig = {
    good: { color: 'text-green-400', bg: 'bg-green-500/10', icon: CheckCircle2 },
    'needs-improvement': { color: 'text-yellow-400', bg: 'bg-yellow-500/10', icon: AlertTriangle },
    poor: { color: 'text-red-400', bg: 'bg-red-500/10', icon: XCircle },
  }

  const config = statusConfig[status]
  const Icon = config.icon

  return (
    <div className={`p-4 rounded-xl ${config.bg} border border-white/5`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-white">{name}</span>
        <Icon className={`w-4 h-4 ${config.color}`} />
      </div>
      <p className={`text-2xl font-bold ${config.color}`}>
        {value}{unit}
      </p>
    </div>
  )
}

export function SEODashboard() {
  const [data, setData] = useState<AnalyticsData>(mockData)
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<'overview' | 'seo' | 'performance' | 'keywords'>('overview')

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setData(prev => ({
        ...prev,
        visitors: {
          ...prev.visitors,
          live: prev.visitors.live + Math.floor(Math.random() * 3) - 1,
        },
      }))
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const refreshData = () => {
    setIsLoading(true)
    setTimeout(() => setIsLoading(false), 1000)
  }

  return (
    <div className="w-full bg-[#0A0A0A] text-white">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold mb-1">Analytics & SEO Dashboard</h2>
          <p className="text-zinc-400 text-sm">Real-time performance and search visibility</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-500/10 border border-green-500/20">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-sm text-green-400">{data.visitors.live} live visitors</span>
          </div>
          <button
            onClick={refreshData}
            className="p-2 rounded-lg bg-zinc-900 border border-white/10 hover:border-white/20 transition-colors"
          >
            <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 mb-6 p-1 bg-zinc-900/50 rounded-xl w-fit">
        {[
          { id: 'overview', label: 'Overview', icon: BarChart3 },
          { id: 'seo', label: 'SEO Health', icon: Search },
          { id: 'performance', label: 'Performance', icon: Zap },
          { id: 'keywords', label: 'Keywords', icon: Target },
        ].map(tab => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-primary text-white'
                  : 'text-zinc-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-4 gap-4">
            <StatCard
              title="Total Visitors"
              value={data.visitors.total}
              change={data.visitors.change}
              icon={Users}
            />
            <StatCard
              title="Page Views"
              value={data.pageViews.total}
              change={data.pageViews.change}
              icon={Eye}
            />
            <StatCard
              title="Avg. Session"
              value={data.avgSessionDuration.value}
              change={data.avgSessionDuration.change}
              icon={Clock}
            />
            <StatCard
              title="Bounce Rate"
              value={data.bounceRate.value}
              change={data.bounceRate.change}
              icon={Activity}
              suffix="%"
              invertChange
            />
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-2 gap-6">
            {/* Traffic Sources */}
            <div className="p-6 rounded-2xl bg-zinc-900/50 border border-white/5">
              <h3 className="text-lg font-semibold mb-4">Traffic Sources</h3>
              <div className="space-y-4">
                {data.trafficSources.map((source, i) => (
                  <div key={i} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-zinc-300">{source.source}</span>
                      <span className="text-zinc-400">{source.visitors.toLocaleString()} ({source.percentage}%)</span>
                    </div>
                    <div className="h-2 rounded-full bg-zinc-800 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-primary to-orange-400 transition-all duration-500"
                        style={{ width: `${source.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Pages */}
            <div className="p-6 rounded-2xl bg-zinc-900/50 border border-white/5">
              <h3 className="text-lg font-semibold mb-4">Top Pages</h3>
              <div className="space-y-3">
                {data.topPages.map((page, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-xs text-primary">
                        {i + 1}
                      </span>
                      <span className="text-sm text-white">{page.path}</span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-zinc-400">
                      <span>{page.views.toLocaleString()} views</span>
                      <span>{page.avgTime}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Devices */}
          <div className="p-6 rounded-2xl bg-zinc-900/50 border border-white/5">
            <h3 className="text-lg font-semibold mb-4">Device Breakdown</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-white/5 text-center">
                <Monitor className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                <p className="text-2xl font-bold text-white">{data.devices.desktop}%</p>
                <p className="text-sm text-zinc-400">Desktop</p>
              </div>
              <div className="p-4 rounded-xl bg-white/5 text-center">
                <Smartphone className="w-8 h-8 text-green-400 mx-auto mb-2" />
                <p className="text-2xl font-bold text-white">{data.devices.mobile}%</p>
                <p className="text-sm text-zinc-400">Mobile</p>
              </div>
              <div className="p-4 rounded-xl bg-white/5 text-center">
                <Monitor className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                <p className="text-2xl font-bold text-white">{data.devices.tablet}%</p>
                <p className="text-sm text-zinc-400">Tablet</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SEO Tab */}
      {activeTab === 'seo' && (
        <div className="space-y-6">
          <div className="grid grid-cols-3 gap-6">
            {/* SEO Score */}
            <div className="p-6 rounded-2xl bg-zinc-900/50 border border-white/5 flex flex-col items-center">
              <h3 className="text-lg font-semibold mb-4">SEO Score</h3>
              <SEOScoreGauge score={data.seoScore} />
              <p className="text-sm text-zinc-400 mt-4 text-center">
                Your site is performing well. Address the issues below for improvement.
              </p>
            </div>

            {/* Issues */}
            <div className="col-span-2 p-6 rounded-2xl bg-zinc-900/50 border border-white/5">
              <h3 className="text-lg font-semibold mb-4">SEO Issues</h3>
              <div className="space-y-3">
                {data.seoIssues.map((issue, i) => {
                  const config = {
                    error: { color: 'text-red-400', bg: 'bg-red-500/10', icon: XCircle },
                    warning: { color: 'text-yellow-400', bg: 'bg-yellow-500/10', icon: AlertTriangle },
                    info: { color: 'text-blue-400', bg: 'bg-blue-500/10', icon: Info },
                  }[issue.type]
                  const Icon = config.icon

                  return (
                    <div
                      key={i}
                      className={`flex items-center gap-4 p-4 rounded-xl ${config.bg}`}
                    >
                      <Icon className={`w-5 h-5 ${config.color}`} />
                      <div className="flex-1">
                        <p className={`text-sm ${config.color}`}>{issue.message}</p>
                      </div>
                      {issue.count && (
                        <span className={`px-2 py-1 rounded text-xs ${config.bg} ${config.color}`}>
                          {issue.count} found
                        </span>
                      )}
                      <ChevronRight className="w-4 h-4 text-zinc-500" />
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* On-Page SEO Checklist */}
          <div className="p-6 rounded-2xl bg-zinc-900/50 border border-white/5">
            <h3 className="text-lg font-semibold mb-4">On-Page SEO Checklist</h3>
            <div className="grid grid-cols-4 gap-4">
              {[
                { name: 'Title Tags', icon: FileText, status: 'good', detail: 'All pages have unique titles' },
                { name: 'Meta Descriptions', icon: FileText, status: 'good', detail: 'All pages optimized' },
                { name: 'H1 Tags', icon: Code, status: 'good', detail: 'One H1 per page' },
                { name: 'Image Alt Text', icon: ImageIcon, status: 'warning', detail: '3 images missing alt' },
                { name: 'Internal Links', icon: Link2, status: 'info', detail: 'Could add more' },
                { name: 'Canonical URLs', icon: Globe, status: 'good', detail: 'Properly configured' },
                { name: 'Schema Markup', icon: Code, status: 'good', detail: 'JSON-LD implemented' },
                { name: 'Mobile Friendly', icon: Smartphone, status: 'good', detail: 'Responsive design' },
              ].map((item, i) => {
                const statusConfig = {
                  good: { color: 'text-green-400', bg: 'bg-green-500/10', Icon: CheckCircle2 },
                  warning: { color: 'text-yellow-400', bg: 'bg-yellow-500/10', Icon: AlertTriangle },
                  info: { color: 'text-blue-400', bg: 'bg-blue-500/10', Icon: Info },
                }[item.status]
                const ItemIcon = item.icon
                const StatusIcon = statusConfig.Icon

                return (
                  <div key={i} className={`p-4 rounded-xl ${statusConfig.bg} border border-white/5`}>
                    <div className="flex items-center justify-between mb-2">
                      <ItemIcon className="w-5 h-5 text-zinc-400" />
                      <StatusIcon className={`w-4 h-4 ${statusConfig.color}`} />
                    </div>
                    <p className="font-medium text-white text-sm">{item.name}</p>
                    <p className="text-xs text-zinc-400 mt-1">{item.detail}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* Performance Tab */}
      {activeTab === 'performance' && (
        <div className="space-y-6">
          {/* Core Web Vitals */}
          <div className="p-6 rounded-2xl bg-zinc-900/50 border border-white/5">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold">Core Web Vitals</h3>
                <p className="text-sm text-zinc-400">Key metrics that affect user experience and SEO</p>
              </div>
              <a
                href="https://web.dev/vitals/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-sm text-primary hover:underline"
              >
                Learn more <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <div className="grid grid-cols-4 gap-4">
              <CoreWebVitalCard
                name="LCP"
                value={data.coreWebVitals.lcp.value}
                unit="s"
                status={data.coreWebVitals.lcp.status}
              />
              <CoreWebVitalCard
                name="FID"
                value={data.coreWebVitals.fid.value}
                unit="ms"
                status={data.coreWebVitals.fid.status}
              />
              <CoreWebVitalCard
                name="CLS"
                value={data.coreWebVitals.cls.value}
                unit=""
                status={data.coreWebVitals.cls.status}
              />
              <CoreWebVitalCard
                name="TTFB"
                value={data.coreWebVitals.ttfb.value}
                unit="ms"
                status={data.coreWebVitals.ttfb.status}
              />
            </div>
          </div>

          {/* Performance Metrics */}
          <div className="grid grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl bg-zinc-900/50 border border-white/5">
              <h3 className="text-lg font-semibold mb-4">Page Speed Insights</h3>
              <div className="space-y-4">
                {[
                  { name: 'First Contentful Paint', value: '0.8s', score: 95 },
                  { name: 'Speed Index', value: '1.2s', score: 88 },
                  { name: 'Time to Interactive', value: '1.5s', score: 92 },
                  { name: 'Total Blocking Time', value: '120ms', score: 85 },
                ].map((metric, i) => (
                  <div key={i} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-zinc-300">{metric.name}</span>
                      <span className="text-zinc-400">{metric.value}</span>
                    </div>
                    <div className="h-2 rounded-full bg-zinc-800 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          metric.score >= 90 ? 'bg-green-400' :
                          metric.score >= 70 ? 'bg-yellow-400' : 'bg-red-400'
                        }`}
                        style={{ width: `${metric.score}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-zinc-900/50 border border-white/5">
              <h3 className="text-lg font-semibold mb-4">Resource Optimization</h3>
              <div className="space-y-3">
                {[
                  { name: 'Images optimized', status: true, detail: 'WebP format, lazy loaded' },
                  { name: 'CSS minified', status: true, detail: 'Tailwind purge enabled' },
                  { name: 'JS bundled', status: true, detail: 'Code splitting active' },
                  { name: 'Gzip enabled', status: true, detail: 'Vercel edge compression' },
                  { name: 'CDN active', status: true, detail: 'Vercel Edge Network' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white/5">
                    {item.status ? (
                      <CheckCircle2 className="w-5 h-5 text-green-400" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-400" />
                    )}
                    <div className="flex-1">
                      <p className="text-sm font-medium text-white">{item.name}</p>
                      <p className="text-xs text-zinc-400">{item.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Keywords Tab */}
      {activeTab === 'keywords' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-zinc-900/50 border border-white/5">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold">Keyword Rankings</h3>
                <p className="text-sm text-zinc-400">Track your search position for target keywords</p>
              </div>
              <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 text-primary text-sm font-medium hover:bg-primary/20 transition-colors">
                <Search className="w-4 h-4" />
                Add Keyword
              </button>
            </div>

            <div className="overflow-hidden rounded-xl border border-white/10">
              <table className="w-full">
                <thead className="bg-zinc-900">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">Keyword</th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-zinc-400 uppercase tracking-wider">Position</th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-zinc-400 uppercase tracking-wider">Change</th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-zinc-400 uppercase tracking-wider">Volume</th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-zinc-400 uppercase tracking-wider">Difficulty</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {data.keywords.map((kw, i) => (
                    <tr key={i} className="hover:bg-white/5 transition-colors">
                      <td className="px-4 py-4">
                        <span className="text-white font-medium">{kw.keyword}</span>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <span className={`px-2 py-1 rounded text-sm font-medium ${
                          kw.position <= 3 ? 'bg-green-500/10 text-green-400' :
                          kw.position <= 10 ? 'bg-yellow-500/10 text-yellow-400' :
                          'bg-zinc-500/10 text-zinc-400'
                        }`}>
                          #{kw.position}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-center">
                        {kw.change !== 0 ? (
                          <span className={`flex items-center justify-center gap-1 ${
                            kw.change > 0 ? 'text-green-400' : 'text-red-400'
                          }`}>
                            {kw.change > 0 ? (
                              <ArrowUpRight className="w-4 h-4" />
                            ) : (
                              <ArrowDownRight className="w-4 h-4" />
                            )}
                            {Math.abs(kw.change)}
                          </span>
                        ) : (
                          <span className="text-zinc-500">-</span>
                        )}
                      </td>
                      <td className="px-4 py-4 text-center text-zinc-400">
                        {kw.volume.toLocaleString()}/mo
                      </td>
                      <td className="px-4 py-4 text-center">
                        <div className="w-16 h-2 rounded-full bg-zinc-800 mx-auto overflow-hidden">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-green-400 to-red-400"
                            style={{ width: `${Math.min(kw.volume / 50, 100)}%` }}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20">
              <p className="text-2xl font-bold text-green-400">3</p>
              <p className="text-sm text-zinc-400">Top 3 Keywords</p>
            </div>
            <div className="p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20">
              <p className="text-2xl font-bold text-yellow-400">2</p>
              <p className="text-sm text-zinc-400">Top 10 Keywords</p>
            </div>
            <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
              <p className="text-2xl font-bold text-blue-400">14.4K</p>
              <p className="text-sm text-zinc-400">Total Search Volume</p>
            </div>
            <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/20">
              <p className="text-2xl font-bold text-purple-400">+2.4</p>
              <p className="text-sm text-zinc-400">Avg Position Change</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default SEODashboard
