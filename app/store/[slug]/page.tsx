import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  Sparkles,
  ShieldCheck,
  Zap,
} from "lucide-react"
import Footer from "@/components/footer"
import { SectionBg } from "@/components/section-bg"
import { AddToCartButton } from "@/components/cart/add-to-cart-button"
import { PRODUCTS, getProduct } from "@/lib/store/products"

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const product = getProduct(slug)
  if (!product) return { title: "Product not found" }

  const title = `${product.name} — ${product.priceLabel}${
    product.billing === "subscription" ? `/${product.interval}` : ""
  }`
  return {
    title,
    description: product.tagline,
    alternates: { canonical: `https://rocketopp.com/store/${product.slug}` },
    openGraph: {
      title,
      description: product.tagline,
      url: `https://rocketopp.com/store/${product.slug}`,
      type: "website",
    },
  }
}

const ACCENT_GRADIENT: Record<string, string> = {
  orange: "from-orange-500/20 via-transparent to-transparent",
  cyan: "from-cyan-500/20 via-transparent to-transparent",
  green: "from-emerald-500/20 via-transparent to-transparent",
  violet: "from-violet-500/20 via-transparent to-transparent",
  amber: "from-amber-500/20 via-transparent to-transparent",
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const product = getProduct(slug)
  if (!product) notFound()

  const Icon = product.icon
  const related = product.related
    .map((s) => getProduct(s))
    .filter((p): p is NonNullable<ReturnType<typeof getProduct>> => !!p)

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    brand: { "@type": "Brand", name: "RocketOpp" },
    offers: {
      "@type": "Offer",
      price: (product.priceCents / 100).toFixed(2),
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
      url: `https://rocketopp.com/store/${product.slug}`,
    },
  }

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: product.faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Hero — accent gradient + stars peek through */}
      <section className="relative overflow-hidden pt-24 pb-16 md:pt-32 md:pb-20">
        <div
          className={`absolute inset-0 bg-gradient-to-br ${ACCENT_GRADIENT[product.accent]} pointer-events-none`}
        />
        <div className="absolute inset-0 grid-background opacity-[0.07] pointer-events-none" />
        <div className="container relative z-10 px-4 md:px-6">
          <div className="max-w-5xl mx-auto">
            <Link
              href="/store"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-6"
            >
              ← All products
            </Link>
            <div className="grid lg:grid-cols-[1.2fr_1fr] gap-10 items-start">
              <div>
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/5 text-sm font-medium text-primary mb-6">
                  <Icon className="w-4 h-4" />
                  {product.shipsIn === "Ongoing"
                    ? "Monthly retainer"
                    : `Ships in ${product.shipsIn}`}
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight mb-5">
                  {product.name}
                </h1>
                <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                  {product.tagline}
                </p>
                <div className="mt-8 prose prose-invert max-w-none">
                  <p className="text-base text-foreground/80 leading-relaxed">
                    {product.description}
                  </p>
                </div>
              </div>

              {/* Buy box */}
              <div className="lg:sticky lg:top-24">
                <div className="card-lifted-xl p-6 md:p-8 space-y-6">
                  <div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl md:text-5xl font-extrabold text-primary">
                        {product.priceLabel}
                      </span>
                      {product.billing === "subscription" && (
                        <span className="text-base text-muted-foreground">
                          /{product.interval}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {product.billing === "subscription"
                        ? "Cancel anytime. No contract."
                        : "One-time payment. No subscriptions."}
                    </p>
                  </div>

                  <ul className="space-y-2">
                    <li className="flex items-start gap-2 text-sm">
                      <Clock className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                      <span>
                        {product.shipsIn === "Ongoing"
                          ? "Recurring delivery"
                          : `We start within 24h, ship in ${product.shipsIn}`}
                      </span>
                    </li>
                    <li className="flex items-start gap-2 text-sm">
                      <ShieldCheck className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                      <span>
                        {product.billing === "subscription"
                          ? "Month-to-month, cancel any time"
                          : "Money-back guarantee on missed delivery"}
                      </span>
                    </li>
                    <li className="flex items-start gap-2 text-sm">
                      <Zap className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                      <span>You own everything we build</span>
                    </li>
                  </ul>

                  <AddToCartButton slug={product.slug} />

                  <p className="text-xs text-muted-foreground text-center">
                    Or{" "}
                    <Link
                      href="/contact"
                      className="text-primary hover:underline"
                    >
                      talk to us first
                    </Link>{" "}
                    — we won't push you to buy.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What's included */}
      <section className="relative overflow-hidden py-20 md:py-28">
        <SectionBg variant="solid-deep" />
        <div className="container relative z-10 px-4 md:px-6">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-bold mb-12 text-center">
              What's included
            </h2>
            <div className="grid md:grid-cols-2 gap-4 md:gap-5">
              {product.features.map((f) => (
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

      {/* Outcomes — stars peek through */}
      <section className="relative overflow-hidden py-20 md:py-28">
        <SectionBg variant="seam" />
        <div className="container relative z-10 px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/5 text-sm font-medium text-primary mb-6">
              <Sparkles className="w-4 h-4" />
              What you'll see
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-12">
              Outcomes, not output
            </h2>
            <div className="space-y-4 text-left">
              {product.outcomes.map((o) => (
                <div
                  key={o}
                  className="flex items-start gap-3 p-5 rounded-xl border border-border bg-card/30 backdrop-blur"
                >
                  <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                  <span className="text-base md:text-lg leading-relaxed">
                    {o}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="relative overflow-hidden py-20 md:py-28">
        <SectionBg variant="solid-card" />
        <div className="container relative z-10 px-4 md:px-6">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-bold mb-12 text-center">
              Common questions
            </h2>
            <div className="space-y-4">
              {product.faqs.map((f) => (
                <details
                  key={f.q}
                  className="group card-lifted p-5 cursor-pointer"
                >
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

      {/* Sticky bottom CTA */}
      <section className="relative overflow-hidden py-16 md:py-20 border-t border-border">
        <SectionBg variant="solid-deep" />
        <div className="container relative z-10 px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center space-y-5">
            <h2 className="text-3xl md:text-4xl font-bold">
              Ready to ship {product.name}?
            </h2>
            <p className="text-muted-foreground">
              Add it to your cart and start. We begin work the same business
              day.
            </p>
            <div className="max-w-sm mx-auto pt-2">
              <AddToCartButton slug={product.slug} />
            </div>
          </div>
        </div>
      </section>

      {/* Related */}
      {related.length > 0 && (
        <section className="relative overflow-hidden py-20 md:py-28">
          <SectionBg variant="seam" />
          <div className="container relative z-10 px-4 md:px-6">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">
                Pairs well with
              </h2>
              <div className="grid md:grid-cols-3 gap-4">
                {related.map((r) => {
                  const RIcon = r.icon
                  return (
                    <Link
                      key={r.slug}
                      href={`/store/${r.slug}`}
                      className="group"
                    >
                      <div className="card-lifted h-full p-5 flex flex-col gap-3 group-hover:border-primary/40 transition-all">
                        <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 text-primary">
                          <RIcon className="w-5 h-5" />
                        </div>
                        <h3 className="font-bold group-hover:text-primary transition-colors">
                          {r.name}
                        </h3>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {r.tagline}
                        </p>
                        <div className="flex items-center justify-between mt-auto pt-3 border-t border-border">
                          <span className="text-sm font-bold text-primary">
                            {r.priceLabel}
                            {r.billing === "subscription" && (
                              <span className="text-xs font-normal text-muted-foreground">
                                /{r.interval}
                              </span>
                            )}
                          </span>
                          <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                        </div>
                      </div>
                    </Link>
                  )
                })}
              </div>
            </div>
          </div>
        </section>
      )}

      <Footer />
    </>
  )
}
