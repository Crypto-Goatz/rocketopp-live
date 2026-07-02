/**
 * Service Recommendation Engine — decision tree.
 *
 * Layer 1 (needs): the tag-cloud of common business pains.
 * Layer 2 (issues): the specific symptoms behind each pain (multi-select).
 * Each issue maps to one or more product slugs from lib/store/products.
 *
 * This map is deterministic so the UX never depends on an AI round-trip.
 * The /api/recommend route uses AI to *re-rank + narrate* on top of this
 * union, falling back to the union itself when AI is unavailable.
 */

import { PRODUCTS } from '@/lib/store/products'

/** Discount applied to every product recommended from /recommend. */
export const RECOMMEND_DISCOUNT_PCT = 20

/** Deposit taken to lock in the offer, as a % of the discounted total. */
export const DEPOSIT_PCT = 25

/** Promo code stamped on the CRM contact + Stripe metadata. */
export const RECOMMEND_PROMO_CODE = 'RECOMMEND20'

export interface Issue {
  id: string
  label: string
  /** Product slugs this symptom points to. */
  slugs: string[]
}

export interface Need {
  id: string
  label: string
  /** Relative weight for tag-cloud sizing (1 = small … 5 = large). */
  weight: number
  /** Short supporting line shown under the need once selected. */
  blurb: string
  issues: Issue[]
}

export const NEEDS: Need[] = [
  {
    id: 'leads',
    label: 'Lack of Leads',
    weight: 5,
    blurb: "Let's find out why the pipeline is dry.",
    issues: [
      { id: 'not-converting', label: "Website isn't converting", slugs: ['website-development', 'sxo'] },
      { id: 'phone-quiet', label: "Phone isn't ringing", slugs: ['ppc-management', 'sxo'] },
      { id: 'no-local', label: 'No local presence', slugs: ['sxo', 'website-development'] },
      { id: 'traffic-no-signups', label: 'Traffic but no sign-ups', slugs: ['website-development', 'ai-automation'] },
      { id: 'ads-expensive', label: 'Ads cost too much', slugs: ['ppc-management'] },
      { id: 'not-on-google', label: "Can't be found on Google or AI search", slugs: ['sxo'] },
    ],
  },
  {
    id: 'payments',
    label: 'Trouble Collecting Payment',
    weight: 4,
    blurb: 'Money owed is money you already earned.',
    issues: [
      { id: 'invoices-unpaid', label: 'Invoices go unpaid', slugs: ['crm-automation'] },
      { id: 'no-reminders', label: 'No automated payment reminders', slugs: ['crm-automation', 'ai-automation'] },
      { id: 'manual-billing', label: 'Manual billing chaos', slugs: ['crm-automation'] },
      { id: 'no-online-pay', label: 'No easy online payment option', slugs: ['website-development', 'crm-automation'] },
    ],
  },
  {
    id: 'referrals',
    label: 'Not Enough Referrals',
    weight: 4,
    blurb: 'Happy clients should be sending you more clients.',
    issues: [
      { id: 'no-followup', label: 'No follow-up system', slugs: ['crm-automation'] },
      { id: 'clients-forget', label: 'Clients forget about me', slugs: ['crm-automation', 'ai-automation'] },
      { id: 'no-reviews', label: 'No reviews coming in', slugs: ['sxo', 'crm-automation'] },
      { id: 'no-incentive', label: 'No referral incentive in place', slugs: ['ai-automation', 'crm-automation'] },
    ],
  },
  {
    id: 'busywork',
    label: 'Drowning in Busywork',
    weight: 5,
    blurb: 'Every hour on admin is an hour not selling.',
    issues: [
      { id: 'repeat-questions', label: 'Answering the same questions all day', slugs: ['ai-automation', 'mcp-integration'] },
      { id: 'manual-data', label: 'Manual data entry everywhere', slugs: ['ai-automation', 'mcp-integration'] },
      { id: 'tools-dont-talk', label: "Tools don't talk to each other", slugs: ['mcp-integration', 'ai-automation'] },
      { id: 'no-time-followup', label: 'No time to follow up on leads', slugs: ['crm-automation', 'ai-automation'] },
    ],
  },
  {
    id: 'competitors',
    label: 'Losing to Competitors',
    weight: 3,
    blurb: "Let's find the gap they're exploiting.",
    issues: [
      { id: 'outdated-site', label: 'Outdated website', slugs: ['website-development'] },
      { id: 'slow-response', label: 'Slow to respond to new leads', slugs: ['ai-automation', 'crm-automation'] },
      { id: 'invisible-search', label: "Invisible in Google + AI search", slugs: ['sxo'] },
      { id: 'no-ai', label: 'No AI working in my business', slugs: ['ai-automation', 'mcp-integration'] },
    ],
  },
  {
    id: 'scaling',
    label: "Can't Scale",
    weight: 3,
    blurb: 'Growth is breaking your current setup.',
    issues: [
      { id: 'no-systems', label: 'Everything lives in my head', slugs: ['crm-automation', 'ai-automation'] },
      { id: 'hiring-instead', label: 'Hiring to fix things software could', slugs: ['ai-automation', 'mcp-integration'] },
      { id: 'no-pipeline', label: 'No repeatable sales pipeline', slugs: ['crm-automation'] },
      { id: 'stack-sprawl', label: 'Too many disconnected apps', slugs: ['mcp-integration'] },
    ],
  },
]

/** Flatten the tree to look up an issue by id. */
const ISSUE_INDEX: Record<string, Issue> = Object.fromEntries(
  NEEDS.flatMap((n) => n.issues.map((i) => [i.id, i] as const)),
)

export function getIssue(id: string): Issue | undefined {
  return ISSUE_INDEX[id]
}

export function getNeed(id: string): Need | undefined {
  return NEEDS.find((n) => n.id === id)
}

/**
 * Deterministic recommendation: the ordered union of product slugs behind the
 * selected issues, ranked by how many selected issues point at each product.
 */
export function slugsForIssues(issueIds: string[]): string[] {
  const score = new Map<string, number>()
  for (const id of issueIds) {
    const issue = ISSUE_INDEX[id]
    if (!issue) continue
    issue.slugs.forEach((slug, idx) => {
      // First slug on an issue is its primary fix → weight it heavier.
      const w = idx === 0 ? 2 : 1
      score.set(slug, (score.get(slug) ?? 0) + w)
    })
  }
  return [...score.entries()]
    .filter(([slug]) => PRODUCTS.some((p) => p.slug === slug))
    .sort((a, b) => b[1] - a[1])
    .map(([slug]) => slug)
}
