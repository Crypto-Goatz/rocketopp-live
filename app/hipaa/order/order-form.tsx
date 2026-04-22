'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  ArrowRight, ShieldCheck, CheckCircle2, Loader2, AlertTriangle, Gift, ArrowLeft,
  Code2, FileText, Telescope, Crown, Check,
} from 'lucide-react'

interface Props { assessmentId: string; defaultEmail: string; defaultCompany: string }

type Tier = 1 | 2 | 3 | 4

const TIERS: {
  id: Tier
  name: string
  tagline: string
  price: number
  anchor?: number
  accent: string
  icon: React.ReactNode
  bullets: string[]
  cta: string
  recommended?: boolean
}[] = [
  {
    id: 1, name: 'Current HIPAA', tagline: 'Cited issues + plain-English explanations',
    price: 149, accent: 'from-sky-500 to-cyan-500',
    icon: <FileText className="w-5 h-5" />,
    bullets: [
      'All 14 remediation items from your scan',
      'Every finding cited to 45 CFR',
      'Plain-English explanations',
      'Priority-ordered action list',
    ],
    cta: 'Choose Current',
  },
  {
    id: 2, name: 'Developer Fix Kit', tagline: 'Current + exact code your dev team pastes in',
    price: 399, accent: 'from-violet-500 to-fuchsia-500',
    icon: <Code2 className="w-5 h-5" />,
    bullets: [
      'Everything in Current',
      'Step-by-step code + shell + config',
      'Stack-aware (Next.js, WP, Laravel, etc.)',
      'Verification commands per fix',
    ],
    cta: 'Choose Dev Kit',
  },
  {
    id: 3, name: '+ 2026 NPRM Overlay', tagline: 'Forward-looking compliance for the new rule',
    price: 499, accent: 'from-orange-500 to-rose-500',
    icon: <Telescope className="w-5 h-5" />,
    bullets: [
      'Everything in Current',
      'Side-by-side NPRM 2026 delta per finding',
      'Related NPRM changes that impact you',
      'Future-readiness checklist',
    ],
    cta: 'Choose NPRM',
  },
  {
    id: 4, name: 'Full Compliance', tagline: 'Everything above + 60-day support call',
    price: 899, anchor: 1499, accent: 'from-emerald-500 via-orange-500 to-rose-500',
    icon: <Crown className="w-5 h-5" />,
    recommended: true,
    bullets: [
      'Everything in Tiers 1–3 combined',
      '60-day free support call — 30 min, 1:1',
      'Developer code + NPRM analysis per finding',
      'Priority remediation w/ time estimates',
    ],
    cta: 'Choose Full',
  },
]

