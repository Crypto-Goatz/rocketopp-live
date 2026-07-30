import type { Metadata } from 'next'
import { Suspense } from 'react'

import LaunchClient from './LaunchClient'

export const metadata: Metadata = {
  title: 'Final Payment — Your Site Is Live',
  description: 'Settle your website build and start your monthly hosting.',
  // Transactional, reached from a link we send. Never a search result.
  robots: { index: false, follow: false },
}

export default function LaunchPage() {
  return (
    <main className="min-h-screen bg-background">
      <Suspense fallback={<div className="min-h-screen" />}>
        <LaunchClient />
      </Suspense>
    </main>
  )
}
