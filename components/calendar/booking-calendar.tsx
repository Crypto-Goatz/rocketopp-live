'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import {
  ArrowLeft,
  ArrowRight,
  CalendarCheck,
  CalendarDays,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock,
  Loader2,
  Globe,
  Phone,
} from 'lucide-react'

/**
 * The booking calendar — a real month grid backed by live CRM availability.
 *
 * WHY THIS EXISTS instead of the CRM's own booking iframe: the iframe carries its
 * own fonts, colours and layout, cannot be told about the offer it sits inside, and
 * breaks the page's motion and dark theme. This renders in the site's own tokens and
 * posts to /api/calendar/book.
 *
 * DESIGN DECISIONS worth keeping:
 *
 *  - A MONTH GRID, not a list of days. People know where "next Tuesday" is on a
 *    grid; they have to read a list. Days with no availability stay visible but
 *    inert, so the shape of the month is intact and a gap reads as "booked out"
 *    rather than "missing".
 *  - THREE STEPS, one at a time (date → time → details). Every extra field visible
 *    at the start is a reason to leave.
 *  - TIMEZONE IS DETECTED AND SHOWN. Almost every mis-booked call is a timezone
 *    assumption nobody surfaced. It is editable, and the confirmation restates it.
 *  - MORNING/AFTERNOON/EVENING GROUPING. A flat list of fifteen-minute slots is a
 *    wall of numbers; three labelled columns are scannable.
 *  - The slot that just went is handled: the API returns 409 and the UI drops that
 *    time, refetches and asks for another — it does not fail with a dead end.
 */

type DaySlots = { date: string; slots: string[] }
type Step = 'date' | 'time' | 'details' | 'done'

const WEEKDAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S']
const TZ_CHOICES = [
  'America/New_York',
  'America/Chicago',
  'America/Denver',
  'America/Los_Angeles',
  'America/Phoenix',
  'America/Anchorage',
  'Pacific/Honolulu',
]

/** YYYY-MM-DD for a Date, in a given timezone (not UTC — that shifts the day). */
function isoDate(d: Date, tz: string) {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: tz,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(d)
}

