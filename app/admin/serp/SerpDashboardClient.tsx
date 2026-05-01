'use client'

/**
 * SERP Rank Tracker dashboard — admin UI at /admin/serp.
 *
 * Three sections:
 *   1. Stat header (total keywords, avg position, top-10 count, AI-cited count)
 *   2. Add-keyword form
 *   3. Keyword table (current rank, delta vs previous, AI-cited badge,
 *      domain filter, label filter, sort by domain/query/position/delta)
 *
 * Click a row → opens an inline detail panel with the last-60 ranking
 * snapshots rendered as a sparkline (pure SVG, no chart library).
 *
 * "Run all" button hits /api/serp/track with no body — re-runs every
 * active keyword + auto-refreshes the table.
 */

import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  ArrowDown,
  ArrowUp,
  Activity,
  Loader2,
  Plus,
  RefreshCcw,
  Search,
  Sparkles,
  Trash2,
  TrendingUp,
} from 'lucide-react'

interface KeywordRow {
  keyword_id: string
  domain: string
  query: string
  location: string
  device: 'desktop' | 'mobile'
  label: string | null
  active: boolean
  notes: string | null
  current_position: number | null
  previous_position: number | null
  position_delta: number | null
  ai_overview: boolean
  ai_cited: boolean
  last_checked: string | null
}

interface HistoryPoint {
  id: number
  position: number | null
  ai_cited: boolean
  checked_at: string
}

type SortKey = 'domain' | 'query' | 'position' | 'delta' | 'last'

const FAMILY_DOMAINS = [
  'rocketopp.com',
  '0nmcp.com',
  '0ncore.com',
  'sxowebsite.com',
  'verifiedsxo.com',
  'rocketadd.com',
  'cro9.com',
  'rocketarticle.com',
  '180crm.com',
  'mcpfed.com',
]

