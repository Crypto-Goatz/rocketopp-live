'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ArrowRight, Sparkles } from 'lucide-react'

/**
 * Floating CTA bar at the bottom of every /services/* page.
 *
 * Marketing pages no longer show prices or deposits — every engagement starts
 * with a free consultation — so this routes to /contact rather than the priced
 * /order wizard. Skips itself on the /services index, which already has its
 * own grid CTA.
 */
export function ServicePageCta() {
  const pathname = usePathname() || ''
  // Don't show on /services index (which already has its own CTAs).
  if (pathname === '/services' || pathname === '/services/') return null

  return (
    <div className="sticky bottom-4 z-40 mx-auto px-4 max-w-3xl">
      <div className="rounded-xl border border-primary/40 bg-card/95 backdrop-blur-md shadow-[0_12px_40px_-12px_rgba(255,107,53,0.5)] p-3 sm:p-4 flex flex-col sm:flex-row items-center gap-3">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="shrink-0 inline-flex items-center justify-center w-9 h-9 rounded-lg bg-primary/15 text-primary">
            <Sparkles className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-sm leading-tight">
              Not sure which services you need?
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Free consultation. We assess your situation and goals first.
            </p>
          </div>
        </div>
        <Link
          href="/contact"
          className="shrink-0 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground hover:scale-[1.02] transition-transform whitespace-nowrap"
        >
          Book a free consultation
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  )
}
