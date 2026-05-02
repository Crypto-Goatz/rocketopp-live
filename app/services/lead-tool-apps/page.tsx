import type { Metadata } from "next"
import Link from "next/link"
import {
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Search,
  ShieldCheck,
  Lightbulb,
  Clock,
  Zap,
  TrendingUp,
} from "lucide-react"
import Footer from "@/components/footer"
import { SectionBg } from "@/components/section-bg"

export const metadata: Metadata = {
  title: "AI Lead-Tool Apps — RocketOpp",
  description:
    "Three free / freemium AI tools that turn website visitors into qualified leads. SXO scans, marketing-claim verification, and 5-minute AI assessments. Drop on any site.",
  alternates: { canonical: "https://rocketopp.com/services/lead-tool-apps" },
}

interface LeadToolApp {
  slug: string
  name: string
  Icon: typeof Search
  tagline: string
  pitch: string
  features: string[]
  outcomes: string[]
  /** Per-app accent (data attribute on the wrapper div). */
  accent: "violet" | "green" | "amber"
  /** Internal page link. */
  href: string
  /** External live URL. */
  liveUrl: string
  pricing: string
}

const APPS: LeadToolApp[] = [
  {
    slug: "sxowebsite",
    name: "SXO Website Scanner",
    Icon: Search,
    tagline: "Free SXO scan + AI-citation audit · then turn it into a Living DOM rewrite",
    pitch:
      "Drops a free 60-second site scanner on the visitor's screen. Returns a personalized SXO score, top fixes, and a $4.88 step-by-step plan. Optional $8 upsell rewrites the entire site as a Living DOM with mutation engine + 147 behavioral metrics.",
    features: [
      "Free instant SXO score (0–100)",
      "AI-citation visibility check (GPTBot, Claude, Perplexity)",
      "$4.88 step-by-step fix plan upsell",
      "$8 Living DOM site rewrite upsell",
      "Email + CRM lead capture on every scan",
      "CRO9 mutation engine + 147 behavioral metrics",
      "BLUF, table-trap, and schema scoring",
    ],
    outcomes: [
      "20–60% visitor → email conversion on the scan widget",
      "Average $4.88 + $8 follow-on revenue per qualified lead",
      "Real-time pipeline of buyers self-identified by score",
    ],
    accent: "violet",
    href: "/family/sxowebsite",
    liveUrl: "https://sxowebsite.com",
    pricing: "Free scan · $4.88 fix plan · $8 Living DOM rewrite",
  },
  {
    slug: "verifiedsxo",
    name: "VerifiedSXO",
    Icon: ShieldCheck,
    tagline: "Verify every marketing claim — agency proof layer",
    pitch:
      "Public proof layer for marketers. Submit a claim, the K-layer verify engine fact-checks against Brave + DuckDuckGo + your knowledge base, and stamps a Seal of Truth. Agencies and creators get a $/mo public profile that turns trust into pipeline.",
    features: [
      "Free single-claim verification (3 sources)",
      "Pro: unlimited claims, AI elevation to 100%, priority support",
      "Public profile at /u/[slug] with shareable certificate",
      "Embeddable trust badges for any site",
      "K-layer API endpoint for 0nMCP / agent integrations",
      "Tiered keys: basic (3 sources) / deep (8 sources)",
      "Domain verification + ownership proof",
    ],
    outcomes: [
      "Verified-before-they-buy lift on agency pages (signal of trust)",
      "Public-profile membership upsell ($mo) once they've verified 3+ claims",
      "Compounding inbound link equity to /v/[id] verification pages",
    ],
    accent: "green",
    href: "/family/verifiedsxo",
    liveUrl: "https://verifiedsxo.com",
    pricing: "Free · $/mo Pro · $/mo public profile",
  },
  {
    slug: "apex-assessment",
    name: "Apex AI Assessment",
    Icon: Lightbulb,
    tagline: "Free 5-minute AI assessment — qualifies leads for higher-tier services",
    pitch:
      "Five-minute conversational assessment that scores a business on AI readiness, identifies the highest-leverage automation opportunity, and routes the visitor to the right product (CRM, AI Automation, MCP Integration, or full custom). Industry-tuned, multi-step, AI-narrated.",
    features: [
      "5-minute conversational flow (no static form)",
      "Industry-specific question paths (20+ verticals)",
      "AI-narrated personalized insights",
      "Maturity score with peer benchmark",
      "Top-3 next moves with cost + ROI estimates",
      "Auto-route to the right RocketOpp product",
      "CRM contact + tag with assessment data",
    ],
    outcomes: [
      "10x more qualified intros than a contact form",
      "Visitor leaves having self-identified their highest-priority service",
      "Sales team sees the answer matrix before the kickoff call",
    ],
    accent: "amber",
    href: "/apex",
    liveUrl: "https://rocketopp.com/apex",
    pricing: "Free assessment · routes to paid services from $797/mo",
  },
]

