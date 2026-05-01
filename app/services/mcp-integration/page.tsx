import type { Metadata } from "next"
import Link from "next/link"
import { Terminal, CheckCircle, ArrowRight, Zap, Shield, Globe, Cpu, Workflow, Lock, Sparkles, ShieldCheck, AlertTriangle, Activity, GitBranch, Database, Layers } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ServiceOfferSchema, FAQSchema, BreadcrumbSchema, HowToSchema } from "@/components/seo/json-ld"
import Footer from "@/components/footer"
import BlufBlock from "@/components/sxo/bluf-block"
import IndustryVsUsTable from "@/components/sxo/industry-vs-us-table"
import ProcessTimeline from "@/components/sxo/process-timeline"
import RelatedServices from "@/components/sxo/related-services"
import UcpLiveStrip from "@/components/ucp-live-strip"

export const metadata: Metadata = {
  title: "MCP Server Integration — From $1,997 | Connect Your Business to 1,500+ Tools | RocketOpp",
  description:
    "Plug your business into 0nMCP — the largest interconnected MCP server. 1,554 tools across 96 services accessible to any AI agent in your stack. From $1,997. Ships in 1 week.",
  keywords: [
    "MCP server integration",
    "Model Context Protocol",
    "0nMCP setup",
    "AI tool orchestration",
    "MCP for business",
    "AI agent tooling",
    "Anthropic MCP",
    "Claude MCP setup",
    "MCP server for SMB",
    "AI integration platform",
    "1500 AI tools",
    "AI orchestrator",
    "agentic AI infrastructure",
    "RocketOpp MCP",
  ],
  openGraph: {
    title: "MCP Server Integration | RocketOpp",
    description: "Plug your business into 1,554 tools across 96 services. Ships in 1 week. From $1,997.",
    url: "https://rocketopp.com/services/mcp-integration",
    type: "website",
  },
  alternates: { canonical: "https://rocketopp.com/services/mcp-integration" },
}

const tiers = [
  { name: "MCP Connect", price: "$1,997", headline: "Plug in. Get the keys.", bestFor: "Founders + ops leads who want the foundation in place.",
    features: ["0nMCP server provisioned + secured", "All 96 services authenticated to your accounts", "Vault container for credentials (Argon2id, audit log)", "1 AI agent built on your stack", "Claude Desktop / Cursor / Windsurf MCP configs", "Documentation + handoff", "Ships in 1 week", "30 days of refinement"] },
  { name: "MCP Crew", price: "$5,997", popular: true, headline: "Build the agent crew on top.", bestFor: "Teams ready to put AI agents into actual production workflows.",
    features: ["Everything in Connect, plus —", "5 AI agents built on top of MCP", "CrewAI orchestration (multi-agent flows)", "Custom tool development (3 tools)", "Webhook + cron infrastructure", "Live observability dashboard", "60 days of refinement + 2 calls", "Optional managed monthly add-on"] },
  { name: "MCP Federation", price: "From $14,997", headline: "Run your own private MCP federation.", bestFor: "Multi-business operators + agencies running for clients.",
    features: ["Everything in Crew, plus —", "Private MCP federation (multi-tenant)", "Custom MCP server build for proprietary tools", "On-prem / VPC deployment", "Multi-team access controls + audit", "Direct line into the 0nMCP roadmap", "Quarterly architecture reviews", "Unlimited refinement"] },
]

const comparisonRows = [
  { dimension: "Tools accessible day 1", industry: "5-15 (per integration build)", rocketopp: "1,554 across 96 services" },
  { dimension: "Time to first connected agent", industry: "8-12 weeks", rocketopp: "1 week" },
  { dimension: "Project cost", industry: "$3,000-$10,000 (single integration)", rocketopp: "$1,997 for the entire foundation" },
  { dimension: "Auth + credential vault", industry: "Build it (or hand-roll, hope nothing leaks)", rocketopp: "Patent-pending Vault Container, AES-256 + Argon2id" },
  { dimension: "Multi-agent orchestration", industry: "Sequential, brittle", rocketopp: "CrewAI built in" },
  { dimension: "MCP host compatibility", industry: "Single client (whichever you build for)", rocketopp: "Claude Desktop, Cursor, Windsurf, Cline, Continue, Gemini, custom" },
  { dimension: "Observability", industry: "Build it yourself", rocketopp: "Live dashboard with run-by-run trace + token cost" },
  { dimension: "Roadmap influence", industry: "None — vendor sets it", rocketopp: "Direct line on Federation tier" },
]

