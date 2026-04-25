/**
 * AI Lead Tools — the mini-app product line.
 *
 * These are the diagnostic/assessment surfaces RocketOpp sells: scans,
 * scorers, audits, quizzes, generators. Each one captures a lead, runs an
 * AI pipeline, optionally takes payment, and drops the user into a
 * persistent dashboard.
 *
 * Add new tools here — the /ai-lead-tools landing renders straight from
 * this list, so a card auto-appears once the entry is added.
 */

import type { LucideIcon } from 'lucide-react'
import {
  ShieldCheck, Lightbulb, Search, Bot, FilePlus2, ListChecks,
  Megaphone, FileText,
} from 'lucide-react'

export type ToolStatus = 'live' | 'beta' | 'soon'

export interface LeadTool {
  slug:        string
  name:        string
  tagline:     string                  // one-line teaser for the card
  blurb:       string                  // 2-sentence description for richer surfaces
  href:        string                  // where the CTA goes (live tool OR notify form)
  ctaLabel:    string                  // "Run free scan" / "Notify me" / "Start"
  priceLabel:  string                  // "Free" / "From $149" / etc.
  delivery:    string                  // "5-minute report" / "15 min" / "instant"
  icon:        LucideIcon
  gradient:    string                  // tailwind gradient classes
  imageUrl?:   string                  // Gamma-generated hero (optional)
  status:      ToolStatus
  badge?:      'New' | 'Best seller' | 'Free' | 'Coming soon'
}

