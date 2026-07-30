/**
 * Statistics used across rocketopp.com — EVERY ONE CARRIES ITS SOURCE.
 *
 * This file exists because the site's entire positioning (see /compare and
 * /build-a-website-with-ai) rests on being the source AI engines and buyers can
 * trust. Unsourced numbers are the fastest way to lose that. So:
 *
 *   RULE 1 — Every industry stat names its primary source and the period it
 *            covers. If we cannot name a source, the stat does not ship.
 *   RULE 2 — Numbers about RocketOpp/0n must be checkable in the repos, on npm,
 *            or on the live sites. No "trusted by thousands".
 *   RULE 3 — The source is rendered VISIBLY next to the number, not hidden in a
 *            comment. Showing our work is the differentiator; competitors put
 *            big unsourced numbers on a page and hope nobody asks.
 *
 * When updating: re-verify at the primary source, then bump `verified`.
 */

export type Stat = {
  /** The headline figure, e.g. "58.5%" */
  value: string
  /** What it measures — short enough to sit under the number */
  label: string
  /** Who published it. Rendered on the page. */
  source: string
  /** Extra precision shown on hover / in smaller text */
  detail?: string
}

export const STATS_VERIFIED = 'July 2026'

/**
 * THE CORRECTION — the thing almost everyone gets wrong.
 *
 * "Google is dying" is false and easy to disprove, which makes it a bad thing to
 * build an argument on. Google's volume is UP. What collapsed is the CLICK.
 * Leading with the correction is more persuasive than the scare version, because
 * a prospect can verify it in ten seconds and it makes everything after it
 * credible.
 */
export const MYTH_VS_REALITY = {
  myth: 'Google search is dying, so you need AI instead.',
  reality:
    "Google's volume is growing — 16.4 billion searches a day, up from 13.7 billion. Organic traffic to websites is down only 2.5% year over year. Google demand did not collapse. The click did: Google now answers the question on its own page instead of sending anyone to yours.",
  sources: 'Demandsage (May 2026) · Graphite (Jan 2026)',
}

/**
 * The click collapse. This is the case for caring, and it is all third-party
 * research with a named publisher and a date.
 */
export const SEARCH_SHIFT: Stat[] = [
  {
    value: '68.01%',
    label: 'of US Google searches now end without a single click to any website',
    source: 'SparkToro / Similarweb clickstream, Jan–Apr 2026',
    detail: 'Up from 58.5% in 2024. Same searches — fewer exits.',
  },
  {
    value: '−61%',
    label: 'organic click-through when an AI Overview appears above you',
    source: 'Seer Interactive, Sep 2025',
    detail: 'CTR falls 1.76% → 0.61%. Ahrefs separately measured a 34.5% loss for position 1 across 300,000 keywords.',
  },
  {
    value: '48%',
    label: 'of Google queries now show an AI Overview',
    source: 'Advanced Web Ranking / Digital Applied, Mar 2026',
    detail: 'Up 58% year over year. US-only methods put it as high as 60.32%.',
  },
  {
    value: '16.4B',
    label: 'Google searches a day — volume is UP, not down',
    source: 'Demandsage, May 2026',
    detail: 'From 13.7 billion in Jan 2025. The demand is still there; the traffic is not.',
  },
]

/**
 * The arbitrage: enormous AI attention, tiny AI traffic, exceptional quality.
 * This is the part that makes acting NOW cheaper than acting later.
 */
export const AI_GAP: Stat[] = [
  {
    value: '28%',
    label: 'AI prompting is already 28% the size of search worldwide',
    source: 'Graphite, Mar 2026',
    detail: '12% in the US. Search-classified prompts only.',
  },
  {
    value: '1.08%',
    label: 'yet AI sends just 1.08% of all website traffic — against 25% from organic',
    source: 'Conductor, 2026',
    detail: 'The Google-to-ChatGPT referral ratio is roughly 190:1.',
  },
  {
    value: '4.4–23×',
    label: 'the clicks AI does send convert far better than organic',
    source: 'Semrush (4.4×) · Ahrefs (23×) · Similarweb, 2025–26',
    detail: 'Ahrefs: AI visitors were 0.5% of traffic but 12.1% of signups. Similarweb measured 11.4% vs 5.3% on ecommerce.',
  },
  {
    value: '6.8%',
    label: 'ChatGPT now shows links in 6.8% of answers — up from 1.6% a year ago',
    source: 'Similarweb, May 2026',
    detail: 'A 4.25× rise in twelve months. As citation rates climb, that thin pipe widens fast — and it pays out to whoever is already cited.',
  },
]

/**
 * The local half: why a Western PA service business specifically cannot ignore
 * this. Sourced from local-search industry research — attributed less precisely
 * than the SEARCH_SHIFT figures above, and labelled as such rather than dressed
 * up with a false precision.
 */
export const LOCAL_INTENT: Stat[] = [
  {
    value: '~50%',
    label: 'of all Google searches carry local intent',
    source: 'Local search industry research, 2026',
  },
  {
    value: '76%',
    label: 'of people who search locally on a phone contact or visit a business within 24 hours',
    source: 'Google / local search research',
  },
  {
    value: '88%',
    label: 'of "near me" searches happen on a phone',
    source: 'Local search industry research, 2026',
  },
  {
    value: '3s',
    label: "Google's threshold for acceptable mobile load time — the average site takes 8.6s",
    source: 'Google',
  },
]

/**
 * RocketOpp / 0n ecosystem figures. All checkable: npm, the public repos, or by
 * loading the live sites.
 */
export const OUR_NUMBERS: Stat[] = [
  {
    value: '1,640+',
    label: 'AI tools we can wire into a business',
    source: '0nMCP v4.10.0 on npm',
    detail: 'Across 111 services in 22 categories. Public package: npmjs.com/package/0nmcp',
  },
  {
    value: '111',
    label: 'services connected — CRM, Stripe, Google, Slack, Shopify and more',
    source: '0nMCP service catalog',
  },
  {
    value: '8',
    label: 'live products we built and run ourselves',
    source: '0n ecosystem',
    detail: '0nMCP, 0nCore, 0nTask, CRO9, web0n, SXO, VerifiedSXO, Marketplace.',
  },
  {
    value: '2003',
    label: 'the year we started building for the web',
    source: 'RocketOpp LLC',
  },
]

/**
 * Proof we do this to our own sites, not just talk about it. Every one of these
 * is verifiable by loading a URL.
 */
export const SELF_PROOF: Stat[] = [
  {
    value: '104',
    label: 'indexed pages on this site, each with structured data',
    source: 'rocketopp.com/sitemap.xml',
  },
  {
    value: '11',
    label: 'town-level service pages built for local search',
    source: 'rocketopp.com/web-design',
  },
  {
    value: '~900',
    label: 'URLs submitted to search + AI indexes every single day, automatically',
    source: 'Our IndexNow cron, 10 domains',
  },
  {
    value: '658',
    label: 'pages on 0nmcp.com — the same programmatic SEO engine we deploy for clients',
    source: '0nmcp.com/sitemap.xml',
  },
]
