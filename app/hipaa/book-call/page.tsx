import type { Metadata } from 'next'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Book your HIPAA support call | RocketOpp',
  description: 'Schedule your free 30-minute HIPAA compliance support call with Mike.',
}

/**
 * /hipaa/book-call?order=<id>
 *
 * Thin redirect shim that appends the `order_id` as a query param to the
 * CRM-hosted calendar page. The CRM calendar is configured to include the
 * order_id field on the booking form, so every booking attaches back to
 * the customer's contact record.
 *
 * Set NEXT_PUBLIC_HIPAA_BOOKING_URL in env to your CRM calendar URL, e.g.
 *   https://rocketopp.com/widget/bookings/hipaa-support
 */

interface Props { searchParams: Promise<{ order?: string; topic?: string }> }

export default async function Page({ searchParams }: Props) {
  const sp = await searchParams
  const base = process.env.NEXT_PUBLIC_HIPAA_BOOKING_URL || 'https://api.leadconnectorhq.com/widget/bookings/hipaa-support'
  const url = new URL(base)
  if (sp.order) url.searchParams.set('order_id', sp.order)
  if (sp.topic) url.searchParams.set('topic', sp.topic)
  url.searchParams.set('source', 'rocketopp-hipaa')
  redirect(url.toString())
}