const ACCENT_GRADIENT: Record<LeadToolApp["accent"], string> = {
  violet: "from-violet-500/20 via-fuchsia-500/10 to-transparent",
  green: "from-emerald-500/20 via-teal-500/10 to-transparent",
  amber: "from-amber-500/20 via-orange-500/10 to-transparent",
}

const ACCENT_RING: Record<LeadToolApp["accent"], string> = {
  violet: "border-violet-500/40 hover:border-violet-500/60",
  green: "border-emerald-500/40 hover:border-emerald-500/60",
  amber: "border-amber-500/40 hover:border-amber-500/60",
}

const ACCENT_TEXT: Record<LeadToolApp["accent"], string> = {
  violet: "text-violet-400",
  green: "text-emerald-400",
  amber: "text-amber-400",
}

export default function LeadToolAppsPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden pt-24 pb-16 md:pt-32 md:pb-20">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.18] via-transparent to-transparent pointer-events-none" />
        <div className="absolute inset-0 grid-background opacity-[0.07] pointer-events-none" />
        <div className="container relative z-10 px-4 md:px-6">
          <div className="max-w-4xl">
            <Link
              href="/services"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-6"
            >
              ← All services
            </Link>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-sm font-medium text-primary mb-6">
              <Sparkles className="w-4 h-4" />
              AI Lead Gen Apps
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight mb-5">
              Three free AI tools that turn{" "}
              <span className="bg-gradient-to-r from-primary via-orange-400 to-primary bg-clip-text text-transparent animate-gradient-x">
                visitors into pipeline.
              </span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-3xl">
              Drop one of these on any site you own and watch leads
              self-qualify. Each tool is free or freemium — visitors get
              real value, you get an enriched contact + the right next-step
              offer.
            </p>
          </div>
        </div>
      </section>

      {/* Three apps */}
      <section className="relative overflow-hidden py-16 md:py-20">
        <SectionBg variant="solid-card" />
        <div className="container relative z-10 px-4 md:px-6">
          <div className="max-w-6xl mx-auto space-y-6">
            {APPS.map((app, i) => {
              const Icon = app.Icon
              return (
                <article
                  key={app.slug}
                  className={`relative overflow-hidden rounded-3xl border-2 bg-card/60 backdrop-blur ${ACCENT_RING[app.accent]} transition-colors`}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${ACCENT_GRADIENT[app.accent]} pointer-events-none`} />

                  <div className="relative grid md:grid-cols-[1.4fr_1fr]">
                    {/* Left: pitch */}
                    <div className="p-6 md:p-8">
                      <div className="flex items-center gap-3 mb-4">
                        <div className={`shrink-0 w-12 h-12 rounded-xl bg-${app.accent === "violet" ? "violet" : app.accent === "green" ? "emerald" : "amber"}-500/15 ${ACCENT_TEXT[app.accent]} flex items-center justify-center`}>
                          <Icon className="w-6 h-6" />
                        </div>
                        <div>
                          <p className={`text-xs font-bold uppercase tracking-widest ${ACCENT_TEXT[app.accent]}`}>
                            App {i + 1} of {APPS.length}
                          </p>
                          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
                            {app.name}
                          </h2>
                        </div>
                      </div>

                      <p className="text-base text-muted-foreground leading-relaxed mb-5">
                        {app.tagline}
                      </p>
                      <p className="text-sm text-foreground/85 leading-relaxed">
                        {app.pitch}
                      </p>

                      <div className="mt-6 grid sm:grid-cols-2 gap-x-6 gap-y-3">
                        {app.features.slice(0, 4).map((f) => (
                          <div key={f} className="flex items-start gap-2 text-sm">
                            <CheckCircle2 className={`w-4 h-4 ${ACCENT_TEXT[app.accent]} shrink-0 mt-0.5`} />
                            <span className="text-foreground/90 leading-snug">{f}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Right: stats + CTA */}
                    <div className="p-6 md:p-8 border-t md:border-t-0 md:border-l border-border bg-card/40 flex flex-col gap-4">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">
                          Pricing
                        </p>
                        <p className="text-base font-semibold leading-snug">
                          {app.pricing}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">
                          What you get
                        </p>
                        <ul className="space-y-2">
                          {app.outcomes.slice(0, 2).map((o) => (
                            <li key={o} className="flex items-start gap-2 text-sm">
                              <TrendingUp className={`w-3.5 h-3.5 ${ACCENT_TEXT[app.accent]} shrink-0 mt-1`} />
                              <span className="text-foreground/85 leading-snug">{o}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="mt-auto pt-2 space-y-2">
                        <Link
                          href={app.href}
                          className={`inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-bold text-primary-foreground hover:scale-[1.02] transition-transform`}
                        >
                          See full deep-dive
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                        <a
                          href={app.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-background/50 px-5 py-2 text-xs font-semibold text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors"
                        >
                          Try it live
                          <ArrowRight className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        </div>
      </section>

      {/* How they work together */}
      <section className="relative overflow-hidden py-20 md:py-28">
        <SectionBg variant="seam" />
        <div className="container relative z-10 px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/5 text-sm font-medium text-primary mb-6">
              <Zap className="w-4 h-4" />
              How they stack
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              One funnel. Three free entry points.
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-12">
              Drop the SXO Scanner on a content blog. Drop the Apex Assessment
              on a sales page. Stamp VerifiedSXO claims on every offer. Each
              one feeds the same CRM, the same scoring, the same pipeline.
            </p>
            <div className="grid md:grid-cols-3 gap-4 text-left">
              <div className="card-lifted p-5">
                <div className="text-primary text-2xl font-bold mb-2">1.</div>
                <p className="font-semibold mb-1">Visitor lands</p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Any traffic source — paid, organic, referral, social.
                </p>
              </div>
              <div className="card-lifted p-5">
                <div className="text-primary text-2xl font-bold mb-2">2.</div>
                <p className="font-semibold mb-1">Tool delivers value</p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Score, verification, or assessment in 60 seconds. They get
                  something real before you ask for anything.
                </p>
              </div>
              <div className="card-lifted p-5">
                <div className="text-primary text-2xl font-bold mb-2">3.</div>
                <p className="font-semibold mb-1">CRM enrichment</p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Email + tags + score + custom fields land in your CRM
                  with the right next-step offer pre-attached.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing-style summary */}
      <section className="relative overflow-hidden py-16 md:py-20">
        <SectionBg variant="solid-deep" />
        <div className="container relative z-10 px-4 md:px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">
              Want one (or all three) on your site?
            </h2>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="card-lifted-xl p-6 text-center">
                <p className="text-xs font-bold uppercase tracking-widest text-primary mb-2">Embed only</p>
                <p className="text-3xl font-bold mb-1">$0</p>
                <p className="text-sm text-muted-foreground mb-5">
                  Use the live tool with our branding. Free, forever.
                </p>
                <a
                  href="https://sxowebsite.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
                >
                  Try it live <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
              <div className="card-lifted-xl p-6 text-center border-2 border-primary/40">
                <p className="text-xs font-bold uppercase tracking-widest text-primary mb-2">White-label</p>
                <p className="text-3xl font-bold mb-1">$497<span className="text-sm font-normal text-muted-foreground">/mo</span></p>
                <p className="text-sm text-muted-foreground mb-5">
                  Your branding, your domain. Leads land in your CRM.
                </p>
                <Link
                  href="/order?seed=mcp-integration"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
                >
                  Build my quote <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
              <div className="card-lifted-xl p-6 text-center">
                <p className="text-xs font-bold uppercase tracking-widest text-primary mb-2">Custom build</p>
                <p className="text-3xl font-bold mb-1">$4,997+</p>
                <p className="text-sm text-muted-foreground mb-5">
                  Your own AI lead-tool app. We build it on the same engine.
                </p>
                <Link
                  href="/order?seed=ai-applications"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
                >
                  Build my quote <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative overflow-hidden py-16 md:py-20 border-t border-border">
        <SectionBg variant="solid-card" />
        <div className="container relative z-10 px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center space-y-5">
            <h2 className="text-3xl md:text-4xl font-bold">
              Pick the entry point that fits your funnel.
            </h2>
            <p className="text-muted-foreground">
              All three tools are live and free to try. Start with the one
              that matches your traffic — we'll wire it into your CRM in 60
              minutes.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
              <Link
                href="/order"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-7 py-3 text-base font-bold text-primary-foreground shadow-[0_0_32px_rgba(255,107,53,0.35)] hover:scale-[1.02] transition-transform"
              >
                Build my custom quote
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-card/50 px-7 py-3 text-base font-semibold hover:border-primary/40 transition-colors"
              >
                Talk to Mike directly
              </Link>
            </div>
            <p className="text-xs text-muted-foreground inline-flex items-center gap-1.5">
              <Clock className="w-3 h-3" />
              30 minutes from quote to kickoff
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}
