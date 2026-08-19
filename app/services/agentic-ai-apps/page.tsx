import type { Metadata } from "next"
import Link from "next/link"
import {
  ArrowRight,
  Bot,
  CheckCircle2,
  Workflow,
  Sparkles,
  ShieldCheck,
  AlertTriangle,
  Clock,
  Layers,
  GitBranch,
  Eye,
} from "lucide-react"
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
import EcosystemStrip from "@/components/ecosystem-strip"

// ━━━ SEO Metadata ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const metadata: Metadata = {
  title:
    "Agentic AI Apps — AI That Does the Work, Not Just the Talking",
  description:
    "Custom agentic AI applications built on 0nMCP: 1,640 tools across 111 services. Agents that read your systems, decide, act, and report back — from $4,997, live in 3 weeks. You own the code.",
  keywords: [
    "agentic AI",
    "agentic AI apps",
    "AI agents for business",
    "custom AI agent development",
    "AI agent orchestration",
    "MCP agents",
    "0nMCP",
    "AI workflow automation",
    "autonomous AI agents",
    "AI agent development company",
    "multi-agent systems",
    "AI that takes actions",
    "agentic workflow",
    "Model Context Protocol",
  ],
  openGraph: {
      images: [{ url: 'https://rocketopp.com/api/og?title=Agentic%20AI%20Apps%20%E2%80%94%20AI%20That%20Actually%20Does%20the%20Work&eyebrow=Services', width: 1200, height: 630, alt: "Agentic AI Apps — AI That Actually Does the Work" }],
    title: "Agentic AI Apps — AI That Actually Does the Work | RocketOpp",
    description:
      "Agents that act across 111 services and 1,640 tools. From $4,997, live in 3 weeks, and you own the code.",
    url: "https://rocketopp.com/services/agentic-ai-apps",
    type: "website",
  },
  alternates: { canonical: "https://rocketopp.com/services/agentic-ai-apps" },
}

// ━━━ Page data — content lives at the top, layout below ━━━━━━━━━━━━━━━━━━━━

/**
 * Every number on this page is checkable. Per lib/stats.ts RULE 2, figures about
 * RocketOpp / 0n must be verifiable in the repos, on npm, or on a live site.
 *
 *   111 services / 1,640 tools / 22 categories
 *     → 0nmcp-website/src/data/services.json meta block, generated 2026-07-10
 *       from 0nMCP v4.20.0 catalog.js + crm/ + vault/ + engine/ + deed/ + app/
 *   0nmcp v4.20.0 → npmjs.com/package/0nmcp
 *
 * There are no industry benchmark numbers on this page, because we do not have a
 * sourced study for "what an agentic build costs elsewhere". The comparison
 * table below is therefore STRUCTURAL — what is in scope, who owns what — not
 * statistical. Do not add an unsourced average to it.
 */
const MCP_SERVICES = 111
const MCP_TOOLS = "1,640"

const CAPABILITIES = [
  {
    Icon: Bot,
    title: "Agents that act, not answer",
    body: "A chatbot returns text. An agent books the appointment, moves the deal stage, sends the invoice, updates the sheet, and tells you it did. The difference is tool access — and tool access is the whole product.",
  },
  {
    Icon: Layers,
    title: `${MCP_SERVICES} services already wired`,
    body: `Your agent inherits ${MCP_TOOLS} tools on day one — CRM, Stripe, Slack, Google Workspace, Shopify, QuickBooks, Supabase, Twilio and more. We are not writing integrations from scratch; we are pointing an agent at ones that already run in production.`,
  },
  {
    Icon: Workflow,
    title: "Orchestration, not a single prompt",
    body: "Real work is multi-step and conditional. Agents run in pipelines, hand off to each other, retry, and escalate to a human when confidence drops. You define the outcome; the orchestrator decides the path.",
  },
  {
    Icon: Eye,
    title: "A visible audit trail",
    body: "Every run is logged in plain English: what was asked, what the agent did, which tools it called, what changed. Non-technical staff can read it. That is what makes an agent safe to leave running.",
  },
  {
    Icon: ShieldCheck,
    title: "Credentials never touch the browser",
    body: "Keys live server-side, per-tenant, encrypted. The front end carries a public key that can only do what you allow it to do. Revenue and PII endpoints require a separate secret.",
  },
  {
    Icon: GitBranch,
    title: "You own the code",
    body: "The repo is yours at handoff — source, infrastructure config, and docs. No per-seat licence on your own application, and no vendor who can switch you off.",
  },
]

