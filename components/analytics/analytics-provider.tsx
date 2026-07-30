'use client'

import { Suspense, useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { GoogleAnalytics } from './google-analytics'
import { GoogleTagManager, GoogleTagManagerNoScript } from './google-tag-manager'
import { FacebookPixel } from './facebook-pixel'
import { MicrosoftClarity } from './microsoft-clarity'
import {
  initializeAnalytics,
  trackPageView,
  storeUTMParams,
  getVisitorId,
  getSessionId,
} from '@/lib/analytics'
import { clarityIdentify, tagClaritySession } from './microsoft-clarity'

interface AnalyticsProviderProps {
  children: React.ReactNode
  ga4Id?: string
  gtmId?: string
  fbPixelId?: string
  clarityId?: string
}

/**
 * The pageview/session tracking effects, isolated from `children`.
 *
 * WHY THIS IS ITS OWN COMPONENT — this is a load-bearing detail, do not merge it
 * back into the provider:
 *
 * useSearchParams() forces the nearest Suspense boundary to bail out of server
 * rendering entirely (Next emits BAILOUT_TO_CLIENT_SIDE_RENDERING). When the hook
 * lived in a component that also rendered {children}, the boundary in the root
 * layout contained the whole page — so every route on the site shipped an empty
 * <body> and rendered client-side only.
 *
 * Google executes JS and still indexed it, but GPTBot, ClaudeBot and PerplexityBot
 * largely do not — which silently nullified the entire AEO effort: the schema, the
 * sourced copy, the llms.txt, all of it invisible to the crawlers it was written
 * for.
 *
 * Keeping the hook in a leaf component with NO children means the bailout is scoped
 * to this component alone. Page content renders on the server as normal.
 */
function AnalyticsTracking({ clarityId }: { clarityId?: string }) {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Initialize analytics on mount
  useEffect(() => {
    initializeAnalytics()
    storeUTMParams()

    // Set up Clarity identification
    if (clarityId) {
      const vid = getVisitorId()
      const sid = getSessionId()
      clarityIdentify(vid, sid)

      // Tag session with useful info
      tagClaritySession({
        visitor_type: 'new', // Will be updated if returning visitor
        page_type: getPageType(pathname),
      })
    }
  }, [clarityId, pathname])

  // Track page views on route changes
  useEffect(() => {
    trackPageView({
      path: pathname,
    })
  }, [pathname, searchParams])

  return null
}

export function AnalyticsProvider({
  children,
  ga4Id,
  gtmId,
  fbPixelId,
  clarityId,
}: AnalyticsProviderProps) {
  return (
    <>
      {/* Google Tag Manager - Should be first for tag management */}
      {gtmId && <GoogleTagManager containerId={gtmId} />}

      {/* Google Analytics 4 */}
      {ga4Id && <GoogleAnalytics measurementId={ga4Id} />}

      {/* Facebook Pixel */}
      {fbPixelId && <FacebookPixel pixelId={fbPixelId} />}

      {/* Microsoft Clarity - Free heatmaps & session recordings */}
      {clarityId && <MicrosoftClarity projectId={clarityId} />}

      {/* GTM noscript fallback */}
      {gtmId && <GoogleTagManagerNoScript containerId={gtmId} />}

      {/* The useSearchParams bailout is confined to this boundary, never children. */}
      <Suspense fallback={null}>
        <AnalyticsTracking clarityId={clarityId} />
      </Suspense>

      {children}
    </>
  )
}

// Helper to categorize pages for analytics
function getPageType(pathname: string): string {
  if (pathname === '/') return 'homepage'
  if (pathname.startsWith('/services')) return 'services'
  if (pathname.startsWith('/marketplace')) return 'marketplace'
  if (pathname.startsWith('/dashboard')) return 'dashboard'
  if (pathname === '/contact') return 'contact'
  if (pathname === '/about') return 'about'
  if (pathname.includes('login') || pathname.includes('register')) return 'auth'
  return 'other'
}

// Re-export components for individual use
export { GoogleAnalytics } from './google-analytics'
export { GoogleTagManager, GoogleTagManagerNoScript } from './google-tag-manager'
export { FacebookPixel } from './facebook-pixel'
export { MicrosoftClarity } from './microsoft-clarity'
