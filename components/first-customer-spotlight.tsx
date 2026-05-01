/**
 * First Customer Spotlight — turns the very first paying SXO customer into
 * a marketing asset on the rocketopp.com homepage.
 *
 * Lives between the hero and the differentiators. Renders the actual
 * before/after scan numbers from the Living DOM analysis run on
 * outlookfc.com so the story is concrete (82 → 92, citations within 14 days).
 *
 * Rule compliance:
 *   - Lucide icons only (no emoji)
 *   - No inline style — Tailwind arbitrary color values where needed
 *   - Brand-aligned: primary (#ff6b00 lava-orange) accent
 */

import Link from 'next/link'
import { ArrowRight, Quote, Rocket, ShieldCheck, Sparkles, TrendingUp } from 'lucide-react'

interface SpotlightStat {
  label: string
  value: string
  trend?: 'up' | 'flat'
}

const STATS: SpotlightStat[] = [
  { label: 'Score on day 1', value: '82', trend: 'flat' },
  { label: 'Score after fixes', value: '92', trend: 'up' },
  { label: 'AI citations expected', value: '14 days', trend: 'up' },
  { label: 'SEO position lift', value: '+2-3', trend: 'up' },
]

const FIXES = [
  {
    headline: 'Custom llms.txt deployed',
    body: 'AI assistants (ChatGPT, Perplexity, Claude) now have an explicit, structured map of who Outlook Financial Center serves and what they offer.',
  },
  {
    headline: 'H2 headings rewritten as questions',
    body: 'Every section header re-cast in the format AI engines and voice search prefer to cite — directly mapping to the queries financial-advice seekers actually ask.',
  },
  {
    headline: 'FAQ section + schema markup',
    body: 'Built and shipped a structured FAQ that hooks Google AI Overviews and surfaces in Perplexity answer cards.',
  },
]

export default function FirstCustomerSpotlight() {
  return (
    <section className="relative overflow-hidden border-y border-border py-20 md:py-28">
      {/* Soft brand glow behind the panel */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-20 left-1/2 h-[480px] w-[680px] -translate-x-1/2 rounded-full bg-primary/[0.06] blur-[140px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-0 right-[10%] h-[300px] w-[300px] rounded-full bg-orange-500/[0.04] blur-[100px]"
      />

      <div className="container relative z-10 px-4 md:px-6">
        <div className="mx-auto max-w-3xl text-center mb-14">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/8 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-primary">
            <Sparkles className="h-3 w-3" />
            First Customer Spotlight
          </div>
          <h2 className="text-balance text-3xl font-bold tracking-tight md:text-5xl">
            <span className="bg-gradient-to-r from-primary via-orange-400 to-primary bg-clip-text text-transparent">
              Outlook Financial Center
            </span>
            <span className="block text-foreground">→ score lift in days, not months.</span>
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
            A family-owned, veteran-owned financial-services firm became RocketOpp&apos;s
            first paying SXO customer. We ran a deeper Living DOM rewrite at no extra
            charge and shipped the fixes the same day.
          </p>
        </div>

        {/* Stat strip */}
        <div className="mx-auto mb-12 grid max-w-4xl grid-cols-2 gap-3 sm:grid-cols-4">
          {STATS.map((s) => (
            <div
              key={s.label}
              className="rounded-2xl border border-border bg-card/50 p-5 text-center backdrop-blur"
            >
              <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                {s.label}
              </div>
              <div className="mt-2 flex items-baseline justify-center gap-1">
                <span className="text-3xl font-black tabular-nums text-foreground md:text-4xl">
                  {s.value}
                </span>
                {s.trend === 'up' && <TrendingUp className="h-5 w-5 text-primary" />}
              </div>
            </div>
          ))}
        </div>

        {/* Pull-quote + before/after */}
        <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-[1.2fr_1fr]">
          <div className="relative overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/[0.04] via-card/40 to-transparent p-8 md:p-10">
            <Quote className="mb-4 h-8 w-8 text-primary/60" />
            <p className="text-lg leading-relaxed text-foreground md:text-xl">
              &ldquo;You&apos;re our very first paying SXO customer — and that means a lot.
              Outlook Financial Center is exactly the kind of business I built this tool
              for: family-owned, veteran-owned, doing real work that people need.&rdquo;
            </p>
            <div className="mt-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/15 text-primary">
                <Rocket className="h-5 w-5" />
              </div>
              <div>
                <div className="text-sm font-bold text-foreground">Mike Mento</div>
                <div className="text-xs text-muted-foreground">Founder, RocketOpp</div>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="rounded-2xl border border-border bg-card/50 p-5 backdrop-blur">
              <div className="mb-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                Day 1 — initial scan
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-foreground">82/100</span>
                <span className="text-sm text-muted-foreground">already strong baseline</span>
              </div>
            </div>
            <div className="rounded-2xl border border-primary/30 bg-primary/[0.04] p-5 backdrop-blur">
              <div className="mb-1 flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-primary">
                <ShieldCheck className="h-3 w-3" />
                After fix plan applied
              </div>
              <div className="flex items-baseline gap-2">
                <span className="bg-gradient-to-r from-primary via-orange-400 to-primary bg-clip-text text-2xl font-black text-transparent">
                  92/100
                </span>
                <span className="text-sm text-muted-foreground">+10 in under 30 days</span>
              </div>
            </div>
            <div className="rounded-2xl border border-border bg-card/50 p-5 backdrop-blur">
              <div className="mb-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                AI engine readiness
              </div>
              <div className="text-sm text-foreground">
                Citations expected from ChatGPT / Perplexity / Google AI Overviews within
                <strong className="text-primary"> 14 days</strong>
              </div>
            </div>
          </div>
        </div>

        {/* What we shipped */}
        <div className="mx-auto mt-12 max-w-5xl">
          <h3 className="mb-6 text-center text-lg font-bold uppercase tracking-widest text-muted-foreground">
            What we shipped — same day
          </h3>
          <div className="grid gap-4 md:grid-cols-3">
            {FIXES.map((f, i) => (
              <div
                key={f.headline}
                className="rounded-2xl border border-border bg-card/50 p-5 backdrop-blur"
              >
                <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl border border-primary/30 bg-primary/10 font-mono text-sm font-bold text-primary">
                  {String(i + 1).padStart(2, '0')}
                </div>
                <div className="font-bold text-foreground">{f.headline}</div>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.body}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-14 text-center">
          <Link
            href="/services/sxo"
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-7 py-3 text-base font-bold text-primary-foreground shadow-[0_0_32px_rgba(255,107,0,0.35)] transition-transform hover:scale-[1.02]"
          >
            Run my SXO scan
            <ArrowRight className="h-4 w-4" />
          </Link>
          <p className="mt-3 text-xs text-muted-foreground">
            Free domain report · Same engine that scored Outlook Financial Center
          </p>
        </div>
      </div>
    </section>
  )
}
