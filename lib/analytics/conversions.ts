// Advanced Conversion & Funnel Tracking for RocketOpp

import { trackEvent, trackLead, getVisitorId, getSessionId, getStoredUTMParams } from './index'

// ============================================
// CONVERSION DEFINITIONS
// ============================================

export type ConversionType =
  | 'signup'           // Account created
  | 'lead'             // Contact form / demo request
  | 'purchase'         // Marketplace purchase
  | 'subscription'     // Started subscription
  | 'tool_use'         // Used a free AI tool
  | 'profile_complete' // Completed profile
  | 'upgrade'          // Upgraded plan

export interface Conversion {
  type: ConversionType
  value?: number
  currency?: string
  metadata?: Record<string, unknown>
}

// ============================================
// FUNNEL DEFINITIONS
// ============================================

export const FUNNELS = {
  // Signup funnel
  signup: {
    name: 'User Signup',
    steps: [
      { id: 'view_register', name: 'View Register Page' },
      { id: 'start_form', name: 'Start Form' },
      { id: 'submit_form', name: 'Submit Form' },
      { id: 'email_verified', name: 'Email Verified' },
      { id: 'profile_started', name: 'Started Profile' },
      { id: 'profile_complete', name: 'Profile Complete' },
    ]
  },

  // Purchase funnel
  purchase: {
    name: 'Marketplace Purchase',
    steps: [
      { id: 'view_marketplace', name: 'View Marketplace' },
      { id: 'view_product', name: 'View Product' },
      { id: 'click_buy', name: 'Click Buy' },
      { id: 'start_checkout', name: 'Start Checkout' },
      { id: 'complete_purchase', name: 'Complete Purchase' },
    ]
  },

  // Lead generation funnel
  lead_gen: {
    name: 'Lead Generation',
    steps: [
      { id: 'land_on_site', name: 'Land on Site' },
      { id: 'view_services', name: 'View Services' },
      { id: 'click_cta', name: 'Click CTA' },
      { id: 'view_contact', name: 'View Contact' },
      { id: 'start_form', name: 'Start Form' },
      { id: 'submit_lead', name: 'Submit Lead' },
    ]
  },

  // Tool engagement funnel
  tool_engagement: {
    name: 'Tool Engagement',
    steps: [
      { id: 'view_dashboard', name: 'View Dashboard' },
      { id: 'view_tools', name: 'View Tools' },
      { id: 'select_tool', name: 'Select Tool' },
      { id: 'use_tool', name: 'Use Tool' },
      { id: 'complete_task', name: 'Complete Task' },
    ]
  },

  // Assessment funnel
  assessment: {
    name: 'AI Assessment',
    steps: [
      { id: 'view_assessment', name: 'View Assessment' },
      { id: 'start_assessment', name: 'Start Assessment' },
      { id: 'question_1', name: 'Answer Q1' },
      { id: 'question_2', name: 'Answer Q2' },
      { id: 'question_3', name: 'Answer Q3' },
      { id: 'submit_assessment', name: 'Submit Assessment' },
      { id: 'view_results', name: 'View Results' },
    ]
  },
} as const

export type FunnelId = keyof typeof FUNNELS

// ============================================
// CONVERSION TRACKING
// ============================================

export function trackConversion(conversion: Conversion): void {
  if (typeof window === 'undefined') return

  const { type, value, currency = 'USD', metadata } = conversion

  // Track in GA4
  if (typeof window.gtag === 'function') {
    window.gtag('event', 'conversion', {
      send_to: process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID,
      event_category: 'conversion',
      event_label: type,
      value: value,
      currency: currency,
      ...metadata,
    })
  }

  // Track in Facebook
  if (typeof window.fbq === 'function') {
    const fbEventMap: Record<ConversionType, string> = {
      signup: 'CompleteRegistration',
      lead: 'Lead',
      purchase: 'Purchase',
      subscription: 'Subscribe',
      tool_use: 'CustomEvent',
      profile_complete: 'CompleteRegistration',
      upgrade: 'Subscribe',
    }

    window.fbq('track', fbEventMap[type], {
      value: value,
      currency: currency,
      content_name: type,
      ...metadata,
    })
  }

  // Send to server
  sendConversionToServer(conversion)
}

async function sendConversionToServer(conversion: Conversion): Promise<void> {
  try {
    await fetch('/api/analytics/conversion', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...conversion,
        visitor_id: getVisitorId(),
        session_id: getSessionId(),
        utm: getStoredUTMParams(),
        page: window.location.pathname,
        timestamp: new Date().toISOString(),
      }),
      keepalive: true,
    })
  } catch {
    // Silently fail
  }
}

// ============================================
// FUNNEL TRACKING
// ============================================

