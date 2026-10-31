'use client'

import Link from 'next/link'
import { ArrowRight, Sparkles, CalendarCheck, Clock } from 'lucide-react'
import { getService } from '@/lib/order/services-catalog'

/**
 * Prominent call-to-action block for service pages — uses the per-service
 * accent (already scoped via ServiceAccentScope, so text-primary / bg-primary
 * automatically retint to the right color).
 *
 * Marketing pages no longer show prices: every engagement starts with a free
 * consultation, so this block routes to /contact instead of the priced order
 * wizard or the cart. Copy (name, pitch, timeline) still comes from the
 * catalog; the catalog's price fields are left alone for checkout to use.
 */
export function ServicePurchaseBlock({
  slug,
  className = '',
}: {
  slug: string
  className?: string
}) {
  const product = getService(slug)
  if (!product) return null

  return (
    <section
      className={`relative overflow-hidden rounded-2xl border border-primary/40 bg-gradient-to-br from-primary/[0.08] via-card/60 to-card/40 backdrop-blur p-6 md:p-8 my-12 ${className}`}
    >
      {/* Soft accent glow */}
      <div
        aria-hidden="true"
        className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-primary/20 blur-3xl pointer-events-none"
      />

      <div className="relative z-10 grid md:grid-cols-[1.4fr_1fr] gap-6 items-center">
        {/* Copy */}
        <div className="min-w-0">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/15 border border-primary/30 text-primary text-xs font-bold uppercase tracking-widest mb-3">
            <Sparkles className="w-3 h-3" />
            Get this service
          </div>
          <h3 className="text-2xl md:text-3xl font-bold mb-2 tracking-tight">
            Ready to ship {product.name}?
          </h3>
          <p className="text-muted-foreground leading-relaxed">
            {product.shortPitch}
          </p>
          <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-primary" />
              {product.shipsIn}
            </span>
          </div>
        </div>

        {/* CTA */}
        <div className="space-y-3">
          <Link
            href="/contact"
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-base font-bold text-primary-foreground shadow-[0_0_24px_-8px_rgba(var(--service-accent-rgb,255_107_53)/0.6)] hover:scale-[1.02] transition-transform"
          >
            <CalendarCheck className="w-4 h-4" />
            Book a free consultation
            <ArrowRight className="w-4 h-4" />
          </Link>
          <p className="text-xs text-muted-foreground text-center px-2">
            We look at your situation and goals first, then tell you honestly
            whether we are a good fit.
          </p>
        </div>
      </div>
    </section>
  )
}
