import { CardFooter } from "@/components/ui/card"
import type { Metadata } from "next"
import Link from "next/link"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Search, BarChart2, Users, Edit3, ArrowRight, Play } from "lucide-react"
import { Breadcrumbs, breadcrumbPaths } from "@/components/seo/breadcrumbs"
import { VideoSchema, FAQSchema } from "@/components/seo/json-ld"
import { TestimonialsSection } from "@/components/seo/testimonials"

export const metadata: Metadata = {
  title: "Strategic Web Marketing Services | RocketOpp - SEO, PPC, Social Media",
  description:
    "Drive growth with RocketOpp's data-driven web marketing: SEO, PPC, Social Media, and Content Marketing strategies tailored for your success. 25+ years of marketing expertise.",
  keywords: [
    "web marketing",
    "digital marketing",
    "SEO services",
    "PPC advertising",
    "social media marketing",
    "content marketing",
    "marketing agency"
  ],
  openGraph: {
    title: "Strategic Web Marketing Services | RocketOpp",
    description: "Data-driven marketing strategies that deliver measurable results.",
    url: "https://rocketopp.com/services/web-marketing",
    type: "website"
  },
  alternates: {
    canonical: "https://rocketopp.com/services/web-marketing"
  }
}

const marketingFAQs = [
  {
    question: "What marketing services does RocketOpp offer?",
    answer: "We offer comprehensive digital marketing services including SEO, PPC advertising, social media marketing, content marketing, email campaigns, and conversion optimization - all enhanced by AI for better targeting and results."
  },
  {
    question: "How long does it take to see marketing results?",
    answer: "PPC campaigns can drive traffic immediately. SEO typically shows significant results in 3-6 months. Social media engagement grows within weeks. We provide transparent reporting so you can track progress from day one."
  },
  {
    question: "Do you work with small businesses or only large companies?",
    answer: "We work with businesses of all sizes. Our AI-powered approach allows us to deliver enterprise-level marketing strategies at prices small businesses can afford."
  },
  {
    question: "How do you measure marketing ROI?",
    answer: "We track conversions, revenue attribution, customer acquisition cost, and lifetime value. Every campaign includes detailed analytics dashboards so you can see exactly how your marketing spend translates to business results."
  }
]

const marketingServices = [
  {
    title: "Search Engine Optimization (SEO)",
    description: "Improve visibility and rank higher on search engines to attract organic, high-intent traffic.",
    href: "/services/web-marketing/seo",
    icon: <Search className="h-8 w-8 text-primary" />,
  },
  {
    title: "Pay-Per-Click (PPC) Advertising",
    description: "Achieve immediate results with targeted ad campaigns that maximize your ROI.",
    href: "/services/web-marketing/ppc",
    icon: <BarChart2 className="h-8 w-8 text-primary" />,
  },
  {
    title: "Social Media Marketing",
    description: "Engage your audience, build brand loyalty, and drive conversions through strategic social campaigns.",
    href: "/services/web-marketing/social-media",
    icon: <Users className="h-8 w-8 text-primary" />,
  },
  {
    title: "Content Marketing",
    description: "Tell your brand’s story with impactful content that captivates and converts.",
    href: "/services/web-marketing/content-marketing",
    icon: <Edit3 className="h-8 w-8 text-primary" />,
  },
]

export default function WebMarketingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Schema */}
      <FAQSchema items={marketingFAQs} />
      <VideoSchema
        name="25 Years of Marketing Trends: What Actually Works"
        description="A comprehensive look at how marketing has evolved over 25 years and the strategies that drive results today."
        thumbnailUrl="https://img.youtube.com/vi/90N8kne60Os/maxresdefault.jpg"
        uploadDate="2024-01-01"
        duration="PT10M"
        embedUrl="https://www.youtube.com/embed/90N8kne60Os"
      />

      <main className="flex-grow">
        {/* Breadcrumbs */}
        <div className="container pt-8">
          <Breadcrumbs items={breadcrumbPaths.webMarketing} />
        </div>

        <section className="py-12 md:py-16 bg-primary/5 dark:bg-primary/10">
          <div className="container text-center">
            <LineChart className="h-16 w-16 text-primary mx-auto mb-6" />
            <h1 className="text-4xl md:text-5xl font-bold tracking-tighter mb-4">Strategic Web Marketing</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Amplify your online presence and achieve measurable results with RocketOpp&apos;s comprehensive web marketing
              services. We combine data-driven strategies with creative execution.
            </p>
          </div>
        </section>

        <section className="py-12 md:py-16">
          <div className="container">
            <h2 className="text-3xl font-bold text-center mb-12">Our Core Marketing Disciplines</h2>
            <div className="grid md:grid-cols-2 gap-8">
              {marketingServices.map((service) => (
                <Card key={service.title} className="flex flex-col hover:shadow-lg transition-shadow">
                  <CardHeader className="items-center text-center">
                    {service.icon}
                    <CardTitle className="text-xl mt-2">{service.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow text-center">
                    <CardDescription>{service.description}</CardDescription>
                  </CardContent>
                  <CardFooter className="justify-center">
                    <Button asChild variant="link" className="text-primary group">
                      <Link href={service.href}>
                        Explore {service.title.split("(")[0].trim()}
                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Video Insights Section */}
        <section className="py-12 md:py-16">
          <div className="container">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-4">25 Years of Marketing Evolution</h2>
                <p className="text-lg text-muted-foreground">
                  See how marketing has transformed and what strategies are driving results today.
                </p>
              </div>

              {/* Video Embed */}
              <div className="relative aspect-video rounded-2xl overflow-hidden bg-zinc-900 border border-border/50 shadow-xl">
                <iframe
                  src="https://www.youtube.com/embed/90N8kne60Os"
                  title="25 Years of Marketing Trends"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="absolute inset-0 w-full h-full"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <TestimonialsSection
          title="Marketing Results That Speak"
          subtitle="See how our clients have grown with our marketing strategies"
          filterByService="Digital Marketing"
          maxItems={3}
        />

        <section className="py-12 md:py-16 bg-muted/50 dark:bg-muted/20">
          <div className="container text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to Ignite Your Growth?</h2>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-8">
              Let our expert marketers craft a tailored strategy to help you achieve your business objectives.
            </p>
            <Button asChild size="lg">
              <Link href="/contact?service=web-marketing">Get a Marketing Consultation</Link>
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
