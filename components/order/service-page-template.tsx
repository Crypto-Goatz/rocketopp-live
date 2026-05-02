import Link from 'next/link'
import {
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Clock,
  type LucideIcon,
} from 'lucide-react'
import Footer from '@/components/footer'
import { SectionBg } from '@/components/section-bg'
import { ServicePurchaseBlock } from '@/components/order/service-purchase-block'
import { getService, SERVICES } from '@/lib/order/services-catalog'

export interface ServicePageProps {
  /** Catalog slug. Pricing + accent are pulled from SERVICES. */
  slug: string
  /** Lucide icon for the hero badge. */
  Icon: LucideIcon
  /** Headline. e.g. "SEO that actually ranks." */
  headline: string
  /** Subhead. 1-2 sentences. */
  subhead: string
  /** Long-form copy for under the hero. */
  longDescription: string
  /** What's included list. */
  features: string[]
  /** Outcomes the customer will see. */
  outcomes: string[]
  /** FAQ. */
  faqs: { q: string; a: string }[]
}

/**
 * Standardized full service page — same rhythm as /store/[slug] (which
 * we built earlier). Wraps in ServicesLayout (already provides
 * ServiceAccentScope + floating ServicePageCta) so all primary-colored
 * UI auto-themes to the service's accent.
 */
export function ServicePageTemplate(props: ServicePageProps) {
  const { slug, Icon, headline, subhead, longDescription, features, outcomes, faqs } = props
  const product = getService(slug)

  // Related = siblings in same category, excluding self, top 3
  const related = product
    ? SERVICES.filter(
        (s) => s.category === product.category && s.slug !== slug,
      ).slice(0, 3)
    : []

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden pt-24 pb-16 md:pt-32 md:pb-20">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.18] via-transparent to-transparent pointer-events-none" />
        <div className="absolute inset-0 grid-background opacity-[0.07] pointer-events-none" />
        <div className="container relative z-10 px-4 md:px-6">
          <div className="max-w-4xl">
            <Link
              href="/services"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-6"
            >
              ← All services
            </Link>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-sm font-medium text-primary mb-6">
              <Icon className="w-4 h-4" />
              {product?.shipsIn === 'Ongoing'
                ? 'Monthly retainer'
                : `Ships in ${product?.shipsIn || '—'}`}
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight mb-5">
              {headline}
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-3xl">
              {subhead}
            </p>
            <p className="mt-6 text-base text-foreground/80 leading-relaxed max-w-3xl">
              {longDescription}
            </p>
          </div>
        </div>
      </section>

      {/* Inline purchase block — accent-themed */}
      <section className="relative pb-12">
        <div className="container px-4 md:px-6">
          <div className="max-w-5xl mx-auto">
            <ServicePurchaseBlock slug={slug} className="mt-0" />
          </div>
        </div>
      </section>

      {/* What's included */}
      <section className="relative overflow-hidden py-20 md:py-28">
        <SectionBg variant="solid-card" />
        <div className="container relative z-10 px-4 md:px-6">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-bold mb-12 text-center">
              What&apos;s included
            </h2>
            <div className="grid md:grid-cols-2 gap-4 md:gap-5">
              {features.map((f) => (
                <div
                  key={f}
                  className="card-lifted p-5 flex items-start gap-3"
                >
                  <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                  <span className="text-base leading-relaxed">{f}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Outcomes — stars peek through via seam */}
      <section className="relative overflow-hidden py-20 md:py-28">
        <SectionBg variant="seam" />
        <div className="container relative z-10 px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/5 text-sm font-medium text-primary mb-6">
              <Sparkles className="w-4 h-4" />
              What you&apos;ll see
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-12">
              Outcomes, not output
            </h2>
            <div className="space-y-4 text-left">
              {outcomes.map((o) => (
                <div
                  key={o}
                  className="flex items-start gap-3 p-5 rounded-xl border border-border bg-card/30 backdrop-blur"
                >
                  <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                  <span className="text-base md:text-lg leading-relaxed">{o}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="relative overflow-hidden py-20 md:py-28">
        <SectionBg variant="solid-deep" />
        <div className="container relative z-10 px-4 md:px-6">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-bold mb-12 text-center">
              Common questions
            </h2>
            <div className="space-y-4">
              {faqs.map((f) => (
                <details key={f.q} className="group card-lifted p-5 cursor-pointer">
                  <summary className="flex items-center justify-between gap-4 list-none">
                    <span className="font-semibold text-base md:text-lg">
                      {f.q}
                    </span>
                    <span className="text-primary text-2xl group-open:rotate-45 transition-transform">
                      +
                    </span>
                  </summary>
                  <p className="mt-4 text-muted-foreground leading-relaxed">
                    {f.a}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA + related */}
      <section className="relative overflow-hidden py-20 md:py-24">
        <SectionBg variant="solid-card" />
        <div className="container relative z-10 px-4 md:px-6">
          <div className="max-w-5xl mx-auto">
            <ServicePurchaseBlock slug={slug} className="mb-12" />

            {related.length > 0 && (
              <div>
                <h3 className="text-xl md:text-2xl font-bold mb-5 text-center">
                  Pairs well with
                </h3>
                <div className="grid md:grid-cols-3 gap-4">
                  {related.map((r) => (
                    <Link
                      key={r.slug}
                      href={r.servicePagePath || `/order?seed=${r.slug}`}
                      className="group card-lifted p-5 hover:border-primary/40 transition-all"
                    >
                      <h4 className="font-bold group-hover:text-primary transition-colors">
                        {r.name}
                      </h4>
                      <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                        {r.shortPitch}
                      </p>
                      <div className="flex items-center justify-between mt-4 pt-3 border-t border-border">
                        <span className="text-sm font-bold text-primary">
                          {r.basePriceLabel}
                          <span className="text-xs font-normal text-muted-foreground">
                            {r.basePriceSuffix}
                          </span>
                        </span>
                        <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}
