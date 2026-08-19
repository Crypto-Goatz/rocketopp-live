/**
 * "Search didn't shrink. The click did." — the headline, drawn.
 *
 * The argument has two halves and the graphic has to carry both at once, or it
 * just looks like another decline chart:
 *
 *   1. The INFLOW never thins. Queries rain into Google in a dense, unbroken
 *      stream, and the counter climbs 13.7B → 16.4B. Volume is up.
 *   2. The OUTFLOW collapses. An AI Overview slab absorbs about two thirds of
 *      them, and only a thin trickle reaches your site.
 *
 * Same rain at the top, a trickle at the bottom. That gap is the whole pitch.
 *
 * Every figure is a real one from lib/stats.ts — 68.01% zero-click, 48% of
 * queries showing an AI Overview, 16.4B/day up from 13.7B. The particle counts
 * are proportional to those numbers rather than picked to look balanced: 9 fall,
 * 6 are absorbed, 3 escape.
 *
 * Pure SVG + CSS classes from globals.css. No inline styles, and the animation
 * is covered by the site-wide prefers-reduced-motion gate — with reduced motion
 * the particles simply hold position and the diagram still reads.
 */
export function ClickCollapseGraphic() {
  // x positions for the query stream — irregular on purpose, so it reads as
  // traffic rather than a row of dots.
  const FALLING = [
    { x: 34, d: 'q-d1' }, { x: 68, d: 'q-d4' }, { x: 102, d: 'q-d2' },
    { x: 136, d: 'q-d6' }, { x: 170, d: 'q-d3' }, { x: 204, d: 'q-d7' },
    { x: 238, d: 'q-d5' }, { x: 272, d: 'q-d8' }, { x: 306, d: 'q-d2' },
  ]
  // Absorbed into the slab — the ~68% that never leave Google.
  const ABSORBED = [
    { x: 52, d: 'q-d3' }, { x: 100, d: 'q-d6' }, { x: 148, d: 'q-d1' },
    { x: 196, d: 'q-d7' }, { x: 244, d: 'q-d4' }, { x: 292, d: 'q-d8' },
  ]
  // The few that get through.
  const ESCAPED = [
    { x: 136, d: 'q-d2' }, { x: 170, d: 'q-d5' }, { x: 204, d: 'q-d8' },
  ]

  return (
    <div className="relative w-full">
      <svg
        viewBox="0 0 340 400"
        className="h-auto w-full"
        role="img"
        aria-labelledby="ccg-title ccg-desc"
      >
        <title id="ccg-title">
          Search volume is rising while clicks to websites collapse
        </title>
        <desc id="ccg-desc">
          A dense stream of 16.4 billion daily Google searches, up from 13.7
          billion, falls into an AI Overview panel that absorbs about 68% of
          them. Only a thin trickle of clicks continues through to your website.
        </desc>

        <defs>
          <linearGradient id="ccg-slab" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.28" />
            <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.06" />
          </linearGradient>
          <linearGradient id="ccg-fade" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0" />
            <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.5" />
          </linearGradient>
        </defs>

        {/* ── Inflow: the demand, and it is growing ─────────────── */}
        <text
          x="170" y="16"
          textAnchor="middle"
          className="fill-muted-foreground text-[11px] font-medium"
        >
          Searches a day
        </text>
        <text
          x="170" y="42"
          textAnchor="middle"
          className="fill-foreground text-[26px] font-bold"
        >
          16.4B
        </text>
        <text
          x="170" y="58"
          textAnchor="middle"
          className="fill-primary text-[10px] font-semibold"
        >
          ▲ up from 13.7B
        </text>

        {/* The rain. Dense and unbroken — this is the half everyone gets wrong. */}
        <g className="text-primary">
          {FALLING.map((p) => (
            <rect
              key={`f-${p.x}`}
              x={p.x} y={70} width="2.5" height="14" rx="1.25"
              fill="currentColor" fillOpacity="0.55"
              className={`q-fall ${p.d}`}
            />
          ))}
        </g>

        {/* ── The AI Overview slab ──────────────────────────────── */}
        <rect
          x="18" y="176" width="304" height="66" rx="12"
          fill="url(#ccg-slab)"
          stroke="hsl(var(--primary))" strokeOpacity="0.4"
          className="slab-pulse"
        />
        <text
          x="170" y="202"
          textAnchor="middle"
          className="fill-foreground text-[13px] font-bold"
        >
          AI Overview answers it here
        </text>
        <text
          x="170" y="222"
          textAnchor="middle"
          className="fill-primary text-[15px] font-bold"
        >
          68.01%
        </text>
        <text
          x="170" y="235"
          textAnchor="middle"
          className="fill-muted-foreground text-[9px]"
        >
          of searches end without a click
        </text>

        {/* Absorbed — they reach the slab and stop. */}
        <g className="text-primary">
          {ABSORBED.map((p) => (
            <rect
              key={`a-${p.x}`}
              x={p.x} y={96} width="2.5" height="12" rx="1.25"
              fill="currentColor" fillOpacity="0.4"
              className={`q-absorb ${p.d}`}
            />
          ))}
        </g>

        {/* ── The trickle ───────────────────────────────────────── */}
        <g className="text-primary">
          {ESCAPED.map((p) => (
            <rect
              key={`e-${p.x}`}
              x={p.x} y={250} width="2.5" height="12" rx="1.25"
              fill="currentColor" fillOpacity="0.9"
              className={`q-escape ${p.d}`}
            />
          ))}
        </g>

        {/* Narrowing guide rails: wide at the slab, pinched at your site. */}
        <path
          d="M 18 246 L 128 336"
          stroke="url(#ccg-fade)" strokeWidth="1" strokeDasharray="3 4" fill="none"
        />
        <path
          d="M 322 246 L 212 336"
          stroke="url(#ccg-fade)" strokeWidth="1" strokeDasharray="3 4" fill="none"
        />

        {/* ── Your site ─────────────────────────────────────────── */}
        <rect
          x="128" y="336" width="84" height="44" rx="10"
          fill="hsl(var(--card))"
          stroke="hsl(var(--border))"
        />
        <text
          x="170" y="356"
          textAnchor="middle"
          className="fill-foreground text-[11px] font-bold"
        >
          Your site
        </text>
        <text
          x="170" y="370"
          textAnchor="middle"
          className="fill-muted-foreground text-[9px]"
        >
          what&rsquo;s left
        </text>
      </svg>

      <p className="mt-4 text-center text-xs text-muted-foreground/70">
        Same demand at the top. A trickle at the bottom. That gap is the problem.
      </p>
    </div>
  )
}
