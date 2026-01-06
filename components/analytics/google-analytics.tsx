'use client'

import Script from 'next/script'

interface GoogleAnalyticsProps {
  measurementId: string
}

export function GoogleAnalytics({ measurementId }: GoogleAnalyticsProps) {
  if (!measurementId) return null

  return (
    <>
      {/* Google Analytics 4 - Async loading */}
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', '${measurementId}', {
            page_path: window.location.pathname,
            send_page_view: true,
            cookie_flags: 'SameSite=None;Secure',
            // Enhanced measurement settings
            enhanced_conversions: true,
            // Link attribution
            link_attribution: true,
            // User engagement
            engagement_time_msec: 100,
          });

          // Track Core Web Vitals
          if (typeof web_vitals !== 'undefined') {
            web_vitals.getCLS(function(metric) {
              gtag('event', 'web_vitals', {
                event_category: 'Web Vitals',
                event_label: 'CLS',
                value: Math.round(metric.value * 1000),
                non_interaction: true,
              });
            });
            web_vitals.getFID(function(metric) {
              gtag('event', 'web_vitals', {
                event_category: 'Web Vitals',
                event_label: 'FID',
                value: Math.round(metric.value),
                non_interaction: true,
              });
            });
            web_vitals.getLCP(function(metric) {
              gtag('event', 'web_vitals', {
                event_category: 'Web Vitals',
                event_label: 'LCP',
                value: Math.round(metric.value),
                non_interaction: true,
              });
            });
          }
        `}
      </Script>
    </>
  )
}

// Export measurement ID getter for use in other components
export function getGA4MeasurementId(): string | undefined {
  return process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID
}
