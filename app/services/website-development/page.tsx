import type { Metadata } from "next"
import Link from "next/link"
import { Globe, CheckCircle, ArrowRight, Clock, Smartphone, Zap, Search, Shield, Palette, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ServiceOfferSchema, FAQSchema, BreadcrumbSchema } from "@/components/seo/json-ld"
import Footer from "@/components/footer"

export const metadata: Metadata = {
  title: "Website Development — What's Included & How We Build",
  description:
    "Professional website development from $2,497. Custom websites built with AI, launched in 2 weeks. Mobile-first, SEO-optimized, conversion-focused. See pricing and what's included.",
  keywords: [
    "cost for website design",
    "website development pricing",
    "how much does a website cost",
    "professional website cost",
    "custom website development",
    "affordable website design",
    "Next.js website development",
    "responsive web design cost",
    "e-commerce website pricing",
    "website development agency",
  ],
  openGraph: {
    title: "Website Development — What's Included | RocketOpp",
    description: "Professional websites from $2,497. Launched in 2 weeks. See exactly what's included.",
    url: "https://rocketopp.com/services/website-development",
  },
  alternates: { canonical: "https://rocketopp.com/services/website-development" },
}

const tiers = [
  {
    name: "Professional Website",
    price: "$2,497",
    timeline: "2 weeks",
    features: [
      "Custom design (up to 8 pages)",
      "Mobile-first responsive layout",
      "SEO optimization & meta tags",
      "Contact forms & lead capture",
      "Analytics integration (GA4)",
      "SSL certificate & hosting setup",
      "CMS for content editing",
      "1 month of support",
    ],
  },
  {
    name: "E-Commerce Store",
    price: "$4,997",
    timeline: "3 weeks",
    popular: true,
    features: [
      "Everything in Professional",
      "Product catalog (unlimited SKUs)",
      "Stripe/PayPal checkout",
      "Inventory management",
      "Order tracking & notifications",
      "Customer accounts & wishlists",
      "Abandoned cart recovery",
      "3 months of support",
    ],
  },
  {
    name: "Full Digital Presence",
    price: "$7,997",
    timeline: "4 weeks",
    features: [
      "Everything in E-Commerce",
      "Blog & content marketing setup",
      "Email marketing integration",
      "CRM automation setup",
      "Social media integration",
      "AI chatbot integration",
      "SXO audit & optimization",
      "6 months of support",
    ],
  },
]

const faqs = [
  {
    question: "How much does a professional website cost in 2026?",
    answer:
      "Industry average for a professional website is $5,000 - $15,000. At RocketOpp, professional websites start at $2,497 because our AI-powered workflow (0nMCP) reduces development time by 60-70%. You get enterprise quality at a fraction of the cost.",
  },
  {
    question: "How long does it take to build a website?",
    answer:
      "Traditional agencies take 2-4 months. We deliver professional websites in 2 weeks, e-commerce stores in 3 weeks, and full digital presence packages in 4 weeks. Our AI-native process eliminates the bottlenecks that slow down traditional agencies.",
  },
  {
    question: "What technology do you use for websites?",
    answer:
      "We build with Next.js, React, and Tailwind CSS — the same stack used by Vercel, Netflix, and major tech companies. Sites are deployed on Vercel for instant global CDN, automatic HTTPS, and 99.99% uptime.",
  },
  {
    question: "Do you offer ongoing maintenance?",
    answer:
      "Yes. All packages include initial support (1-6 months depending on tier). After that, we offer monthly maintenance plans starting at $197/month that include updates, security patches, performance monitoring, and content changes.",
  },
  {
    question: "Can I update the website content myself?",
    answer:
      "Absolutely. Every website includes a CMS (content management system) that lets you update text, images, blog posts, and products without touching code. We provide training and documentation so your team is self-sufficient from day one.",
  },
]

export default function WebsiteDevelopmentPage() {
  return (
    <>
      <ServiceOfferSchema
        name="Professional Website Development"
        description="Custom website development with AI-powered workflow. Mobile-first, SEO-optimized, conversion-focused websites delivered in 2 weeks."
        serviceType="Website Development"
        url="https://rocketopp.com/services/website-development"
        price={2497}
      />
      <FAQSchema items={faqs} />
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "https://rocketopp.com" },
          { name: "Services", url: "https://rocketopp.com/services" },
          { name: "Website Development", url: "https://rocketopp.com/services/website-development" },
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
                <Clock className="w-4 h-4" />
                Ships in 2 weeks
              </div>
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Website Development — Pricing & What&apos;s Included
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
                Custom websites built with AI. Mobile-first, SEO-optimized, conversion-focused. Launches in 2 weeks, not 2 months. Starting at <span className="text-primary font-bold">$2,497</span>.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="text-lg px-8 py-6" asChild>
                  <Link href="/contact">
                    Get Started <ArrowRight className="ml-2 w-5 h-5" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="text-lg px-8 py-6" asChild>
                  <a href="#pricing">See Pricing</a>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* What you get */}
        <section className="py-16 md:py-24 bg-card/50">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">What You Get</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {[
                { icon: Palette, title: "Custom Design", desc: "Unique, branded design tailored to your business. No templates." },
                { icon: Smartphone, title: "Mobile-First", desc: "Looks perfect on every device. 60%+ of traffic is mobile." },
                { icon: Search, title: "SEO Built In", desc: "Schema markup, meta tags, sitemap, Core Web Vitals optimized." },
                { icon: Zap, title: "Lightning Fast", desc: "Sub-second load times with Next.js and global CDN deployment." },
                { icon: Shield, title: "Secure & Reliable", desc: "HTTPS, DDoS protection, 99.99% uptime on Vercel." },
                { icon: ShoppingBag, title: "E-Commerce Ready", desc: "Stripe checkout, inventory management, order tracking." },
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

        {/* Pricing Tiers */}
        <section id="pricing" className="py-16 md:py-24">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">Pricing</h2>
            <p className="text-center text-muted-foreground mb-12 max-w-xl mx-auto">
              Pick the package that fits. No hidden fees. No surprises.
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
                    <div className="mt-1 inline-flex items-center gap-1.5 text-sm text-muted-foreground">
                      <Clock className="w-3.5 h-3.5" />
                      Ships in {tier.timeline}
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
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Launch Your Website?</h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
              Stop paying agency markups. Get a professional website in 2 weeks for $2,497.
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
