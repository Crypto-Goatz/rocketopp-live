'use client'

import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react'
import { BarChart3, Info, Table2 } from 'lucide-react'

import { CHARTS, CHART_TAKEAWAY, SERIES_COLORS, type ChartDef } from '@/lib/search-data'

/**
 * Interactive AI-search chart.
 *
 * Built to the dataviz procedure:
 *  - FORM: change-over-time → line. Multi-series only where identity matters.
 *  - COLOR: categorical, assigned in FIXED slot order per entity. Validated against
 *    this site's real dark surface (#14181f): all six checks pass, worst adjacent
 *    CVD ΔE 8.4. Toggling a series off never repaints the survivors, because colour
 *    follows the entity and not its rank.
 *  - MARKS: 2px strokes, ≥8px markers, 2px surface ring on markers so overlaps stay
 *    readable, recessive SOLID gridlines (dashing is reserved here for a data
 *    meaning — "no figure published" — so it must not also be chrome).
 *  - LABELS: direct labels wear TEXT tokens, not the series colour; a colored key
 *    stroke beside them carries identity. Only the last measured point is labelled,
 *    never every point.
 *  - INTERACTION: crosshair snaps to the nearest x and one tooltip lists every
 *    visible series. Hit area spans the full plot, not just the marks.
 *  - A11Y: legend always present for ≥2 series; a table view of the same numbers;
 *    keyboard-reachable legend toggles; prefers-reduced-motion skips the draw-in.
 */

type Hover = { i: number; px: number } | null

const PAD = { t: 26, r: 58, b: 38, l: 50 }

