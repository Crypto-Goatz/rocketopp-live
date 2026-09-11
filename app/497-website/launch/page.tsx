import type { Metadata } from 'next'
import { Suspense } from 'react'

import LaunchClient from './LaunchClient'

import { withCro9Meta } from '@/lib/cro9-meta'
const metadataBase: Metadata = {
  title: 'Final Payment — Your Site Is Live',
  description: 'Settle your website build and start your monthly hosting.',
  // Transactional, reached from a link we send. Never a search result.
  robots: { index: false, follow: false },
}

export async function generateMetadata(): Promise<Metadata> {
  return withCro9Meta('/497-website/launch', metadataBase)
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
