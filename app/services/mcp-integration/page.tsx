import type { Metadata } from "next"
import Link from "next/link"
import { Terminal, CheckCircle, ArrowRight, Clock, Zap, Shield, Globe, Cpu, Workflow, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ServiceOfferSchema, FAQSchema, BreadcrumbSchema } from "@/components/seo/json-ld"
import Footer from "@/components/footer"

export const metadata: Metadata = {
  title: "MCP Server Integration - Pricing & What's Included | RocketOpp",
  description:
    "MCP server integration from $1,997. Connect your business to 1,171+ AI tools across 54 services. One integration, unlimited automation. Delivered in 1 week. Powered by 0nMCP.",
  keywords: [
    "MCP server integration",
    "AI API integration cost",
    "Model Context Protocol",
    "MCP server setup",
    "AI tool integration",
    "business API integration",
    "0nMCP integration",
    "AI orchestration",
    "multi-service API integration",
    "AI infrastructure setup",
  ],
  openGraph: {
    title: "MCP Server Integration - Pricing & What's Included | RocketOpp",
    description: "Connect to 1,171+ AI tools across 54 services. One integration from $1,997.",
    url: "https://rocketopp.com/services/mcp-integration",
  },
  alternates: { canonical: "https://rocketopp.com/services/mcp-integration" },
}

const tiers = [
  {
    name: "MCP Starter",
    price: "$1,997",
    timeline: "1 week",
    features: [
      "0nMCP server deployment",
      "Connect up to 5 services",
      "Basic workflow automation",
      "Credential vault setup",
      "Claude Desktop / Cursor integration",
      "API documentation",
      "Security configuration",
      "1 month of support",
    ],
  },
  {
    name: "MCP Professional",
    price: "$3,997",
    timeline: "2 weeks",
    popular: true,
    features: [
      "Everything in Starter",
      "Connect up to 20 services",
      "Custom workflow creation",
      "HTTP server mode (webhooks)",
      "CRM integration (245 tools)",
      "Vault container system",
      "AI employee setup",
      "3 months of support",
    ],
  },
  {
    name: "MCP Enterprise",
    price: "$7,997",
    timeline: "3 weeks",
    features: [
      "Everything in Professional",
      "All 54 services (1,171 tools)",
      "Zero-Knowledge Capability Proxy",
      "Deed transfer system",
      "Multi-agent orchestration",
      "Custom tool development",
      "On-premise deployment option",
      "12 months of support",
    ],
  },
]

const faqs = [
  {
    question: "What is MCP (Model Context Protocol) and why do I need it?",
    answer:
      "MCP is an open protocol that lets AI assistants connect to external tools and data sources. 0nMCP is our implementation with 1,171 pre-built tools across 54 services. Instead of building individual API integrations, you get one system that connects to everything — CRM, Stripe, Slack, Gmail, GitHub, Shopify, and 48 more.",
  },
  {
    question: "How much does AI API integration normally cost?",
    answer:
      "Custom API integration typically costs $3,000 - $10,000 per service. With 0nMCP, you get access to 54 services through a single integration starting at $1,997. That's 54 integrations for the price of one — because the connections are pre-built and battle-tested.",
  },
  {
    question: "What services does 0nMCP connect to?",
    answer:
      "0nMCP connects to 54 services including: CRM (245 tools), Stripe, SendGrid, Slack, Discord, Twilio, GitHub, Shopify, OpenAI, Anthropic, Gmail, Google Sheets, Google Drive, Airtable, Notion, MongoDB, Supabase, Zendesk, Jira, HubSpot, Mailchimp, Calendly, Zoom, Linear, Microsoft, Cloudflare, GoDaddy, and more.",
  },
  {
    question: "Is my data secure with MCP?",
    answer:
      "Security is built into every layer. 0nMCP includes the Zero-Knowledge Capability Proxy (v2.4.0) where all API calls route through a credential-wiping proxy. The Vault system uses AES-256-GCM encryption with hardware fingerprint binding. Vault containers have 7 semantic layers with Argon2id double-encryption for credentials.",
  },
  {
    question: "Can I use 0nMCP with Claude, ChatGPT, or other AI tools?",
    answer:
      "Yes. 0nMCP generates configuration files for 7 AI platforms: Claude Desktop, Cursor, Windsurf, Gemini, Continue, Cline, and OpenAI. It works as a stdio MCP server or HTTP server — compatible with any MCP-enabled AI tool.",
  },
]

export default function MCPIntegrationPage() {
  return (
    <>
      <ServiceOfferSchema
        name="MCP Server Integration"
        description="Connect your business to 1,171+ AI tools across 54 services with 0nMCP. One integration, unlimited automation."
        serviceType="MCP Server Integration"
        url="https://rocketopp.com/services/mcp-integration"
        price={1997}
      />
      <FAQSchema items={faqs} />
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "https://rocketopp.com" },
          { name: "Services", url: "https://rocketopp.com/services" },
          { name: "MCP Integration", url: "https://rocketopp.com/services/mcp-integration" },
        ]}
      />

      <main className="min-h-screen">
        <section className="pt-24 pb-16 md:pt-32 md:pb-20 relative overflow-hidden">
          <div className="absolute inset-0 grid-background opacity-20" />
          <div className="absolute inset-0 grid-gradient" />
          <div className="container relative z-10 px-4 md:px-6">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/5 text-sm font-medium text-primary mb-6">
                <Clock className="w-4 h-4" />
                Ships in 1 week
              </div>
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                MCP Server Integration — Pricing & What&apos;s Included
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
                Connect your business to <span className="text-primary font-bold">1,171+ tools</span> across <span className="text-primary font-bold">54 services</span>. One integration, unlimited automation. Starting at <span className="text-primary font-bold">$1,997</span>.
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

        <section className="py-16 md:py-24 bg-card/50">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">What 0nMCP Gives You</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {[
                { icon: Globe, title: "54 Services Connected", desc: "CRM, Stripe, Slack, Gmail, GitHub, Shopify, and 48 more — all through one integration." },
                { icon: Terminal, title: "1,171 AI Tools", desc: "Pre-built tools for contacts, payments, messaging, code, analytics, and more." },
                { icon: Workflow, title: "Workflow Automation", desc: "Chain tools together into automated workflows. Pipeline, Assembly Line, and Radial Burst execution." },
                { icon: Lock, title: "Vault Security", desc: "AES-256-GCM encryption, hardware fingerprint binding, Zero-Knowledge Capability Proxy." },
                { icon: Cpu, title: "AI Platform Ready", desc: "Works with Claude Desktop, Cursor, Windsurf, Gemini, Continue, Cline, and OpenAI." },
                { icon: Shield, title: "Patent-Pending", desc: "0nVault Container System (US #63/990,046) with Seal of Truth integrity verification." },
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
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">Pricing</h2>
            <p className="text-center text-muted-foreground mb-12 max-w-xl mx-auto">
              From 5-service setup to full 54-service enterprise deployment.
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
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Connect Everything. Automate Everything.</h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
              1,171 tools. 54 services. One integration. Starting at $1,997.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="text-lg px-8 py-6" asChild>
                <Link href="/contact">
                  Get Started Today <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-6" asChild>
                <a href="https://0nmcp.com" target="_blank" rel="noopener noreferrer">
                  Learn about 0nMCP
                </a>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}
