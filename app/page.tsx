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

export const metadata: Metadata = {
  title: "RocketOpp - Enterprise AI Systems. Startup Speed. Real Pricing.",
  description:
    "We build personalized business systems for entrepreneurs — powered by 0nMCP and CRO9. Professional websites from $2,497. CRM automation from $1,497. AI systems from $2,997. No fluff. No discovery calls. Just results.",
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
    title: "RocketOpp - Enterprise AI Systems. Startup Speed. Real Pricing.",
    description:
      "Transparent pricing for websites, AI automation, CRM, SXO, PPC, and MCP integration. Enterprise quality at the local level.",
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
    title: "RocketOpp - Enterprise AI Systems. Startup Speed. Real Pricing.",
    description:
      "Transparent pricing. No discovery calls. Websites from $2,497. AI systems from $2,997.",
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

const pricingData = [
  {
    service: "Professional Website",
    industryLow: "$5,000",
    industryHigh: "$15,000",
    rocketopp: "$2,497",
    shipsIn: "2 weeks",
    href: "/services/website-development",
  },
  {
    service: "E-Commerce Store",
    industryLow: "$10,000",
    industryHigh: "$50,000",
    rocketopp: "$4,997",
    shipsIn: "3 weeks",
    href: "/services/website-development",
  },
  {
    service: "CRM Setup & Automation",
    industryLow: "$3,000",
    industryHigh: "$10,000",
    rocketopp: "$1,497",
    shipsIn: "1 week",
    href: "/services/crm-automation",
  },
  {
    service: "SXO / SEO Campaign",
    industryLow: "$2,000",
    industryHigh: "$5,000/mo",
    rocketopp: "$997/mo",
    shipsIn: "Ongoing",
    href: "/services/sxo",
    monthly: true,
  },
  {
    service: "AI Business Automation",
    industryLow: "$5,000",
    industryHigh: "$25,000",
    rocketopp: "$2,997",
    shipsIn: "2 weeks",
    href: "/services/ai-automation",
  },
  {
    service: "PPC Management",
    industryLow: "$1,500",
    industryHigh: "$5,000/mo",
    rocketopp: "$797/mo",
    shipsIn: "Ongoing",
    href: "/services/ppc-management",
    monthly: true,
  },
  {
    service: "Full Digital Presence",
    industryLow: "$15,000",
    industryHigh: "$50,000",
    rocketopp: "$7,997",
    shipsIn: "4 weeks",
    href: "/services/website-development",
  },
  {
    service: "MCP Server Integration",
    industryLow: "$3,000",
    industryHigh: "$10,000",
    rocketopp: "$1,997",
    shipsIn: "1 week",
    href: "/services/mcp-integration",
  },
]

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
    price: "$2,497",
    shipsIn: "2 weeks",
    href: "/services/website-development",
  },
  {
    icon: Cpu,
    title: "AI for Business",
    description:
      "Custom AI systems that automate your operations. From customer service to lead qualification to content creation.",
    price: "$2,997",
    shipsIn: "2 weeks",
    href: "/services/ai-automation",
  },
  {
    icon: Search,
    title: "SXO (Search Experience Optimization)",
    description:
      "SEO is dead. SXO combines search optimization, user experience, and conversion — powered by CRO9.",
    price: "$997/mo",
    shipsIn: "Ongoing",
    href: "/services/sxo",
  },
  {
    icon: Target,
    title: "CRM Automation",
    description:
      "Full CRM setup with automated pipelines, email sequences, appointment booking, and lead scoring.",
    price: "$1,497",
    shipsIn: "1 week",
    href: "/services/crm-automation",
  },
  {
    icon: BarChart3,
    title: "PPC & Paid Ads",
    description:
      "Google Ads, Meta Ads, LinkedIn Ads — managed by AI, optimized by CRO9. Real ROI, not vanity metrics.",
    price: "$797/mo",
    shipsIn: "Ongoing",
    href: "/services/ppc-management",
  },
  {
    icon: Terminal,
    title: "MCP Server Integration",
    description:
      "Connect your business to 1,171+ tools across 54 services. One integration, unlimited automation.",
    price: "$1,997",
    shipsIn: "1 week",
    href: "/services/mcp-integration",
  },
]

const results = [
  { value: "200+", label: "Projects Delivered" },
  { value: "54", label: "Services Connected" },
  { value: "1,171+", label: "AI Tools Available" },
  { value: "2 weeks", label: "Average Delivery" },
]

