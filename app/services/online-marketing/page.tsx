import type { Metadata } from "next"
import { Megaphone, Share2, PenTool, BarChart3, Target, TrendingUp, Users, Mail, Video, CheckCircle, ArrowRight, Award, Zap, LineChart } from "lucide-react"
import { ServiceHero } from "@/components/service-hero"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Footer from "@/components/footer"

export const metadata: Metadata = {
  title: "Online Marketing Services | Digital Marketing & Growth | RocketOpp",
  description: "Grow your business with data-driven online marketing. Social media management, content strategy, PPC advertising, and email marketing that delivers measurable ROI.",
  keywords: "online marketing, digital marketing, social media marketing, content marketing, PPC advertising, email marketing, lead generation, growth marketing, RocketOpp",
  authors: [{ name: "RocketOpp", url: "https://rocketopp.com" }],
  openGraph: {
    title: "Online Marketing Services | Digital Growth | RocketOpp",
    description: "Data-driven online marketing that delivers measurable ROI. Social media, content, PPC, and more.",
    url: "https://rocketopp.com/services/online-marketing",
    siteName: "RocketOpp",
    images: [
      {
        url: "https://rocketopp.com/og-online-marketing.jpg",
        width: 1200,
        height: 630,
        alt: "RocketOpp Online Marketing Services",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Online Marketing Services | RocketOpp",
    description: "Data-driven marketing that delivers measurable ROI.",
    images: ["https://rocketopp.com/twitter-online-marketing.jpg"],
  },
  alternates: {
    canonical: "https://rocketopp.com/services/online-marketing",
  },
}

const services = [
  {
    id: "social",
    icon: Share2,
    title: "Social Media Marketing",
    description: "Build your brand and engage your audience across all major social platforms with strategic content and community management.",
    features: ["Content Calendar Management", "Community Engagement", "Influencer Partnerships"]
  },
  {
    id: "content",
    icon: PenTool,
    title: "Content Strategy",
    description: "Compelling content that attracts, engages, and converts your target audience across all channels.",
    features: ["Blog & Article Writing", "Video Content Strategy", "Content Distribution"]
  },
  {
    id: "ppc",
    icon: BarChart3,
    title: "PPC Advertising",
    description: "Targeted advertising campaigns on Google, Facebook, and LinkedIn that maximize your return on ad spend.",
    features: ["Google Ads Management", "Social Media Ads", "Retargeting Campaigns"]
  },
  {
    icon: Mail,
    title: "Email Marketing",
    description: "Automated email campaigns that nurture leads, drive conversions, and keep customers engaged.",
    features: ["Automation Sequences", "Newsletter Management", "A/B Testing"]
  },
]

const channels = [
  { name: "Google Ads", description: "Search, Display & YouTube" },
  { name: "Meta (Facebook/Instagram)", description: "Social advertising at scale" },
  { name: "LinkedIn", description: "B2B lead generation" },
  { name: "TikTok", description: "Reach younger audiences" },
  { name: "Email", description: "Direct customer engagement" },
  { name: "Content", description: "SEO-driven organic traffic" },
]

const stats = [
  { value: "340%", label: "Avg ROI" },
  { value: "2.5M+", label: "Leads Generated" },
  { value: "$50M+", label: "Ad Spend Managed" },
  { value: "45%", label: "Lower CPA" },
]

const faqs = [
  {
    question: "How much should I budget for online marketing?",
    answer: "Most businesses should invest 5-15% of revenue in marketing. For startups or aggressive growth, it may be higher. We recommend starting with at least $3,000/month in ad spend plus management fees to see meaningful results."
  },
  {
    question: "How long before I see results from digital marketing?",
    answer: "PPC campaigns can generate leads within days. Content marketing and SEO typically take 3-6 months to show significant results. We focus on quick wins while building long-term sustainable growth."
  },
  {
    question: "Which marketing channels work best for my business?",
    answer: "It depends on your industry and audience. B2B companies often see best results from LinkedIn and Google Ads. E-commerce typically thrives on Facebook/Instagram and Google Shopping. We analyze your business to recommend the optimal channel mix."
  },
  {
    question: "Do you offer performance-based pricing?",
    answer: "We offer hybrid models with base fees plus performance bonuses tied to KPIs like leads, sales, or ROAS. This aligns our incentives with your growth goals while ensuring we have resources to execute effectively."
  },
  {
    question: "How do you measure marketing success?",
    answer: "We track KPIs that matter to your business: leads, conversions, revenue, ROAS, and customer acquisition cost. You'll receive detailed monthly reports showing exactly how your marketing investment is performing."
  },
]

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "Online Marketing Services",
  "provider": {
    "@type": "Organization",
    "name": "RocketOpp",
    "url": "https://rocketopp.com"
  },
  "description": "Comprehensive online marketing services including social media, content marketing, PPC advertising, and email marketing.",
  "areaServed": "Worldwide",
  "serviceType": "Digital Marketing",
  "offers": {
    "@type": "Offer",
    "price": "3000",
    "priceCurrency": "USD",
    "priceSpecification": {
      "@type": "PriceSpecification",
      "price": "3000",
      "priceCurrency": "USD",
      "minPrice": "3000"
    }
  }
}

export default function OnlineMarketingPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main className="flex min-h-screen flex-col bg-background">
        <ServiceHero
          icon={<Megaphone className="w-6 h-6" />}
          title="Marketing That Actually Works"
          subtitle="Growth That Compounds"
          description="Data-driven online marketing that generates leads, builds brand awareness, and drives sustainable growth. No vanity metrics—just results that impact your bottom line."
          gradient="from-green-500 to-emerald-500"
          visualVariant="wave"
          floatingCards={[
            { value: "340%", label: "ROI", color: "text-green-500", position: "top-right" },
            { value: "2.5M+", label: "Leads", color: "text-emerald-500", position: "bottom-left" },
            { value: "-45%", label: "CPA", color: "text-cyan-500", position: "mid-right" },
          ]}
          stats={[
            { value: "340%", label: "Avg ROI" },
            { value: "2.5M+", label: "Leads" },
            { value: "$50M+", label: "Managed" },
          ]}
          ctaText="Grow Your Business"
          ctaHref="/contact?service=online-marketing"
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
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Full-Funnel Marketing Solutions</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                From awareness to conversion, we cover every stage of the customer journey with targeted strategies.
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
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
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

        {/* Channels */}
        <section className="py-20 bg-muted/30">
          <div className="container">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Multi-Channel Expertise</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                We optimize your presence across all the channels that matter for your business.
              </p>
            </div>

            <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-4">
              {channels.map((channel, i) => (
                <div key={i} className="p-4 bg-card rounded-xl border hover:border-primary/50 transition-all text-center">
                  <h3 className="font-bold mb-1">{channel.name}</h3>
                  <p className="text-xs text-muted-foreground">{channel.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Results Focus */}
        <section className="py-20">
          <div className="container">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Results-Driven Approach</h2>
                <p className="text-lg text-muted-foreground">
                  We focus on metrics that matter to your business, not vanity numbers.
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <div className="p-6 bg-card rounded-xl border text-center">
                  <Target className="w-10 h-10 text-primary mx-auto mb-4" />
                  <h3 className="font-bold mb-2">Lead Generation</h3>
                  <p className="text-sm text-muted-foreground">Qualified leads that convert to customers</p>
                </div>
                <div className="p-6 bg-card rounded-xl border text-center">
                  <TrendingUp className="w-10 h-10 text-primary mx-auto mb-4" />
                  <h3 className="font-bold mb-2">Revenue Growth</h3>
                  <p className="text-sm text-muted-foreground">Direct impact on your bottom line</p>
                </div>
                <div className="p-6 bg-card rounded-xl border text-center">
                  <LineChart className="w-10 h-10 text-primary mx-auto mb-4" />
                  <h3 className="font-bold mb-2">ROAS Optimization</h3>
                  <p className="text-sm text-muted-foreground">Maximum return on every ad dollar</p>
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
                Get answers to common questions about online marketing.
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
            <div className="max-w-4xl mx-auto bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-2xl p-8 md:p-12 border border-green-500/20 text-center">
              <TrendingUp className="w-16 h-16 text-primary mx-auto mb-6" />
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Grow?</h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                Let's build a marketing strategy that drives real business results.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Button size="lg" asChild className="group">
                  <Link href="/contact?service=online-marketing">
                    Get Marketing Strategy
                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/marketplace">View AI Marketing Tools</Link>
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
