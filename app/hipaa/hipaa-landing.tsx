'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Shield, AlertTriangle, CheckCircle2, Lock, Eye, Server, Users, FileWarning, ArrowRight, Zap, Clock, BadgeCheck, ChevronDown, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Footer from '@/components/footer'

/* ─── constants ────────────────────────────────────────── */

const CHECKS = [
  { icon: Lock, label: 'Transport Security', count: 12, desc: 'TLS enforcement, HSTS, certificate validation, redirect chains' },
  { icon: Eye, label: 'Privacy Disclosures', count: 9, desc: 'Notice of Privacy Practices, consent forms, data use statements' },
  { icon: Server, label: 'Security Headers', count: 11, desc: 'CSP, X-Frame-Options, CORS, Referrer-Policy, Permissions-Policy' },
  { icon: Users, label: 'Authentication Controls', count: 10, desc: 'MFA detection, session cookies, rate limiting, credential exposure' },
  { icon: FileWarning, label: 'Data Exposure', count: 9, desc: 'PHI in URLs, tracker audit, debug endpoints, backup files, .env/.git leaks' },
]

const NPRM_CHANGES = [
  { requirement: 'Multi-Factor Authentication', current: 'Addressable', nprm: 'Required', impact: 'All ePHI access must use MFA' },
  { requirement: 'Encryption at Rest', current: 'Addressable', nprm: 'Required', impact: 'No alternative measures accepted' },
  { requirement: 'Vulnerability Scans', current: 'Not Specified', nprm: 'Every 6 Months', impact: 'New mandatory testing cadence' },
  { requirement: 'Penetration Tests', current: 'Not Specified', nprm: 'Every 12 Months', impact: 'Third-party testing required' },
  { requirement: 'Risk Analysis', current: 'Required', nprm: 'Annual + Technology Map', impact: 'Expanded scope and documentation' },
  { requirement: 'Compliance Audit', current: 'Not Specified', nprm: 'Annual', impact: 'Formal audit requirement added' },
]

const PENALTIES = [
  { tier: 'Did Not Know', min: '$141', max: '$71,162', annual: '$2.13M' },
  { tier: 'Reasonable Cause', min: '$1,424', max: '$71,162', annual: '$2.13M' },
  { tier: 'Willful Neglect (Corrected)', min: '$14,232', max: '$71,162', annual: '$2.13M' },
  { tier: 'Willful Neglect (Not Corrected)', min: '$71,162', max: '$2.13M', annual: '$2.13M' },
]

const STATES = [
  { abbr: 'NY', name: 'New York', law: 'SHIELD Act' },
  { abbr: 'CA', name: 'California', law: 'CMIA + CCPA/CPRA' },
  { abbr: 'TX', name: 'Texas', law: 'HB 300' },
  { abbr: 'IL', name: 'Illinois', law: 'BIPA' },
  { abbr: 'MA', name: 'Massachusetts', law: '201 CMR 17.00' },
  { abbr: 'CT', name: 'Connecticut', law: 'CTDPA + PA 23-56' },
  { abbr: 'CO', name: 'Colorado', law: 'CPA' },
  { abbr: 'WA', name: 'Washington', law: 'My Health My Data Act' },
  { abbr: 'NV', name: 'Nevada', law: 'SB 220' },
  { abbr: 'FL', name: 'Florida', law: 'FIPA + DBSA' },
]

