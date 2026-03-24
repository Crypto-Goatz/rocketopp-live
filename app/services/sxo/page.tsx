import type { Metadata } from "next"
import Link from "next/link"
import { Search, CheckCircle, ArrowRight, Clock, TrendingUp, BarChart3, Globe, Zap, Target, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ServiceOfferSchema, FAQSchema, BreadcrumbSchema } from "@/components/seo/json-ld"
import Footer from "@/components/footer"

export const metadata: Metadata = {
  title: "SXO (Search Experience Optimization) - Pricing & What's Included | RocketOpp",
  description:
    "SXO services from $997/mo. SEO is dead — SXO combines search optimization, user experience, and conversion. Powered by CRO9. See pricing and what's included.",
  keywords: [
    "price for professional SEO",
    "SEO pricing",
    "SXO services cost",
    "search experience optimization",
    "SEO agency pricing",
    "monthly SEO cost",
    "SEO packages",
    "SXO vs SEO",
    "conversion rate optimization",
    "search engine optimization pricing 2026",
  ],
  openGraph: {
    title: "SXO Services - Pricing & What's Included | RocketOpp",
    description: "SXO from $997/mo. Search optimization + UX + conversion, powered by CRO9.",
    url: "https://rocketopp.com/services/sxo",
  },
  alternates: { canonical: "https://rocketopp.com/services/sxo" },
}

const tiers = [
  {
    name: "SXO Starter",
    price: "$997/mo",
    features: [
      "Technical SEO audit & fixes",
      "On-page optimization (10 pages)",
      "Keyword research & strategy",
      "Monthly performance report",
      "Google Business Profile optimization",
      "Schema markup implementation",
      "Core Web Vitals optimization",
      "Competitor analysis",
    ],
  },
  {
    name: "SXO Growth",
    price: "$1,997/mo",
    popular: true,
    features: [
      "Everything in Starter",
      "Content strategy & creation (4 articles/mo)",
      "Link building (10 quality backlinks/mo)",
      "Conversion rate optimization",
      "A/B testing & UX improvements",
      "Local SEO (3 locations)",
      "Social signals optimization",
      "Bi-weekly strategy calls",
    ],
  },
  {
    name: "SXO Enterprise",
    price: "$3,997/mo",
    features: [
      "Everything in Growth",
      "Full content engine (12 articles/mo)",
      "Advanced link building (25+/mo)",
      "AI-powered content optimization",
      "Multi-location SEO (unlimited)",
      "E-commerce SEO & product schema",
      "Weekly strategy calls",
      "Dedicated account manager",
    ],
  },
]

const faqs = [
  {
    question: "What is SXO and how is it different from SEO?",
    answer:
      "SXO (Search Experience Optimization) goes beyond traditional SEO. While SEO focuses on rankings, SXO combines search optimization, user experience, and conversion rate optimization into one strategy. We don't just get you traffic — we make sure that traffic converts into customers. Powered by our CRO9 engine.",
  },
  {
    question: "How much does professional SEO cost in 2026?",
    answer:
      "Industry average for professional SEO is $2,000 - $5,000/month. RocketOpp's SXO starts at $997/month because our AI-powered CRO9 engine automates the analysis and optimization work that takes traditional agencies 10x longer.",
  },
  {
    question: "How long until I see results from SXO?",
    answer:
      "Technical fixes and on-page improvements show results within 2-4 weeks. Keyword rankings typically improve within 2-3 months. Full SXO impact (rankings + traffic + conversions) is usually visible by month 3-4. We provide monthly reports so you can track progress from day one.",
  },
  {
    question: "Do you guarantee first-page rankings?",
    answer:
      "We don't guarantee specific rankings because no honest agency can — Google's algorithm has 200+ factors. What we guarantee is measurable improvement in organic traffic, search visibility, and conversion rates. Our track record shows an average 3x improvement in organic traffic within 6 months.",
  },
  {
    question: "What's included in the monthly reports?",
    answer:
      "Every report includes keyword ranking changes, organic traffic trends, conversion metrics, technical health scores, backlink profile growth, competitor comparisons, and actionable next-step recommendations. No vanity metrics — only data that matters to your bottom line.",
  },
]

