/**
 * The nine "right now" figures at the top of the AI-search data report.
 *
 * RULE, same as lib/stats.ts: every tile names its publisher and its date, and the
 * source string RENDERS. A big number with no attribution is the house style of
 * every page this report is meant to beat, so attribution is the design device —
 * not a footnote.
 *
 * `delta` is the comparison that makes the number mean something (a baseline, a
 * YoY move, or the two values behind a ratio). It is never a projection.
 */

export type Kpi = {
  value: string
  label: string
  /** The comparison line under the value. */
  delta: string
  /** 'up' | 'down' | 'flat' — direction of the delta, not a judgement of good/bad. */
  dir: 'up' | 'down' | 'flat'
  source: string
}

export const REPORT_KPIS: Kpi[] = [
  {
    value: '68.01%',
    label: 'Google searches ending with no click to any website (US)',
    delta: 'from 58.5% in 2024',
    dir: 'up',
    source: 'SparkToro analysis of Similarweb clickstream, Jan–Apr 2026',
  },
  {
    value: '16.4B',
    label: 'Google searches per day',
    delta: 'from 13.7B (Jan 2025)',
    dir: 'up',
    source: 'Demandsage, May 2026 — volume is up, not down',
  },
  {
    value: '48%',
    label: 'Google queries showing an AI Overview',
    delta: '+58% year over year',
    dir: 'up',
    source: 'Advanced Web Ranking / Digital Applied, Mar 2026. US-only methods: 60.32%',
  },
  {
    value: '−61%',
    label: 'Organic CTR loss when an AI Overview is present',
    delta: '1.76% → 0.61%',
    dir: 'down',
    source: 'Seer Interactive, Sep 2025. Ahrefs: position 1 loses 34.5% across 300k keywords',
  },
  {
    value: '~28%',
    label: 'AI prompting as a share of search volume (worldwide)',
    delta: '12% in the US',
    dir: 'up',
    source: 'Graphite, Mar 2026 — search-classified prompts only',
  },
  {
    value: '1.08%',
    label: 'AI referral traffic as a share of all website traffic',
    delta: 'vs 25% from organic search',
    dir: 'flat',
    source: 'Conductor, 2026. Google-to-ChatGPT referral ratio ≈ 190:1',
  },
  {
    value: 'up to 23×',
    label: 'AI visitor conversion vs organic visitor',
    delta: '0.5% of visitors → 12.1% of signups',
    dir: 'up',
    source: 'Ahrefs, 2025. Semrush: 4.4×; Similarweb: 11.4% vs 5.3% (ecommerce)',
  },
  {
    value: '6.8%',
    label: 'ChatGPT citation rate (links shown in answers)',
    delta: 'from 1.6% (Jun 2025) — 4.25× in one year',
    dir: 'up',
    source: 'Similarweb, May 2026',
  },
  {
    value: '9.5B',
    label: 'Generative-AI monthly web visits (worldwide)',
    delta: '+70% YoY · 655M unique visitors (+57%)',
    dir: 'up',
    source: 'Similarweb, average Jun 2025 – May 2026',
  },
]

/** The five actions the data implies, in priority order. */
export const REPORT_ACTIONS = [
  {
    title: 'Stop optimising for the click. Optimise to be the answer.',
    body:
      'With 68% of searches ending click-free and AI Overviews on 48% of queries, the ranking that matters is being the source the summary cites. FAQ schema, definitional first sentences and comparison tables are built to win exactly that.',
  },
  {
    title: 'The AI traffic gap is an arbitrage, and it closes.',
    body:
      'AI is ~28% the size of search but sends 1.08% of traffic — while converting up to 23× better. ChatGPT’s citation rate went 1.6% → 6.8% in a year. As citation rates climb, that thin pipe widens fast, and it pays out to whoever is already cited. Being early here is cheaper than being early to Google ever was.',
  },
  {
    title: 'Your robots.txt is a real competitive asset.',
    body:
      'Explicitly allowlist the AI crawlers. Most competitors block them by accident. You cannot be cited by an engine that cannot read you — and this is the cheapest advantage on the entire list.',
  },
  {
    title: 'Diversify past ChatGPT.',
    body:
      'ChatGPT fell from 72.5% to 62.6% of AI referrals in four months while Claude went 11.8% → 18.5%. Track citations across all five engines, not one.',
  },
  {
    title: 'None of this is measurable without analytics.',
    body:
      'You cannot see AI referrals you never collected, and AI platforms do not append utm_source. Install analytics before this window closes — the data is not backfillable.',
  },
] as const

