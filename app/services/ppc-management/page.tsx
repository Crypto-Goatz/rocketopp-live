import type { Metadata } from "next"
import Link from "next/link"
import { BarChart3, CheckCircle, ArrowRight, Clock, Target, TrendingUp, DollarSign, Search, Zap, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ServiceOfferSchema, FAQSchema, BreadcrumbSchema } from "@/components/seo/json-ld"
import Footer from "@/components/footer"

export const metadata: Metadata = {
  title: "PPC & Paid Ads Management - Pricing & What's Included | RocketOpp",
  description:
    "PPC management from $797/mo. Google Ads, Meta Ads, LinkedIn Ads — managed by AI, optimized by CRO9. Real ROI, not vanity metrics. See pricing and what's included.",
  keywords: [
    "PPC management cost",
    "Google Ads management pricing",
    "paid advertising agency cost",
    "PPC agency pricing",
    "Google Ads management",
    "Meta Ads management cost",
    "LinkedIn Ads management",
    "pay per click management pricing",
    "digital advertising cost",
    "paid search management",
  ],
  openGraph: {
    title: "PPC Management - Pricing & What's Included | RocketOpp",
    description: "PPC management from $797/mo. AI-optimized Google, Meta, and LinkedIn Ads.",
    url: "https://rocketopp.com/services/ppc-management",
  },
  alternates: { canonical: "https://rocketopp.com/services/ppc-management" },
}

const tiers = [
  {
    name: "PPC Starter",
    price: "$797/mo",
    adSpend: "Up to $3,000/mo ad spend",
    features: [
      "Google Ads management",
      "Keyword research & targeting",
      "Ad copy creation (3 variations)",
      "Landing page recommendations",
      "Bid optimization",
      "Monthly performance report",
      "Conversion tracking setup",
      "Negative keyword management",
    ],
  },
  {
    name: "PPC Growth",
    price: "$1,497/mo",
    adSpend: "Up to $10,000/mo ad spend",
    popular: true,
    features: [
      "Everything in Starter",
      "Google + Meta Ads",
      "A/B testing (ads + landing pages)",
      "Remarketing campaigns",
      "Audience segmentation",
      "CRO9 conversion optimization",
      "Bi-weekly strategy calls",
      "Competitor ad analysis",
    ],
  },
  {
    name: "PPC Enterprise",
    price: "$2,997/mo",
    adSpend: "Up to $50,000/mo ad spend",
    features: [
      "Everything in Growth",
      "Google + Meta + LinkedIn Ads",
      "YouTube video ad campaigns",
      "AI-powered bid automation",
      "Multi-funnel attribution",
      "Custom dashboard & reporting",
      "Weekly strategy calls",
      "Dedicated account manager",
    ],
  },
]

const faqs = [
  {
    question: "How much does PPC management cost?",
    answer:
      "Industry average for PPC management is $1,500 - $5,000/month (plus ad spend). RocketOpp starts at $797/month because our CRO9 AI engine automates much of the optimization, bid management, and analysis that traditional agencies do manually.",
  },
  {
    question: "Is ad spend included in the management fee?",
    answer:
      "No, ad spend is separate from the management fee. Your ad budget goes directly to Google, Meta, or LinkedIn. Our management fee covers strategy, optimization, reporting, and all the work that makes your ad spend effective. This is industry standard.",
  },
  {
    question: "How long until I see results from PPC?",
    answer:
      "PPC delivers results faster than any other marketing channel. You can see traffic within hours of launching. Meaningful conversion data typically appears within 2-4 weeks. Full campaign optimization (best ROAS) usually takes 6-8 weeks as our AI learns what converts.",
  },
  {
    question: "What ROAS (Return on Ad Spend) can I expect?",
    answer:
      "Results vary by industry and competition, but our average client sees 3-5x ROAS within 3 months. E-commerce clients often see 5-8x. We optimize for revenue, not clicks — every dollar of ad spend is tracked to actual business outcomes.",
  },
  {
    question: "Can I pause or cancel at any time?",
    answer:
      "Yes. No long-term contracts. You can pause or cancel with 30 days notice. We believe results should keep you, not contracts. All ad account ownership and data stays with you — we never hold your accounts hostage.",
  },
]

export default function PPCManagementPage() {
  return (
    <>
      <ServiceOfferSchema
        name="PPC & Paid Ads Management"
        description="Google Ads, Meta Ads, LinkedIn Ads management powered by AI and CRO9 conversion optimization. Real ROI, not vanity metrics."
        serviceType="PPC Management"
        url="https://rocketopp.com/services/ppc-management"
        price={797}
        priceUnit="MONTH"
      />
      <FAQSchema items={faqs} />
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "https://rocketopp.com" },
          { name: "Services", url: "https://rocketopp.com/services" },
          { name: "PPC Management", url: "https://rocketopp.com/services/ppc-management" },
        ]}
      />

      <main className="min-h-screen">
        <section className="pt-24 pb-16 md:pt-32 md:pb-20 relative overflow-hidden">
          <div className="absolute inset-0 grid-background opacity-20" />
          <div className="absolute inset-0 grid-gradient" />
          <div className="container relative z-10 px-4 md:px-6">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/5 text-sm font-medium text-primary mb-6">
                <TrendingUp className="w-4 h-4" />
                Optimized by CRO9
              </div>
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                PPC & Paid Ads — Pricing & What&apos;s Included
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
                Google Ads, Meta Ads, LinkedIn Ads — managed by AI, optimized by CRO9. Real ROI, not vanity metrics. Starting at <span className="text-primary font-bold">$797/mo</span>.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="text-lg px-8 py-6" asChild>
                  <Link href="/contact">
                    Get Started <ArrowRight className="ml-2 w-5 h-5" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="text-lg px-8 py-6" asChild>
                  <a href="#pricing">See Plans</a>
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24 bg-card/50">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">What We Manage</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {[
                { icon: Search, title: "Google Search Ads", desc: "Keyword-targeted ads that show when customers are actively searching for your services." },
                { icon: Eye, title: "Meta Ads", desc: "Facebook and Instagram ads with advanced audience targeting and lookalike audiences." },
                { icon: Target, title: "LinkedIn Ads", desc: "B2B targeting by job title, company size, and industry. Perfect for professional services." },
                { icon: TrendingUp, title: "AI Bid Optimization", desc: "CRO9 continuously adjusts bids to maximize conversions at the lowest cost per acquisition." },
                { icon: DollarSign, title: "ROAS Tracking", desc: "Every dollar tracked from click to conversion. Know exactly what your ads are returning." },
                { icon: Zap, title: "Remarketing", desc: "Re-engage visitors who didn't convert. Show targeted ads across Google and social platforms." },
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

        <section id="pricing" className="py-16 md:py-24">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">PPC Plans</h2>
            <p className="text-center text-muted-foreground mb-12 max-w-xl mx-auto">
              No long-term contracts. Ad spend is separate and paid directly to platforms.
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
                    <div className="mt-1 text-sm text-muted-foreground">{tier.adSpend}</div>
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

        <section className="py-16 md:py-24">
          <div className="container px-4 md:px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Stop Wasting Ad Spend</h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
              AI-optimized PPC from $797/mo. Real ROI, transparent reporting, no contracts.
            </p>
            <Button size="lg" className="text-lg px-8 py-6" asChild>
              <Link href="/contact">
                Get Started Today <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}
