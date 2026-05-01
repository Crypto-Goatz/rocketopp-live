/**
 * Process Timeline — numbered step cards with connecting line on desktop.
 * Pairs naturally with HowToSchema (use HowToSchema in the parent page).
 */

import type { LucideIcon } from 'lucide-react'

export interface ProcessStep {
  /** Display number — "01", "02", etc. */
  number: string
  /** Short title — verb-led. */
  title: string
  /** What happens in this step, what the customer experiences. */
  body: string
  /** When the step completes (e.g. "Day 1", "Week 1", "Hour 1"). */
  when?: string
  /** Optional icon. */
  icon?: LucideIcon
}

export interface ProcessTimelineProps {
  heading?: string
  caption?: string
  steps: ProcessStep[]
}

export default function ProcessTimeline({
  heading = 'How it ships',
  caption,
  steps,
}: ProcessTimelineProps) {
  return (
    <section className="py-16 md:py-24">
      <div className="container px-4 md:px-6">
        <div className="mx-auto max-w-3xl text-center mb-12">
          <h2 className="text-balance text-3xl font-bold tracking-tight md:text-4xl">{heading}</h2>
          {caption && (
            <p className="mt-3 text-base text-muted-foreground md:text-lg">{caption}</p>
          )}
        </div>

        <div className="mx-auto max-w-5xl">
          <div className="relative">
            {/* Vertical line on mobile */}
            <div
              aria-hidden
              className="pointer-events-none absolute left-[26px] top-2 bottom-2 w-px bg-gradient-to-b from-primary/40 via-primary/20 to-primary/40 lg:hidden"
            />
            <div className="grid gap-5 lg:grid-cols-3 lg:gap-6">
              {steps.map((step) => {
                const Icon = step.icon
                return (
                  <div key={step.number} className="relative pl-16 lg:pl-0">
                    <div className="absolute left-0 top-0 flex h-[52px] w-[52px] items-center justify-center rounded-2xl border border-primary/30 bg-card font-mono text-sm font-bold text-primary shadow-lg lg:relative lg:mb-5 lg:h-14 lg:w-14">
                      {Icon ? <Icon className="h-5 w-5" /> : step.number}
                    </div>
                    <div className="rounded-2xl border border-border bg-card/50 p-5 backdrop-blur">
                      {step.when && (
                        <p className="mb-2 font-mono text-[10px] uppercase tracking-widest text-primary">
                          {step.when}
                        </p>
                      )}
                      <h3 className="text-lg font-bold text-foreground">{step.title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                        {step.body}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
