/**
 * RocketOpp Services Catalog — full pricing matrix.
 *
 * Every service offered across the site has a row here so the /order
 * wizard can build a custom quote, and every /services/* page can pull
 * accurate pricing without copy-paste.
 *
 * Three flavors:
 *   - 'flat'         — one-time build (e.g. website, MCP install)
 *   - 'retainer'     — ongoing monthly (e.g. SXO, PPC mgmt)
 *   - 'tiered'       — pick a tier (Foundation/Growth/Dominate)
 *
 * `scopeOptions` are radio choices that adjust the price (delta in cents).
 * `addOns` are multi-select extras the user can stack on top.
 */

export type ServiceBilling = 'flat' | 'retainer' | 'tiered'
export type ServiceCategory =
  | 'websites'
  | 'ai_systems'
  | 'crm'
  | 'marketing'
  | 'optimization'
  | 'specialized'

export interface ScopeOption {
  id: string
  label: string
  description?: string
  /** Cents added to (or replacing — see `mode`) the base price. */
  delta: number
  /** 'replace' overrides base; 'add' stacks on top. Default: 'add'. */
  mode?: 'add' | 'replace'
  /** For tiered services this becomes the actual price label. */
  priceLabel?: string
}

export interface AddOn {
  id: string
  label: string
  description?: string
  priceCents: number
  /** If true, this is a /mo addon, not one-time. */
  recurring?: boolean
}

export interface CatalogService {
  slug: string
  name: string
  category: ServiceCategory
  shortPitch: string
  billing: ServiceBilling
  basePriceCents: number
  basePriceLabel: string
  /** "/mo" if retainer, "" if flat. */
  basePriceSuffix: string
  /** True if this maps 1:1 to a /store/<slug> product (already direct-buyable). */
  inStore?: boolean
  shipsIn: string
  scopeOptions?: ScopeOption[]
  addOns?: AddOn[]
  /** /services/<path> URL on rocketopp.com so we can deep-link from order wizard. */
  servicePagePath?: string
}

// ────────────────────────────────────────────────────────────────────────────
// Categories — used to group selections in the wizard
// ────────────────────────────────────────────────────────────────────────────

export const CATEGORY_LABELS: Record<ServiceCategory, string> = {
  websites: 'Websites',
  ai_systems: 'AI Systems',
  crm: 'CRM',
  marketing: 'Marketing & Growth',
  optimization: 'Optimization',
  specialized: 'Specialized',
}

export const CATEGORY_ORDER: ServiceCategory[] = [
  'websites',
  'ai_systems',
  'crm',
  'marketing',
  'optimization',
  'specialized',
]

// ────────────────────────────────────────────────────────────────────────────
// Catalog
// ────────────────────────────────────────────────────────────────────────────

