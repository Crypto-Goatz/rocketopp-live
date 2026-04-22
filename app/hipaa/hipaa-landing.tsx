'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Shield, CheckCircle2, Lock, Eye, Server, Users, FileWarning, ArrowRight, Clock, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Footer from '@/components/footer'

const CHECKS = [
  { icon: Lock, label: 'Transport Security', count: 14, desc: 'TLS, HSTS, certificates, redirect chains, encryption-in-transit' },
  { icon: Eye, label: 'Privacy Disclosures', count: 10, desc: 'Notice of Privacy Practices, CMS disclosure, content freshness' },
  { icon: Server, label: 'Security Headers', count: 13, desc: 'CSP, X-Frame-Options, CORS, wildcard origin, server exposure' },
  { icon: Users, label: 'Authentication Controls', count: 12, desc: 'MFA, session cookies, open registration, rate limiting' },
  { icon: FileWarning, label: 'Data Exposure', count: 14, desc: 'phpinfo, EOL software, trackers without BAA, exposed logs' },
]

const FAQS = [
  { q: 'What does the scanner check?', a: 'Our scanner runs 63 automated checks across 5 categories: transport security, privacy disclosures, security headers, authentication controls, and data exposure. Every check maps to a specific HIPAA Security Rule section.' },
  { q: 'Is it safe for my website?', a: 'Completely safe. The scan is entirely passive — standard HTTP requests only. It never logs in, submits forms, or accesses patient data.' },
  { q: 'What do I get with the free scan?', a: 'You get your dual compliance scores (current law + 2026 NPRM), letter grades, and finding counts. The full report includes all 63 individual check results, detailed remediation steps, and a prioritized action plan.' },
  { q: 'What is the HIPAA 2026 NPRM?', a: 'The Notice of Proposed Rulemaking published by HHS proposes sweeping changes: MFA becomes mandatory, encryption at rest required, vulnerability scans every 6 months, and the "addressable" category is eliminated. Compliance deadline: approximately January 2027.' },
  { q: 'Who needs this?', a: 'Any organization handling ePHI: hospitals, clinics, health plans, billing companies, IT providers, and their subcontractors. If you have a patient portal or healthcare website, you need this.' },
]

