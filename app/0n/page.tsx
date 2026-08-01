import type { Metadata } from "next"
import Link from "next/link"
import {
  ArrowRight,
  Cpu,
  Rocket,
  Search,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Network,
  ExternalLink,
} from "lucide-react"
import {
  BreadcrumbSchema,
  FAQSchema,
} from "@/components/seo/json-ld"
import Footer from "@/components/footer"
import BlufBlock from "@/components/sxo/bluf-block"
import RelatedServices from "@/components/sxo/related-services"
import UcpLiveStrip from "@/components/ucp-live-strip"
import { FAMILY_MEMBERS } from "@/lib/rocketopp-family"

// ━━━ SEO Metadata ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const metadata: Metadata = {
  title: "The 0n Network — Every Product, One Orchestration Layer",
  description:
    "0nMCP, 0nCore, SXO Website, VerifiedSXO, Rocket+ and CRO9 — six live products sharing one orchestration layer of 1,640 tools across 111 services. All visitable, all running in production.",
  keywords: [
    "0n network",
    "0nMCP",
    "0nCore",
    "CRO9",
    "VerifiedSXO",
    "Rocket+",
    "SXO Website",
    "AI orchestration ecosystem",
    "MCP ecosystem",
    "RocketOpp products",
  ],
  openGraph: {
    title: "The 0n Network — Every Product, One Orchestration Layer",
    description:
      "Six live products on one orchestration layer. 1,640 tools, 111 services, all in production.",
    url: "https://rocketopp.com/0n",
    type: "website",
  },
  alternates: { canonical: "https://rocketopp.com/0n" },
}

// ━━━ Icon resolution (matches app/family/[slug]/page.tsx) ━━━━━━━━━━━━━━━━━━

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Cpu,
  Rocket,
  Search,
  ShieldCheck,
  Sparkles,
  TrendingUp,
}

function Icon({ name, className }: { name?: string; className?: string }) {
  const Cmp = name ? ICON_MAP[name] : null
  if (!Cmp) return <Sparkles className={className} />
  return <Cmp className={className} />
}

// ━━━ Page data ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * Per lib/stats.ts RULE 2, everything claimed here is checkable: every product
 * below is a live URL you can open, and the tool/service counts come from the
 * services.json meta block (0nMCP v4.20.0, generated 2026-07-10).
 */
const MCP_SERVICES = 111
const MCP_TOOLS = "1,640"

const faqs = [
  {
    question: "What is the 0n network?",
    answer:
      "Six live products that share one orchestration layer. 0nMCP is the layer itself — an open Model Context Protocol server exposing 1,640 tools across 111 services. The other five products are built on top of it: 0nCore (the platform), SXO Website (search experience scanning), VerifiedSXO (claim verification), Rocket+ (agency tooling), and CRO9 (conversion analytics). Every one is live and visitable without talking to anyone.",
  },
  {
    question: "Do I have to adopt the whole network to use any of it?",
    answer:
      "No. Each product stands alone and is used by people who have never touched the others. The advantage of the shared layer is that when you do add a second product, the integrations, credentials, and data model are already common — so the second one costs far less to adopt than the first.",
  },
  {
    question: "Is 0nMCP open source, and can I check the tool count myself?",
    answer:
      "0nMCP is published on npm as the 0nmcp package, so you can install it and enumerate the tools yourself rather than taking the number on faith. That is the intent — every figure on this site is meant to be checkable at a primary source.",
  },
  {
    question: "How does the network relate to RocketOpp's services?",
    answer:
      "RocketOpp is the studio; the 0n network is what the studio builds on. When we ship an agentic AI app or a SaaS platform for a client, it runs on the same orchestration layer these six products run on. That is why an integration-heavy build takes weeks rather than months — the connectors already exist and are already in production.",
  },
]

const relatedLinks = [
  {
    label: "Agentic AI Apps",
    href: "/services/agentic-ai-apps",
    hint: `$4,997 — agents with access to all ${MCP_TOOLS} tools`,
  },
  {
    label: "SaaS Platforms",
    href: "/services/saas-platforms",
    hint: "$12,500 — multi-tenant platforms on this same layer",
  },
  {
    label: "MCP Server Integration",
    href: "/services/mcp-integration",
    hint: "$1,997 — connect your stack to the orchestration layer",
  },
  {
    label: "0nMCP on npm",
    href: "https://www.npmjs.com/package/0nmcp",
    hint: "Install it and count the tools yourself",
    external: true,
  },
]

