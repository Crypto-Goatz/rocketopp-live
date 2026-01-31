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
  Phone,
  Play,
  TrendingUp,
  Users,
  Clock,
  Target,
  Lightbulb,
  Terminal,
  MousePointer2,
  BarChart3
} from "lucide-react"
import type { Metadata } from "next"
import Footer from "@/components/footer"
import { OrganizationSchema, WebsiteSchema, FAQSchema, VideoSchema, ServiceSchema } from "@/components/seo/json-ld"
import { HeroAnimation } from "@/components/hero-animation"

// Comprehensive SXO-optimized metadata
export const metadata: Metadata = {
  title: "RocketOpp - AI-Powered Digital Agency | Stop Dreaming. Start Shipping.",
  description:
    "Transform ideas into live products in weeks, not months. RocketOpp builds AI applications, websites, mobile apps, and automation systems. From concept to deployment—we ship while others plan. Get a free consultation today.",
  keywords: [
    // Primary keywords
    "AI digital agency",
    "custom AI applications",
    "AI app development",
    "website development agency",
    "custom software development",
    "business automation",
    // Service keywords
    "AI chatbot development",
    "workflow automation",
    "SOP automation",
    "CRM automation",
    "marketing automation",
    "SEO agency",
    "PPC management",
    "conversion rate optimization",
    // Intent keywords
    "hire AI developers",
    "custom app builders",
    "AI integration services",
    "digital transformation agency",
    "startup tech partner",
    // Product keywords
    "Rocket+ CRM tools",
    "MCPFED MCP server",
    "Model Context Protocol",
    "AI marketplace",
    // Location/modifier keywords
    "best AI agency",
    "top AI development company",
    "enterprise AI solutions",
    "AI for small business"
  ].join(", "),
  authors: [{ name: "RocketOpp", url: "https://rocketopp.com" }],
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
    title: "RocketOpp - Stop Dreaming. Start Shipping.",
    description: "Transform ideas into live products in weeks. AI applications, websites, and automation systems built fast.",
    siteName: "RocketOpp",
    images: [
      {
        url: "https://rocketopp.com/images/rocketopp-og.png",
        width: 1200,
        height: 630,
        alt: "RocketOpp - AI-Powered Digital Agency",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "RocketOpp - Stop Dreaming. Start Shipping.",
    description: "Transform ideas into live products in weeks. AI applications, websites, and automation systems built fast.",
    images: [{
      url: "https://rocketopp.com/images/rocketopp-twitter.png",
      width: 1200,
      height: 600,
      alt: "RocketOpp - AI-Powered Digital Agency",
    }],
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
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION || "",
  },
  category: "Technology",
  classification: "Business Software",
  other: {
    "geo.region": "US",
    "geo.placename": "United States",
    "rating": "General",
    "revisit-after": "7 days",
    "DC.title": "RocketOpp - AI-Powered Digital Agency",
    "DC.creator": "RocketOpp",
    "DC.subject": "AI Development, Web Development, Business Automation",
    "DC.description": "Transform ideas into live products in weeks, not months.",
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
    features: ["Custom Design", "Mobile-First", "CRO Built-In", "Lightning Fast"],
    metric: "2-4 Week Delivery"
  },
  {
    name: "AI Applications",
    tagline: "Intelligence On Demand",
    description: "Custom AI tools and automations that work while you sleep. From chatbots to full workflow automation.",
    href: "/services/ai-applications",
    icon: Cpu,
    color: "from-orange-500 to-red-500",
    features: ["Custom AI Tools", "Workflow Automation", "Rocket+", "MCPFED"],
    metric: "50+ AI Tools Built"
  },
  {
    name: "App Development",
    tagline: "Ideas to Reality",
    description: "Custom web and mobile applications built for your exact needs. APIs, integrations, and scalable architecture.",
    href: "/services/app-development",
    icon: Code2,
    color: "from-purple-500 to-pink-500",
    features: ["Custom Apps", "API Development", "Integrations", "Mobile Apps"],
    metric: "Full-Stack Capability"
  },
  {
    name: "SOP Automation",
    tagline: "Systems That Scale",
    description: "Transform chaotic processes into streamlined systems. Document, automate, and train your team on SOPs that actually work.",
    href: "/services/sop-automation",
    icon: Workflow,
    color: "from-indigo-500 to-violet-500",
    features: ["Process Mapping", "Workflow Automation", "Team Training", "AI Documentation"],
    metric: "90% Time Savings"
  },
  {
    name: "Online Marketing",
    tagline: "Growth That Compounds",
    description: "Multi-channel marketing that gets results. PPC, social media, content, and email campaigns that drive revenue.",
    href: "/services/online-marketing",
    icon: Megaphone,
    color: "from-green-500 to-emerald-500",
    features: ["PPC & Ads", "Social Media", "Content Strategy", "Email Campaigns"],
    metric: "ROI-Focused"
  },
  {
    name: "Search Optimization",
    tagline: "Get Found First",
    description: "Dominate search results with technical SEO, content optimization, and local search strategies that bring organic traffic.",
    href: "/services/search-optimization",
    icon: Search,
    color: "from-yellow-500 to-orange-500",
    features: ["Technical SEO", "Local SEO", "Content SEO", "SEO Audits"],
    metric: "Page 1 Rankings"
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
    status: "Live",
    users: "2,500+ Users"
  },
  {
    name: "MCPFED",
    tagline: "AI Agent Hub",
    description: "Connect and orchestrate MCP servers. The command center for all your AI tools.",
    href: "/marketplace/mcpfed",
    icon: Bot,
    color: "from-cyan-500 to-blue-500",
    status: "Live",
    users: "800+ Servers"
  },
]

const stats = [
  { value: "500+", label: "Projects Shipped", icon: Rocket },
  { value: "98%", label: "Client Satisfaction", icon: Star },
  { value: "24/7", label: "AI Working For You", icon: Bot },
  { value: "<2wk", label: "Average Launch Time", icon: Clock },
]

const faqs = [
  {
    question: "What makes RocketOpp different from other agencies?",
    answer: "We combine traditional digital services with cutting-edge AI applications. Everything we build is designed to work smarter, not harder. Plus, we offer our AI tools on a lease-to-own basis—an industry first."
  },
  {
    question: "How long does a typical project take?",
    answer: "Websites typically launch in 2-4 weeks. Custom applications take 4-12 weeks depending on complexity. Marketing campaigns can start within days. We move fast because your business can't wait."
  },
  {
    question: "Do you offer ongoing support?",
    answer: "Absolutely. We offer maintenance packages for all our services. For AI applications, updates and improvements are included with your subscription or lease."
  },
  {
    question: "Can I use my own tools with your AI applications?",
    answer: "Yes! Our AI applications are built with interchangeable backends. Switch between Claude, GPT, or other models. Everything integrates with your existing stack."
  },
  {
    question: "What if I just have an idea but no specs?",
    answer: "Perfect. We love working from concepts. Submit your idea through our Pitch Idea page, sign an NDA, and we'll help you develop the specifications. We're especially interested in AI partnership opportunities."
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

const socialProof = [
  { quote: "Shipped our AI app in 10 days. Thought it would take months.", author: "Sarah M.", role: "Startup Founder" },
  { quote: "Finally, an agency that actually delivers what they promise.", author: "Marcus T.", role: "CEO, TechScale" },
  { quote: "Our conversion rate tripled after the redesign.", author: "Jennifer K.", role: "Marketing Director" },
]

export default function HomePage() {
  return (
    <div className="w-full overflow-x-hidden bg-background">
      {/* Structured Data */}
      <OrganizationSchema />
      <WebsiteSchema />
      <FAQSchema items={faqs} />
      <ServiceSchema
        name="AI Application Development"
        description="Custom AI applications, chatbots, and automation systems built for your business"
        provider="RocketOpp"
        areaServed="Worldwide"
      />

      {/* ==================== EPIC HERO SECTION ==================== */}
      <section className="relative min-h-[100vh] flex items-center justify-center overflow-hidden">
        {/* Animated Background */}
        <HeroAnimation />

        {/* Gradient Overlays for depth */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/20 to-background z-[1]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent z-[1]" />

        <div className="relative z-10 container mx-auto px-4 text-center pt-20 pb-32">
          {/* Eyebrow Badge */}
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-primary/20 to-orange-500/10 backdrop-blur-xl border border-primary/30 mb-10 animate-fade-in shadow-lg shadow-primary/10">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            <span className="text-sm font-semibold text-primary">AI-Powered Digital Agency</span>
            <ChevronRight className="w-4 h-4 text-primary/70" />
          </div>

          {/* MAIN HEADLINE - The Disruptive Tagline */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-black tracking-tight mb-8 animate-slide-up">
            <span className="block text-foreground drop-shadow-2xl">
              Stop Dreaming.
            </span>
            <span className="block mt-2 relative">
              <span className="absolute inset-0 bg-gradient-to-r from-primary via-orange-400 to-red-500 bg-clip-text text-transparent blur-2xl opacity-50">
                Start Shipping.
              </span>
              <span className="relative bg-gradient-to-r from-primary via-orange-400 to-red-500 bg-clip-text text-transparent animate-gradient-x">
                Start Shipping.
              </span>
            </span>
          </h1>

          {/* Value Proposition */}
          <p className="text-xl sm:text-2xl md:text-3xl text-white/90 font-medium max-w-4xl mx-auto mb-4 animate-slide-up animation-delay-200">
            Ideas become products. Concepts become code. <br className="hidden sm:block" />
            <span className="text-primary">Weeks, not months.</span>
          </p>

          <p className="text-lg text-white/60 max-w-2xl mx-auto mb-12 animate-slide-up animation-delay-400">
            AI apps. Websites. Automation. Marketing. SEO. <br />
            We build it all—so you can focus on what matters.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-slide-up animation-delay-600">
            <Button
              size="lg"
              className="group px-10 h-16 text-lg font-bold shadow-2xl shadow-primary/30 hover:shadow-primary/50 transition-all duration-300 hover:scale-105 bg-gradient-to-r from-primary to-orange-500 hover:from-primary hover:to-red-500"
              asChild
            >
              <Link href="/contact">
                Start Your Project
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="px-10 h-16 text-lg font-semibold bg-white/5 border-white/20 backdrop-blur-md hover:bg-white/10 hover:border-white/40 transition-all duration-300"
              asChild
            >
              <Link href="/pitch-idea">
                <Lightbulb className="w-5 h-5 mr-2" />
                Pitch Your Idea
              </Link>
            </Button>
          </div>

          {/* Stats Bar with Icons */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto animate-fade-in animation-delay-800">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="relative group p-6 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 hover:border-primary/30 transition-all duration-300 hover:bg-white/10"
              >
                <stat.icon className="w-6 h-6 text-primary/70 mb-3 mx-auto" />
                <div className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-primary to-orange-400 bg-clip-text text-transparent">
                  {stat.value}
                </div>
                <div className="text-sm text-white/60 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Quick Contact */}
          <div className="mt-12 animate-fade-in animation-delay-1000">
            <a
              href="tel:+18788881238"
              className="inline-flex items-center gap-2 text-white/60 hover:text-primary transition-colors"
            >
              <Phone className="w-4 h-4" />
              <span className="text-sm">(878) 888-1238 — Talk to us today</span>
            </a>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce">
          <div className="flex flex-col items-center gap-2">
            <span className="text-xs text-white/40 uppercase tracking-widest">Explore</span>
            <div className="w-6 h-10 rounded-full border-2 border-white/20 flex items-start justify-center p-2">
              <div className="w-1.5 h-3 rounded-full bg-primary animate-pulse" />
            </div>
          </div>
        </div>
      </section>

      {/* ==================== SOCIAL PROOF BAR ==================== */}
      <section className="py-8 bg-muted/30 border-y border-border/50">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center items-center gap-8 lg:gap-16">
            {socialProof.map((item, i) => (
              <div key={i} className="flex items-center gap-4 max-w-xs">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-orange-500/10 flex items-center justify-center">
                  <Star className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-foreground font-medium">"{item.quote}"</p>
                  <p className="text-xs text-muted-foreground mt-1">— {item.author}, {item.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== SERVICES SECTION ==================== */}
      <section id="services" className="py-28 bg-gradient-to-b from-background via-muted/30 to-background relative">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.01)_1px,transparent_1px)] bg-[size:64px_64px] pointer-events-none" />

        <div className="container mx-auto px-4 relative">
          <div className="text-center mb-20">
            <span className="inline-flex items-center gap-2 text-xs font-semibold text-primary uppercase tracking-wider mb-4">
              <Terminal className="w-4 h-4" />
              What We Build
            </span>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black mt-4 mb-6">
              Everything Digital. <br className="hidden sm:block" />
              <span className="text-primary">One Team.</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Six core services. Infinite possibilities. <br />
              Each one backed by AI and obsessive attention to detail.
            </p>
          </div>

          {/* Services Grid - 3x2 */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-7xl mx-auto">
            {services.map((service) => (
              <Link
                key={service.name}
                href={service.href}
                className="group relative p-8 rounded-3xl bg-card/50 border border-border/50 backdrop-blur-sm overflow-hidden transition-all duration-500 hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/5 hover:-translate-y-1"
              >
                {/* Gradient overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Metric badge */}
                <div className="absolute top-6 right-6 text-xs font-medium text-primary/70 bg-primary/10 px-3 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                  {service.metric}
                </div>

                {/* Icon */}
                <div className={`relative w-16 h-16 rounded-2xl bg-gradient-to-br ${service.color} flex items-center justify-center mb-6 shadow-lg shadow-black/20 group-hover:scale-110 transition-transform duration-300`}>
                  <service.icon className="w-8 h-8 text-white" />
                </div>

                {/* Content */}
                <h3 className="relative text-2xl font-bold mb-2 group-hover:text-primary transition-colors">{service.name}</h3>
                <p className="relative text-primary/80 font-medium mb-3">{service.tagline}</p>
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
                <div className="relative flex items-center text-primary font-semibold">
                  <span>Learn More</span>
                  <ChevronRight className="w-5 h-5 ml-1 group-hover:translate-x-2 transition-transform duration-300" />
                </div>
              </Link>
            ))}
          </div>

          {/* Services CTA */}
          <div className="text-center mt-16">
            <Button size="lg" variant="outline" className="px-8" asChild>
              <Link href="/services">
                View All Services
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ==================== INTEGRATIONS ==================== */}
      <section className="py-16 border-y border-border/50 bg-muted/10">
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
                className="group flex flex-col items-center gap-2 opacity-50 hover:opacity-100 transition-all duration-300"
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

      {/* ==================== WHY ROCKETOPP / VALUE PROPS ==================== */}
      <section className="py-28 relative overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-0 w-96 h-96 bg-primary/5 rounded-full blur-[200px]" />
          <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-[200px]" />
        </div>

        <div className="container mx-auto px-4 relative">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              {/* Left - Content */}
              <div>
                <span className="inline-flex items-center gap-2 text-xs font-semibold text-primary uppercase tracking-wider mb-4">
                  <Target className="w-4 h-4" />
                  Why Choose Us
                </span>
                <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black mt-4 mb-6 leading-tight">
                  AI-First.<br />
                  <span className="text-primary">Results-Obsessed.</span>
                </h2>
                <p className="text-xl text-muted-foreground mb-10">
                  We're not just another agency. We build AI into everything we do,
                  so your digital presence works smarter, faster, and <span className="text-foreground font-medium">never sleeps</span>.
                </p>

                <div className="space-y-8">
                  <div className="flex gap-5">
                    <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-orange-500/10 flex items-center justify-center">
                      <Zap className="w-7 h-7 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-2">Speed That Matters</h3>
                      <p className="text-muted-foreground">Websites in weeks, not months. AI apps deployed in days. We move fast because your business can't wait.</p>
                    </div>
                  </div>

                  <div className="flex gap-5">
                    <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-orange-500/10 flex items-center justify-center">
                      <Cpu className="w-7 h-7 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-2">AI That Works For You</h3>
                      <p className="text-muted-foreground">Every project includes AI optimization. Chatbots, automation, content generation—built in from day one.</p>
                    </div>
                  </div>

                  <div className="flex gap-5">
                    <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-orange-500/10 flex items-center justify-center">
                      <BarChart3 className="w-7 h-7 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-2">Results, Not Excuses</h3>
                      <p className="text-muted-foreground">We track everything. If it's not working, we fix it. No fluff, no vanity metrics—just growth.</p>
                    </div>
                  </div>
                </div>

                <div className="mt-10 flex flex-wrap gap-4">
                  <Button size="lg" asChild>
                    <Link href="/contact">
                      Get Started
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </Button>
                  <Button size="lg" variant="ghost" asChild>
                    <Link href="/about">
                      Learn About Us
                    </Link>
                  </Button>
                </div>
              </div>

              {/* Right - Products Showcase */}
              <div className="space-y-6">
                <div className="text-sm font-semibold text-muted-foreground mb-6 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-primary" />
                  Our AI Products
                </div>
                {products.map((product) => (
                  <Link
                    key={product.name}
                    href={product.href}
                    className="group flex items-start gap-5 p-6 rounded-2xl bg-card/50 border border-border/50 backdrop-blur-sm overflow-hidden transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
                  >
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${product.color} flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform`}>
                      <product.icon className="w-7 h-7 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-bold text-lg">{product.name}</h3>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/10 text-green-400 border border-green-500/20">
                          {product.status}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {product.users}
                        </span>
                      </div>
                      <p className="text-sm text-primary font-medium mb-1">{product.tagline}</p>
                      <p className="text-sm text-muted-foreground">{product.description}</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
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

      {/* ==================== MCP & TRUST SECTION ==================== */}
      <section className="py-24 bg-gradient-to-b from-muted/20 via-primary/5 to-muted/20 relative overflow-hidden">
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
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black mb-4">
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
            <div className="p-6 rounded-2xl bg-card/50 border border-border/50 backdrop-blur-sm text-center hover:border-green-500/30 transition-colors group">
              <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-green-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Shield className="w-7 h-7 text-green-500" />
              </div>
              <h3 className="font-semibold mb-2">SOC 2 Type II</h3>
              <p className="text-sm text-muted-foreground">Enterprise-grade security controls</p>
            </div>

            {/* Privacy */}
            <div className="p-6 rounded-2xl bg-card/50 border border-border/50 backdrop-blur-sm text-center hover:border-blue-500/30 transition-colors group">
              <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-blue-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Lock className="w-7 h-7 text-blue-500" />
              </div>
              <h3 className="font-semibold mb-2">GDPR Compliant</h3>
              <p className="text-sm text-muted-foreground">Full data privacy protection</p>
            </div>

            {/* Verified */}
            <div className="p-6 rounded-2xl bg-card/50 border border-border/50 backdrop-blur-sm text-center hover:border-primary/30 transition-colors group">
              <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                <BadgeCheck className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">ISO 27001</h3>
              <p className="text-sm text-muted-foreground">International security standard</p>
            </div>

            {/* Uptime */}
            <div className="p-6 rounded-2xl bg-card/50 border border-border/50 backdrop-blur-sm text-center hover:border-purple-500/30 transition-colors group">
              <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-purple-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Star className="w-7 h-7 text-purple-500" />
              </div>
              <h3 className="font-semibold mb-2">99.9% Uptime</h3>
              <p className="text-sm text-muted-foreground">Reliable Vercel Edge hosting</p>
            </div>
          </div>

          {/* Partners & Trusted By */}
          <div className="text-center">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-8 block">
              Built With Industry Leaders
            </span>
            <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12 max-w-4xl mx-auto opacity-70">
              {/* Anthropic */}
              <div className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                <Bot className="w-6 h-6" />
                <span className="font-medium">Anthropic</span>
              </div>
              {/* Vercel */}
              <div className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                <svg className="w-6 h-6" viewBox="0 0 76 65" fill="currentColor">
                  <path d="M37.5274 0L75.0548 65H0L37.5274 0Z" />
                </svg>
                <span className="font-medium">Vercel</span>
              </div>
              {/* Supabase */}
              <div className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
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
              <div className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                <svg className="w-6 h-6" viewBox="0 0 28 28" fill="currentColor">
                  <path fillRule="evenodd" clipRule="evenodd" d="M14 28C21.732 28 28 21.732 28 14C28 6.26801 21.732 0 14 0C6.26801 0 0 6.26801 0 14C0 21.732 6.26801 28 14 28ZM12.6262 10.6418C12.6262 9.94757 13.1969 9.64117 14.1262 9.64117C15.4969 9.64117 17.2113 10.0796 18.5819 10.8544V7.28257C17.0806 6.66551 15.6 6.42045 14.1262 6.42045C10.6487 6.42045 8.4 8.30117 8.4 11.1476C8.4 15.5768 14.3969 14.8956 14.3969 16.7893C14.3969 17.6125 13.6956 17.9125 12.7019 17.9125C11.2025 17.9125 9.29813 17.2893 7.79063 16.4276V20.0573C9.46438 20.804 11.1512 21.1296 12.7019 21.1296C16.2696 21.1296 18.6196 19.3125 18.6196 16.4404C18.6131 11.6576 12.6262 12.4808 12.6262 10.6418Z"/>
                </svg>
                <span className="font-medium">Stripe</span>
              </div>
              {/* LobeHub */}
              <div className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                <div className="w-6 h-6 rounded bg-gradient-to-br from-cyan-400 to-blue-500" />
                <span className="font-medium">LobeHub</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== PROCESS SECTION ==================== */}
      <section className="py-28 bg-background relative">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-20">
              <span className="inline-flex items-center gap-2 text-xs font-semibold text-primary uppercase tracking-wider mb-4">
                <MousePointer2 className="w-4 h-4" />
                How We Work
              </span>
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black mt-4 mb-6">
                Simple Process. <br />
                <span className="text-primary">Serious Results.</span>
              </h2>
            </div>

            <div className="grid md:grid-cols-4 gap-6">
              {[
                { step: "01", title: "Discovery", desc: "We learn your business, goals, and challenges", icon: Users },
                { step: "02", title: "Strategy", desc: "Custom plan built around your specific needs", icon: Target },
                { step: "03", title: "Build", desc: "Rapid development with weekly updates", icon: Code2 },
                { step: "04", title: "Launch & Grow", desc: "Deploy, optimize, and scale together", icon: TrendingUp },
              ].map((item, i) => (
                <div key={item.step} className="relative text-center p-8 rounded-2xl bg-card/50 border border-border/50 hover:border-primary/30 transition-all group">
                  {/* Connector line */}
                  {i < 3 && (
                    <div className="hidden md:block absolute top-1/2 -right-3 w-6 h-0.5 bg-gradient-to-r from-border to-primary/30" />
                  )}
                  <div className="text-6xl font-black text-primary/10 mb-4 group-hover:text-primary/20 transition-colors">{item.step}</div>
                  <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <item.icon className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                  <p className="text-muted-foreground">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ==================== VIDEO INSIGHTS ==================== */}
      <section className="py-28 bg-gradient-to-b from-background to-muted/20">
        <VideoSchema
          name="25 Years of Marketing Trends: What Actually Works"
          description="A deep dive into marketing evolution over the past 25 years. Learn what strategies have stood the test of time and what's driving results today."
          thumbnailUrl="https://img.youtube.com/vi/90N8kne60Os/maxresdefault.jpg"
          uploadDate="2024-01-01"
          duration="PT10M"
          embedUrl="https://www.youtube.com/embed/90N8kne60Os"
        />
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <span className="inline-flex items-center gap-2 text-xs font-semibold text-primary uppercase tracking-wider mb-4">
                <Play className="w-4 h-4" />
                Industry Insights
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black mt-4 mb-4">
                25 Years of Marketing Evolution
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                See how marketing has transformed over the decades and what strategies are driving results today.
              </p>
            </div>

            {/* Video Embed */}
            <div className="relative aspect-video rounded-3xl overflow-hidden bg-zinc-900 border border-border/50 shadow-2xl shadow-black/40 group">
              <iframe
                src="https://www.youtube.com/embed/90N8kne60Os"
                title="25 Years of Marketing Trends"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="absolute inset-0 w-full h-full"
                loading="lazy"
              />
            </div>

            <div className="mt-10 text-center">
              <p className="text-muted-foreground mb-6">
                Want to leverage these insights for your business? Our team combines decades of marketing experience with cutting-edge AI.
              </p>
              <Button variant="outline" asChild>
                <Link href="/services/online-marketing">
                  Explore Our Marketing Services
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== FAQ SECTION ==================== */}
      <section className="py-28 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-16">
              <span className="text-xs font-semibold text-primary uppercase tracking-wider mb-4 block">
                Questions & Answers
              </span>
              <h2 className="text-3xl sm:text-4xl font-black">Frequently Asked Questions</h2>
            </div>

            <div className="space-y-4">
              {faqs.map((faq, i) => (
                <div key={i} className="p-6 rounded-2xl bg-card/50 border border-border/50 hover:border-primary/20 transition-colors">
                  <h3 className="text-lg font-semibold mb-3 flex items-start gap-3">
                    <span className="text-primary font-bold">Q:</span>
                    {faq.question}
                  </h3>
                  <p className="text-muted-foreground pl-7">{faq.answer}</p>
                </div>
              ))}
            </div>

            <div className="text-center mt-10">
              <p className="text-muted-foreground mb-4">Still have questions?</p>
              <Button variant="outline" asChild>
                <Link href="/contact">
                  <Phone className="w-4 h-4 mr-2" />
                  Talk to Our Team
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== FINAL CTA SECTION ==================== */}
      <section className="py-32 bg-gradient-to-br from-primary/10 via-background to-background relative overflow-hidden">
        {/* Background grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.02)_1px,transparent_1px)] bg-[size:72px_72px]" />

        {/* Glow effects */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-primary/10 rounded-full blur-[150px] pointer-events-none" />

        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8">
            <Rocket className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">Ready to Launch?</span>
          </div>

          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black mb-6">
            Your Ideas Deserve <br />
            <span className="text-primary">Better Than "Coming Soon"</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-12">
            Stop waiting. Stop planning. Let's build something real.
            <br />
            <span className="text-foreground font-medium">Free consultation. No obligations.</span>
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" className="px-10 h-16 text-lg font-bold shadow-2xl shadow-primary/30 bg-gradient-to-r from-primary to-orange-500" asChild>
              <Link href="/contact">
                Start Your Project
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="px-10 h-16 text-lg" asChild>
              <Link href="/pitch-idea">
                <Lightbulb className="w-5 h-5 mr-2" />
                Pitch an Idea
              </Link>
            </Button>
          </div>

          <div className="mt-12 flex flex-wrap justify-center gap-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              Free Consultation
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              No Long-Term Contracts
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              Results Guaranteed
            </div>
          </div>

          <div className="mt-8">
            <a
              href="tel:+18788881238"
              className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors font-semibold"
            >
              <Phone className="w-5 h-5" />
              (878) 888-1238
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
