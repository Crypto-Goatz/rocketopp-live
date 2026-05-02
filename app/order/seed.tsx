'use client'

import { useEffect, useRef } from 'react'
import { useOrderStore } from '@/lib/order/order-store'
import { getService } from '@/lib/order/services-catalog'

/**
 * Pre-seed the wizard with one service when the user lands here from a
 * /services/<slug> page (e.g. /order?seed=sxo). Runs once per slug.
 */
export function OrderSeed({ slug }: { slug: string }) {
  const toggleService = useOrderStore((s) => s.toggleService)
  const selected = useOrderStore((s) => s.selected)
  const lastSeed = useRef<string | null>(null)

  useEffect(() => {
    if (lastSeed.current === slug) return
    lastSeed.current = slug
    const svc = getService(slug)
    if (!svc) return
    if (!selected.some((x) => x.slug === slug)) {
      toggleService(slug)
    }
  }, [slug, toggleService, selected])

  return null
}
