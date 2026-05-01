import type { Metadata } from "next"
import Link from "next/link"
import {
  Search,
  CheckCircle,
  ArrowRight,
  TrendingUp,
  BarChart3,
  Globe,
  Zap,
  Target,
  Eye,
  Rocket,
  ShieldCheck,
  Bot,
  Workflow,
  Activity,
  AlertTriangle,
  Sparkles,
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

// ━━━ SEO Metadata ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const metadata: Metadata = {
  title:
    "SXO (Search Experience Optimization) — Pricing, Process, Results | RocketOpp",
  description:
    "SXO replaces SEO for the AI era. Combine search optimization, UX, and conversion in one strategy — powered by CRO9 and the 0n ecosystem. Pricing from $997/mo. First customer: 82 → 92 score in under 30 days.",
  keywords: [
    "SXO pricing",
    "search experience optimization",
    "SEO is dead",
    "AI SEO 2026",
    "llms.txt service",
    "Living DOM website",
    "AI Overviews optimization",
    "GEO optimization",
    "AEO optimization",
    "ChatGPT visibility",
    "Perplexity citations",
    "Google AI Overviews ranking",
    "SXO vs SEO",
    "RocketOpp SXO",
    "CRO9",
    "0nMCP",
  ],
  openGraph: {
    title: "SXO — The SEO Replacement for the AI Era | RocketOpp",
    description:
      "SXO from $997/mo. Search + UX + Conversion + AI engine readiness in one protocol. Powered by CRO9.",
    url: "https://rocketopp.com/services/sxo",
    type: "website",
  },
  alternates: { canonical: "https://rocketopp.com/services/sxo" },
}

// ━━━ Page data — content lives at the top, layout below ━━━━━━━━━━━━━━━━━━━━

const tiers = [
  {
    name: "SXO Starter",
    price: "$997/mo",
    headline: "Get on the AI map in 30 days.",
    bestFor: "Local businesses + service providers under $1M ARR.",
    features: [
      "Technical SXO audit + fixes (Living DOM, schema, llms.txt)",
      "On-page rewrite for 10 pages",
      "Keyword + question-intent strategy",
      "Google Business Profile optimization",
      "Schema.org + JSON-LD across the site",
      "Core Web Vitals tune-up",
      "Monthly performance + AI-citation report",
      "CRO9 mutation engine on 1 high-value page",
    ],
  },
  {
    name: "SXO Growth",
    price: "$1,997/mo",
    popular: true,
    headline: "Compound growth across content + conversion.",
    bestFor: "Funded startups + growing service businesses ($1M-$10M ARR).",
    features: [
      "Everything in Starter, plus —",
      "AI-crafted content engine (4 articles/month, BLUF + table-trap)",
      "Curated link building (10 quality backlinks/mo)",
      "Conversion rate optimization (A/B + UX rewrites)",
      "Local SXO across 3 locations",
      "AI engine readiness (ChatGPT, Perplexity, Claude, AI Overviews)",
      "CRO9 active on every landing page",
      "Bi-weekly strategy calls",
    ],
  },
  {
    name: "SXO Enterprise",
    price: "$3,997/mo",
    headline: "Authority across an entire vertical.",
    bestFor: "Multi-location and enterprise (10+ ARR).",
    features: [
      "Everything in Growth, plus —",
      "Full content engine (12 articles/mo across pillar + spoke)",
      "Advanced citation acquisition (25+/mo)",
      "AI-powered content + competitor delta analysis",
      "Multi-location SXO (unlimited)",
      "E-commerce SXO + product schema",
      "Weekly strategy calls + dedicated account lead",
      "Direct line into the 0nMCP orchestrator",
    ],
  },
]

