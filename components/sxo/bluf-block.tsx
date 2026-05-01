/**
 * BLUF (Bottom Line Up Front) block — sits at the very top of every
 * SXO-optimized service page. Designed for AI engine consumption + the
 * scanning reader who decides in 5 seconds whether to keep reading.
 *
 * Includes the Living DOM marker so the mutation engine can update it
 * over time without breaking layout.
 */

import { Activity, ArrowRight, Sparkles } from 'lucide-react'
import Link from 'next/link'

export interface BlufStat {
  label: string
  value: string
}

export interface BlufBlockProps {
  badge?: string
  /** One sentence — the bottom line. Don't bury it. */
  bottomLine: string
  /** Optional supporting paragraph that expands the bottom line. */
  context?: string
  /** Up to 4 stats. Renders inline on desktop, stacks on mobile. */
  stats?: BlufStat[]
  /** Primary CTA — opens whatever conversion path matters most. */
  primaryCta: { label: string; href: string }
  /** Optional secondary CTA — usually "see pricing" or "get audit". */
  secondaryCta?: { label: string; href: string }
}

export default function BlufBlock(props: BlufBlockProps) {
  return (
    <section className="relative overflow-hidden border-b border-border">
      {/* Soft brand glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-20 left-1/2 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-primary/[0.06] blur-[140px]"
      />

      <div className="container relative z-10 px-4 py-14 md:px-6 md:py-20">
        {/* Living DOM indicator */}
        <div
          id="sxo-living-dom"
          className="mb-6 flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground/70"
        >
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
          </span>
          <span className="font-mono text-[10px] tracking-widest text-emerald-500">
            Living DOM Active
          </span>
          <span aria-hidden className="text-muted-foreground/30">·</span>
          <span className="font-mono text-[10px] tracking-widest text-muted-foreground/70">
            <Activity className="-mt-0.5 mr-1 inline h-3 w-3" />
            Updated continuously by CRO9
          </span>
        </div>

        {/* Optional badge */}
        {props.badge && (
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/8 px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-widest text-primary">
            <Sparkles className="h-3 w-3" />
            {props.badge}
          </div>
        )}

        {/* The bottom line */}
        <div className="rounded-2xl border-l-4 border-primary bg-primary/[0.04] p-6 md:p-8">
          <div className="mb-2 font-mono text-[10px] uppercase tracking-widest text-primary">
            Bottom Line Up Front
          </div>
          <p className="text-balance text-xl font-semibold leading-relaxed text-foreground md:text-2xl">
            {props.bottomLine}
          </p>
          {props.context && (
            <p className="mt-4 text-base leading-relaxed text-muted-foreground md:text-lg">
              {props.context}
            </p>
          )}
        </div>

        {/* Stats row */}
        {props.stats && props.stats.length > 0 && (
          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {props.stats.map((s) => (
              <div
                key={s.label}
                className="rounded-2xl border border-border bg-card/50 px-4 py-4 text-center backdrop-blur"
              >
                <div className="text-2xl font-black tabular-nums text-primary md:text-3xl">
                  {s.value}
                </div>
                <div className="mt-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* CTAs */}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
          <Link
            href={props.primaryCta.href}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-base font-bold text-primary-foreground shadow-[0_0_28px_rgba(255,107,0,0.35)] transition-transform hover:scale-[1.02]"
          >
            {props.primaryCta.label}
            <ArrowRight className="h-4 w-4" />
          </Link>
          {props.secondaryCta && (
            <Link
              href={props.secondaryCta.href}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-card/40 px-6 py-3 text-base font-semibold text-foreground transition-colors hover:border-primary/40 hover:text-primary"
            >
              {props.secondaryCta.label}
            </Link>
          )}
        </div>
      </div>
    </section>
  )
}
