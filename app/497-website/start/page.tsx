import type { Metadata } from 'next'
import { Suspense } from 'react'

import StartClient from './StartClient'

const SITE = 'https://rocketopp.com'

/**
 * CRM booking calendar for the $497 kickoff.
 *
 * Overridable via env so the calendar can be swapped without a deploy. The
 * default is the live RocketOpp booking calendar already embedded in
 * components/contact/SmartContactForm.tsx, so this page works out of the box.
 * Set CRM_BOOKING_URL (or NEXT_PUBLIC_CRM_BOOKING_URL) to point the $497 kickoff
 * at a dedicated calendar instead of the general one.
 */
const BOOKING_URL =
  process.env.NEXT_PUBLIC_CRM_BOOKING_URL ||
  process.env.CRM_BOOKING_URL ||
  'https://links.rocketclients.com/widget/booking/p4EEMwP9hLoGQ1eF7pv0'

const TITLE = 'Lock Your $497 Build Slot — Deposit & Kickoff'
const DESCRIPTION =
  'Pay the $247 deposit to reserve your $497 website build slot and book your 15-minute kickoff call. Remaining $250 due at launch.'

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: `${SITE}/497-website/start` },
  // Transactional page reached from email — no reason for search engines to index it.
  robots: { index: false, follow: false },
}

export default function StartPage() {
  return (
    <main className="min-h-screen bg-background">
      <Suspense fallback={<div className="min-h-screen" />}>
        <StartClient bookingUrl={BOOKING_URL} />
      </Suspense>
    </main>
  )
}