export default function SerpDashboardClient() {
  const [keywords, setKeywords] = useState<KeywordRow[]>([])
  const [loading, setLoading] = useState(true)
  const [running, setRunning] = useState(false)
  const [domainFilter, setDomainFilter] = useState<string>('')
  const [sort, setSort] = useState<SortKey>('domain')
  const [openDetail, setOpenDetail] = useState<string | null>(null)
  const [history, setHistory] = useState<Record<string, HistoryPoint[]>>({})
  const [err, setErr] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const params = domainFilter ? `?domain=${encodeURIComponent(domainFilter)}` : ''
      const res = await fetch(`/api/serp/keywords${params}`, { cache: 'no-store' })
      const data = await res.json()
      setKeywords(data.keywords ?? [])
    } catch (e) {
      setErr(e instanceof Error ? e.message : 'load failed')
    } finally {
      setLoading(false)
    }
  }, [domainFilter])

  useEffect(() => {
    void load()
  }, [load])

  async function loadHistory(keywordId: string) {
    if (history[keywordId]) return
    const res = await fetch(`/api/serp/history?keywordId=${keywordId}&limit=60`, { cache: 'no-store' })
    const data = await res.json()
    setHistory((h) => ({ ...h, [keywordId]: data.history ?? [] }))
  }

  async function runAll(keywordIds?: string[]) {
    setRunning(true)
    setErr(null)
    try {
      const res = await fetch('/api/serp/track', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(keywordIds && keywordIds.length ? { keywordIds } : {}),
      })
      if (!res.ok) {
        const j = await res.json().catch(() => ({}))
        throw new Error(j.error || `Server returned ${res.status}`)
      }
      await load()
    } catch (e) {
      setErr(e instanceof Error ? e.message : 'track failed')
    } finally {
      setRunning(false)
    }
  }

  async function archive(keywordId: string) {
    if (!confirm('Archive this keyword?')) return
    await fetch(`/api/serp/keywords/${keywordId}`, { method: 'DELETE' })
    void load()
  }

  // ─── Sort + filter ─────────────────────────────────────────────────
  const sorted = useMemo(() => {
    const list = [...keywords]
    list.sort((a, b) => {
      switch (sort) {
        case 'domain':
          return a.domain.localeCompare(b.domain) || a.query.localeCompare(b.query)
        case 'query':
          return a.query.localeCompare(b.query)
        case 'position':
          return (a.current_position ?? 999) - (b.current_position ?? 999)
        case 'delta':
          return (b.position_delta ?? -999) - (a.position_delta ?? -999)
        case 'last':
          return new Date(b.last_checked ?? 0).getTime() - new Date(a.last_checked ?? 0).getTime()
      }
    })
    return list
  }, [keywords, sort])

  // ─── Stats ─────────────────────────────────────────────────────────
  const stats = useMemo(() => {
    const tracked = keywords.length
    const ranked = keywords.filter((k) => k.current_position !== null).length
    const top10 = keywords.filter((k) => (k.current_position ?? 999) <= 10).length
    const aiCited = keywords.filter((k) => k.ai_cited).length
    const positions = keywords.map((k) => k.current_position).filter((p): p is number => p !== null)
    const avg = positions.length ? Math.round(positions.reduce((a, b) => a + b, 0) / positions.length) : null
    return { tracked, ranked, top10, aiCited, avg }
  }, [keywords])

  return (
    <main className="min-h-screen bg-background">
      <section className="border-b border-border">
        <div className="container px-4 py-10 md:px-6 md:py-14">
          <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/8 px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-widest text-primary">
            <Activity className="h-3 w-3" /> Internal · admin
          </div>
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="text-balance text-3xl font-bold tracking-tight md:text-5xl">
                SERP Rank Tracker
              </h1>
              <p className="mt-2 text-base text-muted-foreground md:text-lg">
                Keyword rankings across the entire RocketOpp family. Daily cron at 5am UTC. Click a row for the rolling history.
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => runAll()}
                disabled={running}
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground shadow-[0_0_20px_rgba(255,107,0,0.3)] transition-transform hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {running ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCcw className="h-4 w-4" />}
                {running ? 'Tracking…' : 'Run all now'}
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-5">
            <Stat label="Tracked" value={stats.tracked.toString()} icon={Search} />
            <Stat label="Ranked" value={stats.ranked.toString()} icon={TrendingUp} />
            <Stat label="Avg position" value={stats.avg !== null ? stats.avg.toString() : '—'} icon={Activity} />
            <Stat label="Top 10" value={stats.top10.toString()} icon={ArrowUp} />
            <Stat label="AI cited" value={stats.aiCited.toString()} icon={Sparkles} />
          </div>
        </div>
      </section>

      {/* Add keyword + filters */}
      <section className="border-b border-border bg-card/30">
        <div className="container px-4 py-6 md:px-6">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <AddKeywordForm onAdded={load} />

            <div className="rounded-2xl border border-border bg-card p-5">
              <div className="mb-3 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                Filter
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setDomainFilter('')}
                  className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                    !domainFilter
                      ? 'bg-primary text-primary-foreground'
                      : 'border border-border bg-background text-muted-foreground hover:border-primary/40'
                  }`}
                >
                  All domains
                </button>
                {FAMILY_DOMAINS.map((d) => (
                  <button
                    key={d}
                    onClick={() => setDomainFilter(d)}
                    className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                      domainFilter === d
                        ? 'bg-primary text-primary-foreground'
                        : 'border border-border bg-background text-muted-foreground hover:border-primary/40'
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
              <div className="mt-4 flex items-center gap-2">
                <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Sort:</span>
                {(['domain', 'query', 'position', 'delta', 'last'] as SortKey[]).map((k) => (
                  <button
                    key={k}
                    onClick={() => setSort(k)}
                    className={`rounded-full px-3 py-1 text-[11px] font-semibold ${
                      sort === k ? 'bg-foreground text-background' : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {k}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Keyword table */}
      <section className="container px-4 py-8 md:px-6">
        {err && (
          <div className="mb-4 rounded-xl border border-red-500/30 bg-red-500/[0.05] p-4 text-sm text-red-400">{err}</div>
        )}
        {loading ? (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" /> Loading…
          </div>
        ) : sorted.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border p-10 text-center text-muted-foreground">
            No keywords yet. Add one above.
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-border">
            <table className="w-full text-sm">
              <thead className="bg-card">
                <tr>
                  <th className="px-4 py-3 text-left font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Domain</th>
                  <th className="px-4 py-3 text-left font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Query</th>
                  <th className="px-4 py-3 text-right font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Pos</th>
                  <th className="px-4 py-3 text-right font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Δ</th>
                  <th className="px-4 py-3 text-center font-mono text-[10px] uppercase tracking-widest text-muted-foreground">AI</th>
                  <th className="px-4 py-3 text-left font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Last</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {sorted.map((k) => {
                  const open = openDetail === k.keyword_id
                  return (
                    <RowFragment
                      key={k.keyword_id}
                      keyword={k}
                      open={open}
                      history={history[k.keyword_id]}
                      onToggle={() => {
                        const next = open ? null : k.keyword_id
                        setOpenDetail(next)
                        if (next) void loadHistory(next)
                      }}
                      onRun={() => runAll([k.keyword_id])}
                      onArchive={() => archive(k.keyword_id)}
                    />
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  )
}

