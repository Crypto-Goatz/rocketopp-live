import { NextRequest, NextResponse } from 'next/server'

import { DEFAULT_TZ, getFreeSlots, resolveCalendarId } from '@/lib/crm/calendar'

/**
 * GET /api/calendar/slots?calendar=website&days=21&tz=America/New_York
 *
 * Availability for the custom booking calendar. Deliberately NOT BotID-protected:
 * it is a read of public availability with no cost and no record created, and the
 * booking POST is where the guard belongs.
 *
 * Cached for 60s at the edge. Availability that is a minute stale is fine — a slot
 * that vanished in that window is caught by the booking POST, which returns "that
 * time was just taken" rather than double-booking.
 */
export const revalidate = 0

export async function GET(request: NextRequest) {
  const sp = request.nextUrl.searchParams

  const calendarId = resolveCalendarId(sp.get('calendar'))
  const timezone = sp.get('tz') || DEFAULT_TZ
  // Clamped: a huge window is a slow CRM call, and nobody books 6 months out for a
  // kickoff call.
  const days = Math.min(60, Math.max(1, Number(sp.get('days')) || 21))

  // Start from now, not midnight — past slots today would render as bookable.
  const startMs = Date.now()
  const endMs = startMs + days * 86_400_000

  const { days: available, error } = await getFreeSlots(calendarId, startMs, endMs, timezone)

  return NextResponse.json(
    { days: available, timezone, error: error || null },
    {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
      },
    },
  )
}
