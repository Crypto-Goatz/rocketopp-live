'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import {
  ArrowRight,
  Check,
  Clock,
  Loader2,
  Minus,
  Phone,
  Sparkles,
} from 'lucide-react'

import PlainEnglishDemo from './PlainEnglishDemo'
import SearchReality from './SearchReality'
import {
  INCLUDED,
  NOT_INCLUDED,
  OFFER_PRICE_DISPLAY,
  STEPS,
  WORDPRESS_OFFER,
  BASE_QUOTE,
  isBetweenWindows,
  nextDeadline,
} from '@/lib/offer'

const PHONE_DISPLAY = '(878) 888-1230'
const PHONE_HREF = 'tel:+1-878-888-1230'

/* ------------------------------------------------------------------ timer -- */

function pad(n: number) {
  return String(n).padStart(2, '0')
}

function Countdown() {
  // Rendered only after mount: the deadline depends on the viewer's clock, so
  // computing it during SSR would produce a hydration mismatch.
  const [mounted, setMounted] = useState(false)
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    setMounted(true)
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  const { closed, d, h, m, s } = useMemo(() => {
    const deadline = nextDeadline(now)
    const ms = Math.max(0, deadline.getTime() - now.getTime())
    return {
      closed: isBetweenWindows(now),
      d: Math.floor(ms / 86_400_000),
      h: Math.floor((ms % 86_400_000) / 3_600_000),
      m: Math.floor((ms % 3_600_000) / 60_000),
      s: Math.floor((ms % 60_000) / 1000),
    }
  }, [now])

  if (!mounted) {
    return <div className="h-[76px]" aria-hidden />
  }

  if (closed) {
    return (
      <div className="inline-flex flex-col items-center gap-1 rounded-xl border border-border bg-card px-6 py-4">
        <span className="text-sm text-muted-foreground">
          This week&rsquo;s offer has closed. It reopens Monday morning.
        </span>
        <span className="text-sm font-semibold text-primary">
          Apply now and you&rsquo;re first in line when it does.
        </span>
      </div>
    )
  }

  const cell = (v: number, label: string) => (
    <div className="flex flex-col items-center">
      <span className="font-mono text-3xl font-bold tabular-nums text-foreground sm:text-4xl">
        {pad(v)}
      </span>
      <span className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</span>
    </div>
  )

  return (
    <div className="inline-flex items-center gap-4 rounded-xl border border-primary/30 bg-primary/5 px-6 py-4 sm:gap-6">
      <Clock className="h-5 w-5 shrink-0 text-primary" aria-hidden />
      <div className="flex items-center gap-4 sm:gap-6">
        {cell(d, 'days')}
        {cell(h, 'hrs')}
        {cell(m, 'min')}
        {cell(s, 'sec')}
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------- form -- */

type Status = 'idle' | 'sending' | 'sent' | 'error'

function ApplicationForm() {
  const [status, setStatus] = useState<Status>('idle')
  const [error, setError] = useState('')
  const formRef = useRef<HTMLFormElement>(null)

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (status === 'sending') return
    setStatus('sending')
    setError('')

    const fd = new FormData(e.currentTarget)
    const payload = Object.fromEntries(fd.entries())

    try {
      const res = await fetch('/api/offer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const json = await res.json()
      if (!res.ok || !json.success) {
        setError(json.error || 'Something went wrong. Please call us.')
        setStatus('error')
        return
      }
      setStatus('sent')
      formRef.current?.reset()
    } catch {
      setError(`We could not send that. Please call ${PHONE_DISPLAY}.`)
      setStatus('error')
    }
  }

  if (status === 'sent') {
    return (
      <div className="rounded-2xl border border-primary/30 bg-primary/5 p-8 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/15">
          <Check className="h-6 w-6 text-primary" />
        </div>
        <h3 className="mt-4 text-2xl font-bold tracking-tight">Got it — check your email.</h3>
        <p className="mx-auto mt-3 max-w-md text-muted-foreground">
          We&rsquo;ve sent you a confirmation and Mike has been notified directly. You&rsquo;ll hear
          back personally, usually within one business day.
        </p>
        <p className="mt-4 text-sm text-muted-foreground">
          In a hurry?{' '}
          <a href={PHONE_HREF} className="font-semibold text-primary hover:underline">
            Call {PHONE_DISPLAY}
          </a>
        </p>
      </div>
    )
  }

  const field =
    'w-full rounded-lg border border-border bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary'

  return (
    <form ref={formRef} onSubmit={onSubmit} className="space-y-4" noValidate>
      {/* Honeypot — visually hidden, not display:none, so bots still fill it. */}
      <div className="absolute left-[-9999px] top-auto h-px w-px overflow-hidden" aria-hidden>
        <label htmlFor="website">Website</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="mb-1.5 block text-sm font-medium">
            Your name <span className="text-primary">*</span>
          </label>
          <input id="name" name="name" required autoComplete="name" className={field} />
        </div>
        <div>
          <label htmlFor="business" className="mb-1.5 block text-sm font-medium">
            Business name
          </label>
          <input id="business" name="business" autoComplete="organization" className={field} />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="email" className="mb-1.5 block text-sm font-medium">
            Email <span className="text-primary">*</span>
          </label>
          <input id="email" name="email" type="email" required autoComplete="email" className={field} />
        </div>
        <div>
          <label htmlFor="phone" className="mb-1.5 block text-sm font-medium">
            Phone
          </label>
          <input id="phone" name="phone" type="tel" autoComplete="tel" className={field} />
        </div>
      </div>

      <div>
        <label htmlFor="currentSite" className="mb-1.5 block text-sm font-medium">
          Current website <span className="text-muted-foreground">(if you have one)</span>
        </label>
        <input id="currentSite" name="currentSite" placeholder="yourbusiness.com" className={field} />
      </div>

      <div>
        <label htmlFor="about" className="mb-1.5 block text-sm font-medium">
          What does your business do?
        </label>
        <textarea
          id="about"
          name="about"
          rows={4}
          placeholder="A sentence or two is plenty — what you do, who you serve, and what you want the site to accomplish."
          className={field}
        />
      </div>

      {status === 'error' && (
        <p className="rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-foreground">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={status === 'sending'}
        className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-6 py-4 text-lg font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
      >
        {status === 'sending' ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" /> Sending…
          </>
        ) : (
          <>
            Apply for the {OFFER_PRICE_DISPLAY} website <ArrowRight className="h-5 w-5" />
          </>
        )}
      </button>

      <p className="text-center text-xs text-muted-foreground">
        No payment now. We confirm it&rsquo;s a fit before anyone pays anything.
      </p>
    </form>
  )
}

/* ------------------------------------------------------------------- page -- */

export default function OfferClient() {
  return (
    <>
      {/* ---------------------------------------------------------- hero -- */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="grid-background absolute inset-0 opacity-[0.07]" aria-hidden />
        <div
          className="absolute left-1/2 top-0 h-[420px] w-[720px] -translate-x-1/2 rounded-full bg-primary/20 blur-[130px]"
          aria-hidden
        />

        <div className="container relative z-10 mx-auto max-w-4xl px-4 py-20 text-center md:py-28">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary">
            <Sparkles className="h-4 w-4" />
            Limited weekly offer
          </span>

          <h1 className="mt-8 text-5xl font-bold leading-[1.05] tracking-tight sm:text-6xl md:text-7xl">
            A real website.
            <br />
            <span className="text-primary">{OFFER_PRICE_DISPLAY}</span>, built for you.
          </h1>

          <p className="mx-auto mt-7 max-w-2xl text-lg leading-relaxed text-muted-foreground md:text-xl">
            Not a template you have to fill in yourself. We design and build the whole thing for
            your business — and when it&rsquo;s done, you can edit and revise it yourself, any time,
            without paying us to change a word.
          </p>
          <p className="mx-auto mt-4 max-w-2xl text-sm text-muted-foreground">
            {BASE_QUOTE.signup} to start, {BASE_QUOTE.launch} when it goes live
            ({BASE_QUOTE.buildTotal} to build), then{' '}
            <span className="font-semibold text-foreground">
              {BASE_QUOTE.monthly}/month
            </span>{' '}
            to keep it hosted and running. Stated up front, not in the small print.
          </p>

          <div className="mt-10 flex justify-center">
            <Countdown />
          </div>
          <p className="mt-3 text-sm text-muted-foreground">
            This week&rsquo;s offer closes Friday at midnight ET.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <a
              href="#apply"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-7 py-4 text-lg font-semibold text-primary-foreground transition-opacity hover:opacity-90"
            >
              Claim this week&rsquo;s offer <ArrowRight className="h-5 w-5" />
            </a>
            <a
              href={PHONE_HREF}
              className="inline-flex items-center gap-2 rounded-lg border border-border px-7 py-4 text-lg font-semibold transition-colors hover:border-primary/40"
            >
              <Phone className="h-5 w-5" />
              {PHONE_DISPLAY}
            </a>
          </div>
        </div>
      </section>

      {/* ------------------------------------------- plain-english demo -- */}
      <PlainEnglishDemo />

      {/* ---------------------------------------------- search research -- */}
      <SearchReality />

      {/* ------------------------------------------------------- included -- */}
      <section className="container mx-auto max-w-5xl px-4 py-20">
        <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <div className="card-lifted rounded-2xl p-8">
            <h2 className="text-2xl font-bold tracking-tight">
              What {OFFER_PRICE_DISPLAY} gets you
            </h2>
            <ul className="mt-6 space-y-4">
              {INCLUDED.map((i) => (
                <li key={i} className="flex gap-3">
                  <Check className="mt-1 h-5 w-5 shrink-0 text-primary" />
                  <span className="leading-relaxed text-muted-foreground">{i}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-border bg-muted/20 p-8">
            <h2 className="text-xl font-bold tracking-tight">What it doesn&rsquo;t cover</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              We&rsquo;d rather tell you now than after you&rsquo;ve paid.
            </p>
            <ul className="mt-6 space-y-4">
              {NOT_INCLUDED.map((i) => (
                <li key={i} className="flex gap-3">
                  <Minus className="mt-1 h-4 w-4 shrink-0 text-muted-foreground" />
                  <span className="text-sm leading-relaxed text-muted-foreground">{i}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------- wordpress -- */}
      <section className="container mx-auto max-w-5xl px-4 pb-4">
        <div className="rounded-2xl border border-border bg-muted/10 p-7">
          <div className="grid gap-5 md:grid-cols-[1.3fr_1fr] md:items-center">
            <div>
              <h2 className="text-xl font-bold tracking-tight">
                {WORDPRESS_OFFER.hook}{' '}
                <span className="text-primary">{WORDPRESS_OFFER.addOnBuild}</span>
              </h2>
              <p className="mt-3 leading-relaxed text-muted-foreground">{WORDPRESS_OFFER.pitch}</p>
            </div>
            <ul className="space-y-2">
              {WORDPRESS_OFFER.includes.map((i) => (
                <li key={i} className="flex gap-2.5 text-sm text-muted-foreground">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  {i}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------- steps -- */}
      <section className="border-y border-border bg-muted/10">
        <div className="container mx-auto max-w-4xl px-4 py-20">
          <h2 className="text-center text-3xl font-bold tracking-tight md:text-4xl">
            How it works
          </h2>
          <div className="mt-12 space-y-4">
            {STEPS.map((s) => (
              <div
                key={s.n}
                className="flex gap-5 rounded-2xl border border-border bg-card p-6 transition-colors hover:border-primary/30"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 font-bold text-primary">
                  {s.n}
                </span>
                <div>
                  <h3 className="text-lg font-semibold">{s.t}</h3>
                  <p className="mt-1.5 leading-relaxed text-muted-foreground">{s.d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --------------------------------------------------------- why us -- */}
      <section className="container mx-auto max-w-3xl px-4 py-20">
        <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
          Why we can do this for {OFFER_PRICE_DISPLAY}
        </h2>
        <div className="mt-6 space-y-5 leading-relaxed text-muted-foreground">
          <p>
            Because we built the tool. RocketOpp develops{' '}
            <span className="font-semibold text-foreground">web0n</span>, our own AI website
            platform, along with the rest of the 0n ecosystem. We&rsquo;re not paying a licence to
            anyone, and the AI does the parts that used to eat the hours — layout, first-draft
            copy, structure, schema.
          </p>
          <p>
            That doesn&rsquo;t mean a robot builds your site and nobody looks at it. AI is good at
            producing pages fast and bad at knowing what&rsquo;s true about your business. We do
            the judgement part: what your site should say, what to leave out, and how someone in
            your area actually finds you. That&rsquo;s the work that doesn&rsquo;t get cheaper.
          </p>
          <p>
            We&rsquo;ve{' '}
            <a href="/build-a-website-with-ai" className="font-semibold text-primary hover:underline">
              written honestly about exactly where AI stops
            </a>{' '}
            being enough — worth reading before you hire anyone, including us.
          </p>
        </div>
      </section>

      {/* ---------------------------------------------------------- apply -- */}
      <section id="apply" className="scroll-mt-8 border-t border-border bg-muted/10">
        <div className="container mx-auto max-w-2xl px-4 py-20">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
              Claim this week&rsquo;s offer
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-muted-foreground">
              Tell us about the business. We&rsquo;ll confirm it&rsquo;s a fit before anyone pays
              anything — and if {OFFER_PRICE_DISPLAY} genuinely won&rsquo;t cover what you need,
              we&rsquo;ll say so.
            </p>
          </div>

          <div className="card-lifted mt-10 rounded-2xl p-6 sm:p-8">
            <ApplicationForm />
          </div>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Would rather just talk?{' '}
            <a href={PHONE_HREF} className="font-semibold text-primary hover:underline">
              Call {PHONE_DISPLAY}
            </a>
          </p>
        </div>
      </section>
    </>
  )
}
