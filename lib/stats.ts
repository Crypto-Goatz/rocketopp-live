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
 * The problem: search stopped sending clicks. This is the case for caring about
 * AI search at all, and it is all third-party data.
 */
export const SEARCH_SHIFT: Stat[] = [
  {
    value: '58.5%',
    label: 'of US Google searches end without a single click',
    source: 'Semrush zero-click study',
    detail: 'US desktop + mobile. The EU figure is 59.7%.',
  },
  {
    value: '58%',
    label: 'drop in click-through for the #1 organic result when an AI Overview appears',
    source: 'Ahrefs',
    detail: 'Study of 300,000 keywords, updated December 2025.',
  },
  {
    value: '93%',
    label: 'of searches in Google AI Mode end without a click',
    source: 'Semrush',
    detail: 'Google AI Mode — the conversational search experience.',
  },
  {
    value: '~48%',
    label: 'of tracked queries now trigger an AI Overview',
    source: 'Industry SERP tracking',
    detail: 'Share of monitored keywords showing an AI Overview.',
  },
]

/**
 * The local half: why a Western PA service business specifically cannot ignore
 * this.
 */
export const LOCAL_INTENT: Stat[] = [
  {
    value: '~50%',
    label: 'of all Google searches carry local intent',
    source: 'Local search industry data',
  },
  {
    value: '76%',
    label: 'of people who search locally on a phone contact or visit a business within 24 hours',
    source: 'Google / local search research',
  },
  {
    value: '88%',
    label: 'of "near me" searches happen on a phone',
    source: 'Local search industry data',
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
