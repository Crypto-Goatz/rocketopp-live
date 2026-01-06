// Core Analytics Library for RocketOpp
// Unified tracking interface for all analytics platforms

export type AnalyticsEvent = {
  name: string
  category?: string
  label?: string
  value?: number
  properties?: Record<string, unknown>
}

export type PageViewEvent = {
  path: string
  title?: string
  referrer?: string
  utm?: UTMParams
}

export type UTMParams = {
  source?: string
  medium?: string
  campaign?: string
  term?: string
  content?: string
}

export type LeadEvent = {
  email?: string
  phone?: string
  name?: string
  company?: string
  source: string
  page: string
  utm?: UTMParams
}

// Get UTM parameters from URL
export function getUTMParams(): UTMParams {
  if (typeof window === 'undefined') return {}

  const params = new URLSearchParams(window.location.search)
  return {
    source: params.get('utm_source') || undefined,
    medium: params.get('utm_medium') || undefined,
    campaign: params.get('utm_campaign') || undefined,
    term: params.get('utm_term') || undefined,
    content: params.get('utm_content') || undefined,
  }
}

// Store UTM params in session storage for attribution
export function storeUTMParams(): void {
  if (typeof window === 'undefined') return

  const utm = getUTMParams()
  if (Object.values(utm).some(Boolean)) {
    sessionStorage.setItem('rocketopp_utm', JSON.stringify(utm))
  }
}

// Get stored UTM params
export function getStoredUTMParams(): UTMParams {
  if (typeof window === 'undefined') return {}

  try {
    const stored = sessionStorage.getItem('rocketopp_utm')
    return stored ? JSON.parse(stored) : {}
  } catch {
    return {}
  }
}

