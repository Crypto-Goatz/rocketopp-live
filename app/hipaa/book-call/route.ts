/**
 * GET /hipaa/book-call?order=<id>&topic=<slug>
 *
 * Server-side 307 to the CRM calendar with order_id attached so every booking
 * threads back to the customer's contact record. Implemented as a route
 * handler (not a page) so we return a real HTTP redirect, not an HTML
 * document with an embedded client-side redirect instruction.
 */

import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const DEFAULT_BOOKING_URL = 'https://api.rocketclients.com/widget/booking/5xtTejAwYmiwULqboaL7'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const order = searchParams.get('order') || ''
  const topic = searchParams.get('topic') || ''

  const base = process.env.NEXT_PUBLIC_HIPAA_BOOKING_URL || DEFAULT_BOOKING_URL
  const target = new URL(base)
  if (order) target.searchParams.set('order_id', order)
  if (topic) target.searchParams.set('topic', topic)
  target.searchParams.set('source', 'rocketopp-hipaa')

  const res = NextResponse.redirect(target.toString(), { status: 307 })
  res.headers.set('Cache-Control', 'private, no-store, max-age=0')
  res.headers.set('X-Robots-Tag', 'noindex, nofollow')
  return res
}
