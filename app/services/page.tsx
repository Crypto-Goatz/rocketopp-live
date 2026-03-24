import type { Metadata } from "next"
import Link from "next/link"
import { Globe, Cpu, Search, Target, BarChart3, Terminal, ArrowRight, Clock, DollarSign } from "lucide-react"
import { Button } from "@/components/ui/button"
import Footer from "@/components/footer"
import { FAQSchema, BreadcrumbSchema } from "@/components/seo/json-ld"

export const metadata: Metadata = {
  title: "Services & Pricing | RocketOpp - Transparent Digital Agency",
  description:
    "All RocketOpp services with transparent pricing. Websites from $2,497. CRM from $1,497. AI automation from $2,997. SXO from $997/mo. PPC from $797/mo. MCP integration from $1,997.",
  keywords: [
    "digital agency pricing",
    "website development cost",
    "AI automation pricing",
    "CRM setup cost",
    "SEO pricing",
    "PPC management cost",
    "transparent agency pricing",
    "affordable digital services",
  ],
  openGraph: {
    title: "Services & Pricing | RocketOpp",
    description: "Transparent pricing for all services. No hidden fees. No discovery calls.",
    url: "https://rocketopp.com/services",
    type: "website",
  },
  alternates: { canonical: "https://rocketopp.com/services" },
}

const services = [
  {
    icon: Globe,
    title: "Website Development",
    description: "Custom websites built with AI. Mobile-first, SEO-optimized, conversion-focused.",
    price: "From $2,497",
    shipsIn: "2 weeks",
    href: "/services/website-development",
  },
  {
    icon: Cpu,
    title: "AI Business Automation",
    description: "Custom AI systems — customer service, lead qualification, content creation, workflow automation.",
    price: "From $2,997",
    shipsIn: "2 weeks",
    href: "/services/ai-automation",
  },
  {
    icon: Search,
    title: "SXO (Search Experience Optimization)",
    description: "SEO + UX + conversion optimization, powered by CRO9. Rankings that convert.",
    price: "From $997/mo",
    shipsIn: "Ongoing",
    href: "/services/sxo",
  },
  {
    icon: Target,
    title: "CRM Automation",
    description: "Full CRM deployment with pipelines, email sequences, booking, and lead scoring.",
    price: "From $1,497",
    shipsIn: "1 week",
    href: "/services/crm-automation",
  },
  {
    icon: BarChart3,
    title: "PPC & Paid Ads",
    description: "Google Ads, Meta Ads, LinkedIn Ads — managed by AI, optimized by CRO9.",
    price: "From $797/mo",
    shipsIn: "Ongoing",
    href: "/services/ppc-management",
  },
  {
    icon: Terminal,
    title: "MCP Server Integration",
    description: "Connect to 1,171+ AI tools across 54 services. One integration, unlimited automation.",
    price: "From $1,997",
    shipsIn: "1 week",
    href: "/services/mcp-integration",
  },
]

const faqs = [
  {
    question: "What services does RocketOpp offer?",
    answer:
      "We offer six core services: Website Development (from $2,497), AI Business Automation (from $2,997), SXO/Search Experience Optimization (from $997/mo), CRM Automation (from $1,497), PPC & Paid Ads Management (from $797/mo), and MCP Server Integration (from $1,997). All powered by 0nMCP and CRO9.",
  },
  {
    question: "Why is RocketOpp cheaper than other agencies?",
    answer:
      "We build on 0nMCP — our AI orchestration platform with 1,171 pre-built tools across 54 services. Instead of building everything from scratch, we configure and connect proven systems. Our AI-native process eliminates the overhead that drives agency pricing up.",
  },
  {
    question: "Are there any hidden fees?",
    answer:
      "No. The price on the website is the price you pay. For monthly services (SXO and PPC), ad spend and CRM subscriptions are separate and paid directly to those platforms. We never mark up third-party costs.",
  },
  {
    question: "How fast do you deliver?",
    answer:
      "CRM automation and MCP integration ship in 1 week. Websites and AI automation in 2 weeks. E-commerce in 3 weeks. Full digital presence packages in 4 weeks. SXO and PPC are ongoing with results starting immediately.",
  },
  {
    question: "Do I need a discovery call?",
    answer:
      "No. Our pricing is transparent. Pick a service, see the price, and contact us to get started. If you have questions, we are happy to chat — but we will never require a call before telling you what things cost.",
  },
]

export default function ServicesPage() {
  return (
    <>
      <FAQSchema items={faqs} />
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "https://rocketopp.com" },
          { name: "Services", url: "https://rocketopp.com/services" },
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
                <DollarSign className="w-4 h-4" />
                Transparent Pricing
              </div>
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Services & Pricing
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
                Six core services. Transparent pricing. No discovery calls required. Pick a service, see the price, and let&apos;s ship.
              </p>
            </div>
          </div>
        </section>

        {/* Services Grid */}
        <section className="py-16 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {services.map((svc) => {
                const Icon = svc.icon
                return (
                  <Link key={svc.title} href={svc.href} className="group">
                    <div className="card-lifted p-6 h-full space-y-4 group-hover:border-primary/40">
                      <div className="flex items-center justify-between">
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary">
                          <Icon className="w-6 h-6" />
                        </div>
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                          <Clock className="w-3 h-3" />
                          {svc.shipsIn}
                        </span>
                      </div>
                      <h2 className="text-xl font-bold group-hover:text-primary transition-colors">{svc.title}</h2>
                      <p className="text-sm text-muted-foreground leading-relaxed">{svc.description}</p>
                      <div className="flex items-center justify-between pt-3 border-t border-border">
                        <span className="text-lg font-bold text-primary">{svc.price}</span>
                        <span className="text-sm text-muted-foreground group-hover:text-primary transition-colors flex items-center gap-1">
                          See details <ArrowRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </div>
                  </Link>
                )
              })}
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
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
              No proposals. No discovery calls. Pick a service and let&apos;s ship.
            </p>
            <Button size="lg" className="text-lg px-8 py-6" asChild>
              <Link href="/contact">
                Contact Us <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}
