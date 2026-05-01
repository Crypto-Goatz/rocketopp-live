/**
 * Trust strip — small "built on" row of infrastructure providers we use.
 * Pure trust signal, no logos (avoids licensing) — uses brand text + Lucide
 * icons styled like badges.
 */

import {
  CreditCard,
  Cpu,
  Database,
  Server,
  ShieldCheck,
  Sparkles,
  Workflow,
  Zap,
} from 'lucide-react'

const STACK = [
  { name: 'Stripe', icon: CreditCard },
  { name: 'Vercel', icon: Server },
  { name: 'Supabase', icon: Database },
  { name: 'Anthropic', icon: Sparkles },
  { name: 'Groq', icon: Zap },
  { name: '0nMCP', icon: Workflow },
  { name: 'Resend', icon: Cpu },
  { name: 'WP Engine', icon: ShieldCheck },
]

export default function TrustStrip() {
  return (
    <section aria-labelledby="trust-heading" className="border-y border-border bg-card/20 py-8">
      <div className="container px-4 md:px-6">
        <p
          id="trust-heading"
          className="mb-5 text-center font-mono text-[10px] uppercase tracking-widest text-muted-foreground"
        >
          Built on the same infrastructure as Fortune 500 stacks
        </p>
        <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-center gap-x-6 gap-y-3 sm:gap-x-10">
          {STACK.map((s) => {
            const Icon = s.icon
            return (
              <div
                key={s.name}
                className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground"
              >
                <Icon className="h-4 w-4" />
                <span>{s.name}</span>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