const DELIVERABLES = [
  "Discovery: the outcome written down, plus the decision rules the agent must respect",
  "The agent itself — prompt architecture, tool scope, guardrails, escalation path",
  "0nMCP wiring to every system it needs to touch (CRM, billing, comms, storage)",
  "A human-readable run log so anyone on your team can see what it did",
  "Approval gates on anything irreversible — money, sends, deletions",
  "Deployment to your infrastructure (or ours) with monitoring and error alerting",
  "Handoff: the repo, the credentials, the docs, and a walkthrough recording",
  "30 days of post-launch tuning as real usage exposes real edge cases",
]

const comparisonRows = [
  {
    dimension: "What ships",
    industry: "A chat widget that answers questions from your docs",
    rocketopp: "An agent with tool access that completes the task end to end",
    win: true,
  },
  {
    dimension: "Integrations",
    industry: "Built one at a time, billed per integration",
    rocketopp: `${MCP_SERVICES} services / ${MCP_TOOLS} tools available from day one via 0nMCP`,
    win: true,
  },
  {
    dimension: "Who owns the code",
    industry: "The agency, or a platform seat you rent indefinitely",
    rocketopp: "You do. Full repo at handoff, no per-seat licence",
    win: true,
  },
  {
    dimension: "Auditability",
    industry: "Logs written for developers, if any",
    rocketopp: "Plain-English run log your operations staff can actually read",
    win: true,
  },
  {
    dimension: "Failure behaviour",
    industry: "Agent guesses and keeps going",
    rocketopp: "Low confidence escalates to a human instead of guessing",
    win: true,
  },
  {
    dimension: "Time to first working agent",
    industry: "Typically scoped in months",
    rocketopp: "3 weeks from kickoff, because the integration layer already exists",
    win: true,
  },
  {
    dimension: "Model lock-in",
    industry: "Hard-wired to one vendor's API",
    rocketopp: "Model choice is a config value — swap without a rewrite",
    win: true,
  },
]

const processSteps = [
  {
    number: "01",
    title: "Name the outcome",
    when: "Day 1–2",
    body: "We do not start from 'we want AI'. We start from a sentence like 'every inbound lead gets qualified, tagged, and booked without anyone touching it'. Then we write down the rules the agent may never break.",
    icon: Sparkles,
  },
  {
    number: "02",
    title: "Map the tools",
    when: "Day 3–4",
    body: `We list every system the outcome touches and confirm which of the ${MCP_SERVICES} services already cover them. Anything missing gets built as a new tool. You see the map before we write the agent.`,
    icon: Layers,
  },
  {
    number: "03",
    title: "Build the agent",
    when: "Week 2",
    body: "Prompt architecture, tool scope, guardrails, escalation path, and the run log. We build against real data from your systems, not a demo fixture, so edge cases surface now instead of in production.",
    icon: Bot,
  },
  {
    number: "04",
    title: "Supervised run",
    when: "Week 3",
    body: "The agent runs on live work with approval gates on anything irreversible. You watch the log, approve or reject, and we tune. Gates come off one at a time, only once you are comfortable.",
    icon: ShieldCheck,
  },
  {
    number: "05",
    title: "Handoff and tune",
    when: "Week 3 + 30 days",
    body: "Repo, credentials, docs, and a walkthrough recording are yours. We stay on for 30 days of tuning while real usage teaches the agent what discovery could not.",
    icon: GitBranch,
  },
]

