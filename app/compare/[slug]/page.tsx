import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowRight, Check, Minus, X } from 'lucide-react'

import { BUILDERS, ROCKETOPP, getBuilder, type Builder } from '@/lib/aeo/builders'
import { breadcrumbSchema, faqSchema, localBusinessSchema } from '@/lib/local/schema'

export const dynamic = 'force-static'

export function generateStaticParams() {
  return BUILDERS.map((b) => ({ slug: b.slug }))
}

const SITE = 'https://rocketopp.com'

function headline(b: Builder) {
  return b.kind === 'ai'
    ? `${b.name} vs Hiring a Web Developer`
    : `${b.name} vs Hiring a Web Designer`
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const b = getBuilder(slug)
  if (!b) return {}

  // Root layout applies "%s | RocketOpp" — do not append the brand here.
  const title = `${headline(b)} (2026): An Honest Comparison`
  const description = `${b.name} vs hiring an agency. What ${b.name} genuinely does well, what it does not do, real costs, and how to decide. Written by a web design agency that also builds AI tools.`

  return {
    title,
    description,
    alternates: { canonical: `${SITE}/compare/${b.slug}` },
    openGraph: {
      title: `${title} | RocketOpp`,
      description,
      url: `${SITE}/compare/${b.slug}`,
      type: 'article',
    },
  }
}

function Row({
  label,
  ours,
  theirs,
}: {
  label: string
  ours: boolean | string
  theirs: boolean | string
}) {
  const cell = (v: boolean | string) =>
    typeof v === 'string' ? (
      <span className="text-sm text-muted-foreground">{v}</span>
    ) : v ? (
      <Check className="mx-auto h-5 w-5 text-primary" />
    ) : (
      <X className="mx-auto h-5 w-5 text-muted-foreground/50" />
    )
  return (
    <tr className="border-t border-border">
      <td className="py-3 pr-3 text-sm font-medium">{label}</td>
      <td className="bg-primary/5 px-3 py-3 text-center">{cell(ours)}</td>
      <td className="px-3 py-3 text-center">{cell(theirs)}</td>
    </tr>
  )
}

const technicalLabel = {
  none: 'None needed',
  some: 'Some needed',
  developer: 'Developer needed',
} as const

