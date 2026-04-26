'use client'

/**
 * /0nai — unified analytics command surface for rocketopp.com.
 *
 * Reads the shared CRO9 events store (same DB as sxowebsite.com) through
 * /api/0nai/stats and renders:
 *   - 5-tile top bar (live / pageviews / visitors / sessions / events)
 *   - Top pages · Top sources · Top UTM campaigns · Device mix · Country mix
 *   - Event-type histogram
 *   - Live feed of the last 50 events
 *
 * Auto-refreshes every 10s. Window switcher: 1h · 24h · 7d · 30d.
 */

import { useEffect, useState } from 'react'
import useSWR from 'swr'
import Link from 'next/link'
import {
  Activity,
  Users,
  Eye,
  Radio,
  Globe,
  Megaphone,
  Monitor,
  Smartphone,
  Tablet,
  Clock,
  ArrowUpRight,
  Zap,
  FileText,
} from 'lucide-react'

const fetcher = (url: string) => fetch(url).then((r) => r.json())

type WindowKey = '1h' | '24h' | '7d' | '30d'

interface StatsResponse {
  site_id: string
  window: string
  since: string
  generated_at: string
  totals: {
    pageviews: number
    unique_visitors: number
    sessions: number
    live_visitors: number
    total_events: number
  }
  top_pages: Array<{ path: string; count: number }>
  top_sources: Array<{ source: string; count: number }>
  top_campaigns: Array<{ campaign: string; count: number }>
  device_split: Array<{ device: string; count: number }>
  country_split: Array<{ country: string; count: number }>
  event_types: Array<{ type: string; count: number }>
  recent: Array<{
    type: string
    path: string | null
    referrer_domain: string
    utm_campaign: string | null
    utm_source: string | null
    country: string | null
    device: string | null
    timestamp: string
    visitor_id: string | null
  }>
}

function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  if (diff < 60_000) return `${Math.floor(diff / 1000)}s ago`
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}m ago`
  if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)}h ago`
  return `${Math.floor(diff / 86_400_000)}d ago`
}

function eventTypeAccent(t: string) {
  if (t === 'pageview') return 'text-white/60 bg-white/5 border-white/10'
  if (t === 'scan_started') return 'text-amber-300 bg-amber-500/10 border-amber-500/25'
  if (t === 'scan_completed') return 'text-emerald-300 bg-emerald-500/10 border-emerald-500/25'
  if (t === 'checkout_started' || t === 'checkout_completed') return 'text-violet-300 bg-violet-500/10 border-violet-500/25'
  if (t === 'outbound_click') return 'text-cyan-300 bg-cyan-500/10 border-cyan-500/25'
  return 'text-white/60 bg-white/5 border-white/10'
}

function deviceIcon(d: string | null) {
  if (d === 'mobile') return <Smartphone className="h-3 w-3" />
  if (d === 'tablet') return <Tablet className="h-3 w-3" />
  if (d === 'desktop') return <Monitor className="h-3 w-3" />
  return <Globe className="h-3 w-3" />
}

