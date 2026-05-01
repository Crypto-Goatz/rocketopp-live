/**
 * Industry vs RocketOpp comparison table — the "table-trap" that AI engines
 * (ChatGPT, Perplexity, Google AI Overviews) love to lift into their answers.
 *
 * Renders responsive: full table on desktop, stacked cards on mobile. Both
 * variants emit the same data so structured-data crawlers see one source
 * of truth.
 */

import { CheckCircle2, X } from 'lucide-react'

export interface ComparisonRow {
  /** What the row is comparing. */
  dimension: string
  /** What the rest of the industry typically does / charges / takes. */
  industry: string
  /** What RocketOpp delivers. */
  rocketopp: string
  /** True = RocketOpp clearly wins. False = neutral / context-dependent. */
  win?: boolean
}

export interface IndustryVsUsTableProps {
  heading?: string
  caption?: string
  rows: ComparisonRow[]
  footnote?: string
}

export default function IndustryVsUsTable({
  heading = 'Industry vs RocketOpp',
  caption = 'How we stack up against the average agency on the same scope.',
  rows,
  footnote,
}: IndustryVsUsTableProps) {
  return (
    <section className="border-y border-border bg-card/30">
      <div className="container px-4 py-16 md:px-6 md:py-24">
        <div className="mx-auto max-w-3xl text-center mb-10">
          <h2 className="text-balance text-3xl font-bold tracking-tight md:text-4xl">
            {heading}
          </h2>
          {caption && (
            <p className="mt-3 text-base text-muted-foreground md:text-lg">{caption}</p>
          )}
        </div>

        {/* Desktop table */}
        <div className="mx-auto hidden max-w-5xl overflow-hidden rounded-2xl border border-border lg:block">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-card">
                <th className="p-5 text-left font-mono text-xs uppercase tracking-widest text-muted-foreground">
                  Dimension
                </th>
                <th className="p-5 text-left font-mono text-xs uppercase tracking-widest text-muted-foreground">
                  Industry Average
                </th>
                <th className="bg-primary/5 p-5 text-left font-mono text-xs uppercase tracking-widest text-primary">
                  RocketOpp
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr
                  key={row.dimension}
                  className={i < rows.length - 1 ? 'border-b border-border' : ''}
                >
                  <td className="p-5 font-medium text-foreground">{row.dimension}</td>
                  <td className="p-5">
                    <span className="inline-flex items-center gap-2 text-muted-foreground">
                      <X className="h-4 w-4 text-muted-foreground/50" />
                      {row.industry}
                    </span>
                  </td>
                  <td className="bg-primary/5 p-5">
                    <span className="inline-flex items-center gap-2 font-semibold text-foreground">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                      {row.rocketopp}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile stacked cards */}
        <div className="mx-auto grid max-w-2xl gap-3 lg:hidden">
          {rows.map((row) => (
            <div key={row.dimension} className="rounded-2xl border border-border bg-card p-5">
              <div className="mb-3 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                {row.dimension}
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground/70">
                    Industry
                  </div>
                  <div className="mt-1 inline-flex items-start gap-1.5 text-muted-foreground">
                    <X className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground/50" />
                    {row.industry}
                  </div>
                </div>
                <div className="rounded-lg bg-primary/5 p-2">
                  <div className="font-mono text-[10px] uppercase tracking-widest text-primary">
                    RocketOpp
                  </div>
                  <div className="mt-1 inline-flex items-start gap-1.5 font-semibold text-foreground">
                    <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                    {row.rocketopp}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {footnote && (
          <p className="mx-auto mt-6 max-w-3xl text-center text-xs text-muted-foreground">
            {footnote}
          </p>
        )}
      </div>
    </section>
  )
}