export const SERVICES: CatalogService[] = [
  // ── Websites ───────────────────────────────────────────────────────────
  {
    slug: 'website-development',
    name: 'Website Development',
    category: 'websites',
    shortPitch: 'Custom Next.js build, SEO + CRO9 baked in. Live in 2 weeks.',
    billing: 'flat',
    basePriceCents: 249700,
    basePriceLabel: '$2,497',
    basePriceSuffix: '',
    inStore: true,
    shipsIn: '2 weeks',
    servicePagePath: '/services/website-development',
    scopeOptions: [
      { id: 'standard', label: 'Standard (5–7 pages)', delta: 0, priceLabel: '$2,497' },
      { id: 'expanded', label: 'Expanded (8–15 pages)', delta: 150000, priceLabel: '+$1,500' },
      { id: 'ecommerce', label: 'E-commerce (Stripe / Shopify)', delta: 200000, priceLabel: '+$2,000' },
      { id: 'multi-language', label: 'Multi-language', delta: 100000, priceLabel: '+$1,000' },
    ],
    addOns: [
      { id: 'cro9-embed', label: 'CRO9 conversion analytics', priceCents: 0, description: 'Free — included on every site' },
      { id: 'crm-forms', label: 'CRM-wired forms', priceCents: 0, description: 'Free — included' },
      { id: 'hosting-yr', label: 'First year of hosting', priceCents: 30000 },
    ],
  },
  {
    slug: 'website-design',
    name: 'Website Design (mockups only)',
    category: 'websites',
    shortPitch: 'Figma mockups, no dev. Hand off to your team or upgrade later.',
    billing: 'flat',
    basePriceCents: 149700,
    basePriceLabel: '$1,497',
    basePriceSuffix: '',
    shipsIn: '1 week',
    servicePagePath: '/services/website-design',
    scopeOptions: [
      { id: '5pg', label: 'Up to 5 pages', delta: 0 },
      { id: '10pg', label: '6–10 pages', delta: 50000 },
      { id: '15pg', label: '11–15 pages', delta: 100000 },
    ],
  },
  {
    slug: 'website-conversion-optimization',
    name: 'Conversion Optimization (CRO9)',
    category: 'websites',
    shortPitch: '147-metric behavioral analytics + Living DOM A/B testing.',
    billing: 'retainer',
    basePriceCents: 199700,
    basePriceLabel: '$1,997',
    basePriceSuffix: '/mo',
    shipsIn: 'Ongoing',
    servicePagePath: '/services/website-development/conversion-optimization',
  },
  {
    slug: 'website-seo-services',
    name: 'On-site SEO (existing site)',
    category: 'websites',
    shortPitch: 'Technical SEO, schema, page-speed, content gaps. For sites we didn\'t build.',
    billing: 'tiered',
    basePriceCents: 79700,
    basePriceLabel: '$797',
    basePriceSuffix: '/mo',
    shipsIn: 'Ongoing',
    servicePagePath: '/services/website-development/seo-services',
    scopeOptions: [
      { id: 'foundation', label: 'Foundation', priceLabel: '$797/mo', delta: 0, mode: 'replace', description: 'Core SEO hygiene + monthly report' },
      { id: 'growth', label: 'Growth', priceLabel: '$1,497/mo', delta: 149700, mode: 'replace', description: 'Foundation + content + link-building' },
      { id: 'dominate', label: 'Dominate', priceLabel: '$2,997/mo', delta: 299700, mode: 'replace', description: 'Growth + AI-citation engineering + dedicated strategist' },
    ],
  },

  // ── AI Systems ─────────────────────────────────────────────────────────
  {
    slug: 'ai-automation',
    name: 'AI for Business',
    category: 'ai_systems',
    shortPitch: 'AI brain that automates ops end-to-end on 0nMCP.',
    billing: 'flat',
    basePriceCents: 299700,
    basePriceLabel: '$2,997',
    basePriceSuffix: '',
    inStore: true,
    shipsIn: '2 weeks',
    servicePagePath: '/services/ai-automation',
    scopeOptions: [
      { id: 'single-flow', label: 'Single workflow', delta: 0 },
      { id: 'multi-flow', label: '3–5 connected workflows', delta: 200000 },
      { id: 'business-os', label: 'Full business OS (10+ flows)', delta: 500000 },
    ],
    addOns: [
      { id: 'voice-ai', label: 'Voice AI (HeyGen + ElevenLabs)', priceCents: 99700 },
      { id: 'training-set', label: 'Custom training dataset', priceCents: 49700 },
    ],
  },
  {
    slug: 'ai-applications',
    name: 'Custom AI Application',
    category: 'ai_systems',
    shortPitch: 'Standalone AI app — webapp, mobile, or both. Custom UI + brain.',
    billing: 'flat',
    basePriceCents: 499700,
    basePriceLabel: '$4,997',
    basePriceSuffix: '',
    shipsIn: '4 weeks',
    servicePagePath: '/services/ai-applications',
  },
  {
    slug: 'ai-integration',
    name: 'AI Integration (single)',
    category: 'ai_systems',
    shortPitch: 'Drop AI into one existing tool — chat, email, support, etc.',
    billing: 'flat',
    basePriceCents: 199700,
    basePriceLabel: '$1,997',
    basePriceSuffix: '',
    shipsIn: '1 week',
    servicePagePath: '/services/ai-integration',
  },
  {
    slug: 'mcp-integration',
    name: 'MCP Server Integration',
    category: 'ai_systems',
    shortPitch: 'Connect your stack to 1,640+ tools across 109 services via 0nMCP.',
    billing: 'flat',
    basePriceCents: 199700,
    basePriceLabel: '$1,997',
    basePriceSuffix: '',
    inStore: true,
    shipsIn: '1 week',
    servicePagePath: '/services/mcp-integration',
  },
  {
    slug: 'sop-automation',
    name: 'SOP Automation',
    category: 'ai_systems',
    shortPitch: 'Automate one specific business process end-to-end.',
    billing: 'flat',
    basePriceCents: 149700,
    basePriceLabel: '$1,497',
    basePriceSuffix: '',
    shipsIn: '1 week',
    servicePagePath: '/services/sop-automation',
  },
  {
    slug: 'automation',
    name: 'General Automation',
    category: 'ai_systems',
    shortPitch: 'Automate anything that lives in code, an API, or a spreadsheet.',
    billing: 'flat',
    basePriceCents: 99700,
    basePriceLabel: '$997',
    basePriceSuffix: '',
    shipsIn: '1 week',
    servicePagePath: '/services/automation',
  },

  // ── CRM ────────────────────────────────────────────────────────────────
  {
    slug: 'crm-automation',
    name: 'CRM Automation',
    category: 'crm',
    shortPitch: 'Pipelines, sequences, scoring, 0nFlow workflows. CRM that runs itself.',
    billing: 'flat',
    basePriceCents: 149700,
    basePriceLabel: '$1,497',
    basePriceSuffix: '',
    inStore: true,
    shipsIn: '1 week',
    servicePagePath: '/services/crm-automation',
    addOns: [
      { id: 'contact-migration', label: 'Migrate existing contacts (CSV/API)', priceCents: 49700 },
      { id: 'extra-pipeline', label: 'Each additional pipeline', priceCents: 49700 },
    ],
  },
  {
    slug: 'ai-crm',
    name: 'AI CRM (CRM + AI brain)',
    category: 'crm',
    shortPitch: 'Full CRM build + AI brain that runs the funnel for you.',
    billing: 'flat',
    basePriceCents: 249700,
    basePriceLabel: '$2,497',
    basePriceSuffix: '',
    shipsIn: '2 weeks',
    servicePagePath: '/services/ai-crm',
  },

  // ── Marketing & Growth ─────────────────────────────────────────────────
  {
    slug: 'sxo',
    name: 'SXO (Search Experience Optimization)',
    category: 'optimization',
    shortPitch: 'SEO + UX + CRO into one engine. AI-citation aware.',
    billing: 'retainer',
    basePriceCents: 99700,
    basePriceLabel: '$997',
    basePriceSuffix: '/mo',
    inStore: true,
    shipsIn: 'Ongoing',
    servicePagePath: '/services/sxo',
  },
  {
    slug: 'search-optimization',
    name: 'Search Optimization (legacy SEO)',
    category: 'marketing',
    shortPitch: 'Traditional SEO — keyword research, on-page, link building.',
    billing: 'retainer',
    basePriceCents: 79700,
    basePriceLabel: '$797',
    basePriceSuffix: '/mo',
    shipsIn: 'Ongoing',
    servicePagePath: '/services/search-optimization',
  },
  {
    slug: 'ppc-management',
    name: 'PPC & Paid Ads',
    category: 'marketing',
    shortPitch: 'Google + Meta + LinkedIn ads, AI-managed. Real ROI tracking.',
    billing: 'retainer',
    basePriceCents: 79700,
    basePriceLabel: '$797',
    basePriceSuffix: '/mo',
    inStore: true,
    shipsIn: 'Ongoing',
    servicePagePath: '/services/ppc-management',
    scopeOptions: [
      { id: 'one-platform', label: '1 platform (Google OR Meta OR LinkedIn)', delta: 0 },
      { id: 'two-platforms', label: '2 platforms', delta: 50000 },
      { id: 'three-platforms', label: '3 platforms', delta: 90000 },
    ],
  },
  {
    slug: 'web-marketing-content',
    name: 'Content Marketing',
    category: 'marketing',
    shortPitch: 'Blog posts, AI-citation-ready, distributed automatically.',
    billing: 'retainer',
    basePriceCents: 149700,
    basePriceLabel: '$1,497',
    basePriceSuffix: '/mo',
    shipsIn: 'Ongoing',
    servicePagePath: '/services/web-marketing/content-marketing',
    scopeOptions: [
      { id: '4-posts', label: '4 posts/month', delta: 0 },
      { id: '8-posts', label: '8 posts/month + distribution', delta: 150000 },
      { id: '12-posts', label: '12 posts/month + multi-format', delta: 300000 },
    ],
  },
  {
    slug: 'web-marketing-social',
    name: 'Social Media Management',
    category: 'marketing',
    shortPitch: 'Daily posts on 1–3 platforms. AI-generated, human-reviewed.',
    billing: 'retainer',
    basePriceCents: 79700,
    basePriceLabel: '$797',
    basePriceSuffix: '/mo',
    shipsIn: 'Ongoing',
    servicePagePath: '/services/web-marketing/social-media',
    scopeOptions: [
      { id: '1-platform', label: '1 platform', delta: 0 },
      { id: '3-platforms', label: '3 platforms', delta: 70000 },
      { id: '5-platforms', label: '5 platforms', delta: 140000 },
    ],
  },
  {
    slug: 'web-marketing-seo',
    name: 'Web Marketing SEO',
    category: 'marketing',
    shortPitch: 'On-page + technical SEO sprint, then ongoing.',
    billing: 'retainer',
    basePriceCents: 79700,
    basePriceLabel: '$797',
    basePriceSuffix: '/mo',
    shipsIn: 'Ongoing',
    servicePagePath: '/services/web-marketing/seo',
  },
  {
    slug: 'web-marketing-ppc',
    name: 'Web Marketing PPC',
    category: 'marketing',
    shortPitch: 'Single-platform PPC management.',
    billing: 'retainer',
    basePriceCents: 79700,
    basePriceLabel: '$797',
    basePriceSuffix: '/mo',
    shipsIn: 'Ongoing',
    servicePagePath: '/services/web-marketing/ppc',
  },
  {
    slug: 'online-marketing',
    name: 'Online Marketing (full bundle)',
    category: 'marketing',
    shortPitch: 'SEO + PPC + Content + Social rolled into one retainer.',
    billing: 'retainer',
    basePriceCents: 299700,
    basePriceLabel: '$2,997',
    basePriceSuffix: '/mo',
    shipsIn: 'Ongoing',
    servicePagePath: '/services/online-marketing',
  },

  // ── Specialized ────────────────────────────────────────────────────────
  {
    slug: 'app-development',
    name: 'Mobile / Web App Development',
    category: 'specialized',
    shortPitch: 'iOS, Android, or web app. Custom build, your spec.',
    billing: 'flat',
    basePriceCents: 499700,
    basePriceLabel: '$4,997',
    basePriceSuffix: '',
    shipsIn: '4–6 weeks',
    servicePagePath: '/services/app-development',
    scopeOptions: [
      { id: 'web-only', label: 'Web app only', delta: 0 },
      { id: 'mobile-only', label: 'Mobile (iOS or Android)', delta: 100000 },
      { id: 'cross-platform', label: 'Web + iOS + Android', delta: 300000 },
    ],
  },
]

// ────────────────────────────────────────────────────────────────────────────
// Helpers
// ────────────────────────────────────────────────────────────────────────────

export function getService(slug: string): CatalogService | undefined {
  return SERVICES.find((s) => s.slug === slug)
}

export function servicesByCategory(category: ServiceCategory): CatalogService[] {
  return SERVICES.filter((s) => s.category === category)
}

export function formatUsd(cents: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(cents / 100)
}
