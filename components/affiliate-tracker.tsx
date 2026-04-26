'use client'

/**
 * Mount once in the root layout. Captures ?ref= on any page, drops a 60-day
 * first-party cookie, and posts a click to /api/hipaa/affiliate/click.
 *
 * Downstream conversion code (e.g. /api/hipaa/order proxy) reads the cookie and
 * sends `referralCode` so commissions attribute correctly.
 */

import { useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

const COOKIE_NAME = 'ropp_ref'
const COOKIE_DAYS = 60

function setCookie(value: string) {
  const d = new Date()
  d.setTime(d.getTime() + COOKIE_DAYS * 24 * 60 * 60 * 1000)
  document.cookie = `${COOKIE_NAME}=${encodeURIComponent(value)}; expires=${d.toUTCString()}; path=/; SameSite=Lax`
}

function getCookie(): string | null {
  const match = document.cookie.split('; ').find((c) => c.startsWith(`${COOKIE_NAME}=`))
  return match ? decodeURIComponent(match.split('=')[1]) : null
}

export function AffiliateTracker() {
  const pathname = usePathname()
  const params = useSearchParams()

  useEffect(() => {
    const ref = params?.get('ref')
    if (!ref) return

    const existing = getCookie()
    setCookie(ref)

    // Skip click logging if we already fired for this slug in this session.
    const sessionKey = `ropp_ref_logged_${ref}`
    if (sessionStorage.getItem(sessionKey)) return
    sessionStorage.setItem(sessionKey, '1')

    const body = {
      slug: ref,
      landingPath: pathname,
      referrer: document.referrer || null,
      utmSource:   params?.get('utm_source')   || null,
      utmMedium:   params?.get('utm_medium')   || null,
      utmCampaign: params?.get('utm_campaign') || null,
    }

    fetch('/api/hipaa/affiliate/click', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      keepalive: true,
    }).catch(() => {})

    // existing is used only for "returning visitor" semantics in the future.
    void existing
  }, [pathname, params])

  return null
}