const comparisonRows = [
  {
    dimension: "Monthly investment",
    industry: "$2,000–$5,000/mo",
    rocketopp: "$997–$3,997/mo",
    win: true,
  },
  {
    dimension: "Time to first measurable lift",
    industry: "3–6 months",
    rocketopp: "2–4 weeks for technical, 60 days for organic",
    win: true,
  },
  {
    dimension: "AI engine optimization (ChatGPT, Perplexity, AI Overviews)",
    industry: "Not offered",
    rocketopp: "Built into every plan",
    win: true,
  },
  {
    dimension: "llms.txt deployed and maintained",
    industry: "Not offered",
    rocketopp: "Custom file shipped on day 1",
    win: true,
  },
  {
    dimension: "Living DOM mutation engine",
    industry: "Not offered",
    rocketopp: "CRO9 active across the site",
    win: true,
  },
  {
    dimension: "Content production",
    industry: "Outsourced to writers, $200/article",
    rocketopp: "AI + human review, 4–12 articles/mo included",
    win: true,
  },
  {
    dimension: "Reporting cadence",
    industry: "Monthly PDF",
    rocketopp: "Live dashboard + monthly strategy report",
    win: true,
  },
  {
    dimension: "Contract length",
    industry: "6–12 months",
    rocketopp: "Month-to-month, cancel anytime",
    win: true,
  },
]

const processSteps = [
  {
    number: "01",
    title: "Free SXO scan",
    when: "Hour 1",
    body: "Run your domain through the same Living DOM engine that ranks every site we work with. You get a current score, the biggest blocker, and a target score before we ever ship.",
    icon: Search,
  },
  {
    number: "02",
    title: "Living DOM rewrite",
    when: "Day 1–7",
    body: "We deploy the BLUF + table-trap content structure, schema, and a custom llms.txt to your domain. ChatGPT, Perplexity, Claude, and Google AI Overviews can now find and cite you.",
    icon: Workflow,
  },
  {
    number: "03",
    title: "CRO9 mutation engine on",
    when: "Week 2",
    body: "Self-optimizing content blocks go live across your high-value pages. CRO9 watches visitor behavior and rewrites in real time — no A/B tools, no manual tuning.",
    icon: Bot,
  },
  {
    number: "04",
    title: "Content engine + citations",
    when: "Month 1+",
    body: "We ship 4–12 articles/mo using the same SXO patterns that earned Outlook Financial Center an 82 → 92 score lift in under 30 days. Citation outreach runs in parallel.",
    icon: Rocket,
  },
  {
    number: "05",
    title: "Live reporting + strategy",
    when: "Ongoing",
    body: "You get a live dashboard showing rankings, AI citations, conversion deltas, and what we shipped this week. Bi-weekly or weekly calls depending on plan.",
    icon: BarChart3,
  },
  {
    number: "06",
    title: "Compound and expand",
    when: "Quarter 2+",
    body: "Once the foundation is set, we layer pillar/spoke content, multi-location SXO, and link building. The site gets stronger every month — automatically and intentionally.",
    icon: TrendingUp,
  },
]