export default function SearchChart() {
  const [tab, setTab] = useState(0)
  const [showTable, setShowTable] = useState(false)
  const [hidden, setHidden] = useState<Set<string>>(new Set())
  const [hover, setHover] = useState<Hover>(null)
  const [reduced, setReduced] = useState(false)
  const [drawn, setDrawn] = useState(false)

  const wrapRef = useRef<HTMLDivElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  const uid = useId().replace(/:/g, '')

  const chart: ChartDef = CHARTS[tab]

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduced(mq.matches)
    const on = () => setReduced(mq.matches)
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [])

  // Draw-in triggers once the chart is actually on screen, so the animation is
  // seen rather than happening above the fold before the reader arrives.
  useEffect(() => {
    const node = wrapRef.current
    if (!node) return
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setDrawn(true)
          io.disconnect()
        }
      },
      { threshold: 0.25 },
    )
    io.observe(node)
    return () => io.disconnect()
  }, [])

  // Re-run the draw-in when the reader switches dataset.
  useEffect(() => {
    if (reduced) return
    setDrawn(false)
    const t = setTimeout(() => setDrawn(true), 40)
    return () => clearTimeout(t)
  }, [tab, reduced])

  // Reset series visibility per dataset — a hidden name from one chart must not
  // silently hide a same-named series in another.
  useEffect(() => setHidden(new Set()), [tab])

  const labels = chart.series[0].points.map((p) => p.x)
  const visible = chart.series.filter((s) => !hidden.has(s.name))
  const multi = chart.series.length > 1

  // Viewbox is fixed; SVG scales responsively. 100×h user units keeps the maths
  // simple and the rendering crisp at any width.
  const W = 760
  const H = 320
  const iw = W - PAD.l - PAD.r
  const ih = H - PAD.t - PAD.b
  const [y0, y1] = chart.yDomain

  const X = useCallback(
    (i: number) => (labels.length === 1 ? iw / 2 : (i / (labels.length - 1)) * iw),
    [labels.length, iw],
  )
  const Y = useCallback((v: number) => ih - ((v - y0) / (y1 - y0)) * ih, [ih, y0, y1])

  const toggle = (name: string) => {
    setHidden((prev) => {
      const next = new Set(prev)
      if (next.has(name)) next.delete(name)
      // Never let the reader hide every series — an empty plot is not a state.
      else if (next.size < chart.series.length - 1) next.add(name)
      return next
    })
  }

  function onMove(e: React.PointerEvent<SVGSVGElement>) {
    const svg = svgRef.current
    if (!svg) return
    const r = svg.getBoundingClientRect()
    const px = ((e.clientX - r.left) * (W / r.width)) - PAD.l
    const i = Math.max(0, Math.min(labels.length - 1, Math.round((px / iw) * (labels.length - 1))))
    setHover({ i, px: X(i) })
  }

  const tooltip = useMemo(() => {
    if (!hover) return null
    const rows = visible.map((s) => {
      const p = s.points[hover.i]
      return {
        name: s.name,
        color: SERIES_COLORS[s.slot - 1],
        value: `${p.y.toFixed(chart.dp)}%`,
        flag: p.noData ? 'no data' : p.measured === false ? 'interpolated' : p.note || '',
      }
    })
    return { label: labels[hover.i], rows }
  }, [hover, visible, chart.dp, labels])

  const badge =
    chart.status === 'measured'
      ? { text: 'Measured', cls: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400' }
      : { text: '2 measured anchors + interpolation', cls: 'border-amber-500/40 bg-amber-500/10 text-amber-400' }

  return (
    <div ref={wrapRef} className="rounded-3xl border border-border bg-card p-5 sm:p-7">
      {/* ── Tabs: one row above the chart ── */}
      <div className="flex flex-wrap gap-2" role="tablist" aria-label="Choose a dataset">
        {CHARTS.map((c, i) => (
          <button
            key={c.id}
            role="tab"
            aria-selected={i === tab}
            onClick={() => setTab(i)}
            className={`rounded-lg border px-3.5 py-2 text-sm font-medium transition-colors ${
              i === tab
                ? 'border-primary bg-primary/15 text-primary'
                : 'border-border text-muted-foreground hover:border-primary/40 hover:text-foreground'
            }`}
          >
            {c.tab}
          </button>
        ))}
      </div>

      <div className="mt-6 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-bold tracking-tight sm:text-xl">{chart.title}</h3>
          <span
            className={`mt-2 inline-block rounded border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${badge.cls}`}
          >
            {badge.text}
          </span>
        </div>
        <button
          onClick={() => setShowTable((v) => !v)}
          aria-pressed={showTable}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
        >
          <Table2 className="h-3.5 w-3.5" />
          {showTable ? 'Hide data' : 'Show data'}
        </button>
      </div>

      <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground">{chart.note}</p>

      {/* ── Legend — always present for ≥2 series, so identity is never colour alone ── */}
      {multi && (
        <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2">
          {chart.series.map((s) => {
            const off = hidden.has(s.name)
            return (
              <button
                key={s.name}
                onClick={() => toggle(s.name)}
                aria-pressed={!off}
                className={`inline-flex items-center gap-2 text-sm transition-opacity ${
                  off ? 'opacity-40' : 'opacity-100'
                }`}
              >
                <span
                  aria-hidden
                  className="h-[3px] w-4 rounded-full"
                  style={{ backgroundColor: SERIES_COLORS[s.slot - 1] }}
                />
                <span className="text-muted-foreground">{s.name}</span>
              </button>
            )
          })}
        </div>
      )}

      {/* ── Plot ── */}
      <div className="relative mt-4">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${W} ${H}`}
          className="w-full touch-none"
          role="img"
          aria-label={`${chart.title}. ${chart.note}`}
          onPointerMove={onMove}
          onPointerLeave={() => setHover(null)}
        >
          <g transform={`translate(${PAD.l},${PAD.t})`}>
            {/* Recessive SOLID gridlines. Dashing is reserved for the "no data" meaning. */}
            {chart.yTicks.map((t) => (
              <g key={t}>
                <line x1={0} x2={iw} y1={Y(t)} y2={Y(t)} stroke="currentColor" strokeWidth={1} className="text-border" />
                <text x={-10} y={Y(t) + 4} textAnchor="end" className="fill-muted-foreground font-mono text-[11px]">
                  {t}%
                </text>
              </g>
            ))}

            {labels.map((l, i) => (
              <text
                key={l}
                x={X(i)}
                y={ih + 22}
                textAnchor="middle"
                className="fill-muted-foreground font-mono text-[11px]"
              >
                {l}
              </text>
            ))}

            {/* Crosshair sits under the marks so it never obscures a datapoint. */}
            {hover && (
              <line
                x1={hover.px}
                x2={hover.px}
                y1={0}
                y2={ih}
                stroke="currentColor"
                strokeWidth={1}
                className="text-muted-foreground/50"
              />
            )}

            {visible.map((s) => {
              const color = SERIES_COLORS[s.slot - 1]
              const pts = s.points.map((p, i) => ({ ...p, cx: X(i), cy: Y(p.y) }))
              const firstNoData = pts.findIndex((p) => p.noData)
              const solid = firstNoData === -1 ? pts : pts.slice(0, firstNoData)
              const dashed = firstNoData === -1 ? [] : pts.slice(Math.max(0, firstNoData - 1))
              const d = (arr: typeof pts) =>
                arr.map((p, i) => `${i ? 'L' : 'M'}${p.cx.toFixed(1)} ${p.cy.toFixed(1)}`).join(' ')

              // Last MEASURED point carries the direct label — never the dashed
              // tail, or an interpolation reads as a published figure.
              const lastMeasured = pts.reduce((acc, p, i) => (p.measured ? i : acc), 0)
              const lp = pts[lastMeasured]

              return (
                <g key={s.name}>
                  {solid.length > 1 && (
                    <path
                      d={d(solid)}
                      fill="none"
                      stroke={color}
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      pathLength={1}
                      style={
                        reduced
                          ? undefined
                          : {
                              strokeDasharray: 1,
                              strokeDashoffset: drawn ? 0 : 1,
                              transition: 'stroke-dashoffset 1100ms cubic-bezier(.22,.61,.36,1)',
                            }
                      }
                    />
                  )}
                  {dashed.length > 1 && (
                    <path
                      d={d(dashed)}
                      fill="none"
                      stroke={color}
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      strokeLinecap="round"
                      opacity={0.5}
                      style={reduced ? undefined : { opacity: drawn ? 0.5 : 0, transition: 'opacity 500ms 900ms' }}
                    />
                  )}
                  {pts.map((p, i) => {
                    const isMeasured = p.measured !== false
                    const active = hover?.i === i
                    return (
                      <circle
                        key={p.x}
                        cx={p.cx}
                        cy={p.cy}
                        r={active ? 6 : isMeasured ? 4.5 : 4}
                        fill={isMeasured ? color : 'hsl(var(--card))'}
                        stroke={isMeasured ? 'hsl(var(--card))' : color}
                        strokeWidth={2}
                        style={
                          reduced
                            ? undefined
                            : {
                                opacity: drawn ? 1 : 0,
                                transition: `opacity 300ms ${400 + i * 90}ms, r 120ms`,
                              }
                        }
                      />
                    )
                  })}
                  {/* Direct label: TEXT token + a colored key stroke for identity. */}
                  <g
                    style={
                      reduced ? undefined : { opacity: drawn ? 1 : 0, transition: 'opacity 400ms 1000ms' }
                    }
                  >
                    <line
                      x1={lp.cx + 9}
                      x2={lp.cx + 21}
                      y1={lp.cy - 13}
                      y2={lp.cy - 13}
                      stroke={color}
                      strokeWidth={3}
                      strokeLinecap="round"
                    />
                    <text
                      x={lp.cx + 25}
                      y={lp.cy - 9}
                      className="fill-foreground font-mono text-[11px] font-semibold"
                    >
                      {lp.y.toFixed(chart.dp)}%
                    </text>
                  </g>
                </g>
              )
            })}
          </g>
        </svg>

        {/* Tooltip: values lead, labels follow; series keyed by a stroke not a box. */}
        {tooltip && (
          <div
            className="pointer-events-none absolute top-2 z-10 min-w-[168px] rounded-xl border border-border bg-background/95 p-3 shadow-2xl backdrop-blur"
            style={{
              left: `clamp(0px, ${((hover!.px + PAD.l) / W) * 100}% + 14px, calc(100% - 180px))`,
            }}
          >
            <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              {tooltip.label}
            </p>
            <div className="mt-2 space-y-1.5">
              {tooltip.rows.map((r) => (
                <div key={r.name} className="flex items-baseline justify-between gap-3">
                  <span className="flex items-center gap-2">
                    <span
                      aria-hidden
                      className="h-[3px] w-3 rounded-full"
                      style={{ backgroundColor: r.color }}
                    />
                    <span className="text-xs text-muted-foreground">{r.name}</span>
                  </span>
                  <span className="font-mono text-xs font-semibold tabular-nums">{r.value}</span>
                </div>
              ))}
            </div>
            {tooltip.rows[0]?.flag && (
              <p className="mt-2 border-t border-border pt-1.5 text-[10px] text-muted-foreground/70">
                {tooltip.rows[0].flag}
              </p>
            )}
          </div>
        )}
      </div>

      {/* ── Table view: the same numbers, keyboard reachable ── */}
      {showTable && (
        <div className="mt-5 overflow-x-auto rounded-xl border border-border">
          <table className="w-full text-sm">
            <caption className="sr-only">{chart.title}</caption>
            <thead>
              <tr className="bg-muted/20 text-left text-[10px] uppercase tracking-wider text-muted-foreground">
                <th scope="col" className="px-3 py-2 font-semibold">
                  {multi ? 'Platform' : 'Period'}
                </th>
                {multi ? (
                  labels.map((l) => (
                    <th key={l} scope="col" className="px-3 py-2 text-right font-semibold">
                      {l}
                    </th>
                  ))
                ) : (
                  <>
                    <th scope="col" className="px-3 py-2 text-right font-semibold">Value</th>
                    <th scope="col" className="px-3 py-2 text-right font-semibold">Status</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody>
              {multi
                ? chart.series.map((s) => (
                    <tr key={s.name} className="border-t border-border">
                      <th scope="row" className="px-3 py-2 text-left font-medium">{s.name}</th>
                      {s.points.map((p) => (
                        <td key={p.x} className="px-3 py-2 text-right font-mono tabular-nums text-muted-foreground">
                          {p.y.toFixed(chart.dp)}%
                        </td>
                      ))}
                    </tr>
                  ))
                : chart.series[0].points.map((p) => (
                    <tr key={p.x} className="border-t border-border">
                      <th scope="row" className="px-3 py-2 text-left font-medium">{p.x}</th>
                      <td className="px-3 py-2 text-right font-mono tabular-nums text-muted-foreground">
                        {p.y.toFixed(chart.dp)}%
                      </td>
                      <td className="px-3 py-2 text-right text-xs text-muted-foreground">
                        {p.noData ? 'No data published' : p.measured === false ? 'Interpolated' : p.note || 'Measured'}
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-5 flex flex-wrap items-start gap-2 border-t border-border pt-4">
        <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground/60" />
        <p className="text-[11px] leading-relaxed text-muted-foreground/70">
          Source · {chart.source}. Hollow markers and dashed runs mark interpolation or
          unpublished periods — we do not draw a smooth line through a guess.
        </p>
      </div>

      <div className="mt-5 rounded-2xl border border-primary/30 bg-primary/5 p-5">
        <p className="flex items-start gap-2.5 leading-relaxed">
          <BarChart3 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
          <span>
            <span className="font-bold text-primary">The takeaway: </span>
            {CHART_TAKEAWAY}
          </span>
        </p>
      </div>
    </div>
  )
}
