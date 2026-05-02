'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ArrowRight, Sparkles } from 'lucide-react'
import { SERVICES } from '@/lib/order/services-catalog'

/**
 * Floating CTA bar at the bottom of every /services/* page that funnels
 * to the /order wizard with the right service pre-seeded.
 *
 * Uses usePathname to detect which service the user is reading and
 * map it to a catalog slug. Skips itself on /services index because
 * that page already has its own grid CTA.
 */
export function ServicePageCta() {
  const pathname = usePathname() || ''
  // Don't show on /services index (which already has its own CTAs).
  if (pathname === '/services' || pathname === '/services/') return null

  // Find the catalog service whose servicePagePath matches the current URL,
  // OR the deepest match by path.
  const slug = (() => {
    const direct = SERVICES.find(
      (s) => s.servicePagePath && pathname.startsWith(s.servicePagePath),
    )
    if (direct) return direct.slug
    // Fallback — extract last path segment.
    const parts = pathname.split('/').filter(Boolean)
    return parts[parts.length - 1] || ''
  })()

  const orderUrl = slug ? `/order?seed=${encodeURIComponent(slug)}` : '/order'

  return (
    <div className="sticky bottom-4 z-40 mx-auto px-4 max-w-3xl">
      <div className="rounded-xl border border-primary/40 bg-card/95 backdrop-blur-md shadow-[0_12px_40px_-12px_rgba(255,107,53,0.5)] p-3 sm:p-4 flex flex-col sm:flex-row items-center gap-3">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="shrink-0 inline-flex items-center justify-center w-9 h-9 rounded-lg bg-primary/15 text-primary">
            <Sparkles className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-sm leading-tight">
              Want a custom quote across multiple services?
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              60-second wizard. AI-built brief. $50 refundable to lock it in.
            </p>
          </div>
        </div>
        <Link
          href={orderUrl}
          className="shrink-0 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground hover:scale-[1.02] transition-transform whitespace-nowrap"
        >
          Build my quote
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  )
}