const faqs = [
  {
    question: "What is SXO and how is it actually different from SEO?",
    answer:
      "SXO (Search Experience Optimization) is the SEO replacement built for the AI era. SEO optimized for ten blue links. SXO optimizes for AI engines (ChatGPT, Perplexity, Claude, Google AI Overviews) AND traditional search AND user experience AND conversion — in one protocol. The difference shows up in three places: structured content (BLUF + table-trap), explicit AI signals (llms.txt + schema), and a Living DOM that updates itself based on what's working. We don't just rank you, we make sure that rank converts.",
  },
  {
    question: "How much does professional SXO cost in 2026?",
    answer:
      "Industry average for professional SEO is $2,000–$5,000/month. RocketOpp's SXO starts at $997/month because our CRO9 engine automates the analysis and content optimization work that takes traditional agencies 10x longer. The Growth plan ($1,997/mo) is what most operators land on; Enterprise ($3,997/mo) is for multi-location and 10M+ ARR companies. Every plan is month-to-month with a 30-day results guarantee.",
  },
  {
    question: "Will my site actually get cited by ChatGPT and Perplexity?",
    answer:
      "Yes — that's the entire point of the AI-engine readiness layer. We deploy a custom llms.txt that tells AI assistants who you serve, what you offer, and what to cite. We restructure your H2s as questions (the format AI engines prefer for answers). We add FAQPage and HowTo schema where they fit. Outlook Financial Center, our first paying customer, was projected to start getting AI citations within 14 days of the rewrite shipping.",
  },
  {
    question: "How long until I see results?",
    answer:
      "Technical fixes and Living DOM rewrites show measurable changes within 2–4 weeks. AI engine citations typically start within 14–30 days. Traditional keyword rankings move within 60–90 days. Full SXO impact (rankings + AI citations + traffic + conversions compounding together) is usually clearly visible by month 3. We send a monthly report tracking all four signals from day one.",
  },
  {
    question: "Do you guarantee first-page rankings?",
    answer:
      "We don't guarantee specific rankings — no honest agency can, because Google's algorithm has 200+ factors and AI-engine ranking is even more opaque. What we guarantee is measurable improvement against a target you set with us at kickoff (e.g. organic traffic, MQLs, AI citations, score lift). Hit the target in 30 days or we keep working at no extra charge until we do.",
  },
  {
    question: "What's CRO9 and why does it matter?",
    answer:
      "CRO9 is our self-learning Conversion Rate Optimization engine. It runs as a Living DOM mutation layer on your site — observing visitor behavior in real time and rewriting content blocks (headlines, CTAs, social proof) without you needing to A/B-test manually. The result: every visitor sees the version of your page most likely to convert them, refreshed continuously. It's one of the reasons SXO outperforms classic SEO on conversion at every tier.",
  },
  {
    question: "How does SXO connect to the rest of the 0n ecosystem?",
    answer:
      "Every SXO engagement plugs into 0nMCP (the orchestrator powering 1,500+ tools and 96 services), the 0nCore command center, and the Universal Capability Protocol (UCP) at 0ncore.com. That means content generation, CRM sync, email automation, social distribution, and analytics all share one source of truth. It's also why our content engine ships 4–12 SXO-perfect articles a month at the price most agencies charge for one.",
  },
  {
    question: "What's included in the monthly reports?",
    answer:
      "Every report covers: keyword rankings (organic + AI engine), traffic trends, conversion deltas, AI citations earned, technical health, backlink profile, competitor delta, and a prioritized action plan for the coming month. No vanity metrics, no fluff — only signals that map to revenue.",
  },
  {
    question: "Can I cancel anytime?",
    answer:
      "Yes. Every SXO plan is month-to-month with a 30-day results guarantee. If we don't hit the target we agreed to at kickoff, we keep working at no extra charge until we do — or you cancel and we pay back the last month. No long-term contracts, no surprise auto-renewals.",
  },
]

const relatedLinks = [
  {
    label: "AI Business Automation",
    href: "/services/ai-automation",
    hint: "$2,997 — custom AI systems that run your operations",
  },
  {
    label: "CRM Setup & Automation",
    href: "/services/crm-automation",
    hint: "$1,497 — full CRM with pipelines + lead scoring",
  },
  {
    label: "MCP Server Integration",
    href: "/services/mcp-integration",
    hint: "$1,997 — one integration, 1,500+ tools",
  },
  {
    label: "PPC & Paid Ads",
    href: "/services/ppc-management",
    hint: "$797/mo — Google + Meta + LinkedIn, AI-optimized",
  },
  {
    label: "Run a free SXO scan",
    href: "https://sxowebsite.com/scan",
    hint: "Same engine that scored Outlook Financial Center",
    external: true,
  },
  {
    label: "Read the SXO playbook",
    href: "/blog",
    hint: "What we publish, what we ship, what's working",
  },
]

