'use client'

/**
 * Onboarding lock-in capture form.
 *
 * Sits at /onboarding/[slug] until the full AI builder wizard ships.
 * Captures email + intent and posts to /api/onboarding/lock-in which
 * (a) records the intent and (b) forwards a notification to the CRM
 * webhook so a strategist can kick off onboarding within an hour.
 */

import { useState } from 'react'
import { ArrowUpRight, Loader2, CheckCircle2 } from 'lucide-react'

interface ProductSlim {
  slug: string
  name: string
  priceLabel: string
  priceCents: number
  recurring?: 'month'
}

export function OnboardingLockIn({ product }: { product: ProductSlim }) {
  const [email, setEmail] = useState('')
  const [name, setName]   = useState('')
  const [phone, setPhone] = useState('')
  const [notes, setNotes] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone]   = useState(false)
  const [err, setErr]     = useState<string | null>(null)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true); setErr(null)
    try {
      const r = await fetch('/api/onboarding/lock-in', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productSlug: product.slug,
          productName: product.name,
          priceCents:  product.priceCents,
          priceLabel:  product.priceLabel,
          recurring:   product.recurring || null,
          email, name, phone, notes,
        }),
      })
      if (!r.ok) {
        const d = await r.json().catch(() => ({}))
        throw new Error(d?.error || 'submit_failed')
      }
      setDone(true)
    } catch (e) {
      setErr(e instanceof Error ? e.message : 'submit_failed')
    } finally {
      setSubmitting(false)
    }
  }

  if (done) {
    return (
      <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-7">
        <CheckCircle2 className="w-7 h-7 text-emerald-400 mb-3" />
        <h3 className="text-xl font-bold mb-2">Locked in. Welcome aboard.</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Your <strong>{product.priceLabel}{product.recurring ? `/${product.recurring}` : ''}</strong> price for <strong>{product.name}</strong> is held.
          A RocketOpp strategist will email you within <strong>1 business hour</strong> with the next step.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={submit} className="rounded-2xl border border-border/60 bg-card/40 p-6">
      <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-4">— Reserve your build slot</div>
      <div className="grid md:grid-cols-2 gap-3 mb-3">
        <Field label="Name *" value={name} onChange={setName} required />
        <Field label="Email *" type="email" value={email} onChange={setEmail} required />
      </div>
      <Field label="Phone (optional)" type="tel" value={phone} onChange={setPhone} />
      <label className="block mt-3">
        <span className="block text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1.5">Anything we should know?</span>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          placeholder="Existing site URL, brand assets you have ready, deadline pressure, etc."
          className="w-full bg-background border border-border/60 rounded-lg px-3 py-2 text-sm focus:border-primary/60 outline-none"
        />
      </label>

      {err && (
        <div className="mt-3 px-3 py-2 rounded-lg border border-rose-500/30 bg-rose-500/5 text-rose-300 text-xs">
          {err.replace(/_/g, ' ')}
        </div>
      )}

      <button
        type="submit"
        disabled={submitting || !name.trim() || !email.trim()}
        className="mt-5 w-full inline-flex items-center justify-center gap-2 h-12 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-black font-bold text-sm disabled:opacity-50 hover:brightness-110"
      >
        {submitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Locking in…</> : <>Lock in {product.priceLabel}{product.recurring ? `/${product.recurring}` : ''} <ArrowUpRight className="w-4 h-4" /></>}
      </button>
      <p className="text-[11px] text-muted-foreground text-center mt-3">
        No charge yet. We confirm scope and the locked-in price by email before any payment.
      </p>
    </form>
  )
}

function Field({ label, value, onChange, type = 'text', required = false }: {
  label: string; value: string; onChange: (v: string) => void; type?: string; required?: boolean
}) {
  return (
    <label className="block">
      <span className="block text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1.5">{label}</span>
      <input
        type={type}
        value={value}
        required={required}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-background border border-border/60 rounded-lg h-10 px-3 text-sm focus:border-primary/60 outline-none"
      />
    </label>
  )
}