const processSteps = [
  { number: "01", title: "Tool inventory", when: "Day 1", body: "We catalog every tool you currently use (CRM, email, Slack, Stripe, GitHub, Google Workspace, billing, etc.) and map each one to the 0nMCP catalog. Most clients are surprised how much is already covered.", icon: Database },
  { number: "02", title: "Vault + auth", when: "Day 2-3", body: "Every credential goes into a 0nVault container — patent-pending, AES-256-GCM + Argon2id encryption, audit-logged. The vault becomes the only place your AI agents read auth from. Clean security posture from day one.", icon: Lock },
  { number: "03", title: "MCP server provisioned", when: "Day 3-4", body: "0nMCP server stands up against your environment. Configs ship for Claude Desktop, Cursor, Windsurf, Cline, Continue, Gemini, and any other MCP host. Your team can use the AI tooling they already prefer.", icon: Cpu },
  { number: "04", title: "First agent on top", when: "Day 5-7", body: "We build one production agent against your MCP foundation — usually a high-leverage workflow you've been wanting (lead qualifier, support triage, CRM hygiene, etc.). Live, running, in your environment.", icon: Workflow },
  { number: "05", title: "Documentation + handoff", when: "Day 7", body: "Operator playbook, MCP host setup videos, dashboard walkthrough, Vault access protocol. Your team can use + extend without us.", icon: GitBranch },
  { number: "06", title: "Crew + custom tools", when: "Week 2+", body: "Once the foundation works, we layer multi-agent crews and build custom tools for whatever isn't already in the catalog (proprietary internal APIs, niche SaaS, legacy systems).", icon: Layers },
]

const faqs = [
  { question: "What is MCP and why does it matter?", answer: "MCP (Model Context Protocol) is the open standard Anthropic published in 2024 that lets AI models talk to external tools — CRMs, databases, APIs, business systems. Before MCP, every AI app had its own custom tool integration. With MCP, any compliant AI host (Claude Desktop, Cursor, Windsurf, ChatGPT custom GPTs, etc.) can use any compliant MCP server. It's HTTP for AI tooling — the standard nobody has to negotiate." },
  { question: "What is 0nMCP?", answer: "0nMCP is our open-source MCP server (npm: 0nmcp) — currently the largest interconnected MCP server publicly available with 1,554 tools across 96 services. It's the foundation that makes our pricing one-tenth of the industry: every agent we build starts with the entire ecosystem already integrated. Open source under BSL 1.1, so you can audit, fork, or self-host." },
  { question: "What does an MCP integration cost in 2026?", answer: "Industry baseline for a single custom integration is $3,000-$10,000 (one tool, one direction, one workflow). RocketOpp's MCP Connect at $1,997 gets you all 1,554 tools authenticated and ready, plus one production agent — because the integration work is already done in 0nMCP. Crew ($5,997) adds 5 production agents + custom tooling. Federation (from $14,997) adds private MCP for multi-business operators." },
  { question: "What kind of tools does 0nMCP cover?", answer: "Everything you'd reasonably touch in a small/medium business: CRM (HubSpot, Salesforce, Pipedrive, our own), email (Gmail, Outlook, SendGrid, Resend, Mailchimp), payments (Stripe, Square, PayPal), Slack, GitHub, Google Workspace, Microsoft 365, Shopify, Stripe, Calendly, Cal.com, Twilio, Plaid, AWS, Vercel, Supabase, MongoDB — 96 services total. Full catalog: 0nmcp.com." },
  { question: "Can I use this with Claude Desktop / Cursor / Windsurf?", answer: "Yes — that's the whole point. We ship configs for every major MCP host: Claude Desktop, Cursor, Windsurf, Cline, Continue, Gemini, and Claude Code. Your team uses the AI tooling they already prefer; they just gain access to your real business via MCP." },
  { question: "How are credentials secured?", answer: "Every credential lives in a 0nVault container — our patent-pending (US #63/990,046) AES-256-GCM + Argon2id encrypted, audit-logged credential vault. The vault is the only place agents read auth from. Per-tool revocation is one click. Vault can run on-prem on Federation tier for regulated environments." },
  { question: "Do I need an in-house developer?", answer: "No. The MCP Connect engagement is designed for non-developer teams. We provision, configure, and deliver everything plus a non-technical operator playbook. For teams that DO have developers, the same MCP foundation works as the integration layer they'd otherwise build themselves — saving months." },
  { question: "What if I want a tool that isn't in the 0nMCP catalog?", answer: "Two paths: (1) we add it to 0nMCP itself if it's commonly useful — your contribution becomes part of the open-source catalog and you get the credit. (2) we build it as a custom tool inside your engagement and keep it proprietary to you. Crew tier includes 3 custom tools; Federation includes unlimited." },
  { question: "How does 0nMCP compose with the rest of RocketOpp?", answer: "0nMCP is the foundation. Every other RocketOpp service (CRM Automation, AI Business Automation, SXO, PPC) ships on top of it. That's why our pricing makes sense: the integration tax has been paid once, ecosystem-wide. When we add a tool to 0nMCP, every service we offer can use it. The leverage compounds." },
]