// ━━━ Page ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export default function SXOPage() {
  return (
    <>
      <ServiceOfferSchema
        name="SXO — Search Experience Optimization"
        description="SXO replaces SEO for the AI era. Combines search optimization, user experience, conversion, and AI engine readiness in one protocol."
        serviceType="Search Experience Optimization"
        url="https://rocketopp.com/services/sxo"
        price={997}
        priceUnit="MONTH"
      />
      <FAQSchema items={faqs} />
      <HowToSchema
        name="How RocketOpp ships an SXO engagement"
        description="A 6-step process from free scan to compounding growth."
        totalTime="P30D"
        steps={processSteps.map((s) => ({
          name: s.title,
          text: s.body,
        }))}
      />
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "https://rocketopp.com" },
          { name: "Services", url: "https://rocketopp.com/services" },
          { name: "SXO", url: "https://rocketopp.com/services/sxo" },
        ]}
      />

      <main className="min-h-screen">
        {/* ━━━ BLUF + Living DOM hero ━━━ */}
        <BlufBlock
          badge="Powered by CRO9 + 0nMCP"
          bottomLine="SEO is dead. SXO replaces it — combining search, UX, conversion, and AI-engine readiness into one self-optimizing protocol that gets your site cited by ChatGPT, Perplexity, and Google AI Overviews while compounding organic traffic."
          context="The same engine that earned our first paying customer an 82 → 92 score lift in under 30 days. Living DOM rewrites, custom llms.txt, schema markup, and a CRO9 mutation engine — all included in every plan."
          stats={[
            { label: "Score lift example", value: "82 → 92" },
            { label: "First citations within", value: "14 days" },
            { label: "Starts at", value: "$997/mo" },
            { label: "Month-to-month", value: "0 contracts" },
          ]}
          primaryCta={{ label: "Run a free SXO scan", href: "https://sxowebsite.com/scan" }}
          secondaryCta={{ label: "See pricing", href: "#pricing" }}
        />

        {/* ━━━ Live ecosystem heartbeat ━━━ */}
        <UcpLiveStrip />

        {/* ━━━ The cost of inaction ━━━ */}
        <section className="border-b border-border py-16 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="mx-auto max-w-3xl">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-yellow-500/30 bg-yellow-500/5 px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-widest text-yellow-500">
                <AlertTriangle className="h-3 w-3" />
                What happens without SXO
              </div>
              <h2 className="text-balance text-3xl font-bold tracking-tight md:text-4xl">
                The site you built for Google in 2018 is invisible to the AI in 2026.
              </h2>
              <div className="mt-6 space-y-4 text-base leading-relaxed text-muted-foreground md:text-lg">
                <p>
                  Google AI Overviews now answer <strong className="text-foreground">47% of informational queries</strong> directly — no click required. Zero-click searches are 65% of results. Perplexity and ChatGPT are pulling 30% of discovery traffic that used to flow through search results.
                </p>
                <p>
                  <strong className="text-foreground">If your site doesn&apos;t have a Living DOM, schema markup, and an llms.txt</strong> — the answer engines have nothing to cite. Your competitors get the citation. You get nothing.
                </p>
                <p>
                  SXO is the only category of service that fixes all three layers at once: traditional search rankings, AI engine citations, and on-page conversion. Everything else is a half-measure.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ━━━ What SXO actually covers (6 pillars) ━━━ */}
        <section className="border-b border-border py-16 md:py-24 bg-card/30">
          <div className="container px-4 md:px-6">
            <div className="mx-auto max-w-3xl text-center mb-12">
              <h2 className="text-balance text-3xl font-bold tracking-tight md:text-4xl">
                Six pillars. One protocol. Every plan.
              </h2>
              <p className="mt-3 text-base text-muted-foreground md:text-lg">
                SXO isn&apos;t a stack of disconnected services — it&apos;s one continuous loop where every layer makes the next one stronger.
              </p>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  icon: Search,
                  title: "Search optimization",
                  desc: "Technical audit, on-page rewrites, schema, internal link graph, Core Web Vitals, mobile UX. The classic SEO surface — done right.",
                },
                {
                  icon: Eye,
                  title: "User experience",
                  desc: "Heatmaps, scroll depth, friction analysis. Every page judged by how a real user moves through it, not just how a crawler reads it.",
                },
                {
                  icon: Target,
                  title: "Conversion optimization",
                  desc: "A/B tests, CTA rewrites, funnel analysis, friction removal. The point of all the traffic is revenue. CRO9 watches and rewrites in real time.",
                },
                {
                  icon: Bot,
                  title: "AI engine readiness",
                  desc: "Custom llms.txt, BLUF restructuring, FAQ schema, HowTo schema, table-traps. Built specifically for ChatGPT, Perplexity, Claude, and AI Overviews.",
                },
                {
                  icon: Globe,
                  title: "Content engine",
                  desc: "AI-crafted articles using the same SXO patterns that score 90+. Pillar + spoke architecture. Topic-cluster authority compounding monthly.",
                },
                {
                  icon: BarChart3,
                  title: "Live analytics + reporting",
                  desc: "Live dashboard, monthly deep-dive, weekly digest. Every signal tied to revenue. No vanity metrics, no fluff, no &quot;impressions are up&quot; charts.",
                },
              ].map((item) => {
                const Icon = item.icon
                return (
                  <div
                    key={item.title}
                    className="rounded-2xl border border-border bg-card/50 p-6 backdrop-blur transition-colors hover:border-primary/40"
                  >
                    <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl border border-primary/30 bg-primary/10 text-primary">
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="text-lg font-bold text-foreground">{item.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {item.desc}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* ━━━ Industry vs RocketOpp comparison ━━━ */}
        <IndustryVsUsTable
          heading="SXO vs the industry-average SEO agency"
          caption="The same scope of work, side-by-side. We're not cheaper because we cut corners — we're cheaper because the AI does the analysis the agency charges you to do manually."
          rows={comparisonRows}
          footnote="* Industry averages from Clutch.co, Agency Analytics, WebFX, and Search Engine Journal 2026 data."
        />

        {/* ━━━ Process timeline ━━━ */}
        <ProcessTimeline
          heading="How an SXO engagement actually ships"
          caption="Six steps. Day 1 to compounding growth. No mystery."
          steps={processSteps}
        />

        {/* ━━━ Pricing ━━━ */}
        <section
          id="pricing"
          className="relative overflow-hidden border-y border-border py-16 md:py-24 bg-card/20"
        >
          <div className="container px-4 md:px-6">
            <div className="mx-auto max-w-3xl text-center mb-12">
              <h2 className="text-balance text-3xl font-bold tracking-tight md:text-5xl">
                <span className="bg-gradient-to-r from-primary via-orange-400 to-primary bg-clip-text text-transparent">
                  SXO Plans
                </span>
              </h2>
              <p className="mt-3 text-base text-muted-foreground md:text-lg">
                Month-to-month. Cancel anytime. 30-day results guarantee on every plan.
              </p>
            </div>

            <div className="mx-auto grid max-w-6xl grid-cols-1 gap-5 lg:grid-cols-3">
              {tiers.map((tier) => (
                <div
                  key={tier.name}
                  className={`relative flex flex-col rounded-2xl border p-7 backdrop-blur ${
                    tier.popular
                      ? "border-primary/40 bg-gradient-to-br from-primary/[0.05] via-card/40 to-transparent ring-1 ring-primary/20"
                      : "border-border bg-card/40"
                  }`}
                >
                  {tier.popular && (
                    <div className="absolute -top-3 left-7 inline-flex items-center gap-1 rounded-full bg-primary px-3 py-0.5 font-mono text-[10px] font-bold uppercase tracking-widest text-primary-foreground">
                      <Sparkles className="h-3 w-3" />
                      Most popular
                    </div>
                  )}
                  <h3 className="text-xl font-bold text-foreground">{tier.name}</h3>
                  <div className="mt-1 text-sm text-muted-foreground">{tier.headline}</div>
                  <div className="mt-5">
                    <span className="text-4xl font-black text-primary">{tier.price}</span>
                  </div>
                  <p className="mt-3 text-xs italic text-muted-foreground">{tier.bestFor}</p>
                  <ul className="mt-5 flex-1 space-y-2.5">
                    {tier.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm">
                        <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                        <span
                          className={
                            f.startsWith("Everything in")
                              ? "font-semibold text-foreground"
                              : "text-muted-foreground"
                          }
                        >
                          {f}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    asChild
                    size="lg"
                    className="mt-6 w-full"
                    variant={tier.popular ? "default" : "outline"}
                  >
                    <Link href="/contact">
                      Start {tier.name.replace("SXO ", "")}
                      <ArrowRight className="ml-1.5 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              ))}
            </div>

            {/* 30-day guarantee — risk-reversal anchor under pricing */}
            <div className="mx-auto mt-10 max-w-3xl rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/[0.06] via-card/40 to-transparent p-6 md:p-8">
              <div className="flex flex-col items-center gap-4 md:flex-row">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-primary/30 bg-primary/15">
                  <ShieldCheck className="h-7 w-7 text-primary" />
                </div>
                <div className="flex-1 text-center md:text-left">
                  <div className="mb-1 font-mono text-[10px] uppercase tracking-widest text-primary">
                    30-day results guarantee
                  </div>
                  <h3 className="text-lg font-bold md:text-xl">
                    Hit your KPI, or we keep working until you do.
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Every engagement starts with one measurable goal — score lift, citations
                    earned, organic conversions, MQLs. Miss it in 30 days and we keep
                    building at no extra charge until we hit it.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ━━━ FAQ ━━━ */}
        <section className="border-b border-border py-16 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="mx-auto max-w-3xl text-center mb-12">
              <h2 className="text-balance text-3xl font-bold tracking-tight md:text-4xl">
                Frequently asked questions
              </h2>
              <p className="mt-3 text-base text-muted-foreground md:text-lg">
                Real answers, no agency-speak.
              </p>
            </div>
            <div className="mx-auto max-w-3xl space-y-4">
              {faqs.map((faq) => (
                <details
                  key={faq.question}
                  className="group rounded-2xl border border-border bg-card/50 p-5 transition-colors hover:border-primary/40"
                >
                  <summary className="flex cursor-pointer items-start justify-between gap-3 list-none">
                    <h3 className="text-base font-bold text-foreground md:text-lg">
                      {faq.question}
                    </h3>
                    <span className="font-mono text-xl text-primary transition-transform group-open:rotate-45">
                      +
                    </span>
                  </summary>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground md:text-base">
                    {faq.answer}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* ━━━ Final CTA ━━━ */}
        <section className="relative overflow-hidden border-b border-border py-16 md:py-24">
          <div
            aria-hidden
            className="pointer-events-none absolute -top-32 left-1/2 h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-primary/[0.06] blur-[140px]"
          />
          <div className="container relative z-10 px-4 md:px-6">
            <div className="mx-auto max-w-3xl rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/[0.05] via-card/40 to-transparent p-10 text-center md:p-14">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/8 px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-widest text-primary">
                <Activity className="h-3 w-3" />
                Free · No credit card · 60 seconds
              </div>
              <h2 className="text-balance text-3xl font-bold tracking-tight md:text-5xl">
                Run your free SXO scan now.
              </h2>
              <p className="mt-4 text-base leading-relaxed text-muted-foreground md:text-lg">
                Same engine. Same patterns. Same scoring used in every paid engagement.
                Find out exactly where your site is losing traffic to AI engines and what
                to fix first.
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Button asChild size="lg" className="text-base">
                  <Link
                    href="https://sxowebsite.com/scan"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Run free SXO scan
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="text-base">
                  <Link href="/contact">Talk to a strategist</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* ━━━ Related services (internal-link cluster) ━━━ */}
        <RelatedServices links={relatedLinks} />
      </main>

      <Footer />
    </>
  )
}