export const LEAD_TOOLS: LeadTool[] = [
  // -------- Live --------
  {
    slug:       'apex-assessment',
    name:       'Free AI Business Assessment',
    tagline:    'A 5-minute conversational AI audit. Free, blueprint-grade.',
    blurb:      'Conversational AI that screenshots your site, scans local competitors, and emails you a strategic blueprint. Powered by 0nMCP. Free.',
    href:       '/apex',
    ctaLabel:   'Run free assessment',
    priceLabel: 'Free',
    delivery:   '5-minute live report',
    icon:       Lightbulb,
    gradient:   'from-amber-500 to-orange-600',
    imageUrl:   'https://cdn.gamma.app/zhtpwppn6k9cid3/generated-images/ypRIkLeGeXOTHon-jBg9S.png',
    status:     'live',
    badge:      'Free',
  },
  {
    slug:       'hipaa-compliance-scanner',
    name:       'HIPAA Compliance Scanner',
    tagline:    '51-point AI-written HIPAA audit, 15-min delivery.',
    blurb:      'Every finding cited to 45 CFR §164. Optional dev fix kit, NPRM overlay, and a 30-min compliance engineer call. From $149.',
    href:       '/hipaa',
    ctaLabel:   'Run HIPAA scan',
    priceLabel: 'From $149',
    delivery:   '15-minute report',
    icon:       ShieldCheck,
    gradient:   'from-emerald-500 to-cyan-500',
    imageUrl:   'https://cdn.gamma.app/zhtpwppn6k9cid3/generated-images/fEHNF9J9pzh6jUytQmZ87.png',
    status:     'live',
    badge:      'Best seller',
  },

  // -------- Beta / coming soon --------
  {
    slug:       'sxo-scan',
    name:       'SXO Scan',
    tagline:    'Search-experience optimization audit. AI-ready or invisible?',
    blurb:      'Audit how your site performs in ChatGPT, Perplexity, Claude. Schema, llms.txt, AEO formatting. Site-wide rewrite recommendations.',
    href:       '/ai-lead-tools/notify?tool=sxo-scan',
    ctaLabel:   'Notify me when live',
    priceLabel: 'From $97',
    delivery:   '10-minute scan',
    icon:       Search,
    gradient:   'from-orange-500 to-amber-500',
    imageUrl:   'https://cdn.gamma.app/zhtpwppn6k9cid3/generated-images/m6xgbErDGWwjHi_sDOuBf.png',
    status:     'soon',
    badge:      'Coming soon',
  },
  {
    slug:       'ai-readiness-audit',
    name:       'AI Readiness Audit',
    tagline:    'A deep paid version of the free assessment. Stack-level.',
    blurb:      'Goes beyond the free assessment — analyzes your CRM, content, ad accounts, and tech stack to score your AI-readiness across 8 dimensions.',
    href:       '/ai-lead-tools/notify?tool=ai-readiness-audit',
    ctaLabel:   'Notify me when live',
    priceLabel: '$199',
    delivery:   'Same-day report',
    icon:       Bot,
    gradient:   'from-fuchsia-500 to-purple-600',
    imageUrl:   'https://cdn.gamma.app/zhtpwppn6k9cid3/generated-images/ZXzDjbQ3_fsdwSte8sIR1.png',
    status:     'soon',
    badge:      'Coming soon',
  },
  {
    slug:       'lead-magnet-builder',
    name:       'Lead Magnet Builder',
    tagline:    'Generate a branded lead magnet PDF in 60 seconds.',
    blurb:      'Pick a topic, your industry, and tone. The AI ships a 6-10 page lead magnet PDF you can swap straight into your funnel.',
    href:       '/ai-lead-tools/notify?tool=lead-magnet-builder',
    ctaLabel:   'Notify me when live',
    priceLabel: 'From $39',
    delivery:   '60-second build',
    icon:       FilePlus2,
    gradient:   'from-violet-500 to-purple-600',
    imageUrl:   'https://cdn.gamma.app/zhtpwppn6k9cid3/generated-images/qoALSHsv4uUrHY98RStO5.png',
    status:     'soon',
    badge:      'Coming soon',
  },
  {
    slug:       'custom-assessment',
    name:       'Custom Assessment Builder',
    tagline:    'Spin up YOUR own scan/quiz/scorer for your audience.',
    blurb:      'White-label any of our scans. Drop in your logo, tweak the questions, share the link. Capture leads on your domain, paid out as agency commissions.',
    href:       '/ai-lead-tools/notify?tool=custom-assessment',
    ctaLabel:   'Become a partner',
    priceLabel: 'Agency program',
    delivery:   'Apply to white-label',
    icon:       ListChecks,
    gradient:   'from-rose-500 to-pink-600',
    imageUrl:   'https://cdn.gamma.app/zhtpwppn6k9cid3/generated-images/exPTcVH19tmHaDNoWuHmR.png',
    status:     'soon',
    badge:      'Coming soon',
  },
  {
    slug:       'content-audit',
    name:       'Content Audit',
    tagline:    'Where your content ranks today vs where it could rank.',
    blurb:      'AI reads your top 50 pages, scores them on engagement + intent + AI discoverability, hands you a 30-day rewrite plan.',
    href:       '/ai-lead-tools/notify?tool=content-audit',
    ctaLabel:   'Notify me when live',
    priceLabel: '$129',
    delivery:   '15-minute scan',
    icon:       FileText,
    gradient:   'from-pink-500 to-purple-500',
    imageUrl:   'https://cdn.gamma.app/zhtpwppn6k9cid3/generated-images/6IfBDi5pVhhP2jDNp8-G-.png',
    status:     'soon',
    badge:      'Coming soon',
  },
  {
    slug:       'ad-copy-engine',
    name:       'Ad Copy Engine',
    tagline:    '50 ad variations matched to your offer in one click.',
    blurb:      'Drop your offer + audience + tone. The AI ships 50 ad variants across Google, Meta, LinkedIn — ready to launch as JSON or directly into your CRM.',
    href:       '/ai-lead-tools/notify?tool=ad-copy-engine',
    ctaLabel:   'Notify me when live',
    priceLabel: 'From $49',
    delivery:   '60-second build',
    icon:       Megaphone,
    gradient:   'from-green-500 to-emerald-500',
    imageUrl:   'https://cdn.gamma.app/zhtpwppn6k9cid3/generated-images/pOFpXaaObr88ShBD-yqFg.png',
    status:     'soon',
    badge:      'Coming soon',
  },
]

export function getLeadTool(slug: string): LeadTool | undefined {
  return LEAD_TOOLS.find(t => t.slug === slug)
}
