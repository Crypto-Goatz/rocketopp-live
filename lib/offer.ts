/**
 * The $497 website offer — shared definition.
 *
 * The offer window is REAL and self-maintaining: it runs Monday through Friday
 * and closes at Friday 23:59:59 America/New_York, then reopens Monday morning.
 * The countdown is computed from the actual clock rather than a hardcoded date,
 * so the deadline on the page is always true and never needs resetting by hand.
 *
 * This matters. Fake scarcity — a timer that resets on reload, "only 3 left"
 * that never changes — is exactly the kind of thing that undermines the
 * honest-content positioning the rest of the site is built on.
 */

export const OFFER_PRICE = 497
export const OFFER_PRICE_DISPLAY = '$497'

/** New York offset in hours: EDT (-4) roughly Mar–Nov, EST (-5) otherwise. */
function nyOffsetHours(d: Date): number {
  // Determine the US Eastern offset by asking Intl what hour it is there.
  const utcHour = d.getUTCHours()
  const nyHour = Number(
    new Intl.DateTimeFormat('en-US', {
      timeZone: 'America/New_York',
      hour: 'numeric',
      hour12: false,
    }).format(d),
  )
  let diff = nyHour - utcHour
  if (diff > 12) diff -= 24
  if (diff < -12) diff += 24
  return diff
}

/**
 * The next Friday 23:59:59 America/New_York, as a UTC Date.
 * If it is already the weekend, this returns the FOLLOWING Friday — which is
 * the correct deadline for the offer window that reopens on Monday.
 */
export function nextDeadline(now: Date = new Date()): Date {
  const offset = nyOffsetHours(now)
  // Shift into "NY wall clock" space so day-of-week and hour are local.
  const ny = new Date(now.getTime() + offset * 3600_000)

  const day = ny.getUTCDay() // 0 Sun … 5 Fri, 6 Sat — in NY terms
  let daysUntilFriday = (5 - day + 7) % 7

  // On Friday itself the deadline is tonight, unless midnight has passed.
  if (day === 5) daysUntilFriday = 0
  // Saturday/Sunday: the current window is closed, next close is Friday.
  if (day === 6) daysUntilFriday = 6
  if (day === 0) daysUntilFriday = 5

  const deadlineNy = new Date(ny)
  deadlineNy.setUTCDate(ny.getUTCDate() + daysUntilFriday)
  deadlineNy.setUTCHours(23, 59, 59, 999)

  // Back out of NY wall-clock space into real UTC.
  return new Date(deadlineNy.getTime() - offset * 3600_000)
}

/** True Sat/Sun in New York — the offer is between windows. */
export function isBetweenWindows(now: Date = new Date()): boolean {
  const offset = nyOffsetHours(now)
  const ny = new Date(now.getTime() + offset * 3600_000)
  const day = ny.getUTCDay()
  return day === 6 || day === 0
}

/** What the $497 includes. Kept here so the page and the CRM notes agree. */
export const INCLUDED = [
  'A complete website, designed and built for you — not a template you fill in',
  'Built on web0n, our own AI website platform, which is why we can do it at this price',
  'Your content, your brand, your services — written and laid out for your business',
  'Mobile-first and fast on a phone, which is where most of your visitors are',
  'Contact form wired to reach you by email the moment someone fills it in',
  'Google-ready: page titles, descriptions and structured data set up correctly',
  'You can edit and revise it yourself afterwards — no change-request fees, no waiting on us',
]

export const NOT_INCLUDED = [
  'E-commerce, memberships, booking systems and custom applications — those are separate projects',
  'Ongoing marketing, ads or content writing beyond your initial pages',
  'Migration of a large existing site with hundreds of pages',
]

export const STEPS = [
  {
    n: 1,
    t: 'You tell us about the business',
    d: 'A short form — what you do, who you serve, and what you want the site to accomplish. Takes a couple of minutes.',
  },
  {
    n: 2,
    t: 'We check it is a fit, then confirm',
    d: 'We look at what you need and confirm the $497 covers it before anyone pays anything. If it does not, we will tell you what it would actually take.',
  },
  {
    n: 3,
    t: 'We build it',
    d: 'We design and build the site on web0n using your content and brand. You review it and tell us what to change.',
  },
  {
    n: 4,
    t: 'It goes live, and you can edit it',
    d: 'Once you are happy it goes live on your domain. From there you can edit and revise it yourself whenever you want.',
  },
]
