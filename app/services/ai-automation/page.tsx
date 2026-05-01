import type { Metadata } from "next"
import Link from "next/link"
import {
  Cpu,
  CheckCircle,
  ArrowRight,
  Bot,
  Workflow,
  Zap,
  Activity,
  AlertTriangle,
  Sparkles,
  ShieldCheck,
  Rocket,
  Database,
  GitBranch,
  Mail,
  TrendingUp,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  ServiceOfferSchema,
  FAQSchema,
  BreadcrumbSchema,
  HowToSchema,
} from "@/components/seo/json-ld"
import Footer from "@/components/footer"
import BlufBlock from "@/components/sxo/bluf-block"
import IndustryVsUsTable from "@/components/sxo/industry-vs-us-table"
import ProcessTimeline from "@/components/sxo/process-timeline"
import RelatedServices from "@/components/sxo/related-services"
import UcpLiveStrip from "@/components/ucp-live-strip"

export const metadata: Metadata = {
  title: "AI Business Automation — From $2,997 | Workflow + Agents + Ops Automation | RocketOpp",
  description:
    "Custom AI automation systems built on 0nMCP. Replace 5-10 manual workflows with AI agents that run 24/7 — from lead qualification to customer support to content production. From $2,997. Ships in 2 weeks.",
  keywords: [
    "AI business automation",
    "workflow automation services",
    "AI agents for business",
    "custom AI automation",
    "AI agent development",
    "business process automation",
    "AI-powered automation",
    "0nMCP automation",
    "RPA replacement",
    "intelligent automation",
    "no-code automation",
    "AI customer service",
    "AI lead qualification",
    "AI ops automation",
    "AI for SMB",
    "build an AI agent",
  ],
  openGraph: {
    title: "AI Business Automation — Custom AI Systems from $2,997 | RocketOpp",
    description: "AI agents that actually execute. 5-10 workflows automated. Powered by 0nMCP and 1,500+ tools.",
    url: "https://rocketopp.com/services/ai-automation",
    type: "website",
  },
  alternates: { canonical: "https://rocketopp.com/services/ai-automation" },
}

const tiers = [
  { name: "Automation Starter", price: "$2,997", headline: "Replace one workflow that's eating your day.", bestFor: "Solo founders + small teams (1-5 people).",
    features: ["1-2 high-impact workflows automated", "AI agent built on 0nMCP (1,500+ tool access)", "CRM + email integration", "Slack + dashboard notifications", "Documentation + handoff guide", "30 days of refinement included", "1 strategy + design call", "Ships in 2 weeks"] },
  { name: "Automation Growth", price: "$7,997", popular: true, headline: "Run your entire operations on AI.", bestFor: "Growing teams ($1M-$10M ARR) with real ops debt.",
    features: ["Everything in Starter, plus —", "5-7 workflows automated end-to-end", "AI agent crew (CrewAI orchestration)", "Lead scoring + qualification flows", "Customer support + ticket routing AI", "Content production agent (4+ pieces/wk)", "Live observability dashboard", "60 days of refinement + 2 strategy calls"] },
  { name: "Automation Enterprise", price: "From $24,997", headline: "Custom AI infrastructure for your full org.", bestFor: "Enterprise + regulated verticals (10M+ ARR, healthcare, finance).",
    features: ["Everything in Growth, plus —", "Unlimited workflows + agents", "Custom MCP server build", "On-prem / VPC deployment options", "HIPAA / SOC 2 / GDPR compliance work", "Multi-team agent governance", "Dedicated AI strategist", "90-day continuous refinement"] },
]

const comparisonRows = [
  { dimension: "Project cost", industry: "$15,000-$50,000", rocketopp: "$2,997-$24,997" },
  { dimension: "Time to first working agent", industry: "8-12 weeks", rocketopp: "2 weeks" },
  { dimension: "Tools your AI can use", industry: "10-30 (custom integration each)", rocketopp: "1,500+ via 0nMCP, ready day 1" },
  { dimension: "Agent orchestration", industry: "Sequential, fragile, not built in", rocketopp: "CrewAI multi-agent built in" },
  { dimension: "Observability + dashboards", industry: "Build it yourself (extra cost)", rocketopp: "Live dashboard included on every plan" },
  { dimension: "Failure modes + recovery", industry: "Brittle scripts, manual debugging", rocketopp: "Self-healing flows + audit log" },
  { dimension: "Refinement after launch", industry: "Bill by the hour", rocketopp: "30-90 days included free" },
  { dimension: "Compliance posture", industry: "Add-on / quoted separately", rocketopp: "HIPAA/SOC 2 baseline available on Enterprise" },
]

