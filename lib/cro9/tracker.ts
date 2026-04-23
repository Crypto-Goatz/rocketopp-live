/**
 * CRO9 client-side tracker.
 *
 * Install once per page load via <Cro9Tracker />. Fires a pageview on mount
 * and exposes trackEvent() for named conversions (scan_started, scan_completed,
 * outbound_click, etc.). Uses sendBeacon when available so events survive
 * tab-close + fast back-navigation.
 *
 * State model:
 *   - visitor_id: UUID, stable across sessions (localStorage)
 *   - session_id: UUID, rotates after 30 min of inactivity (sessionStorage + ts)
 *   - UTM + `cc` (contact code): captured on first page of a session, persisted
 *     for the session so every event carries campaign attribution
 */

const STORAGE_KEY_VISITOR = "cro9_vid"
const STORAGE_KEY_SESSION = "cro9_sid"
const STORAGE_KEY_ATTR = "cro9_attr"
const SESSION_WINDOW_MS = 30 * 60 * 1000

function uuid(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID()
  // RFC4122 v4 fallback
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === "x" ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

function getVisitorId(): string {
  try {
    const existing = localStorage.getItem(STORAGE_KEY_VISITOR)
    if (existing) return existing
    const fresh = uuid()
    localStorage.setItem(STORAGE_KEY_VISITOR, fresh)
    return fresh
  } catch {
    return uuid()
  }
}

function getSessionId(): string {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY_SESSION)
    if (raw) {
      const parsed = JSON.parse(raw) as { id: string; ts: number }
      if (Date.now() - parsed.ts < SESSION_WINDOW_MS) {
        parsed.ts = Date.now()
        sessionStorage.setItem(STORAGE_KEY_SESSION, JSON.stringify(parsed))
        return parsed.id
      }
    }
    const fresh = uuid()
    sessionStorage.setItem(STORAGE_KEY_SESSION, JSON.stringify({ id: fresh, ts: Date.now() }))
    return fresh
  } catch {
    return uuid()
  }
}

interface Attribution {
  utm_source?: string
  utm_medium?: string
  utm_campaign?: string
  utm_content?: string
  utm_term?: string
  cc?: string // CRM contact code — used by the collect route to sync to a CRM contact
}

function captureAttribution(): Attribution {
  try {
    const url = new URL(window.location.href)
    const captured: Attribution = {}
    const keys: Array<keyof Attribution> = [
      "utm_source",
      "utm_medium",
      "utm_campaign",
      "utm_content",
      "utm_term",
      "cc",
    ]
    let foundAny = false
    for (const k of keys) {
      const v = url.searchParams.get(k)
      if (v) {
        captured[k] = v
        foundAny = true
      }
    }

    if (foundAny) {
      sessionStorage.setItem(STORAGE_KEY_ATTR, JSON.stringify(captured))
      return captured
    }

    const raw = sessionStorage.getItem(STORAGE_KEY_ATTR)
    if (raw) return JSON.parse(raw) as Attribution
    return {}
  } catch {
    return {}
  }
}

function detectDevice(): "mobile" | "tablet" | "desktop" {
  if (typeof window === "undefined") return "desktop"
  const w = window.innerWidth
  const ua = navigator.userAgent.toLowerCase()
  if (/ipad|tablet/.test(ua) || (w >= 600 && w < 1024)) return "tablet"
  if (/mobile|android|iphone/.test(ua) || w < 600) return "mobile"
  return "desktop"
}

function detectBrowser(): string {
  const ua = navigator.userAgent
  if (/Edg\//.test(ua)) return "edge"
  if (/Chrome\//.test(ua) && !/Chromium/.test(ua)) return "chrome"
  if (/Firefox\//.test(ua)) return "firefox"
  if (/Safari\//.test(ua)) return "safari"
  return "other"
}

export interface TrackPayload {
  site_id: string
  type: string
  data?: Record<string, unknown>
}

export function sendEvent(payload: TrackPayload): void {
  if (typeof window === "undefined") return

  const attr = captureAttribution()
  const body = {
    site_id: payload.site_id,
    type: payload.type,
    visitor_id: getVisitorId(),
    session_id: getSessionId(),
    timestamp: new Date().toISOString(),
    url: window.location.href,
    path: window.location.pathname,
    referrer: document.referrer || null,
    utm_source: attr.utm_source || null,
    utm_medium: attr.utm_medium || null,
    utm_campaign: attr.utm_campaign || null,
    device: detectDevice(),
    browser: detectBrowser(),
    data: {
      ...(attr.utm_content ? { utm_content: attr.utm_content } : {}),
      ...(attr.utm_term ? { utm_term: attr.utm_term } : {}),
      ...(attr.cc ? { cc: attr.cc } : {}),
      ...(payload.data || {}),
    },
  }

  const blob = new Blob([JSON.stringify(body)], { type: "application/json" })
  const url = "/api/cro9/collect"

  try {
    if (navigator.sendBeacon) {
      navigator.sendBeacon(url, blob)
      return
    }
  } catch {
    // fall through to fetch
  }

  void fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    keepalive: true,
  }).catch(() => {
    // swallow — tracking must never break the page
  })
}

// Convenience helpers — default site_id resolved via a module-level setter so
// consumers don't have to thread the ID through every call site.
let DEFAULT_SITE_ID: string | null = null

export function initCro9(siteId: string): void {
  DEFAULT_SITE_ID = siteId
}

export function trackEvent(type: string, data?: Record<string, unknown>): void {
  if (!DEFAULT_SITE_ID) return
  sendEvent({ site_id: DEFAULT_SITE_ID, type, data })
}

export function trackPageview(data?: Record<string, unknown>): void {
  trackEvent("pageview", data)
}
