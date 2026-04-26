'use client'

import { useState } from 'react'
import { CheckCircle2, Loader2, ArrowUpRight } from 'lucide-react'

export function NotifyForm({ toolSlug, toolName }: { toolSlug: string; toolName: string }) {
  const [email,    setEmail]    = useState('')
  const [name,     setName]     = useState('')
  const [busy,     setBusy]     = useState(false)
  const [done,     setDone]     = useState(false)
  const [err,      setErr]      = useState<string | null>(null)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setBusy(true); setErr(null)
    try {
      const r = await fetch('/api/ai-lead-tools/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name, toolSlug, toolName }),
      })
      if (!r.ok) {
        const d = await r.json().catch(() => ({}))
        throw new Error(d?.error || 'submit_failed')
      }
      setDone(true)
    } catch (e) {
      setErr(e instanceof Error ? e.message : 'submit_failed')
    } finally {
      setBusy(false)
    }
  }

  if (done) {
    return (
      <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-7">
        <CheckCircle2 className="w-7 h-7 text-emerald-400 mb-3" />
        <h3 className="text-xl font-bold mb-2">You&apos;re on the list.</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          We&apos;ll email you the moment <strong className="text-foreground">{toolName}</strong> ships. Your 25%-off launch coupon will arrive in the same message.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={submit} className="rounded-2xl border border-border/60 bg-card/40 p-6">
      <div className="grid gap-3 mb-3">
        <Field label="Name (optional)" value={name} onChange={setName} />
        <Field label="Email *" type="email" value={email} onChange={setEmail} required />
      </div>
      {err && (
        <div className="px-3 py-2 rounded-lg border border-rose-500/30 bg-rose-500/5 text-rose-300 text-xs">{err.replace(/_/g, ' ')}</div>
      )}
      <button
        type="submit"
        disabled={busy || !email.trim()}
        className="mt-4 w-full inline-flex items-center justify-center gap-2 h-12 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-black font-bold text-sm disabled:opacity-50 hover:brightness-110"
      >
        {busy ? <><Loader2 className="w-4 h-4 animate-spin" /> Adding…</> : <>Notify me + send my 25% coupon <ArrowUpRight className="w-4 h-4" /></>}
      </button>
      <p className="text-[11px] text-muted-foreground text-center mt-3">No spam. Just the launch email + your coupon.</p>
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
