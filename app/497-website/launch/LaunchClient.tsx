'use client'

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { ArrowRight, Check, CreditCard, Loader2, PartyPopper, Phone } from 'lucide-react'

import { PRICING, quote } from '@/lib/offer'

const PHONE_DISPLAY = '(878) 888-1230'
const PHONE_HREF = 'tel:+1-878-888-1230'

/**
 * Launch payment page — the second half of the order, sent when a site goes live.
 *
 * Collects the balance AND starts the monthly in one Stripe session, so there is
 * never a state where the build is fully paid but the monthly never began.
 *
 * Every figure reads from lib/offer.ts quote() so this page cannot quote a number
 * the checkout and emails contradict.
 */
export default function LaunchClient() {
  const params = useSearchParams()
  const paid = params.get('paid') === '1'
  const cancelled = params.get('cancelled') === '1'

  // The plan can be pre-set in the link Mike sends: ?plan=wordpress
  const planFromUrl = (params.get('plan') || '').toLowerCase() === 'wordpress'
  const [wordpress, setWordpress] = useState(planFromUrl)
  const [email, setEmail] = useState(params.get('email') || '')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const q = quote(wordpress)
  const monthly = wordpress ? PRICING.wordpress.monthlyCents : PRICING.base.monthlyCents

  async function pay() {
    if (loading) return
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/offer/launch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, wordpress }),
      })
      const json = await res.json()
      if (!res.ok || !json.url) {
        setError(json.error || 'Could not start checkout.')
        setLoading(false)
        return
      }
      window.location.href = json.url
    } catch {
      setError(`Could not reach checkout. Please call ${PHONE_DISPLAY}.`)
      setLoading(false)
    }
  }

  const field =
    'w-full rounded-lg border border-border bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary'

  if (paid) {
    return (
      <div className="container mx-auto max-w-xl px-4 py-24 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/15">
          <PartyPopper className="h-7 w-7 text-primary" />
        </div>
        <h1 className="mt-6 text-3xl font-bold tracking-tight">Paid in full — your site is live.</h1>
        <p className="mt-4 leading-relaxed text-muted-foreground">
          Receipt is on its way by email. Your monthly has started and you can cancel it any time
          just by asking. From here, changes are as simple as telling us what you want in plain
          English — no dashboard, no tickets.
        </p>
        <a
          href={PHONE_HREF}
          className="mt-8 inline-flex items-center gap-2 rounded-lg border border-border px-6 py-3 font-semibold transition-colors hover:border-primary/40"
        >
          <Phone className="h-4 w-4" />
          {PHONE_DISPLAY}
        </a>
      </div>
    )
  }

  return (
    <div className="container mx-auto max-w-2xl px-4 py-16 md:py-20">
      {cancelled && (
        <div className="mb-8 rounded-xl border border-border bg-card p-4 text-center text-sm text-muted-foreground">
          Checkout was cancelled — nothing was charged. Call {PHONE_DISPLAY} with any questions.
        </div>
      )}

      <div className="text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary">
          <Check className="h-4 w-4" />
          Your site is live
        </span>
        <h1 className="mt-6 text-4xl font-bold tracking-tight md:text-5xl">Final step</h1>
        <p className="mx-auto mt-4 max-w-lg text-lg text-muted-foreground">
          This settles the build and starts the monthly that keeps your site hosted and running.
        </p>
      </div>

      <div className="sheen-border mt-12 rounded-3xl p-7 sm:p-8">
        <div className="flex items-end gap-3">
          <span className="font-mono text-5xl font-bold leading-none tracking-tight">{q.launch}</span>
          <span className="pb-1 text-sm text-muted-foreground">today</span>
        </div>

        <dl className="mt-6 divide-y divide-border rounded-xl border border-border">
          <div className="flex items-center justify-between px-4 py-2.5">
            <dt className="text-sm text-muted-foreground">Already paid at signup</dt>
            <dd className="font-mono text-sm text-muted-foreground line-through">{q.signup}</dd>
          </div>
          <div className="flex items-center justify-between px-4 py-2.5">
            <dt className="text-sm font-medium">Balance today</dt>
            <dd className="font-mono text-sm font-bold">{q.launch}</dd>
          </div>
          <div className="flex items-center justify-between bg-muted/20 px-4 py-2.5">
            <dt className="text-sm font-medium">Build total</dt>
            <dd className="font-mono text-sm font-bold">{q.buildTotal}</dd>
          </div>
          <div className="flex items-center justify-between px-4 py-2.5">
            <dt className="text-sm text-muted-foreground">
              Then monthly
              <span className="block text-xs text-muted-foreground/70">
                {wordpress ? 'Hosting + AI management' : 'Hosting + platform'} · cancel any time
              </span>
            </dt>
            <dd className="font-mono text-sm font-semibold">${monthly / 100}/mo</dd>
          </div>
        </dl>

        <label className="mt-5 flex cursor-pointer gap-3 rounded-xl border border-border bg-muted/10 p-4 text-sm transition-colors hover:border-primary/40">
          <input
            type="checkbox"
            checked={wordpress}
            onChange={(e) => setWordpress(e.target.checked)}
            className="mt-0.5 h-4 w-4 shrink-0 accent-current text-primary"
          />
          <span className="text-muted-foreground">
            This build is on <span className="font-semibold text-foreground">WordPress</span> — tick
            to use the WordPress totals ($372 today, $80/mo).
          </span>
        </label>

        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your email (for the receipt)"
          autoComplete="email"
          className={`${field} mt-5`}
        />

        {error && (
          <p className="mt-4 rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm">
            {error}
          </p>
        )}

        <button
          onClick={pay}
          disabled={loading}
          className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-6 py-4 text-base font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          {loading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" /> Opening secure checkout…
            </>
          ) : (
            <>
              <CreditCard className="h-5 w-5" /> Pay {q.launch} &amp; start ${monthly / 100}/mo
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
        <p className="mt-3 text-center text-xs text-muted-foreground">
          Secure checkout via Stripe. The monthly can be cancelled any time — just ask.
        </p>
      </div>
    </div>
  )
}
