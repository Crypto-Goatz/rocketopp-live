'use client'

import Script from 'next/script'

interface GoogleTagManagerProps {
  containerId: string
}

export function GoogleTagManager({ containerId }: GoogleTagManagerProps) {
  if (!containerId) return null

  return (
    <>
      {/* Google Tag Manager - Head Script */}
      <Script id="google-tag-manager" strategy="afterInteractive">
        {`
          (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','${containerId}');
        `}
      </Script>
    </>
  )
}

// GTM noscript iframe (for body)
export function GoogleTagManagerNoScript({ containerId }: GoogleTagManagerProps) {
  if (!containerId) return null

  return (
    <noscript>
      <iframe
        src={`https://www.googletagmanager.com/ns.html?id=${containerId}`}
        height="0"
        width="0"
        style={{ display: 'none', visibility: 'hidden' }}
      />
    </noscript>
  )
}

// Data Layer push helper
export function pushToDataLayer(data: Record<string, unknown>) {
  if (typeof window !== 'undefined' && window.dataLayer) {
    window.dataLayer.push(data)
  }
}

// Enhanced ecommerce tracking via GTM
export function trackEcommerceEvent(
  event: 'view_item' | 'add_to_cart' | 'begin_checkout' | 'purchase',
  data: {
    currency?: string
    value?: number
    items?: Array<{
      item_id: string
      item_name: string
      price: number
      quantity?: number
      item_category?: string
    }>
    transaction_id?: string
  }
) {
  pushToDataLayer({
    event,
    ecommerce: {
      currency: data.currency || 'USD',
      value: data.value,
      items: data.items,
      transaction_id: data.transaction_id,
    },
  })
}
