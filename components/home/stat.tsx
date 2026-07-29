import type { Stat } from '@/lib/stats'

/**
 * Statistic display components.
 *
 * The source line is not optional decoration — it is the point. Showing where
 * every number comes from is what separates this page from every other agency
 * site that puts "300% GROWTH" in a big font and hopes nobody asks.
 */

/** Large hero-weight figure. Use for 3–4 headline numbers max. */
export function StatBig({ stat }: { stat: Stat }) {
  return (
    <div className="group relative">
      <div className="font-mono text-4xl font-bold leading-none tracking-tight text-primary sm:text-5xl">
        {stat.value}
      </div>
      <p className="mt-3 text-sm leading-snug text-muted-foreground">{stat.label}</p>
      <p className="mt-2 text-[11px] uppercase tracking-wider text-muted-foreground/60">
        {stat.source}
      </p>
    </div>
  )
}

/**
 * Editorial data card — the workhorse for the "why this matters" sections.
 * Left rule in brand orange, big mono figure, visible attribution.
 */
export function StatCard({ stat }: { stat: Stat }) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-6 transition-colors hover:border-primary/40">
      <div className="absolute inset-y-0 left-0 w-[3px] bg-gradient-to-b from-primary to-primary/20" />
      <div className="font-mono text-4xl font-bold leading-none tracking-tight text-foreground sm:text-5xl">
        {stat.value}
      </div>
      <p className="mt-4 leading-relaxed text-muted-foreground">{stat.label}</p>
      {stat.detail && (
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground/70">{stat.detail}</p>
      )}
      <p className="mt-4 border-t border-border pt-3 text-[11px] uppercase tracking-wider text-primary/80">
        Source · {stat.source}
      </p>
    </div>
  )
}

/** Compact inline figure for dense strips. */
export function StatInline({ stat }: { stat: Stat }) {
  return (
    <div className="rounded-xl border border-border bg-card/60 p-5">
      <div className="font-mono text-2xl font-bold tracking-tight text-primary sm:text-3xl">
        {stat.value}
      </div>
      <p className="mt-2 text-sm leading-snug text-muted-foreground">{stat.label}</p>
      <p className="mt-2 text-[10px] uppercase tracking-wider text-muted-foreground/55">
        {stat.source}
      </p>
    </div>
  )
}