const FAQS = [
  {
    q: 'What does the HIPAA scanner actually check?',
    a: 'Our scanner runs 51 automated checks across 5 categories: transport security (TLS, HSTS, certificates), privacy disclosures (NPP, consent), security headers (CSP, X-Frame-Options), authentication controls (MFA, session cookies), and data exposure risks (PHI in URLs, trackers, debug endpoints). Every check maps to a specific HIPAA rule section.',
  },
  {
    q: 'Is it safe? Will it affect my website?',
    a: 'Completely safe. The scan is entirely passive — it sends standard HTTP GET/HEAD requests, exactly like a web browser visiting your site. It never attempts to log in, submit forms, access restricted areas, or interact with any patient data. Zero risk to your systems.',
  },
  {
    q: 'What is the difference between the $149 and $249 scan?',
    a: 'The $149 Current Law Scan assesses your site against existing HIPAA Security Rule requirements and provides a full remediation roadmap. The $249 NPRM Scan includes everything in the current scan PLUS scoring against the proposed 2026 rule changes — mandatory MFA, encryption at rest, vulnerability scan cadence, and more. If you want to get ahead of the curve before January 2027, choose the NPRM scan.',
  },
  {
    q: 'What is the HIPAA 2026 NPRM?',
    a: 'The Notice of Proposed Rulemaking (NPRM) published by HHS proposes sweeping changes to the HIPAA Security Rule. Key changes: MFA becomes mandatory (no longer addressable), encryption at rest required, vulnerability scans every 6 months, penetration tests annually, and the elimination of the "addressable" implementation specification. Compliance deadline: approximately January 2027.',
  },
  {
    q: 'How long does the scan take?',
    a: 'Results are delivered in approximately 30 seconds. The scanner checks both your public-facing website and dashboard/portal URL simultaneously, then computes dual scores and generates your prioritized remediation roadmap.',
  },
  {
    q: 'What do I get in the report?',
    a: 'Every scan includes: dual compliance scores (current law + NPRM grade), all 51 individual check results with pass/fail/warning status, HIPAA rule section references for each check, severity ratings (critical/high/medium/low), a prioritized remediation roadmap ranked by impact and effort, and state-specific compliance overlays if applicable.',
  },
  {
    q: 'Who needs this scan?',
    a: 'Any organization that handles electronic Protected Health Information (ePHI): hospitals, clinics, health plans, clearinghouses (covered entities), billing companies, IT providers, cloud hosts (business associates), and their subcontractors. If you have a patient portal, telehealth platform, or any healthcare-related website, you should be scanning regularly.',
  },
  {
    q: 'Can you help fix the issues found?',
    a: 'Yes. RocketOpp offers full HIPAA remediation services. After your scan, we can implement every recommended fix — security headers, TLS hardening, privacy policy drafting, MFA setup, tracker removal, and ongoing compliance monitoring. Book a free consultation after your scan.',
  },
]

/* ─── component ────────────────────────────────────────── */