export function OrderForm({ assessmentId, defaultEmail, defaultCompany }: Props) {
  const [tier, setTier]       = useState<Tier>(4)
  const [email, setEmail]     = useState(defaultEmail)
  const [company, setCompany] = useState(defaultCompany)
  const [name, setName]       = useState('')
  const [loading, setLoading] = useState(false)
  const [err, setErr]         = useState<string | null>(null)
  const [placed, setPlaced]   = useState<{ orderId: string; pdfUrl?: string | null; viewUrl?: string | null; supportCall?: { url: string; expiresAt: string } | null } | null>(null)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setErr(null)
    if (!assessmentId) { setErr('Missing scan reference. Run the free scan again.'); return }
    if (!email) { setErr('Email is required.'); return }
    setLoading(true)
    try {
      const r = await fetch('/api/hipaa/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          assessmentId,
          customerEmail: email,
          customerName: name || null,
          companyName: company || null,
          sourceSite: 'rocketopp.com',
          tier,
          freeTest: true,
        }),
      })
      const data = await r.json()
      if (!r.ok) throw new Error(data?.error || 'order_failed')
      setPlaced({
        orderId: data.orderId,
        pdfUrl: data.pdfUrl,
        viewUrl: data.reportViewUrl,
        supportCall: data.supportCall,
      })
    } catch (e) {
      setErr(e instanceof Error ? e.message : 'Order failed')
    } finally { setLoading(false) }
  }

  if (placed) {
    return (
      <section className="rounded-2xl border border-border bg-card p-8 md:p-10 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 mb-5">
          <CheckCircle2 className="w-8 h-8 text-emerald-400" />
        </div>
        <h1 className="text-3xl font-bold mb-3">Order received</h1>
        <p className="text-base text-muted-foreground mb-6">
          Initial findings PDF sent to <strong className="text-foreground">{email}</strong>. Your full Tier {tier} report is generating and will be ready within 15 minutes.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg mx-auto mb-6">
          {placed.viewUrl && (
            <a href={placed.viewUrl} target="_blank" rel="noopener"
               className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-gradient-to-r from-orange-500 to-rose-500 text-white font-semibold hover:opacity-90 transition-opacity">
              Open full report <ArrowRight className="w-4 h-4" />
            </a>
          )}
          {placed.pdfUrl && (
            <a href={placed.pdfUrl} target="_blank" rel="noopener"
               className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg border border-orange-500/40 bg-orange-500/10 text-orange-400 hover:bg-orange-500/20 transition-colors font-semibold">
              Download initial PDF
            </a>
          )}
        </div>

        {placed.supportCall && (
          <div className="mt-4 max-w-lg mx-auto rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-4 text-left">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-400 mb-1">
              <Crown className="w-3.5 h-3.5" /> 60-day free support call included
            </div>
            <p className="text-sm text-muted-foreground mb-3">Book anytime within 60 days. 30 minutes with a compliance engineer.</p>
            <a href={placed.supportCall.url} target="_blank" rel="noopener"
               className="inline-flex items-center gap-1 text-sm font-semibold underline underline-offset-4">
              Book your call →
            </a>
          </div>
        )}

        <div className="mt-8 text-xs text-muted-foreground">Order reference: <code className="font-mono">{placed.orderId}</code></div>
        <div className="mt-6 flex flex-wrap gap-3 justify-center text-sm">
          <Link href="/dashboard/hipaa" className="text-muted-foreground hover:text-foreground underline underline-offset-2">
            View all your reports →
          </Link>
          <Link href="/hipaa" className="text-muted-foreground hover:text-foreground underline underline-offset-2 inline-flex items-center gap-1">
            <ArrowLeft className="w-3 h-3" /> Back to scanner
          </Link>
        </div>
      </section>
    )
  }

  return (
    <section className="rounded-2xl border border-border bg-card overflow-hidden">
      <div className="p-6 md:p-8 border-b border-border bg-gradient-to-br from-orange-500/5 to-transparent">
        <Link href="/hipaa" className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground mb-4">
          <ArrowLeft className="w-3 h-3" /> Back to scan
        </Link>
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-orange-500/30 bg-orange-500/5 text-orange-400 text-xs font-semibold uppercase tracking-[0.18em] mb-4">
          <ShieldCheck className="w-3.5 h-3.5" /> Powered by 0nCore AI Tools
        </div>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">Order your full report</h1>
        <p className="text-sm text-muted-foreground">Pick the tier that matches how deep you need to go. Initial findings PDF arrives immediately; the full report lands within 15 minutes.</p>
      </div>

      {/* Tier grid */}
      <div className="p-6 md:p-8 grid grid-cols-1 lg:grid-cols-2 gap-3">
        {TIERS.map((t) => {
          const active = t.id === tier
          return (
            <button
              type="button"
              key={t.id}
              onClick={() => setTier(t.id)}
              className={`relative text-left rounded-xl border p-5 transition-all ${active ? 'border-orange-500 bg-gradient-to-br from-orange-500/5 to-rose-500/5 shadow-lg shadow-orange-500/10' : 'border-border hover:border-foreground/25'}`}
            >
              {t.recommended && (
                <div className="absolute -top-2 right-4 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 text-white shadow">Recommended</div>
              )}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center bg-gradient-to-br ${t.accent} text-white`}>
                    {t.icon}
                  </div>
                  <div>
                    <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Tier {t.id}</div>
                    <div className="font-bold text-base">{t.name}</div>
                  </div>
                </div>
                <div className="text-right">
                  {t.anchor && (
                    <div className="text-xs text-muted-foreground line-through tabular-nums">${t.anchor}</div>
                  )}
                  <div className="text-2xl font-bold tabular-nums">${t.price}</div>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mb-3">{t.tagline}</p>
              <ul className="space-y-1.5">
                {t.bullets.map((b, i) => (
                  <li key={i} className="flex gap-2 text-xs text-foreground/80">
                    <Check className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${active ? 'text-orange-400' : 'text-emerald-400'}`} />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
              {active && (
                <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-orange-500 flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4 text-white" />
                </div>
              )}
            </button>
          )
        })}
      </div>

      <form onSubmit={submit} className="p-6 md:p-8 space-y-4 border-t border-border bg-muted/10">
        <div className="flex items-center gap-3 p-4 rounded-lg border border-emerald-500/30 bg-emerald-500/5">
          <Gift className="w-5 h-5 text-emerald-400 shrink-0" />
          <div>
            <div className="text-sm font-semibold">Test launch — free for a limited window</div>
            <div className="text-xs text-muted-foreground">Tier {tier} ({TIERS.find((t) => t.id === tier)?.name}) · normally ${TIERS.find((t) => t.id === tier)?.price} · no payment required right now.</div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">Email *</label>
          <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required
            className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:border-orange-500 outline-none text-sm" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">Your name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} type="text" placeholder="Jane Clinician"
              className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:border-orange-500 outline-none text-sm" />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">Company</label>
            <input value={company} onChange={(e) => setCompany(e.target.value)} type="text" placeholder="Acme Health"
              className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:border-orange-500 outline-none text-sm" />
          </div>
        </div>

        {err && (
          <div className="flex items-center gap-2 p-3 rounded-lg border border-rose-500/30 bg-rose-500/10 text-sm text-rose-400">
            <AlertTriangle className="w-4 h-4" /> {err}
          </div>
        )}

        <button type="submit" disabled={loading || !email}
          className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 rounded-lg bg-gradient-to-r from-orange-500 to-rose-500 text-white font-bold text-base hover:opacity-90 transition-opacity disabled:opacity-40">
          {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Placing order…</> : <>Order Tier {tier} now <ArrowRight className="w-4 h-4" /></>}
        </button>

        <p className="text-[11px] text-center text-muted-foreground">
          Initial findings PDF sent immediately. Full report within 15 minutes.
        </p>
      </form>
    </section>
  )
}
