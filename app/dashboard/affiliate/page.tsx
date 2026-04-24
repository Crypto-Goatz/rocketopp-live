import type { Metadata } from 'next'
import { AffiliateDashboard } from './affiliate-dashboard'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'HIPAA Partner Dashboard — RocketOpp',
  description: 'Your referral link, clicks, conversions, payouts, and download kit.',
}

export default function Page() {
  return <AffiliateDashboard />
}