// ─── Sub-components ────────────────────────────────────────────────────────

function Stat({ label, value, icon: Icon }: { label: string; value: string; icon: React.ComponentType<{ className?: string }> }) {
  return (
    <div className="rounded-2xl border border-border bg-card/50 px-4 py-4 backdrop-blur">
      <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
        <Icon className="h-3 w-3" />
        {label}
      </div>
      <div className="mt-2 text-2xl font-black tabular-nums text-primary md:text-3xl">{value}</div>
    </div>
  )
}

function AddKeywordForm({ onAdded }: { onAdded: () => void }) {
  const [domain, setDomain] = useState('rocketopp.com')
  const [query, setQuery] = useState('')
  const [label, setLabel] = useState('')
  const [device, setDevice] = useState<'desktop' | 'mobile'>('desktop')
  const [submitting, setSubmitting] = useState(false)
  const [err, setErr] = useState<string | null>(null)

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setErr(null)
    try {
      const res = await fetch('/api/serp/keywords', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ domain, query, label: label || undefined, device }),
      })
      if (!res.ok) {
        const j = await res.json().catch(() => ({}))
        throw new Error(j.error || `Server returned ${res.status}`)
      }
      setQuery('')
      setLabel('')
      onAdded()
    } catch (e) {
      setErr(e instanceof Error ? e.message : 'add failed')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleAdd} className="rounded-2xl border border-border bg-card p-5">
      <div className="mb-3 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
        Add keyword
      </div>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <input
          type="text"
          value={domain}
          onChange={(e) => setDomain(e.target.value)}
          placeholder="domain (e.g. rocketopp.com)"
          required
          className="rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary/50"
        />
        <select
          value={device}
          onChange={(e) => setDevice(e.target.value as 'desktop' | 'mobile')}
          className="rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary/50"
        >
          <option value="desktop">Desktop</option>
          <option value="mobile">Mobile</option>
        </select>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="search query"
          required
          className="rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary/50 md:col-span-2"
        />
        <input
          type="text"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          placeholder="label (optional, e.g. family-page or hero)"
          className="rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary/50 md:col-span-2"
        />
      </div>
      {err && <p className="mt-2 text-xs text-red-400">{err}</p>}
      <div className="mt-3 flex justify-end">
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-bold text-primary-foreground transition-transform hover:scale-[1.02] disabled:opacity-60"
        >
          {submitting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Plus className="h-3.5 w-3.5" />}
          Add
        </button>
      </div>
    </form>
  )
}

