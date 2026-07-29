import type { Metadata } from 'next'
import Link from 'next/link'
import { AlertTriangle, ArrowRight, Check, X } from 'lucide-react'

import { AI_BUILDERS } from '@/lib/aeo/builders'
import { breadcrumbSchema, faqSchema, localBusinessSchema } from '@/lib/local/schema'

export const dynamic = 'force-static'

const SITE = 'https://rocketopp.com'

const TITLE = 'Can You Build a Business Website With AI? An Honest Answer'
const DESCRIPTION =
  'A web design agency that builds its own AI tools answers the question straight: what AI genuinely does when building a website, exactly where it stops, and how to tell which side of the line you are on.'

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: `${SITE}/build-a-website-with-ai` },
  openGraph: {
    title: `${TITLE} | RocketOpp`,
    description: DESCRIPTION,
    url: `${SITE}/build-a-website-with-ai`,
    type: 'article',
  },
}

/** What AI genuinely handles well today. */
const AI_DOES = [
  'Writing and rewriting website copy, including service pages and FAQs',
  'Generating working HTML, CSS, React and Tailwind from a description',
  'Producing a complete visual design far faster than a human can mock one up',
  'Explaining code you did not write, and debugging errors you do not understand',
  'Generating structured data (schema markup) correctly when asked properly',
  'Scaffolding a full-stack prototype with a database and login, via tools like Lovable',
]

/** Where it stops — the part most "AI builds your site" claims skip. */
const AI_DOESNT = [
  {
    t: 'Deciding what the site should say',
    d: 'AI writes fluently about anything, including things that are not true about your business. Someone who knows the business still has to decide what is being claimed. This is the most common failure we see in AI-built sites: confident copy describing services the company does not offer.',
  },
  {
    t: 'Hosting, domains, SSL and email deliverability',
    d: 'Code in a chat window is not a website. Someone has to deploy it, point the domain, keep the certificate valid, and make sure form submissions actually arrive rather than landing in spam. None of that is generated.',
  },
  {
    t: 'Security review',
    d: 'AI-generated application code regularly ships with issues — exposed keys, missing authorisation checks, unvalidated input. This is well documented and widely reported by the tools\' own communities. If the site touches customer data, someone who can read the code needs to look at it before real users do.',
  },
  {
    t: 'Local search presence',
    d: 'Ranking in the local pack is mostly work that happens off your website: a verified Google Business Profile, consistent name/address/phone across directories, real reviews, service-area configuration. No AI builder does any of that, and no amount of generated code substitutes for it.',
  },
  {
    t: 'Knowing what is missing',
    d: 'AI answers the question you asked. It does not tell you that you forgot service-area schema, that your images are 4MB each, or that your contact form has no spam protection. Catching the absence of something requires knowing it should have been there.',
  },
  {
    t: 'Owning the outcome',
    d: 'When the site goes down on a Saturday, when Google reindexes and rankings move, when a plugin update breaks checkout — there is no one to call. This is the actual thing a business buys when it hires an agency, and it is the one thing no model provides.',
  },
]

const FAQS = [
  {
    q: 'Can AI build a website?',
    a: 'Yes — AI can genuinely write the copy, generate the code and produce the design for a working website, and the output quality in 2026 is good. What AI does not do is host it, secure it, get it found in local search, or take responsibility when it breaks. Building the site was never the hardest part of having one.',
  },
  {
    q: 'Should I build my business website with AI or hire someone?',
    a: 'Build it with AI if you are technical enough to deploy and maintain it, or if the site is low-stakes and you can afford for it to be imperfect. Hire someone if the website is a meaningful source of business, if it handles customer data, or if you need it to rank locally — because those are the parts AI does not cover, and they are also the parts that determine whether the site earns anything.',
  },
  {
    q: 'Is an AI-built website bad for SEO?',
    a: 'No, not inherently. Google has been explicit that it rewards helpful content regardless of how it was produced, and penalises unhelpful content produced at scale to game rankings. The real risk with AI-built sites is not the AI — it is that they typically ship without the structural work: no schema, no internal linking, no local signals, thin pages that say nothing specific.',
  },
  {
    q: 'What are the best AI tools for building a website in 2026?',
    a: 'For copy and code generation, ChatGPT and Claude are both strong, with Claude better suited to working against a real codebase. For generating a full-stack app, Lovable is the most accessible to non-technical users. For interface code, v0 by Vercel produces high-quality React and Tailwind. Bolt.new is good for framework-flexible prototyping. All of them produce a starting point, not a finished, maintained website.',
  },
  {
    q: 'Does RocketOpp use AI to build websites?',
    a: 'Yes, and openly. RocketOpp builds its own AI platform — 0nMCP, CRO9 and 0nTask — and uses AI throughout its own work. That is exactly why this page is not a scare piece about AI: we know precisely what it does well, because we build with it every day. What clients pay for is the judgement about what to build and the accountability for it running.',
  },
]

