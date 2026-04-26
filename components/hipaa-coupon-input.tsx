'use client'

/**
 * <HipaaCouponInput> — a small drop-in coupon entry that validates against
 * Stripe via /api/hipaa/coupon/validate and surfaces the savings preview.
 *
 * Calls onApply with the validated couponId so the parent form can pass
 * it into /api/hipaa/checkout. Designed to slot into the pricing strip on
 * /hipaa or any tier card.
 */

import { useState } from 'react'
import { Tag, Check, X, Loader2 } from 'lucide-react'

interface Validated {
  couponId:     string
  name?:        string | null
  percentOff?:  number | null
  amountOff?:   number | null
  finalCents?:  number
  savingsCents?: number
}

export function HipaaCouponInput({
  baseAmountCents,
  onApply,
  onClear,
  className = '',
}: {
  baseAmountCents: number
  onApply?: (v: Validated) => void
  onClear?: () => void
  className?: string
}) {
  const [open, setOpen]       = useState(false)
  const [code, setCode]       = useState('')
  const [busy, setBusy]       = useState(false)
  const [err,  setErr]        = useState<string | null>(null)
  const [valid, setValid]     = useState<Validated | null>(null)

  async function apply() {
    setBusy(true); setErr(null)
    try {
      const r = await fetch('/api/hipaa/coupon/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: code.trim(), baseAmountCents }),
      })
      const d = await r.json()
      if (!r.ok || !d.ok) throw new Error(d?.error || 'invalid_code')
      const v: Validated = {
        couponId:    d.couponId,
        name:        d.name,
        percentOff:  d.percentOff,
        amountOff:   d.amountOff,
        finalCents:  d.finalCents,
        savingsCents: d.savingsCents,
      }
      setValid(v)
      onApply?.(v)
    } catch (e) {
      setErr(e instanceof Error ? e.message : 'invalid_code')
    } finally {
      setBusy(false)
    }
  }

  function clear() {
    setValid(null); setCode(''); setErr(null)
    onClear?.()
  }

  if (!open && !valid) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`inline-flex items-center gap-2 text-xs font-semibold text-white/60 hover:text-white transition ${className}`}
      >
        <Tag className="w-3.5 h-3.5" /> Have a code?
      </button>
    )
  }

  if (valid) {
    const dollars = (valid.savingsCents ?? 0) / 100
    const finalDollars = (valid.finalCents ?? baseAmountCents) / 100
    return (
      <div className={`inline-flex items-center gap-3 px-3 py-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 ${className}`}>
        <Check className="w-4 h-4 text-emerald-400 shrink-0" />
        <div className="text-xs">
          <div className="font-bold text-emerald-300">
            <span className="font-mono">{valid.couponId}</span> applied
          </div>
          <div className="text-white/70">
            {valid.percentOff ? `${valid.percentOff}% off` : `$${dollars.toFixed(2)} off`}
            {' · '}
            <span className="text-emerald-300 font-bold">${finalDollars.toFixed(2)}</span> final
          </div>
        </div>
        <button onClick={clear} className="text-white/40 hover:text-white" aria-label="Remove coupon">
          <X className="w-4 h-4" />
        </button>
      </div>
    )
  }

  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      <div className="relative">
        <Tag className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none" />
        <input
          autoFocus
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          onKeyDown={(e) => { if (e.key === 'Enter' && code.trim()) apply() }}
          placeholder="LAUNCH25"
          className="h-9 w-36 pl-8 pr-3 rounded-md border border-white/15 bg-black/40 text-xs font-mono uppercase tracking-widest text-white placeholder:text-white/25 focus:outline-none focus:border-orange-500/60"
        />
      </div>
      <button
        type="button"
        onClick={apply}
        disabled={busy || !code.trim()}
        className="h-9 px-3 rounded-md border border-orange-500/30 bg-orange-500/10 text-orange-300 text-xs font-bold hover:bg-orange-500/20 disabled:opacity-50 inline-flex items-center gap-1.5"
      >
        {busy ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Apply'}
      </button>
      {err && (
        <span className="text-[11px] text-rose-300">{err === 'invalid_or_expired_code' ? "Invalid or expired code" : err.replace(/_/g, ' ')}</span>
      )}
      <button onClick={() => { setOpen(false); setErr(null); setCode('') }} className="text-white/35 hover:text-white text-xs" aria-label="Close">
        <X className="w-4 h-4" />
      </button>
    </div>
  )
}
