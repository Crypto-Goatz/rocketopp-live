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

/**
 * PRICING — single source of truth. Every page, checkout line item and email
 * reads from here so no surface can quote a number the others contradict.
 *
 * BASE — the $497 offer (site built on the CRM/GHL SaaS platform)
 *   $250 at signup  +  $247 at launch  =  $497 build
 *   then $50/month once the site is live
 *
 * Why $247 and not $250 at launch: Mike specified a "$250 one-time fee" up front
 * AND that the public headline stays $497. $250 + $250 is $500, which would make
 * the advertised "$497 total, nothing hidden" false. Taking the $3 off the LAUNCH
 * payment satisfies both — the up-front is exactly $250, the total exactly $497.
 * To move to a $500 build, change launchCents to 25000 and the headline constants
 * above must change with it.
 *
 * WORDPRESS — a SECONDARY product, added ON TOP of the $497 (never instead of it)
 *   +$125 at signup  +  $125 at launch  =  +$250  →  $747 build total
 *   monthly RISES TO $80 (hosting + AI management). It does NOT stack on the $50:
 *   $80 is the whole monthly, CRM SaaS platform access included.
 *
 * The monthlies are billed through the CRM's SaaS billing, NOT Stripe. Stripe here
 * only ever collects the one-time build payments — do not add a Stripe
 * subscription for these or clients get billed twice.
 */
export const PRICING = {
  base: {
    signupCents: 25000,      // $250 — collected now
    launchCents: 24700,      // $247 — collected when the site goes live
    monthlyCents: 5000,      // $50/mo — starts at launch, billed via CRM SaaS
  },
  wordpress: {
    signupCents: 12500,      // +$125 at signup
    launchCents: 12500,      // +$125 at launch
    monthlyCents: 8000,      // $80/mo TOTAL — replaces the $50, not added to it
  },
} as const

const usd = (cents: number) =>
  cents % 100 === 0 ? `$${cents / 100}` : `$${(cents / 100).toFixed(2)}`

/** Totals for a given selection, so no page has to do the arithmetic itself. */
export function quote(withWordPress: boolean) {
  const b = PRICING.base
  const w = PRICING.wordpress
  const signup = b.signupCents + (withWordPress ? w.signupCents : 0)
  const launch = b.launchCents + (withWordPress ? w.launchCents : 0)
  // Monthly is a REPLACEMENT for the WordPress tier, not an addition.
  const monthly = withWordPress ? w.monthlyCents : b.monthlyCents
  return {
    signupCents: signup,
    launchCents: launch,
    monthlyCents: monthly,
    buildTotalCents: signup + launch,
    signup: usd(signup),
    launch: usd(launch),
    monthly: usd(monthly),
    buildTotal: usd(signup + launch),
  }
}

export const BASE_QUOTE = quote(false)
export const WP_QUOTE = quote(true)

/**
 * The WordPress upsell, in Mike's framing. Presented as a secondary product on
 * top of the $497 — never as an alternative tier, because it is not one.
 */
export const WORDPRESS_OFFER = {
  hook: 'Love WordPress?',
  pitch:
    'We can build your site directly in WordPress for an additional $250 — $125 up front and $125 at launch. The monthly goes up to $80 for hosting and AI management.',
  addOnBuild: '+$250',
  includes: [
    'Your site built directly in WordPress — you own the install',
    'Managed hosting, updates and backups',
    'The web0n WordPress plugin (beta) so our AI can edit the site directly',
    'AI management included in the monthly',
    'CRM platform access included — it is not billed on top',
  ],
}

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
  'Change it yourself afterwards by asking in plain English — our patent-pending tech makes the edit, usually within the hour',
  'After launch, $50/month keeps it hosted, running and on the platform',
]

export const NOT_INCLUDED = [
  'The $50/month after launch is not optional — it covers hosting and the platform the site runs on',
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
