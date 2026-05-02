/**
 * RocketOpp Store — single source of truth for sellable products.
 *
 * Each product maps 1:1 to a service page (so /services/<slug> still does
 * its lead-capture job for high-intent visitors), AND has a /store/<slug>
 * landing page with a real "Add to cart → checkout" flow.
 *
 * Prices are stored in cents and shipped inline to Stripe via `price_data`
 * (no Stripe Price IDs to maintain — Mike can change pricing here and it
 * just rolls).
 */

import {
  Globe,
  Cpu,
  Search,
  Target,
  BarChart3,
  Terminal,
  type LucideIcon,
} from 'lucide-react'

export type BillingMode = 'one_time' | 'subscription'

export interface Product {
  /** URL slug — /store/<slug> + /services/<slug>. */
  slug: string
  /** Display name. */
  name: string
  /** Short pitch (one-liner for cards). */
  tagline: string
  /** Long-form description for the landing page. */
  description: string
  /** Bullet list of what's included. */
  features: string[]
  /** Bullet list of outcomes. */
  outcomes: string[]
  /** FAQ. */
  faqs: { q: string; a: string }[]
  /** Cents. */
  priceCents: number
  /** Display price. */
  priceLabel: string
  /** 'one_time' | 'subscription'. */
  billing: BillingMode
  /** Stripe interval if subscription. */
  interval?: 'month' | 'year'
  /** "2 weeks", "1 week", "Ongoing". */
  shipsIn: string
  /** Lucide icon. */
  icon: LucideIcon
  /** Brand accent for hero. */
  accent: 'orange' | 'cyan' | 'green' | 'violet' | 'amber'
  /** Slugs of related products to suggest at the bottom of the page. */
  related: string[]
  /** Tag added to the CRM contact on purchase. */
  crmTag: string
}

