import Footer from "@/components/footer"
import { Rocket, Zap, Terminal, MessageSquare, Workflow, Database, CreditCard, ShoppingCart, Users, Brain, CheckCircle2, ArrowRight, Copy } from "lucide-react"
import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Rocket MCP - AI-Powered CRM Automation Server | Model Context Protocol",
  description: "Rocket MCP (Rocket+ MCP) is the AI-powered workflow orchestration hub. Connect Claude to your CRM with 56+ tools for contacts, courses, content, and marketing automation. Natural language control over Stripe, Shopify, GHL, and more.",
  keywords: [
    "rocket mcp",
    "rocket plus mcp",
    "rocket+ mcp",
    "mcp server",
    "model context protocol",
    "claude mcp",
    "crm mcp",
    "ghl mcp",
    "workflow automation mcp",
    "ai crm automation",
    "claude desktop mcp",
    "mcp tools",
    "natural language crm",
    "ai workflow builder"
  ].join(", "),
  alternates: {
    canonical: "https://rocketopp.com/rocket-mcp",
  },
  openGraph: {
    title: "Rocket MCP - AI-Powered CRM Automation Server",
    description: "Connect Claude to your CRM with 56+ tools. Natural language control over contacts, workflows, Stripe, Shopify, and more.",
    url: "https://rocketopp.com/rocket-mcp",
    type: "website",
    images: [
      {
        url: "https://rocketopp.com/images/rocket-mcp-og.png",
        width: 1200,
        height: 630,
        alt: "Rocket MCP - AI Workflow Orchestration"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Rocket MCP - AI-Powered CRM Automation",
    description: "Connect Claude to your CRM with 56+ tools. Natural language workflow automation."
  }
}

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Rocket MCP",
  "alternateName": ["Rocket+ MCP", "Rocket Plus MCP"],
  "applicationCategory": "BusinessApplication",
  "operatingSystem": "Cross-platform",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  },
  "description": "AI-powered CRM automation with 56+ tools for contacts, content, courses, workflows, and marketing. Natural language control over your business.",
  "url": "https://rocketopp.com/rocket-mcp",
  "publisher": {
    "@type": "Organization",
    "name": "RocketOpp"
  }
}

