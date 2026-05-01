import type { Metadata } from 'next'
import SerpDashboardClient from './SerpDashboardClient'

export const metadata: Metadata = {
  title: 'SERP Rank Tracker — RocketOpp Family',
  robots: { index: false, follow: false },
}

export const dynamic = 'force-dynamic'

export default function SerpAdminPage() {
  return <SerpDashboardClient />
}
