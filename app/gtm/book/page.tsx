/**
 * /gtm/book — Post-payment booking page
 *
 * Stripe redirects here with ?session_id=xxx after successful payment.
 * Verifies the session, reads assessment answers from metadata,
 * then renders the GHL discovery-call calendar embed.
 *
 * Required env vars:
 *   NEXT_PUBLIC_GTM_BOOKING_URL  — GHL calendar widget URL
 *                                   e.g. https://api.rocketclients.com/widget/booking/[id]
 *   STRIPE_SECRET_KEY            — standard (already set)
 */

import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { stripe } from '@/lib/stripe'
import { GtmBookingClient } from './booking-client'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Book Your GTM Reality Check | RocketOpp',
  robots: { index: false, follow: false },
}

interface Props {
  searchParams: { session_id?: string; cancelled?: string }
}

export default async function GtmBookPage({ searchParams }: Props) {
  const sessionId = searchParams.session_id

  // No session → redirect back to landing
  if (!sessionId) {
    redirect('/gtm')
  }

  let firstName = ''
  let email     = ''
  let assessment: Record<string, string> = {}

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId)

    // Only proceed if payment was actually completed
    if (session.payment_status !== 'paid') {
      redirect('/gtm?cancelled=true')
    }

    const m = session.metadata || {}
    firstName  = m.first_name || ''
    email      = m.email      || session.customer_email || ''
    assessment = {
      business:   m.q1 || '',
      revenue:    m.q2 || '',
      bottleneck: m.q3 || '',
      channels:   m.q4 || '',
      goal:       m.q5 || '',
    }
  } catch (e) {
    console.error('[gtm/book] session retrieve error:', e)
    redirect('/gtm')
  }

  const bookingUrl = process.env.NEXT_PUBLIC_GTM_BOOKING_URL ||
    'https://api.rocketclients.com/widget/booking/DISCOVERY_CALL_CALENDAR_ID'

  return (
    <GtmBookingClient
      firstName={firstName}
      email={email}
      assessment={assessment}
      bookingUrl={bookingUrl}
      sessionId={sessionId}
    />
  )
}
