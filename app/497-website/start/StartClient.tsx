'use client'

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { ArrowRight, CalendarCheck, Check, CreditCard, Loader2, Phone, ShieldCheck } from 'lucide-react'

import { WORDPRESS_OFFER, quote } from '@/lib/offer'
import BookingCalendar from '@/components/calendar/booking-calendar'

const PHONE_DISPLAY = '(878) 888-1230'
const PHONE_HREF = 'tel:+1-878-888-1230'

/**
 * Deposit + booking page reached from the $497 confirmation email.
 *
 * Two actions, one page: pay the signup amount to lock the build slot, and book
 * the kickoff. The balance is stated on the page, in the Stripe line item, and in
 * the email — a deposit page that hides the remainder is a bait-and-switch.
 *
 * The calendar is our own (components/calendar/booking-calendar.tsx) writing into
 * the CRM via /api/calendar/book, not the CRM's booking iframe. `bookingUrl` is
 * still accepted as the fallback link shown if a visitor cannot use the widget.
 */
export default function StartClient({ bookingUrl }: { bookingUrl: string }) {
  const params = useSearchParams()
  const paid = params.get('paid') === '1'
  const cancelled = params.get('cancelled') === '1'

  const [email, setEmail] = useState('')
  const [business, setBusiness] = useState('')
  const [wordpress, setWordpress] = useState(false)

  // All figures come from lib/offer.ts so the page can never quote a number the
  // checkout and emails contradict.
  const q = quote(wordpress)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function payDeposit() {
    if (loading) return
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/offer/deposit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, business, wordpress }),
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

  return (
    <div className="container mx-auto max-w-5xl px-4 py-16 md:py-20">
      {paid && (
        <div className="mb-10 rounded-2xl border border-primary/40 bg-primary/10 p-6 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/20">
            <Check className="h-6 w-6 text-primary" />
          </div>
          <h2 className="mt-4 text-2xl font-bold tracking-tight">Deposit received — slot locked.</h2>
          <p className="mx-auto mt-2 max-w-lg text-muted-foreground">
            You&rsquo;ll get a receipt by email. Last step: pick your kickoff time below and
            we&rsquo;ll start building.
          </p>
        </div>
      )}

      {cancelled && (
        <div className="mb-10 rounded-xl border border-border bg-card p-5 text-center text-sm text-muted-foreground">
          Checkout was cancelled — nothing was charged. You can still book the kickoff below, or
          call {PHONE_DISPLAY} with questions.
        </div>
      )}

      <div className="text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary">
          <ShieldCheck className="h-4 w-4" />
          $497 website · two steps to start
        </span>
        <h1 className="mt-6 text-4xl font-bold tracking-tight md:text-5xl">
          Lock your build slot
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
          <span className="font-semibold text-foreground">{q.signup} today</span> reserves your slot
          and starts the build.{' '}
          <span className="font-semibold text-foreground">{q.launch}</span> is due when your site
          goes live — <span className="font-semibold text-foreground">{q.buildTotal} to build</span>.
          After launch it&rsquo;s{' '}
          <span className="font-semibold text-foreground">{q.monthly}/month</span> to run. Nothing
          hidden.
        </p>
      </div>

      <div className="mt-14 grid gap-6 lg:grid-cols-2">
        {/* ---- Step 1: deposit ---- */}
        <section className="rounded-2xl border border-primary/30 bg-card p-7">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/15 font-bold text-primary">
              1
            </span>
            <h2 className="text-xl font-bold tracking-tight">Pay the deposit</h2>
          </div>

          <div className="mt-6 flex items-end gap-3">
            <span className="font-mono text-5xl font-bold leading-none tracking-tight">
              {q.signup}
            </span>
            <span className="pb-1 text-sm text-muted-foreground">today</span>
          </div>

          {/* Full schedule, stated once, in order. Nothing about the monthly is
              left to the small print. */}
          <dl className="mt-5 divide-y divide-border rounded-xl border border-border">
            <div className="flex items-center justify-between px-4 py-2.5">
              <dt className="text-sm text-muted-foreground">Today</dt>
              <dd className="font-mono text-sm font-semibold">{q.signup}</dd>
            </div>
            <div className="flex items-center justify-between px-4 py-2.5">
              <dt className="text-sm text-muted-foreground">When your site goes live</dt>
              <dd className="font-mono text-sm font-semibold">{q.launch}</dd>
            </div>
            <div className="flex items-center justify-between px-4 py-2.5 bg-muted/20">
              <dt className="text-sm font-medium">Total to build</dt>
              <dd className="font-mono text-sm font-bold">{q.buildTotal}</dd>
            </div>
            <div className="flex items-center justify-between px-4 py-2.5">
              <dt className="text-sm text-muted-foreground">
                Monthly after launch
                <span className="block text-xs text-muted-foreground/70">
                  {wordpress ? 'Hosting + AI management' : 'Platform + hosting'}
                </span>
              </dt>
              <dd className="font-mono text-sm font-semibold">{q.monthly}/mo</dd>
            </div>
          </dl>

          {/* WordPress — a secondary product on top of the $497, not a tier. */}
          <label className="mt-5 flex cursor-pointer gap-3 rounded-xl border border-border bg-muted/10 p-4 transition-colors hover:border-primary/40">
            <input
              type="checkbox"
              checked={wordpress}
              onChange={(e) => setWordpress(e.target.checked)}
              className="mt-0.5 h-4 w-4 shrink-0 accent-current text-primary"
            />
            <span>
              <span className="block text-sm font-semibold">
                {WORDPRESS_OFFER.hook} Build it in WordPress instead{' '}
                <span className="text-primary">{WORDPRESS_OFFER.addOnBuild}</span>
              </span>
              <span className="mt-1 block text-xs leading-relaxed text-muted-foreground">
                {WORDPRESS_OFFER.pitch}
              </span>
            </span>
          </label>

          <ul className="mt-5 space-y-2.5">
            {[
              'Reserves your slot in this week&rsquo;s build queue',
              'Work starts as soon as the kickoff call is done',
              'Launch payment only due once the site is live and you approve it',
              'Monthly starts at launch, never before',
              'Secure checkout via Stripe — we never see your card',
            ].map((f) => (
              <li key={f} className="flex gap-2.5 text-sm text-muted-foreground">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <span dangerouslySetInnerHTML={{ __html: f }} />
              </li>
            ))}
          </ul>

          <div className="mt-6 space-y-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email (for the receipt)"
              autoComplete="email"
              className={field}
            />
            <input
              type="text"
              value={business}
              onChange={(e) => setBusiness(e.target.value)}
              placeholder="Business name (optional)"
              autoComplete="organization"
              className={field}
            />
          </div>

          {error && (
            <p className="mt-4 rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm">
              {error}
            </p>
          )}

          <button
            onClick={payDeposit}
            disabled={loading}
            className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-6 py-4 text-base font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" /> Opening secure checkout…
              </>
            ) : (
              <>
                <CreditCard className="h-5 w-5" /> Pay {q.signup} today
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
          <p className="mt-3 text-center text-xs text-muted-foreground">
            If we decide $497 won&rsquo;t genuinely cover what you need, we refund the deposit — we
            say so before we build, not after.
          </p>
        </section>

        {/* ---- Step 2: booking ---- */}
        <section className="rounded-2xl border border-border bg-card p-7">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/15 font-bold text-primary">
              2
            </span>
            <h2 className="text-xl font-bold tracking-tight">Book your kickoff</h2>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            15 minutes. We go through your services, the pages you need and your brand — then I
            build it. Pick any slot that works.
          </p>

          <div className="mt-6">
            <BookingCalendar
              calendar="website"
              purpose="$497 website kickoff"
              heading="Pick your kickoff slot"
              blurb="15 minutes. We go through your services, the pages you need and your brand — then I build it."
              defaultEmail={email}
              notesLabel="Your website address, or what the business does (optional)"
            />
          </div>

          <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-muted/20 p-4">
            <span className="flex items-center gap-2 text-sm text-muted-foreground">
              <CalendarCheck className="h-4 w-4 text-primary" />
              Rather not use the calendar?
            </span>
            <span className="flex items-center gap-4">
              <a
                href={bookingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium text-muted-foreground hover:text-foreground"
              >
                Open the standard booking page
              </a>
              <a
                href={PHONE_HREF}
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
              >
                <Phone className="h-3.5 w-3.5" />
                {PHONE_DISPLAY}
              </a>
            </span>
          </div>
        </section>
      </div>
    </div>
  )
}
