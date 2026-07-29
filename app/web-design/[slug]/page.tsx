import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowRight, Check, MapPin, Phone, Route } from 'lucide-react'

import { AREAS, getArea, type Area } from '@/lib/local/areas'
import {
  breadcrumbSchema,
  faqSchema,
  localBusinessSchema,
  serviceSchema,
} from '@/lib/local/schema'
import { PHONE, PHONE_DISPLAY } from '@/lib/local/nap'

export const dynamic = 'force-static'

export function generateStaticParams() {
  return AREAS.map((a) => ({ slug: a.slug }))
}

const SITE = 'https://rocketopp.com'

/** Population phrasing that stays honest for Norwin (not a census municipality). */
function populationLine(a: Area) {
  if (a.population === null) return a.businessLandscape
  return `${a.formalName} had ${a.population.toLocaleString()} residents at the 2020 Census. ${a.businessLandscape}`
}

function bluf(a: Area) {
  const where =
    a.population === null
      ? `the ${a.name} area of ${a.county} County, Pennsylvania`
      : `${a.name}, ${a.county} County, Pennsylvania`
  return `RocketOpp designs and builds websites for businesses in ${where}. We are a service-area agency working across Westmoreland and eastern Allegheny County — websites from $2,497, CRM automation from $1,497, and custom AI systems from $2,997, all quoted up front with no discovery-call gate.`
}

function faqsFor(a: Area) {
  const place = a.population === null ? `the ${a.name} area` : a.name
  return [
    {
      q: `Do you work with businesses in ${a.name}, PA?`,
      a: `Yes. ${a.name} is inside RocketOpp's core service area. We are a service-area business rather than a walk-in studio, so we work with ${place} clients remotely and on-site as the project needs — most website projects are run entirely over email, shared docs and scheduled calls.`,
    },
    {
      q: `How much does a website cost in ${a.name}, PA?`,
      a: `RocketOpp publishes starting prices rather than quoting privately: websites start at $2,497, CRM automation at $1,497, and custom AI systems at $2,997. The final number depends on page count, whether you need e-commerce or booking, and how much of your operation you want automated. You get a fixed quote before any work begins.`,
    },
    {
      q: `What is the difference between a web designer and a web developer?`,
      a: `A web designer decides how the site looks and how visitors move through it. A web developer builds the code that makes it run — forms, integrations, performance, security. RocketOpp does both in-house, plus the automation layer that connects the site to your CRM, calendar and billing, so there is no hand-off between vendors.`,
    },
    {
      q: `Why hire a local web designer near ${a.name} instead of a national platform?`,
      a: `A DIY platform can produce a page. What it cannot do is understand that ${a.localNote.charAt(0).toLowerCase()}${a.localNote.slice(1)} Local search results, service-area targeting and the way your customers actually describe what they want are all shaped by details like that. A local agency also gives you one accountable phone number — ${PHONE_DISPLAY}.`,
    },
    {
      q: `Do you do more than build the website?`,
      a: `Yes — the website is usually the front door. RocketOpp also builds the systems behind it: CRM automation, automated follow-up, booking and intake flows, and custom AI tools. RocketOpp is the parent company of the 0n ecosystem, so the automation platform we deploy for ${place} clients is software we build ourselves rather than licence from someone else.`,
    },
  ]
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const a = getArea(slug)
  if (!a) return {}

  // NOTE: the root layout applies the template "%s | RocketOpp" — do not
  // append the brand here or it will be duplicated.
  const title = `Web Design & Development in ${a.name}, PA`
  const description = `Website design and development for businesses in ${a.name}, ${a.county} County PA. Websites from $2,497, CRM automation from $1,497, AI systems from $2,997. Transparent pricing, no discovery calls.`

  return {
    title,
    description,
    alternates: { canonical: `${SITE}/web-design/${a.slug}` },
    openGraph: {
      title: `${title} | RocketOpp`,
      description,
      url: `${SITE}/web-design/${a.slug}`,
      type: 'website',
    },
  }
}

