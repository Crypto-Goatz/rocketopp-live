import type { Metadata } from 'next'
import SerpDashboardClient from './SerpDashboardClient'

import { withCro9Meta } from '@/lib/cro9-meta'
const metadataBase: Metadata = {
  title: 'SERP Rank Tracker',
  robots: { index: false, follow: false },
}

export async function generateMetadata(): Promise<Metadata> {
  return withCro9Meta('/admin/serp', metadataBase)
}

export const dynamic = 'force-dynamic'

export default function SerpAdminPage() {
  return <SerpDashboardClient />
}
