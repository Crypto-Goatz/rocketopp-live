'use client'

/**
 * Mount once in the root layout. Initializes the CRO9 tracker with a site ID
 * and fires a pageview on every client-side navigation.
 */

import { useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { initCro9, trackPageview } from '@/lib/cro9/tracker'

interface Props {
  siteId?: string
}

export function Cro9Tracker({ siteId = 'site_rocketopp' }: Props) {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    initCro9(siteId)
  }, [siteId])

  useEffect(() => {
    if (!pathname) return
    // Fire pageview whenever path or query changes.
    trackPageview({
      query: searchParams?.toString() || null,
    })
  }, [pathname, searchParams])

  return null
}
