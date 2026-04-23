'use client'

/**
 * Searchable HIPAA regulation table.
 *
 * Pulls from lib/hipaa/knowledge.ts — the same catalog that powers the
 * K-layer and the chat widget. Exposes:
 *   - Full-text search across rule ID, title, summary, NPRM delta
 *   - Category filter (technical / administrative / privacy / …)
 *   - Expandable rows showing NPRM delta when present
 *
 * The search and rendering are transparent; the scoring algorithm that
 * converts these rules into a pass/fail result is not — that remains IP.
 */

import { Fragment, useMemo, useState } from 'react'
import { Search, ChevronRight, ShieldCheck, ShieldAlert, Filter, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { HIPAA_RULE_CITATIONS } from '@/lib/hipaa/knowledge'

interface RuleRow {
  section: string
  title: string
  type: string
  summary: string
  current: string
  nprm2026?: string
}

const ROWS: RuleRow[] = Object.entries(HIPAA_RULE_CITATIONS).map(([section, info]) => ({
  section,
  title: info.title,
  type: info.type,
  summary: info.summary,
  current: info.current,
  nprm2026: 'nprm2026' in info ? (info as { nprm2026: string }).nprm2026 : undefined,
}))

const TYPES = Array.from(new Set(ROWS.map((r) => r.type))).sort()

function typeBadgeStyle(type: string) {
  switch (type) {
    case 'technical':
      return 'bg-orange-500/10 text-orange-300 border-orange-500/25'
    case 'administrative':
      return 'bg-violet-500/10 text-violet-300 border-violet-500/25'
    case 'physical':
      return 'bg-cyan-500/10 text-cyan-300 border-cyan-500/25'
    case 'privacy':
      return 'bg-emerald-500/10 text-emerald-300 border-emerald-500/25'
    case 'breach-notification':
      return 'bg-rose-500/10 text-rose-300 border-rose-500/25'
    default:
      return 'bg-white/5 text-white/70 border-white/10'
  }
}

function statusBadgeStyle(status: string) {
  switch (status) {
    case 'required':
      return 'bg-emerald-500/10 text-emerald-300 border-emerald-500/25'
    case 'addressable':
      return 'bg-amber-500/10 text-amber-300 border-amber-500/25'
    default:
      return 'bg-white/5 text-white/60 border-white/10'
  }
}

export function HipaaRulesTable() {
  const [query, setQuery] = useState('')
  const [activeType, setActiveType] = useState<string | null>(null)
  const [expanded, setExpanded] = useState<Set<string>>(new Set())

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return ROWS.filter((r) => {
      if (activeType && r.type !== activeType) return false
      if (!q) return true
      return (
        r.section.toLowerCase().includes(q) ||
        r.title.toLowerCase().includes(q) ||
        r.type.toLowerCase().includes(q) ||
        r.summary.toLowerCase().includes(q) ||
        (r.nprm2026 || '').toLowerCase().includes(q)
      )
    })
  }, [query, activeType])

  function toggle(section: string) {
    setExpanded((prev) => {
      const next = new Set(prev)
      if (next.has(section)) next.delete(section)
      else next.add(section)
      return next
    })
  }

  return (
    <div className="hipaa-rules relative rounded-2xl overflow-hidden">
      <div className="hipaa-rules__topline" />

      <div className="relative p-5 md:p-6">
        {/* Header + search */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-5">
          <div>
            <div className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.22em] text-orange-300 mb-1.5">
              <ShieldCheck className="h-3.5 w-3.5" /> 45 CFR Part 164 · Reference
            </div>
            <h3 className="text-xl font-bold text-white">HIPAA regulations, searchable.</h3>
            <p className="text-xs text-white/55 mt-1 max-w-xl">
              The full catalog we cite in every report. The scoring algorithm that applies
              these to your site is our IP — the rules themselves are public.
            </p>
          </div>

          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30 pointer-events-none" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search §164.312(d), MFA, encryption…"
              className="pl-9 bg-black/50 border-white/10 text-sm placeholder:text-white/30 focus-visible:border-orange-500/40 focus-visible:ring-orange-500/15"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                aria-label="Clear"
                className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 rounded-md flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Type filter chips */}
        <div className="flex items-center gap-1.5 flex-wrap mb-4">
          <Filter className="h-3.5 w-3.5 text-white/30" />
          <button
            onClick={() => setActiveType(null)}
            className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border transition-colors ${
              activeType === null
                ? 'bg-orange-500/15 text-orange-300 border-orange-500/35'
                : 'bg-white/5 text-white/50 border-white/10 hover:bg-white/10'
            }`}
          >
            All ({ROWS.length})
          </button>
          {TYPES.map((t) => {
            const count = ROWS.filter((r) => r.type === t).length
            return (
              <button
                key={t}
                onClick={() => setActiveType(activeType === t ? null : t)}
                className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border capitalize transition-colors ${
                  activeType === t
                    ? 'bg-orange-500/15 text-orange-300 border-orange-500/35'
                    : 'bg-white/5 text-white/50 border-white/10 hover:bg-white/10'
                }`}
              >
                {t.replace('-', ' ')} ({count})
              </button>
            )
          })}
        </div>

        {/* Table */}
        <div className="rounded-xl border border-white/10 bg-black/30 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-white/10 hover:bg-transparent">
                <TableHead className="w-[140px] text-[10px] uppercase tracking-widest text-white/40 font-bold">
                  Rule
                </TableHead>
                <TableHead className="text-[10px] uppercase tracking-widest text-white/40 font-bold">
                  Title
                </TableHead>
                <TableHead className="w-[130px] text-[10px] uppercase tracking-widest text-white/40 font-bold">
                  Category
                </TableHead>
                <TableHead className="w-[130px] text-[10px] uppercase tracking-widest text-white/40 font-bold">
                  Today
                </TableHead>
                <TableHead className="w-[40px]" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-sm text-white/40 py-10">
                    No rules match "<span className="text-white/70">{query}</span>".
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((r) => {
                  const open = expanded.has(r.section)
                  return (
                    <Fragment key={r.section}>
                      <TableRow
                        onClick={() => toggle(r.section)}
                        className="cursor-pointer border-b border-white/5 hover:bg-white/[0.03]"
                      >
                        <TableCell className="font-mono text-xs text-white/85">
                          §{r.section}
                        </TableCell>
                        <TableCell className="font-medium text-sm text-white">
                          {r.title}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={`text-[10px] capitalize border ${typeBadgeStyle(r.type)}`}
                          >
                            {r.type.replace('-', ' ')}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={`text-[10px] capitalize border ${statusBadgeStyle(r.current)}`}
                          >
                            {r.current}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <ChevronRight
                            className={`h-4 w-4 text-white/35 transition-transform ${open ? 'rotate-90' : ''}`}
                          />
                        </TableCell>
                      </TableRow>
                      {open && (
                        <TableRow
                          className="border-b border-white/5 bg-black/40 hover:bg-black/40"
                        >
                          <TableCell colSpan={5} className="py-4">
                            <div className="space-y-3 px-1">
                              <div>
                                <div className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-1">
                                  What it requires
                                </div>
                                <p className="text-sm text-white/80 leading-relaxed">
                                  {r.summary}
                                </p>
                              </div>
                              {r.nprm2026 && (
                                <div className="rounded-lg border border-orange-500/25 bg-orange-500/[0.04] p-3">
                                  <div className="text-[10px] font-bold uppercase tracking-widest text-orange-300 mb-1 inline-flex items-center gap-1">
                                    <ShieldAlert className="h-3 w-3" /> 2026 NPRM delta
                                  </div>
                                  <p className="text-sm text-orange-100/90 leading-relaxed">
                                    {r.nprm2026}
                                  </p>
                                </div>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </Fragment>
                  )
                })
              )}
            </TableBody>
          </Table>
        </div>

        <p className="mt-4 text-[11px] text-white/30 text-center">
          Scoring weights + cross-check logic are proprietary. Every report in our Tier
          catalog cites back to this table.
        </p>
      </div>

      <style jsx>{`
        .hipaa-rules {
          background: linear-gradient(145deg, rgba(255, 255, 255, 0.02), rgba(0, 0, 0, 0.6));
          border: 1px solid rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(12px);
          box-shadow:
            0 40px 80px -20px rgba(0, 0, 0, 0.75),
            inset 0 1px 0 rgba(255, 255, 255, 0.04);
        }
        .hipaa-rules__topline {
          position: absolute;
          inset: 0 0 auto 0;
          height: 1px;
          background: linear-gradient(
            90deg,
            transparent 0%,
            rgba(239, 68, 68, 0.4) 20%,
            rgba(255, 107, 53, 0.6) 50%,
            rgba(245, 158, 11, 0.4) 80%,
            transparent 100%
          );
        }
      `}</style>
    </div>
  )
}
