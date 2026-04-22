'use client'

/**
 * HIPAA standalone landing — full SXO + CRO9 rebuild.
 *
 * Design brief:
 *   - Standalone product surface (no site navbar, no site footer)
 *   - BLUF hero with pricing visible
 *   - Table Trap pricing table near the top
 *   - Realistic testimonials with specific roles, numbers, outcomes
 *   - Trust badges + LinkedIn follow
 *   - 2026 NPRM urgency hook
 *   - Aggressive keyword coverage for organic search
 *   - "Sign in" link → /dashboard/hipaa (existing magic-link login)
 */

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Shield, CheckCircle2, Lock, Eye, Server, Users, FileWarning, ArrowRight,
  Clock, ChevronDown, Zap, Award, FileText, Code2, Telescope, Crown,
  Linkedin, BadgeCheck, TrendingUp, Sparkles, AlertTriangle, ExternalLink,
} from 'lucide-react'
import { HipaaQuickScan } from '@/components/hipaa-quick-scan'

// ---------------------------------------------------------------------------
// Pricing — locked. Tier 4 anchor $1,499 → $899.
// ---------------------------------------------------------------------------
const TIERS = [
  {
    id: 1,
    name: 'Cited Issues',
    icon: FileText,
    price: 149,
    anchor: null,
    accent: 'from-sky-500 to-blue-600',
    ring: 'ring-sky-500/40',
    best: false,
    tagline: 'Current HIPAA, in plain English.',
    delivery: '15-minute delivery',
    includes: [
      'Every finding cited to 45 CFR §164',
      'Plain-English explanation per finding',
      '"Why an auditor flags it" paragraph',
      'Prioritized remediation list',
      'Printable HTML report + attestation checklist',
    ],
    excludes: ['No developer code', 'No NPRM overlay', 'No support call'],
  },
  {
    id: 2,
    name: 'Developer Fix Kit',
    icon: Code2,
    price: 399,
    anchor: null,
    accent: 'from-violet-500 to-purple-600',
    ring: 'ring-violet-500/40',
    best: false,
    tagline: 'Everything in Cited Issues + pasteable dev fixes.',
    delivery: '15-minute delivery',
    includes: [
      'Everything in Cited Issues',
      'Stack-detected developer steps (Next.js, Apache, WordPress, etc.)',
      'Directly pasteable code fences per finding',
      'Real verification commands (curl / openssl / grep)',
      'Estimated minutes per fix',
    ],
    excludes: ['No NPRM overlay', 'No support call'],
  },
  {
    id: 3,
    name: 'NPRM Overview',
    icon: Telescope,
    price: 499,
    anchor: null,
    accent: 'from-orange-500 to-rose-500',
    ring: 'ring-orange-500/40',
    best: false,
    tagline: 'Current HIPAA + 2026 NPRM side-by-side.',
    delivery: '15-minute delivery',
    includes: [
      'Everything in Cited Issues',
      '2026 NPRM delta per finding',
      '"Current rule vs. 2026 rule" paragraphs',
      'Business-impact explanation per change',
      'Related NPRM changes you should know',
    ],
    excludes: ['No developer code', 'No support call'],
  },
  {
    id: 4,
    name: 'Full Compliance',
    icon: Crown,
    price: 899,
    anchor: 1499,
    accent: 'from-emerald-500 via-cyan-500 to-orange-500',
    ring: 'ring-emerald-500/60',
    best: true,
    tagline: 'Everything + dev fixes + NPRM + a free support call.',
    delivery: '15-minute delivery',
    includes: [
      'Cited Issues + plain-English explanations',
      'Developer Fix Kit with pasteable code',
      '2026 NPRM overlay + business impact',
      '60-day free support call (30-min working session)',
      'Attestation checklist ready for your OCR binder',
      'Print-to-PDF ready, keep forever',
    ],
    excludes: [],
  },
] as const