export const PRODUCTS: Product[] = [
  {
    slug: 'website-development',
    name: 'Website Development',
    tagline: 'Custom AI-powered websites. Mobile-first. Live in 2 weeks.',
    description:
      'A modern, conversion-focused website built on Next.js with AI-driven content, SEO baked in, and CRO9 analytics on every page. We handle copy, design, build, and launch — you get a site that ranks, converts, and integrates with your CRM from day one.',
    features: [
      'Custom Next.js + Tailwind build (no templates)',
      'Mobile-first responsive design',
      'SEO + schema markup + sitemap',
      'CRO9 conversion analytics embedded',
      'CRM lead-capture integration',
      'Hosting on Vercel (we set it up)',
      'Live in 14 days or your money back',
    ],
    outcomes: [
      'Average 3x increase in organic traffic in 90 days',
      'Page-load scores ≥95 on Lighthouse',
      'Direct CRM contact creation on every form',
    ],
    faqs: [
      {
        q: 'What if I already have a domain?',
        a: 'We point your existing domain at the new site and migrate redirects so SEO equity transfers cleanly.',
      },
      {
        q: 'Do I own the code?',
        a: 'Yes — full repo handover on completion. No lock-in, no licenses.',
      },
      {
        q: 'How many revisions are included?',
        a: 'Unlimited within the 2-week build window. After launch, change requests are billed separately or covered by an SXO retainer.',
      },
    ],
    priceCents: 249700,
    priceLabel: '$2,497',
    billing: 'one_time',
    shipsIn: '2 weeks',
    icon: Globe,
    accent: 'orange',
    related: ['ai-automation', 'sxo', 'crm-automation'],
    crmTag: 'product-website-development',
  },
  {
    slug: 'ai-automation',
    name: 'AI for Business',
    tagline: 'AI systems that automate your operations end-to-end.',
    description:
      'A custom AI brain wired into your business — handles customer service, lead qualification, content creation, and ops automation. Built on 0nMCP (1,640+ tools, 109 services) so it can actually do the work, not just chat about it.',
    features: [
      'Custom 0nMCP brain trained on your business',
      'Connected to 109+ services (CRM, Stripe, Slack, etc.)',
      'Multi-AI council: Groq + Anthropic + OpenAI',
      '24/7 lead qualification & routing',
      'Auto-generated proposals + quotes',
      '0nFlow scheduled workflows for follow-ups',
      'Slack + email + SMS interfaces',
    ],
    outcomes: [
      '20+ hours/week reclaimed from manual ops',
      '4x faster lead response (sub-60s)',
      'Direct integration with every tool you already pay for',
    ],
    faqs: [
      {
        q: 'Will this replace my staff?',
        a: 'No — it augments them. Frontline humans handle relationships; the AI handles the volume + admin.',
      },
      {
        q: 'How is this different from ChatGPT?',
        a: 'ChatGPT chats. 0nMCP executes — it has direct API access to your tools and runs real workflows over time.',
      },
      {
        q: 'What happens to my data?',
        a: 'Your data stays in your accounts. We connect via OAuth/PIT tokens; nothing is stored on our servers.',
      },
    ],
    priceCents: 299700,
    priceLabel: '$2,997',
    billing: 'one_time',
    shipsIn: '2 weeks',
    icon: Cpu,
    accent: 'cyan',
    related: ['mcp-integration', 'crm-automation', 'website-development'],
    crmTag: 'product-ai-automation',
  },
  {
    slug: 'sxo',
    name: 'SXO (Search Experience Optimization)',
    tagline: 'SEO is dead. SXO combines search + UX + CRO into one engine.',
    description:
      'Monthly retainer that runs the full SXO playbook on your site — Living DOM mutation, AI-citation audits, Brave/DDG fact-checking, BLUF content rewrites, schema markup, llms.txt protocol, and CRO9 conversion analytics. Built to make you cited by ChatGPT, Claude, and Perplexity — not just ranked on Google.',
    features: [
      'Monthly site-wide SXO scan + score',
      'Living DOM mutation engine (variants A/B/C)',
      'AI-citation audit (GPTBot, ChatGPT, Claude, Perplexity)',
      'Schema + JSON-LD on every page',
      'llms.txt protocol file',
      'CRO9 behavioral analytics (147 metrics)',
      'Quarterly content + technical roadmap',
    ],
    outcomes: [
      'Cited by AI search engines for your target keywords',
      'CRO9 picks the highest-converting variant automatically',
      'Steady score climb published in your dashboard',
    ],
    faqs: [
      {
        q: 'Is this in addition to traditional SEO?',
        a: 'It replaces it. Traditional SEO is 2 of 6 SXO pillars; the other 4 are what makes you survive AI search.',
      },
      {
        q: 'Can I cancel?',
        a: 'Anytime — month-to-month, no contract.',
      },
      {
        q: 'How fast do I see results?',
        a: 'First Living DOM variants ship in week 1. SXO score starts climbing within 30 days.',
      },
    ],
    priceCents: 99700,
    priceLabel: '$997',
    billing: 'subscription',
    interval: 'month',
    shipsIn: 'Ongoing',
    icon: Search,
    accent: 'green',
    related: ['ppc-management', 'website-development', 'ai-automation'],
    crmTag: 'product-sxo',
  },
  {
    slug: 'crm-automation',
    name: 'CRM Automation',
    tagline: 'Full CRM setup with pipelines, sequences, and lead scoring.',
    description:
      'Complete CRM build-out: pipelines, automated email sequences, appointment booking, SMS follow-ups, lead scoring, tag-based routing, and 0nFlow time-delayed workflows. We migrate your existing contacts in if you have any.',
    features: [
      'Custom pipeline + stage automation',
      'Email + SMS nurture sequences',
      'Calendar + appointment booking flows',
      'Lead scoring (0-100) with tag routing',
      '0nFlow scheduled multi-step workflows',
      'Stripe payment automation',
      'Slack notifications for hot leads',
    ],
    outcomes: [
      'Zero leads dropped — every contact gets a sequence',
      'Hot leads escalated to Slack within 60s',
      'Time-delayed nurture runs while you sleep',
    ],
    faqs: [
      {
        q: 'Which CRM does this work with?',
        a: 'LeadConnector / agency-grade CRMs (the same engine that powers RocketOpp internally).',
      },
      {
        q: 'Do you migrate my contacts?',
        a: 'Yes — CSV or API migration included.',
      },
      {
        q: 'What about ongoing changes?',
        a: 'You own the pipelines. Optional retainer adds monthly reviews + new sequences.',
      },
    ],
    priceCents: 149700,
    priceLabel: '$1,497',
    billing: 'one_time',
    shipsIn: '1 week',
    icon: Target,
    accent: 'violet',
    related: ['ai-automation', 'sxo', 'mcp-integration'],
    crmTag: 'product-crm-automation',
  },
  {
    slug: 'ppc-management',
    name: 'PPC & Paid Ads',
    tagline: 'Google · Meta · LinkedIn ads, AI-managed, CRO9-optimized.',
    description:
      'Full PPC management across Google, Meta, and LinkedIn. AI-driven bid management, CRO9 landing-page optimization, and weekly ROI reports. We focus on real revenue, not vanity metrics.',
    features: [
      'Google + Meta + LinkedIn ad ops',
      'AI bid management + budget allocation',
      'CRO9 landing-page testing per campaign',
      'Conversion tracking via GA4 + Meta Pixel',
      'Weekly ROI reports',
      'Creative refresh every 2 weeks',
      'Audience research + segmentation',
    ],
    outcomes: [
      'CAC tracked + driven down month over month',
      'Best-performing creative identified by AI',
      'Real revenue attribution (not last-click)',
    ],
    faqs: [
      {
        q: 'Is the ad spend included?',
        a: 'No — ad spend is paid directly to the platforms. The $797/mo is management.',
      },
      {
        q: 'Minimum ad spend?',
        a: '$2,000/mo recommended for meaningful data. No hard minimum.',
      },
      {
        q: 'Which platforms first?',
        a: 'We start where your audience is. Most B2B starts LinkedIn + Google; B2C starts Meta.',
      },
    ],
    priceCents: 79700,
    priceLabel: '$797',
    billing: 'subscription',
    interval: 'month',
    shipsIn: 'Ongoing',
    icon: BarChart3,
    accent: 'amber',
    related: ['sxo', 'website-development', 'ai-automation'],
    crmTag: 'product-ppc',
  },
  {
    slug: 'mcp-integration',
    name: 'MCP Server Integration',
    tagline: 'Connect your business to 1,640+ tools across 109 services.',
    description:
      '0nMCP is the universal AI orchestrator — one server, every API. We integrate it into your existing stack so any AI (Claude, ChatGPT, Cursor, Windsurf) can run real workflows against your real services.',
    features: [
      '0nMCP install + configuration',
      'Auth setup for 109+ services',
      'Custom workflow templates',
      'Claude Desktop / Cursor / Windsurf wiring',
      'OAuth flow for marketplace apps',
      'Vault container setup (encrypted secrets)',
      '0nFlow integration for time-delayed runs',
    ],
    outcomes: [
      'AI agents can actually do work, not just chat',
      'Single source of truth for all integrations',
      'Future-proof: every new service adds itself to the catalog',
    ],
    faqs: [
      {
        q: 'Do I need to know what MCP is?',
        a: "No. We handle the technical setup; you describe what you want done in plain English and the AI runs it.",
      },
      {
        q: 'What if a service I use isn\'t in the 109?',
        a: 'We add it. The catalog is open and Mike maintains it directly.',
      },
      {
        q: 'Is this hosted or self-hosted?',
        a: "Both. Default is hosted at 0nmcp.com; self-hosted (npm install -g 0nmcp) is supported.",
      },
    ],
    priceCents: 199700,
    priceLabel: '$1,997',
    billing: 'one_time',
    shipsIn: '1 week',
    icon: Terminal,
    accent: 'cyan',
    related: ['ai-automation', 'crm-automation', 'sxo'],
    crmTag: 'product-mcp-integration',
  },
]

export function getProduct(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug)
}

export function getProducts(): Product[] {
  return PRODUCTS
}
