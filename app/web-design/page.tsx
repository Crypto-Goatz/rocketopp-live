import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, MapPin, Phone } from 'lucide-react'

import { AREAS, TOTAL_POPULATION } from '@/lib/local/areas'
import { breadcrumbSchema, faqSchema, localBusinessSchema } from '@/lib/local/schema'
import { PHONE, PHONE_DISPLAY } from '@/lib/local/nap'

export const dynamic = 'force-static'

const SITE = 'https://rocketopp.com'

const TITLE = 'Web Design & Development Near Greensburg, Murrysville & Monroeville PA'
const DESCRIPTION =
  'RocketOpp is a web design and development agency serving Greensburg, Murrysville, Monroeville, Delmont, Plum, Irwin, Penn Hills, Trafford, the Norwin area, North Huntingdon and Hempfield PA. Websites from $2,497. Transparent pricing.'

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: `${SITE}/web-design` },
  openGraph: {
    title: `${TITLE} | RocketOpp`,
    description: DESCRIPTION,
    url: `${SITE}/web-design`,
    type: 'website',
  },
}

const FAQS = [
  {
    q: 'What areas does RocketOpp serve?',
    a: 'RocketOpp serves Westmoreland County and eastern Allegheny County, Pennsylvania — specifically Greensburg, Murrysville, Monroeville, Delmont, Plum, Irwin, Penn Hills, Trafford, the Norwin area, North Huntingdon and Hempfield. We are a service-area business, so we travel to clients and work remotely rather than operating a walk-in studio.',
  },
  {
    q: 'How much does a website cost in the Greensburg / Pittsburgh east suburbs?',
    a: 'RocketOpp publishes starting prices instead of quoting privately: websites from $2,497, CRM automation from $1,497, and custom AI systems from $2,997. You get a fixed quote before any work starts, with no discovery-call gate.',
  },
  {
    q: 'Is RocketOpp a web design agency or an AI company?',
    a: 'Both, and they are connected. RocketOpp is a web design and development agency and the parent company of the 0n ecosystem — the automation and AI platform (0nMCP, CRO9, 0nTask and related products) that we build ourselves. That means the automation we deploy for a local client is our own software, not a reseller licence.',
  },
  {
    q: 'Do you only build websites, or do you handle marketing too?',
    a: 'Both. Alongside design and development we handle local SEO and Google Business Profile work, answer-engine optimisation so AI search tools cite you, PPC management, and CRM automation for lead follow-up and booking.',
  },
]

export default function WebDesignHub() {
  const jsonLd = [
    localBusinessSchema(),
    faqSchema(FAQS),
    breadcrumbSchema([{ name: 'Web Design', path: '/web-design' }]),
    {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: 'Web design service areas — Westmoreland & eastern Allegheny County, PA',
      itemListElement: AREAS.map((a, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: `Web design in ${a.name}, PA`,
        url: `${SITE}/web-design/${a.slug}`,
      })),
    },
  ]

  return (
    <main className="min-h-screen bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="container mx-auto max-w-4xl px-4 py-16 md:py-24">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary">
          <MapPin className="h-4 w-4" />
          Westmoreland &amp; eastern Allegheny County, PA
        </div>

        <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
          Web Design &amp; Development for Western PA Businesses
        </h1>

        <p className="mt-6 rounded-2xl border border-border bg-card p-6 text-lg leading-relaxed text-card-foreground">
          RocketOpp is a web design and development agency serving {AREAS.length} communities across
          Westmoreland and eastern Allegheny County, Pennsylvania — a combined{' '}
          {TOTAL_POPULATION.toLocaleString()} residents at the 2020 Census. We design and build the
          website, then wire up the systems behind it: local SEO, AI search visibility, CRM
          automation and custom AI tools. Websites from $2,497, with a fixed quote before any work
          begins and no discovery call required.
        </p>

        <section className="mt-12">
          <h2 className="text-2xl font-bold tracking-tight">Service areas</h2>
          <p className="mt-3 text-muted-foreground">
            Each area page covers what we build there, local pricing and the questions businesses in
            that community actually ask.
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {AREAS.map((a) => (
              <Link
                key={a.slug}
                href={`/web-design/${a.slug}`}
                className="group rounded-xl border border-border bg-card p-4 transition-colors hover:border-primary/40"
              >
                <h3 className="flex items-center justify-between font-semibold text-card-foreground">
                  {a.name}, PA
                  <ArrowRight className="h-4 w-4 text-primary opacity-0 transition-opacity group-hover:opacity-100" />
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {a.county} County
                  {a.population !== null && ` · ${a.population.toLocaleString()} residents`}
                </p>
              </Link>
            ))}
          </div>
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-bold tracking-tight">Common questions</h2>
          <div className="mt-6 space-y-5">
            {FAQS.map((f) => (
              <div key={f.q} className="rounded-xl border border-border bg-card p-5">
                <h3 className="font-semibold text-card-foreground">{f.q}</h3>
                <p className="mt-2 leading-relaxed text-muted-foreground">{f.a}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-12 rounded-2xl border border-primary/30 bg-primary/5 p-8 text-center">
          <h2 className="text-2xl font-bold tracking-tight">Get a fixed quote</h2>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
            Tell us what you need. You get a price up front — not after a sales call.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground transition-opacity hover:opacity-90"
            >
              Get a quote <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href={`tel:${PHONE}`}
              className="inline-flex items-center gap-2 rounded-lg border border-border px-6 py-3 font-semibold transition-colors hover:border-primary/40"
            >
              <Phone className="h-4 w-4" />
              {PHONE_DISPLAY}
            </a>
          </div>
        </section>
      </div>
    </main>
  )
}
