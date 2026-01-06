'use client'

import { useEffect } from 'react'
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

export function AnalyticsProvider({
  children,
  ga4Id,
  gtmId,
  fbPixelId,
  clarityId,
}: AnalyticsProviderProps) {
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