/**
 * Methodology, stated plainly. This section is the reason the report is citable:
 * it says out loud what was measured, what was interpolated, and what nobody has
 * published at all.
 */
export const METHODOLOGY = {
  limitation:
    'There is no authoritative public dataset reporting “AI search volume and clicks” against “Google search volume and clicks” on a common monthly basis. The two systems do not share a unit: Google counts queries and outbound clicks; AI platforms count prompts and citations. Any chart claiming a clean monthly head-to-head for Jan–Jun 2026 is modelled, whether or not it says so.',
  approach:
    'So this report does two things instead. It plots the series that were genuinely measured monthly — Google referral share, and the AI platform mix. For everything else it shows the measured anchor points, and marks the interpolation as interpolation.',
  groups: [
    {
      heading: 'Measured monthly series',
      items: [
        'Google referral share, Jan–May 2026 — Cloudflare Radar, REFERER dimension, weekly timeseries rolled up to months. ChatGPT, Gemini and Perplexity fall below Radar’s reporting threshold, so no comparable monthly AI line exists from this source.',
        'AI platform referral mix, Jan–Apr 2026 — Goodie GA4 brand panel, 3-month centred rolling average. May is excluded as a partial month; no June data was published.',
      ],
    },
    {
      heading: 'Anchor points (charted as points, not curves)',
      items: [
        'Zero-click: 50.33% (2019, Jumpshot) · 64.82% (2020, Similarweb) · 58.5% (2024, Datos) · 68.01% (Jan–Apr 2026, SparkToro/Similarweb). Mixed panels — read the trend, not the point-to-point deltas. SparkToro characterises the recent move as a 22.9% decline in click-generating searches.',
        'AI Overview prevalence: 31% (Feb 2025) · 34.5% (Dec 2025) · 48% (Mar 2026), Advanced Web Ranking / Digital Applied. A separate US-only method reports 60.32% for 2026 — a different measurement basis, not a later reading, so it is not plotted on the same line.',
      ],
    },
    {
      heading: 'Where the “right now” tiles come from',
      items: [
        '16.4B searches/day — Demandsage, May 2026 · 13.7B/day baseline — Google, Jan 2025 · −2.5% YoY organic traffic — Graphite, Jan 2026',
        '28% / 12% AI prompt share — Graphite, Mar 2026 · 1.08% AI referral share — Conductor, 2026',
        '−61% CTR (1.76% → 0.61%) — Seer Interactive, Sep 2025 · 34.5% position-1 loss — Ahrefs, 2025 · 19.98% non-branded loss — Amsive, 2025',
        '23× conversion — Ahrefs, 2025 · 4.4× — Semrush, 2025 · 11.4% vs 5.3% — Similarweb, 2026',
        '6.8% citation rate, 9.5B visits, +70% YoY — Similarweb, May 2026',
      ],
    },
    {
      heading: 'Chart construction',
      items: [
        'No dual-axis charts: every series sharing an axis shares a unit.',
        'Solid dots are published readings. Hollow dots are interpolation. Dashed segments mean no figure was published for that period.',
        'Every chart has a table equivalent behind “Show data table”, and the direct label always anchors to the last measured point — never to an interpolated tail.',
      ],
    },
  ],
} as const