// Generate or retrieve visitor ID (first-party cookie)
export function getVisitorId(): string {
  if (typeof window === 'undefined') return ''

  const COOKIE_NAME = 'rocketopp_vid'
  const cookies = document.cookie.split(';')

  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split('=')
    if (name === COOKIE_NAME) return value
  }

  // Generate new visitor ID
  const vid = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`

  // Set cookie for 2 years
  const expires = new Date()
  expires.setFullYear(expires.getFullYear() + 2)
  document.cookie = `${COOKIE_NAME}=${vid}; expires=${expires.toUTCString()}; path=/; SameSite=Lax`

  return vid
}

// Get session ID
export function getSessionId(): string {
  if (typeof window === 'undefined') return ''

  let sessionId = sessionStorage.getItem('rocketopp_sid')
  if (!sessionId) {
    sessionId = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
    sessionStorage.setItem('rocketopp_sid', sessionId)
  }
  return sessionId
}

// Track page view across all platforms
export function trackPageView(event?: Partial<PageViewEvent>): void {
  if (typeof window === 'undefined') return

  const pageView: PageViewEvent = {
    path: event?.path || window.location.pathname,
    title: event?.title || document.title,
    referrer: event?.referrer || document.referrer,
    utm: event?.utm || getStoredUTMParams(),
  }

  // Google Analytics 4
  if (typeof window.gtag === 'function') {
    window.gtag('event', 'page_view', {
      page_path: pageView.path,
      page_title: pageView.title,
      page_referrer: pageView.referrer,
      ...pageView.utm,
    })
  }

  // Facebook Pixel
  if (typeof window.fbq === 'function') {
    window.fbq('track', 'PageView')
  }

  // Microsoft Clarity (auto-tracks, but we can add custom data)
  if (typeof window.clarity === 'function') {
    window.clarity('set', 'page', pageView.path)
  }

  // Server-side tracking
  sendToServer('pageview', pageView)
}

// Track custom event across all platforms
export function trackEvent(event: AnalyticsEvent): void {
  if (typeof window === 'undefined') return

  // Google Analytics 4
  if (typeof window.gtag === 'function') {
    window.gtag('event', event.name, {
      event_category: event.category,
      event_label: event.label,
      value: event.value,
      ...event.properties,
    })
  }

  // Facebook Pixel (map to standard events when possible)
  if (typeof window.fbq === 'function') {
    const fbEventMap: Record<string, string> = {
      'form_submit': 'Lead',
      'signup': 'CompleteRegistration',
      'purchase': 'Purchase',
      'add_to_cart': 'AddToCart',
      'contact': 'Contact',
      'schedule': 'Schedule',
    }

    const fbEvent = fbEventMap[event.name] || 'CustomEvent'
    window.fbq('track', fbEvent, {
      content_name: event.label,
      content_category: event.category,
      value: event.value,
      ...event.properties,
    })
  }

  // Microsoft Clarity
  if (typeof window.clarity === 'function') {
    window.clarity('event', event.name)
  }

  // Server-side tracking
  sendToServer('event', event)
}

// Track lead/conversion
export function trackLead(lead: LeadEvent): void {
  if (typeof window === 'undefined') return

  // Google Analytics 4
  if (typeof window.gtag === 'function') {
    window.gtag('event', 'generate_lead', {
      currency: 'USD',
      value: 1,
      ...lead,
    })
  }

  // Facebook Pixel
  if (typeof window.fbq === 'function') {
    window.fbq('track', 'Lead', {
      content_name: lead.source,
      content_category: 'lead',
    })
  }

  // Server-side tracking (store in database)
  sendToServer('lead', {
    ...lead,
    visitor_id: getVisitorId(),
    session_id: getSessionId(),
    utm: lead.utm || getStoredUTMParams(),
    timestamp: new Date().toISOString(),
    user_agent: navigator.userAgent,
    screen_size: `${window.screen.width}x${window.screen.height}`,
    viewport: `${window.innerWidth}x${window.innerHeight}`,
  })
}

// Track scroll depth
export function trackScrollDepth(): void {
  if (typeof window === 'undefined') return

  const thresholds = [25, 50, 75, 90, 100]
  const tracked = new Set<number>()

  const handleScroll = () => {
    const scrollTop = window.scrollY
    const docHeight = document.documentElement.scrollHeight - window.innerHeight
    const scrollPercent = Math.round((scrollTop / docHeight) * 100)

    for (const threshold of thresholds) {
      if (scrollPercent >= threshold && !tracked.has(threshold)) {
        tracked.add(threshold)
        trackEvent({
          name: 'scroll_depth',
          category: 'engagement',
          label: `${threshold}%`,
          value: threshold,
        })
      }
    }
  }

  window.addEventListener('scroll', handleScroll, { passive: true })
}

// Track time on page
export function trackTimeOnPage(): void {
  if (typeof window === 'undefined') return

  const startTime = Date.now()
  const intervals = [30, 60, 120, 300] // seconds
  const tracked = new Set<number>()

  const checkTime = () => {
    const elapsed = Math.floor((Date.now() - startTime) / 1000)

    for (const interval of intervals) {
      if (elapsed >= interval && !tracked.has(interval)) {
        tracked.add(interval)
        trackEvent({
          name: 'time_on_page',
          category: 'engagement',
          label: `${interval}s`,
          value: interval,
        })
      }
    }
  }

  setInterval(checkTime, 5000)
}

// Track outbound link clicks
export function trackOutboundLinks(): void {
  if (typeof window === 'undefined') return

  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement
    const link = target.closest('a')

    if (link && link.hostname !== window.location.hostname) {
      trackEvent({
        name: 'outbound_click',
        category: 'engagement',
        label: link.href,
        properties: {
          destination: link.hostname,
          text: link.textContent?.trim(),
        },
      })
    }
  })
}

// Track form interactions
export function trackFormInteractions(): void {
  if (typeof window === 'undefined') return

  // Track form starts (first field focus)
  const formStarts = new WeakSet<HTMLFormElement>()

  document.addEventListener('focusin', (e) => {
    const target = e.target as HTMLElement
    const form = target.closest('form')

    if (form && !formStarts.has(form)) {
      formStarts.add(form)
      trackEvent({
        name: 'form_start',
        category: 'forms',
        label: form.id || form.name || 'unnamed_form',
      })
    }
  })

  // Track form submissions
  document.addEventListener('submit', (e) => {
    const form = e.target as HTMLFormElement
    trackEvent({
      name: 'form_submit',
      category: 'forms',
      label: form.id || form.name || 'unnamed_form',
    })
  })
}

// Track CTA button clicks
export function trackCTAClicks(): void {
  if (typeof window === 'undefined') return

  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement
    const button = target.closest('button, [role="button"], .btn, a[href*="contact"], a[href*="demo"], a[href*="signup"], a[href*="register"], a[href*="start"]')

    if (button) {
      const text = button.textContent?.trim() || ''
      const href = (button as HTMLAnchorElement).href || ''

      // Only track if it looks like a CTA
      const ctaKeywords = ['start', 'get', 'try', 'demo', 'contact', 'sign', 'register', 'subscribe', 'download', 'learn', 'explore', 'view']
      const isCTA = ctaKeywords.some(kw => text.toLowerCase().includes(kw) || href.toLowerCase().includes(kw))

      if (isCTA) {
        trackEvent({
          name: 'cta_click',
          category: 'engagement',
          label: text,
          properties: {
            href,
            page: window.location.pathname,
          },
        })
      }
    }
  })
}

// Send data to server-side tracking endpoint
async function sendToServer(type: string, data: unknown): Promise<void> {
  try {
    await fetch('/api/analytics/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type,
        data,
        visitor_id: getVisitorId(),
        session_id: getSessionId(),
        timestamp: new Date().toISOString(),
      }),
      keepalive: true, // Ensure request completes even on page unload
    })
  } catch {
    // Silently fail - don't break user experience for analytics
  }
}

// Initialize all tracking
export function initializeAnalytics(): void {
  if (typeof window === 'undefined') return

  // Store UTM params on first load
  storeUTMParams()

  // Initialize engagement tracking
  trackScrollDepth()
  trackTimeOnPage()
  trackOutboundLinks()
  trackFormInteractions()
  trackCTAClicks()
}

// Type declarations for global tracking functions
declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
    fbq?: (...args: unknown[]) => void
    clarity?: (...args: unknown[]) => void
    dataLayer?: unknown[]
  }
}
