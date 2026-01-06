// Predefined analytics events for RocketOpp
// Use these for consistent event naming across the platform

import { trackEvent, trackLead, type AnalyticsEvent } from './index'

// ============================================
// NAVIGATION EVENTS
// ============================================

export function trackNavClick(item: string, section: string = 'main') {
  trackEvent({
    name: 'navigation_click',
    category: 'navigation',
    label: item,
    properties: { section },
  })
}

export function trackMenuOpen(menuName: string) {
  trackEvent({
    name: 'menu_open',
    category: 'navigation',
    label: menuName,
  })
}

// ============================================
// HOMEPAGE EVENTS
// ============================================

export function trackHeroInteraction(action: string) {
  trackEvent({
    name: 'hero_interaction',
    category: 'homepage',
    label: action,
  })
}

export function trackServiceCardClick(service: string) {
  trackEvent({
    name: 'service_card_click',
    category: 'homepage',
    label: service,
  })
}

export function trackTestimonialView(testimonialId: string) {
  trackEvent({
    name: 'testimonial_view',
    category: 'homepage',
    label: testimonialId,
  })
}

// ============================================
// SERVICE PAGE EVENTS
// ============================================

export function trackServicePageView(service: string) {
  trackEvent({
    name: 'service_page_view',
    category: 'services',
    label: service,
  })
}

export function trackServiceCTAClick(service: string, cta: string) {
  trackEvent({
    name: 'service_cta_click',
    category: 'services',
    label: `${service} - ${cta}`,
    properties: { service, cta },
  })
}

// ============================================
// MARKETPLACE EVENTS
// ============================================

export function trackProductView(productSlug: string, productName: string) {
  trackEvent({
    name: 'product_view',
    category: 'marketplace',
    label: productName,
    properties: { product_slug: productSlug },
  })
}

export function trackAddToCart(productSlug: string, price: number, model: string) {
  trackEvent({
    name: 'add_to_cart',
    category: 'marketplace',
    label: productSlug,
    value: price,
    properties: { price, purchase_model: model },
  })
}

export function trackCheckoutStart(productSlug: string, price: number) {
  trackEvent({
    name: 'checkout_start',
    category: 'marketplace',
    label: productSlug,
    value: price,
  })
}

export function trackPurchase(productSlug: string, price: number, model: string) {
  trackEvent({
    name: 'purchase',
    category: 'marketplace',
    label: productSlug,
    value: price,
    properties: { price, purchase_model: model },
  })
}

// ============================================
// AUTH EVENTS
// ============================================

export function trackLoginStart() {
  trackEvent({
    name: 'login_start',
    category: 'auth',
    label: 'login_page',
  })
}

export function trackLoginSuccess() {
  trackEvent({
    name: 'login_success',
    category: 'auth',
    label: 'success',
  })
}

export function trackLoginFailure(reason: string) {
  trackEvent({
    name: 'login_failure',
    category: 'auth',
    label: reason,
  })
}

export function trackSignupStart() {
  trackEvent({
    name: 'signup_start',
    category: 'auth',
    label: 'register_page',
  })
}

export function trackSignupSuccess() {
  trackEvent({
    name: 'signup_success',
    category: 'auth',
    label: 'success',
  })
}

// ============================================
// DASHBOARD EVENTS
// ============================================

export function trackDashboardView(section: string) {
  trackEvent({
    name: 'dashboard_view',
    category: 'dashboard',
    label: section,
  })
}

export function trackToolUse(tool: string, fuelCost: number) {
  trackEvent({
    name: 'tool_use',
    category: 'dashboard',
    label: tool,
    value: fuelCost,
    properties: { fuel_cost: fuelCost },
  })
}

export function trackProfileUpdate(field: string) {
  trackEvent({
    name: 'profile_update',
    category: 'dashboard',
    label: field,
  })
}

export function trackTagsSelected(count: number, tags: string[]) {
  trackEvent({
    name: 'tags_selected',
    category: 'dashboard',
    label: `${count} tags`,
    value: count,
    properties: { tags },
  })
}

// ============================================
// LEAD GENERATION EVENTS
// ============================================

export function trackContactFormSubmit(data: {
  email?: string
  phone?: string
  name?: string
  company?: string
  page: string
}) {
  trackLead({
    ...data,
    source: 'contact_form',
  })
}

export function trackDemoRequest(data: {
  email: string
  name?: string
  company?: string
}) {
  trackLead({
    ...data,
    source: 'demo_request',
    page: window.location.pathname,
  })
}

export function trackNewsletterSignup(email: string) {
  trackLead({
    email,
    source: 'newsletter',
    page: window.location.pathname,
  })
}

export function trackAssessmentStart() {
  trackEvent({
    name: 'assessment_start',
    category: 'lead_gen',
    label: 'ai_assessment',
  })
}

export function trackAssessmentComplete(data: {
  email?: string
  name?: string
  company?: string
  answers?: Record<string, unknown>
}) {
  trackLead({
    ...data,
    source: 'ai_assessment',
    page: '/ai-assessment',
  })
}

// ============================================
// ENGAGEMENT EVENTS
// ============================================

export function trackVideoPlay(videoId: string, title: string) {
  trackEvent({
    name: 'video_play',
    category: 'engagement',
    label: title,
    properties: { video_id: videoId },
  })
}

export function trackVideoComplete(videoId: string, title: string) {
  trackEvent({
    name: 'video_complete',
    category: 'engagement',
    label: title,
    properties: { video_id: videoId },
  })
}

export function trackFAQExpand(question: string) {
  trackEvent({
    name: 'faq_expand',
    category: 'engagement',
    label: question,
  })
}

export function trackSocialShare(platform: string, url: string) {
  trackEvent({
    name: 'social_share',
    category: 'engagement',
    label: platform,
    properties: { shared_url: url },
  })
}

// ============================================
// ERROR TRACKING
// ============================================

export function trackError(error: string, context: string) {
  trackEvent({
    name: 'error',
    category: 'errors',
    label: error,
    properties: { context, page: window.location.pathname },
  })
}

export function track404(path: string) {
  trackEvent({
    name: 'page_not_found',
    category: 'errors',
    label: path,
  })
}

// ============================================
// SEARCH EVENTS
// ============================================

export function trackSearch(query: string, results: number) {
  trackEvent({
    name: 'search',
    category: 'search',
    label: query,
    value: results,
    properties: { results_count: results },
  })
}

export function trackSearchResultClick(query: string, resultUrl: string, position: number) {
  trackEvent({
    name: 'search_result_click',
    category: 'search',
    label: query,
    value: position,
    properties: { result_url: resultUrl, position },
  })
}

// ============================================
// UTILITY FUNCTION
// ============================================

// Track any custom event with type safety
export function track(event: AnalyticsEvent) {
  trackEvent(event)
}
