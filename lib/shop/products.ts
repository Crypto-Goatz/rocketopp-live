/**
 * RocketOpp Shop — single source of truth for the catalog.
 *
 * Each product feeds the grid at /shop and a detail page at /shop/[slug].
 * "Buy Now" routes to /onboarding/[slug] where the AI builder onboarding
 * flow takes over and locks in the listed price.
 *
 * Pricing rule: the price shown here IS the price the buyer pays if they
 * complete onboarding. The onboarding flow can offer DOWNWARD adjustments
 * for upfront content/info, never upward.
 */

import type { LucideIcon } from 'lucide-react'
import {
  Bot, Sparkles, Globe, Search, Megaphone, BarChart3, Code2,
  ShieldCheck, Lightbulb, Package, Workflow, Target, Lock, Rocket,
} from 'lucide-react'

export type ProductCategory =
  | 'assessment'
  | 'compliance'
  | 'web'
  | 'marketing'
  | 'ai'
  | 'saas'

export interface ShopProduct {
  slug: string
  category: ProductCategory
  name: string
  tagline: string                  // 1-line teaser used on the grid card
  blurb: string                    // 2-3 sentences for the detail hero
  priceCents: number               // 0 = free
  priceLabel: string               // "$897" / "Free" / "From $4,997"
  delivery: string                 // "1 week" / "Instant" / "5-min report"
  recurring?: 'month'              // present if subscription
  icon: LucideIcon
  gradient: string                 // tailwind gradient classes
  imageUrl?: string                // Gamma-generated hero image (1920x1088)
  stripePriceId?: string           // Stripe price ID — present when product is checkout-ready
  badge?: 'Best seller' | 'New' | 'Free' | 'Recurring'
  features: string[]
  faqs: Array<{ q: string; a: string }>
  ctaLabel: string
  /** Optional Gamma deck URL for the "View pitch deck" link on detail pages. */
  gammaUrl?: string
}

