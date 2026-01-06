import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Rocket, Zap, Clock, Bot, Sparkles, Layers, Code2, Flame, ShoppingBag, CreditCard, Key } from "lucide-react"
import type { Metadata } from "next"
import Footer from "@/components/footer"
import { OrganizationSchema, WebsiteSchema, FAQSchema } from "@/components/seo/json-ld"

export const metadata: Metadata = {
  title: "RocketOpp - AI App Marketplace | Buy, Lease, or Own AI Tools",
  description:
    "The first marketplace where you can buy, subscribe, or lease-to-own complete AI applications. Build your business with automation tools that actually work.",
  keywords:
    "AI marketplace, AI apps, automation tools, lease to own software, AI agents, business automation, RocketOpp, Rocket+, MCPFED",
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
    title: "RocketOpp - AI App Marketplace | Buy, Lease, or Own AI Tools",
    description: "The first marketplace where you can buy, subscribe, or lease-to-own complete AI applications.",
    siteName: "RocketOpp",
    images: [
      {
        url: "https://rocketopp.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "RocketOpp - AI App Marketplace",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "RocketOpp - AI App Marketplace",
    description: "Buy, subscribe, or lease-to-own complete AI applications.",
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

const products = [
  {
    name: "Rocket+",
    tagline: "Supercharge Your CRM",
    description: "Modular enhancements that make your CRM actually useful. AI course generation, workflow automation, and 50+ tools that work while you don't.",
    href: "/marketplace/rocket-plus",
    icon: Rocket,
    color: "from-orange-500 to-red-500",
    status: "Live"
  },
  {
    name: "MCPFED",
    tagline: "Federation of AI Agents",
    description: "Connect, manage, and orchestrate MCP servers. The command center for your AI tools.",
    href: "/marketplace/mcpfed",
    icon: Bot,
    color: "from-cyan-500 to-blue-500",
    status: "Live"
  },
  {
    name: "BotCoaches",
    tagline: "AI That Knows You",
    description: "Personalized AI instruction sets. Generate custom Skills, prompts, and coaching profiles for any AI platform.",
    href: "/marketplace/botcoaches",
    icon: Sparkles,
    color: "from-purple-500 to-pink-500",
    status: "Coming Soon"
  },
  {
    name: "CRO9",
    tagline: "Conversion Intelligence",
    description: "Track, analyze, optimize. Know exactly what's working and what's not. Make decisions with data, not guesses.",
    href: "/marketplace/cro9",
    icon: Zap,
    color: "from-green-500 to-emerald-500",
    status: "Coming Soon"
  },
]

const faqs = [
  {
    question: "What is lease-to-own software?",
    answer: "Unlike traditional subscriptions where you pay forever, lease-to-own lets you make fixed monthly payments until you own the software outright. After completing payments, the software is yours forever with no ongoing fees."
  },
  {
    question: "Can I swap between different AI providers?",
    answer: "Yes! Our products are built with interchangeable AI backends. Switch between Claude, GPT, or local models based on your needs and preferences."
  },
  {
    question: "What happens if I cancel my subscription?",
    answer: "For subscriptions, you lose access when canceled. For lease-to-own, you keep what you've paid for - if you've made 6 of 12 payments, you've earned 50% ownership."
  },
  {
    question: "Can I sell my own apps on the marketplace?",
    answer: "Yes! We're opening the marketplace to verified sellers. Build apps that integrate with the RocketOpp ecosystem and reach thousands of businesses."
  }
]

export default function HomePage() {
  return (
    <div className="w-full overflow-x-hidden bg-background">
      <OrganizationSchema />
      <WebsiteSchema />
      <FAQSchema items={faqs} />

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/10 via-background to-background" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-orange-500/5 rounded-full blur-3xl" />

        <div className="relative z-10 container mx-auto px-4 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8">
            <Flame className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">The AI App Marketplace</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight mb-6">
            <span className="text-foreground">Buy. Lease.</span>
            <br />
            <span className="bg-gradient-to-r from-primary via-orange-400 to-red-500 bg-clip-text text-transparent">
              Own.
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-xl sm:text-2xl text-muted-foreground max-w-3xl mx-auto mb-4">
            Complete AI applications ready to deploy.
          </p>
          <p className="text-lg text-muted-foreground/70 max-w-2xl mx-auto mb-10">
            The first marketplace where you can buy outright, subscribe monthly,
            <br className="hidden sm:block" />
            or lease-to-own the software you use.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Button size="lg" className="px-8 h-14 text-lg font-semibold shadow-lg shadow-primary/20" asChild>
              <Link href="/marketplace">
                <ShoppingBag className="w-5 h-5 mr-2" />
                Browse Marketplace
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="px-8 h-14 text-lg" asChild>
              <Link href="/register">
                Create Account
              </Link>
            </Button>
          </div>

          {/* Value Props */}
          <div className="flex flex-wrap justify-center gap-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Key className="w-4 h-4 text-primary" />
              <span>Lease-to-Own</span>
            </div>
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-primary" />
              <span>Plugin Ecosystem</span>
            </div>
            <div className="flex items-center gap-2">
              <Code2 className="w-4 h-4 text-primary" />
              <span>Interchangeable AI</span>
            </div>
          </div>
        </div>
      </section>

      {/* Lease-to-Own Explainer */}
      <section className="py-24 bg-gradient-to-b from-primary/5 to-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <span className="text-xs font-semibold text-primary uppercase tracking-wider">
              Industry First
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold mt-4 mb-6">
              Stop Renting. Start Owning.
            </h2>
            <p className="text-xl text-muted-foreground">
              Traditional SaaS means paying forever. We believe if you use software long enough,
              you should own it outright.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center p-8 rounded-2xl bg-card border border-border">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
                <CreditCard className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">Buy Outright</h3>
              <p className="text-muted-foreground">
                One payment. Lifetime access. Perfect for businesses ready to commit.
              </p>
            </div>

            <div className="text-center p-8 rounded-2xl bg-card border border-primary/50 relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="text-xs font-semibold text-primary-foreground bg-primary px-3 py-1 rounded-full">
                  Most Popular
                </span>
              </div>
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
                <Key className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">Lease-to-Own</h3>
              <p className="text-muted-foreground">
                Make monthly payments. After 12-24 months, the software is yours forever.
              </p>
            </div>

            <div className="text-center p-8 rounded-2xl bg-card border border-border">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
                <Clock className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">Subscribe</h3>
              <p className="text-muted-foreground">
                Traditional monthly subscription. Flexible, cancel anytime.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section id="products" className="py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold mb-4">Featured Products</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              AI applications built by RocketOpp. Each one solves a real problem.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {products.map((product) => (
              <Link
                key={product.name}
                href={product.href}
                className="group relative p-8 rounded-2xl bg-card border border-border hover:border-primary/50 transition-all duration-300"
              >
                {/* Status Badge */}
                <div className="absolute top-6 right-6">
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                    product.status === "Live"
                      ? "bg-green-500/10 text-green-400 border border-green-500/20"
                      : "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"
                  }`}>
                    {product.status}
                  </span>
                </div>

                {/* Icon */}
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${product.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <product.icon className="w-7 h-7 text-white" />
                </div>

                {/* Content */}
                <h3 className="text-2xl font-bold mb-1">{product.name}</h3>
                <p className="text-primary font-medium mb-3">{product.tagline}</p>
                <p className="text-muted-foreground leading-relaxed">{product.description}</p>

                {/* Arrow */}
                <div className="mt-6 flex items-center text-primary font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  <span>View Details</span>
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button size="lg" variant="outline" asChild>
              <Link href="/marketplace">
                View All Products
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Ecosystem Section */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-4xl sm:text-5xl font-bold text-center mb-16">
              One Ecosystem. Infinite Possibilities.
            </h2>

            <div className="grid md:grid-cols-3 gap-12">
              <div className="text-center">
                <div className="text-6xl font-black text-primary/20 mb-4">01</div>
                <h3 className="text-xl font-bold mb-3">Interchangeable AI</h3>
                <p className="text-muted-foreground">
                  Swap between Claude, GPT, or local models. Your apps, your AI choice.
                </p>
              </div>
              <div className="text-center">
                <div className="text-6xl font-black text-primary/20 mb-4">02</div>
                <h3 className="text-xl font-bold mb-3">Plugin Architecture</h3>
                <p className="text-muted-foreground">
                  Extend any product with plugins. Build your own or use community plugins.
                </p>
              </div>
              <div className="text-center">
                <div className="text-6xl font-black text-primary/20 mb-4">03</div>
                <h3 className="text-xl font-bold mb-3">Data Portability</h3>
                <p className="text-muted-foreground">
                  Your data belongs to you. Export everything, integrate everywhere.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>

            <div className="space-y-6">
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
      <section className="py-24 bg-gradient-to-br from-primary/10 via-background to-background">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl sm:text-5xl font-bold mb-6">
            Ready to Own Your Tools?
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
            Join thousands of businesses using AI apps that work while they don't.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" className="px-8 h-14 text-lg font-semibold shadow-lg shadow-primary/20" asChild>
              <Link href="/marketplace">
                <ShoppingBag className="w-5 h-5 mr-2" />
                Explore Marketplace
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="px-8 h-14 text-lg" asChild>
              <Link href="/contact">
                Talk to Us
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
