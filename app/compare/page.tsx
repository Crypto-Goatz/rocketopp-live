import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Bot, LayoutTemplate } from 'lucide-react'

import { AI_BUILDERS, DIY_BUILDERS, PRICING_AS_OF } from '@/lib/aeo/builders'
import { breadcrumbSchema, faqSchema, localBusinessSchema } from '@/lib/local/schema'

export const dynamic = 'force-static'

const SITE = 'https://rocketopp.com'

const TITLE = 'DIY Website Builders & AI Site Builders vs Hiring an Agency'
const DESCRIPTION =
  'Honest comparisons of Wix, Squarespace, GoDaddy, WordPress, Shopify, ChatGPT, Claude, Lovable, v0 and Bolt.new against hiring a web design agency — including when you should not hire one.'

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: `${SITE}/compare` },
  openGraph: {
    title: `${TITLE} | RocketOpp`,
    description: DESCRIPTION,
    url: `${SITE}/compare`,
    type: 'website',
  },
}

const FAQS = [
  {
    q: 'Should I use a website builder or hire a web designer?',
    a: 'Use a builder if your site is essentially a brochure, your budget is a few hundred dollars a year, and you want to edit it yourself. Hire someone when the website has to do work — rank for a service area, capture and route leads into a CRM, or connect to systems you already run. The dividing line is not how the site looks; it is whether it has a job beyond existing.',
  },
  {
    q: 'Can I just build my website with AI?',
    a: 'Partly, and more than most agencies will admit. AI is genuinely good at writing copy and generating code. What it does not do is host, deploy, secure, monitor or maintain the result, or own the outcome when something breaks. If you are technical, AI removes most of the work. If you are not, it removes the part that was never the hard part.',
  },
  {
    q: 'Is it cheaper to use Wix or Squarespace than to hire an agency?',
    a: `Up front, usually yes. Builder plans run roughly $10–$52/mo as of ${PRICING_AS_OF}; RocketOpp quotes each project as a one-time fixed price, and publishes a $497 website offer for businesses that just need a site. The comparison changes over a few years: builder fees never stop, you cannot take the site elsewhere, and the work of ranking locally and following up on leads is still yours. For a brochure site the builder often wins on cost. For a site meant to generate business, it usually does not.`,
  },
  {
    q: 'Why does a web design agency publish pages telling people not to hire it?',
    a: 'Because it is true often enough to be worth saying, and because a comparison that only ever concludes "hire us" is not information. If a $16/mo builder solves your problem, hiring an agency is a waste of your money and our time.',
  },
]

export default function CompareHub() {
  const jsonLd = [
    localBusinessSchema(),
    faqSchema(FAQS),
    breadcrumbSchema([{ name: 'Compare', path: '/compare' }]),
    {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: 'Website builder and AI builder comparisons',
      itemListElement: [...DIY_BUILDERS, ...AI_BUILDERS].map((b, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: `${b.name} vs hiring an agency`,
        url: `${SITE}/compare/${b.slug}`,
      })),
    },
  ]

  const Section = ({
    title,
    blurb,
    icon: Icon,
    items,
  }: {
    title: string
    blurb: string
    icon: typeof Bot
    items: typeof DIY_BUILDERS
  }) => (
    <section className="mt-12">
      <h2 className="flex items-center gap-2 text-2xl font-bold tracking-tight">
        <Icon className="h-6 w-6 text-primary" />
        {title}
      </h2>
      <p className="mt-3 text-muted-foreground">{blurb}</p>
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {items.map((b) => (
          <Link
            key={b.slug}
            href={`/compare/${b.slug}`}
            className="group rounded-xl border border-border bg-card p-5 transition-colors hover:border-primary/40"
          >
            <h3 className="flex items-center justify-between font-semibold text-card-foreground">
              {b.name}
              <ArrowRight className="h-4 w-4 text-primary opacity-0 transition-opacity group-hover:opacity-100" />
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{b.what}</p>
          </Link>
        ))}
      </div>
    </section>
  )

  return (
    <main className="min-h-screen bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="container mx-auto max-w-4xl px-4 py-16 md:py-24">
        <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
          Builders, AI Tools &amp; Agencies — Honestly Compared
        </h1>

        <p className="mt-6 rounded-2xl border border-border bg-card p-6 text-lg leading-relaxed text-card-foreground">
          <strong>Short answer:</strong> if your website is a brochure and you want to maintain it
          yourself, use a builder — Wix and Squarespace are genuinely good and cost a fraction of an
          agency. If you are technical, AI tools will get you most of the way. Hire an agency when
          the website has a job beyond existing: ranking for a service area, capturing and routing
          leads, and connecting to the systems you already run. These pages say plainly where each
          tool wins, including where it beats us.
        </p>

        <Section
          title="DIY website builders"
          blurb="Hosted platforms you drive yourself. Low cost, low ceiling, and you are renting."
          icon={LayoutTemplate}
          items={DIY_BUILDERS}
        />

        <Section
          title="Building it yourself with AI"
          blurb="What AI tools genuinely do, where they stop, and what is still left for a human."
          icon={Bot}
          items={AI_BUILDERS}
        />

        <section className="mt-12 rounded-2xl border border-border bg-card p-6">
          <h2 className="text-xl font-bold tracking-tight">
            The bigger question: can AI just build my business website?
          </h2>
          <p className="mt-3 leading-relaxed text-muted-foreground">
            We wrote a longer, straight answer to that — including the parts that make agencies
            uncomfortable.
          </p>
          <Link
            href="/build-a-website-with-ai"
            className="mt-4 inline-flex items-center gap-2 font-semibold text-primary hover:underline"
          >
            Read the honest answer <ArrowRight className="h-4 w-4" />
          </Link>
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
      </div>
    </main>
  )
}