// Track funnel step
export function trackFunnelStep(funnelId: FunnelId, stepId: string): void {
  if (typeof window === 'undefined') return

  const funnel = FUNNELS[funnelId]
  const stepIndex = funnel.steps.findIndex(s => s.id === stepId)
  const step = funnel.steps[stepIndex]

  if (!step) return

  // Store in session for funnel analysis
  const funnelKey = `funnel_${funnelId}`
  const currentSteps = JSON.parse(sessionStorage.getItem(funnelKey) || '[]')

  if (!currentSteps.includes(stepId)) {
    currentSteps.push(stepId)
    sessionStorage.setItem(funnelKey, JSON.stringify(currentSteps))
  }

  // Track event
  trackEvent({
    name: 'funnel_step',
    category: 'funnel',
    label: `${funnelId}:${stepId}`,
    value: stepIndex + 1,
    properties: {
      funnel_id: funnelId,
      funnel_name: funnel.name,
      step_id: stepId,
      step_name: step.name,
      step_number: stepIndex + 1,
      total_steps: funnel.steps.length,
    },
  })
}

// Get current funnel progress
export function getFunnelProgress(funnelId: FunnelId): {
  completedSteps: string[]
  currentStep: number
  totalSteps: number
  completionRate: number
} {
  if (typeof window === 'undefined') {
    return { completedSteps: [], currentStep: 0, totalSteps: 0, completionRate: 0 }
  }

  const funnel = FUNNELS[funnelId]
  const funnelKey = `funnel_${funnelId}`
  const completedSteps = JSON.parse(sessionStorage.getItem(funnelKey) || '[]')

  return {
    completedSteps,
    currentStep: completedSteps.length,
    totalSteps: funnel.steps.length,
    completionRate: (completedSteps.length / funnel.steps.length) * 100,
  }
}

// ============================================
// ENGAGEMENT SCORING
// ============================================

export interface EngagementScore {
  score: number        // 0-100
  level: 'cold' | 'warm' | 'hot' | 'engaged'
  factors: {
    pageviews: number
    timeOnSite: number
    interactions: number
    conversions: number
    recency: number
  }
}

export function calculateEngagementScore(): EngagementScore {
  if (typeof window === 'undefined') {
    return {
      score: 0,
      level: 'cold',
      factors: { pageviews: 0, timeOnSite: 0, interactions: 0, conversions: 0, recency: 0 }
    }
  }

  // Get stored engagement data
  const pageviews = parseInt(sessionStorage.getItem('rocketopp_pageviews') || '1')
  const sessionStart = parseInt(sessionStorage.getItem('rocketopp_session_start') || Date.now().toString())
  const timeOnSite = Math.floor((Date.now() - sessionStart) / 1000 / 60) // minutes
  const interactions = parseInt(sessionStorage.getItem('rocketopp_interactions') || '0')
  const conversions = parseInt(sessionStorage.getItem('rocketopp_conversions') || '0')

  // Calculate factor scores (0-20 each)
  const factors = {
    pageviews: Math.min(pageviews * 4, 20),           // 5 pages = max
    timeOnSite: Math.min(timeOnSite * 2, 20),         // 10 min = max
    interactions: Math.min(interactions * 2, 20),     // 10 interactions = max
    conversions: Math.min(conversions * 10, 20),      // 2 conversions = max
    recency: 20,                                       // Currently on site = max
  }

  const score = factors.pageviews + factors.timeOnSite + factors.interactions + factors.conversions + factors.recency

  let level: EngagementScore['level'] = 'cold'
  if (score >= 80) level = 'engaged'
  else if (score >= 60) level = 'hot'
  else if (score >= 40) level = 'warm'

  return { score, level, factors }
}

// Track interaction for engagement scoring
export function trackInteraction(): void {
  if (typeof window === 'undefined') return

  const current = parseInt(sessionStorage.getItem('rocketopp_interactions') || '0')
  sessionStorage.setItem('rocketopp_interactions', (current + 1).toString())
}

// Initialize session tracking
export function initEngagementTracking(): void {
  if (typeof window === 'undefined') return

  // Set session start if not set
  if (!sessionStorage.getItem('rocketopp_session_start')) {
    sessionStorage.setItem('rocketopp_session_start', Date.now().toString())
  }

  // Increment pageview count
  const pageviews = parseInt(sessionStorage.getItem('rocketopp_pageviews') || '0')
  sessionStorage.setItem('rocketopp_pageviews', (pageviews + 1).toString())

  // Track clicks for interaction scoring
  document.addEventListener('click', () => trackInteraction(), { once: false, passive: true })
}

// ============================================
// GOAL TRACKING
// ============================================