const processSteps = [
  { number: "01", title: "Operations audit", when: "Day 1-3", body: "We map every manual workflow worth automating, score each one by hours-saved + revenue-impact, and pick the 1-7 with the best ratio. You see the math before we build.", icon: Activity },
  { number: "02", title: "Agent design + tool selection", when: "Day 4-7", body: "Each workflow becomes an agent with a defined goal, prompt, tool list (drawn from the 0nMCP catalog), guardrails, and a failure plan. We run trace tests against your real data.", icon: GitBranch },
  { number: "03", title: "Build + integrate", when: "Week 2", body: "Agents go live against your CRM, email, Slack, calendar, billing — whatever they need. Built on 0nMCP so the same agent works whether you're on HubSpot, Salesforce, or our own platform.", icon: Workflow },
  { number: "04", title: "Observability + handoff", when: "Week 2-3", body: "Live dashboard shows every agent run, what it did, what tools it called, what it cost in tokens. Your team gets a 30-min training so they can read the dashboard without us.", icon: TrendingUp },
  { number: "05", title: "Refine in production", when: "Day 30-60", body: "Real users surface edge cases week 1-3. We tune prompts, add tool calls, expand capabilities, fix anything brittle. All included in the engagement price.", icon: Zap },
  { number: "06", title: "Compound: add agents", when: "Month 2+", body: "Once one agent is paying back, we layer the next. Every new agent has access to the same tool catalog, so the marginal build time drops fast. Most clients hit 7+ agents inside a year.", icon: Rocket },
]

const faqs = [
  { question: "What is AI business automation, exactly?", answer: "It's the practice of replacing repetitive manual workflows — lead qualification, customer support replies, invoice reconciliation, content production, social posting — with AI agents that have access to your real business tools (CRM, email, calendar, billing). Unlike RPA or Zapier, AI agents reason about each task instead of following a fixed script. They can handle ambiguity, escalate when unsure, and improve as they learn your patterns." },
  { question: "How much does an AI automation project cost in 2026?", answer: "Industry average for a custom AI automation project ranges $15,000-$50,000 because most firms charge for custom integration work on every tool the agent needs to use. RocketOpp builds on 0nMCP, which gives every agent access to 1,500+ tools across 96 services on day one — so we skip the integration tax. Our Starter is $2,997 (1-2 workflows), Growth is $7,997 (5-7 workflows), Enterprise starts at $24,997 (unlimited, with compliance + custom MCP)." },
  { question: "What can an AI agent actually do for my business?", answer: "Common starting points: qualify inbound leads (read the form, enrich the contact, score it, route to the right rep), reply to common customer support tickets, produce drafts for blog posts and social content, reconcile invoices against contracts, schedule meetings end-to-end, run weekly reports and post the summary to Slack, follow up on cold email no-replies, summarize sales calls and update the CRM. Anything that's: (a) repetitive, (b) judgment-light, (c) involves 2+ tools." },
  { question: "How is this different from Zapier, Make, or RPA tools?", answer: "Zapier and Make are if-this-then-that. They break the moment data doesn't fit the schema. RPA (UiPath etc.) is brittle screen automation. AI agents reason about each task — they read the inputs, decide what to do, call the right tools, and escalate if confused. They're orders of magnitude more flexible, recover from edge cases automatically, and learn from your corrections. The trade-off used to be cost; with 0nMCP that gap is closed." },
  { question: "What's 0nMCP and why does it matter for my project?", answer: "0nMCP is our orchestrator (Model Context Protocol server) that gives any AI agent immediate access to 1,500+ tools across 96 services — CRM, email, Slack, Stripe, GitHub, Google Workspace, Shopify, you name it. Without it, every new agent capability is a custom integration build. With it, agents start with the keys to the entire ecosystem and you only pay for the orchestration on top. It's the entire reason our pricing is one-tenth of the industry." },
  { question: "How fast can you actually ship?", answer: "Starter: 2 weeks from kickoff to first working agent in your environment. Growth: 4 weeks for the full 5-7 agent crew. Enterprise: 6-10 weeks depending on compliance scope. We hit these timelines by reusing the 0nMCP foundation across every project — your engagement is mostly about defining the problem, designing the agent, and pressure-testing in your real data, not custom infra." },
  { question: "What if the AI agent makes a mistake?", answer: "Every agent ships with: a defined goal, hard guardrails (e.g. never delete a contact, never charge a card without confirmation), an escalation path (route to a human when confidence is low), a complete audit log of every action, and a one-click rollback for actions that need it. The dashboard shows you every decision the agent made and why. If something's wrong, you see it before it compounds." },
  { question: "Do I need a developer on my team to maintain this?", answer: "No. We deliver every agent with a non-technical operator playbook — the agent's goal in plain English, the dashboard view, when to intervene, how to retrain. If your team can use a CRM, they can manage AI agents. For Enterprise we also offer a managed service add-on where we handle all maintenance." },
  { question: "Can I cancel anytime?", answer: "Project-based engagements (Starter, Growth, Enterprise) include the build + 30-90 days of refinement. After that you own the agents outright — they keep running in your environment with no ongoing fee from us. Optional managed-service contracts (where we keep tuning + adding agents) are month-to-month." },
]