export const PRODUCTS: ShopProduct[] = [
  // -------------------- Assessment (lead magnet) --------------------
  {
    slug: 'apex-assessment',
    category: 'assessment',
    name: 'Apex AI Assessment',
    tagline: '5-minute conversational business audit. Free.',
    blurb: 'A free, 5-minute AI assessment that screenshots your site, scans local competitors, and emails you a strategic blueprint. The starting point for everything else here.',
    priceCents: 0,
    priceLabel: 'Free',
    delivery: '5-minute live report',
    icon: Lightbulb,
    gradient: 'from-amber-500 to-orange-600',
    imageUrl: 'https://cdn.gamma.app/zhtpwppn6k9cid3/generated-images/ypRIkLeGeXOTHon-jBg9S.png',
    badge: 'Free',
    features: [
      'Real screenshot + AI vision analysis',
      'Local competitor lookup (Google Places)',
      '6-8 personalized strategy questions',
      'PDF blueprint emailed in real time',
      'Routes into a complimentary RocketOpp call',
    ],
    faqs: [
      { q: 'Do I need an account?', a: 'No. Email is collected at the end so we can send you the PDF.' },
      { q: 'Will I be sold to?', a: 'A strategist follows up to schedule a free 30-min review of your blueprint. No spam.' },
    ],
    ctaLabel: 'Start the free assessment',
  },

  // -------------------- HIPAA Compliance --------------------
  {
    slug: 'hipaa-cited-issues',
    category: 'compliance',
    name: 'HIPAA · Cited Issues',
    tagline: 'AI-written 51-point HIPAA audit, 15-min delivery.',
    blurb: 'Tier 1 of the HIPAA scanner. Every finding cited to 45 CFR §164 with plain-English explanations. Defensible in any OCR audit binder.',
    priceCents: 14_900,
    priceLabel: '$149',
    delivery: '15 minutes',
    icon: ShieldCheck,
    gradient: 'from-sky-500 to-blue-600',
    imageUrl: 'https://cdn.gamma.app/zhtpwppn6k9cid3/generated-images/W2JldZLPuvEBKyGbwKYAp.png',
    stripePriceId: 'price_1TOSjPHThmAuKVQMHOjWI74H',
    features: [
      '51-point automated scan, 5 categories',
      'Every finding cited to 45 CFR §164',
      'Plain-English explanations + auditor lens',
      'Prioritized remediation list',
      'Printable HTML report + attestation checklist',
    ],
    faqs: [
      { q: 'Is the scan safe to run on production?', a: 'Yes — passive HTTP only. No logins, no form submissions, no ePHI accessed.' },
      { q: 'Can I rescan?', a: 'Free unlimited rescans for 12 months.' },
    ],
    ctaLabel: 'Lock in $149 — start now',
  },
  {
    slug: 'hipaa-developer-fix-kit',
    category: 'compliance',
    name: 'HIPAA · Developer Fix Kit',
    tagline: 'Tier 1 + pasteable code fixes per finding.',
    blurb: 'Everything in Cited Issues plus stack-detected developer remediation steps with real code fences and verification commands. Ship the fixes, not just the findings.',
    priceCents: 39_900,
    priceLabel: '$399',
    delivery: '15 minutes',
    icon: Code2,
    gradient: 'from-violet-500 to-purple-600',
    imageUrl: 'https://cdn.gamma.app/zhtpwppn6k9cid3/generated-images/qoALSHsv4uUrHY98RStO5.png',
    stripePriceId: 'price_1TPxYVHThmAuKVQMmPLvRoPE',
    features: [
      'Everything in Cited Issues',
      'Stack-detected dev steps (Next.js, Apache, IIS, Cloudflare, WP)',
      'Pasteable code fences per finding',
      'Verification commands (curl / openssl / grep)',
      'Estimated minutes per fix',
    ],
    faqs: [
      { q: 'What stacks are supported?', a: 'Next.js, React, Nuxt, Vue, Angular, Django, Rails, Laravel, Apache, Nginx, IIS, Cloudflare, AWS, Vercel, Netlify, WordPress, Drupal.' },
    ],
    ctaLabel: 'Lock in $399 — start now',
  },
  {
    slug: 'hipaa-nprm-overview',
    category: 'compliance',
    name: 'HIPAA · NPRM Overview',
    tagline: '2026 NPRM overlay per finding. Side-by-side rule analysis.',
    blurb: 'Tier 1 plus the 2026 NPRM overlay — current rule vs proposed rule per finding, with business-impact guidance ahead of the Q1 2027 enforcement window.',
    priceCents: 49_900,
    priceLabel: '$499',
    delivery: '15 minutes',
    icon: BarChart3,
    gradient: 'from-fuchsia-500 to-purple-600',
    imageUrl: 'https://cdn.gamma.app/zhtpwppn6k9cid3/generated-images/IDWA4ImfYs12eyzWje_rg.png',
    stripePriceId: 'price_1TPxYXHThmAuKVQMu8dkBkA2',
    features: [
      'Everything in Cited Issues',
      '2026 NPRM side-by-side analysis',
      'MFA / encryption-at-rest / pen-test mandates',
      'Business-impact + budget guidance',
    ],
    faqs: [
      { q: 'When does the NPRM hit?', a: 'Expected to finalize in 2026 with a Q1 2027 compliance window. Budget for it now.' },
    ],
    ctaLabel: 'Lock in $499 — start now',
  },
  {
    slug: 'hipaa-full-compliance',
    category: 'compliance',
    name: 'HIPAA · Full Compliance',
    tagline: 'Everything + 30-min compliance engineer call.',
    blurb: 'The whole stack — Cited Issues + Developer Fix Kit + 2026 NPRM overlay + attestation checklist + a 30-minute working session with a compliance engineer.',
    priceCents: 89_900,
    priceLabel: '$899',
    delivery: '15-min report · 60-day call window',
    icon: ShieldCheck,
    gradient: 'from-emerald-500 to-cyan-500',
    imageUrl: 'https://cdn.gamma.app/zhtpwppn6k9cid3/generated-images/fEHNF9J9pzh6jUytQmZ87.png',
    stripePriceId: 'price_1TPxYYHThmAuKVQMu9am8IRG',
    badge: 'Best seller',
    features: [
      'Cited Issues + Developer Fix Kit + NPRM Overview',
      'Attestation checklist (14-line OCR binder ready)',
      '30-min working session with a compliance engineer',
      '60 days to book the call',
      '12 months of free rescans',
    ],
    faqs: [
      { q: 'How does the call work?', a: 'Booked through the RocketOpp calendar. We arrive prepped with your report open and walk every finding line by line.' },
      { q: 'Is this defensible to OCR?', a: 'Yes — the report doubles as your "ongoing monitoring" artifact under 45 CFR §164.308(a)(1)(ii)(A).' },
    ],
    ctaLabel: 'Lock in $899 — start now',
    gammaUrl: 'https://gamma.app/docs/0wi0qd71euwhonx',
  },

  // -------------------- Web --------------------
  {
    slug: 'website-development',
    category: 'web',
    name: 'Website Development',
    tagline: 'Full custom website, 2-week ship, $2,497.',
    blurb: 'Custom Next.js website with full digital presence — design, copy, integrations, and analytics. The faster you upload assets in onboarding, the more we discount.',
    priceCents: 249_700,
    priceLabel: 'From $2,497',
    delivery: '2 weeks',
    icon: Globe,
    gradient: 'from-blue-500 to-cyan-500',
    imageUrl: 'https://cdn.gamma.app/zhtpwppn6k9cid3/generated-images/HfdjxQ42dc2TXMb6HG86W.png',
    features: [
      'Custom Next.js + Supabase build',
      'Brand-aligned design + content',
      'CRM, email, analytics integrations',
      'On-page SEO + schema',
      '30-day post-launch support',
    ],
    faqs: [
      { q: 'How does the discount work?', a: 'Drop logos, brand guidelines, and copy in onboarding upfront and the price drops in real time. Up to ~30% off if you bring everything.' },
    ],
    ctaLabel: 'Lock in $2,497 — start onboarding',
  },

  // -------------------- Marketing (recurring) --------------------
  {
    slug: 'seo-subscription',
    category: 'marketing',
    name: 'SEO · Recurring',
    tagline: 'Search-experience optimization. $297/mo.',
    blurb: 'AI-ready SEO including llms.txt, schema.org, AEO formatting, and answer-engine indexing. Built for the post-Google search world.',
    priceCents: 29_700,
    priceLabel: '$297',
    delivery: 'Monthly',
    recurring: 'month',
    icon: Search,
    gradient: 'from-orange-500 to-amber-500',
    imageUrl: 'https://cdn.gamma.app/zhtpwppn6k9cid3/generated-images/m6xgbErDGWwjHi_sDOuBf.png',
    badge: 'Recurring',
    features: [
      'Monthly SXO audit + fixes',
      'llms.txt + schema.org build',
      'AEO content formatting',
      'Quarterly keyword expansion',
      'Indexed across ChatGPT, Perplexity, Claude',
    ],
    faqs: [
      { q: 'Do I need a website first?', a: 'Yes — bundle this with Website Development if not.' },
    ],
    ctaLabel: 'Lock in $297/mo',
  },
  {
    slug: 'content-marketing',
    category: 'marketing',
    name: 'Content Marketing',
    tagline: 'AI-assisted content engine. $497/mo.',
    blurb: 'Weekly publishing engine — blog posts, LinkedIn carousels, and email newsletters auto-distributed via the Radial Burst pipeline.',
    priceCents: 49_700,
    priceLabel: '$497',
    delivery: 'Monthly',
    recurring: 'month',
    icon: Megaphone,
    gradient: 'from-pink-500 to-purple-500',
    imageUrl: 'https://cdn.gamma.app/zhtpwppn6k9cid3/generated-images/6IfBDi5pVhhP2jDNp8-G-.png',
    badge: 'Recurring',
    features: [
      'Weekly long-form blog post (SXO-optimized)',
      '2x LinkedIn carousels per week',
      'Bi-weekly email newsletter',
      'Radial Burst distribution to all channels',
      'Quarterly content audit',
    ],
    faqs: [],
    ctaLabel: 'Lock in $497/mo',
  },
  {
    slug: 'ppc-management',
    category: 'marketing',
    name: 'PPC Management',
    tagline: 'Google + Meta + LinkedIn ads. $797/mo.',
    blurb: 'Full-funnel paid acquisition. Build, launch, and iterate Google, Meta, and LinkedIn campaigns with weekly optimization.',
    priceCents: 79_700,
    priceLabel: '$797',
    delivery: 'Monthly',
    recurring: 'month',
    icon: Target,
    gradient: 'from-green-500 to-emerald-500',
    imageUrl: 'https://cdn.gamma.app/zhtpwppn6k9cid3/generated-images/pOFpXaaObr88ShBD-yqFg.png',
    badge: 'Recurring',
    features: [
      'Google Ads management',
      'Meta (Facebook + Instagram) management',
      'LinkedIn Ads management',
      'Weekly optimization sprints',
      'Monthly performance review',
    ],
    faqs: [
      { q: 'Is ad spend included?', a: 'No — management fee only. Ad spend is paid directly to the platforms by you.' },
    ],
    ctaLabel: 'Lock in $797/mo',
  },

  // -------------------- AI builds --------------------
  {
    slug: 'mcp-integration',
    category: 'ai',
    name: 'MCP Integration',
    tagline: '54 services, 1,171 tools, 1-week ship.',
    blurb: 'Drop the 0nMCP orchestrator into your stack. 54 services, 1,171 tools, vault-secured credentials, and a custom integration plan in 1 week.',
    priceCents: 199_700,
    priceLabel: '$1,997',
    delivery: '1 week',
    icon: Workflow,
    gradient: 'from-cyan-500 to-blue-500',
    imageUrl: 'https://cdn.gamma.app/zhtpwppn6k9cid3/generated-images/A9XtlQDUGl3zkoS2N3-Yq.png',
    features: [
      'Connect 54 services (Stripe, Notion, GHL, Slack, GitHub, etc.)',
      '1,171 tools available out of the box',
      'Vault-secured credential storage',
      'Custom workflow scripts',
      'Hand-off documentation',
    ],
    faqs: [],
    ctaLabel: 'Lock in $1,997 — start onboarding',
  },
  {
    slug: 'lead-tool-app',
    category: 'ai',
    name: 'Lead Tool App',
    tagline: 'Custom lead-gen tool. 2-week ship.',
    blurb: 'Build a public-facing lead-gen tool — assessment funnel, scanner, calculator, or audit — branded to you and feeding your CRM. 2-week sprint.',
    priceCents: 349_700,
    priceLabel: 'From $3,497',
    delivery: '2 weeks',
    icon: Megaphone,
    gradient: 'from-lime-400 to-teal-500',
    imageUrl: 'https://cdn.gamma.app/zhtpwppn6k9cid3/generated-images/lxhLPrzukvFz_B4JpaoBb.png',
    features: [
      'Custom assessment / scanner / calculator',
      'Hosted on your domain',
      'CRM integration (lead capture)',
      'Public-share viral loops',
      'Analytics + conversion tracking',
    ],
    faqs: [
      { q: 'Like the Apex Assessment?', a: 'Exactly. The Apex Assessment IS one of these — built for RocketOpp.' },
    ],
    ctaLabel: 'Lock in $3,497 — start onboarding',
  },
  {
    slug: 'agentic-ai-app',
    category: 'ai',
    name: 'Agentic AI App',
    tagline: 'Autonomous agents on 0nMCP. 3-week ship.',
    blurb: 'A custom AI agent that runs your work — pulls from your tools, makes decisions, drafts outputs, and reports daily. Built on 0nMCP. 3-week ship.',
    priceCents: 499_700,
    priceLabel: 'From $4,997',
    delivery: '3 weeks',
    icon: Bot,
    gradient: 'from-fuchsia-500 to-purple-600',
    imageUrl: 'https://cdn.gamma.app/zhtpwppn6k9cid3/generated-images/ZXzDjbQ3_fsdwSte8sIR1.png',
    badge: 'New',
    features: [
      'Custom agent on 0nMCP (1,554 tools)',
      'Multi-step workflows + decision trees',
      'Daily Slack / email digest',
      'Human-in-the-loop approval gates',
      'Hand-off + 30-day support',
    ],
    faqs: [
      { q: 'Can it act on my CRM?', a: 'Yes — full GHL integration including contacts, opportunities, calendar, conversations.' },
    ],
    ctaLabel: 'Lock in $4,997 — start onboarding',
    gammaUrl: 'https://gamma.app/docs/qw1emryxz6c7f43',
  },

  // -------------------- SaaS --------------------
  {
    slug: 'saas-platform',
    category: 'saas',
    name: 'SaaS Platform Build',
    tagline: 'Multi-tenant SaaS, 6-week ship.',
    blurb: 'Full multi-tenant SaaS — auth, subscriptions, admin dashboard, and a tenant onboarding wizard. Stack: Next.js + Supabase + Stripe + 0nMCP.',
    priceCents: 1_250_000,
    priceLabel: 'From $12,500',
    delivery: '6 weeks',
    icon: Package,
    gradient: 'from-rose-500 to-pink-600',
    imageUrl: 'https://cdn.gamma.app/zhtpwppn6k9cid3/generated-images/exPTcVH19tmHaDNoWuHmR.png',
    features: [
      'Multi-tenant auth + RLS isolation',
      'Stripe subscriptions + billing portal',
      'Admin dashboard + analytics',
      'Tenant onboarding wizard',
      'API + webhook system',
      '60-day post-launch support',
    ],
    faqs: [
      { q: 'Includes hosting?', a: 'First 90 days on RocketOpp infrastructure included. Move to your own Vercel / Supabase any time.' },
    ],
    ctaLabel: 'Lock in $12,500 — start onboarding',
    gammaUrl: 'https://gamma.app/docs/ob630v05dk7y4ip',
  },
]

export function getProduct(slug: string): ShopProduct | undefined {
  return PRODUCTS.find(p => p.slug === slug)
}

export function productsByCategory(): Record<ProductCategory, ShopProduct[]> {
  const out: Record<ProductCategory, ShopProduct[]> = {
    assessment: [], compliance: [], web: [], marketing: [], ai: [], saas: [],
  }
  for (const p of PRODUCTS) out[p.category].push(p)
  return out
}

export const CATEGORY_LABELS: Record<ProductCategory, string> = {
  assessment: 'Free Assessment',
  compliance: 'HIPAA Compliance',
  web:        'Web Development',
  marketing:  'Marketing · Recurring',
  ai:         'AI Builds',
  saas:       'SaaS Platforms',
}