export default function RocketMcpPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="flex min-h-screen flex-col bg-background text-foreground">
        <main className="flex-grow">
          {/* Hero Section */}
          <section className="py-24 md:py-32 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-orange-500/5" />
            <div className="container mx-auto px-4 relative">
              <div className="max-w-4xl mx-auto text-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-8">
                  <Terminal className="w-4 h-4" />
                  Model Context Protocol Server
                </div>
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight mb-6">
                  <span className="bg-gradient-to-r from-primary via-orange-400 to-red-500 bg-clip-text text-transparent">Rocket MCP</span>
                  <br />
                  <span className="text-foreground">Talk to Your CRM</span>
                </h1>
                <p className="text-xl text-muted-foreground leading-relaxed mb-8 max-w-2xl mx-auto">
                  The AI-powered workflow orchestration hub. Connect Claude to your CRM, Stripe, Shopify,
                  and more with <strong>56+ tools</strong>. Just describe what you want.
                </p>

                {/* Quick Install */}
                <div className="bg-card border border-border rounded-xl p-6 max-w-xl mx-auto mb-8">
                  <p className="text-sm text-muted-foreground mb-3">Install with one command:</p>
                  <div className="flex items-center gap-2 bg-muted rounded-lg p-3 font-mono text-sm">
                    <code className="flex-1 text-left">npx -y rocket-plus-mcp</code>
                    <button className="p-2 hover:bg-background rounded transition-colors" title="Copy">
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    href="https://rocketadd.com/docs/integrations/mcp"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors"
                  >
                    Get Started Free
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link
                    href="https://github.com/Crypto-Goatz/rocket-plus-mcp"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-card border border-border rounded-lg font-semibold hover:bg-muted transition-colors"
                  >
                    View on GitHub
                  </Link>
                </div>
              </div>
            </div>
          </section>

          {/* What You Can Say Section */}
          <section className="py-16 md:py-24 bg-muted/30">
            <div className="container mx-auto px-4">
              <div className="max-w-5xl mx-auto">
                <h2 className="text-3xl sm:text-4xl font-bold text-center mb-4">
                  Just Say What You Want
                </h2>
                <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
                  No coding. No complex workflows. Just tell Claude what you need in plain English.
                </p>

                <div className="grid md:grid-cols-2 gap-6">
                  {[
                    { icon: Users, text: "Get my last 10 leads", desc: "Instantly retrieve contacts from your CRM" },
                    { icon: Brain, text: "Create a course about email marketing", desc: "Generate complete courses with AI" },
                    { icon: MessageSquare, text: "Send a follow-up SMS to John", desc: "Message contacts directly" },
                    { icon: Workflow, text: "Run my welcome workflow", desc: "Execute multi-step automations" },
                    { icon: CreditCard, text: "When Stripe payment → add to CRM", desc: "Chain actions across services" },
                    { icon: ShoppingCart, text: "Shopify order → welcome email → tag VIP", desc: "Build complex sequences" },
                  ].map((item, i) => (
                    <div key={i} className="flex gap-4 p-6 bg-card border border-border rounded-xl">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <item.icon className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-mono text-sm text-primary mb-1">"{item.text}"</p>
                        <p className="text-sm text-muted-foreground">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* How It Works */}
          <section className="py-16 md:py-24">
            <div className="container mx-auto px-4">
              <div className="max-w-5xl mx-auto">
                <h2 className="text-3xl sm:text-4xl font-bold text-center mb-4">
                  Multi-MCP Workflow Orchestration
                </h2>
                <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
                  Rocket MCP is the central hub that connects all your services. Build workflows that chain
                  actions across Stripe, Shopify, your CRM, and more - all from a single endpoint.
                </p>

                {/* Architecture Diagram */}
                <div className="bg-card border border-border rounded-2xl p-8 mb-12">
                  <div className="grid md:grid-cols-3 gap-8 items-center">
                    <div className="space-y-4">
                      <h3 className="font-semibold text-center mb-4">Connected Services</h3>
                      {[
                        { name: "Stripe", icon: CreditCard },
                        { name: "Shopify", icon: ShoppingCart },
                        { name: "Supabase", icon: Database },
                        { name: "GHL CRM", icon: Users },
                      ].map((service, i) => (
                        <div key={i} className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                          <service.icon className="w-5 h-5 text-muted-foreground" />
                          <span className="text-sm">{service.name}</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex flex-col items-center">
                      <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary to-orange-500 flex items-center justify-center mb-4">
                        <Rocket className="w-12 h-12 text-white" />
                      </div>
                      <h3 className="font-bold text-lg">Rocket MCP</h3>
                      <p className="text-sm text-muted-foreground text-center">Orchestration Hub</p>
                    </div>

                    <div className="space-y-4">
                      <h3 className="font-semibold text-center mb-4">AI Clients</h3>
                      {[
                        "Claude Desktop",
                        "Claude Code",
                        "Any MCP Client",
                        "Custom Integrations",
                      ].map((client, i) => (
                        <div key={i} className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                          <Terminal className="w-5 h-5 text-muted-foreground" />
                          <span className="text-sm">{client}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Single Endpoint */}
                <div className="text-center">
                  <h3 className="text-xl font-bold mb-4">One Endpoint. Unlimited Automations.</h3>
                  <p className="text-muted-foreground max-w-2xl mx-auto">
                    Create a workflow once, call it from anywhere. When triggered, Rocket MCP executes
                    the entire sequence - contacting multiple services, chaining actions, and handling
                    errors automatically.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* 56+ Tools */}
          <section className="py-16 md:py-24 bg-muted/30">
            <div className="container mx-auto px-4">
              <div className="max-w-5xl mx-auto">
                <h2 className="text-3xl sm:text-4xl font-bold text-center mb-4">
                  56+ Tools Built In
                </h2>
                <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
                  Everything you need to automate your business, accessible through natural language.
                </p>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[
                    {
                      title: "CRM & Contacts",
                      tools: ["get_contacts", "create_contact", "send_sms", "send_email", "add_tags"],
                      icon: Users
                    },
                    {
                      title: "Workflow Orchestration",
                      tools: ["run_workflow", "create_workflow", "list_workflows", "rocketflow_deploy"],
                      icon: Workflow
                    },
                    {
                      title: "AI Course Generator",
                      tools: ["course_generate", "course_outline", "course_import"],
                      icon: Brain
                    },
                    {
                      title: "Content Creation",
                      tools: ["content_generate", "content_rewrite", "content_ideas"],
                      icon: MessageSquare
                    },
                    {
                      title: "Sales & Pipeline",
                      tools: ["get_opportunities", "create_opportunity", "move_stage"],
                      icon: CreditCard
                    },
                    {
                      title: "AI Agents & Skills",
                      tools: ["agent_execute", "skillforge_execute", "lead_qualifier"],
                      icon: Zap
                    },
                  ].map((category, i) => (
                    <div key={i} className="p-6 bg-card border border-border rounded-xl">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <category.icon className="w-5 h-5 text-primary" />
                        </div>
                        <h3 className="font-bold">{category.title}</h3>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {category.tools.map((tool, j) => (
                          <span key={j} className="text-xs font-mono px-2 py-1 bg-muted rounded">
                            {tool}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <p className="text-center text-sm text-muted-foreground mt-8">
                  Plus SEO analysis, market research, dashboard builder, A/B testing, RSS automation, and more.
                </p>
              </div>
            </div>
          </section>

          {/* Quick Start */}
          <section className="py-16 md:py-24">
            <div className="container mx-auto px-4">
              <div className="max-w-3xl mx-auto">
                <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12">
                  Get Started in 2 Minutes
                </h2>

                <div className="space-y-8">
                  {[
                    {
                      step: "1",
                      title: "Get Your API Key",
                      desc: "Sign up at rocketadd.com and generate an MCP API key from Settings.",
                      link: { text: "Get API Key →", href: "https://rocketadd.com/settings" }
                    },
                    {
                      step: "2",
                      title: "Configure Claude",
                      desc: "Add Rocket MCP to your Claude Desktop or Claude Code configuration.",
                      code: `{
  "mcpServers": {
    "rocket-plus": {
      "command": "npx",
      "args": ["-y", "rocket-plus-mcp"],
      "env": {
        "ROCKET_API_KEY": "rp_your_key_here"
      }
    }
  }
}`
                    },
                    {
                      step: "3",
                      title: "Start Talking",
                      desc: "That's it! Ask Claude to get your contacts, create a course, or run a workflow."
                    }
                  ].map((item, i) => (
                    <div key={i} className="flex gap-6">
                      <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg flex-shrink-0">
                        {item.step}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                        <p className="text-muted-foreground mb-3">{item.desc}</p>
                        {item.code && (
                          <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm font-mono">
                            {item.code}
                          </pre>
                        )}
                        {item.link && (
                          <Link href={item.link.href} className="text-primary hover:underline">
                            {item.link.text}
                          </Link>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Pricing Teaser */}
          <section className="py-16 md:py-24 bg-muted/30">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto text-center">
                <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                  Free to Start. Scale When Ready.
                </h2>
                <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
                  Get 100 free API calls per month. Upgrade when you need more.
                </p>

                <div className="grid sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
                  {[
                    { plan: "Free", calls: "100/mo", price: "$0" },
                    { plan: "Starter", calls: "1,000/mo", price: "$29" },
                    { plan: "Growth", calls: "10,000/mo", price: "$79" },
                  ].map((tier, i) => (
                    <div key={i} className="p-6 bg-card border border-border rounded-xl">
                      <h3 className="font-bold mb-1">{tier.plan}</h3>
                      <p className="text-2xl font-bold text-primary">{tier.price}</p>
                      <p className="text-sm text-muted-foreground">{tier.calls}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* FAQ for SEO */}
          <section className="py-16 md:py-24">
            <div className="container mx-auto px-4">
              <div className="max-w-3xl mx-auto">
                <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12">
                  Frequently Asked Questions
                </h2>

                <div className="space-y-6">
                  {[
                    {
                      q: "What is Rocket MCP?",
                      a: "Rocket MCP (also called Rocket+ MCP or Rocket Plus MCP) is a Model Context Protocol server that connects AI assistants like Claude to your CRM and business tools. It provides 56+ tools for managing contacts, creating content, running workflows, and automating marketing tasks using natural language."
                    },
                    {
                      q: "How does Rocket MCP work with Claude?",
                      a: "Rocket MCP runs locally on your machine and connects to Claude Desktop or Claude Code via the Model Context Protocol. When you ask Claude to perform a task like 'get my leads' or 'create a course', Claude uses the Rocket MCP tools to execute the action through your connected services."
                    },
                    {
                      q: "What services can Rocket MCP connect to?",
                      a: "Rocket MCP acts as an orchestration hub connecting to multiple services including your CRM (GHL), Stripe, Shopify, Supabase, Vercel, and more. Workflows can chain actions across all connected services from a single endpoint."
                    },
                    {
                      q: "Is Rocket MCP free?",
                      a: "Yes! Rocket MCP includes 100 free API calls per month. You can upgrade to paid plans for more usage. The npm package itself is open source and free to install."
                    },
                    {
                      q: "What's the difference between Rocket MCP and other MCP servers?",
                      a: "Rocket MCP is specifically designed for CRM and marketing automation. Unlike generic MCP servers, it includes workflow orchestration that can chain multiple services together, AI-powered content and course generation, and deep integration with CRM features like contacts, pipelines, and messaging."
                    }
                  ].map((faq, i) => (
                    <div key={i} className="border-b border-border pb-6">
                      <h3 className="font-bold text-lg mb-2">{faq.q}</h3>
                      <p className="text-muted-foreground">{faq.a}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Final CTA */}
          <section className="py-16 md:py-24 bg-gradient-to-br from-primary/10 via-transparent to-orange-500/10">
            <div className="container mx-auto px-4 text-center">
              <h2 className="text-3xl sm:text-4xl font-bold mb-6">
                Ready to Automate?
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
                Install Rocket MCP and start talking to your CRM in plain English.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="https://rocketadd.com/docs/integrations/mcp"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors"
                >
                  Get Started Free
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  href="https://www.npmjs.com/package/rocket-plus-mcp"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-card border border-border rounded-lg font-semibold hover:bg-muted transition-colors"
                >
                  View on npm
                </Link>
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </>
  )
}