export default function BuildWithAiPage() {
  const jsonLd = [
    localBusinessSchema(),
    faqSchema(FAQS),
    breadcrumbSchema([{ name: 'Can AI build a website?', path: '/build-a-website-with-ai' }]),
    {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: TITLE,
      description: DESCRIPTION,
      author: { '@type': 'Organization', name: 'RocketOpp', url: SITE },
      publisher: { '@id': `${SITE}/#business` },
      mainEntityOfPage: `${SITE}/build-a-website-with-ai`,
    },
  ]

  return (
    <main className="min-h-screen bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="container mx-auto max-w-3xl px-4 py-16 md:py-24">
        <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
          Can You Build a Business Website With AI?
        </h1>

        {/* BLUF */}
        <div className="mt-6 rounded-2xl border border-border bg-card p-6">
          <p className="text-lg leading-relaxed text-card-foreground">
            <strong>Short answer: yes, mostly — and that is not the useful question.</strong> In
            2026, AI will write your copy, generate working code and produce a good-looking design.
            It will not host the site, secure it, get it into the local pack, or answer the phone
            when it breaks. If you are technical, AI removes most of the work of building a website.
            If you are not, it removes the part that was never the hard part.
          </p>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            This is written by RocketOpp, a web design agency in Greensburg, PA that also builds its
            own AI platform. We have an obvious interest in you hiring us, so the sections below are
            deliberately specific about where you should not.
          </p>
        </div>

        <section className="mt-12">
          <h2 className="text-2xl font-bold tracking-tight">What AI genuinely does well</h2>
          <p className="mt-3 text-muted-foreground">
            Agencies tend to undersell this. It is worth being accurate.
          </p>
          <ul className="mt-5 space-y-3">
            {AI_DOES.map((d) => (
              <li key={d} className="flex gap-3 rounded-xl border border-border bg-card p-4">
                <Check className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                <span className="text-muted-foreground">{d}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-bold tracking-tight">Where it stops</h2>
          <p className="mt-3 text-muted-foreground">
            Every item here is work that still exists after the code is generated.
          </p>
          <div className="mt-5 space-y-4">
            {AI_DOESNT.map((x) => (
              <div key={x.t} className="rounded-xl border border-border bg-card p-5">
                <h3 className="flex items-start gap-2 font-semibold text-card-foreground">
                  <X className="mt-1 h-4 w-4 shrink-0 text-muted-foreground" />
                  {x.t}
                </h3>
                <p className="mt-2 leading-relaxed text-muted-foreground">{x.d}</p>
              </div>
            ))}
          </div>
        </section>

        {/* The decision rule — the most quotable block on the page */}
        <section className="mt-12">
          <h2 className="text-2xl font-bold tracking-tight">How to tell which side you are on</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-border bg-card p-5">
              <h3 className="font-semibold text-card-foreground">Build it with AI if…</h3>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                <li>• You can deploy code and point a domain without help</li>
                <li>• The site does not handle customer or payment data</li>
                <li>• Nobody finds you through Google — referrals are your channel</li>
                <li>• You are testing whether the business idea works at all</li>
                <li>• You can live with it being imperfect for a while</li>
              </ul>
            </div>
            <div className="rounded-xl border border-primary/30 bg-primary/5 p-5">
              <h3 className="font-semibold">Hire someone if…</h3>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                <li>• The website is a real source of new business</li>
                <li>• You need to show up when someone searches your town</li>
                <li>• It takes payments or handles personal information</li>
                <li>• Leads need to reach a CRM and get followed up automatically</li>
                <li>• You do not want to be the person who fixes it</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="mt-12 rounded-xl border border-border bg-card p-5">
          <h2 className="flex items-start gap-2 text-xl font-bold tracking-tight">
            <AlertTriangle className="mt-1 h-5 w-5 shrink-0 text-primary" />
            The failure mode we see most
          </h2>
          <p className="mt-3 leading-relaxed text-muted-foreground">
            Not a broken site — a perfectly nice one that nobody finds. AI builders produce clean,
            good-looking pages, and then the site sits at zero traffic because none of the work that
            actually produces visibility was done: no Google Business Profile, no consistent
            name/address/phone across directories, no service-area pages, no schema, no reviews. The
            site is fine. It is just invisible.
          </p>
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-bold tracking-tight">The AI tools, specifically</h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {AI_BUILDERS.map((b) => (
              <Link
                key={b.slug}
                href={`/compare/${b.slug}`}
                className="group rounded-xl border border-border bg-card p-4 transition-colors hover:border-primary/40"
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
          <h2 className="text-2xl font-bold tracking-tight">Built something with AI already?</h2>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
            Bringing in an AI-built site to review, secure and finish is normal work now, not a
            rescue. If it only needs a few fixes, we will tell you that instead of quoting a rebuild.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground transition-opacity hover:opacity-90"
            >
              Get it reviewed <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/compare"
              className="inline-flex items-center gap-2 rounded-lg border border-border px-6 py-3 font-semibold transition-colors hover:border-primary/40"
            >
              All comparisons
            </Link>
          </div>
        </section>
      </div>
    </main>
  )
}
