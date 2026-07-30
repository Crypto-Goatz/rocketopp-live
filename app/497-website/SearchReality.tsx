import { AlertTriangle, ArrowRight, Check, TrendingUp, X } from 'lucide-react'
import Link from 'next/link'

import { AI_GAP, MYTH_VS_REALITY, SEARCH_SHIFT, STATS_VERIFIED } from '@/lib/stats'
import SearchChart from '@/components/charts/SearchChart'

/**
 * "Why a website alone stopped working" — the research section on the $497 page.
 *
 * Structural decision: LEAD WITH THE CORRECTION, not the scare.
 *
 * The common pitch is "Google is dying, buy AI." That is factually wrong — Google
 * is at 16.4B searches/day, up from 13.7B — and a prospect can disprove it in ten
 * seconds, which poisons everything said afterwards. The true version is sharper
 * anyway: Google demand is growing, but Google now answers the question itself, so
 * the CLICK collapsed. Opening by correcting the myth buys the credibility to make
 * the rest land.
 *
 * Every figure renders its publisher and date inline. That is the design device
 * for this whole site: competitors put big unsourced numbers on a page and hope
 * nobody asks.
 */
export default function SearchReality() {
  return (
    <section className="border-y border-border bg-background py-16 md:py-24">
      <div className="container mx-auto max-w-5xl px-4">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-primary">
            <TrendingUp className="h-3.5 w-3.5" />
            The research · verified {STATS_VERIFIED}
          </span>
          <h2 className="mt-6 text-3xl font-bold tracking-tight md:text-4xl">
            Why a website alone stopped working
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
            Every number below names its publisher and date. Check any of them.
          </p>
        </div>

        {/* ---- The correction. Myth first, then the sourced reality. ---- */}
        <div className="reveal mx-auto mt-12 max-w-3xl overflow-hidden rounded-2xl border border-border bg-card">
          <div className="flex items-start gap-3 border-b border-border bg-muted/20 p-6">
            <X className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" />
            <div>
              <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
                What you keep getting told
              </p>
              <p className="mt-1.5 text-lg font-medium text-muted-foreground line-through decoration-muted-foreground/40">
                {MYTH_VS_REALITY.myth}
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-6">
            <Check className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
            <div>
              <p className="text-[11px] font-bold uppercase tracking-widest text-primary">
                What the data actually says
              </p>
              <p className="mt-1.5 text-lg leading-relaxed text-foreground">
                {MYTH_VS_REALITY.reality}
              </p>
              <p className="mt-3 text-xs uppercase tracking-wider text-muted-foreground/70">
                Source · {MYTH_VS_REALITY.sources}
              </p>
            </div>
          </div>
        </div>

        {/* ---- The click collapse ---- */}
        <h3 className="mt-14 text-center text-xl font-bold tracking-tight md:text-2xl">
          Search didn&rsquo;t shrink. The click did.
        </h3>
        <div className="reveal mt-7 grid gap-4 sm:grid-cols-2">
          {SEARCH_SHIFT.map((s) => (
            <div
              key={s.label}
              className="relative overflow-hidden rounded-2xl border border-border bg-card p-6"
            >
              <div className="absolute inset-y-0 left-0 w-[3px] bg-gradient-to-b from-primary to-primary/20" />
              <div className="font-mono text-4xl font-bold leading-none tracking-tight">
                {s.value}
              </div>
              <p className="mt-3 leading-relaxed text-muted-foreground">{s.label}</p>
              {s.detail && (
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground/70">{s.detail}</p>
              )}
              <p className="mt-4 border-t border-border pt-3 text-[11px] uppercase tracking-wider text-primary/80">
                Source · {s.source}
              </p>
            </div>
          ))}
        </div>

        {/* ---- The interactive chart: same data, explorable ---- */}
        <div className="reveal mt-12">
          <SearchChart />
        </div>

        {/* ---- The opportunity ---- */}
        <h3 className="mt-14 text-center text-xl font-bold tracking-tight md:text-2xl">
          And here&rsquo;s the part almost nobody has acted on yet.
        </h3>
        <p className="mx-auto mt-4 max-w-2xl text-center leading-relaxed text-muted-foreground">
          AI already carries a huge share of the questions people ask — but it barely sends any
          traffic yet. The traffic it does send converts far better than anything else. Enormous
          attention, a tiny pipe, exceptional quality.
        </p>
        <div className="mt-7 grid gap-4 sm:grid-cols-2">
          {AI_GAP.map((s) => (
            <div key={s.label} className="rounded-2xl border border-border bg-card/60 p-6">
              <div className="font-mono text-3xl font-bold tracking-tight text-primary">
                {s.value}
              </div>
              <p className="mt-3 leading-relaxed text-muted-foreground">{s.label}</p>
              {s.detail && (
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground/70">{s.detail}</p>
              )}
              <p className="mt-4 border-t border-border pt-3 text-[11px] uppercase tracking-wider text-muted-foreground/60">
                Source · {s.source}
              </p>
            </div>
          ))}
        </div>

        {/* ---- What it means for the buyer ---- */}
        <div className="mx-auto mt-12 max-w-3xl rounded-2xl border border-primary/30 bg-primary/5 p-7">
          <h3 className="flex items-start gap-2 text-xl font-bold tracking-tight">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
            What this means for your website
          </h3>
          <div className="mt-4 space-y-4 leading-relaxed text-muted-foreground">
            <p>
              <span className="font-semibold text-foreground">
                Stop optimising for the click. Optimise to be the answer.
              </span>{' '}
              When two thirds of searches end without a click and nearly half show an AI summary,
              the position that matters is being the source that summary cites — not rank three on
              a page nobody clicks.
            </p>
            <p>
              <span className="font-semibold text-foreground">
                Most sites cannot be cited, because AI cannot read them.
              </span>{' '}
              No <code className="font-mono text-xs text-foreground">llms.txt</code>, missing
              structured data, and a{' '}
              <code className="font-mono text-xs text-foreground">robots.txt</code> that blocks
              GPTBot and ClaudeBot by accident. That is the cheapest fix on this entire list, and
              almost nobody has done it.
            </p>
            <p>
              <span className="font-semibold text-foreground">Being early here is cheap.</span>{' '}
              ChatGPT went from citing links in 1.6% of answers to 6.8% in a year. As that keeps
              climbing, the pipe widens — and it pays out to whoever is already cited. Getting in
              now costs less than getting into Google ever did.
            </p>
          </div>
          <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
            Every site we build ships with the structure that makes this possible: schema, an
            llms.txt written for AI crawlers, and content that leads with the answer. It is not an
            upsell — it is the reason the site is worth building.
          </p>
          <Link
            href="/build-a-website-with-ai"
            className="mt-5 inline-flex items-center gap-2 font-semibold text-primary hover:underline"
          >
            Read our honest breakdown of what AI can and cannot do
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