const relatedLinks = [
  { label: "AI Business Automation", href: "/services/ai-automation", hint: "$2,997 — agents built on the MCP foundation" },
  { label: "CRM Setup & Automation", href: "/services/crm-automation", hint: "$1,497 — pipelines + AI scoring" },
  { label: "SXO (Search Experience Optimization)", href: "/services/sxo", hint: "From $997/mo — get cited by AI engines" },
  { label: "PPC & Paid Ads", href: "/services/ppc-management", hint: "$797/mo — AI-optimized campaigns" },
  { label: "0nMCP — the orchestrator", href: "https://0nmcp.com", hint: "1,554 tools, 96 services, open source", external: true },
  { label: "0nCore command center", href: "https://0ncore.com", hint: "Customer portal for the entire 0n stack", external: true },
]

export default function McpIntegrationPage() {
  return (
    <>
      <ServiceOfferSchema name="MCP Server Integration" description="Plug your business into 0nMCP — 1,554 tools across 96 services accessible to any AI agent in your stack." serviceType="MCP Integration" url="https://rocketopp.com/services/mcp-integration" price={1997} priceUnit="ONE_TIME" />
      <FAQSchema items={faqs} />
      <HowToSchema name="How RocketOpp ships an MCP integration" description="From tool inventory to a working AI agent on top in seven days." totalTime="P7D" steps={processSteps.map((s) => ({ name: s.title, text: s.body }))} />
      <BreadcrumbSchema items={[{ name: "Home", url: "https://rocketopp.com" }, { name: "Services", url: "https://rocketopp.com/services" }, { name: "MCP Integration", url: "https://rocketopp.com/services/mcp-integration" }]} />

      <main className="min-h-screen">
        <BlufBlock
          badge="Powered by 0nMCP — the largest open-source MCP server"
          bottomLine="Plug your business into 1,554 tools across 96 services in one week. The same infrastructure foundation behind every RocketOpp service — now available for your stack, your agents, your team."
          context="MCP (Model Context Protocol) is the standard that lets any AI host (Claude Desktop, Cursor, Windsurf, ChatGPT) talk to any business system. 0nMCP is the largest one publicly available. We ship the integration, the credential vault, and a working AI agent on top in 1 week from $1,997."
          stats={[
            { label: "Tools accessible day 1", value: "1,554" },
            { label: "Services covered", value: "96" },
            { label: "Time to ship", value: "7 days" },
            { label: "Starting price", value: "$1,997" },
          ]}
          primaryCta={{ label: "Book an MCP call", href: "/contact" }}
          secondaryCta={{ label: "See 0nMCP first", href: "https://0nmcp.com" }}
        />

        <UcpLiveStrip />

        <section className="border-b border-border py-16 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="mx-auto max-w-3xl">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-yellow-500/30 bg-yellow-500/5 px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-widest text-yellow-500">
                <AlertTriangle className="h-3 w-3" /> The integration tax is killing your AI roadmap
              </div>
              <h2 className="text-balance text-3xl font-bold tracking-tight md:text-4xl">Every AI project dies in the integration phase.</h2>
              <div className="mt-6 space-y-4 text-base leading-relaxed text-muted-foreground md:text-lg">
                <p>You hired an AI consultant. They quoted $30k for a single agent. By month three, half the budget went to <strong className="text-foreground">writing the OAuth flow, retrying failed Stripe webhooks, and arguing with the Salesforce REST API</strong>. The actual AI — the part you wanted — never got built.</p>
                <p>This is not your AI vendor&apos;s fault. It&apos;s the cost structure of building integrations one at a time. Every tool is a 2-week task. Every project pays the same tax.</p>
                <p>0nMCP exists to skip that. The integration work has already been done — once, properly, open-source. You plug in, your AI agents inherit the keys to 1,554 tools, and the engagement becomes about <strong className="text-foreground">designing the workflow</strong>, not wiring connectors.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-border py-16 md:py-24 bg-card/30">
          <div className="container px-4 md:px-6">
            <div className="mx-auto max-w-3xl text-center mb-12">
              <h2 className="text-balance text-3xl font-bold tracking-tight md:text-4xl">What you get on day one.</h2>
              <p className="mt-3 text-base text-muted-foreground md:text-lg">Six layers of MCP infrastructure — every plan ships the foundation, Crew + Federation extend it.</p>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[
                { icon: Cpu, title: "0nMCP server", desc: "Provisioned + secured against your environment. The orchestrator behind every AI agent in your stack." },
                { icon: Globe, title: "1,554 tools, ready", desc: "CRM, email, Slack, Stripe, GitHub, Google, Microsoft, Shopify, Calendly, Twilio, AWS, Vercel — all authenticated to your accounts." },
                { icon: Lock, title: "0nVault container", desc: "Patent-pending credential vault. AES-256-GCM + Argon2id, full audit log, per-tool revocation. Compliance-grade out of the box." },
                { icon: Workflow, title: "MCP host configs", desc: "Configs delivered for Claude Desktop, Cursor, Windsurf, Cline, Continue, Gemini, Claude Code. Your team uses the AI tooling they already prefer." },
                { icon: Zap, title: "First agent built", desc: "One production AI agent on top of the foundation. Usually the highest-leverage workflow you've been wanting — lead qualifier, support triage, CRM hygiene." },
                { icon: Shield, title: "Observability dashboard", desc: "Live trace of every agent run. What it did, what tools it called, what it cost. Audit + debug + optimize from one screen." },
              ].map((item) => {
                const Icon = item.icon
                return (
                  <div key={item.title} className="rounded-2xl border border-border bg-card/50 p-6 backdrop-blur transition-colors hover:border-primary/40">
                    <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl border border-primary/30 bg-primary/10 text-primary">
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="text-lg font-bold text-foreground">{item.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.desc}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        <IndustryVsUsTable heading="MCP Integration: Industry vs RocketOpp" caption="Single-tool integration project vs the entire 0n ecosystem. Same week. One-tenth the cost." rows={comparisonRows} footnote="* Industry baselines: 2026 AI consultancy + custom-integration RFP averages." />
        <ProcessTimeline heading="How we ship an MCP engagement" caption="Seven days. Tool inventory to working agent." steps={processSteps} />

        <section id="pricing" className="border-y border-border py-16 md:py-24 bg-card/20">
          <div className="container px-4 md:px-6">
            <div className="mx-auto max-w-3xl text-center mb-12">
              <h2 className="text-balance text-3xl font-bold tracking-tight md:text-5xl">
                <span className="bg-gradient-to-r from-primary via-orange-400 to-primary bg-clip-text text-transparent">MCP pricing</span>
              </h2>
              <p className="mt-3 text-base text-muted-foreground md:text-lg">One-time fees. You own the MCP foundation forever. 30-day refinement on every plan.</p>
            </div>
            <div className="mx-auto grid max-w-6xl grid-cols-1 gap-5 lg:grid-cols-3">
              {tiers.map((tier) => (
                <div key={tier.name} className={`relative flex flex-col rounded-2xl border p-7 backdrop-blur ${tier.popular ? "border-primary/40 bg-gradient-to-br from-primary/[0.05] via-card/40 to-transparent ring-1 ring-primary/20" : "border-border bg-card/40"}`}>
                  {tier.popular && (
                    <div className="absolute -top-3 left-7 inline-flex items-center gap-1 rounded-full bg-primary px-3 py-0.5 font-mono text-[10px] font-bold uppercase tracking-widest text-primary-foreground">
                      <Sparkles className="h-3 w-3" /> Most popular
                    </div>
                  )}
                  <h3 className="text-xl font-bold text-foreground">{tier.name}</h3>
                  <div className="mt-1 text-sm text-muted-foreground">{tier.headline}</div>
                  <div className="mt-5"><span className="text-4xl font-black text-primary">{tier.price}</span></div>
                  <p className="mt-3 text-xs italic text-muted-foreground">{tier.bestFor}</p>
                  <ul className="mt-5 flex-1 space-y-2.5">
                    {tier.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm">
                        <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                        <span className={f.startsWith("Everything in") ? "font-semibold text-foreground" : "text-muted-foreground"}>{f}</span>
                      </li>
                    ))}
                  </ul>
                  <Button asChild size="lg" className="mt-6 w-full" variant={tier.popular ? "default" : "outline"}>
                    <Link href="/contact">Start {tier.name.replace("MCP ", "")}<ArrowRight className="ml-1.5 h-4 w-4" /></Link>
                  </Button>
                </div>
              ))}
            </div>
            <div className="mx-auto mt-10 max-w-3xl rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/[0.06] via-card/40 to-transparent p-6 md:p-8">
              <div className="flex flex-col items-center gap-4 md:flex-row">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-primary/30 bg-primary/15">
                  <ShieldCheck className="h-7 w-7 text-primary" />
                </div>
                <div className="flex-1 text-center md:text-left">
                  <div className="mb-1 font-mono text-[10px] uppercase tracking-widest text-primary">Open-source guarantee</div>
                  <h3 className="text-lg font-bold md:text-xl">0nMCP is open source. You&apos;re never locked in.</h3>
                  <p className="mt-1 text-sm text-muted-foreground">npm install 0nmcp. Full source on GitHub. BSL 1.1 license. If we ever go away, your MCP foundation keeps running. The integrations belong to you, the auth lives in your vault, the agents work in any compliant host.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-border py-16 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="mx-auto max-w-3xl text-center mb-12">
              <h2 className="text-balance text-3xl font-bold tracking-tight md:text-4xl">Frequently asked questions</h2>
              <p className="mt-3 text-base text-muted-foreground md:text-lg">For the AI-curious technical leader.</p>
            </div>
            <div className="mx-auto max-w-3xl space-y-4">
              {faqs.map((faq) => (
                <details key={faq.question} className="group rounded-2xl border border-border bg-card/50 p-5 transition-colors hover:border-primary/40">
                  <summary className="flex cursor-pointer items-start justify-between gap-3 list-none">
                    <h3 className="text-base font-bold text-foreground md:text-lg">{faq.question}</h3>
                    <span className="font-mono text-xl text-primary transition-transform group-open:rotate-45">+</span>
                  </summary>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground md:text-base">{faq.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden border-b border-border py-16 md:py-24">
          <div aria-hidden className="pointer-events-none absolute -top-32 left-1/2 h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-primary/[0.06] blur-[140px]" />
          <div className="container relative z-10 px-4 md:px-6">
            <div className="mx-auto max-w-3xl rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/[0.05] via-card/40 to-transparent p-10 text-center md:p-14">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/8 px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-widest text-primary">
                <Activity className="h-3 w-3" /> 30-min call · Free
              </div>
              <h2 className="text-balance text-3xl font-bold tracking-tight md:text-5xl">Plug in. Get the keys to the ecosystem.</h2>
              <p className="mt-4 text-base leading-relaxed text-muted-foreground md:text-lg">30 minutes. We tour the 0nMCP catalog against your stack, identify your first agent, quote the engagement.</p>
              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Button asChild size="lg" className="text-base"><Link href="/contact">Book the MCP call <ArrowRight className="ml-2 h-4 w-4" /></Link></Button>
                <Button asChild variant="outline" size="lg" className="text-base"><Link href="https://0nmcp.com" target="_blank" rel="noopener noreferrer">Browse 0nMCP first</Link></Button>
              </div>
            </div>
          </div>
        </section>

        <RelatedServices links={relatedLinks} />
      </main>
      <Footer />
    </>
  )
}