export default function HomePage() {
  return (
    <>
      <OrganizationSchema
        description="Enterprise AI systems at startup speed. Transparent pricing for websites, automation, CRM, SXO, PPC, and MCP integration. Powered by 0nMCP and CRO9."
        sameAs={[
          "https://twitter.com/rocketopp",
          "https://linkedin.com/company/rocketopp",
          "https://github.com/rocketopp",
          "https://0nmcp.com",
          "https://cro9.com",
        ]}
      />
      <WebsiteSchema
        description="Enterprise AI systems at startup speed. Transparent pricing, no discovery calls."
      />
      <LocalBusinessSchema
        description="AI-powered digital agency with transparent pricing. Websites from $2,497. CRM automation from $1,497. AI systems from $2,997."
        priceRange="$$"
      />

      <main className="min-h-screen">
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-24 pb-20 md:pt-32 md:pb-28 min-h-[88vh] flex items-center">
          {/* Cinematic video backdrop */}
          <VideoBackground
            src={ROCKETOPP_HERO_VIDEO}
            eager
            overlay="radial"
            className="opacity-90"
          />
          {/* Keep the subtle grid on top for brand continuity */}
          <div className="absolute inset-0 grid-background opacity-10 pointer-events-none" />
          {/* Fade to page bg at the bottom for smooth scroll-in to pricing */}
          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-background pointer-events-none" />

          <div className="container relative z-10 px-4 md:px-6">
            <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/5 text-sm font-medium text-primary mb-8 animate-fade-in">
                <Sparkles className="w-4 h-4" />
                an 0n Company
              </div>

              {/* Headline */}
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 animate-slide-up">
                Enterprise AI Systems.{" "}
                <span className="bg-gradient-to-r from-primary via-orange-400 to-primary bg-clip-text text-transparent animate-gradient-x">
                  Startup Speed.
                </span>{" "}
                Real Pricing.
              </h1>

              {/* Subtitle */}
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-10 animate-slide-up animation-delay-200">
                We build personalized business systems for entrepreneurs — powered by{" "}
                <span className="text-primary font-semibold">0nMCP</span> and{" "}
                <span className="text-primary font-semibold">CRO9</span>. No fluff. No discovery calls. Just results.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-4 animate-slide-up animation-delay-400">
                <Button size="lg" className="text-lg px-8 py-6 animate-pulse-glow" asChild>
                  <a href="#pricing">
                    See Our Pricing
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </a>
                </Button>
                <Button size="lg" variant="outline" className="text-lg px-8 py-6" asChild>
                  <Link href="/contact">
                    Get a Free SXO Audit
                  </Link>
                </Button>
              </div>
            </div>

            {/* Results bar */}
            <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto animate-fade-in animation-delay-600">
              {results.map((r) => (
                <div key={r.label} className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-primary">{r.value}</div>
                  <div className="text-sm text-muted-foreground mt-1">{r.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Transparent Pricing Section */}
        <section id="pricing" className="py-20 md:py-28 bg-card/50">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/5 text-sm font-medium text-primary mb-6">
                <DollarSign className="w-4 h-4" />
                Transparent Pricing
              </div>
              <h2 className="text-3xl md:text-5xl font-bold mb-4">
                See Exactly What You&apos;ll Pay
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                No hidden fees. No &quot;let&apos;s hop on a call.&quot; Real pricing, right here, right now.
              </p>
            </div>

            {/* Pricing Table — Desktop */}
            <div className="hidden lg:block max-w-5xl mx-auto">
              <div className="rounded-2xl border border-border overflow-hidden">
                {/* Header */}
                <div className="grid grid-cols-5 bg-card border-b border-border">
                  <div className="p-5 font-semibold text-sm uppercase tracking-wider text-muted-foreground">Service</div>
                  <div className="p-5 font-semibold text-sm uppercase tracking-wider text-muted-foreground">Industry Average</div>
                  <div className="p-5 font-semibold text-sm uppercase tracking-wider text-primary bg-primary/5">RocketOpp</div>
                  <div className="p-5 font-semibold text-sm uppercase tracking-wider text-muted-foreground">Ships In</div>
                  <div className="p-5" />
                </div>
                {/* Rows */}
                {pricingData.map((row, i) => (
                  <div
                    key={row.service}
                    className={`grid grid-cols-5 items-center transition-colors hover:bg-primary/[0.03] ${
                      i < pricingData.length - 1 ? "border-b border-border" : ""
                    }`}
                  >
                    <div className="p-5 font-medium">{row.service}</div>
                    <div className="p-5 text-muted-foreground line-through decoration-red-500/50">
                      {row.industryLow} – {row.industryHigh}
                    </div>
                    <div className="p-5 bg-primary/5">
                      <span className="text-xl font-bold text-primary">{row.rocketopp}</span>
                    </div>
                    <div className="p-5">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
                        <Clock className="w-3.5 h-3.5" />
                        {row.shipsIn}
                      </span>
                    </div>
                    <div className="p-5">
                      <Button size="sm" variant="outline" className="border-primary/30 hover:bg-primary/10 hover:text-primary" asChild>
                        <Link href={row.href}>
                          Get Started
                          <ArrowRight className="ml-1.5 w-3.5 h-3.5" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-4 text-center">
                * Based on Clutch.co, Agency Analytics, and WebFX 2026 industry data
              </p>
            </div>

            {/* Pricing Cards — Mobile */}
            <div className="lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
              {pricingData.map((row) => (
                <div key={row.service} className="card-lifted p-5 space-y-3">
                  <h3 className="font-semibold text-lg">{row.service}</h3>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-primary">{row.rocketopp}</span>
                  </div>
                  <div className="text-sm text-muted-foreground line-through">
                    Industry: {row.industryLow} – {row.industryHigh}
                  </div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm">
                    <Clock className="w-3.5 h-3.5" />
                    {row.shipsIn}
                  </div>
                  <Button size="sm" className="w-full mt-2" asChild>
                    <Link href={row.href}>
                      Get Started <ArrowRight className="ml-1.5 w-3.5 h-3.5" />
                    </Link>
                  </Button>
                </div>
              ))}
              <p className="text-xs text-muted-foreground col-span-full text-center mt-2">
                * Based on Clutch.co, Agency Analytics, and WebFX 2026 data
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

        {/* How We're Different */}
        <section className="py-20 md:py-28">
          <div className="container px-4 md:px-6">
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

        {/* Services Section */}
        <section className="py-20 md:py-28 bg-card/50">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/5 text-sm font-medium text-primary mb-6">
                <Rocket className="w-4 h-4" />
                What We Build
              </div>
              <h2 className="text-3xl md:text-5xl font-bold mb-4">
                Services That Ship Results
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Six core services. Transparent pricing. Delivered fast.
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
                        <span className="text-lg font-bold text-primary">{svc.price}</span>
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

        {/* Powered By Section */}
        <section className="py-20 md:py-28">
          <div className="container px-4 md:px-6">
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
                  <p className="text-3xl font-bold text-primary">1,171 tools. 54 services.</p>
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

            {/* Testimonial-style quote */}
            <div className="max-w-3xl mx-auto text-center">
              <div className="card-lifted-xl p-8 md:p-12">
                <p className="text-xl md:text-2xl italic text-foreground/90 mb-6">
                  &quot;Other agencies gave us proposals. RocketOpp gave us a working system in 5 days. The AI automation alone saved us 20 hours a week.&quot;
                </p>
                <div className="flex items-center justify-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                    M
                  </div>
                  <div className="text-left">
                    <div className="font-semibold">Mike M.</div>
                    <div className="text-sm text-muted-foreground">Founder, RocketOpp LLC</div>
                  </div>
                </div>
              </div>
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

        {/* ================================================================= */}
        {/* Powered by 0nCore — 2-hour build acknowledgment                    */}
        {/* ================================================================= */}
        <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                'radial-gradient(ellipse at top, rgba(110,224,90,0.08) 0%, transparent 60%)',
            }}
          />
          <div className="relative max-w-5xl mx-auto">
            <div className="rounded-3xl border border-emerald-500/15 bg-gradient-to-br from-zinc-950/80 via-black/90 to-zinc-950/80 backdrop-blur-xl p-6 sm:p-10 md:p-12 overflow-hidden">
              <div className="grid md:grid-cols-[auto,1fr] gap-8 md:gap-10 items-center">
                <div className="relative">
                  {/* Glow halo */}
                  <div
                    className="absolute inset-0 -m-4 rounded-full blur-3xl pointer-events-none"
                    style={{
                      background:
                        'radial-gradient(circle, rgba(110,224,90,0.18) 0%, transparent 70%)',
                    }}
                  />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/video/0ncore-logo-reveal.gif"
                    alt="0nCore logo reveal"
                    className="relative w-56 md:w-72 h-auto rounded-2xl"
                    loading="lazy"
                  />
                </div>

                <div className="text-center md:text-left">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/5 text-emerald-400 text-xs font-bold uppercase tracking-[0.18em] mb-4">
                    <Sparkles className="w-3.5 h-3.5" /> Generously donated
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-4">
                    This site was built in{' '}
                    <span
                      className="bg-clip-text text-transparent"
                      style={{
                        backgroundImage:
                          'linear-gradient(135deg, #6EE05A 0%, #06b6d4 60%, #a5f3fc 100%)',
                      }}
                    >
                      2 hours
                    </span>{' '}
                    with 0nMCP.
                  </h2>
                  <p className="text-base md:text-lg text-white/70 leading-relaxed max-w-2xl mb-6">
                    Every page, every API route, every database table, every email template —
                    from conception to production — delivered in a single focused session.
                    Powered by the patent-pending <strong className="text-white">0nMCP</strong>{' '}
                    orchestration engine, generously donated to RocketOpp by{' '}
                    <a
                      href="https://0ncore.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-400 font-semibold hover:text-emerald-300 transition-colors"
                    >
                      0nCore
                    </a>
                    .
                  </p>

                  <div className="grid grid-cols-3 gap-3 mb-6 max-w-md mx-auto md:mx-0">
                    <Stat label="Tools" value="1,554" />
                    <Stat label="Services" value="96" />
                    <Stat label="Hours to ship" value="2" />
                  </div>

                  <a
                    href="https://0ncore.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm transition-all"
                    style={{
                      background: 'linear-gradient(135deg,#6EE05A,#4ecb3a)',
                      color: '#080B0F',
                      boxShadow: '0 4px 20px rgba(110,224,90,0.3)',
                    }}
                  >
                    See what 0nCore can build for you
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </a>
                </div>
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