function monthLabel(y: number, m: number) {
  return new Date(y, m, 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
}

function timeLabel(iso: string, tz: string) {
  return new Date(iso).toLocaleTimeString('en-US', {
    timeZone: tz,
    hour: 'numeric',
    minute: '2-digit',
  })
}

function hourIn(iso: string, tz: string) {
  return Number(
    new Intl.DateTimeFormat('en-US', { timeZone: tz, hour: 'numeric', hour12: false }).format(
      new Date(iso),
    ),
  )
}

export default function BookingCalendar({
  calendar = 'website',
  purpose = 'Website consultation',
  heading = 'Pick a time that suits you',
  blurb = 'Fifteen minutes. We look at what you have now, what you need, and whether we are the right fit. No pitch deck.',
  defaultName = '',
  defaultEmail = '',
  defaultPhone = '',
  notesLabel = 'Anything we should know first? (optional)',
}: {
  calendar?: 'website' | 'discovery'
  purpose?: string
  heading?: string
  blurb?: string
  defaultName?: string
  defaultEmail?: string
  defaultPhone?: string
  notesLabel?: string
}) {
  const [tz, setTz] = useState('America/New_York')
  const [days, setDays] = useState<DaySlots[]>([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')

  const [step, setStep] = useState<Step>('date')
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedSlot, setSelectedSlot] = useState('')

  const [name, setName] = useState(defaultName)
  const [email, setEmail] = useState(defaultEmail)
  const [phone, setPhone] = useState(defaultPhone)
  const [notes, setNotes] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState('')
  const [confirmed, setConfirmed] = useState('')

  const stepTopRef = useRef<HTMLDivElement>(null)

  // Detect the visitor's timezone once, and only if we support showing it.
  useEffect(() => {
    try {
      const detected = Intl.DateTimeFormat().resolvedOptions().timeZone
      if (detected) setTz(detected)
    } catch {
      /* keep the Eastern default */
    }
  }, [])

  // Availability. Refetched when the timezone changes, because the CRM groups slots
  // by date IN the requested zone — a Pacific visitor's "Friday" is not Eastern's.
  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setLoadError('')
    fetch(`/api/calendar/slots?calendar=${calendar}&days=45&tz=${encodeURIComponent(tz)}`)
      .then((r) => r.json())
      .then((json) => {
        if (cancelled) return
        setDays(Array.isArray(json.days) ? json.days : [])
        if (json.error || !json.days?.length) {
          setLoadError(
            json.error
              ? 'We could not load the calendar just now.'
              : 'No open times in the next six weeks.',
          )
        }
      })
      .catch(() => {
        if (!cancelled) setLoadError('We could not load the calendar just now.')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [calendar, tz])

  const byDate = useMemo(() => new Map(days.map((d) => [d.date, d.slots])), [days])

  // The month shown starts on the first month that has availability, so the grid
  // never opens on an empty month the visitor has to page past.
  const [cursor, setCursor] = useState(() => {
    const now = new Date()
    return { y: now.getFullYear(), m: now.getMonth() }
  })
  useEffect(() => {
    const first = days[0]?.date
    if (!first) return
    const [y, m] = first.split('-').map(Number)
    setCursor({ y, m: m - 1 })
  }, [days])

  const grid = useMemo(() => {
    const first = new Date(cursor.y, cursor.m, 1)
    const lead = first.getDay()
    const total = new Date(cursor.y, cursor.m + 1, 0).getDate()
    const cells: Array<{ key: string; date?: string; day?: number; count: number }> = []
    for (let i = 0; i < lead; i++) cells.push({ key: `pad-${i}`, count: 0 })
    for (let d = 1; d <= total; d++) {
      const date = `${cursor.y}-${String(cursor.m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
      cells.push({ key: date, date, day: d, count: byDate.get(date)?.length || 0 })
    }
    return cells
  }, [cursor, byDate])

  const monthsWithSlots = useMemo(() => {
    const set = new Set(days.map((d) => d.date.slice(0, 7)))
    return set
  }, [days])

  const cursorKey = `${cursor.y}-${String(cursor.m + 1).padStart(2, '0')}`
  const canPrev = useMemo(() => {
    const keys = [...monthsWithSlots].sort()
    return keys.length > 0 && cursorKey > keys[0]
  }, [monthsWithSlots, cursorKey])
  const canNext = useMemo(() => {
    const keys = [...monthsWithSlots].sort()
    return keys.length > 0 && cursorKey < keys[keys.length - 1]
  }, [monthsWithSlots, cursorKey])

  const today = isoDate(new Date(), tz)

  const slotsForDay = selectedDate ? byDate.get(selectedDate) || [] : []
  const grouped = useMemo(() => {
    const g: { label: string; slots: string[] }[] = [
      { label: 'Morning', slots: [] },
      { label: 'Afternoon', slots: [] },
      { label: 'Evening', slots: [] },
    ]
    for (const s of slotsForDay) {
      const h = hourIn(s, tz)
      if (h < 12) g[0].slots.push(s)
      else if (h < 17) g[1].slots.push(s)
      else g[2].slots.push(s)
    }
    return g.filter((x) => x.slots.length)
  }, [slotsForDay, tz])

  function goto(next: Step) {
    setStep(next)
    // Keep the panel top in view when the step changes — on mobile the grid is
    // taller than the viewport and step 2 would otherwise open off-screen.
    requestAnimationFrame(() => {
      stepTopRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    })
  }

  async function submit() {
    if (submitting) return
    setFormError('')
    if (name.trim().length < 2) return setFormError('Please enter your name.')
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim()))
      return setFormError('Please enter a valid email.')

    setSubmitting(true)
    try {
      const res = await fetch('/api/calendar/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          calendar,
          purpose,
          startTime: selectedSlot,
          timezone: tz,
          name,
          email,
          phone,
          notes,
        }),
      })
      const json = await res.json()

      if (res.status === 409) {
        // Slot went while the form was open. Drop it, refresh, and send them back
        // to the time step rather than dead-ending on an error.
        setDays((prev) =>
          prev.map((d) =>
            d.date === selectedDate ? { ...d, slots: d.slots.filter((s) => s !== selectedSlot) } : d,
          ),
        )
        setSelectedSlot('')
        setFormError(json.error || 'That time was just taken. Please pick another.')
        goto('time')
        return
      }
      if (!res.ok || !json.ok) {
        setFormError(json.error || 'Could not book that time. Please call (878) 888-1230.')
        return
      }

      setConfirmed(json.display || timeLabel(selectedSlot, tz))
      goto('done')
    } catch {
      setFormError('Could not reach us. Please call (878) 888-1230.')
    } finally {
      setSubmitting(false)
    }
  }

  const field =
    'w-full rounded-lg border border-border bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary'

  // ─────────────── Confirmed ───────────────
  if (step === 'done') {
    return (
      <div className="rounded-3xl border border-primary/30 bg-primary/5 p-8 text-center sm:p-12">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/15">
          <CalendarCheck className="h-7 w-7 text-primary" />
        </div>
        <h3 className="mt-6 text-2xl font-bold tracking-tight sm:text-3xl">You&rsquo;re booked</h3>
        <p className="mt-4 font-mono text-lg font-semibold">{confirmed}</p>
        <p className="mx-auto mt-4 max-w-md leading-relaxed text-muted-foreground">
          A calendar invite is on its way to{' '}
          <span className="font-medium text-foreground">{email}</span>. If you need to move it, just
          reply to that email — or call and we will sort it out.
        </p>
        <a
          href="tel:+1-878-888-1230"
          className="mt-7 inline-flex items-center gap-2 rounded-lg border border-border px-6 py-3 font-semibold transition-colors hover:border-primary/40"
        >
          <Phone className="h-4 w-4" />
          (878) 888-1230
        </a>
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-3xl border border-border bg-card">
      {/* ─────────────── Header + step rail ─────────────── */}
      <div ref={stepTopRef} className="border-b border-border p-6 sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h3 className="text-2xl font-bold tracking-tight">{heading}</h3>
            <p className="mt-2 max-w-lg leading-relaxed text-muted-foreground">{blurb}</p>
          </div>
          <span className="inline-flex shrink-0 items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-3 py-1.5 text-xs font-semibold text-primary">
            <Clock className="h-3.5 w-3.5" />
            15 minutes
          </span>
        </div>

        <ol className="mt-6 flex items-center gap-2 text-xs font-medium">
          {(
            [
              ['date', 'Pick a day'],
              ['time', 'Pick a time'],
              ['details', 'Your details'],
            ] as const
          ).map(([key, label], i) => {
            const order: Step[] = ['date', 'time', 'details']
            const current = order.indexOf(step)
            const done = i < current
            const active = i === current
            return (
              <li key={key} className="flex items-center gap-2">
                {i > 0 && <span className="h-px w-4 bg-border sm:w-8" aria-hidden />}
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 transition-colors ${
                    active
                      ? 'border-primary bg-primary/10 text-primary'
                      : done
                        ? 'border-border text-muted-foreground'
                        : 'border-border text-muted-foreground/50'
                  }`}
                >
                  {done ? (
                    <Check className="h-3 w-3" aria-hidden />
                  ) : (
                    <span className="font-mono">{i + 1}</span>
                  )}
                  <span className="hidden sm:inline">{label}</span>
                </span>
              </li>
            )
          })}
        </ol>
      </div>

      {/* ─────────────── Step 1: the month grid ─────────────── */}
      {step === 'date' && (
        <div className="p-6 sm:p-8">
          {loading ? (
            <div className="flex flex-col items-center gap-3 py-16 text-muted-foreground">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
              <p className="text-sm">Checking the calendar…</p>
            </div>
          ) : loadError && !days.length ? (
            <div className="py-12 text-center">
              <CalendarDays className="mx-auto h-8 w-8 text-muted-foreground/50" />
              <p className="mt-4 font-medium">{loadError}</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Call and we will find a time the old-fashioned way.
              </p>
              <a
                href="tel:+1-878-888-1230"
                className="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground transition-opacity hover:opacity-90"
              >
                <Phone className="h-4 w-4" />
                (878) 888-1230
              </a>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between">
                <button
                  onClick={() => setCursor((c) => (c.m === 0 ? { y: c.y - 1, m: 11 } : { ...c, m: c.m - 1 }))}
                  disabled={!canPrev}
                  aria-label="Previous month"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground disabled:opacity-30"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <p className="font-semibold tracking-tight">{monthLabel(cursor.y, cursor.m)}</p>
                <button
                  onClick={() => setCursor((c) => (c.m === 11 ? { y: c.y + 1, m: 0 } : { ...c, m: c.m + 1 }))}
                  disabled={!canNext}
                  aria-label="Next month"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground disabled:opacity-30"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>

              <div className="mt-5 grid grid-cols-7 gap-1 sm:gap-2">
                {WEEKDAYS.map((d, i) => (
                  <div
                    key={i}
                    aria-hidden
                    className="pb-1 text-center text-[11px] font-bold uppercase tracking-wider text-muted-foreground/60"
                  >
                    {d}
                  </div>
                ))}

                {grid.map((cell) => {
                  if (!cell.date) return <div key={cell.key} />
                  const open = cell.count > 0
                  const isToday = cell.date === today
                  return (
                    <button
                      key={cell.key}
                      onClick={() => {
                        setSelectedDate(cell.date!)
                        setSelectedSlot('')
                        goto('time')
                      }}
                      disabled={!open}
                      aria-label={
                        open
                          ? `${cell.date}, ${cell.count} times available`
                          : `${cell.date}, no times available`
                      }
                      className={`group relative flex aspect-square flex-col items-center justify-center rounded-xl border text-sm transition-all ${
                        open
                          ? 'border-border bg-background font-semibold hover:-translate-y-0.5 hover:border-primary hover:bg-primary/10 hover:text-primary'
                          : 'cursor-not-allowed border-transparent text-muted-foreground/30'
                      } ${isToday && open ? 'ring-1 ring-primary/40' : ''}`}
                    >
                      {cell.day}
                      {/* Availability dot — density without a number in every cell. */}
                      {open && (
                        <span
                          aria-hidden
                          className="mt-1 h-1 w-1 rounded-full bg-primary transition-transform group-hover:scale-150"
                        />
                      )}
                    </button>
                  )
                })}
              </div>

              <TzPicker tz={tz} setTz={setTz} />
            </>
          )}
        </div>
      )}

      {/* ─────────────── Step 2: times ─────────────── */}
      {step === 'time' && (
        <div className="p-6 sm:p-8">
          <button
            onClick={() => goto('date')}
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Change day
          </button>

          <p className="mt-4 text-lg font-semibold tracking-tight">
            {new Date(`${selectedDate}T12:00:00`).toLocaleDateString('en-US', {
              weekday: 'long',
              month: 'long',
              day: 'numeric',
            })}
          </p>

          {formError && (
            <p className="mt-4 rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm">
              {formError}
            </p>
          )}

          {grouped.length === 0 ? (
            <p className="mt-6 text-muted-foreground">
              Those times just went. Pick another day and we will lock it in.
            </p>
          ) : (
            <div className="mt-6 space-y-6">
              {grouped.map((g) => (
                <div key={g.label}>
                  <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground/70">
                    {g.label}
                  </p>
                  <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
                    {g.slots.map((s) => (
                      <button
                        key={s}
                        onClick={() => {
                          setSelectedSlot(s)
                          setFormError('')
                          goto('details')
                        }}
                        className={`rounded-lg border px-3 py-3 font-mono text-sm font-medium tabular-nums transition-all hover:-translate-y-0.5 ${
                          s === selectedSlot
                            ? 'border-primary bg-primary/15 text-primary'
                            : 'border-border hover:border-primary hover:bg-primary/10 hover:text-primary'
                        }`}
                      >
                        {timeLabel(s, tz)}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          <TzPicker tz={tz} setTz={setTz} />
        </div>
      )}

      {/* ─────────────── Step 3: details ─────────────── */}
      {step === 'details' && (
        <div className="p-6 sm:p-8">
          <button
            onClick={() => goto('time')}
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Change time
          </button>

          <div className="mt-4 flex items-start gap-3 rounded-xl border border-primary/30 bg-primary/5 p-4">
            <CalendarCheck className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
            <div>
              <p className="font-semibold">
                {new Date(selectedSlot).toLocaleDateString('en-US', {
                  timeZone: tz,
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric',
                })}{' '}
                at {timeLabel(selectedSlot, tz)}
              </p>
              <p className="mt-0.5 text-sm text-muted-foreground">
                15 minutes · {tz.replace(/_/g, ' ')}
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              autoComplete="name"
              className={field}
            />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              autoComplete="email"
              className={field}
            />
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Phone (so we can call you)"
              autoComplete="tel"
              className={`${field} sm:col-span-2`}
            />
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder={notesLabel}
              className={`${field} resize-none sm:col-span-2`}
            />
          </div>

          {formError && (
            <p className="mt-4 rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm">
              {formError}
            </p>
          )}

          <button
            onClick={submit}
            disabled={submitting}
            className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-6 py-4 text-base font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            {submitting ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" /> Booking…
              </>
            ) : (
              <>
                Confirm this time <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
          <p className="mt-3 text-center text-xs text-muted-foreground">
            You will get a calendar invite by email. No card, no obligation.
          </p>
        </div>
      )}
    </div>
  )
}

/**
 * Timezone control.
 *
 * Shown on every step that displays a time. The detected zone is included in the
 * list even when it is not a US one, so a visitor abroad sees their own zone
 * selected rather than being silently shown Eastern.
 */
function TzPicker({ tz, setTz }: { tz: string; setTz: (v: string) => void }) {
  const options = TZ_CHOICES.includes(tz) ? TZ_CHOICES : [tz, ...TZ_CHOICES]
  return (
    <label className="mt-7 flex flex-wrap items-center gap-2 border-t border-border pt-5 text-sm text-muted-foreground">
      <Globe className="h-4 w-4 shrink-0 text-primary" aria-hidden />
      <span>Times shown in</span>
      <select
        value={tz}
        onChange={(e) => setTz(e.target.value)}
        aria-label="Timezone"
        className="rounded-lg border border-border bg-background px-3 py-1.5 text-sm text-foreground focus:border-primary focus:outline-none"
      >
        {options.map((z) => (
          <option key={z} value={z}>
            {z.replace(/_/g, ' ')}
          </option>
        ))}
      </select>
    </label>
  )
}