export function HIPAALanding() {
  const [scanType, setScanType] = useState<'current' | 'nprm2026'>('nprm2026')
  const [email, setEmail] = useState('')
  const [publicUrl, setPublicUrl] = useState('')
  const [dashboardUrl, setDashboardUrl] = useState('')
  const [entityType, setEntityType] = useState('unsure')
  const [state, setState] = useState('')
  const [loading, setLoading] = useState(false)
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  async function handleCheckout(e: React.FormEvent) {
    e.preventDefault()
    if (!email || !publicUrl) return
    setLoading(true)
    try {
      const res = await fetch('/api/hipaa/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scanType, email, publicUrl, dashboardUrl: dashboardUrl || publicUrl, entityType, state }),
      })
      const data = await res.json()
      if (data.url) window.location.href = data.url
    } catch {
      alert('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* ═══ HERO ═══ */}
      <section className="relative overflow-hidden border-b border-border/40">
        <div className="absolute inset-0 bg-gradient-to-b from-red-950/20 via-background to-background" />
        <div className="relative mx-auto max-w-6xl px-6 py-24 lg:py-32">
          <div className="flex items-center gap-2 mb-6">
            <Shield className="h-5 w-5 text-red-400" />
            <span className="text-sm font-medium text-red-400 tracking-wide uppercase">HIPAA Compliance Scanner</span>
          </div>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl max-w-3xl">
            Is Your Healthcare Website{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-400">
              Violating HIPAA?
            </span>
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-2xl leading-relaxed">
            51 automated checks. Dual scoring against current law and the proposed 2026 NPRM.
            Results in 30 seconds. Prioritized remediation roadmap. Penalties up to{' '}
            <strong className="text-foreground">$2.13M per violation category.</strong>
          </p>
          <div className="mt-8 flex flex-wrap gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-emerald-400" /> Passive scan only</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-emerald-400" /> No PHI collected</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-emerald-400" /> Results in 30 seconds</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-emerald-400" /> HIPAA rule references</span>
          </div>
          <div className="mt-10">
            <Button size="lg" className="bg-red-600 hover:bg-red-700 text-white" asChild>
              <a href="#pricing">Get Your Compliance Score <ArrowRight className="ml-2 h-4 w-4" /></a>
            </Button>
          </div>
        </div>
      </section>

      {/* ═══ TABLE TRAP: PENALTY TIERS ═══ */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle className="h-5 w-5 text-orange-400" />
          <h2 className="text-sm font-medium text-orange-400 tracking-wide uppercase">The Cost of Non-Compliance</h2>
        </div>
        <h3 className="text-3xl font-bold mb-8">HIPAA Penalty Tiers (2024-2026)</h3>
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left p-4 font-semibold">Violation Tier</th>
                <th className="text-left p-4 font-semibold">Min Per Violation</th>
                <th className="text-left p-4 font-semibold">Max Per Violation</th>
                <th className="text-left p-4 font-semibold">Annual Cap</th>
              </tr>
            </thead>
            <tbody>
              {PENALTIES.map((p, i) => (
                <tr key={i} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                  <td className="p-4 font-medium">{p.tier}</td>
                  <td className="p-4 text-muted-foreground">{p.min}</td>
                  <td className="p-4 text-red-400 font-semibold">{p.max}</td>
                  <td className="p-4 text-red-400 font-semibold">{p.annual}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-sm text-muted-foreground">
          Criminal penalties can include fines up to $250,000 and imprisonment up to 10 years for offenses committed with intent to sell PHI.
        </p>
      </section>

      {/* ═══ 51 CHECKS ═══ */}
      <section className="bg-muted/20 border-y border-border/40">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <h2 className="text-3xl font-bold mb-4">51 Checks Across 5 Categories</h2>
          <p className="text-muted-foreground mb-10 max-w-2xl">
            Every check maps to a specific HIPAA Security Rule section (45 CFR Part 164). We test both your public website and patient portal/dashboard.
          </p>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {CHECKS.map((c) => (
              <div key={c.label} className="rounded-xl border border-border bg-card p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-950/50 border border-red-900/30">
                    <c.icon className="h-5 w-5 text-red-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{c.label}</h3>
                    <span className="text-xs text-muted-foreground">{c.count} checks</span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">{c.desc}</p>
              </div>
            ))}
            <div className="rounded-xl border border-dashed border-border bg-card/50 p-6 flex flex-col items-center justify-center text-center">
              <BadgeCheck className="h-8 w-8 text-muted-foreground/50 mb-3" />
              <p className="text-sm text-muted-foreground">+ 7 universal administrative checks requiring organizational attestation</p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ TABLE TRAP: 2026 NPRM CHANGES ═══ */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="flex items-center gap-2 mb-4">
          <Zap className="h-5 w-5 text-amber-400" />
          <h2 className="text-sm font-medium text-amber-400 tracking-wide uppercase">2026 NPRM Changes</h2>
        </div>
        <h3 className="text-3xl font-bold mb-4">What Changes Under the 2026 Rule</h3>
        <p className="text-muted-foreground mb-8 max-w-2xl">
          The &ldquo;addressable&rdquo; loophole is closing. Most organizations will score 20-40 points lower on the NPRM track. Compliance deadline: approximately January 2027.
        </p>
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left p-4 font-semibold">Requirement</th>
                <th className="text-left p-4 font-semibold">Current Rule</th>
                <th className="text-left p-4 font-semibold">2026 NPRM</th>
                <th className="text-left p-4 font-semibold">Impact</th>
              </tr>
            </thead>
            <tbody>
              {NPRM_CHANGES.map((c, i) => (
                <tr key={i} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                  <td className="p-4 font-medium">{c.requirement}</td>
                  <td className="p-4">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      c.current === 'Required' ? 'bg-emerald-950/50 text-emerald-400 border border-emerald-800/30' :
                      c.current === 'Addressable' ? 'bg-amber-950/50 text-amber-400 border border-amber-800/30' :
                      'bg-zinc-800 text-zinc-400 border border-zinc-700'
                    }`}>{c.current}</span>
                  </td>
                  <td className="p-4">
                    <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-red-950/50 text-red-400 border border-red-800/30">
                      {c.nprm}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-muted-foreground">{c.impact}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ═══ STATE COMPLIANCE OVERLAY ═══ */}
      <section className="bg-muted/20 border-y border-border/40">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <h2 className="text-3xl font-bold mb-4">State-Specific Compliance Overlays</h2>
          <p className="text-muted-foreground mb-8 max-w-2xl">
            HIPAA sets the federal floor — many states impose additional requirements. Our scanner applies state-specific overlays to your score.
          </p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {STATES.map((s) => (
              <div key={s.abbr} className="rounded-lg border border-border bg-card p-4">
                <div className="text-lg font-bold">{s.abbr}</div>
                <div className="text-sm text-muted-foreground">{s.law}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ PRICING + CHECKOUT FORM ═══ */}
      <section id="pricing" className="mx-auto max-w-6xl px-6 py-20">
        <h2 className="text-3xl font-bold mb-4 text-center">Choose Your Scan</h2>
        <p className="text-muted-foreground mb-12 text-center max-w-xl mx-auto">
          Both scans include all 51 checks, full remediation roadmap, and HIPAA rule references. Results delivered in 30 seconds.
        </p>

        {/* Plan selector */}
        <div className="grid gap-6 md:grid-cols-2 max-w-3xl mx-auto mb-12">
          {/* Current Law */}
          <button
            onClick={() => setScanType('current')}
            className={`rounded-xl border-2 p-6 text-left transition-all ${
              scanType === 'current' ? 'border-emerald-500 bg-emerald-950/10' : 'border-border hover:border-border/80'
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <Shield className="h-6 w-6 text-emerald-400" />
              {scanType === 'current' && <CheckCircle2 className="h-5 w-5 text-emerald-400" />}
            </div>
            <h3 className="text-xl font-bold mb-1">Current Law Scan</h3>
            <div className="text-3xl font-bold mb-3">$149</div>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" /> 51 automated checks</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" /> Current HIPAA Security Rule scoring</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" /> Full remediation roadmap</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" /> State-specific overlays</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" /> HIPAA rule section references</li>
            </ul>
          </button>

          {/* NPRM 2026 */}
          <button
            onClick={() => setScanType('nprm2026')}
            className={`rounded-xl border-2 p-6 text-left transition-all relative ${
              scanType === 'nprm2026' ? 'border-red-500 bg-red-950/10' : 'border-border hover:border-border/80'
            }`}
          >
            <div className="absolute -top-3 right-4 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full">
              RECOMMENDED
            </div>
            <div className="flex items-center justify-between mb-4">
              <Zap className="h-6 w-6 text-red-400" />
              {scanType === 'nprm2026' && <CheckCircle2 className="h-5 w-5 text-red-400" />}
            </div>
            <h3 className="text-xl font-bold mb-1">2026 NPRM Readiness Scan</h3>
            <div className="text-3xl font-bold mb-3">$249</div>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-red-400 shrink-0" /> Everything in Current Law Scan</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-red-400 shrink-0" /> 2026 NPRM readiness scoring</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-red-400 shrink-0" /> MFA compliance assessment</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-red-400 shrink-0" /> Encryption mandate readiness</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-red-400 shrink-0" /> Head start before Jan 2027 deadline</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-red-400 shrink-0" /> Priority remediation consultation</li>
            </ul>
          </button>
        </div>

        {/* Checkout form */}
        <form onSubmit={handleCheckout} className="max-w-xl mx-auto rounded-xl border border-border bg-card p-8">
          <h3 className="text-xl font-bold mb-6">
            {scanType === 'current' ? 'Current Law Scan' : '2026 NPRM Readiness Scan'} &mdash;{' '}
            <span className={scanType === 'current' ? 'text-emerald-400' : 'text-red-400'}>
              ${scanType === 'current' ? '149' : '249'}
            </span>
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">Website URL *</label>
              <input
                type="url"
                required
                placeholder="https://yourpractice.com"
                value={publicUrl}
                onChange={(e) => setPublicUrl(e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/40"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Dashboard / Portal URL</label>
              <input
                type="url"
                placeholder="https://portal.yourpractice.com (optional)"
                value={dashboardUrl}
                onChange={(e) => setDashboardUrl(e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/40"
              />
              <p className="text-xs text-muted-foreground mt-1">If blank, we scan your website URL for both checks.</p>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Email *</label>
              <input
                type="email"
                required
                placeholder="cto@yourpractice.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/40"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">Entity Type</label>
                <select
                  value={entityType}
                  onChange={(e) => setEntityType(e.target.value)}
                  className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/40"
                >
                  <option value="unsure">Not Sure</option>
                  <option value="covered-entity">Covered Entity</option>
                  <option value="business-associate">Business Associate</option>
                  <option value="both">Both</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">State</label>
                <select
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/40"
                >
                  <option value="">Select State</option>
                  {['AL','AK','AZ','AR','CA','CO','CT','DE','DC','FL','GA','HI','ID','IL','IN','IA','KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT','VA','WA','WV','WI','WY'].map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading || !email || !publicUrl}
            className="w-full mt-6 bg-red-600 hover:bg-red-700 text-white h-12 text-base font-semibold"
          >
            {loading ? 'Redirecting to checkout...' : `Pay & Scan — $${scanType === 'current' ? '149' : '249'}`}
          </Button>

          <div className="flex items-center justify-center gap-4 mt-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><Lock className="h-3 w-3" /> Secure checkout via Stripe</span>
            <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> Results in 30 seconds</span>
          </div>
        </form>
      </section>

      {/* ═══ HOW IT WORKS ═══ */}
      <section className="bg-muted/20 border-y border-border/40">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <h2 className="text-3xl font-bold mb-10 text-center">How It Works</h2>
          <div className="grid gap-8 md:grid-cols-3 max-w-4xl mx-auto">
            {[
              { step: '1', title: 'Enter Your URLs', desc: 'Provide your public website and patient portal/dashboard URL. Select your entity type and state.' },
              { step: '2', title: 'We Scan 51 Checks', desc: 'Our scanner runs passive HTTP checks against both URLs — TLS, headers, privacy notices, auth, data exposure. Zero risk.' },
              { step: '3', title: 'Get Dual Scores + Roadmap', desc: 'Receive your current law score, 2026 NPRM readiness score, all 51 check results, and a prioritized remediation plan.' },
            ].map((s) => (
              <div key={s.step} className="text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-950/50 border border-red-900/30 text-xl font-bold text-red-400">
                  {s.step}
                </div>
                <h3 className="text-lg font-semibold mb-2">{s.title}</h3>
                <p className="text-sm text-muted-foreground">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ FAQ ═══ */}
      <section className="mx-auto max-w-3xl px-6 py-20">
        <h2 className="text-3xl font-bold mb-10 text-center">Frequently Asked Questions</h2>
        <div className="space-y-2">
          {FAQS.map((faq, i) => (
            <div key={i} className="rounded-lg border border-border">
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="flex w-full items-center justify-between p-4 text-left font-medium hover:bg-muted/30 transition-colors"
              >
                {faq.q}
                <ChevronDown className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform ${openFaq === i ? 'rotate-180' : ''}`} />
              </button>
              {openFaq === i && (
                <div className="px-4 pb-4 text-sm text-muted-foreground leading-relaxed">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ═══ BOTTOM CTA ═══ */}
      <section className="border-t border-border/40 bg-gradient-to-b from-red-950/20 to-background">
        <div className="mx-auto max-w-6xl px-6 py-20 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Don&apos;t Wait for an OCR Audit to Find Out
          </h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            The average HIPAA breach costs $10.93 million. A 30-second scan costs $149. The math is simple.
          </p>
          <Button size="lg" className="bg-red-600 hover:bg-red-700 text-white" asChild>
            <a href="#pricing">Scan Your Site Now <ArrowRight className="ml-2 h-4 w-4" /></a>
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  )
}
