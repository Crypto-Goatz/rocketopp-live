import type { Metadata } from 'next'
import { AffiliateDashboard } from './affiliate-dashboard'

export const dynamic = 'force-dynamic'

import { withCro9Meta } from '@/lib/cro9-meta'
const metadataBase: Metadata = {
  title: 'HIPAA Partner Dashboard',
  description: 'Your referral link, clicks, conversions, payouts, and download kit.',
}

export async function generateMetadata(): Promise<Metadata> {
  return withCro9Meta('/dashboard/affiliate', metadataBase)
}

export default function Page() {
  return <AffiliateDashboard />
}