function RowFragment({
  keyword: k,
  open,
  history,
  onToggle,
  onRun,
  onArchive,
}: {
  keyword: KeywordRow
  open: boolean
  history: HistoryPoint[] | undefined
  onToggle: () => void
  onRun: () => void
  onArchive: () => void
}) {
  const last = k.last_checked ? new Date(k.last_checked) : null
  const lastLabel = last ? relTime(last) : 'never'
  const pos = k.current_position
  const delta = k.position_delta
  return (
    <>
      <tr
        onClick={onToggle}
        className="cursor-pointer border-t border-border hover:bg-card/40"
      >
        <td className="px-4 py-3 font-mono text-xs text-foreground/80">{k.domain}</td>
        <td className="px-4 py-3 font-medium text-foreground">{k.query}</td>
        <td className="px-4 py-3 text-right">
          {pos === null ? (
            <span className="font-mono text-xs text-muted-foreground">—</span>
          ) : (
            <span className={`font-mono text-base font-bold tabular-nums ${pos <= 10 ? 'text-emerald-500' : pos <= 30 ? 'text-amber-500' : 'text-foreground'}`}>
              {pos}
            </span>
          )}
        </td>
        <td className="px-4 py-3 text-right">
          {delta === null || delta === 0 ? (
            <span className="font-mono text-xs text-muted-foreground">—</span>
          ) : delta > 0 ? (
            <span className="inline-flex items-center gap-0.5 font-mono text-xs font-bold text-emerald-500">
              <ArrowUp className="h-3 w-3" />
              {delta}
            </span>
          ) : (
            <span className="inline-flex items-center gap-0.5 font-mono text-xs font-bold text-red-400">
              <ArrowDown className="h-3 w-3" />
              {Math.abs(delta)}
            </span>
          )}
        </td>
        <td className="px-4 py-3 text-center">
          {k.ai_cited ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-widest text-primary">
              <Sparkles className="h-3 w-3" /> Cited
            </span>
          ) : k.ai_overview ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              AI box
            </span>
          ) : (
            <span className="font-mono text-[10px] text-muted-foreground">—</span>
          )}
        </td>
        <td className="px-4 py-3 font-mono text-[10px] text-muted-foreground">{lastLabel}</td>
        <td className="px-4 py-3 text-right">
          <button
            onClick={(e) => {
              e.stopPropagation()
              onRun()
            }}
            className="rounded-md border border-border px-2 py-1 text-[11px] font-semibold text-muted-foreground hover:border-primary/40 hover:text-primary"
            title="Re-track now"
          >
            <RefreshCcw className="h-3 w-3" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              onArchive()
            }}
            className="ml-1 rounded-md border border-border px-2 py-1 text-[11px] font-semibold text-muted-foreground hover:border-red-500/40 hover:text-red-400"
            title="Archive"
          >
            <Trash2 className="h-3 w-3" />
          </button>
        </td>
      </tr>
      {open && (
        <tr className="border-t border-border bg-card/30">
          <td colSpan={7} className="px-4 py-5">
            <Sparkline history={history} />
          </td>
        </tr>
      )}
    </>
  )
}

function Sparkline({ history }: { history: HistoryPoint[] | undefined }) {
  if (!history) {
    return (
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Loader2 className="h-3 w-3 animate-spin" /> Loading history…
      </div>
    )
  }
  if (history.length === 0) {
    return <p className="text-xs text-muted-foreground">No snapshots yet — hit "Run all now" to populate.</p>
  }
  const positions = history.map((h) => h.position)
  const W = 600
  const H = 80
  const pad = 8
  const maxPos = Math.max(...positions.map((p) => p ?? 100), 10)
  const xStep = positions.length > 1 ? (W - pad * 2) / (positions.length - 1) : 0
  const points = positions.map((p, i) => {
    const x = pad + i * xStep
    const y = p === null ? H - pad : pad + ((p - 1) / (maxPos - 1 || 1)) * (H - pad * 2)
    return { x, y, p, ts: history[i].checked_at, ai: history[i].ai_cited }
  })
  const path = points
    .map((pt, i) => (pt.p === null ? '' : `${i === 0 ? 'M' : 'L'} ${pt.x.toFixed(1)} ${pt.y.toFixed(1)}`))
    .filter(Boolean)
    .join(' ')

  return (
    <div>
      <div className="mb-2 flex items-center gap-3 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
        <span>last {history.length} snapshots</span>
        <span>· lower = better</span>
        <span>· dot = AI cited</span>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" preserveAspectRatio="none">
        <path d={path} fill="none" stroke="currentColor" strokeWidth={2} className="text-primary" />
        {points.map((pt, i) =>
          pt.p === null ? null : (
            <circle
              key={i}
              cx={pt.x}
              cy={pt.y}
              r={pt.ai ? 3.5 : 2}
              className={pt.ai ? 'fill-primary' : 'fill-foreground'}
            />
          ),
        )}
      </svg>
    </div>
  )
}

function relTime(d: Date): string {
  const diff = Date.now() - d.getTime()
  const m = Math.floor(diff / 60_000)
  if (m < 1) return 'just now'
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  const d2 = Math.floor(h / 24)
  return `${d2}d ago`
}
