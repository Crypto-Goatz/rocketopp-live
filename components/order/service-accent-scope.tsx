'use client'

import { usePathname } from 'next/navigation'
import { SERVICES, getAccent } from '@/lib/order/services-catalog'

/**
 * Wraps service pages with a CSS variable scope that overrides --primary
 * with the service's accent color. Every Tailwind utility that resolves
 * against --primary (text-primary, bg-primary, border-primary, ring-primary)
 * retints automatically to the per-service color inside this scope.
 *
 * The accent is determined by matching the current pathname against
 * each catalog service's `servicePagePath`. If no match (e.g. /services
 * index), no override is applied and the page keeps the global orange.
 */
export function ServiceAccentScope({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || ''

  // Match deepest path to the right catalog entry.
  const match = SERVICES
    .filter((s) => s.servicePagePath && pathname.startsWith(s.servicePagePath))
    .sort(
      (a, b) =>
        (b.servicePagePath?.length ?? 0) - (a.servicePagePath?.length ?? 0),
    )[0]

  if (!match) return <>{children}</>

  return (
    <div data-service-accent={getAccent(match)} data-service-slug={match.slug}>
      {children}
    </div>
  )
}
