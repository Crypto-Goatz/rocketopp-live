import Link from "next/link"
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
  Workflow
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
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {services.map((service) => (
              <Link
                key={service.name}
                href={service.href}
                className="group relative p-8 rounded-2xl bg-card border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5"
              >
                {/* Icon */}
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${service.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                  <service.icon className="w-7 h-7 text-white" />
                </div>

                {/* Content */}
                <h3 className="text-2xl font-bold mb-2">{service.name}</h3>
                <p className="text-primary font-medium mb-3">{service.tagline}</p>
                <p className="text-muted-foreground leading-relaxed mb-6">{service.description}</p>

                {/* Features */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {service.features.map((feature) => (
                    <span key={feature} className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground">
                      {feature}
                    </span>
                  ))}
                </div>

                {/* Arrow */}
                <div className="flex items-center text-primary font-medium">
                  <span>Learn More</span>
                  <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
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
                    className="group flex items-start gap-4 p-6 rounded-xl bg-card border border-border hover:border-primary/50 transition-all"
                  >
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${product.color} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
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
                <div key={item.step} className="text-center">
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
                <div key={i} className="p-6 rounded-xl bg-card border border-border">
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
