import type { Metadata } from "next"
import { Globe, Palette, ShoppingBag, Target, Code2, Smartphone, Zap, Shield, CheckCircle, ArrowRight, Star, Award, Users, TrendingUp } from "lucide-react"
import { ServiceHero } from "@/components/service-hero"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Footer from "@/components/footer"

export const metadata: Metadata = {
  title: "Professional Website Development Services | Custom Web Design | RocketOpp",
  description: "Transform your online presence with custom website development. We build high-converting, SEO-optimized websites using Next.js, React & modern technologies. 500+ sites delivered.",
  keywords: "website development, web design, custom websites, responsive design, Next.js development, React websites, SEO optimization, e-commerce websites, landing pages, RocketOpp",
  authors: [{ name: "RocketOpp", url: "https://rocketopp.com" }],
  openGraph: {
    title: "Professional Website Development Services | RocketOpp",
    description: "Custom website development that drives results. High-converting, SEO-optimized websites built with cutting-edge technology.",
    url: "https://rocketopp.com/services/website-development",
    siteName: "RocketOpp",
    images: [
      {
        url: "https://rocketopp.com/og-website-development.jpg",
        width: 1200,
        height: 630,
        alt: "RocketOpp Website Development Services",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Professional Website Development | RocketOpp",
    description: "Custom website development that drives results. 500+ sites delivered.",
    images: ["https://rocketopp.com/twitter-website-development.jpg"],
  },
  alternates: {
    canonical: "https://rocketopp.com/services/website-development",
  },
}

const services = [
  {
    icon: Palette,
    title: "Custom Web Design",
    description: "Unique, brand-aligned designs that captivate visitors and drive engagement. Every pixel crafted for conversion.",
    features: ["Brand Identity Integration", "UI/UX Best Practices", "Conversion-Focused Design"]
  },
  {
    id: "ecommerce",
    icon: ShoppingBag,
    title: "E-Commerce Solutions",
    description: "Full-featured online stores with secure payments, inventory management, and seamless checkout experiences.",
    features: ["Stripe/Payment Integration", "Inventory Management", "Mobile Commerce Ready"]
  },
  {
    id: "landing",
    icon: Target,
    title: "Landing Pages",
    description: "High-converting landing pages designed to capture leads and drive specific business actions.",
    features: ["A/B Testing Ready", "Lead Capture Forms", "Analytics Integration"]
  },
  {
    icon: Smartphone,
    title: "Responsive Development",
    description: "Mobile-first websites that look and perform beautifully on every device and screen size.",
    features: ["Mobile-First Approach", "Cross-Browser Support", "Touch Optimized"]
  },
]

const process = [
  { step: "01", title: "Discovery", description: "We learn your business, goals, and target audience to create a strategic roadmap." },
  { step: "02", title: "Design", description: "Custom mockups and prototypes for your approval before development begins." },
  { step: "03", title: "Development", description: "Clean code, rigorous testing, and continuous quality assurance throughout." },
  { step: "04", title: "Launch", description: "SEO setup, analytics integration, and ongoing performance monitoring." },
]

const stats = [
  { value: "500+", label: "Websites Delivered" },
  { value: "98%", label: "Client Satisfaction" },
  { value: "2.1s", label: "Avg Load Time" },
  { value: "245%", label: "Avg Traffic Increase" },
]

const technologies = [
  "Next.js 16", "React 19", "TypeScript", "Tailwind CSS", "Vercel", "Node.js", "PostgreSQL", "Supabase", "Stripe"
]

const faqs = [
  {
    question: "How long does it take to build a professional website?",
    answer: "A typical custom website takes 6-12 weeks from start to launch, depending on complexity. Simple landing pages can be completed in 2-3 weeks, while complex e-commerce sites may take 12-16 weeks. We provide detailed timelines during our discovery phase."
  },
  {
    question: "What makes RocketOpp's websites different from template-based solutions?",
    answer: "Our websites are built from scratch using Next.js and React, providing superior performance, SEO capabilities, and scalability. Unlike templates, every element is customized for your brand and optimized for conversion. We also build with AI integration capabilities from day one."
  },
  {
    question: "Do you provide hosting and maintenance?",
    answer: "Yes. We deploy on Vercel with global CDN for optimal performance and include maintenance packages covering security updates, content changes, and technical support. Your site stays fast, secure, and up-to-date."
  },
  {
    question: "How do you ensure my website ranks well on Google?",
    answer: "Every website follows Google's E-E-A-T guidelines with technical SEO optimization, Core Web Vitals optimization, structured data markup, mobile responsiveness, and content strategy aligned with search intent. We don't just build pretty sites—we build sites that get found."
  },
  {
    question: "What is your pricing structure?",
    answer: "Custom websites start at $5,000 for small business sites and scale based on features, integrations, and complexity. E-commerce sites typically range from $8,000-$25,000. We provide transparent quotes with no hidden fees after our initial consultation."
  },
]

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "Website Development Services",
  "provider": {
    "@type": "Organization",
    "name": "RocketOpp",
    "url": "https://rocketopp.com"
  },
  "description": "Professional website development services including custom web design, e-commerce solutions, and landing pages.",
  "areaServed": "Worldwide",
  "serviceType": "Website Development",
  "offers": {
    "@type": "Offer",
    "price": "5000",
    "priceCurrency": "USD",
    "priceSpecification": {
      "@type": "PriceSpecification",
      "price": "5000",
      "priceCurrency": "USD",
      "minPrice": "5000"
    }
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.9",
    "reviewCount": "127"
  }
}

export default function WebsiteDevelopmentPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main className="flex min-h-screen flex-col bg-background">
        <ServiceHero
          icon={<Globe className="w-6 h-6" />}
          title="Website Development That Converts"
          subtitle="Sites That Convert"
          description="Custom websites built for performance, SEO, and conversion. We don't just build websites—we build digital experiences that drive real business results."
          gradient="from-blue-500 to-cyan-500"
          stats={[
            { value: "500+", label: "Sites Delivered" },
            { value: "98%", label: "Satisfaction" },
            { value: "<2s", label: "Load Times" },
          ]}
          ctaText="Start Your Project"
          ctaHref="/contact?service=website-development"
        />

        {/* Stats Bar */}
        <section className="py-12 bg-muted/30 border-y border-border/50">
          <div className="container">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, i) => (
                <div key={i} className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-primary mb-1">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Services */}
        <section className="py-20">
          <div className="container">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Comprehensive Website Solutions</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                From stunning designs to powerful e-commerce platforms, we build websites that work as hard as you do.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {services.map((service, i) => {
                const Icon = service.icon
                return (
                  <div
                    key={i}
                    id={service.id}
                    className="p-8 bg-card rounded-xl border hover:border-primary/50 hover:shadow-lg transition-all group"
                  >
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold mb-3">{service.title}</h3>
                    <p className="text-muted-foreground mb-4">{service.description}</p>
                    <ul className="space-y-2">
                      {service.features.map((feature, j) => (
                        <li key={j} className="flex items-center gap-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Process */}
        <section className="py-20 bg-muted/30">
          <div className="container">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Proven Process</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                A battle-tested approach refined over hundreds of successful projects.
              </p>
            </div>

            <div className="grid md:grid-cols-4 gap-6">
              {process.map((step, i) => (
                <div key={i} className="relative p-6 bg-card rounded-xl border hover:border-primary/50 transition-all group">
                  <div className="text-5xl font-bold text-primary/10 mb-4 group-hover:text-primary/20 transition-colors">
                    {step.step}
                  </div>
                  <h3 className="text-lg font-bold mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Technologies */}
        <section className="py-20">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Built With Modern Technology</h2>
              <p className="text-lg text-muted-foreground">
                We use the latest technologies trusted by industry leaders.
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-4">
              {technologies.map((tech, i) => (
                <div
                  key={i}
                  className="px-6 py-3 bg-card border rounded-full hover:border-primary hover:bg-primary/5 transition-all"
                >
                  <span className="font-medium text-sm">{tech}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQs */}
        <section className="py-20 bg-muted/30">
          <div className="container">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Expert answers to help you make informed decisions about your website investment.
              </p>
            </div>

            <div className="max-w-3xl mx-auto space-y-4">
              {faqs.map((faq, i) => (
                <div key={i} className="p-6 bg-card rounded-xl border hover:border-primary/50 transition-all">
                  <h3 className="font-bold mb-3 flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    {faq.question}
                  </h3>
                  <p className="text-muted-foreground pl-8">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20">
          <div className="container">
            <div className="max-w-4xl mx-auto bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-2xl p-8 md:p-12 border border-blue-500/20 text-center">
              <Award className="w-16 h-16 text-primary mx-auto mb-6" />
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Build Your Website?</h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                Let's create a website that represents your brand and drives real business results.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Button size="lg" asChild className="group">
                  <Link href="/contact?service=website-development">
                    Start Your Project
                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/marketplace">View Our Work</Link>
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
