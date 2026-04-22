import type { Metadata } from 'next'
import { DashboardView } from './dashboard-view'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'My HIPAA Reports | RocketOpp',
  description: 'Open, download, or book your 0nCore-generated HIPAA readiness reports.',
}

export default function Page() {
  return (
    <main className="min-h-screen bg-background">
      <DashboardView />
    </main>
  )
}
