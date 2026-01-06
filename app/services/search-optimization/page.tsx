import type { Metadata } from "next"
import { Search, Code2, Target, LineChart, Globe, Zap, FileText, MapPin, BarChart3, CheckCircle, ArrowRight, Award, TrendingUp, Eye } from "lucide-react"
import { ServiceHero } from "@/components/service-hero"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Footer from "@/components/footer"

export const metadata: Metadata = {
  title: "SEO Services | Search Engine Optimization | Get Found First | RocketOpp",
  description: "Dominate search results with expert SEO services. Technical optimization, local SEO, content strategy, and analytics that drive organic traffic and conversions.",
  keywords: "SEO services, search engine optimization, technical SEO, local SEO, SEO audit, keyword research, link building, organic traffic, Google ranking, RocketOpp",
  authors: [{ name: "RocketOpp", url: "https://rocketopp.com" }],
  openGraph: {
    title: "SEO Services | Search Engine Optimization | RocketOpp",
    description: "Expert SEO services that drive organic traffic and conversions. Technical SEO, local SEO, and content optimization.",
    url: "https://rocketopp.com/services/search-optimization",
    siteName: "RocketOpp",
    images: [
      {
        url: "https://rocketopp.com/og-search-optimization.jpg",
        width: 1200,
        height: 630,
        alt: "RocketOpp SEO Services",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SEO Services | RocketOpp",
    description: "Expert SEO that drives organic traffic and conversions.",
    images: ["https://rocketopp.com/twitter-search-optimization.jpg"],
  },
  alternates: {
    canonical: "https://rocketopp.com/services/search-optimization",
  },
}

const services = [
  {
    id: "technical",
    icon: Code2,
    title: "Technical SEO",
    description: "Fix the foundation. We audit and optimize your site's technical infrastructure for maximum search visibility.",
    features: ["Site Speed Optimization", "Core Web Vitals", "Structured Data Markup", "Crawl Optimization"]
  },
  {
    id: "local",
    icon: MapPin,
    title: "Local SEO",
    description: "Dominate local search. Get found by customers in your area with optimized local presence.",
    features: ["Google Business Profile", "Local Citations", "Review Management", "Local Content Strategy"]
  },
  {
    icon: FileText,
    title: "Content SEO",
    description: "Content that ranks. Strategic keyword targeting and content optimization that drives organic traffic.",
    features: ["Keyword Research", "Content Optimization", "Topic Clusters", "EEAT Optimization"]
  },
  {
    id: "analytics",
    icon: LineChart,
    title: "Analytics & Reporting",
    description: "Data-driven decisions. Comprehensive tracking and reporting to measure and improve performance.",
    features: ["Rank Tracking", "Traffic Analysis", "Conversion Tracking", "Competitor Monitoring"]
  },
]

const approach = [
  { title: "Audit", description: "Comprehensive analysis of your current SEO performance and opportunities." },
  { title: "Strategy", description: "Custom roadmap based on your goals, industry, and competition." },
  { title: "Execute", description: "Systematic implementation of technical, content, and off-page optimizations." },
  { title: "Measure", description: "Continuous monitoring, reporting, and strategy refinement." },
]

const stats = [
  { value: "187%", label: "Avg Traffic Increase" },
  { value: "Top 10", label: "Rankings Achieved" },
  { value: "3.2x", label: "Lead Growth" },
  { value: "92%", label: "Client Retention" },
]

const faqs = [
  {
    question: "How long does SEO take to show results?",
    answer: "SEO is a long-term strategy. You may see initial improvements in 3-4 months, but significant results typically take 6-12 months. Quick wins from technical fixes can happen faster, while competitive keyword rankings take longer to achieve."
  },
  {
    question: "What's included in a technical SEO audit?",
    answer: "Our audit covers site speed, Core Web Vitals, mobile optimization, indexing issues, crawl errors, URL structure, internal linking, structured data, security (HTTPS), and competitive analysis. You receive a detailed report with prioritized recommendations."
  },
  {
    question: "How do you approach keyword research?",
    answer: "We analyze search intent, competition, and business value to identify keywords that drive qualified traffic. We focus on a mix of high-volume head terms, long-tail keywords with conversion intent, and local search terms where applicable."
  },
  {
    question: "Do you guarantee first-page rankings?",
    answer: "No reputable SEO agency can guarantee specific rankings—Google's algorithm considers 200+ factors. What we guarantee is following Google's best practices, transparent reporting, and continuous optimization to improve your organic visibility over time."
  },
  {
    question: "How do you measure SEO success?",
    answer: "We track rankings, organic traffic, click-through rates, conversions, and revenue from organic search. You receive monthly reports showing progress across all metrics, plus insights on what's working and what we're optimizing next."
  },
]

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "SEO Services",
  "provider": {
    "@type": "Organization",
    "name": "RocketOpp",
    "url": "https://rocketopp.com"
  },
  "description": "Professional SEO services including technical optimization, local SEO, content strategy, and analytics.",
  "areaServed": "Worldwide",
  "serviceType": "Search Engine Optimization",
  "offers": {
    "@type": "Offer",
    "price": "2500",
    "priceCurrency": "USD",
    "priceSpecification": {
      "@type": "PriceSpecification",
      "price": "2500",
      "priceCurrency": "USD",
      "minPrice": "2500"
    }
  }
}

export default function SearchOptimizationPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main className="flex min-h-screen flex-col bg-background">
        <ServiceHero
          icon={<Search className="w-6 h-6" />}
          title="Get Found. Get Chosen."
          subtitle="Get Found First"
          description="Expert SEO services that increase your visibility in search results. We combine technical excellence with strategic content to drive qualified organic traffic that converts."
          gradient="from-yellow-500 to-orange-500"
          stats={[
            { value: "187%", label: "Traffic Lift" },
            { value: "Top 10", label: "Rankings" },
            { value: "3.2x", label: "Lead Growth" },
          ]}
          ctaText="Get SEO Audit"
          ctaHref="/contact?service=search-optimization"
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
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Comprehensive SEO Services</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                From technical foundations to content strategy, we cover every aspect of search optimization.
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
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
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

        {/* Approach */}
        <section className="py-20 bg-muted/30">
          <div className="container">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Our SEO Process</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                A proven methodology that delivers consistent results.
              </p>
            </div>

            <div className="grid md:grid-cols-4 gap-6">
              {approach.map((step, i) => (
                <div key={i} className="relative p-6 bg-card rounded-xl border hover:border-primary/50 transition-all group text-center">
                  <div className="text-5xl font-bold text-primary/10 mb-3 group-hover:text-primary/20 transition-colors">
                    0{i + 1}
                  </div>
                  <h3 className="text-lg font-bold mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* EEAT Focus */}
        <section className="py-20">
          <div className="container">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">E-E-A-T Focused SEO</h2>
                <p className="text-lg text-muted-foreground">
                  We optimize for Google's quality guidelines: Experience, Expertise, Authoritativeness, and Trustworthiness.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="p-6 bg-card rounded-xl border">
                  <h3 className="font-bold mb-3 flex items-center gap-2">
                    <Eye className="w-5 h-5 text-primary" />
                    Experience
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Demonstrate first-hand experience through case studies, examples, and practical insights that show real expertise.
                  </p>
                </div>
                <div className="p-6 bg-card rounded-xl border">
                  <h3 className="font-bold mb-3 flex items-center gap-2">
                    <Award className="w-5 h-5 text-primary" />
                    Expertise
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Showcase credentials, qualifications, and deep knowledge through comprehensive, well-researched content.
                  </p>
                </div>
                <div className="p-6 bg-card rounded-xl border">
                  <h3 className="font-bold mb-3 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-primary" />
                    Authoritativeness
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Build reputation through quality backlinks, citations, and recognition from respected sources in your industry.
                  </p>
                </div>
                <div className="p-6 bg-card rounded-xl border">
                  <h3 className="font-bold mb-3 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-primary" />
                    Trustworthiness
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Ensure accuracy, transparency, and security throughout your site to build trust with users and search engines.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQs */}
        <section className="py-20 bg-muted/30">
          <div className="container">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Common questions about SEO answered by our experts.
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
            <div className="max-w-4xl mx-auto bg-gradient-to-br from-yellow-500/10 to-orange-500/10 rounded-2xl p-8 md:p-12 border border-yellow-500/20 text-center">
              <Search className="w-16 h-16 text-primary mx-auto mb-6" />
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Rank Higher?</h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                Get a free SEO audit and discover opportunities to improve your search visibility.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Button size="lg" asChild className="group">
                  <Link href="/contact?service=search-optimization">
                    Get Free SEO Audit
                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/marketplace">View SEO Tools</Link>
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