export interface Goal {
  id: string
  name: string
  type: 'event' | 'pageview' | 'duration' | 'pages_per_session'
  target: {
    event?: string
    page?: string
    duration?: number      // seconds
    pageCount?: number
  }
  value?: number
}

export const GOALS: Goal[] = [
  {
    id: 'signup_complete',
    name: 'Signup Complete',
    type: 'event',
    target: { event: 'signup_success' },
    value: 10,
  },
  {
    id: 'contact_form',
    name: 'Contact Form Submit',
    type: 'event',
    target: { event: 'form_submit' },
    value: 5,
  },
  {
    id: 'purchase',
    name: 'Marketplace Purchase',
    type: 'event',
    target: { event: 'purchase' },
    value: 50,
  },
  {
    id: 'tool_usage',
    name: 'AI Tool Used',
    type: 'event',
    target: { event: 'tool_use' },
    value: 3,
  },
  {
    id: 'engaged_session',
    name: 'Engaged Session (5+ pages)',
    type: 'pages_per_session',
    target: { pageCount: 5 },
    value: 2,
  },
  {
    id: 'long_session',
    name: 'Long Session (3+ min)',
    type: 'duration',
    target: { duration: 180 },
    value: 1,
  },
]

export function trackGoalCompletion(goalId: string): void {
  const goal = GOALS.find(g => g.id === goalId)
  if (!goal) return

  trackEvent({
    name: 'goal_completion',
    category: 'goals',
    label: goal.name,
    value: goal.value,
    properties: {
      goal_id: goalId,
      goal_type: goal.type,
    },
  })

  // Increment conversions for engagement scoring
  if (typeof window !== 'undefined') {
    const conversions = parseInt(sessionStorage.getItem('rocketopp_conversions') || '0')
    sessionStorage.setItem('rocketopp_conversions', (conversions + 1).toString())
  }
}

// ============================================
// USER JOURNEY TRACKING
// ============================================

export interface JourneyStep {
  page: string
  timestamp: number
  duration?: number
  events: string[]
}

export function getJourney(): JourneyStep[] {
  if (typeof window === 'undefined') return []

  try {
    return JSON.parse(sessionStorage.getItem('rocketopp_journey') || '[]')
  } catch {
    return []
  }
}

export function addJourneyStep(page: string): void {
  if (typeof window === 'undefined') return

  const journey = getJourney()

  // Update duration of last step
  if (journey.length > 0) {
    const lastStep = journey[journey.length - 1]
    lastStep.duration = Date.now() - lastStep.timestamp
  }

  // Add new step
  journey.push({
    page,
    timestamp: Date.now(),
    events: [],
  })

  // Keep last 50 steps
  const trimmed = journey.slice(-50)
  sessionStorage.setItem('rocketopp_journey', JSON.stringify(trimmed))
}

export function addJourneyEvent(eventName: string): void {
  if (typeof window === 'undefined') return

  const journey = getJourney()
  if (journey.length > 0) {
    journey[journey.length - 1].events.push(eventName)
    sessionStorage.setItem('rocketopp_journey', JSON.stringify(journey))
  }
}

// ============================================
// ATTRIBUTION TRACKING
// ============================================

export interface Attribution {
  firstTouch: {
    source?: string
    medium?: string
    campaign?: string
    landing?: string
    timestamp: number
  }
  lastTouch: {
    source?: string
    medium?: string
    campaign?: string
    landing?: string
    timestamp: number
  }
  touchpoints: number
}

export function getAttribution(): Attribution {
  if (typeof window === 'undefined') {
    return {
      firstTouch: { timestamp: 0 },
      lastTouch: { timestamp: 0 },
      touchpoints: 0,
    }
  }

  try {
    const stored = localStorage.getItem('rocketopp_attribution')
    if (stored) return JSON.parse(stored)
  } catch {}

  return {
    firstTouch: { timestamp: 0 },
    lastTouch: { timestamp: 0 },
    touchpoints: 0,
  }
}

export function updateAttribution(): void {
  if (typeof window === 'undefined') return

  const params = new URLSearchParams(window.location.search)
  const source = params.get('utm_source') || (document.referrer ? new URL(document.referrer).hostname : 'direct')
  const medium = params.get('utm_medium') || 'none'
  const campaign = params.get('utm_campaign') || undefined

  const current = getAttribution()
  const now = Date.now()

  // Set first touch if not set
  if (!current.firstTouch.timestamp) {
    current.firstTouch = {
      source,
      medium,
      campaign,
      landing: window.location.pathname,
      timestamp: now,
    }
  }

  // Always update last touch
  current.lastTouch = {
    source,
    medium,
    campaign,
    landing: window.location.pathname,
    timestamp: now,
  }

  current.touchpoints += 1

  localStorage.setItem('rocketopp_attribution', JSON.stringify(current))
}