export default async function AreaPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const a = getArea(slug)
  if (!a) notFound()

  const faqs = faqsFor(a)
  const nearby = a.nearby.map(getArea).filter(Boolean) as Area[]

  const jsonLd = [
    localBusinessSchema(a),
    serviceSchema(a),
    faqSchema(faqs),
    breadcrumbSchema([
      { name: 'Web Design', path: '/web-design' },
      { name: `${a.name}, PA`, path: `/web-design/${a.slug}` },
    ]),
  ]

  return (
    <main className="min-h-screen bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="container mx-auto max-w-4xl px-4 py-16 md:py-24">
        <nav className="mb-6 text-sm text-muted-foreground">
          <Link href="/web-design" className="hover:text-primary">
            Web Design
          </Link>
          <span className="mx-2">/</span>
          <span className="text-foreground">{a.name}, PA</span>
        </nav>

        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary">
          <MapPin className="h-4 w-4" />
          {a.county} County, Pennsylvania
        </div>

        <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
          Web Design &amp; Development in {a.name}, PA
        </h1>

        {/* BLUF — the block answer engines lift verbatim */}
        <p className="mt-6 rounded-2xl border border-border bg-card p-6 text-lg leading-relaxed text-card-foreground">
          {bluf(a)}
        </p>

        {/* Local context — the genuinely unique part of every page */}
        <section className="mt-12">
          <h2 className="text-2xl font-bold tracking-tight">
            Doing business in {a.name}
          </h2>
          <p className="mt-4 leading-relaxed text-muted-foreground">{populationLine(a)}</p>
          <p className="mt-4 leading-relaxed text-muted-foreground">{a.localNote}</p>

          <div className="mt-6 flex flex-wrap gap-2">
            {a.corridors.map((c) => (
              <span
                key={c}
                className="inline-flex items-center gap-1.5 rounded-full border border-border bg-muted/40 px-3 py-1 text-xs text-muted-foreground"
              >
                <Route className="h-3.5 w-3.5" />
                {c}
              </span>
            ))}
            {a.zips.map((z) => (
              <span
                key={z}
                className="inline-flex items-center rounded-full border border-border bg-muted/40 px-3 py-1 text-xs text-muted-foreground"
              >
                ZIP {z}
              </span>
            ))}
          </div>
        </section>

        {/* What we build */}
        <section className="mt-12">
          <h2 className="text-2xl font-bold tracking-tight">
            What we build for {a.name} businesses
          </h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {[
              {
                title: 'Websites — from $2,497',
                body: 'Custom design and build. Fast, mobile-first, and structured so Google and AI search engines can both read it.',
                href: '/services/website-development',
              },
              {
                title: 'Local SEO & AI search — from $1,497',
                body: 'Google Business Profile, local schema, service-area pages, and the answer-engine work that gets you cited by ChatGPT, Claude, Gemini and Perplexity.',
                href: '/services/search-optimization',
              },
              {
                title: 'CRM automation — from $1,497',
                body: 'Lead capture, automated follow-up, booking and intake wired into your CRM so enquiries stop falling through.',
                href: '/services/crm-automation',
              },
              {
                title: 'Custom AI systems — from $2,997',
                body: 'Internal tools, AI assistants and automation built on the 0n platform we develop in-house.',
                href: '/services/ai-automation',
              },
            ].map((s) => (
              <Link
                key={s.title}
                href={s.href}
                className="group rounded-xl border border-border bg-card p-5 transition-colors hover:border-primary/40"
              >
                <h3 className="flex items-center gap-2 font-semibold text-card-foreground">
                  <Check className="h-4 w-4 text-primary" />
                  {s.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
                <span className="mt-3 inline-flex items-center gap-1 text-sm text-primary opacity-0 transition-opacity group-hover:opacity-100">
                  Learn more <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="mt-12">
          <h2 className="text-2xl font-bold tracking-tight">
            Web design in {a.name} — common questions
          </h2>
          <div className="mt-6 space-y-5">
            {faqs.map((f) => (
              <div key={f.q} className="rounded-xl border border-border bg-card p-5">
                <h3 className="font-semibold text-card-foreground">{f.q}</h3>
                <p className="mt-2 leading-relaxed text-muted-foreground">{f.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Nearby */}
        {nearby.length > 0 && (
          <section className="mt-12">
            <h2 className="text-2xl font-bold tracking-tight">Nearby areas we serve</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {nearby.map((n) => (
                <Link
                  key={n.slug}
                  href={`/web-design/${n.slug}`}
                  className="rounded-full border border-border px-4 py-1.5 text-sm text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
                >
                  Web design in {n.name}, PA
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* CTA */}
        <section className="mt-12 rounded-2xl border border-primary/30 bg-primary/5 p-8 text-center">
          <h2 className="text-2xl font-bold tracking-tight">
            Start a project in {a.name}
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
            Tell us what you need and you get a fixed quote — no discovery call required.
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
