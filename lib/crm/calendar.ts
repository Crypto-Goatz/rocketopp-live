/**
 * CRM calendar access — free slots and appointment creation.
 *
 * WHY THIS DOESN'T USE crmGet/crmPost from ./client:
 * crmGet appends `locationId` to the query string of every request. The calendar
 * free-slots endpoint rejects that with a 422 ("property locationId should not
 * exist"), so it needs its own request path. Auth resolution is still shared —
 * getAuthForLocation() gives us the OAuth install if there is one, and falls back
 * to the location PIT.
 *
 * API version: the calendar endpoints are documented against 2021-04-15. Verified
 * live against calendar Gbe0IPMoYEHkcLrrcX7Y ("Website Consultation") on the
 * RocketOpp location.
 */

import { getAuthForLocation } from './client'

const CRM_API = 'https://services.leadconnectorhq.com'
const CALENDAR_VERSION = '2021-04-15'

/** RocketOpp location. */
export const LOCATION_ID = process.env.CRM_LOCATION_ID || '6MSqx0trfxgLxeHBJE1k'

/**
 * The calendars this site can book into, by purpose.
 *
 * Hard-coded IDs with an env override: these are stable records in the CRM, and a
 * missing env var must not silently disable booking on a page that advertises it.
 * Confirmed live from GET /calendars/?locationId=6MSqx0trfxgLxeHBJE1k.
 */
export const CALENDARS = {
  /** $497 kickoff / website consult — 15 min, service_booking. */
  website: process.env.CRM_CALENDAR_WEBSITE || 'Gbe0IPMoYEHkcLrrcX7Y',
  /** Discovery call — general enquiries. */
  discovery: process.env.CRM_CALENDAR_DISCOVERY || 'p4EEMwP9hLoGQ1eF7pv0',
} as const

export type CalendarKey = keyof typeof CALENDARS

export function resolveCalendarId(key: string | null | undefined): string {
  if (key && key in CALENDARS) return CALENDARS[key as CalendarKey]
  return CALENDARS.website
}

export const DEFAULT_TZ = 'America/New_York'

/** One bookable day, as the UI needs it. */
export type DaySlots = {
  /** YYYY-MM-DD in the requested timezone. */
  date: string
  /** ISO strings with offset, exactly as the CRM returned them. */
  slots: string[]
}

async function calendarFetch(path: string, init: RequestInit = {}): Promise<Response> {
  const auth = await getAuthForLocation(LOCATION_ID)
  return fetch(`${CRM_API}${path}`, {
    ...init,
    headers: {
      ...(init.headers as Record<string, string> | undefined),
      Authorization: `Bearer ${auth.token}`,
      Version: CALENDAR_VERSION,
      'Content-Type': 'application/json',
    },
    cache: 'no-store',
  })
}

/**
 * Free slots for a calendar over a date window.
 *
 * The CRM returns a map keyed by date — `{ "2026-07-30": { slots: [...] }, traceId }`
 * — so this normalises it into a sorted array and drops the traceId key. Returns []
 * on any failure rather than throwing: a booking UI that shows "no times available,
 * call us" degrades better than one that renders an error page.
 */
export async function getFreeSlots(
  calendarId: string,
  startMs: number,
  endMs: number,
  timezone = DEFAULT_TZ,
): Promise<{ days: DaySlots[]; error?: string }> {
  const qs = new URLSearchParams({
    startDate: String(startMs),
    endDate: String(endMs),
    timezone,
  })

  try {
    const res = await calendarFetch(`/calendars/${calendarId}/free-slots?${qs}`)
    if (!res.ok) {
      const text = await res.text().catch(() => '')
      console.error('[crm.calendar] free-slots failed:', res.status, text.slice(0, 300))
      return { days: [], error: `CRM returned ${res.status}` }
    }

    const json = (await res.json()) as Record<string, unknown>
    const days: DaySlots[] = []
    for (const [key, value] of Object.entries(json)) {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(key)) continue // skips traceId and any future meta keys
      const slots = (value as { slots?: unknown })?.slots
      if (!Array.isArray(slots) || !slots.length) continue
      days.push({ date: key, slots: slots.filter((s): s is string => typeof s === 'string') })
    }
    days.sort((a, b) => a.date.localeCompare(b.date))
    return { days }
  } catch (err) {
    console.error('[crm.calendar] free-slots threw:', err)
    return { days: [], error: 'Could not reach the calendar.' }
  }
}