const relatedLinks = [
  { label: "MCP Server Integration", href: "/services/mcp-integration", hint: "$1,997 — connect any business to 1,500+ tools" },
  { label: "CRM Setup & Automation", href: "/services/crm-automation", hint: "$1,497 — pipelines, lead scoring, sequences" },
  { label: "SXO (Search Experience Optimization)", href: "/services/sxo", hint: "From $997/mo — get cited by AI engines" },
  { label: "PPC & Paid Ads", href: "/services/ppc-management", hint: "$797/mo — AI-optimized Google + Meta + LinkedIn" },
  { label: "0nMCP — the orchestrator", href: "https://0nmcp.com", hint: "1,554 tools, 96 services, one protocol", external: true },
  { label: "Read the AI automation playbook", href: "/blog", hint: "Real builds, real numbers, real failures" },
]

export default function AiAutomationPage() {
  return (
    <>
      <ServiceOfferSchema name="AI Business Automation" description="Custom AI automation systems built on 0nMCP — replace 5-10 manual workflows with AI agents that run 24/7." serviceType="AI Business Automation" url="https://rocketopp.com/services/ai-automation" price={2997} priceUnit="ONE_TIME" />
      <FAQSchema items={faqs} />
      <HowToSchema name="How RocketOpp ships an AI automation engagement" description="From operations audit to compounding agent crew in six steps." totalTime="P14D" steps={processSteps.map((s) => ({ name: s.title, text: s.body }))} />
      <BreadcrumbSchema items={[{ name: "Home", url: "https://rocketopp.com" }, { name: "Services", url: "https://rocketopp.com/services" }, { name: "AI Business Automation", url: "https://rocketopp.com/services/ai-automation" }]} />

      <main className="min-h-screen">
        <BlufBlock
          badge="Powered by 0nMCP — 1,500+ tools, day 1"
          bottomLine="Replace 5-10 manual workflows with AI agents that run 24/7. From lead qualification to customer support to content production — your operation, automated, observable, and improving every week."
          context="We build on 0nMCP so every agent we ship has immediate access to 1,500+ tools across 96 services. No integration tax. No 8-week procurement cycle. From Starter at $2,997 (1-2 workflows in 2 weeks) to Enterprise (unlimited workflows, custom MCP, compliance work)."
          stats={[
            { label: "Tools your AI can use", value: "1,500+" },
            { label: "Time to first agent", value: "2 weeks" },
            { label: "Starting price", value: "$2,997" },
            { label: "Days of refinement included", value: "30-90" },
          ]}
          primaryCta={{ label: "Book an automation call", href: "/contact" }}
          secondaryCta={{ label: "See pricing", href: "#pricing" }}
        />

        <UcpLiveStrip />

        <section className="border-b border-border py-16 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="mx-auto max-w-3xl">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-yellow-500/30 bg-yellow-500/5 px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-widest text-yellow-500">
                <AlertTriangle className="h-3 w-3" /> What it costs to not automate
              </div>
              <h2 className="text-balance text-3xl font-bold tracking-tight md:text-4xl">Every manual workflow is a person you have to hire to scale.</h2>
              <div className="mt-6 space-y-4 text-base leading-relaxed text-muted-foreground md:text-lg">
                <p>A typical SMB has <strong className="text-foreground">15-25 repetitive workflows</strong> chewing up team hours every week. Lead replies, ticket triage, social posting, invoice matching, calendar wrangling, CRM data entry — none of them are revenue work, all of them have to happen.</p>
                <p>At <strong className="text-foreground">$25-50/hour fully-loaded labor cost</strong>, even five workflows at one hour/day each is $25k-$50k a year. Doing nothing is not free.</p>
                <p>AI agents fix this with a one-time build. The same workflow that costs you $30k/year manually costs $3k once with us, runs 24/7, and never asks for PTO. It&apos;s the highest-ROI infrastructure decision a small business can make in 2026.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-border py-16 md:py-24 bg-card/30">
          <div className="container px-4 md:px-6">
            <div className="mx-auto max-w-3xl text-center mb-12">
              <h2 className="text-balance text-3xl font-bold tracking-tight md:text-4xl">What we automate first.</h2>
              <p className="mt-3 text-base text-muted-foreground md:text-lg">Six categories where AI agents pay back fastest. Most clients start with one and expand.</p>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[
                { icon: Mail, title: "Lead qualification + routing", desc: "Read inbound forms + emails, enrich the contact, score against ICP, route to the right rep with full context. Zero leads lost in the inbox." },
                { icon: Bot, title: "Customer support triage", desc: "First-line replies on common issues, ticket categorization + urgency scoring, summary handoff to humans for the rest. 60-80% of tickets handled before a person sees them." },
                { icon: Workflow, title: "Content + social production", desc: "Long-form articles, LinkedIn posts, X threads, email sequences — drafted with brand voice, queued for review, posted on schedule. 4-12 pieces/week, every week." },
                { icon: Database, title: "CRM data hygiene", desc: "Auto-enrich contacts, dedupe records, update stale fields, summarize sales calls into the CRM, follow up on no-replies. Your sales reps stop doing data entry." },
                { icon: GitBranch, title: "Operations + reporting", desc: "Reconcile invoices vs contracts, run weekly metrics, post summaries to Slack, flag anomalies for review. Everything you currently do on Sunday night." },
                { icon: Cpu, title: "Custom agent builds", desc: "Industry-specific workflows we haven't seen before. Show us the spreadsheet, the email thread, the screenshot — we build the agent that ends it." },
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

        <IndustryVsUsTable heading="AI Automation: Industry vs RocketOpp" caption="Same scope. The difference is the orchestrator underneath." rows={comparisonRows} footnote="* Industry baselines: average AI consultancy quote 2026 (per Gartner + custom research)." />
        <ProcessTimeline heading="How we ship an automation engagement" caption="Six steps. From audit to first agent in two weeks." steps={processSteps} />

        <section id="pricing" className="border-y border-border py-16 md:py-24 bg-card/20">
          <div className="container px-4 md:px-6">
            <div className="mx-auto max-w-3xl text-center mb-12">
              <h2 className="text-balance text-3xl font-bold tracking-tight md:text-5xl">
                <span className="bg-gradient-to-r from-primary via-orange-400 to-primary bg-clip-text text-transparent">Project pricing</span>
              </h2>
              <p className="mt-3 text-base text-muted-foreground md:text-lg">One-time engagement fees. You own the agents at the end. 30-day results guarantee.</p>
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
                    <Link href="/contact">Start {tier.name.replace("Automation ", "")}<ArrowRight className="ml-1.5 h-4 w-4" /></Link>
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
                  <div className="mb-1 font-mono text-[10px] uppercase tracking-widest text-primary">30-day results guarantee</div>
                  <h3 className="text-lg font-bold md:text-xl">Hit the workflow KPI we set, or we keep building.</h3>
                  <p className="mt-1 text-sm text-muted-foreground">Every engagement starts with one measurable target — hours saved per week, conversion rate lift, response time. Miss it in 30 days and we keep refining at no extra charge until we hit it.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-border py-16 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="mx-auto max-w-3xl text-center mb-12">
              <h2 className="text-balance text-3xl font-bold tracking-tight md:text-4xl">Frequently asked questions</h2>
              <p className="mt-3 text-base text-muted-foreground md:text-lg">Real answers from real builds.</p>
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
                <Activity className="h-3 w-3" /> 30-min call · Free · No commitment
              </div>
              <h2 className="text-balance text-3xl font-bold tracking-tight md:text-5xl">Show us the workflow that&apos;s killing your week.</h2>
              <p className="mt-4 text-base leading-relaxed text-muted-foreground md:text-lg">We&apos;ll tell you on the call: can we automate it, what it&apos;ll cost, how long it&apos;ll take. If yes — kickoff next week. If no — we&apos;ll tell you why.</p>
              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Button asChild size="lg" className="text-base"><Link href="/contact">Book the call <ArrowRight className="ml-2 h-4 w-4" /></Link></Button>
                <Button asChild variant="outline" size="lg" className="text-base"><Link href="https://0nmcp.com" target="_blank" rel="noopener noreferrer">See 0nMCP first</Link></Button>
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