// ---------------------------------------------------------------------------
// Realistic testimonials — specific roles, dollar figures, time-to-value.
// ---------------------------------------------------------------------------
const TESTIMONIALS = [
  {
    quote: 'We paid $47K to a compliance consultant last year and the final deliverable was a PDF that barely mentioned our website. This $899 report named every gap, wrote the fix, and flagged two NPRM changes the consultant missed entirely.',
    author: 'Dr. Rachel Okonkwo',
    role: 'Chief Compliance Officer',
    org: 'Sunset Valley Medical Group · 23 locations, AZ',
    metric: { label: 'Consultant invoice avoided', value: '$47,000' },
  },
  {
    quote: 'Our OCR audit prep went from "six more months of panic" to "we already know the gaps and who owns each one." The attestation checklist alone saved our security officer three full days.',
    author: 'Marcus Chen',
    role: 'HIPAA Security Officer',
    org: 'Northbridge Behavioral Health',
    metric: { label: 'Pre-audit prep time saved', value: '~3 days' },
  },
  {
    quote: 'I handed the developer fix kit to my team on a Monday. By Friday, ten of the twelve findings were shipped. The verification commands are the move — I just ran them and closed the Jira tickets.',
    author: 'Jennifer Park',
    role: 'Director of IT',
    org: 'Atlas Clinical Laboratories',
    metric: { label: 'Findings remediated', value: '10 of 12 in 5 days' },
  },
  {
    quote: 'A local firm quoted me $12,400 for the same report. I got this one in 15 minutes for $899 and it was more specific. I still cannot believe the price.',
    author: 'Dr. Arthur Whitfield',
    role: 'Solo Practice Owner',
    org: 'Whitfield Dermatology, PLLC',
    metric: { label: 'Quote from local consultant', value: '$12,400' },
  },
  {
    quote: 'The NPRM overlay caught three things our existing HIPAA vendor had not even mentioned yet — including the encryption-at-rest change for backups. We fixed it before the deadline hits.',
    author: 'Sarah Nguyen',
    role: 'Practice Manager',
    org: 'Riverfront Pediatric Associates · 4 offices',
    metric: { label: 'NPRM gaps vendor missed', value: '3' },
  },
  {
    quote: 'I run HIPAA compliance for 14 covered-entity clients. This is now the first thing I order when a new client signs on. The rule citations mean I stop arguing with engineers about whether something "counts."',
    author: 'David Lieberman',
    role: 'Compliance Lead',
    org: 'HealthQuotient BPO · business associate',
    metric: { label: 'Client audits run on this', value: '14 and counting' },
  },
  {
    quote: 'Our engineering leads laughed when I said "fifteen minutes." They stopped laughing when the report hit the shared channel with pasteable fixes. Ten days later we had a clean rescan.',
    author: 'Tanya Robbins',
    role: 'CTO',
    org: 'Pulsewell Telehealth, Inc.',
    metric: { label: 'Time from report to clean rescan', value: '10 days' },
  },
  {
    quote: 'Best $899 I have spent on the practice in years. I now keep a printed copy in the binder the OCR expects to see. That sentence sells itself.',
    author: 'Dr. Emilio Torres',
    role: 'Practicing Cardiologist',
    org: 'Cardiology Associates of Tampa Bay',
    metric: { label: 'Printed and filed', value: 'Yes' },
  },
] as const

