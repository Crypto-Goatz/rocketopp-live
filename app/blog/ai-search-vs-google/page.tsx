import type { Metadata } from 'next'
import Link from 'next/link'
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Check,
  Clock,
  FlaskConical,
  Minus,
  TrendingDown,
  TrendingUp,
} from 'lucide-react'

import SearchChart from '@/components/charts/SearchChart'
import ReadingProgress from '@/components/blog/reading-progress'
import { METHODOLOGY, REPORT_ACTIONS, REPORT_KPIS } from '@/lib/report-kpis'
import { REPORT_FAQS, REPORT_TERMS } from '@/lib/report-faq'
import { findFeatured } from '@/lib/blog-featured'

/**
 * "AI search vs Google" — the flagship data report.
 *
 * This is a coded article rather than a `blog_posts` row (see lib/blog-featured.ts
 * for why): four interactive charts with toggleable legends and table views cannot
 * live in a text column.
 *
 * EDITORIAL SPINE — the reason the piece works, and the thing to preserve in any
 * edit: it opens by CORRECTING the popular claim rather than repeating it. "Google
 * is dying" is false and a reader can disprove it in ten seconds, which poisons
 * everything after it. "Google grew; the click collapsed" is both true and sharper.
 *
 * Every figure renders its publisher and date, interpolation is drawn as
 * interpolation, and the methodology section states out loud what nobody has
 * published. That is also, not coincidentally, what makes a page citable by an AI
 * engine — the article practises what it argues for.
 */

const ARTICLE = findFeatured('ai-search-vs-google')!
const URL = 'https://rocketopp.com/blog/ai-search-vs-google'
const PUBLISHED = 'July 29, 2026'

export const metadata: Metadata = {
  title: ARTICLE.title,
  description: ARTICLE.excerpt,
  keywords: [
    'AI search vs Google',
    'zero click searches',
    'AI Overviews',
    'AI referral traffic',
    'answer engine optimization',
    'AEO',
    'GEO',
    'ChatGPT citations',
  ],
  alternates: { canonical: URL },
  openGraph: {
    type: 'article',
    url: URL,
    title: ARTICLE.title,
    description: ARTICLE.excerpt,
    publishedTime: ARTICLE.publishedAt,
  },
  twitter: { card: 'summary_large_image', title: ARTICLE.title, description: ARTICLE.excerpt },
}

/**
 * Article + Breadcrumb JSON-LD.
 *
 * `citation` lists the publishers behind the numbers. It is the schema field that
 * matches what this article actually is — a report that cites named sources — and
 * it gives an AI engine a machine-readable reason to treat the page as sourced
 * rather than asserted.
 */
const JSON_LD = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Article',
      '@id': `${URL}#article`,
      headline: ARTICLE.title,
      description: ARTICLE.excerpt,
      datePublished: ARTICLE.publishedAt,
      dateModified: ARTICLE.publishedAt,
      inLanguage: 'en-US',
      // ~1,900 of narrative + ~1,900 of Q&A and definitions. Keep this honest;
      // an inflated wordCount is the kind of small lie that costs trust cheaply.
      wordCount: 3800,
      timeRequired: `PT${ARTICLE.readingTime}M`,
      keywords: ARTICLE.tags.join(', '),
      articleSection: 'Marketing',
      mainEntityOfPage: { '@type': 'WebPage', '@id': URL },
      author: {
        '@type': 'Organization',
        name: 'RocketOpp LLC',
        url: 'https://rocketopp.com',
      },
      publisher: {
        '@type': 'Organization',
        name: 'RocketOpp LLC',
        url: 'https://rocketopp.com',
      },
      citation: [
        'SparkToro / Similarweb clickstream analysis, Jan–Apr 2026',
        'Demandsage, May 2026',
        'Advanced Web Ranking / Digital Applied, Mar 2026',
        'Seer Interactive, Sep 2025',
        'Ahrefs, 2025',
        'Graphite, Mar 2026',
        'Conductor, 2026',
        'Similarweb, May 2026',
        'Cloudflare Radar, Jan–May 2026',
        'Goodie GA4 brand panel, Jan–Apr 2026',
      ],
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://rocketopp.com' },
        { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://rocketopp.com/blog' },
        { '@type': 'ListItem', position: 3, name: ARTICLE.title, item: URL },
      ],
    },
    /**
     * FAQPage + DefinedTermSet.
     *
     * The prose answers already read well to a human. These nodes are what make
     * the same content machine-liftable: an engine resolving "what is a
     * zero-click search" or "does blocking AI crawlers protect content" gets a
     * structured question/answer pair with our URL attached, instead of having
     * to infer the boundaries of the answer out of running text.
     *
     * Both mirror the rendered sections one-to-one. If you edit lib/report-faq.ts
     * these follow automatically — never let the schema and the page diverge,
     * because a FAQPage that does not match visible content is a manual action
     * risk, not a clever trick.
     */
    {
      '@type': 'FAQPage',
      '@id': `${URL}#faq`,
      mainEntity: REPORT_FAQS.map((f) => ({
        '@type': 'Question',
        name: f.question,
        acceptedAnswer: { '@type': 'Answer', text: f.answer },
      })),
    },
    {
      '@type': 'DefinedTermSet',
      '@id': `${URL}#terms`,
      name: 'AI search and answer-engine terminology',
      hasDefinedTerm: REPORT_TERMS.map((t) => ({
        '@type': 'DefinedTerm',
        name: t.term,
        description: t.definition,
        inDefinedTermSet: `${URL}#terms`,
      })),
    },
  ],
}

