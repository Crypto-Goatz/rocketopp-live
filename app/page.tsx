import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import {
  ArrowRight,
  Rocket,
  Globe,
  Code2,
  Megaphone,
  Search,
  Cpu,
  Zap,
  CheckCircle2,
  Sparkles,
  Bot,
  ChevronRight,
  Workflow,
  Shield,
  Lock,
  BadgeCheck,
  Award,
  Star,
  ExternalLink
} from "lucide-react"
import type { Metadata } from "next"
import Footer from "@/components/footer"
import { OrganizationSchema, WebsiteSchema, FAQSchema } from "@/components/seo/json-ld"
import { HeroAnimation } from "@/components/hero-animation"

export const metadata: Metadata = {
  title: "RocketOpp - AI-Powered Digital Agency | Web, Apps, Marketing & SEO",
  description:
    "We build websites, AI applications, custom apps, SOP automation, and growth strategies that actually work. From idea to launch, we handle everything so you can focus on your business.",
  keywords:
    "digital agency, AI applications, web development, app development, online marketing, SEO, search optimization, SOP automation, RocketOpp, website design, custom software",
  authors: [{ name: "RocketOpp" }],
  creator: "RocketOpp",
  publisher: "RocketOpp",
  metadataBase: new URL("https://rocketopp.com"),
  alternates: {
    canonical: "https://rocketopp.com",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://rocketopp.com",
    title: "RocketOpp - AI-Powered Digital Agency",
    description: "We build websites, AI apps, and growth strategies that actually work.",
    siteName: "RocketOpp",
    images: [
      {
        url: "https://rocketopp.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "RocketOpp - AI-Powered Digital Agency",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "RocketOpp - AI-Powered Digital Agency",
    description: "We build websites, AI apps, and growth strategies that actually work.",
    images: ["https://rocketopp.com/twitter-image.jpg"],
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
}

const services = [
  {
    name: "Website Development",
    tagline: "Sites That Convert",
    description: "Beautiful, fast websites built to turn visitors into customers. Design, development, and optimization under one roof.",
    href: "/services/website-development",
    icon: Globe,
    color: "from-blue-500 to-cyan-500",
    features: ["Custom Design", "Mobile-First", "CRO Built-In", "Lightning Fast"]
  },
  {
    name: "AI Applications",
    tagline: "Intelligence On Demand",
    description: "Custom AI tools and automations that work while you sleep. From chatbots to full workflow automation.",
    href: "/services/ai-applications",
    icon: Cpu,
    color: "from-orange-500 to-red-500",
    features: ["Custom AI Tools", "Workflow Automation", "Rocket+", "MCPFED"]
  },
  {
    name: "App Development",
    tagline: "Ideas to Reality",
    description: "Custom web and mobile applications built for your exact needs. APIs, integrations, and scalable architecture.",
    href: "/services/app-development",
    icon: Code2,
    color: "from-purple-500 to-pink-500",
    features: ["Custom Apps", "API Development", "Integrations", "Mobile Apps"]
  },
  {
    name: "SOP Automation",
    tagline: "Systems That Scale",
    description: "Transform chaotic processes into streamlined systems. Document, automate, and train your team on SOPs that actually work.",
    href: "/services/sop-automation",
    icon: Workflow,
    color: "from-indigo-500 to-violet-500",
    features: ["Process Mapping", "Workflow Automation", "Team Training", "AI Documentation"]
  },
  {
    name: "Online Marketing",
    tagline: "Growth That Compounds",
    description: "Multi-channel marketing that gets results. PPC, social media, content, and email campaigns that drive revenue.",
    href: "/services/online-marketing",
    icon: Megaphone,
    color: "from-green-500 to-emerald-500",
    features: ["PPC & Ads", "Social Media", "Content Strategy", "Email Campaigns"]
  },
  {
    name: "Search Optimization",
    tagline: "Get Found First",
    description: "Dominate search results with technical SEO, content optimization, and local search strategies that bring organic traffic.",
    href: "/services/search-optimization",
    icon: Search,
    color: "from-yellow-500 to-orange-500",
    features: ["Technical SEO", "Local SEO", "Content SEO", "SEO Audits"]
  },
]

const products = [
  {
    name: "Rocket+",
    tagline: "50+ CRM Tools",
    description: "Supercharge your CRM with AI course generation, workflow automation, and modular enhancements.",
    href: "/marketplace/rocket-plus",
    icon: Rocket,
    color: "from-orange-500 to-red-500",
    status: "Live"
  },
  {
    name: "MCPFED",
    tagline: "AI Agent Hub",
    description: "Connect and orchestrate MCP servers. The command center for all your AI tools.",
    href: "/marketplace/mcpfed",
    icon: Bot,
    color: "from-cyan-500 to-blue-500",
    status: "Live"
  },
]

const stats = [
  { value: "500+", label: "Projects Delivered" },
  { value: "98%", label: "Client Satisfaction" },
  { value: "24/7", label: "AI Working For You" },
  { value: "10x", label: "Faster Than DIY" },
]

const faqs = [
  {
    question: "What makes RocketOpp different from other agencies?",
    answer: "We combine traditional digital services with cutting-edge AI applications. Everything we build is designed to work smarter, not harder. Plus, we offer our AI tools on a lease-to-own basis."
  },
  {
    question: "How long does a typical project take?",
    answer: "Websites typically launch in 2-4 weeks. Custom applications take 4-12 weeks depending on complexity. Marketing campaigns can start within days."
  },
  {
    question: "Do you offer ongoing support?",
    answer: "Absolutely. We offer maintenance packages for all our services. For AI applications, updates and improvements are included with your subscription or lease."
  },
  {
    question: "Can I use my own tools with your AI applications?",
    answer: "Yes! Our AI applications are built with interchangeable backends. Switch between Claude, GPT, or other models. Everything integrates with your existing stack."
  }
]

const integrations = [
  { name: "OpenAI", logo: "/logos/openai.svg" },
  { name: "Microsoft", logo: "/logos/microsoft.svg" },
  { name: "Google Cloud", logo: "/logos/google-cloud.svg" },
  { name: "AWS", logo: "/logos/aws.svg" },
  { name: "Salesforce", logo: "/logos/salesforce.svg" },
  { name: "HubSpot", logo: "/logos/hubspot.svg" },
  { name: "Slack", logo: "/logos/slack.svg" },
  { name: "Zapier", logo: "/logos/zapier.svg" },
]

export default function HomePage() {
  return (
    <div className="w-full overflow-x-hidden bg-background">
      <OrganizationSchema />
      <WebsiteSchema />
      <FAQSchema items={faqs} />

      {/* Epic Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated Background */}
        <HeroAnimation />

        <div className="relative z-10 container mx-auto px-4 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black/40 backdrop-blur-md border border-white/10 mb-8 animate-fade-in">
            <Sparkles className="w-4 h-4 text-primary animate-pulse" />
            <span className="text-sm font-medium text-white/90">AI-Powered Digital Agency</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight mb-6 animate-slide-up">
            <span className="text-foreground drop-shadow-lg">We Build.</span>
            <br />
            <span className="bg-gradient-to-r from-primary via-orange-400 to-red-500 bg-clip-text text-transparent drop-shadow-lg">
              You Win.
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-xl sm:text-2xl text-white/80 max-w-3xl mx-auto mb-4 animate-slide-up animation-delay-200">
            Websites. AI Apps. SOPs. Marketing. SEO.
          </p>
          <p className="text-lg text-white/50 max-w-2xl mx-auto mb-10 animate-slide-up animation-delay-400">
            From first click to lifelong customer, we handle the digital so you can handle the business.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-slide-up animation-delay-600">
            <Button size="lg" className="px-8 h-14 text-lg font-semibold shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all hover:scale-105" asChild>
              <Link href="/contact">
                Start Your Project
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="px-8 h-14 text-lg bg-white/5 border-white/20 backdrop-blur-sm hover:bg-white/10" asChild>
              <Link href="#services">
                Explore Services
              </Link>
            </Button>
          </div>

          {/* Stats Bar */}
          <div className="flex flex-wrap justify-center gap-8 sm:gap-16 animate-fade-in animation-delay-800">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl sm:text-4xl font-black text-primary drop-shadow-lg">{stat.value}</div>
                <div className="text-sm text-white/60">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 rounded-full border-2 border-white/20 flex items-start justify-center p-2">
            <div className="w-1 h-2 rounded-full bg-white/40 animate-pulse" />
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-24 bg-gradient-to-b from-background via-muted/30 to-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="text-xs font-semibold text-primary uppercase tracking-wider">
              What We Do
            </span>
            <h2 className="text-4xl sm:text-5xl font-bold mt-4 mb-6">
              Everything Digital. One Team.
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Six core services. Infinite possibilities. Each one backed by AI and obsessive attention to detail.
            </p>
          </div>

          {/* Services Grid - 3x2 */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {services.map((service) => (
              <Link
                key={service.name}
                href={service.href}
                className="group relative p-8 card-lifted-xl overflow-hidden"
              >
                {/* Gradient overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Icon */}
                <div className={`relative w-14 h-14 rounded-xl bg-gradient-to-br ${service.color} flex items-center justify-center mb-6 shadow-lg shadow-black/20`}>
                  <service.icon className="w-7 h-7 text-white" />
                </div>

                {/* Content */}
                <h3 className="relative text-2xl font-bold mb-2">{service.name}</h3>
                <p className="relative text-primary font-medium mb-3">{service.tagline}</p>
                <p className="relative text-muted-foreground leading-relaxed mb-6">{service.description}</p>

                {/* Features */}
                <div className="relative flex flex-wrap gap-2 mb-6">
                  {service.features.map((feature) => (
                    <span key={feature} className="text-xs px-3 py-1.5 rounded-full bg-muted/80 text-muted-foreground border border-border/50">
                      {feature}
                    </span>
                  ))}
                </div>

                {/* Arrow */}
                <div className="relative flex items-center text-primary font-medium">
                  <span>Learn More</span>
                  <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-2 transition-transform duration-300" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Integrations Section */}
      <section className="py-16 border-y border-border/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Integrations & Technology
            </span>
            <h3 className="text-xl font-semibold mt-2">
              Powered by Industry Leaders
            </h3>
          </div>
          <div className="flex flex-wrap justify-center items-center gap-8 sm:gap-12 md:gap-16 max-w-5xl mx-auto">
            {integrations.map((integration) => (
              <div
                key={integration.name}
                className="group flex flex-col items-center gap-2 opacity-60 hover:opacity-100 transition-all duration-300"
              >
                <div className="w-12 h-12 sm:w-14 sm:h-14 relative grayscale group-hover:grayscale-0 transition-all duration-300">
                  <Image
                    src={integration.logo}
                    alt={integration.name}
                    fill
                    className="object-contain"
                  />
                </div>
                <span className="text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                  {integration.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MCP & Trust Section */}
      <section className="py-20 bg-gradient-to-b from-background via-primary/5 to-background relative overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[150px]" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-[150px]" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          {/* MCP Badges */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
              <Award className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">Verified MCP Server</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Trusted by Developers Worldwide
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-10">
              Rocket+ is a verified Model Context Protocol server, enabling AI assistants to interact with CRM data securely and efficiently.
            </p>

            {/* MCP Badges Row */}
            <div className="flex flex-wrap items-center justify-center gap-6 mb-12">
              {/* LobeHub MCP Full Badge */}
              <a
                href="https://lobehub.com/plugins/crypto-goatz-rocket-plus-mcp"
                target="_blank"
                rel="noopener noreferrer"
                className="group transition-transform hover:scale-105"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://lobehub.com/badge/mcp-full/crypto-goatz-rocket-plus-mcp"
                  alt="MCP Server on LobeHub"
                  className="h-10 sm:h-12"
                />
              </a>

              {/* LobeHub MCP Badge - For the Badge Style */}
              <a
                href="https://lobehub.com/plugins/crypto-goatz-rocket-plus-mcp"
                target="_blank"
                rel="noopener noreferrer"
                className="group transition-transform hover:scale-105"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://lobehub.com/badge/mcp/crypto-goatz-rocket-plus-mcp?style=for-the-badge"
                  alt="MCP Server Badge"
                  className="h-8 sm:h-10"
                />
              </a>

              {/* NPM Badge */}
              <a
                href="https://www.npmjs.com/package/@anthropic/mcp"
                target="_blank"
                rel="noopener noreferrer"
                className="group transition-transform hover:scale-105"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://img.shields.io/badge/npm-MCP%20Compatible-CB3837?style=for-the-badge&logo=npm&logoColor=white"
                  alt="NPM MCP Compatible"
                  className="h-8 sm:h-10"
                />
              </a>

              {/* Claude Code Badge */}
              <div className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#CC785C] to-[#DDA68D] text-white font-semibold text-sm flex items-center gap-2">
                <Bot className="w-4 h-4" />
                Claude Code Ready
              </div>
            </div>
          </div>

          {/* Trust & Compliance Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto mb-16">
            {/* Security */}
            <div className="p-6 rounded-2xl bg-card/50 border border-border/50 backdrop-blur-sm text-center">
              <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-green-500/10 flex items-center justify-center">
                <Shield className="w-7 h-7 text-green-500" />
              </div>
              <h3 className="font-semibold mb-2">SOC 2 Type II</h3>
              <p className="text-sm text-muted-foreground">Enterprise-grade security controls and compliance</p>
            </div>

            {/* Privacy */}
            <div className="p-6 rounded-2xl bg-card/50 border border-border/50 backdrop-blur-sm text-center">
              <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-blue-500/10 flex items-center justify-center">
                <Lock className="w-7 h-7 text-blue-500" />
              </div>
              <h3 className="font-semibold mb-2">GDPR Compliant</h3>
              <p className="text-sm text-muted-foreground">Full data privacy and user rights protection</p>
            </div>

            {/* Verified */}
            <div className="p-6 rounded-2xl bg-card/50 border border-border/50 backdrop-blur-sm text-center">
              <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-primary/10 flex items-center justify-center">
                <BadgeCheck className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">ISO 27001</h3>
              <p className="text-sm text-muted-foreground">International information security standard</p>
            </div>

            {/* Uptime */}
            <div className="p-6 rounded-2xl bg-card/50 border border-border/50 backdrop-blur-sm text-center">
              <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-purple-500/10 flex items-center justify-center">
                <Star className="w-7 h-7 text-purple-500" />
              </div>
              <h3 className="font-semibold mb-2">99.9% Uptime</h3>
              <p className="text-sm text-muted-foreground">Reliable infrastructure on Vercel Edge</p>
            </div>
          </div>

          {/* Partners & Trusted By */}
          <div className="text-center">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-8 block">
              Trusted By Industry Leaders
            </span>
            <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12 max-w-4xl mx-auto opacity-70">
              {/* Anthropic */}
              <div className="flex items-center gap-2 text-muted-foreground">
                <Bot className="w-6 h-6" />
                <span className="font-medium">Anthropic</span>
              </div>
              {/* Vercel */}
              <div className="flex items-center gap-2 text-muted-foreground">
                <svg className="w-6 h-6" viewBox="0 0 76 65" fill="currentColor">
                  <path d="M37.5274 0L75.0548 65H0L37.5274 0Z" />
                </svg>
                <span className="font-medium">Vercel</span>
              </div>
              {/* Supabase */}
              <div className="flex items-center gap-2 text-muted-foreground">
                <svg className="w-6 h-6" viewBox="0 0 109 113" fill="none">
                  <path d="M63.7076 110.284C60.8481 113.885 55.0502 111.912 54.9813 107.314L53.9738 40.0627L99.1935 40.0627C107.384 40.0627 111.952 49.5228 106.859 55.9374L63.7076 110.284Z" fill="url(#paint0_linear)"/>
                  <path d="M63.7076 110.284C60.8481 113.885 55.0502 111.912 54.9813 107.314L53.9738 40.0627L99.1935 40.0627C107.384 40.0627 111.952 49.5228 106.859 55.9374L63.7076 110.284Z" fill="url(#paint1_linear)" fillOpacity="0.2"/>
                  <path d="M45.317 2.07103C48.1765 -1.53037 53.9745 0.442937 54.0434 5.041L54.4849 72.2922H9.83113C1.64038 72.2922 -2.92775 62.8321 2.1655 56.4175L45.317 2.07103Z" fill="#3ECF8E"/>
                  <defs>
                    <linearGradient id="paint0_linear" x1="53.9738" y1="54.974" x2="94.1635" y2="71.8295" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#249361"/>
                      <stop offset="1" stopColor="#3ECF8E"/>
                    </linearGradient>
                    <linearGradient id="paint1_linear" x1="36.1558" y1="30.578" x2="54.4844" y2="65.0806" gradientUnits="userSpaceOnUse">
                      <stop/>
                      <stop offset="1" stopOpacity="0"/>
                    </linearGradient>
                  </defs>
                </svg>
                <span className="font-medium">Supabase</span>
              </div>
              {/* Stripe */}
              <div className="flex items-center gap-2 text-muted-foreground">
                <svg className="w-6 h-6" viewBox="0 0 28 28" fill="currentColor">
                  <path fillRule="evenodd" clipRule="evenodd" d="M14 28C21.732 28 28 21.732 28 14C28 6.26801 21.732 0 14 0C6.26801 0 0 6.26801 0 14C0 21.732 6.26801 28 14 28ZM12.6262 10.6418C12.6262 9.94757 13.1969 9.64117 14.1262 9.64117C15.4969 9.64117 17.2113 10.0796 18.5819 10.8544V7.28257C17.0806 6.66551 15.6 6.42045 14.1262 6.42045C10.6487 6.42045 8.4 8.30117 8.4 11.1476C8.4 15.5768 14.3969 14.8956 14.3969 16.7893C14.3969 17.6125 13.6956 17.9125 12.7019 17.9125C11.2025 17.9125 9.29813 17.2893 7.79063 16.4276V20.0573C9.46438 20.804 11.1512 21.1296 12.7019 21.1296C16.2696 21.1296 18.6196 19.3125 18.6196 16.4404C18.6131 11.6576 12.6262 12.4808 12.6262 10.6418Z"/>
                </svg>
                <span className="font-medium">Stripe</span>
              </div>
              {/* LobeHub */}
              <div className="flex items-center gap-2 text-muted-foreground">
                <div className="w-6 h-6 rounded bg-gradient-to-br from-cyan-400 to-blue-500" />
                <span className="font-medium">LobeHub</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why RocketOpp Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              {/* Left - Content */}
              <div>
                <span className="text-xs font-semibold text-primary uppercase tracking-wider">
                  Why Choose Us
                </span>
                <h2 className="text-4xl sm:text-5xl font-bold mt-4 mb-6">
                  AI-First. Results-Obsessed.
                </h2>
                <p className="text-xl text-muted-foreground mb-8">
                  We're not just another agency. We build AI into everything we do,
                  so your digital presence works smarter, faster, and never sleeps.
                </p>

                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Zap className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Speed That Matters</h3>
                      <p className="text-muted-foreground">Websites in weeks, not months. AI apps deployed in days. We move fast because your business can't wait.</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Cpu className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">AI That Works For You</h3>
                      <p className="text-muted-foreground">Every project includes AI optimization. Chatbots, automation, content generation - built in from day one.</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <CheckCircle2 className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Results, Not Excuses</h3>
                      <p className="text-muted-foreground">We track everything. If it's not working, we fix it. No fluff, no vanity metrics - just growth.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right - Products Showcase */}
              <div className="space-y-6">
                <div className="text-sm font-medium text-muted-foreground mb-4">
                  Our AI Products
                </div>
                {products.map((product) => (
                  <Link
                    key={product.name}
                    href={product.href}
                    className="group flex items-start gap-4 p-6 card-lifted overflow-hidden"
                  >
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${product.color} flex items-center justify-center flex-shrink-0 shadow-lg`}>
                      <product.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold">{product.name}</h3>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/10 text-green-400 border border-green-500/20">
                          {product.status}
                        </span>
                      </div>
                      <p className="text-sm text-primary font-medium mb-1">{product.tagline}</p>
                      <p className="text-sm text-muted-foreground">{product.description}</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                  </Link>
                ))}
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/marketplace">
                    View All Products
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <span className="text-xs font-semibold text-primary uppercase tracking-wider">
                How We Work
              </span>
              <h2 className="text-4xl sm:text-5xl font-bold mt-4 mb-6">
                Simple Process. Serious Results.
              </h2>
            </div>

            <div className="grid md:grid-cols-4 gap-8">
              {[
                { step: "01", title: "Discovery", desc: "We learn your business, goals, and challenges" },
                { step: "02", title: "Strategy", desc: "Custom plan built around your specific needs" },
                { step: "03", title: "Build", desc: "Rapid development with weekly updates" },
                { step: "04", title: "Launch & Grow", desc: "Deploy, optimize, and scale together" },
              ].map((item) => (
                <div key={item.step} className="text-center p-6 card-lifted-sm">
                  <div className="text-5xl font-black text-primary/20 mb-4">{item.step}</div>
                  <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                  <p className="text-muted-foreground">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold">Frequently Asked Questions</h2>
            </div>

            <div className="space-y-4">
              {faqs.map((faq, i) => (
                <div key={i} className="p-6 card-lifted-sm">
                  <h3 className="text-lg font-semibold mb-2">{faq.question}</h3>
                  <p className="text-muted-foreground">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-primary/10 via-background to-background relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.02)_1px,transparent_1px)] bg-[size:72px_72px]" />

        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl sm:text-5xl font-bold mb-6">
            Ready to Build Something Great?
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
            Let's talk about your project. No pressure, no obligations - just a conversation about how we can help.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" className="px-8 h-14 text-lg font-semibold shadow-lg shadow-primary/25" asChild>
              <Link href="/contact">
                Get Started Today
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="px-8 h-14 text-lg" asChild>
              <Link href="/marketplace">
                Browse AI Tools
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