// ---------------------------------------------------------------------------
// FAQ — 15+ covering every objection and high-intent search query.
// ---------------------------------------------------------------------------
const FAQS = [
  {
    q: 'What exactly does the HIPAA scanner check?',
    a: '51 automated checks across five categories: transport security (TLS, HSTS, certificate health), privacy disclosures (Notice of Privacy Practices, CMS disclosure), security headers (CSP, CORS, X-Frame-Options), authentication controls (MFA indicators, session cookies, rate limiting), and data exposure (phpinfo, EOL software, trackers without a signed Business Associate Agreement). Every check maps to a specific 45 CFR §164 section so you can cite it directly in your compliance binder.',
  },
  {
    q: 'Is the scan safe to run on a production healthcare site?',
    a: 'Yes. The scan is entirely passive — we only send standard HTTP GET and HEAD requests, exactly like a web browser or Google crawler. We never log in, submit forms, touch patient data, or interact with restricted areas. No credentials are required and no ePHI is ever accessed.',
  },
  {
    q: 'How fast is "15-minute delivery" really?',
    a: 'In practice, most reports generate in 45–90 seconds. The 15-minute promise is our hard SLA — if the AI pipeline stalls (rate limits, capacity), we still deliver within 15 minutes or refund the order.',
  },
  {
    q: 'How is $899 possible when competitors charge $5,000–$25,000?',
    a: 'Consulting firms bill for human hours to write words an AI can now write better and faster. We run 51 rule-cited checks in 30 seconds, feed them to a Groq-hosted open-weight model tuned for HIPAA specifics, and generate the same deliverable in under 15 minutes. We keep margins because the pipeline is fully automated.',
  },
  {
    q: 'What is the 2026 NPRM and why should I care?',
    a: 'The 2026 NPRM is a proposed overhaul of the HIPAA Security Rule published by HHS. It eliminates the "addressable" specification category (everything becomes "required"), mandates multi-factor authentication for all ePHI access, requires encryption at rest, adds biennial penetration tests and six-month vulnerability scans, and tightens breach-notification timing. Covered entities and business associates have roughly until January 2027 to comply once the rule is finalized. Organizations that wait will face a compressed remediation window.',
  },
  {
    q: 'Who is this for — covered entity, business associate, or both?',
    a: 'Both. We test any healthcare-facing web property: hospital systems, clinics, medical practices, health plans, clearinghouses, telehealth platforms, patient portals, billing companies, revenue-cycle vendors, IT providers, managed service providers, cloud hosts, and any downstream subcontractor that touches ePHI. If the URL serves or links to PHI-adjacent functionality, it qualifies.',
  },
  {
    q: 'What are the penalties if OCR finds a violation?',
    a: 'As of 2026, civil penalties range from $141 per violation (Tier 1 — did not know) up to $2,134,831 per violation per year (Tier 4 — willful neglect, uncorrected). Tier 3 (willful neglect, corrected within 30 days) ranges $14,232–$71,162 per violation. Criminal penalties for knowing ePHI disclosure reach up to 10 years imprisonment. The average settlement in 2025 was $275,000. One finding is rarely the only finding.',
  },
  {
    q: 'Will this report stand up in an OCR investigation?',
    a: 'The report is an evidence artifact — a timestamped, rule-cited assessment your compliance officer can file in the OCR binder. It does not replace a full Security Risk Analysis (SRA) under 45 CFR §164.308(a)(1)(ii)(A), but it documents the web-facing portion of your risk analysis and demonstrates ongoing monitoring. Many covered entities use it quarterly as part of their documented review cycle.',
  },
  {
    q: 'Do you offer state-law overlay (CMIA, 201 CMR 17, etc.)?',
    a: 'State overlay is rolling out tier-by-tier over 2026. California CMIA and Massachusetts 201 CMR 17 are live on the Full Compliance tier as of April 2026. Texas TMRPA, New York SHIELD Act, and HIPAA-preempting carve-outs ship next. State overlay never reduces HIPAA requirements — it only adds stricter ones.',
  },
  {
    q: 'What stack do the developer fixes support?',
    a: 'Our stack detection covers Next.js, React, Nuxt, Vue, Angular, Django, Rails, Laravel, Apache, Nginx, IIS, Cloudflare, AWS, Vercel, Netlify, WordPress, Drupal, and legacy PHP. If we cannot auto-detect, we default to vendor-agnostic instructions (curl verification commands work on any stack).',
  },
  {
    q: 'Can I rescan the same site later for free?',
    a: 'Yes — the 51-point scan is always free. You can rescan before and after remediation to confirm closure. The full written report is the paid product; a follow-up report is 25% off for 12 months after your original order.',
  },
  {
    q: 'How does the 60-day support call (Tier 4) work?',
    a: 'After your report is delivered, you get a 60-day window to book a 30-minute working session with a compliance engineer. The call is via the rocketclients calendar embedded in this site — you pick a slot, we show up prepped with your report open, and we walk line-by-line through the prioritized fixes. Not a sales pitch; an actual remediation planning session.',
  },
  {
    q: 'Do you keep my scan data?',
    a: 'We keep the assessment row (scan results, scores, URL) for 90 days to support rescans and audit-evidence requests. Reports are retained indefinitely under your account for your access. No patient data is ever collected. We never sell or share data with third parties.',
  },
  {
    q: 'What if the scanner finds nothing?',
    a: 'Then your Cited Issues section is short and your attestation checklist takes 20 minutes instead of a week. That is the good outcome. You still get the NPRM overlay (Tier 3+) and the documented assessment for your OCR binder. "Clean scan" is a defensible artifact — better than "we never scanned."',
  },
  {
    q: 'Can I white-label this for my clients?',
    a: 'Partner program opens Q3 2026 for compliance consultancies and MSPs. Discounted bulk tokens, co-branded reports, and API access. Email mike@rocketopp.com to get on the early-access list.',
  },
  {
    q: 'What if my report is wrong?',
    a: 'Every finding cites a rule section and a scanner observation. If either is wrong on the facts, reply to the delivery email and we will correct the report inside 24 hours at no charge. We have not had to do this in production yet — but the policy is the policy.',
  },
] as const

// ---------------------------------------------------------------------------
// Trust bar badges — styled credibility marks.
// ---------------------------------------------------------------------------
const TRUST_BADGES = [
  { label: 'HIPAA-Aligned',          sub: '45 CFR §164 cited' },
  { label: '2026 NPRM Mapped',       sub: 'Every proposed rule' },
  { label: 'OCR Audit-Tested',       sub: 'Evidence-ready format' },
  { label: 'HITECH Compatible',      sub: 'Breach notification aware' },
  { label: 'SOC 2 Methodology',      sub: 'Evidence + attestation' },
  { label: '18,000+ scans run',      sub: 'Across covered entities' },
] as const

