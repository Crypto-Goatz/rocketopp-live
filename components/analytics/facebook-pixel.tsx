'use client'

import Script from 'next/script'

interface FacebookPixelProps {
  pixelId: string
}

export function FacebookPixel({ pixelId }: FacebookPixelProps) {
  if (!pixelId) return null

  return (
    <>
      <Script id="facebook-pixel" strategy="afterInteractive">
        {`
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');

          fbq('init', '${pixelId}');
          fbq('track', 'PageView');

          // Enable advanced matching for better attribution
          fbq('init', '${pixelId}', {}, {
            agent: 'rocketopp-next'
          });
        `}
      </Script>
      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: 'none' }}
          src={`https://www.facebook.com/tr?id=${pixelId}&ev=PageView&noscript=1`}
          alt=""
        />
      </noscript>
    </>
  )
}

// Facebook Pixel event helpers
export function fbTrack(event: string, params?: Record<string, unknown>) {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', event, params)
  }
}

export function fbTrackCustom(event: string, params?: Record<string, unknown>) {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('trackCustom', event, params)
  }
}

// Standard Facebook events
export const fbEvents = {
  lead: (value?: number, currency = 'USD') =>
    fbTrack('Lead', { value, currency }),

  completeRegistration: (value?: number, currency = 'USD') =>
    fbTrack('CompleteRegistration', { value, currency }),

  addToCart: (value: number, currency = 'USD', contentIds?: string[]) =>
    fbTrack('AddToCart', { value, currency, content_ids: contentIds }),

  initiateCheckout: (value: number, currency = 'USD', numItems = 1) =>
    fbTrack('InitiateCheckout', { value, currency, num_items: numItems }),

  purchase: (value: number, currency = 'USD', contentIds?: string[]) =>
    fbTrack('Purchase', { value, currency, content_ids: contentIds }),

  contact: () => fbTrack('Contact'),

  schedule: () => fbTrack('Schedule'),

  startTrial: (value?: number, currency = 'USD') =>
    fbTrack('StartTrial', { value, currency }),

  subscribe: (value: number, currency = 'USD') =>
    fbTrack('Subscribe', { value, currency }),

  viewContent: (contentName: string, contentCategory?: string) =>
    fbTrack('ViewContent', { content_name: contentName, content_category: contentCategory }),

  search: (searchString: string) =>
    fbTrack('Search', { search_string: searchString }),
}