const tiers = [
  {
    name: "Agent Pilot",
    price: "$4,997",
    meta: "one-time · 3 weeks",
    headline: "One agent, one outcome, running in production.",
    bestFor:
      "Proving the model on a single high-friction process before you commit further.",
    features: [
      "1 agent, scoped to 1 outcome",
      "Up to 5 connected systems",
      "Plain-English run log",
      "Approval gates on irreversible actions",
      "Deployment + monitoring",
      "Repo handoff — you own it",
      "30 days post-launch tuning",
    ],
    cta: { label: "Start a pilot", href: "/order?seed=agentic-ai-apps" },
  },
  {
    name: "Agent Suite",
    price: "$9,997",
    meta: "one-time · 5 weeks",
    popular: true,
    headline: "Several agents that hand work to each other.",
    bestFor:
      "A whole process — intake through fulfilment — rather than a single step.",
    features: [
      "Everything in Pilot, plus —",
      "Up to 4 agents with orchestration between them",
      "Unlimited connected systems across all 111 services",
      "Shared memory and context between agents",
      "Role-based approval routing",
      "Admin dashboard for the run log",
      "Custom tools for anything not already covered",
    ],
    cta: { label: "Scope a suite", href: "/order?seed=agentic-ai-apps" },
  },
  {
    name: "Embedded",
    price: "Custom",
    meta: "retainer",
    headline: "Agents as an ongoing capability, not a project.",
    bestFor:
      "Teams shipping new agents continuously, or running them at volume.",
    features: [
      "Everything in Suite, plus —",
      "New agents on a standing retainer",
      "Private 0nMCP tools for your proprietary systems",
      "Multi-tenant architecture if you resell to your own clients",
      "SLA + priority response",
      "Direct line into the 0nMCP roadmap",
    ],
    cta: { label: "Talk to Mike", href: "/contact" },
  },
]

const faqs = [
  {
    question: "What is an agentic AI app, and how is it different from a chatbot?",
    answer:
      "A chatbot produces text. An agentic AI app produces outcomes — it has access to real tools and uses them. Ask a chatbot to reschedule a client and it writes you a polite paragraph about how to do that. Ask an agent and it checks the calendar, moves the appointment, sends the confirmation text, updates the CRM record, and reports back what it did. The technical difference is tool access plus an orchestration loop that lets the AI decide which tools to call and in what order. The practical difference is whether a human still has to do the work afterwards.",
  },
  {
    question: "How much does a custom agentic AI application cost?",
    answer:
      "A single-outcome agent starts at $4,997 as a one-time build, live in about 3 weeks. A multi-agent suite that covers an entire process — intake through fulfilment, with agents handing work between them — is $9,997 over roughly 5 weeks. Ongoing agent development runs as a custom retainer. The reason these numbers are lower than a typical ground-up build is that the integration layer already exists: 0nMCP ships 1,640 tools across 111 services, so we are configuring and orchestrating proven integrations rather than writing connectors from scratch.",
  },
  {
    question: "Which systems can the agent actually connect to?",
    answer:
      "0nMCP covers 111 services and 1,640 tools across 22 categories, including CRM, Stripe, Slack, Google Workspace (Gmail, Calendar, Sheets, Drive), Shopify, QuickBooks, Supabase, Twilio, Notion, Airtable, GitHub, HubSpot and more. If your system is not in the catalogue, we build it as a new tool during the mapping phase — it joins the same catalogue and works like the rest. You see the full map of what is covered before we start building the agent.",
  },
  {
    question: "How do you stop an AI agent from doing something destructive?",
    answer:
      "Three layers. First, tool scope: the agent is only given the tools it needs, so it cannot call what it was never handed. Second, approval gates on anything irreversible — money moving, messages sending, records deleting — which hold the action until a human approves it. Third, escalation on low confidence: when the agent is unsure, it stops and asks rather than guessing. During the supervised run in week 3 every gate is on, and they come off one at a time only when you are comfortable. Credentials stay server-side and never reach the browser.",
  },
  {
    question: "Do we own the agent, or are we renting a platform seat?",
    answer:
      "You own it. At handoff you receive the repository, the infrastructure configuration, the documentation, and a walkthrough recording. There is no per-seat licence on your own application and no vendor who can switch it off. 0nMCP is the orchestration layer underneath — the agent you paid for is yours.",
  },
  {
    question: "What happens if the AI model we started on gets replaced?",
    answer:
      "Model choice is a configuration value, not an architectural commitment. The agent's logic lives in its tool definitions, guardrails, and orchestration — none of which are tied to a specific vendor's API. Swapping the underlying model is a config change, not a rewrite. This matters more than it sounds: the model landscape has turned over repeatedly, and anything hard-wired to one vendor gets rebuilt every time it does.",
  },
  {
    question: "How long before the agent is doing real work?",
    answer:
      "Three weeks from kickoff for a single-outcome agent. Days 1 to 2 define the outcome and the rules, days 3 to 4 map the tools, week 2 builds the agent against your real data, and week 3 runs it supervised on live work with approval gates on. Most clients see it complete a real task correctly in week 2 — the third week is about trusting it enough to take the gates off.",
  },
]

