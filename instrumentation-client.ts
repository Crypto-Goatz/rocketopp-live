import { initBotId } from 'botid/client/core'

/**
 * BotID — bot protection for the endpoints that cost money or create records.
 *
 * SCOPE RULE: only POST endpoints that a human triggers from a page in this app.
 * Never a page route. BotID's job is to block bots, so putting it on a GET page
 * would block Googlebot from the content — the exact opposite of everything the
 * SEO/AEO work on this site is for.
 *
 * Deliberately NOT protected, and why:
 *  - /api/webhooks/*        Stripe and CRM call these server-to-server. There is no
 *                          browser session, so BotID would reject every webhook.
 *  - /api/cron/*            Same: no page session. Vercel cron would be blocked.
 *  - /api/emails/preview    Needs to be openable/fetchable directly.
 *  - /api/auth/sso/*        Machine-to-machine token exchange between properties.
 *  - /api/0nmcp/mcp         MCP protocol endpoint for AI clients, not a browser.
 *  - sitemap / robots       Must stay crawlable.
 *
 * TESTING CAVEAT: per Vercel's docs, curl against a protected route WILL be blocked
 * in production. Test these by submitting the real form in a browser, not with curl.
 * Locally, checkBotId() always returns isBot:false unless developmentOptions is set.
 */
initBotId({
  protect: [
    // ── The $497 offer funnel — the highest-value path on the site ──
    { path: '/api/offer', method: 'POST' },
    { path: '/api/offer/deposit', method: 'POST' },
    { path: '/api/offer/launch', method: 'POST' },

    // ── Booking (components/calendar/booking-calendar.tsx) ──
    { path: '/api/calendar/book', method: 'POST' },

    // ── Lead capture ──
    { path: '/api/contact/submit', method: 'POST' },
    { path: '/api/leads', method: 'POST' },
    { path: '/api/leads/*', method: 'POST' },
    { path: '/api/assessment/submit', method: 'POST' },
    { path: '/api/support', method: 'POST' },
    { path: '/api/recommend', method: 'POST' },
    { path: '/api/ai-readiness/scan', method: 'POST' },

    // ── Paid / quoting flows ──
    { path: '/api/order/quote', method: 'POST' },
    { path: '/api/order/deposit', method: 'POST' },
    { path: '/api/checkout', method: 'POST' },

    // ── HIPAA product: ordering, scanning, affiliate signup ──
    { path: '/api/hipaa/order', method: 'POST' },
    { path: '/api/hipaa/checkout', method: 'POST' },
    { path: '/api/hipaa/scan', method: 'POST' },
    { path: '/api/hipaa/magic/send', method: 'POST' },
    { path: '/api/hipaa/coupon/validate', method: 'POST' },
    { path: '/api/hipaa/affiliate/signup', method: 'POST' },

    // ── APEX assessment: the analyze/screenshot calls are expensive per request ──
    { path: '/api/apex/lead', method: 'POST' },
    { path: '/api/apex/analyze', method: 'POST' },
    { path: '/api/apex/screenshot', method: 'POST' },

    // ── Account creation and password reset — classic abuse targets ──
    { path: '/api/auth/register', method: 'POST' },
    { path: '/api/auth/forgot-password', method: 'POST' },
    { path: '/api/auth/reset-password', method: 'POST' },
  ],
})
