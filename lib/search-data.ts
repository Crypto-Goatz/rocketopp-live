/**
 * The AI-search dataset behind the interactive chart on /497-website.
 *
 * Every series is traceable to a named publisher and date — see `source` on each.
 * Nothing here is modelled by us. Where a monthly series was never published, the
 * points are flagged `measured: false` and the chart draws them as a dashed run
 * with hollow markers, because drawing a smooth line through an interpolation and
 * calling it data is the single most common way these charts lie.
 *
 * PALETTE: validated with the dataviz validator against rocketopp's real dark
 * chart surface (#14181f), categorical mode:
 *   lightness band PASS · chroma floor PASS · CVD separation PASS (worst adjacent
 *   ΔE 8.4 protan, 8.7 tritan) · normal-vision floor PASS (19.3) · contrast PASS
 *   (all ≥ 3:1).
 * Assign these in FIXED slot order. Never cycle, never reorder by rank — colour
 * follows the entity, so filtering a series out must not repaint the survivors.
 */

export const SERIES_COLORS = [
  '#3987e5', // slot 1 — blue
  '#d95926', // slot 2 — orange
  '#199e70', // slot 3 — green
  '#c98500', // slot 4 — amber
  '#d55181', // slot 5 — pink
] as const

export type Point = {
  x: string
  y: number
  /** false = interpolated or unpublished. Drives hollow markers + dashed run. */
  measured?: boolean
  /** true = no figure was published for this period at all. */
  noData?: boolean
  /** Per-point attribution, shown in the tooltip. */
  note?: string
}

export type Series = {
  name: string
  /** Index into SERIES_COLORS. Fixed per entity. */
  slot: number
  points: Point[]
}

export type ChartDef = {
  id: string
  /** Tab label */
  tab: string
  title: string
  /** What the reader should take away — sits under the title. */
  note: string
  /** 'measured' | 'partial' — drives the honesty badge. */
  status: 'measured' | 'partial'
  yDomain: [number, number]
  yTicks: number[]
  /** Decimal places for values. */
  dp: number
  series: Series[]
  source: string
}

export const CHARTS: ChartDef[] = [
  {
    id: 'zero-click',
    tab: 'The click collapse',
    title: 'Share of Google searches that end without a click',
    note:
      'This is the "Google decline" everyone describes — and it is a CLICK decline, not a volume decline. Note the methodology break: the 2019–2020 readings come from different clickstream panels than 2024–2026, so read the trend, not the point-to-point deltas.',
    status: 'measured',
    yDomain: [45, 72],
    yTicks: [45, 50, 55, 60, 65, 70],
    dp: 2,
    source: 'Jumpshot · Similarweb · Datos · SparkToro/Similarweb',
    series: [
      {
        name: 'No-click share',
        slot: 1,
        points: [
          { x: '2019', y: 50.33, measured: true, note: 'Jumpshot' },
          { x: '2020', y: 64.82, measured: true, note: 'Similarweb' },
          { x: '2024', y: 58.5, measured: true, note: 'Datos' },
          { x: 'H1 2026', y: 68.01, measured: true, note: 'SparkToro / Similarweb' },
        ],
      },
    ],
  },
  {
    id: 'ai-overviews',
    tab: 'AI Overviews',
    title: 'Google queries showing an AI Overview',
    note:
      'This is the mechanism behind the click loss. Only Dec 2025 (34.5%) and Mar 2026 (48%) were ever published — those are the solid dots. The line between them is straight-line interpolation, and after March the dashed run means NO DATA PUBLISHED, not "it plateaued". Anyone showing you a smooth monthly curve here is drawing, not measuring.',
    status: 'partial',
    yDomain: [30, 55],
    yTicks: [30, 35, 40, 45, 50, 55],
    dp: 1,
    source: 'Advanced Web Ranking / Digital Applied',
    series: [
      {
        name: 'AI Overview prevalence',
        slot: 2,
        points: [
          { x: 'Dec 25', y: 34.5, measured: true, note: 'Published' },
          { x: 'Jan 26', y: 39.0, measured: false, note: 'Interpolated' },
          { x: 'Feb 26', y: 43.5, measured: false, note: 'Interpolated' },
          { x: 'Mar 26', y: 48.0, measured: true, note: 'Published' },
          { x: 'Apr 26', y: 48.0, measured: false, noData: true, note: 'No data published' },
          { x: 'May 26', y: 48.0, measured: false, noData: true, note: 'No data published' },
          { x: 'Jun 26', y: 48.0, measured: false, noData: true, note: 'No data published' },
        ],
      },
    ],
  },
  {
    id: 'google-referrals',
    tab: 'The twist',
    title: "Google's share of all referral traffic to websites",
    note:
      "Google's share of the clicks that DO happen went UP 8 points in five months. Both things are true at once: Google sends a smaller slice of its own searches onward, yet still dominates referrals — because AI platforms send so little traffic they cannot take share. AI is winning attention. It has not won distribution.",
    status: 'measured',
    yDomain: [76, 92],
    yTicks: [76, 80, 84, 88, 92],
    dp: 2,
    source: 'Cloudflare Radar, REFERER dimension, weekly rolled to months',
    series: [
      {
        name: 'Google referral share',
        slot: 3,
        points: [
          { x: 'Jan 26', y: 80.21, measured: true },
          { x: 'Feb 26', y: 81.14, measured: true },
          { x: 'Mar 26', y: 86.69, measured: true },
          { x: 'Apr 26', y: 86.96, measured: true },
          { x: 'May 26', y: 88.31, measured: true },
        ],
      },
    ],
  },
  {
    id: 'ai-mix',
    tab: 'Which AI',
    title: 'Share of AI referral traffic by platform',
    note:
      '"Optimise for AI search" is not one target. ChatGPT lost ~10 points of AI referral share in four months while Claude gained ~7. If your strategy is ChatGPT-shaped, it is already dated — which is why we build for citation-worthy structure rather than one engine\'s quirks.',
    status: 'measured',
    yDomain: [0, 80],
    yTicks: [0, 20, 40, 60, 80],
    dp: 1,
    source: 'Goodie GA4 brand panel, 3-month centred rolling average',
    series: [
      { name: 'ChatGPT', slot: 1, points: [72.5, 73.5, 64.5, 62.6].map((y, i) => ({ x: ['Jan 26', 'Feb 26', 'Mar 26', 'Apr 26'][i], y, measured: true })) },
      { name: 'Claude', slot: 2, points: [11.8, 10.8, 16.8, 18.5].map((y, i) => ({ x: ['Jan 26', 'Feb 26', 'Mar 26', 'Apr 26'][i], y, measured: true })) },
      { name: 'Gemini', slot: 3, points: [7.9, 9.4, 10.8, 10.6].map((y, i) => ({ x: ['Jan 26', 'Feb 26', 'Mar 26', 'Apr 26'][i], y, measured: true })) },
      { name: 'Perplexity', slot: 4, points: [8.5, 6.9, 6.7, 7.3].map((y, i) => ({ x: ['Jan 26', 'Feb 26', 'Mar 26', 'Apr 26'][i], y, measured: true })) },
      { name: 'Copilot', slot: 5, points: [4.2, 4.3, 4.5, 4.0].map((y, i) => ({ x: ['Jan 26', 'Feb 26', 'Mar 26', 'Apr 26'][i], y, measured: true })) },
    ],
  },
]

/** The one thing to remember, stated once. */
export const CHART_TAKEAWAY =
  'Two thirds of searches now end without a click, and nearly half show an AI summary. The ranking that matters is being the source that summary cites.'