const relatedLinks = [
  {
    label: "MCP Server Integration",
    href: "/services/mcp-integration",
    hint: `$1,997 — the integration layer these agents run on, ${MCP_TOOLS} tools`,
  },
  {
    label: "AI Business Automation",
    href: "/services/ai-automation",
    hint: "$2,997 — rules-based automation when you do not need an agent",
  },
  {
    label: "AI Applications",
    href: "/services/ai-applications",
    hint: "Custom AI software beyond the agent pattern",
  },
  {
    label: "CRM Setup & Automation",
    href: "/services/crm-automation",
    hint: "$1,497 — the system most agents end up acting on",
  },
  {
    label: "AI Lead-Tool Apps",
    href: "/services/lead-tool-apps",
    hint: "Free and freemium AI tools that turn visitors into pipeline",
  },
  {
    label: "0nMCP on npm",
    href: "https://www.npmjs.com/package/0nmcp",
    hint: "The open orchestrator — check the tool count yourself",
    external: true,
  },
]

// ━━━ Page ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export default function AgenticAiAppsPage() {
  return (
    <>
      <ServiceOfferSchema
        name="Agentic AI App Development"
        description={`Custom agentic AI applications built on 0nMCP. Agents with real tool access across ${MCP_SERVICES} services and ${MCP_TOOLS} tools that read your systems, decide, act, and report back in plain English. From $4,997, live in 3 weeks, client owns the code.`}
        serviceType="Agentic AI Application Development"
        url="https://rocketopp.com/services/agentic-ai-apps"
        price={4997}
      />
      <FAQSchema items={faqs} />
      <HowToSchema
        name="How RocketOpp ships an agentic AI app"
        description="A five-step process from named outcome to a supervised agent running in production, in three weeks."
        totalTime="P21D"
        steps={processSteps.map((s) => ({ name: s.title, text: s.body }))}
      />
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "https://rocketopp.com" },
          { name: "Services", url: "https://rocketopp.com/services" },
          {
            name: "Agentic AI Apps",
            url: "https://rocketopp.com/services/agentic-ai-apps",
          },
        ]}
      />

      <main className="min-h-screen">
        {/* ━━━ BLUF ━━━ */}
        <BlufBlock
          badge="Powered by 0nMCP"
          bottomLine="Most 'AI' a business buys can only talk. An agentic AI app can act — it reads your systems, decides what to do, uses real tools to do it, and writes back a plain-English record of what changed. From $4,997, running in three weeks, and the code is yours."
          context={`Your agent inherits ${MCP_TOOLS} tools across ${MCP_SERVICES} services on day one, because we are not writing integrations from scratch — we are pointing an agent at ones already running in production. Approval gates stay on anything irreversible until you take them off.`}
          stats={[
            { label: "Services wired", value: `${MCP_SERVICES}` },
            { label: "Tools available", value: MCP_TOOLS },
            { label: "Live in", value: "3 weeks" },
            { label: "Starts at", value: "$4,997" },
          ]}
          primaryCta={{ label: "Scope my agent", href: "/order?seed=agentic-ai-apps" }}
          secondaryCta={{ label: "See pricing", href: "#pricing" }}
        />

        {/* ━━━ Live ecosystem heartbeat ━━━ */}
        <EcosystemStrip />

        {/* ━━━ The problem ━━━ */}
        <section className="border-b border-border py-16 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="mx-auto max-w-3xl">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-yellow-500/30 bg-yellow-500/5 px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-widest text-yellow-500">
                <AlertTriangle className="h-3 w-3" />
                Why most business AI disappoints
              </div>
              <h2 className="text-balance text-3xl font-bold tracking-tight md:text-4xl">
                It was never allowed to touch anything.
              </h2>
              <div className="mt-6 space-y-4 text-base leading-relaxed text-muted-foreground md:text-lg">
                <p>
                  A company buys AI, wires it to a knowledge base, and gets a
                  system that answers questions about the work. The work itself
                  is still done by a person, who now also reads AI summaries.
                  That is a net increase in labour dressed up as automation.
                </p>
                <p>
                  The gap is not model quality. Models have been good enough for
                  a while. The gap is{" "}
                  <span className="font-semibold text-foreground">
                    permission and plumbing
                  </span>
                  {" "}— whether the AI can reach your CRM, your calendar, your
                  billing, and your inbox, and whether anyone trusted it enough
                  to let it write instead of read.
                </p>
                <p>
                  That is the entire job of an agentic build: give the model real
                  tools, real boundaries, and a record of what it did — so the
                  task finishes without a human in the middle of it.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ━━━ Capabilities ━━━ */}
        <section className="border-b border-border py-16 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="text-balance text-3xl font-bold tracking-tight md:text-5xl">
                What makes it{" "}
                <span className="bg-gradient-to-r from-fuchsia-500 via-purple-500 to-fuchsia-500 bg-clip-text text-transparent">
                  agentic
                </span>
              </h2>
              <p className="mt-3 text-base text-muted-foreground md:text-lg">
                Six things that separate an agent from a chat window.
              </p>
            </div>
            <div className="mx-auto mt-12 grid max-w-6xl gap-4 md:grid-cols-2 lg:grid-cols-3">
              {CAPABILITIES.map(({ Icon, title, body }) => (
                <div key={title} className="card-lifted p-6">
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-fuchsia-500/10 text-fuchsia-400">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mb-2 text-lg font-bold tracking-tight">
                    {title}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ━━━ Deliverables ━━━ */}
        <section className="border-b border-border py-16 md:py-24 bg-card/20">
          <div className="container px-4 md:px-6">
            <div className="mx-auto grid max-w-5xl gap-10 md:grid-cols-[1fr_1.2fr] md:items-start">
              <div>
                <h2 className="text-balance text-3xl font-bold tracking-tight md:text-4xl">
                  What you actually receive
                </h2>
                <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                  Not a demo and a slide deck. A working agent, the code behind
                  it, and enough documentation that your team can change it
                  without calling us.
                </p>
                <Link
                  href="/order?seed=agentic-ai-apps"
                  className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-primary-foreground shadow-[0_0_32px_rgba(255,107,53,0.3)] transition-transform hover:scale-[1.02]"
                >
                  Build my quote
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
              <ul className="space-y-3">
                {DELIVERABLES.map((d) => (
                  <li key={d} className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-fuchsia-400" />
                    <span className="text-sm leading-relaxed text-foreground/90">
                      {d}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* ━━━ Structural comparison (table-trap) ━━━ */}
        <IndustryVsUsTable
          heading="A typical AI build vs an agentic build"
          caption="Compared on structure and scope rather than benchmarks — we do not have a sourced industry study on agentic build costs, so we are not going to invent one."
          rows={comparisonRows}
          footnote="* Structural comparison of what is in scope and who owns what. The 'typical' column describes common practice we encounter in discovery, not a published benchmark."
        />

        {/* ━━━ Process ━━━ */}
        <ProcessTimeline
          heading="Three weeks, start to supervised production"
          caption="Five steps. You see the tool map before we write a line of agent code."
          steps={processSteps}
        />

        {/* ━━━ Pricing ━━━ */}
        <section
          id="pricing"
          className="relative overflow-hidden border-y border-border bg-card/20 py-16 md:py-24"
        >
          <div className="container px-4 md:px-6">
            <div className="mx-auto mb-12 max-w-3xl text-center">
              <h2 className="text-balance text-3xl font-bold tracking-tight md:text-5xl">
                <span className="bg-gradient-to-r from-fuchsia-500 via-purple-500 to-fuchsia-500 bg-clip-text text-transparent">
                  Agentic AI Pricing
                </span>
              </h2>
              <p className="mt-3 text-base text-muted-foreground md:text-lg">
                One-time builds, not seats. You own what we hand over.
              </p>
            </div>

            <div className="mx-auto grid max-w-6xl gap-5 lg:grid-cols-3">
              {tiers.map((tier) => (
                <div
                  key={tier.name}
                  className={`card-lifted-xl relative flex flex-col p-7 ${
                    tier.popular ? "border-2 border-fuchsia-500/50" : ""
                  }`}
                >
                  {tier.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-fuchsia-500 to-purple-600 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white">
                      Most scoped
                    </div>
                  )}
                  <p className="text-xs font-bold uppercase tracking-widest text-fuchsia-400">
                    {tier.name}
                  </p>
                  <div className="mt-3 flex items-baseline gap-2">
                    <span className="text-4xl font-bold tracking-tight">
                      {tier.price}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {tier.meta}
                  </p>
                  <p className="mt-4 text-sm font-semibold leading-snug">
                    {tier.headline}
                  </p>
                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                    {tier.bestFor}
                  </p>
                  <ul className="mt-6 flex-1 space-y-2.5">
                    {tier.features.map((f) => (
                      <li key={f} className="flex items-start gap-2">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-fuchsia-400" />
                        <span className="text-sm leading-snug text-foreground/85">
                          {f}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={tier.cta.href}
                    className={`mt-7 inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-bold transition-transform hover:scale-[1.02] ${
                      tier.popular
                        ? "bg-gradient-to-r from-fuchsia-500 to-purple-600 text-white"
                        : "bg-primary text-primary-foreground"
                    }`}
                  >
                    {tier.cta.label}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              ))}
            </div>

            <p className="mx-auto mt-8 max-w-2xl text-center text-xs leading-relaxed text-muted-foreground">
              Every build includes the repo at handoff, approval gates on
              irreversible actions, and 30 days of post-launch tuning. Hosting
              and model usage are billed at cost or run on your own accounts —
              your choice, decided during scoping.
            </p>
          </div>
        </section>

        {/* ━━━ FAQ (mirrors FAQSchema above) ━━━ */}
        <section className="border-b border-border py-16 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="mx-auto max-w-3xl">
              <h2 className="text-balance text-3xl font-bold tracking-tight md:text-4xl">
                Questions people actually ask
              </h2>
              <div className="mt-10 space-y-8">
                {faqs.map((faq) => (
                  <div
                    key={faq.question}
                    className="border-l-2 border-fuchsia-500/40 pl-5"
                  >
                    <h3 className="text-lg font-bold tracking-tight">
                      {faq.question}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {faq.answer}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ━━━ Final CTA ━━━ */}
        <section className="border-b border-border py-16 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="mx-auto max-w-3xl space-y-5 text-center">
              <h2 className="text-balance text-3xl font-bold tracking-tight md:text-4xl">
                Tell us the outcome. We will tell you if an agent can do it.
              </h2>
              <p className="text-base leading-relaxed text-muted-foreground">
                Some processes should not be handed to an agent, and we will say
                so — a scoping call that ends in &ldquo;automate this the boring
                way instead&rdquo; has saved people more than one that ends in a
                build.
              </p>
              <div className="flex flex-col justify-center gap-3 pt-2 sm:flex-row">
                <Link
                  href="/order?seed=agentic-ai-apps"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-7 py-3 text-base font-bold text-primary-foreground shadow-[0_0_32px_rgba(255,107,53,0.35)] transition-transform hover:scale-[1.02]"
                >
                  Build my custom quote
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-card/50 px-7 py-3 text-base font-semibold transition-colors hover:border-primary/40"
                >
                  Talk to Mike directly
                </Link>
              </div>
              <p className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                30 minutes from quote to kickoff
              </p>
            </div>
          </div>
        </section>

        {/* ━━━ Related ━━━ */}
        <RelatedServices links={relatedLinks} />
      </main>

      <Footer />
    </>
  )
}