// ━━━ Page ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export default function ZeroNNetworkPage() {
  return (
    <>
      <FAQSchema items={faqs} />
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "https://rocketopp.com" },
          { name: "The 0n Network", url: "https://rocketopp.com/0n" },
        ]}
      />

      <main className="min-h-screen">
        {/* ━━━ BLUF ━━━ */}
        <BlufBlock
          badge="Six products, one layer"
          bottomLine={`The 0n network is six live products sharing a single orchestration layer of ${MCP_TOOLS} tools across ${MCP_SERVICES} services. Every one of them is running in production right now, and every one is open in a browser tab away from here.`}
          context="Most software ecosystems are a diagram. This one is a list of URLs you can open. The shared layer is why adding the second product costs a fraction of the first — the integrations, credentials, and data model are already common."
          stats={[
            { label: "Live products", value: `${FAMILY_MEMBERS.length}` },
            { label: "Services wired", value: `${MCP_SERVICES}` },
            { label: "Tools available", value: MCP_TOOLS },
            { label: "Orchestration layer", value: "0nMCP" },
          ]}
          primaryCta={{ label: "Start with 0nMCP", href: "/family/0nmcp" }}
          secondaryCta={{ label: "See what we build with it", href: "/services" }}
        />

        {/* ━━━ Live heartbeat ━━━ */}
        <UcpLiveStrip />

        {/* ━━━ The six ━━━ */}
        <section className="border-b border-border py-16 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="mx-auto max-w-3xl text-center">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-widest text-primary">
                <Network className="h-3 w-3" />
                The network
              </div>
              <h2 className="text-balance text-3xl font-bold tracking-tight md:text-5xl">
                Six products. All live.
              </h2>
              <p className="mt-3 text-base text-muted-foreground md:text-lg">
                Read the deep-dive, or skip us entirely and go use the thing.
              </p>
            </div>

            <div className="mx-auto mt-12 grid max-w-6xl gap-4 md:grid-cols-2 lg:grid-cols-3">
              {FAMILY_MEMBERS.map((m) => (
                <article
                  key={m.slug}
                  className="card-lifted flex flex-col p-6 transition-colors hover:border-primary/40"
                >
                  <div className="mb-4 flex items-center gap-3">
                    <div
                      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
                      style={{
                        backgroundColor: `${m.accent}1a`,
                        color: m.accent,
                      }}
                    >
                      <Icon name={m.icon} className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="truncate text-lg font-bold tracking-tight">
                        {m.name}
                      </h3>
                      <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-emerald-400">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                        {m.status}
                      </span>
                    </div>
                  </div>

                  <p className="flex-1 text-sm leading-relaxed text-muted-foreground">
                    {m.tagline}
                  </p>

                  <div className="mt-5 flex items-center gap-3 border-t border-border pt-4">
                    <Link
                      href={`/family/${m.slug}`}
                      className="inline-flex items-center gap-1.5 text-sm font-bold text-primary hover:underline"
                    >
                      Deep dive
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                    <a
                      href={m.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-auto inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground transition-colors hover:text-foreground"
                    >
                      Visit
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ━━━ Why one layer ━━━ */}
        <section className="border-b border-border bg-card/20 py-16 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="mx-auto max-w-3xl">
              <h2 className="text-balance text-3xl font-bold tracking-tight md:text-4xl">
                Why they all sit on one layer
              </h2>
              <div className="mt-6 space-y-4 text-base leading-relaxed text-muted-foreground md:text-lg">
                <p>
                  Every product above needs the same unglamorous things: talk to
                  a CRM, take a payment, send a message, read a spreadsheet,
                  store a file. Built separately, that is the same integration
                  work repeated six times, ageing in six different ways.
                </p>
                <p>
                  0nMCP is that work done once.{" "}
                  <span className="font-semibold text-foreground">
                    {MCP_TOOLS} tools across {MCP_SERVICES} services
                  </span>
                  , maintained in one place, available to anything built on top
                  of it — including the platforms and agents we build for
                  clients.
                </p>
                <p>
                  Which is the honest reason our build timelines look short. We
                  are not writing connectors during your engagement. We are
                  pointing your product at ones that have been running in
                  production across six live products.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ━━━ FAQ (mirrors FAQSchema) ━━━ */}
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
                    className="border-l-2 border-primary/40 pl-5"
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

        <RelatedServices links={relatedLinks} />
      </main>

      <Footer />
    </>
  )
}