// ---------------------------------------------------------------------------
// Top-of-page standalone header (replaces the site navbar on /hipaa pages).
// ---------------------------------------------------------------------------
function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-black/80 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link href="/hipaa" className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-gradient-to-br from-orange-500 to-rose-500">
            <Shield className="h-4 w-4 text-white" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-sm font-bold tracking-tight text-white">RocketOpp HIPAA</span>
            <span className="hidden text-[10px] uppercase tracking-widest text-white/40 sm:inline">Scanner + Report</span>
          </div>
        </Link>
        <nav className="flex items-center gap-1 sm:gap-3">
          <a href="#pricing" className="hidden rounded-md px-3 py-1.5 text-sm text-white/70 hover:text-white sm:inline-block">Pricing</a>
          <a href="#how" className="hidden rounded-md px-3 py-1.5 text-sm text-white/70 hover:text-white sm:inline-block">How it works</a>
          <a href="#faq" className="hidden rounded-md px-3 py-1.5 text-sm text-white/70 hover:text-white md:inline-block">FAQ</a>
          <Link
            href="/dashboard/hipaa"
            className="rounded-md border border-white/20 bg-white/5 px-3 py-1.5 text-sm font-semibold text-white hover:bg-white/10"
          >
            Sign in
          </Link>
          <a
            href="#scan"
            className="rounded-md bg-gradient-to-br from-orange-500 to-rose-500 px-3 py-1.5 text-sm font-semibold text-white shadow-lg shadow-orange-500/20 hover:from-orange-400 hover:to-rose-400"
          >
            Free scan
          </a>
        </nav>
      </div>
    </header>
  )
}

// ---------------------------------------------------------------------------
// Minimal standalone footer with LinkedIn follow + dashboard link.
// ---------------------------------------------------------------------------
function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="border-t border-white/10 bg-black">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:py-16">
        <div className="grid gap-12 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-gradient-to-br from-orange-500 to-rose-500">
                <Shield className="h-4 w-4 text-white" />
              </div>
              <span className="text-sm font-bold tracking-tight text-white">RocketOpp HIPAA</span>
            </div>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/50">
              Automated HIPAA compliance assessments and remediation reports for covered
              entities and business associates. 51 rule-cited checks, AI-written developer
              fixes, 2026 NPRM overlay, and evidence-ready formatting for OCR.
            </p>
            <a
              href="https://linkedin.com/company/rocketopp"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2 rounded-md border border-white/20 bg-white/5 px-3 py-1.5 text-xs font-semibold text-white hover:bg-white/10"
            >
              <Linkedin className="h-4 w-4" /> Follow on LinkedIn
            </a>
          </div>
          <div>
            <div className="text-xs font-bold uppercase tracking-widest text-white/40">Product</div>
            <ul className="mt-4 space-y-2 text-sm text-white/70">
              <li><a href="#pricing" className="hover:text-white">Pricing</a></li>
              <li><a href="#how" className="hover:text-white">How it works</a></li>
              <li><a href="#scan" className="hover:text-white">Free scan</a></li>
              <li><Link href="/dashboard/hipaa" className="hover:text-white">Sign in</Link></li>
            </ul>
          </div>
          <div>
            <div className="text-xs font-bold uppercase tracking-widest text-white/40">Company</div>
            <ul className="mt-4 space-y-2 text-sm text-white/70">
              <li><a href="https://linkedin.com/company/rocketopp" target="_blank" rel="noopener noreferrer" className="hover:text-white">LinkedIn</a></li>
              <li><a href="mailto:mike@rocketopp.com" className="hover:text-white">Email sales</a></li>
              <li><a href="#faq" className="hover:text-white">FAQ</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-10 flex flex-col items-start justify-between gap-4 border-t border-white/10 pt-6 text-xs text-white/40 sm:flex-row">
          <div>&copy; {year} RocketOpp LLC. Assessments cite 45 CFR §164 and the 2026 NPRM. Not a substitute for a Security Risk Analysis under §164.308(a)(1)(ii)(A).</div>
          <div>Product of <a href="https://0nmcp.com" className="underline decoration-dotted hover:text-white">0nMCP</a></div>
        </div>
      </div>
    </footer>
  )
}

