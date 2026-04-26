import type { Metadata } from 'next'
import { AffiliateLanding } from './affiliate-landing'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'HIPAA Partner Program — Earn 30% on Every Report | RocketOpp',
  description:
    'Refer healthcare clients and earn 30% on every HIPAA report tier ($149 to $4,800+). Auto-signup, instant dashboard, referral link + downloads. Payouts via ACH or PayPal through RocketOpp.',
  alternates: { canonical: 'https://rocketopp.com/hipaa/affiliate' },
  openGraph: {
    title: 'HIPAA Partner Program · 30% recurring on every report',
    description:
      'Sign up in under 60 seconds. Share your link. Get paid on every HIPAA report your network buys.',
    url: 'https://rocketopp.com/hipaa/affiliate',
    type: 'website',
    images: [{ url: 'https://rocketopp.com/images/rocketopp-og.png', width: 1200, height: 630, alt: 'RocketOpp HIPAA Affiliate Program' }],
  },
  twitter: { card: 'summary_large_image', title: 'HIPAA Partner Program · 30% per report', description: 'Refer once. Get paid every time.' },
}

export default function Page() {
  return <AffiliateLanding />
}