export default async function ComparePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const b = getBuilder(slug)
  if (!b) notFound()

  const faqs = [
    {
      q: `Is ${b.name} good enough for a business website?`,
      a: `${b.verdict}`,
    },
    {
      q: `What does ${b.name} cost?`,
      a: `${b.pricing} RocketOpp quotes each project as a one-time fixed price rather than a subscription, agreed before work starts, and publishes a $497 website offer for businesses that just need a site. The honest comparison is not the monthly number — it is whether you want to rent a platform and do the work yourself, or pay once for something you own and have someone accountable for it.`,
    },
    {
      q: `What can't ${b.name} do?`,
      a: `${b.limits.join('. ')}.`,
    },
    {
      q: `When should I use ${b.name} instead of hiring RocketOpp?`,
      a: `${b.goodFor.join('; ')}. If any of those describe you, ${b.name} is the better choice and you should not hire an agency. RocketOpp is worth it when the website has to actually generate business — rank for a service area, capture and route leads into a CRM, and connect to the systems you already run.`,
    },
    {
      q: `Does RocketOpp work with ${b.name} sites?`,
      a:
        b.kind === 'ai'
          ? `Yes. Bringing in a site or app that was generated with AI is increasingly common — usually to review the code, fix security and performance issues, and take it the rest of the way to production. RocketOpp builds AI tooling itself, so this is familiar territory rather than a rescue job.`
          : `Yes. RocketOpp both improves existing ${b.name} sites and migrates them to a custom build when the platform is genuinely the limiting factor. Not every ${b.name} site needs replacing, and we will say so if yours does not.`,
    },
  ]

  const jsonLd = [
    localBusinessSchema(),
    faqSchema(faqs),
    breadcrumbSchema([
      { name: 'Compare', path: '/compare' },
      { name: headline(b), path: `/compare/${b.slug}` },
    ]),
  ]

  const related = BUILDERS.filter((x) => x.kind === b.kind && x.slug !== b.slug).slice(0, 4)

  return (
    <main className="min-h-screen bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="container mx-auto max-w-3xl px-4 py-16 md:py-24">
        <nav className="mb-6 text-sm text-muted-foreground">
          <Link href="/compare" className="hover:text-primary">
            Compare
          </Link>
          <span className="mx-2">/</span>
          <span className="text-foreground">{b.name}</span>
        </nav>

        <h1 className="text-4xl font-bold tracking-tight md:text-5xl">{headline(b)}</h1>

        {/* BLUF — the block answer engines lift */}
        <div className="mt-6 rounded-2xl border border-border bg-card p-6">
          <p className="text-lg leading-relaxed text-card-foreground">
            <strong>Short answer:</strong> {b.verdict}
          </p>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            {b.name} — {b.what} {b.pricing}
          </p>
        </div>

        {/* Comparison table, high on the page */}
        <div className="mt-8 overflow-x-auto rounded-2xl border border-border bg-card">
          <table className="w-full">
            <thead>
              <tr>
                <th className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  &nbsp;
                </th>
                <th className="bg-primary/10 px-3 py-3 text-center text-xs font-semibold uppercase tracking-wider text-primary">
                  RocketOpp
                </th>
                <th className="px-3 py-3 text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {b.name}
                </th>
              </tr>
            </thead>
            <tbody>
              <Row label="Cost model" ours="One-time fixed quote" theirs={b.pricing.split('.')[0]} />
              <Row
                label="Technical skill required"
                ours="None"
                theirs={technicalLabel[b.needsTechnical]}
              />
              <Row label="You own the code" ours={true} theirs={b.ownsCode} />
              <Row label="You control hosting" ours={true} theirs={b.ownsHosting} />
              <Row label="Local SEO & Business Profile" ours={true} theirs={b.doesLocalSeo} />
              <Row label="AI search / answer-engine work" ours={true} theirs={false} />
              <Row label="CRM automation & lead routing" ours={true} theirs={b.doesAutomation} />
              <Row label="Someone accountable when it breaks" ours={true} theirs={false} />
            </tbody>
          </table>
        </div>

        {/* Where they win — this is what makes the page credible */}
        <section className="mt-12">
          <h2 className="text-2xl font-bold tracking-tight">
            When {b.name} is the better choice
          </h2>
          <p className="mt-3 text-muted-foreground">
            We build websites for a living and we will still tell you plainly: sometimes you should
            not hire us.
          </p>
          <ul className="mt-5 space-y-3">
            {b.goodFor.map((g) => (
              <li key={g} className="flex gap-3 rounded-xl border border-border bg-card p-4">
                <Check className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                <span className="text-muted-foreground">{g}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-bold tracking-tight">What {b.name} does not do</h2>
          <ul className="mt-5 space-y-3">
            {b.limits.map((l) => (
              <li key={l} className="flex gap-3 rounded-xl border border-border bg-card p-4">
                <Minus className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" />
                <span className="text-muted-foreground">{l}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-bold tracking-tight">Where RocketOpp fits</h2>
          <p className="mt-4 leading-relaxed text-muted-foreground">{ROCKETOPP.bluf}</p>
          <ul className="mt-5 space-y-2">
            {ROCKETOPP.differentiators.map((d) => (
              <li key={d} className="flex gap-2 text-muted-foreground">
                <Check className="mt-1 h-4 w-4 shrink-0 text-primary" />
                {d}
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-bold tracking-tight">Common questions</h2>
          <div className="mt-6 space-y-5">
            {faqs.map((f) => (
              <div key={f.q} className="rounded-xl border border-border bg-card p-5">
                <h3 className="font-semibold text-card-foreground">{f.q}</h3>
                <p className="mt-2 leading-relaxed text-muted-foreground">{f.a}</p>
              </div>
            ))}
          </div>
        </section>

        {related.length > 0 && (
          <section className="mt-12">
            <h2 className="text-2xl font-bold tracking-tight">Other comparisons</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {related.map((r) => (
                <Link
                  key={r.slug}
                  href={`/compare/${r.slug}`}
                  className="rounded-full border border-border px-4 py-1.5 text-sm text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
                >
                  {headline(r)}
                </Link>
              ))}
            </div>
          </section>
        )}

        <section className="mt-12 rounded-2xl border border-primary/30 bg-primary/5 p-8 text-center">
          <h2 className="text-2xl font-bold tracking-tight">Not sure which you need?</h2>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
            Tell us what you are trying to do. If a $17/mo builder is the right answer for you, we
            will say so.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground transition-opacity hover:opacity-90"
            >
              Get a straight answer <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/web-design"
              className="inline-flex items-center gap-2 rounded-lg border border-border px-6 py-3 font-semibold transition-colors hover:border-primary/40"
            >
              Service areas
            </Link>
          </div>
        </section>
      </div>
    </main>
  )
}