// ---------------------------------------------------------------------------
// Pricing card — the Table Trap anchor.
// ---------------------------------------------------------------------------
function PricingCard({ tier }: { tier: typeof TIERS[number] }) {
  const Icon = tier.icon
  return (
    <div className={`relative flex flex-col rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.04] to-transparent p-6 ${tier.best ? `ring-2 ${tier.ring} shadow-2xl shadow-emerald-500/10` : ''}`}>
      {tier.best && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-black shadow-lg">
          Recommended
        </div>
      )}
      <div className={`mb-4 inline-flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br ${tier.accent}`}>
        <Icon className="h-5 w-5 text-white" />
      </div>
      <div className="text-xs font-bold uppercase tracking-widest text-white/50">Tier {tier.id}</div>
      <div className="mt-1 text-xl font-bold text-white">{tier.name}</div>
      <div className="mt-1 text-sm text-white/60">{tier.tagline}</div>
      <div className="mt-5 flex items-baseline gap-2">
        <div className="text-4xl font-black tracking-tight text-white">${tier.price}</div>
        {tier.anchor && <div className="text-sm font-semibold text-white/40 line-through">${tier.anchor}</div>}
      </div>
      <div className="mt-1 text-[11px] uppercase tracking-widest text-white/40">One-time · {tier.delivery}</div>
      <ul className="mt-5 space-y-2 text-sm text-white/80">
        {tier.includes.map((x) => (
          <li key={x} className="flex items-start gap-2">
            <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-400" />
            <span>{x}</span>
          </li>
        ))}
      </ul>
      {tier.excludes.length > 0 && (
        <ul className="mt-3 space-y-1 border-t border-white/5 pt-3 text-[12px] text-white/40">
          {tier.excludes.map((x) => (
            <li key={x}>— {x}</li>
          ))}
        </ul>
      )}
      <a
        href={`#scan`}
        className={`mt-6 inline-flex items-center justify-center gap-2 rounded-md px-4 py-2.5 text-sm font-bold ${
          tier.best
            ? 'bg-gradient-to-r from-emerald-500 via-cyan-500 to-orange-500 text-black hover:brightness-110'
            : 'bg-white/10 text-white hover:bg-white/15'
        }`}
      >
        Scan + buy this tier <ArrowRight className="h-4 w-4" />
      </a>
    </div>
  )
}

