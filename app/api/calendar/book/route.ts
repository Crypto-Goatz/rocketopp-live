import { NextRequest, NextResponse } from 'next/server'
import { waitUntil } from '@vercel/functions'
import { checkBotId } from 'botid/server'

import { bookAppointment, DEFAULT_TZ, resolveCalendarId } from '@/lib/crm/calendar'
import { notifyFormSubmission } from '@/lib/crm/notify'

/**
 * POST /api/calendar/book
 *
 * Books a slot from the custom calendar into the CRM.
 *
 * ORDER MATTERS. The appointment is created FIRST and the notification emails run
 * after, in waitUntil. If the CRM rejects the slot, the caller gets a real error and
 * can pick again — and no "you're booked!" email has gone out for a booking that
 * does not exist. The reverse order would send confirmations for phantom meetings.
 *
 * The email/notify step is fire-and-forget by design, but wrapped in waitUntil so
 * the serverless function is not frozen the moment the response is returned.
 */
export const runtime = 'nodejs'
export const maxDuration = 30

function isEmail(v: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)
}

export async function POST(request: NextRequest) {
  try {
    const bot = await checkBotId()
    if (bot.isBot) {
      return NextResponse.json({ error: 'Access denied.' }, { status: 403 })
    }

    const body = await request.json().catch(() => ({}))

    const name = String(body.name || '').trim()
    const email = String(body.email || '').trim().toLowerCase()
    const phone = String(body.phone || '').trim()
    const startTime = String(body.startTime || '').trim()
    const notes = String(body.notes || '').trim()
    const timezone = String(body.timezone || '').trim() || DEFAULT_TZ
    const calendarKey = String(body.calendar || 'website')
    const purpose = String(body.purpose || '').trim()

    if (!name || name.length < 2) {
      return NextResponse.json({ error: 'Please enter your name.' }, { status: 400 })
    }
    if (!isEmail(email)) {
      return NextResponse.json({ error: 'Please enter a valid email.' }, { status: 400 })
    }
    if (!startTime) {
      return NextResponse.json({ error: 'Please pick a time.' }, { status: 400 })
    }
    // The slot must parse and must be in the future — a stale tab could otherwise
    // post a time that has already passed.
    const when = new Date(startTime)
    if (Number.isNaN(when.getTime())) {
      return NextResponse.json({ error: 'That time is not valid.' }, { status: 400 })
    }
    if (when.getTime() < Date.now() - 60_000) {
      return NextResponse.json(
        { error: 'That time has passed. Please pick another.' },
        { status: 400 },
      )
    }

    const calendarId = resolveCalendarId(calendarKey)
    const source = purpose || 'Website consultation'

    const result = await bookAppointment({
      calendarId,
      startTime,
      name,
      email,
      phone,
      timezone,
      notes,
      source,
    })

    if (!result.ok) {
      return NextResponse.json(
        { error: result.error },
        { status: result.status === 400 || result.status === 422 ? 409 : 502 },
      )
    }

    const pretty = when.toLocaleString('en-US', {
      timeZone: timezone,
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      timeZoneName: 'short',
    })

    // Thank-you to them + notification to Mike. Never blocks the response, but
    // waitUntil keeps the function alive long enough for it to finish.
    waitUntil(
      notifyFormSubmission({
        email,
        fullName: name,
        phone: phone || undefined,
        message: notes || undefined,
        source: 'rocketopp-calendar-booking',
        formName: `Booking — ${source}`,
        pageUrl: request.headers.get('referer') || 'https://rocketopp.com/book',
        tags: ['booked-call', calendarKey === 'website' ? '497-kickoff' : 'discovery'],
        extras: {
          'Booked for': pretty,
          Timezone: timezone,
          Calendar: source,
          'Appointment ID': result.appointmentId,
        },
      }).catch((err) => console.error('[calendar/book] notify failed:', err)),
    )

    return NextResponse.json({
      ok: true,
      appointmentId: result.appointmentId,
      when: startTime,
      display: pretty,
    })
  } catch (err) {
    console.error('[calendar/book] failed:', err)
    return NextResponse.json(
      { error: 'Something went wrong. Please call (878) 888-1230.' },
      { status: 500 },
    )
  }
}