const DIR_ICON = { up: TrendingUp, down: TrendingDown, flat: Minus } as const

/** A chart plus the paragraph that explains what it shows. */
function ChartBlock({
  eyebrow,
  heading,
  children,
  chartId,
}: {
  eyebrow: string
  heading: string
  children: React.ReactNode
  chartId: string
}) {
  return (
    <div className="reveal mt-14">
      <p className="text-[11px] font-bold uppercase tracking-widest text-primary">{eyebrow}</p>
      <h2 className="mt-2 text-2xl font-bold tracking-tight md:text-3xl">{heading}</h2>
      <div className="mt-4 space-y-4 text-[1.0625rem] leading-relaxed text-muted-foreground">
        {children}
      </div>
      <div className="mt-7">
        <SearchChart only={chartId} />
      </div>
    </div>
  )
}

export default function ArticlePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
      />
      <ReadingProgress target="report-body" />

      <article id="report-body" className="bg-background pb-4">
        {/* ─────────────── Masthead ─────────────── */}
        <header className="border-b border-border">
          <div className="container mx-auto max-w-3xl px-4 py-12 md:py-16">
            <Link
              href="/blog"
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              All articles
            </Link>

            <p className="mt-8 text-[11px] font-bold uppercase tracking-[0.2em] text-primary">
              SXO Intelligence · Data Report
            </p>
            <h1 className="mt-4 text-4xl font-bold leading-[1.1] tracking-tight md:text-5xl">
              AI search vs Google: where the queries went —{' '}
              <span className="text-muted-foreground">and where the clicks didn&rsquo;t</span>
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
              Every number below is sourced and dated. Where a monthly series was never published,
              the chart says so instead of drawing a smooth line through a guess.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-x-3 gap-y-2 border-t border-border pt-6 text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">RocketOpp Research</span>
              <span aria-hidden>·</span>
              <span>CRO9 SXO Intelligence</span>
              <span aria-hidden>·</span>
              <time dateTime={ARTICLE.publishedAt}>{PUBLISHED}</time>
              <span aria-hidden>·</span>
              <span className="inline-flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" />
                {ARTICLE.readingTime} min read
              </span>
            </div>
          </div>
        </header>

        <div className="container mx-auto max-w-3xl px-4">
          {/* ─────────────── The correction ─────────────── */}
          <div className="reveal mt-12 overflow-hidden rounded-2xl border border-primary/30 bg-primary/5">
            <div className="border-b border-primary/20 px-6 py-4">
              <p className="text-[11px] font-bold uppercase tracking-widest text-primary">
                One correction first
              </p>
              <p className="mt-1 text-lg font-semibold">
                The premise needs one fix — and it&rsquo;s good news.
              </p>
            </div>
            <div className="space-y-4 px-6 py-6 text-[1.0625rem] leading-relaxed text-muted-foreground">
              <p>
                <span className="font-semibold text-foreground">
                  Google&rsquo;s search volume is not dropping. It is growing.
                </span>{' '}
                Google went from ~13.7 billion searches a day (Jan 2025) to ~16.4 billion a day
                (May 2026). Organic traffic from Google to websites is down only{' '}
                <strong className="font-semibold text-foreground">−2.5% year over year</strong>.
                There is no collapse in Google demand to chart.
              </p>
              <p>
                What <em>is</em> collapsing is{' '}
                <span className="font-semibold text-foreground">the click</span>. Google now answers
                the query on its own page:{' '}
                <strong className="font-semibold text-foreground">68.01%</strong> of US searches end
                with no click to anyone, and when an AI Overview appears organic CTR falls{' '}
                <strong className="font-semibold text-foreground">~61%</strong>. Same searches.
                Fewer exits.
              </p>
              <p>
                Meanwhile AI is winning <em>queries</em>, not clicks. AI prompting is roughly 28% the
                size of search worldwide, but AI sends just{' '}
                <strong className="font-semibold text-foreground">1.08%</strong> of all website
                traffic — and the clicks it does send convert{' '}
                <strong className="font-semibold text-foreground">4.4× to 23×</strong> better than
                organic. Enormous attention, a tiny pipe, exceptional quality. That gap is the whole
                opportunity.
              </p>
            </div>
          </div>

          {/* ─────────────── KPI tiles ─────────────── */}
          <div className="reveal mt-14">
            <h2 className="text-2xl font-bold tracking-tight md:text-3xl">Right now — July 2026</h2>
            <p className="mt-3 text-[1.0625rem] leading-relaxed text-muted-foreground">
              Nine figures, each with the publisher and the date it was published. Check any of
              them.
            </p>
            <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {REPORT_KPIS.map((k) => {
                const Icon = DIR_ICON[k.dir]
                return (
                  <div
                    key={k.label}
                    className="flex flex-col rounded-2xl border border-border bg-card p-5"
                  >
                    <p className="text-sm leading-snug text-muted-foreground">{k.label}</p>
                    <p className="mt-3 font-mono text-3xl font-bold leading-none tracking-tight">
                      {k.value}
                    </p>
                    <p className="mt-2.5 inline-flex items-start gap-1.5 text-xs text-muted-foreground">
                      <Icon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" aria-hidden />
                      {k.delta}
                    </p>
                    <p className="mt-auto border-t border-border pt-3 text-[11px] leading-snug tracking-wide text-muted-foreground/60">
                      {k.source}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>

          {/* ─────────────── Charts 1–4, each with its own reading ─────────────── */}
          <ChartBlock
            eyebrow="The actual drop-off"
            heading="Clicks, not queries"
            chartId="zero-click"
          >
            <p>
              This is the &ldquo;Google decline&rdquo; people are describing — and it is a{' '}
              <em>click</em> decline, not a volume decline.
            </p>
            <p>
              Note the methodology break: the 2019–2020 readings come from different clickstream
              panels than the 2024–2026 readings, so read the trend, not the point-to-point deltas.
              SparkToro characterises the recent move as a 22.9% decline in click-generating
              searches.
            </p>
          </ChartBlock>

          <ChartBlock
            eyebrow="The mechanism"
            heading="AI Overviews are what took the click"
            chartId="ai-overviews"
          >
            <p>
              Only two points in this window were ever published:{' '}
              <strong className="font-semibold text-foreground">Dec 2025 (34.5%)</strong> and{' '}
              <strong className="font-semibold text-foreground">Mar 2026 (48%)</strong>. Those are
              the solid dots. The line between them is straight-line interpolation, and after March
              the dash means <em>no data published</em> — not &ldquo;it plateaued.&rdquo;
            </p>
            <p>
              Anyone showing you a smooth monthly AI-Overview curve for this window is drawing, not
              measuring.
            </p>
          </ChartBlock>

          <ChartBlock
            eyebrow="The counterintuitive part"
            heading="Google&rsquo;s share of referrals went up"
            chartId="google-referrals"
          >
            <p>
              Google&rsquo;s share of the clicks that <em>do</em> happen rose 8 points in five
              months. Both things are true at once: Google sends a smaller slice of its own searches
              onward, yet still dominates referrals — because AI platforms send so little traffic
              that they cannot take share.
            </p>
            <p>
              AI is winning attention. It has not yet won distribution. Which is exactly why the
              window is still open.
            </p>
          </ChartBlock>

          <ChartBlock
            eyebrow="Inside AI referrals"
            heading="Who is actually sending the traffic"
            chartId="ai-mix"
          >
            <p>
              &ldquo;Optimise for AI search&rdquo; is not one target. ChatGPT lost ~10 points of AI
              referral share in four months while Claude gained ~7. If your strategy is
              ChatGPT-shaped, it is already dated — which is precisely why citation-worthy structure
              beats chasing one engine&rsquo;s quirks.
            </p>
            <p className="text-sm">Click a platform in the legend to isolate it.</p>
          </ChartBlock>

          {/* ─────────────── What it means ─────────────── */}
          <div className="reveal mt-16">
            <h2 className="text-2xl font-bold tracking-tight md:text-3xl">What this means for you</h2>
            <ol className="mt-7 space-y-4">
              {REPORT_ACTIONS.map((a, i) => (
                <li
                  key={a.title}
                  className="flex gap-4 rounded-2xl border border-border bg-card p-5 sm:p-6"
                >
                  <span className="font-mono text-sm font-bold text-primary/70" aria-hidden>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <h3 className="font-semibold leading-snug">{a.title}</h3>
                    <p className="mt-2 leading-relaxed text-muted-foreground">{a.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          {/* ─────────────── Methodology ─────────────── */}
          <details className="reveal group mt-14 rounded-2xl border border-border bg-card/60">
            <summary className="flex cursor-pointer list-none items-start gap-3 p-6">
              <FlaskConical className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden />
              <span className="flex-1">
                <span className="block font-semibold">Methodology &amp; sources</span>
                <span className="mt-1 block text-sm text-muted-foreground">
                  How this was built, what is measured, and what is not.
                </span>
              </span>
              <span className="mt-1 shrink-0 text-xs font-medium uppercase tracking-wider text-muted-foreground group-open:hidden">
                Show
              </span>
              <span className="mt-1 hidden shrink-0 text-xs font-medium uppercase tracking-wider text-muted-foreground group-open:block">
                Hide
              </span>
            </summary>

            <div className="border-t border-border px-6 py-6">
              <h3 className="text-sm font-bold uppercase tracking-widest text-primary">
                The honest limitation
              </h3>
              <p className="mt-3 leading-relaxed text-muted-foreground">{METHODOLOGY.limitation}</p>
              <p className="mt-3 leading-relaxed text-muted-foreground">{METHODOLOGY.approach}</p>

              {METHODOLOGY.groups.map((g) => (
                <div key={g.heading} className="mt-7">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-primary">
                    {g.heading}
                  </h3>
                  <ul className="mt-3 space-y-2.5">
                    {g.items.map((item) => (
                      <li key={item} className="flex gap-2.5 text-sm leading-relaxed text-muted-foreground">
                        <Check className="mt-1 h-3.5 w-3.5 shrink-0 text-primary/60" aria-hidden />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}

              <p className="mt-7 border-t border-border pt-5 text-xs leading-relaxed text-muted-foreground/70">
                Compiled {PUBLISHED} for RocketOpp LLC. Every figure is dated and attributed — none
                estimated by the author.
              </p>
            </div>
          </details>

          {/* ─────────────── Definitions ───────────────
              Short, liftable, sourced. An engine answering "what is a zero-click
              search" should be able to take one of these verbatim. */}
          <div className="reveal mt-16">
            <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
              The terms, defined
            </h2>
            <p className="mt-3 leading-relaxed text-muted-foreground">
              Plain definitions with the number attached, so nothing here has to
              be taken on trust.
            </p>
            <dl className="mt-7 space-y-4">
              {REPORT_TERMS.map((t) => (
                <div key={t.term} className="rounded-2xl border border-border bg-card p-5 sm:p-6">
                  <dt className="font-semibold leading-snug">{t.term}</dt>
                  <dd className="mt-2 leading-relaxed text-muted-foreground">{t.definition}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* ─────────────── Questions ───────────────
              Every answer opens with the answer and names its source inline, so
              it survives being quoted on its own. Mirrors the FAQPage node in
              the JSON-LD graph one-to-one. */}
          <div className="reveal mt-16">
            <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
              Questions people are actually asking
            </h2>
            <p className="mt-3 leading-relaxed text-muted-foreground">
              {REPORT_FAQS.length} answers, each one sourced and dated.
            </p>
            <div className="mt-8 space-y-8">
              {REPORT_FAQS.map((f) => (
                <div key={f.question} className="border-l-2 border-primary/40 pl-5">
                  <h3 className="text-lg font-bold leading-snug tracking-tight">{f.question}</h3>
                  <p className="mt-2 leading-relaxed text-muted-foreground">{f.answer}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ─────────────── The offer, stated once ─────────────── */}
          <div className="reveal mb-16 mt-14 rounded-3xl border border-primary/30 bg-primary/5 p-7 sm:p-9">
            <h2 className="text-2xl font-bold tracking-tight">
              We build the structure this report says wins.
            </h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              Schema, an llms.txt written for AI crawlers, a robots.txt that actually allowlists
              them, and content that leads with the answer. It is not an upsell — it is the reason
              the site is worth building. Right now that is $497.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href="/497-website"
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3.5 font-semibold text-primary-foreground transition-opacity hover:opacity-90"
              >
                See the $497 website offer
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/build-a-website-with-ai"
                className="inline-flex items-center gap-2 rounded-lg border border-border px-6 py-3.5 font-semibold transition-colors hover:border-primary/40"
              >
                What AI can and cannot do
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </article>
    </>
  )
}