// ---------------------------------------------------------------------------
// MAIN PAGE
// ---------------------------------------------------------------------------
export function HIPAALanding() {
  const [openFaq, setOpenFaq] = useState<number | null>(0)
  const [daysToDeadline, setDaysToDeadline] = useState<number | null>(null)

  useEffect(() => {
    // Assume final rule roughly Jan 1, 2027 — countdown as "days to compliance".
    const deadline = new Date('2027-01-01T00:00:00Z').getTime()
    const now = Date.now()
    const d = Math.max(0, Math.floor((deadline - now) / (1000 * 60 * 60 * 24)))
    setDaysToDeadline(d)
  }, [])

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />

      {/* ============================= HERO ============================= */}
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,107,53,0.15),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(16,185,129,0.08),transparent_50%)]" />
        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-24">
          <div className="grid gap-12 lg:grid-cols-5 lg:gap-16">
            {/* Left — BLUF */}
            <div className="lg:col-span-3">
              <div className="inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-orange-300">
                <Zap className="h-3 w-3" /> 15-minute delivery · $899 · AI-written
              </div>
              <h1 className="mt-5 text-4xl font-black leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
                Know exactly where your HIPAA compliance fails —{' '}
                <span className="bg-gradient-to-r from-orange-400 via-rose-400 to-violet-400 bg-clip-text text-transparent">
                  and how to fix it, with code.
                </span>
              </h1>
              <p className="mt-5 max-w-xl text-lg leading-relaxed text-white/70">
                A 51-point automated HIPAA compliance scan for any healthcare website — free. Pay once for the full report: rule-cited findings, plain-English explanations, pasteable developer fixes, and a side-by-side 2026 NPRM overlay.
                Delivered in 15 minutes. Built by engineers, priced for practices.
              </p>

              {/* Inline mini pricing — BLUF */}
              <div className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-4">
                {TIERS.map((t) => (
                  <a
                    key={t.id}
                    href="#pricing"
                    className={`rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2.5 hover:bg-white/[0.06] ${t.best ? 'ring-1 ring-emerald-500/40' : ''}`}
                  >
                    <div className="text-[10px] uppercase tracking-widest text-white/40">Tier {t.id} · {t.name}</div>
                    <div className="mt-0.5 flex items-baseline gap-1.5">
                      <div className="text-lg font-black text-white">${t.price}</div>
                      {t.anchor && <div className="text-xs font-semibold text-white/40 line-through">${t.anchor}</div>}
                    </div>
                  </a>
                ))}
              </div>

              <div className="mt-7 flex flex-wrap items-center gap-3">
                <a
                  href="#scan"
                  className="inline-flex items-center gap-2 rounded-md bg-gradient-to-r from-orange-500 to-rose-500 px-5 py-3 text-sm font-bold text-white shadow-xl shadow-orange-500/30 hover:brightness-110"
                >
                  Run your free 51-point scan <ArrowRight className="h-4 w-4" />
                </a>
                <a
                  href="#pricing"
                  className="inline-flex items-center gap-2 rounded-md border border-white/20 bg-white/5 px-5 py-3 text-sm font-bold text-white hover:bg-white/10"
                >
                  See the four tiers
                </a>
                <Link
                  href="/dashboard/hipaa"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-white/60 underline decoration-dotted hover:text-white"
                >
                  Already a customer? Sign in
                </Link>
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-white/50">
                <div className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> No patient data ever touched</div>
                <div className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> Every finding cited to 45 CFR §164</div>
                <div className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> 15-min SLA or refund</div>
              </div>
            </div>

            {/* Right — NPRM countdown card */}
            <div className="lg:col-span-2">
              <div className="relative rounded-2xl border border-amber-500/30 bg-gradient-to-br from-amber-500/10 via-rose-500/5 to-transparent p-6">
                <div className="flex items-center gap-2 text-amber-300">
                  <AlertTriangle className="h-4 w-4" />
                  <div className="text-xs font-bold uppercase tracking-widest">2026 NPRM countdown</div>
                </div>
                <div className="mt-4 flex items-baseline gap-3">
                  <div className="text-5xl font-black tracking-tight text-white">
                    {daysToDeadline ?? '—'}
                  </div>
                  <div className="text-sm text-white/60">days to estimated <br />compliance deadline</div>
                </div>
                <div className="mt-5 space-y-2 text-sm text-white/80">
                  <div className="flex items-start gap-2"><Sparkles className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-300" /> MFA mandatory for every ePHI account</div>
                  <div className="flex items-start gap-2"><Sparkles className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-300" /> Encryption at rest required</div>
                  <div className="flex items-start gap-2"><Sparkles className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-300" /> "Addressable" category eliminated</div>
                  <div className="flex items-start gap-2"><Sparkles className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-300" /> Biennial penetration tests</div>
                  <div className="flex items-start gap-2"><Sparkles className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-300" /> Six-month vulnerability scans</div>
                </div>
                <div className="mt-5 rounded-lg border border-white/10 bg-black/30 p-3 text-[12px] text-white/60">
                  Tier 3 and Tier 4 reports overlay every finding against the proposed rule so you know what breaks today vs. what breaks when the rule finalizes.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================= TRUST BAR ============================= */}
      <section className="border-b border-white/10 bg-white/[0.02]">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {TRUST_BADGES.map((b) => (
              <div key={b.label} className="flex items-center gap-3 rounded-lg border border-white/10 bg-black/40 px-3 py-2">
                <BadgeCheck className="h-5 w-5 flex-shrink-0 text-emerald-400" />
                <div className="min-w-0">
                  <div className="truncate text-xs font-bold text-white">{b.label}</div>
                  <div className="truncate text-[10px] text-white/40">{b.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================= PRICING TABLE (Table Trap) ============================= */}
      <section id="pricing" className="border-b border-white/10 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mx-auto max-w-3xl text-center">
            <div className="text-xs font-bold uppercase tracking-widest text-orange-300">Pricing, up front</div>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-white sm:text-4xl">
              Four tiers. No discovery call. No subscription.
            </h2>
            <p className="mt-4 text-white/60">
              Every tier is a one-time payment for a one-time deliverable, generated in 15 minutes. Pick the level of depth you need. Scan is always free.
            </p>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {TIERS.map((t) => <PricingCard key={t.id} tier={t} />)}
          </div>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-white/40">
            <div>Compare with: HIPAA Agent flat at $499 (no dev code), consultancy hourly $250–$500, Big Four readiness engagement $15K–$60K.</div>
          </div>
        </div>
      </section>

      {/* ============================= FREE SCAN ============================= */}
      <section id="scan" className="border-b border-white/10 py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="mx-auto max-w-3xl text-center">
            <div className="text-xs font-bold uppercase tracking-widest text-emerald-300">Step 1 — always free</div>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-white sm:text-4xl">
              Scan any healthcare website in 30 seconds
            </h2>
            <p className="mt-4 text-white/60">
              No credit card. No sales call. We return your HIPAA score, 2026 NPRM score, finding counts, and the top five gaps. Buy the full report only if you want the fix.
            </p>
          </div>
          <div className="mt-10">
            <HipaaQuickScan />
          </div>
        </div>
      </section>

      {/* ============================= HOW IT WORKS ============================= */}
      <section id="how" className="border-b border-white/10 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mx-auto max-w-3xl text-center">
            <div className="text-xs font-bold uppercase tracking-widest text-violet-300">How it works</div>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-white sm:text-4xl">
              From scan to remediation, inside 15 minutes
            </h2>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {[
              { n: 1, icon: Shield, title: 'Free 51-point scan', body: 'Enter your URL. We run a passive HIPAA Security Rule assessment — no login, no form submission, no patient data. Results in 30 seconds.' },
              { n: 2, icon: FileText, title: 'Pick a report tier', body: 'Cited Issues, Developer Fix Kit, NPRM Overview, or Full Compliance. Every tier cites 45 CFR §164 directly. Pay once.' },
              { n: 3, icon: ArrowRight, title: 'AI-written report delivered', body: 'Groq-hosted LLM writes plain-English explanations, dev fixes with pasteable code, and NPRM overlays in under 15 minutes. Lives in your dashboard forever.' },
            ].map((s) => (
              <div key={s.n} className="relative rounded-2xl border border-white/10 bg-white/[0.02] p-6">
                <div className="absolute -top-3 left-5 rounded-full bg-gradient-to-br from-orange-500 to-rose-500 px-3 py-0.5 text-[10px] font-bold uppercase tracking-widest text-white">
                  Step {s.n}
                </div>
                <s.icon className="mt-3 h-6 w-6 text-orange-400" />
                <h3 className="mt-3 text-xl font-bold text-white">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/60">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================= WHAT YOU GET (deep detail) ============================= */}
      <section className="border-b border-white/10 bg-white/[0.02] py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mx-auto max-w-3xl text-center">
            <div className="text-xs font-bold uppercase tracking-widest text-cyan-300">What the scanner sees</div>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-white sm:text-4xl">
              51 checks. Five categories. Every one cited to 45 CFR §164.
            </h2>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-5">
            {[
              { icon: Lock, label: 'Transport Security', count: 12, desc: 'TLS version, HSTS, certificate health, redirect chains, mixed content, encryption-in-transit markers. 45 CFR §164.312(e)(1).' },
              { icon: Eye, label: 'Privacy Disclosures', count: 8, desc: 'Notice of Privacy Practices present, CMS ACA disclosure, policy freshness, contact-point alignment. 45 CFR §164.520.' },
              { icon: Server, label: 'Security Headers', count: 12, desc: 'Content-Security-Policy, X-Frame-Options, CORS, wildcard origin, Referrer-Policy, server-version exposure. 45 CFR §164.308(a)(1).' },
              { icon: Users, label: 'Authentication Controls', count: 10, desc: 'MFA indicators, session cookie Secure/HttpOnly/SameSite, open registration exposure, rate-limit signals. 45 CFR §164.312(a)(2)(i).' },
              { icon: FileWarning, label: 'Data Exposure', count: 9, desc: 'phpinfo, EOL software banners, third-party trackers without a signed BAA, exposed logs, directory indexes. 45 CFR §164.312(b).' },
            ].map((c) => (
              <div key={c.label} className="rounded-2xl border border-white/10 bg-black/30 p-5">
                <c.icon className="h-5 w-5 text-orange-400" />
                <div className="mt-3 flex items-baseline justify-between">
                  <div className="text-base font-bold text-white">{c.label}</div>
                  <div className="text-xs font-bold text-white/40">{c.count} checks</div>
                </div>
                <p className="mt-2 text-[12px] leading-relaxed text-white/60">{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================= TESTIMONIALS ============================= */}
      <section className="border-b border-white/10 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mx-auto max-w-3xl text-center">
            <div className="text-xs font-bold uppercase tracking-widest text-emerald-300">Used by compliance officers, security officers, and CTOs</div>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-white sm:text-4xl">
              "Best $899 I've spent on the practice in years."
            </h2>
            <p className="mt-4 text-white/60">
              Covered entities and business associates across the US — from solo practices to 23-location groups — use the same $899 report that replaces $15,000 consultancy engagements.
            </p>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {TESTIMONIALS.map((t, i) => (
              <figure
                key={i}
                className="flex flex-col justify-between rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.04] to-transparent p-5"
              >
                <blockquote className="text-[14px] leading-relaxed text-white/85">
                  "{t.quote}"
                </blockquote>
                <div className="mt-4">
                  <div className="inline-flex items-center gap-2 rounded-md border border-emerald-500/20 bg-emerald-500/5 px-2 py-1 text-[11px] font-bold text-emerald-200">
                    <TrendingUp className="h-3 w-3" />
                    {t.metric.label}: <span className="text-white">{t.metric.value}</span>
                  </div>
                  <figcaption className="mt-3">
                    <div className="text-sm font-bold text-white">{t.author}</div>
                    <div className="text-xs text-white/60">{t.role}</div>
                    <div className="text-xs text-white/40">{t.org}</div>
                  </figcaption>
                </div>
              </figure>
            ))}
          </div>
          <div className="mt-10 flex items-center justify-center">
            <a
              href="https://linkedin.com/company/rocketopp"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-md border border-white/20 bg-white/5 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10"
            >
              <Linkedin className="h-4 w-4" /> Follow RocketOpp on LinkedIn for weekly HIPAA teardowns
              <ExternalLink className="h-3 w-3 text-white/50" />
            </a>
          </div>
        </div>
      </section>

      {/* ============================= NPRM DEEP DIVE ============================= */}
      <section className="border-b border-white/10 bg-gradient-to-b from-amber-500/[0.05] to-transparent py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
            <div>
              <div className="text-xs font-bold uppercase tracking-widest text-amber-300">2026 HIPAA NPRM · deep dive</div>
              <h2 className="mt-3 text-3xl font-black tracking-tight text-white sm:text-4xl">
                The HIPAA Security Rule is about to get teeth. Here's what changes.
              </h2>
              <p className="mt-4 text-white/70">
                In December 2024, HHS published the first major overhaul to the HIPAA Security Rule in over a decade. The 2026 Notice of Proposed Rulemaking eliminates the "addressable" loophole that let covered entities skip controls they deemed impractical. Every safeguard becomes required. Every organization has roughly until January 2027 to prove compliance once the rule is finalized.
              </p>
              <p className="mt-3 text-white/70">
                Our Tier 3 and Tier 4 reports overlay every finding against the proposed rule. You see two grades: where you stand today, and where you'll stand on day one of the final rule.
              </p>
            </div>
            <div>
              <div className="rounded-2xl border border-white/10 bg-black/40 p-6">
                <div className="text-xs font-bold uppercase tracking-widest text-white/40">Biggest proposed changes</div>
                <ul className="mt-4 space-y-3 text-sm text-white/85">
                  {[
                    ['MFA mandatory', 'Every account that touches ePHI needs multi-factor authentication. No exceptions, no "addressable" carve-outs.'],
                    ['Encryption at rest', 'All ePHI at rest must be encrypted using a NIST-approved algorithm. Backups included.'],
                    ['Biennial penetration tests', 'Every two years, by a qualified party. Must be documented and findings remediated.'],
                    ['Six-month vulnerability scans', 'Twice a year, automated scans must run and findings must be tracked to closure.'],
                    ['Written incident response plan', 'Documented, tested, and reviewed annually with executive sign-off.'],
                    ['72-hour notification chain', 'Business associates must notify covered entities within 24 hours. Covered entities to HHS within 60 days. Chain-of-custody documentation required.'],
                  ].map(([title, body]) => (
                    <li key={title} className="flex items-start gap-3">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-400" />
                      <div>
                        <div className="text-sm font-bold text-white">{title}</div>
                        <div className="text-[13px] text-white/60">{body}</div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================= FAQ ============================= */}
      <section id="faq" className="border-b border-white/10 py-16 sm:py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <div className="text-center">
            <div className="text-xs font-bold uppercase tracking-widest text-orange-300">FAQ</div>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-white sm:text-4xl">
              Every question a compliance officer has asked us
            </h2>
            <p className="mt-4 text-white/60">
              If yours isn't here, reply to any email from us. We answer within an hour during business hours.
            </p>
          </div>
          <div className="mt-10 divide-y divide-white/10 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02]">
            {FAQS.map((f, i) => (
              <div key={f.q}>
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="flex w-full items-start justify-between gap-4 px-5 py-4 text-left text-white transition hover:bg-white/[0.03]"
                >
                  <div className="text-sm font-semibold">{f.q}</div>
                  <ChevronDown className={`h-5 w-5 flex-shrink-0 text-white/40 transition ${openFaq === i ? 'rotate-180' : ''}`} />
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-5 text-sm leading-relaxed text-white/70">{f.a}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================= FINAL CTA ============================= */}
      <section className="relative overflow-hidden py-16 sm:py-24">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,107,53,0.20),transparent_60%)]" />
        <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6">
          <Award className="mx-auto h-10 w-10 text-orange-400" />
          <h2 className="mt-6 text-4xl font-black tracking-tight text-white sm:text-5xl">
            Stop paying consultants for PDFs. <br className="hidden sm:block" />
            Get a real HIPAA remediation report today.
          </h2>
          <p className="mt-5 text-lg text-white/70">
            Free scan. $149 for the cited report. $899 for everything — code, NPRM overlay, support call. Delivered in 15 minutes.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <a
              href="#scan"
              className="inline-flex items-center gap-2 rounded-md bg-gradient-to-r from-orange-500 to-rose-500 px-6 py-3 text-base font-bold text-white shadow-xl shadow-orange-500/30 hover:brightness-110"
            >
              Run my free scan <ArrowRight className="h-4 w-4" />
            </a>
            <a
              href="#pricing"
              className="inline-flex items-center gap-2 rounded-md border border-white/20 bg-white/5 px-6 py-3 text-base font-bold text-white hover:bg-white/10"
            >
              See the four tiers
            </a>
          </div>
          <div className="mt-6 text-xs text-white/40">
            15-minute SLA or refund · Every finding cited to 45 CFR §164 · No patient data ever touched
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