export type BookingInput = {
  calendarId: string
  /** ISO string with offset, taken verbatim from a free-slots response. */
  startTime: string
  name: string
  email: string
  phone?: string
  timezone?: string
  /** Free-text context shown on the appointment. */
  notes?: string
  /** Where the booking came from, for the appointment title. */
  source?: string
}

export type BookingResult =
  | { ok: true; appointmentId: string; contactId: string }
  | { ok: false; error: string; status?: number }

/**
 * Book an appointment.
 *
 * Two steps, because the appointments endpoint needs a contactId:
 *   1. Upsert the contact so a repeat booker doesn't create a duplicate record.
 *   2. Create the appointment against that contact.
 *
 * endTime is deliberately omitted — the CRM derives it from the calendar's own slot
 * duration. Sending our own guess is how a 15-minute calendar ends up with
 * 30-minute appointments on it.
 */
export async function bookAppointment(input: BookingInput): Promise<BookingResult> {
  const timezone = input.timezone || DEFAULT_TZ
  const [firstName, ...rest] = input.name.trim().split(/\s+/)

  // ── 1. Upsert the contact ──
  let contactId = ''
  try {
    const res = await calendarFetch('/contacts/upsert', {
      method: 'POST',
      body: JSON.stringify({
        locationId: LOCATION_ID,
        firstName: firstName || input.email.split('@')[0],
        lastName: rest.join(' ') || undefined,
        name: input.name.trim() || undefined,
        email: input.email.trim().toLowerCase(),
        phone: input.phone?.trim() || undefined,
        timezone,
        source: input.source || 'rocketopp.com booking',
      }),
    })
    const json = await res.json().catch(() => ({}))
    contactId = json?.contact?.id || json?.id || ''
    if (!res.ok || !contactId) {
      console.error('[crm.calendar] upsert failed:', res.status, JSON.stringify(json).slice(0, 300))
      return { ok: false, error: 'Could not save your details.', status: res.status }
    }
  } catch (err) {
    console.error('[crm.calendar] upsert threw:', err)
    return { ok: false, error: 'Could not reach the CRM.' }
  }

  // ── 2. Create the appointment ──
  try {
    const res = await calendarFetch('/calendars/events/appointments', {
      method: 'POST',
      body: JSON.stringify({
        calendarId: input.calendarId,
        locationId: LOCATION_ID,
        contactId,
        startTime: input.startTime,
        title: input.source
          ? `${input.source} — ${input.name.trim()}`
          : `Booking — ${input.name.trim()}`,
        appointmentStatus: 'confirmed',
        // The slot came from this calendar's own availability, so date-range
        // validation should apply — we are not force-booking outside hours.
        ignoreDateRange: false,
        toNotify: true,
      }),
    })
    const json = await res.json().catch(() => ({}))
    const appointmentId = json?.id || json?.event?.id || json?.appointmentId || ''
    if (!res.ok || !appointmentId) {
      console.error(
        '[crm.calendar] appointment failed:',
        res.status,
        JSON.stringify(json).slice(0, 400),
      )
      // 400/422 here almost always means the slot went while the form was open.
      const taken = res.status === 400 || res.status === 422
      return {
        ok: false,
        status: res.status,
        error: taken
          ? 'That time was just taken. Pick another and we will lock it in.'
          : 'Could not book that time.',
      }
    }
    return { ok: true, appointmentId, contactId }
  } catch (err) {
    console.error('[crm.calendar] appointment threw:', err)
    return { ok: false, error: 'Could not reach the calendar.' }
  }
}
