import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import Footer from "@/components/footer"
import { FAQSchema, BreadcrumbSchema } from "@/components/seo/json-ld"
import ServicesConversion from "./ServicesConversion"

export const metadata: Metadata = {
  title: "Services — Web Design, AI Automation, CRM & SEO",
  description:
    "All RocketOpp services: web design and development, CRM automation, AI automation, SXO, PPC and MCP integration. Fixed quotes, no discovery calls.",
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
      images: [{ url: 'https://rocketopp.com/api/og?title=Services%20%26%20Pricing&eyebrow=Services', width: 1200, height: 630, alt: "Services & Pricing" }],
    title: "Services & Pricing | RocketOpp",
    description: "Transparent pricing for all services. No hidden fees. No discovery calls.",
    url: "https://rocketopp.com/services",
    type: "website",
  },
  alternates: { canonical: "https://rocketopp.com/services" },
}

const faqs = [
  {
    question: "What services does RocketOpp offer?",
    answer:
      "We offer six core services: Website Development, AI Business Automation, SXO/Search Experience Optimization, CRM Automation, PPC & Paid Ads Management, and MCP Server Integration. All powered by 0nMCP and CRO9. Each project is quoted individually — tell us what you need and you get a fixed price.",
  },
  {
    question: "Why is RocketOpp cheaper than other agencies?",
    answer:
      "We build on 0nMCP — our AI orchestration platform with 1,640+ pre-built tools across 111 services. Instead of building everything from scratch, we configure and connect proven systems. Our AI-native process eliminates the overhead that drives agency pricing up.",
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
        {/* Interactive, high-conversion hero + services grid (client) */}
        <ServicesConversion />

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