export default function SXOPage() {
  return (
    <>
      <ServiceOfferSchema
        name="SXO - Search Experience Optimization"
        description="SXO combines search optimization, user experience, and conversion rate optimization. Powered by CRO9 AI engine."
        serviceType="Search Experience Optimization"
        url="https://rocketopp.com/services/sxo"
        price={997}
        priceUnit="MONTH"
      />
      <FAQSchema items={faqs} />
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "https://rocketopp.com" },
          { name: "Services", url: "https://rocketopp.com/services" },
          { name: "SXO", url: "https://rocketopp.com/services/sxo" },
        ]}
      />

      <main className="min-h-screen">
        {/* Hero */}
        <section className="pt-24 pb-16 md:pt-32 md:pb-20 relative overflow-hidden">
          <div className="absolute inset-0 grid-background opacity-20" />
          <div className="absolute inset-0 grid-gradient" />
          <div className="container relative z-10 px-4 md:px-6">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/5 text-sm font-medium text-primary mb-6">
                <TrendingUp className="w-4 h-4" />
                Powered by CRO9
              </div>
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                SXO (Search Experience Optimization) — Pricing & What&apos;s Included
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
                SEO is dead. SXO combines search optimization, user experience, and conversion — powered by CRO9. Starting at <span className="text-primary font-bold">$997/mo</span>.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="text-lg px-8 py-6" asChild>
                  <Link href="/contact">
                    Get a Free SXO Audit <ArrowRight className="ml-2 w-5 h-5" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="text-lg px-8 py-6" asChild>
                  <a href="#pricing">See Plans</a>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* What SXO covers */}
        <section className="py-16 md:py-24 bg-card/50">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">What SXO Covers</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {[
                { icon: Search, title: "Search Optimization", desc: "Technical SEO, on-page, keyword strategy, schema markup, and site architecture." },
                { icon: Eye, title: "User Experience", desc: "Core Web Vitals, page speed, mobile UX, and accessibility improvements." },
                { icon: Target, title: "Conversion Optimization", desc: "A/B testing, CTA optimization, funnel analysis, and landing page improvements." },
                { icon: Globe, title: "Content Strategy", desc: "AI-powered content creation, topic clusters, and authority building." },
                { icon: BarChart3, title: "Analytics & Reporting", desc: "GA4 setup, conversion tracking, monthly reports, and ROI measurement." },
                { icon: Zap, title: "AI-Powered Analysis", desc: "CRO9 engine continuously analyzes and recommends optimizations." },
              ].map((item) => {
                const Icon = item.icon
                return (
                  <div key={item.title} className="card-lifted p-6 space-y-3">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary">
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-bold">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="py-16 md:py-24">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">SXO Plans</h2>
            <p className="text-center text-muted-foreground mb-12 max-w-xl mx-auto">
              No long-term contracts. Cancel anytime. Results from month one.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {tiers.map((tier) => (
                <div
                  key={tier.name}
                  className={`card-lifted p-6 space-y-6 ${tier.popular ? "border-primary ring-2 ring-primary/20" : ""}`}
                >
                  {tier.popular && (
                    <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-bold">
                      Most Popular
                    </div>
                  )}
                  <div>
                    <h3 className="text-xl font-bold">{tier.name}</h3>
                    <div className="mt-2">
                      <span className="text-4xl font-bold text-primary">{tier.price}</span>
                    </div>
                  </div>
                  <ul className="space-y-3">
                    {tier.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Button className="w-full" variant={tier.popular ? "default" : "outline"} asChild>
                    <Link href="/contact">
                      Get Started <ArrowRight className="ml-1.5 w-4 h-4" />
                    </Link>
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16 md:py-24 bg-card/50">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Frequently Asked Questions</h2>
            <div className="max-w-3xl mx-auto space-y-6">
              {faqs.map((faq) => (
                <div key={faq.question} className="card-lifted p-6">
                  <h3 className="text-lg font-bold mb-3">{faq.question}</h3>
                  <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 md:py-24">
          <div className="container px-4 md:px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Get Your Free SXO Audit</h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
              Find out exactly where your site is losing traffic and conversions. No commitment required.
            </p>
            <Button size="lg" className="text-lg px-8 py-6" asChild>
              <Link href="/contact">
                Request Free Audit <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}
