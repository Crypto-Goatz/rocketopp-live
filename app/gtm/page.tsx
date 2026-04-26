import { Metadata } from 'next'
import { GtmLanding } from './gtm-landing'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'GTM Reality Check + AI Pre-Brief | 30-Min Session | From $49 | RocketOpp',
  description:
    'Complete a 5-question AI assessment, pay $49, and book your 30-minute GTM Reality Check with Mike. We find the leak in your go-to-market and give you 3 fixes you can run today.',
  robots: { index: true, follow: true },
  openGraph: {
    title: 'GTM Reality Check + AI Pre-Brief | $49 | RocketOpp',
    description: 'AI-powered GTM audit + 30-min strategy call. Find your GTM leak in 30 minutes.',
    url: 'https://rocketopp.com/gtm',
    siteName: 'RocketOpp',
    type: 'website',
  },
}

export default function GtmPage() {
  return <GtmLanding />
}
