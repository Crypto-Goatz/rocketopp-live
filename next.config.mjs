import { withBotId } from 'botid/next/config'

/**
 * NOTE on the CSP below: withBotId adds same-origin proxy rewrites so the BotID
 * client is served from this domain rather than a third-party host. That is why
 * `script-src 'self'` and `connect-src 'self'` are sufficient and the CSP does not
 * need a new allowlist entry. Do not "helpfully" add an external BotID host — the
 * proxy exists precisely so ad-blockers cannot defeat it.
 */
/** @type {import('next').NextConfig} */
const nextConfig = {
  /**
   * Stamped at build so the ecosystem strip can state an ABSOLUTE deploy date.
   * Never render this as a relative time: these pages are statically generated,
   * so "x ago" computed at build would freeze and lie for the life of the cache.
   */
  env: {
    BUILD_TIME: new Date().toISOString(),
  },
  turbopack: {
    // Enable for development
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: false,
    minimumCacheTTL: 14400,
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  cacheComponents: false,
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            /*
              THIS CSP SILENTLY BLOCKED EVERY ANALYTICS SCRIPT ON THE SITE.

              Measured 2026-09-24 in a real browser: the CRO9 tracker tag was
              present in the DOM with the correct key, and `window.CRO9` was
              undefined — the script never executed, because `script-src` did not
              list www.cro9.com. The CRO9 row for rocketopp.com held 1,504 events
              and ZERO from rocketopp.com since 2026-06-26.

              It was never only CRO9. `script-src 'self'` also blocked
              googletagmanager.com (GA4 + GTM) and clarity.ms, all three of which
              this layout loads via AnalyticsProvider. The site has been measuring
              NOTHING, by any tool, for three months.

              A CSP failure is visible only as a console message, and console
              errors are not a surface anyone checks — so a tag that is present,
              correct, and completely inert looks exactly like a working install.
              If an analytics host is ever added to the app, it MUST be added here
              in the same commit or it is dead on arrival.

              Kept deliberately narrow: named hosts only, no wildcards beyond the
              vercel/clarity subdomains that genuinely need them.
            */
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' https://vercel.live https://*.vercel.app https://www.cro9.com https://www.googletagmanager.com https://www.clarity.ms",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "img-src 'self' data: blob: https: http:",
              "font-src 'self' https://fonts.gstatic.com",
              "connect-src 'self' https://*.vercel.app https://api.groq.com https://*.blob.vercel-storage.com wss://*.vercel.app https://www.cro9.com https://www.google-analytics.com https://*.google-analytics.com https://www.googletagmanager.com https://*.clarity.ms",
              "frame-src 'self' https://www.googletagmanager.com",
              "frame-ancestors 'self'",
              "form-action 'self'",
              "base-uri 'self'",
              "object-src 'none'",
            ].join('; ')
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()'
          }
        ]
      }
    ]
  },
  async redirects() {
    return [
      { source: '/hippa', destination: '/hipaa', permanent: true },
      { source: '/hippa/:path*', destination: '/hipaa/:path*', permanent: true },
    ]
  },
}

export default withBotId(nextConfig)
