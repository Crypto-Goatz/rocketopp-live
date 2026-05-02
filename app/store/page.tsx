import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, Clock, Sparkles } from "lucide-react"
import Footer from "@/components/footer"
import { SectionBg } from "@/components/section-bg"
import { PRODUCTS } from "@/lib/store/products"

export const metadata: Metadata = {
  title: "Store",
  description:
    "Shop RocketOpp's full catalog of AI-powered business systems. Websites, AI automation, CRM, SXO, PPC, MCP integration. Transparent prices. Add to cart and check out in under a minute.",
  alternates: { canonical: "https://rocketopp.com/store" },
}

const ACCENT_RING: Record<string, string> = {
  orange: "border-orange-500/30 shadow-[0_0_60px_-20px_rgba(255,107,53,0.3)]",
  cyan: "border-cyan-400/30 shadow-[0_0_60px_-20px_rgba(0,212,255,0.3)]",
  green: "border-emerald-500/30 shadow-[0_0_60px_-20px_rgba(126,217,87,0.3)]",
  violet: "border-violet-500/30 shadow-[0_0_60px_-20px_rgba(167,139,250,0.3)]",
  amber: "border-amber-500/30 shadow-[0_0_60px_-20px_rgba(251,191,36,0.3)]",
}

export default function StorePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden pt-24 pb-16 md:pt-32 md:pb-20 min-h-[60vh] flex items-center">
        <div className="absolute inset-0 grid-background opacity-10 pointer-events-none" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-background pointer-events-none" />
        <div className="container relative z-10 px-4 md:px-6">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/5 text-sm font-medium text-primary mb-6">
              <Sparkles className="w-4 h-4" />
              Store
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-5">
              Buy a system,{" "}
              <span className="bg-gradient-to-r from-primary via-orange-400 to-primary bg-clip-text text-transparent animate-gradient-x">
                ship it this month.
              </span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl">
              Six core products. One cart. Pay in seconds. We start work the
              same day.
            </p>
          </div>
        </div>
      </section>

      {/* Catalog grid — 100% solid bg so the products pop */}
      <section className="relative overflow-hidden py-20 md:py-28">
        <SectionBg variant="solid-card" />
        <div className="container relative z-10 px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {PRODUCTS.map((p) => {
              const Icon = p.icon
              return (
                <Link
                  key={p.slug}
                  href={`/store/${p.slug}`}
                  className="group"
                >
                  <div
                    className={`card-lifted h-full p-6 flex flex-col gap-4 transition-all hover:-translate-y-1 ${ACCENT_RING[p.accent]} group-hover:border-primary/40`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary">
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                        <Clock className="w-3 h-3" />
                        {p.shipsIn}
                      </span>
                    </div>

                    <div className="flex-1">
                      <h3 className="text-xl font-bold group-hover:text-primary transition-colors leading-tight">
                        {p.name}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                        {p.tagline}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-border">
                      <div className="flex items-baseline gap-1">
                        <span className="text-xl font-bold text-primary">
                          {p.priceLabel}
                        </span>
                        {p.billing === "subscription" && (
                          <span className="text-xs text-muted-foreground">
                            /{p.interval}
                          </span>
                        )}
                      </div>
                      <span className="inline-flex items-center gap-1 text-sm text-muted-foreground group-hover:text-primary transition-colors">
                        View
                        <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA — let stars show */}
      <section className="relative overflow-hidden py-20 md:py-28">
        <SectionBg variant="seam" />
        <div className="container relative z-10 px-4 md:px-6">
          <div className="max-w-2xl mx-auto text-center space-y-5">
            <h2 className="text-3xl md:text-5xl font-bold">
              Not sure which system you need?
            </h2>
            <p className="text-lg text-muted-foreground">
              Take the free 60-second assessment. We'll point you at the right
              starting product.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
              <Link
                href="/assessment"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-7 py-3 text-base font-bold text-primary-foreground shadow-[0_0_32px_rgba(255,107,53,0.35)] hover:scale-[1.02] transition-transform"
              >
                Free AI Assessment
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-card/50 px-7 py-3 text-base font-semibold text-foreground hover:border-primary/40 transition-colors"
              >
                Talk to a human
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}
