'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowRight, ShieldCheck, CheckCircle2, Loader2, AlertTriangle, Gift, ArrowLeft } from 'lucide-react'

interface Props { assessmentId: string; defaultEmail: string; defaultCompany: string }

export function OrderForm({ assessmentId, defaultEmail, defaultCompany }: Props) {
  const [email, setEmail]     = useState(defaultEmail)
  const [company, setCompany] = useState(defaultCompany)
  const [name, setName]       = useState('')
  const [loading, setLoading] = useState(false)
  const [err, setErr]         = useState<string | null>(null)
  const [placed, setPlaced]   = useState<{ orderId: string; pdfUrl?: string | null } | null>(null)

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
        }),
      })
      const data = await r.json()
      if (!r.ok) throw new Error(data?.error || 'order_failed')
      setPlaced({ orderId: data.orderId, pdfUrl: data.pdfUrl })
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
          We&rsquo;ve emailed your initial findings PDF to <strong className="text-foreground">{email}</strong>. Your full HIPAA readiness report will arrive within the next 60 minutes.
        </p>
        {placed.pdfUrl && (
          <a
            href={placed.pdfUrl}
            target="_blank"
            rel="noopener"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-lg border border-orange-500/40 bg-orange-500/10 text-orange-400 hover:bg-orange-500/20 transition-colors font-semibold"
          >
            Download initial findings PDF <ArrowRight className="w-4 h-4" />
          </a>
        )}
        <div className="mt-8 text-xs text-muted-foreground">
          Order reference: <code className="font-mono">{placed.orderId}</code>
        </div>
        <div className="mt-6">
          <Link href="/hipaa" className="text-sm text-muted-foreground hover:text-foreground underline underline-offset-2 inline-flex items-center gap-1">
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
        <p className="text-sm text-muted-foreground">
          Complete your details and we&rsquo;ll generate the full 51-point report. Initial findings PDF arrives immediately; the full readiness report within 60 minutes.
        </p>
      </div>

      <form onSubmit={submit} className="p-6 md:p-8 space-y-4">
        <div className="flex items-center gap-3 p-4 rounded-lg border border-emerald-500/30 bg-emerald-500/5">
          <Gift className="w-5 h-5 text-emerald-400 shrink-0" />
          <div>
            <div className="text-sm font-semibold">Test launch — free for a limited window</div>
            <div className="text-xs text-muted-foreground">Normally $249. No payment required right now.</div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">Email *</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            required
            className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:border-orange-500 outline-none text-sm"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">Your name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              type="text"
              placeholder="Jane Clinician"
              className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:border-orange-500 outline-none text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">Company</label>
            <input
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              type="text"
              placeholder="Acme Health"
              className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:border-orange-500 outline-none text-sm"
            />
          </div>
        </div>

        {err && (
          <div className="flex items-center gap-2 p-3 rounded-lg border border-rose-500/30 bg-rose-500/10 text-sm text-rose-400">
            <AlertTriangle className="w-4 h-4" /> {err}
          </div>
        )}

        <button
          type="submit"
          disabled={loading || !email}
          className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 rounded-lg bg-gradient-to-r from-orange-500 to-rose-500 text-white font-bold text-base hover:opacity-90 transition-opacity disabled:opacity-40"
        >
          {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Placing order…</> : <>Order my full report now <ArrowRight className="w-4 h-4" /></>}
        </button>

        <p className="text-[11px] text-center text-muted-foreground">
          We&rsquo;ll email the initial findings PDF to this address immediately. Full report follows within 60 minutes.
        </p>
      </form>
    </section>
  )
}
