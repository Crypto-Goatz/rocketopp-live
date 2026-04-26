import type { Metadata } from 'next'
import { DashboardView } from './dashboard-view'
import { HipaaAnimatedBackground } from '@/components/hipaa-animated-background'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'My HIPAA Reports | RocketOpp',
  description: 'Open, download, or book your 0nCore-generated HIPAA readiness reports.',
}

export default function Page() {
  return (
    <main className="min-h-screen bg-background relative">
      <HipaaAnimatedBackground />
      <div className="relative z-10">
        <DashboardView />
      </div>
    </main>
  )
}
