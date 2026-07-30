import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import {
  ArrowRight,
  Globe,
  Cpu,
  Search,
  Zap,
  CheckCircle2,
  Sparkles,
  Bot,
  Clock,
  Target,
  Terminal,
  BarChart3,
  Shield,
  DollarSign,
  Rocket,
  ExternalLink
} from "lucide-react"
import type { Metadata } from "next"
import Footer from "@/components/footer"
import { OrganizationSchema, WebsiteSchema, FAQSchema, LocalBusinessSchema } from "@/components/seo/json-ld"
import { VideoBackground, ROCKETOPP_HERO_VIDEO } from "@/components/video-background"
import LiveActivityTicker from "@/components/live-activity-ticker"
import TrustStrip from "@/components/trust-strip"
import UcpLiveStrip from "@/components/ucp-live-strip"
import { SectionBg } from "@/components/section-bg"
import { StatBig, StatCard, StatInline } from "@/components/home/stat"
import { SEARCH_SHIFT, LOCAL_INTENT, OUR_NUMBERS, SELF_PROOF } from "@/lib/stats"

export const metadata: Metadata = {
  title: "AI Can Build a Website. It Can't Make Anyone Find It.",
  description:
    "We build personalized business systems for entrepreneurs — powered by 0nMCP and CRO9. Websites, automation and AI systems for Western PA businesses. Fixed quotes, no discovery-call gate.",
  keywords: [
    "website development pricing",
    "how much does a website cost",
    "SEO pricing",
    "CRM setup cost",
    "AI business automation pricing",
    "PPC management cost",
    "MCP server integration",
    "digital agency transparent pricing",
    "affordable website development",
    "AI automation for business",
    "SXO services",
    "CRM automation pricing",
    "Google Ads management pricing",
    "RocketOpp",
    "0nMCP",
    "CRO9",
  ],
  authors: [{ name: "RocketOpp", url: "https://rocketopp.com" }],
  creator: "RocketOpp",
  publisher: "RocketOpp",
  metadataBase: new URL("https://rocketopp.com"),
  alternates: { canonical: "https://rocketopp.com" },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://rocketopp.com",
    title: "AI Can Build a Website. It Can't Make Anyone Find It. | RocketOpp",
    description:
      "Websites, AI automation, CRM, SXO, PPC and MCP integration. Enterprise quality at the local level.",
    siteName: "RocketOpp",
    images: [
      {
        url: "https://rocketopp.com/images/rocketopp-og.png",
        width: 1200,
        height: 630,
        alt: "RocketOpp - Enterprise AI Systems at Startup Speed",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Can Build a Website. It Can't Make Anyone Find It. | RocketOpp",
    description:
      "Fixed quotes. No discovery calls. Websites, automation and AI systems.",
    site: "@rocketopp",
    creator: "@rocketopp",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  category: "Technology",
  classification: "Business Software",
}

const differentiators = [
  {
    icon: Shield,
    title: "Enterprise Quality",
    description:
      "We use the same AI infrastructure Fortune 500 companies pay millions for. You get it at 1/10th the cost.",
  },
  {
    icon: Zap,
    title: "Ships Fast",
    description:
      "Our AI-powered workflow (0nMCP) means what takes agencies weeks takes us days.",
  },
  {
    icon: DollarSign,
    title: "Transparent Pricing",
    description:
      "No surprise invoices. No scope creep. Price is on the website. Period.",
  },
  {
    icon: Bot,
    title: "AI-Native",
    description:
      "Every system we build runs on AI from day one. Not bolted on. Built in.",
  },
]

const services = [
  {
    icon: Globe,
    title: "Website Development",
    description:
      "Custom websites built with AI. Mobile-first, SEO-optimized, conversion-focused. Launches in 2 weeks, not 2 months.",
    shipsIn: "2 weeks",
    href: "/services/website-development",
  },
  {
    icon: Cpu,
    title: "AI for Business",
    description:
      "Custom AI systems that automate your operations. From customer service to lead qualification to content creation.",
    shipsIn: "2 weeks",
    href: "/services/ai-automation",
  },
  {
    icon: Search,
    title: "SXO (Search Experience Optimization)",
    description:
      "SEO is dead. SXO combines search optimization, user experience, and conversion — powered by CRO9.",
    shipsIn: "Ongoing",
    href: "/services/sxo",
  },
  {
    icon: Target,
    title: "CRM Automation",
    description:
      "Full CRM setup with automated pipelines, email sequences, appointment booking, and lead scoring.",
    shipsIn: "1 week",
    href: "/services/crm-automation",
  },
  {
    icon: BarChart3,
    title: "PPC & Paid Ads",
    description:
      "Google Ads, Meta Ads, LinkedIn Ads — managed by AI, optimized by CRO9. Real ROI, not vanity metrics.",
    shipsIn: "Ongoing",
    href: "/services/ppc-management",
  },
  {
    icon: Terminal,
    title: "MCP Server Integration",
    description:
      "Connect your business to 1,640+ tools across 109 services. One integration, unlimited automation.",
    shipsIn: "1 week",
    href: "/services/mcp-integration",
  },
]

export default function HomePage() {
  return (
    <>
      <OrganizationSchema
        description="Enterprise AI systems at startup speed. Websites, automation, CRM, SXO, PPC and MCP integration. Powered by 0nMCP and CRO9."
        sameAs={[
          "https://twitter.com/rocketopp",
          "https://linkedin.com/company/rocketopp",
          "https://github.com/rocketopp",
          "https://0nmcp.com",
          "https://cro9.com",
        ]}
      />
      <WebsiteSchema
        description="Enterprise AI systems at startup speed. Fixed quotes, no discovery calls."
      />
      <LocalBusinessSchema
        description="Web design, development, local SEO and AI automation for businesses across Westmoreland and eastern Allegheny County, PA."
        priceRange="$$"
      />

      <main className="min-h-screen">
        {/* ================= HERO ================= */}
        <section className="relative overflow-hidden pt-24 pb-16 md:pt-28 md:pb-20">
          <VideoBackground
            src={ROCKETOPP_HERO_VIDEO}
            eager
            overlay="radial"
            className="opacity-80"
          />
          <div className="absolute inset-0 grid-background opacity-[0.08] pointer-events-none" />
          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-background pointer-events-none" />

          <div className="container relative z-10 px-4 md:px-6">
            <div className="grid items-center gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
              {/* ---- Left: the positioning ---- */}
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary">
                  <Sparkles className="h-4 w-4" />
                  AI-native web design · Western PA
                </div>

                <h1 className="mt-7 text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
                  AI can build a website.
                  <br />
                  <span className="bg-gradient-to-r from-primary via-orange-400 to-primary bg-clip-text text-transparent animate-gradient-x">
                    It can&rsquo;t make anyone find it.
                  </span>
                </h1>

                <p className="mt-7 max-w-xl text-lg leading-relaxed text-muted-foreground">
                  So can Wix. So can ChatGPT. What none of them do is the part that actually
                  decides whether your phone rings — getting you cited by AI search, ranked in
                  your own town, and wired so every lead lands in your CRM instead of an inbox.
                </p>

                <p className="mt-5 max-w-xl leading-relaxed text-muted-foreground">
                  We build the AI. <span className="font-semibold text-foreground">0nMCP</span>,{' '}
                  <span className="font-semibold text-foreground">CRO9</span> and{' '}
                  <span className="font-semibold text-foreground">web0n</span> are ours —{' '}
                  <span className="font-mono text-foreground">1,640+</span> tools across{' '}
                  <span className="font-mono text-foreground">109</span> services, running in
                  production. You are not renting someone else&rsquo;s stack.
                </p>

                <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                  <Button size="lg" className="animate-pulse-glow px-8 py-6 text-lg" asChild>
                    <Link href="/497-website">
                      Get the $497 website
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" className="px-8 py-6 text-lg" asChild>
                    <Link href="/health-check">Scan my site free</Link>
                  </Button>
                </div>
              </div>

              {/* ---- Right: the $497 offer, featured ---- */}
              <div className="relative">
                <div className="absolute -inset-4 rounded-[2rem] bg-primary/15 blur-3xl" aria-hidden />
                <div className="relative overflow-hidden rounded-3xl border border-primary/30 bg-card/95 p-7 backdrop-blur sm:p-8">
                  <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary via-orange-400 to-primary" />

                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary">
                    <Zap className="h-4 w-4" />
                    This week only
                  </div>

                  <div className="mt-5 flex items-end gap-3">
                    <span className="font-mono text-6xl font-bold leading-none tracking-tight text-foreground">
                      $497
                    </span>
                    <span className="pb-1.5 text-sm text-muted-foreground">
                      one-time
                      <br />
                      no subscription
                    </span>
                  </div>

                  <h2 className="mt-5 text-xl font-bold tracking-tight">
                    A complete website, built for you
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    Not a template you fill in. We design and build the whole thing — then hand it
                    over so you can edit it yourself, forever, with no change-request fees.
                  </p>

                  <ul className="mt-6 space-y-2.5">
                    {[
                      'Built on web0n, our own AI platform',
                      'Structured for Google and AI search',
                      'Contact form wired straight to you',
                      'Yours to edit and revise, any time',
                    ].map((f) => (
                      <li key={f} className="flex gap-2.5 text-sm text-muted-foreground">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                        {f}
                      </li>
                    ))}
                  </ul>

                  <Button className="mt-7 w-full py-6 text-base" asChild>
                    <Link href="/497-website">
                      Claim this week&rsquo;s build
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>

                  <p className="mt-3 text-center text-xs text-muted-foreground">
                    Closes Friday midnight ET · no payment until scope is confirmed
                  </p>
                </div>
              </div>
            </div>

            {/* ---- Sourced stat strip ---- */}
            <div className="mt-20 grid grid-cols-2 gap-8 border-t border-border pt-10 lg:grid-cols-4">
              {OUR_NUMBERS.map((s) => (
                <StatBig key={s.label} stat={s} />
              ))}
            </div>
          </div>
        </section>

        {/* Live ecosystem heartbeat — sourced from 0nCore UCP dispatch feed */}
        <UcpLiveStrip />

        {/* Curated activity — narrative complement to the live ecosystem strip */}
        <LiveActivityTicker />

        {/* ================= THE GAP — why a pretty site isn't enough ================= */}
        <section className="relative overflow-hidden border-y border-border py-20 md:py-28">
          <SectionBg variant="solid-deep" />
          <div className="container relative z-10 px-4 md:px-6">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary">
                <BarChart3 className="h-4 w-4" />
                The data
              </div>
              <h2 className="mt-6 text-3xl font-bold tracking-tight md:text-5xl">
                Search stopped sending clicks.
              </h2>
              <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
                This is the part nobody selling you a website will mention, because it makes the
                website look like the easy half. Every figure below is third-party research, and
                we show you exactly who published it.
              </p>
            </div>

            <div className="mt-12 grid gap-5 md:grid-cols-2">
              {SEARCH_SHIFT.map((s) => (
                <StatCard key={s.label} stat={s} />
              ))}
            </div>

            <div className="mt-10 rounded-2xl border border-primary/30 bg-primary/5 p-7">
              <p className="text-lg leading-relaxed">
                <span className="font-bold text-primary">What this actually means:</span>{' '}
                ranking #1 is worth roughly half what it used to be. The traffic did not vanish —
                it moved into answers written by AI. If you are not in the answer, you are not in
                the market. That is the problem we solve, and it is not a problem a template can
                solve for you.
              </p>
              <Link
                href="/build-a-website-with-ai"
                className="mt-5 inline-flex items-center gap-2 font-semibold text-primary hover:underline"
              >
                Read our honest breakdown of what AI can and cannot do
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* ================= LOCAL ================= */}
        <section className="py-20 md:py-28">
          <div className="container px-4 md:px-6">
            <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary">
                  <Target className="h-4 w-4" />
                  Local reality
                </div>
                <h2 className="mt-6 text-3xl font-bold tracking-tight md:text-4xl">
                  Half of all searches are looking for someone nearby.
                </h2>
                <p className="mt-5 leading-relaxed text-muted-foreground">
                  For a business in Greensburg, Murrysville or Monroeville, that is the whole game.
                  Someone within ten miles of you is searching right now, on a phone, and will
                  contact somebody today. The only question is whose name comes up.
                </p>
                <p className="mt-4 leading-relaxed text-muted-foreground">
                  We build a page for every town we serve, with real local detail — not eleven
                  copies of the same page with the name swapped.
                </p>
                <Link
                  href="/web-design"
                  className="mt-6 inline-flex items-center gap-2 font-semibold text-primary hover:underline"
                >
                  See all 11 service areas
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {LOCAL_INTENT.map((s) => (
                  <StatInline key={s.label} stat={s} />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ================= PROOF: WE DO IT TO OURSELVES ================= */}
        <section className="relative overflow-hidden border-y border-border py-20 md:py-28">
          <div className="absolute inset-0 grid-background opacity-[0.06]" aria-hidden />
          <div className="container relative z-10 px-4 md:px-6">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary">
                <Terminal className="h-4 w-4" />
                Check our work
              </div>
              <h2 className="mt-6 text-3xl font-bold tracking-tight md:text-5xl">
                Every claim here is a URL you can open.
              </h2>
              <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
                Most agencies show you logos. We would rather you audit us. Everything below is
                running on this domain and our own products right now — the same machinery we
                point at a client site.
              </p>
            </div>

            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {SELF_PROOF.map((s) => (
                <StatInline key={s.label} stat={s} />
              ))}
            </div>

            <div className="mt-10 grid gap-4 md:grid-cols-3">
              {[
                {
                  icon: Search,
                  t: 'Structured for machines',
                  d: 'LocalBusiness, Service, FAQ and Breadcrumb schema on every page, plus an llms.txt written for AI crawlers. Open our source and look.',
                },
                {
                  icon: Globe,
                  t: 'A page per town',
                  d: '11 service-area pages with real census data, road corridors and local specifics — because generic doorway pages get ignored by Google and AI alike.',
                },
                {
                  icon: Bot,
                  t: 'Comparison content AI cites',
                  d: '10 pages comparing us honestly against Wix, Squarespace, ChatGPT, Claude and more — including where they beat us. That honesty is why we get quoted.',
                },
              ].map((c) => {
                const Icon = c.icon
                return (
                  <div key={c.t} className="rounded-2xl border border-border bg-card p-6">
                    <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="mt-4 font-bold">{c.t}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{c.d}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>


        {/* Trust strip — infrastructure providers, builds credibility */}
        <TrustStrip />

        {/* Talk to us — replaces the old public pricing table. Pricing is now
            quoted per project after a short conversation; the one published
            price is the $497 website offer. */}
        <section id="pricing" className="relative overflow-hidden py-20 md:py-28">
          <SectionBg variant="solid-deep" />
          <div className="container relative z-10 px-4 md:px-6">
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/5 text-sm font-medium text-primary mb-6">
                <DollarSign className="w-4 h-4" />
                Straight answers, fast
              </div>
              <h2 className="text-3xl md:text-5xl font-bold mb-5 tracking-tight">
                Every project is different. So is every quote.
              </h2>
              <p className="text-lg text-muted-foreground mb-10">
                Tell us what you are trying to do and we will give you a fixed price for it —
                one conversation, no multi-stage sales funnel, no obligation. If a cheaper
                option would serve you better, we will say so.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 rounded-lg bg-primary px-7 py-4 text-lg font-semibold text-primary-foreground transition-opacity hover:opacity-90"
                >
                  Get a quote <ArrowRight className="w-5 h-5" />
                </Link>
                <a
                  href="tel:+1-878-888-1230"
                  className="inline-flex items-center gap-2 rounded-lg border border-border px-7 py-4 text-lg font-semibold transition-colors hover:border-primary/40"
                >
                  (878) 888-1230
                </a>
              </div>
              <p className="mt-8 text-sm text-muted-foreground">
                Just need a website?{' '}
                <Link href="/497-website" className="font-semibold text-primary hover:underline">
                  See the $497 website offer
                </Link>
              </p>
            </div>
          </div>
        </section>

        {/* Free Stack Health Audit CTA */}
        <section className="relative overflow-hidden py-20 md:py-28 border-y border-border">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-background" />
          <div className="absolute inset-0 grid-background opacity-25" />
          <div className="container relative z-10 px-4 md:px-6">
            <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-10 items-center">
              <div>
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/5 text-sm font-medium text-primary mb-6">
                  <Shield className="w-4 h-4" />
                  Free · No account required
                </div>
                <h2 className="text-3xl md:text-5xl font-bold mb-5 tracking-tight">
                  Is your web app{' '}
                  <span className="bg-gradient-to-r from-primary via-orange-400 to-primary bg-clip-text text-transparent animate-gradient-x">
                    actually healthy?
                  </span>
                </h2>
                <p className="text-lg text-muted-foreground mb-8">
                  Drop your URL. We run the same external audit a security engineer would —
                  50+ checks across infrastructure, TLS, headers, framework EOL, exposed
                  dev artifacts, and asset freshness. You get a letter grade and a
                  remediation roadmap emailed to you in minutes.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button size="lg" className="text-lg px-8 py-6 animate-pulse-glow" asChild>
                    <Link href="/health-check">
                      Run my free audit
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" className="text-lg px-8 py-6" asChild>
                    <Link href="/health-check#how-it-works">
                      What we check
                    </Link>
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-4">
                  Passive external reconnaissance only. We don&apos;t touch private surfaces.
                </p>
              </div>

              <div className="card-lifted-xl p-6 md:p-8 bg-card">
                <div className="flex items-center justify-between mb-6">
                  <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Sample output</div>
                  <div className="text-5xl font-extrabold text-red-500">F</div>
                </div>
                <div className="space-y-2.5 text-sm">
                  {[
                    { sev: 'CRITICAL', color: 'bg-red-500', text: 'Public .env file — credential leak' },
                    { sev: 'CRITICAL', color: 'bg-red-500', text: 'Expired TLS cert on stag.' },
                    { sev: 'HIGH', color: 'bg-orange-500', text: 'Missing HSTS / CSP / X-Frame-Options' },
                    { sev: 'HIGH', color: 'bg-orange-500', text: 'jQuery 3.4.1 (CVE-2020-11022)' },
                    { sev: 'MEDIUM', color: 'bg-yellow-500', text: 'Server version banner disclosed' },
                    { sev: 'MEDIUM', color: 'bg-yellow-500', text: 'Core assets > 3 years old' },
                  ].map((row) => (
                    <div key={row.text} className="flex items-center gap-3 py-1">
                      <span className={`text-[9px] font-bold text-white px-1.5 py-0.5 rounded ${row.color} tracking-wider shrink-0`}>{row.sev}</span>
                      <span className="text-foreground/85">{row.text}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-6 pt-6 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
                  <span>Score: <strong className="text-foreground">0 / 100</strong></span>
                  <span>Findings: <strong className="text-foreground">14</strong></span>
                  <span>Runtime: <strong className="text-foreground">6 min</strong></span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How We're Different — transparent middle, branded seams (stars show) */}
        <section className="relative overflow-hidden py-20 md:py-28">
          <SectionBg variant="seam" />
          <div className="container relative z-10 px-4 md:px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold mb-4">
                How We&apos;re Different
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                We&apos;re not another agency. We&apos;re an AI-native company that builds systems, not slides.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
              {differentiators.map((d) => {
                const Icon = d.icon
                return (
                  <div key={d.title} className="card-lifted p-6 text-center space-y-4">
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 text-primary mx-auto">
                      <Icon className="w-7 h-7" />
                    </div>
                    <h3 className="text-xl font-bold">{d.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{d.description}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* ================= THE CONTENT ENGINE ================= */}
        <section className="relative overflow-hidden py-20 md:py-28">
          <SectionBg variant="solid-deep" />
          <div className="container relative z-10 px-4 md:px-6">
            <div className="mx-auto max-w-3xl text-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary">
                <Cpu className="h-4 w-4" />
                Nobody else does this
              </div>
              <h2 className="mt-6 text-3xl font-bold tracking-tight md:text-5xl">
                Your site publishes itself.
              </h2>
              <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
                Every agency sells you a website and then quietly hopes you never notice it hasn&rsquo;t
                changed in two years. A site that never publishes anything gives Google and AI
                engines no reason to come back. So we built the thing that fixes it — and we run
                it on our own properties first.
              </p>
            </div>

            <div className="mx-auto mt-14 grid max-w-5xl gap-5 md:grid-cols-3">
              {[
                {
                  n: '01',
                  icon: Search,
                  t: 'It watches what people ask',
                  d: 'CRO9 grades your real traffic and the questions it arrives with. The engine reads actual demand in your service area instead of guessing at keywords.',
                },
                {
                  n: '02',
                  icon: Bot,
                  t: 'It writes the answer',
                  d: 'Groq-powered drafting on 0nMCP produces the article, the schema, the FAQ block and the social posts — structured the way answer engines quote, not keyword mush.',
                },
                {
                  n: '03',
                  icon: Zap,
                  t: 'It ships and submits',
                  d: 'Published to your site, pushed to social, then submitted straight to search and AI indexes. Ours goes out across 10 domains every single day, automatically.',
                },
              ].map((s) => {
                const Icon = s.icon
                return (
                  <div
                    key={s.n}
                    className="relative overflow-hidden rounded-2xl border border-border bg-card p-7"
                  >
                    <span className="font-mono text-5xl font-bold leading-none text-primary/15">
                      {s.n}
                    </span>
                    <div className="mt-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="mt-4 text-lg font-bold">{s.t}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.d}</p>
                  </div>
                )
              })}
            </div>

            <div className="mx-auto mt-10 max-w-5xl rounded-2xl border border-primary/30 bg-primary/5 p-7">
              <div className="grid gap-6 md:grid-cols-[1.4fr_1fr] md:items-center">
                <div>
                  <h3 className="text-xl font-bold tracking-tight">
                    Consistent is the whole trick
                  </h3>
                  <p className="mt-3 leading-relaxed text-muted-foreground">
                    Anyone can publish once. The reason this works is that it never stops, never
                    needs chasing, and never depends on you finding an hour to write something. It
                    is the same engine that grew 0nmcp.com to{' '}
                    <span className="font-mono font-semibold text-foreground">658</span> pages and
                    keeps this site&rsquo;s{' '}
                    <span className="font-mono font-semibold text-foreground">104</span> pages fed.
                  </p>
                </div>
                <div className="flex flex-col gap-3">
                  <Button asChild>
                    <Link href="/contact">
                      Ask about the content engine
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link href="/blog">See what it publishes</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>


        {/* Services Section */}
        <section className="relative overflow-hidden py-20 md:py-28">
          <SectionBg variant="solid-card" />
          <div className="container relative z-10 px-4 md:px-6">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/5 text-sm font-medium text-primary mb-6">
                <Rocket className="w-4 h-4" />
                What We Build
              </div>
              <h2 className="text-3xl md:text-5xl font-bold mb-4">
                Services That Ship Results
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Six core services. Fixed quotes. Delivered fast.
              </p>
            </div>

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
                      <h3 className="text-xl font-bold group-hover:text-primary transition-colors">{svc.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{svc.description}</p>
                      <div className="flex items-center justify-between pt-2 border-t border-border">
                        <span className="text-sm font-semibold text-primary">Get a quote</span>
                        <span className="text-sm text-muted-foreground group-hover:text-primary transition-colors flex items-center gap-1">
                          Learn more <ArrowRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        </section>

        {/* Powered By Section — transparent middle, branded seams (stars show) */}
        <section className="relative overflow-hidden py-20 md:py-28">
          <SectionBg variant="seam" />
          <div className="container relative z-10 px-4 md:px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold mb-4">Powered By</h2>
              <p className="text-lg text-muted-foreground">
                RocketOpp is an <span className="text-primary font-semibold">0n Company</span>
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {/* 0nMCP */}
              <a
                href="https://0nmcp.com"
                target="_blank"
                rel="noopener noreferrer"
                className="group"
              >
                <div className="card-lifted-xl p-8 h-full text-center space-y-4 group-hover:border-primary/40">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 text-primary mx-auto">
                    <Terminal className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-bold">0nMCP</h3>
                  <p className="text-3xl font-bold text-primary">1,640+ tools. 109 services.</p>
                  <p className="text-muted-foreground">One orchestrator. The universal AI API that powers every system we build.</p>
                  <span className="inline-flex items-center gap-1 text-primary text-sm font-medium">
                    0nmcp.com <ExternalLink className="w-3.5 h-3.5" />
                  </span>
                </div>
              </a>

              {/* CRO9 */}
              <a
                href="https://cro9.com"
                target="_blank"
                rel="noopener noreferrer"
                className="group"
              >
                <div className="card-lifted-xl p-8 h-full text-center space-y-4 group-hover:border-primary/40">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 text-primary mx-auto">
                    <BarChart3 className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-bold">CRO9</h3>
                  <p className="text-3xl font-bold text-primary">SXO + PPC + AI = Revenue.</p>
                  <p className="text-muted-foreground">Conversion rate optimization powered by AI. Search experience meets conversion science.</p>
                  <span className="inline-flex items-center gap-1 text-primary text-sm font-medium">
                    cro9.com <ExternalLink className="w-3.5 h-3.5" />
                  </span>
                </div>
              </a>
            </div>
          </div>
        </section>

        {/* Results / Social Proof */}
        <section className="relative overflow-hidden py-20 md:py-28">
          <VideoBackground
            src={ROCKETOPP_HERO_VIDEO}
            overlay="darker"
            className="opacity-80"
          />
          <div className="absolute inset-0 grid-background opacity-10 pointer-events-none" />
          <div className="container relative z-10 px-4 md:px-6">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/40 bg-primary/10 backdrop-blur text-sm font-medium text-primary mb-6">
                <BarChart3 className="w-4 h-4" />
                Real Numbers
              </div>
              <h2 className="text-3xl md:text-5xl font-bold mb-4 text-white drop-shadow-lg">Results That Speak</h2>
              <p className="text-lg text-white/80 max-w-2xl mx-auto">
                We measure success by your outcomes, not our proposals.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mb-16">
              {[
                { value: "3x", label: "Average ROI for clients" },
                { value: "72h", label: "Average first delivery" },
                { value: "97%", label: "Client satisfaction" },
                { value: "$0", label: "Hidden fees. Ever." },
              ].map((stat) => (
                <div key={stat.label} className="card-lifted p-6 text-center">
                  <div className="text-3xl md:text-4xl font-bold text-primary mb-2">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>

          </div>
        </section>

        {/* CTA Section */}
        <section className="relative overflow-hidden py-28 md:py-40">
          <VideoBackground
            src={ROCKETOPP_HERO_VIDEO}
            overlay="radial"
            className="opacity-95"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background pointer-events-none" />
          <div className="container relative z-10 px-4 md:px-6">
            <div className="max-w-3xl mx-auto text-center space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/40 bg-primary/10 backdrop-blur text-sm font-medium text-primary">
                <Rocket className="w-4 h-4" />
                Ship Mode
              </div>
              <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white drop-shadow-[0_4px_24px_rgba(0,0,0,0.6)]">
                Ready to{" "}
                <span className="bg-gradient-to-r from-primary via-orange-400 to-primary bg-clip-text text-transparent animate-gradient-x">
                  Ship?
                </span>
              </h2>
              <p className="text-lg md:text-xl text-white/85 max-w-xl mx-auto">
                Stop comparing proposals. Start building. Pick a service, see the price, and let&apos;s go.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
                <Button size="lg" className="text-lg px-8 py-6 animate-pulse-glow" asChild>
                  <a href="#pricing">
                    View Pricing
                    <DollarSign className="ml-2 w-5 h-5" />
                  </a>
                </Button>
                <Button size="lg" variant="outline" className="text-lg px-8 py-6 bg-white/5 backdrop-blur border-white/30 text-white hover:bg-white/10" asChild>
                  <Link href="/contact">
                    Contact Us
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.02] px-3 py-3 text-center">
      <div className="text-xl md:text-2xl font-extrabold text-white tabular-nums">{value}</div>
      <div className="text-[10px] font-bold uppercase tracking-widest text-emerald-400/80 mt-0.5">
        {label}
      </div>
    </div>
  )
}