export function HIPAALanding() {
  const [email, setEmail] = useState('')
  const [publicUrl, setPublicUrl] = useState('')
  const [dashboardUrl, setDashboardUrl] = useState('')
  const [entityType, setEntityType] = useState('unsure')
  const [state, setState] = useState('')
  const [loading, setLoading] = useState(false)
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const router = useRouter()

  async function handleScan(e: React.FormEvent) {
    e.preventDefault()
    if (!publicUrl) return
    setLoading(true)
    // Navigate to results page with params
    const params = new URLSearchParams({
      url: publicUrl,
      ...(dashboardUrl && { dashboardUrl }),
      ...(email && { email }),
      entityType,
      ...(state && { state }),
    })
    router.push(`/hipaa/results?${params}`)
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
            63 automated checks. Dual scoring against current law and the proposed 2026 NPRM.
            Results in 30 seconds. Free instant scan — full report available on demand.
          </p>
          <div className="mt-8 flex flex-wrap gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-emerald-400" /> Free instant scan</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-emerald-400" /> No PHI collected</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-emerald-400" /> Results in 30 seconds</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-emerald-400" /> 63 HIPAA checks</span>
          </div>
        </div>
      </section>

      {/* ═══ SCAN FORM ═══ */}
      <section id="scan" className="mx-auto max-w-6xl px-6 py-20">
        <div className="max-w-xl mx-auto">
          <h2 className="text-2xl font-bold mb-2 text-center">Scan Your Website — Free</h2>
          <p className="text-muted-foreground mb-8 text-center text-sm">Get your compliance scores instantly. No credit card required.</p>

          <form onSubmit={handleScan} className="rounded-xl border border-border bg-card p-8 space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">Website URL *</label>
              <input type="url" required placeholder="https://yourpractice.com" value={publicUrl} onChange={e => setPublicUrl(e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/40" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Dashboard / Portal URL</label>
              <input type="url" placeholder="https://portal.yourpractice.com (optional)" value={dashboardUrl} onChange={e => setDashboardUrl(e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/40" />
              <p className="text-xs text-muted-foreground mt-1">If blank, we scan your main URL for both checks.</p>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Email</label>
              <input type="email" placeholder="your@email.com (for report delivery)" value={email} onChange={e => setEmail(e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/40" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">Entity Type</label>
                <select value={entityType} onChange={e => setEntityType(e.target.value)}
                  className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/40">
                  <option value="unsure">Not Sure</option>
                  <option value="covered-entity">Covered Entity</option>
                  <option value="business-associate">Business Associate</option>
                  <option value="both">Both</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">State</label>
                <select value={state} onChange={e => setState(e.target.value)}
                  className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/40">
                  <option value="">Select State</option>
                  {['AL','AK','AZ','AR','CA','CO','CT','DE','DC','FL','GA','HI','ID','IL','IN','IA','KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT','VA','WA','WV','WI','WY'].map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>

            <Button type="submit" disabled={loading || !publicUrl}
              className="w-full bg-red-600 hover:bg-red-700 text-white h-12 text-base font-semibold">
              {loading ? 'Starting scan...' : 'Scan Now — Free'}
            </Button>

            <div className="flex items-center justify-center gap-4 mt-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><Lock className="h-3 w-3" /> Passive scan only</span>
              <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> ~30 seconds</span>
            </div>

            {/* 0nCore badge */}
            <div className="flex items-center justify-center pt-4 border-t border-border/50 mt-4">
              <a href="https://0ncore.com" target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 text-xs text-muted-foreground/60 hover:text-muted-foreground transition-colors">
                <img src="https://0ncore.com/brand/0ncore-icon.png" alt="" className="h-4 w-4 rounded" style={{ filter: 'grayscale(0.3)' }} />
                Powered by 0nCore AI Tools
              </a>
            </div>
          </form>
        </div>
      </section>

      {/* ═══ 63 CHECKS ═══ */}
      <section className="bg-muted/20 border-y border-border/40">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <h2 className="text-3xl font-bold mb-4">63 Checks Across 5 Categories</h2>
          <p className="text-muted-foreground mb-10 max-w-2xl">Every check maps to a specific HIPAA Security Rule section (45 CFR Part 164).</p>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {CHECKS.map(c => (
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
          </div>
        </div>
      </section>

      {/* ═══ FAQ ═══ */}
      <section className="mx-auto max-w-3xl px-6 py-20">
        <h2 className="text-3xl font-bold mb-10 text-center">Frequently Asked Questions</h2>
        <div className="space-y-2">
          {FAQS.map((faq, i) => (
            <div key={i} className="rounded-lg border border-border">
              <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="flex w-full items-center justify-between p-4 text-left font-medium hover:bg-muted/30 transition-colors">
                {faq.q}
                <ChevronDown className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform ${openFaq === i ? 'rotate-180' : ''}`} />
              </button>
              {openFaq === i && <div className="px-4 pb-4 text-sm text-muted-foreground leading-relaxed">{faq.a}</div>}
            </div>
          ))}
        </div>
      </section>

      {/* ═══ BOTTOM CTA ═══ */}
      <section className="border-t border-border/40 bg-gradient-to-b from-red-950/20 to-background">
        <div className="mx-auto max-w-6xl px-6 py-20 text-center">
          <h2 className="text-3xl font-bold mb-4">Don&apos;t Wait for an OCR Audit</h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            The average HIPAA breach costs $10.93 million. A 30-second scan is free.
          </p>
          <Button size="lg" className="bg-red-600 hover:bg-red-700 text-white" asChild>
            <a href="#scan">Scan Your Site Now — Free <ArrowRight className="ml-2 h-4 w-4" /></a>
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  )
}
