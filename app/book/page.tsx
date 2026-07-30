import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Check, Phone } from 'lucide-react'

import BookingCalendar from '@/components/calendar/booking-calendar'
import { BUSINESS_NAME, PHONE, PHONE_DISPLAY } from '@/lib/local/nap'

const SITE = 'https://rocketopp.com'
const TITLE = 'Book a 15-Minute Call'
const DESCRIPTION =
  'Book a free 15-minute call with RocketOpp — website design, AI search visibility and automation for Greensburg and Westmoreland County businesses. No pitch deck.'

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: `${SITE}/book` },
  openGraph: { title: TITLE, description: DESCRIPTION, url: `${SITE}/book` },
}

/**
 * The public home of the booking calendar.
 *
 * Indexable, unlike /497-website/start — "book a call with a web designer near me"
 * is a real query, and a page that answers it with a working calendar is exactly
 * the kind of page an AI engine can recommend.
 *
 * ReserveAction JSON-LD tells a crawler that this page IS the booking mechanism,
 * rather than leaving it to infer that from an embedded widget it cannot execute.
 */
const JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  '@id': `${SITE}/book#page`,
  name: TITLE,
  description: DESCRIPTION,
  url: `${SITE}/book`,
  potentialAction: {
    '@type': 'ReserveAction',
    name: 'Book a 15-minute call',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: `${SITE}/book`,
      actionPlatform: [
        'http://schema.org/DesktopWebPlatform',
        'http://schema.org/MobileWebPlatform',
      ],
    },
    result: {
      '@type': 'Reservation',
      name: '15-minute consultation with RocketOpp',
    },
    provider: {
      '@type': 'ProfessionalService',
      name: BUSINESS_NAME,
      telephone: PHONE,
      url: SITE,
    },
  },
}

const EXPECT = [
  'What you have now, and what is actually holding it back.',
  'Whether AI search can see your site at all — we check live on the call.',
  'What it would cost, said out loud, before you decide anything.',
  'If we are not the right fit, we say so and point you somewhere better.',
]

export default function BookPage() {
  return (
    <main className="min-h-screen bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
      />

      <div className="container mx-auto max-w-5xl px-4 py-14 md:py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
            Book a 15-minute call
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
            A straight conversation about your website and whether AI search can find it. No slides,
            no pressure, no follow-up sequence you have to unsubscribe from.
          </p>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-[1fr_320px]">
          <div className="reveal">
            <BookingCalendar
              calendar="discovery"
              purpose="Discovery call"
              heading="Pick a time that suits you"
              blurb="Fifteen minutes. We look at what you have now, what you need, and whether we are the right fit."
            />
          </div>

          <aside className="space-y-6">
            <div className="rounded-2xl border border-border bg-card p-6">
              <h2 className="font-bold tracking-tight">What we&rsquo;ll cover</h2>
              <ul className="mt-4 space-y-3">
                {EXPECT.map((e) => (
                  <li key={e} className="flex gap-2.5 text-sm leading-relaxed text-muted-foreground">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
                    <span>{e}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-border bg-card p-6">
              <h2 className="font-bold tracking-tight">Rather just call?</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Weekdays, business hours Eastern. If it rings out, leave a message — we call back
                the same day.
              </p>
              <a
                href={`tel:${PHONE}`}
                className="mt-4 inline-flex items-center gap-2 rounded-lg border border-border px-5 py-3 font-semibold transition-colors hover:border-primary/40"
              >
                <Phone className="h-4 w-4 text-primary" />
                {PHONE_DISPLAY}
              </a>
            </div>

            <div className="rounded-2xl border border-primary/30 bg-primary/5 p-6">
              <h2 className="font-bold tracking-tight">Already decided?</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                The $497 website offer runs weekly. You can start it without a call.
              </p>
              <Link
                href="/497-website"
                className="mt-4 inline-flex items-center gap-2 font-semibold text-primary hover:underline"
              >
                See the offer
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </main>
  )
}