export function NaiDashboard() {
  const [win, setWin] = useState<WindowKey>('24h')
  const [now, setNow] = useState(Date.now())

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [])

  const { data, isLoading } = useSWR<StatsResponse>(
    `/api/0nai/stats?window=${win}`,
    fetcher,
    { refreshInterval: 10_000 },
  )

  const totals = data?.totals
  void now

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4 mb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/35 bg-emerald-500/5 text-emerald-300 text-[10px] font-bold uppercase tracking-[0.22em] mb-2">
            <Activity className="h-3.5 w-3.5" />
            0nAI · Live Analytics
          </div>
          <h1 className="text-4xl font-black tracking-tight text-white">
            Command surface.
          </h1>
          <p className="text-sm text-white/55 mt-2">
            Every pageview, every scan, every campaign click on rocketopp.com — streamed from
            the shared CRO9 event store. Refreshing every 10s.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {(['1h', '24h', '7d', '30d'] as WindowKey[]).map((w) => (
            <button
              key={w}
              onClick={() => setWin(w)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                win === w
                  ? 'bg-orange-500/15 text-orange-300 border-orange-500/35'
                  : 'bg-white/5 text-white/50 border-white/10 hover:bg-white/10'
              }`}
            >
              {w}
            </button>
          ))}
        </div>
      </div>

      {/* Top tiles */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
        <LiveTile count={totals?.live_visitors ?? 0} />
        <Tile
          icon={<Eye className="h-4 w-4 text-orange-400" />}
          label="Pageviews"
          value={totals?.pageviews ?? 0}
        />
        <Tile
          icon={<Users className="h-4 w-4 text-cyan-400" />}
          label="Unique visitors"
          value={totals?.unique_visitors ?? 0}
        />
        <Tile
          icon={<Activity className="h-4 w-4 text-violet-300" />}
          label="Sessions"
          value={totals?.sessions ?? 0}
        />
        <Tile
          icon={<Zap className="h-4 w-4 text-emerald-400" />}
          label="Total events"
          value={totals?.total_events ?? 0}
        />
      </div>

      {/* Grid — top pages + sources */}
      <div className="grid gap-4 md:grid-cols-2 mb-6">
        <Panel
          title="Top pages"
          icon={<FileText className="h-4 w-4 text-white/40" />}
          rows={(data?.top_pages || []).map((p) => ({
            primary: p.path,
            value: p.count,
          }))}
          loading={isLoading && !data}
        />
        <Panel
          title="Top sources (referrer)"
          icon={<Globe className="h-4 w-4 text-white/40" />}
          rows={(data?.top_sources || []).map((s) => ({
            primary: s.source,
            value: s.count,
          }))}
          loading={isLoading && !data}
        />
      </div>

      {/* Grid — campaigns + devices */}
      <div className="grid gap-4 md:grid-cols-2 mb-6">
        <Panel
          title="Top UTM campaigns"
          icon={<Megaphone className="h-4 w-4 text-white/40" />}
          rows={(data?.top_campaigns || []).map((c) => ({
            primary: c.campaign,
            value: c.count,
          }))}
          loading={isLoading && !data}
          emptyLabel="No UTM-tagged traffic yet."
        />
        <Panel
          title="Device split"
          icon={<Monitor className="h-4 w-4 text-white/40" />}
          rows={(data?.device_split || []).map((d) => ({
            primary: d.device,
            value: d.count,
          }))}
          loading={isLoading && !data}
        />
      </div>

      {/* Grid — countries + event types */}
      <div className="grid gap-4 md:grid-cols-2 mb-6">
        <Panel
          title="Top countries"
          icon={<Globe className="h-4 w-4 text-white/40" />}
          rows={(data?.country_split || []).map((c) => ({
            primary: c.country,
            value: c.count,
          }))}
          loading={isLoading && !data}
        />
        <Panel
          title="Event types"
          icon={<Activity className="h-4 w-4 text-white/40" />}
          rows={(data?.event_types || []).map((e) => ({
            primary: e.type,
            value: e.count,
          }))}
          loading={isLoading && !data}
        />
      </div>

      {/* Live feed */}
      <div className="rounded-2xl border border-white/10 bg-black/30 backdrop-blur-md overflow-hidden">
        <div className="px-5 py-4 border-b border-white/10 flex items-center gap-2">
          <Radio className="h-4 w-4 text-emerald-400 animate-pulse" />
          <h3 className="text-sm font-bold text-white">Live feed</h3>
          <span className="text-[11px] text-white/40 ml-auto">Last 50 events</span>
        </div>
        <div className="max-h-[520px] overflow-y-auto">
          {(data?.recent || []).length === 0 ? (
            <div className="text-sm text-white/40 py-12 text-center">
              {isLoading ? 'Loading…' : 'No activity in this window.'}
            </div>
          ) : (
            <ul className="divide-y divide-white/5">
              {(data?.recent || []).map((ev, i) => (
                <li
                  key={`${ev.timestamp}-${i}`}
                  className="px-5 py-2.5 flex items-center gap-3 hover:bg-white/[0.02]"
                >
                  <span
                    className={`shrink-0 inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wide border ${eventTypeAccent(ev.type)}`}
                  >
                    {ev.type}
                  </span>
                  <span className="text-xs text-white/70 font-mono truncate min-w-0 flex-1">
                    {ev.path || '—'}
                  </span>
                  <div className="ml-auto flex items-center gap-3 shrink-0 text-[11px] text-white/40">
                    {ev.utm_campaign && (
                      <span className="flex items-center gap-1">
                        <Megaphone className="h-3 w-3" />
                        {ev.utm_campaign}
                      </span>
                    )}
                    {ev.referrer_domain && ev.referrer_domain !== '(direct)' && (
                      <span>{ev.referrer_domain}</span>
                    )}
                    {ev.country && <span>{ev.country}</span>}
                    {ev.device && deviceIcon(ev.device)}
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {relativeTime(ev.timestamp)}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="mt-6 text-[11px] text-white/35 text-center">
        Site:{' '}
        <code className="text-white/50 font-mono">{data?.site_id || 'site_rocketopp'}</code>{' '}
        · Store:{' '}
        <code className="text-white/50 font-mono">cro9_events</code> · Sibling surfaces:{' '}
        <Link href="https://sxowebsite.com/cro9/campaigns" className="underline underline-offset-2 hover:text-white/60" target="_blank">
          sxowebsite.com/cro9/campaigns
        </Link>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Tile
// ---------------------------------------------------------------------------
function Tile({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: number | string
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.02] backdrop-blur-sm p-4">
      <div className="flex items-center gap-2 text-xs text-white/50 uppercase tracking-wide mb-1.5">
        {icon}
        {label}
      </div>
      <div className="text-2xl font-bold text-white tabular-nums">{value}</div>
    </div>
  )
}

function LiveTile({ count }: { count: number }) {
  return (
    <div
      className="relative rounded-xl border overflow-hidden p-4"
      style={{
        background: 'linear-gradient(135deg, rgba(16,185,129,0.1), rgba(16,185,129,0.02))',
        borderColor: 'rgba(16,185,129,0.35)',
      }}
    >
      <div className="flex items-center gap-2 text-xs text-emerald-300 uppercase tracking-wide mb-1.5">
        <span className="inline-flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
        Live now
      </div>
      <div className="text-2xl font-bold text-white tabular-nums">{count}</div>
      <div className="text-[10px] text-emerald-300/60">last 5 minutes</div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Panel — ranked bar list
// ---------------------------------------------------------------------------
function Panel({
  title,
  icon,
  rows,
  loading,
  emptyLabel = 'No data yet.',
}: {
  title: string
  icon: React.ReactNode
  rows: Array<{ primary: string; value: number }>
  loading: boolean
  emptyLabel?: string
}) {
  const max = rows.reduce((acc, r) => Math.max(acc, r.value), 0) || 1
  return (
    <div className="rounded-2xl border border-white/10 bg-black/30 backdrop-blur-md overflow-hidden">
      <div className="px-5 py-4 border-b border-white/10 flex items-center gap-2">
        {icon}
        <h3 className="text-sm font-bold text-white">{title}</h3>
        <ArrowUpRight className="h-3 w-3 text-white/20 ml-auto" />
      </div>
      <div className="p-4">
        {loading ? (
          <div className="text-sm text-white/40 py-6 text-center">Loading…</div>
        ) : rows.length === 0 ? (
          <div className="text-sm text-white/40 py-6 text-center">{emptyLabel}</div>
        ) : (
          <ul className="space-y-1.5">
            {rows.map((r) => (
              <li key={r.primary} className="relative">
                <div className="flex items-center justify-between gap-3 text-xs">
                  <span className="text-white/80 truncate font-mono">{r.primary}</span>
                  <span className="text-white/40 tabular-nums shrink-0">{r.value}</span>
                </div>
                <div className="mt-1 h-1 w-full rounded-full bg-white/5 overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${(r.value / max) * 100}%`,
                      background: 'linear-gradient(90deg,#ff6b35,#f59e0b)',
                    }}
                  />
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
