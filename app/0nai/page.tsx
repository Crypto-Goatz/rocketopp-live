import type { Metadata } from 'next'
import { NaiDashboard } from './nai-dashboard'
import { HipaaAnimatedBackground } from '@/components/hipaa-animated-background'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: '0nAI Analytics | RocketOpp',
  description: 'Live traffic, campaign attribution, and funnel analytics powered by the CRO9 / 0nAI engine.',
}

export default function Page() {
  return (
    <main className="relative min-h-screen bg-background">
      <HipaaAnimatedBackground />
      <div className="relative z-10">
        <NaiDashboard />
      </div>
    </main>
  )
}
