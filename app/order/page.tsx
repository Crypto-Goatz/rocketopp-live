import type { Metadata } from "next"
import Link from "next/link"
import { Sparkles } from "lucide-react"
import Footer from "@/components/footer"
import { SectionBg } from "@/components/section-bg"
import { OrderWizard } from "@/components/order/wizard-steps"
import { QuotePanel } from "@/components/order/quote-panel"
import { OrderSeed } from "./seed"

export const metadata: Metadata = {
  title: "Get a custom quote — RocketOpp",
  description:
    "Build your project quote in 60 seconds. Pick what you need, scope each one, get an AI-generated brief, and lock it in with a $50 refundable deposit.",
  alternates: { canonical: "https://rocketopp.com/order" },
  robots: { index: true, follow: true },
}

interface PageProps {
  searchParams: Promise<{ seed?: string }>
}

export default async function OrderPage({ searchParams }: PageProps) {
  const sp = await searchParams
  const seedSlug = typeof sp.seed === "string" ? sp.seed : null

  return (
    <>
      {/* Seed the wizard with whichever service the user came from */}
      {seedSlug && <OrderSeed slug={seedSlug} />}

      {/* Hero */}
      <section className="relative overflow-hidden pt-24 pb-12 md:pt-32 md:pb-16">
        <div className="absolute inset-0 grid-background opacity-[0.07] pointer-events-none" />
        <div className="container relative z-10 px-4 md:px-6">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/5 text-sm font-medium text-primary mb-6">
              <Sparkles className="w-4 h-4" />
              Custom Quote
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4">
              Build your{" "}
              <span className="bg-gradient-to-r from-primary via-orange-400 to-primary bg-clip-text text-transparent animate-gradient-x">
                custom quote
              </span>{" "}
              in 60 seconds.
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
              Pick what you need on the left. Quote builds on the right in real
              time. End with a $50 refundable deposit + a kickoff call directly
              on Mike's calendar.
            </p>
          </div>
        </div>
      </section>

      {/* Wizard + quote panel */}
      <section className="relative overflow-hidden pb-24">
        <SectionBg variant="solid-card" />
        <div className="container relative z-10 px-4 md:px-6">
          <div className="grid lg:grid-cols-[1.5fr_1fr] gap-8 max-w-6xl mx-auto">
            <div>
              <OrderWizard />
            </div>
            <div>
              <QuotePanel />
            </div>
          </div>
        </div>
      </section>

      {/* Trust strip */}
      <section className="relative overflow-hidden py-12 border-t border-border">
        <SectionBg variant="solid-deep" />
        <div className="container relative z-10 px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center text-sm text-muted-foreground">
            <p>
              <strong className="text-foreground">100% refundable.</strong> If we
              can't deliver what we promised, the deposit comes back.{" "}
              <Link href="/contact" className="text-primary hover:underline">
                Talk to Mike directly →
              </Link>
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}
