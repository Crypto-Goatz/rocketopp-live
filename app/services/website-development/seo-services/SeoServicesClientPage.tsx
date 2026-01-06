"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import {
  Search,
  TrendingUp,
  Target,
  FileSearch,
  Link2,
  BarChart3,
  Gauge,
  MapPin,
  FileText,
  CheckCircle2,
  ArrowRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const seoServices = [
  {
    icon: <FileSearch className="h-8 w-8" />,
    title: "Technical SEO Audit",
    description:
      "Comprehensive analysis of your website's technical infrastructure, identifying crawl errors, indexation issues, site speed problems, and mobile usability concerns.",
    benefits: [
      "Site speed optimization",
      "Mobile-first indexing",
      "Schema markup implementation",
      "XML sitemap optimization",
    ],
  },
  {
    icon: <Target className="h-8 w-8" />,
    title: "Keyword Research & Strategy",
    description:
      "Data-driven keyword research to identify high-value search terms your customers are using, with competitive analysis and search intent mapping.",
    benefits: [
      "Competitor keyword analysis",
      "Long-tail keyword discovery",
      "Search intent mapping",
      "Keyword difficulty assessment",
    ],
  },
  {
    icon: <FileText className="h-8 w-8" />,
    title: "On-Page Optimization",
    description:
      "Strategic optimization of your website's content, meta tags, headers, and internal linking structure to maximize relevance and search visibility.",
    benefits: [
      "Title tag optimization",
      "Meta description crafting",
      "Header tag structure",
      "Internal linking strategy",
    ],
  },
  {
    icon: <Link2 className="h-8 w-8" />,
    title: "Link Building & Authority",
    description:
      "Ethical, white-hat link building strategies to increase your domain authority and establish your website as a trusted resource in your industry.",
    benefits: [
      "Quality backlink acquisition",
      "Broken link recovery",
      "Digital PR outreach",
      "Content partnership development",
    ],
  },
  {
    icon: <MapPin className="h-8 w-8" />,
    title: "Local SEO",
    description:
      "Dominate local search results with optimized Google Business Profile, local citations, and location-based content strategies.",
    benefits: [
      "Google Business Profile optimization",
      "Local citation building",
      "Review management",
      "Local content creation",
    ],
  },
  {
    icon: <BarChart3 className="h-8 w-8" />,
    title: "Analytics & Reporting",
    description:
      "Transparent reporting with actionable insights, tracking rankings, organic traffic, conversions, and ROI to measure campaign success.",
    benefits: ["Monthly performance reports", "Ranking tracking", "Traffic analysis", "Conversion optimization"],
  },
]

const whySeoCritical = [
  {
    stat: "93%",
    label: "Of online experiences begin with a search engine",
    description: "Search engines are the primary way people discover businesses and solutions online.",
  },
  {
    stat: "75%",
    label: "Of users never scroll past the first page of search results",
    description: "If you're not on page one, you're essentially invisible to most potential customers.",
  },
  {
    stat: "14.6%",
    label: "Average close rate from SEO leads",
    description: "SEO leads convert at a much higher rate than outbound marketing tactics.",
  },
  {
    stat: "5.7x",
    label: "Better ROI compared to PPC over time",
    description: "Organic SEO provides sustainable, long-term traffic without ongoing ad spend.",
  },
]

const seoProcess = [
  {
    step: "01",
    title: "Discovery & Audit",
    description:
      "We analyze your current SEO performance, identify quick wins, and uncover opportunities for growth through comprehensive technical and competitive audits.",
  },
  {
    step: "02",
    title: "Strategy Development",
    description:
      "Based on audit findings, we develop a customized SEO roadmap aligned with your business goals, targeting the right keywords and audiences.",
  },
  {
    step: "03",
    title: "Implementation",
    description:
      "Our team executes on-page optimizations, technical fixes, content creation, and link building strategies with precision and attention to detail.",
  },
  {
    step: "04",
    title: "Monitor & Optimize",
    description:
      "Continuous monitoring of rankings, traffic, and conversions allows us to refine strategies and maximize your return on investment.",
  },
]

const commonSeoProblems = [
  {
    problem: "Invisible to Search Engines",
    solution:
      "Technical SEO fixes ensure search engines can properly crawl, index, and understand your website content.",
    icon: <Search className="h-6 w-6" />,
  },
  {
    problem: "Low Quality Traffic",
    solution:
      "Strategic keyword targeting attracts visitors who are actually searching for what you offer, increasing conversion rates.",
    icon: <Target className="h-6 w-6" />,
  },
  {
    problem: "High Bounce Rates",
    solution: "On-page optimization improves user experience and content relevance, keeping visitors engaged longer.",
    icon: <Gauge className="h-6 w-6" />,
  },
  {
    problem: "Competitors Outranking You",
    solution: "Competitive analysis and strategic link building help you reclaim market share in search results.",
    icon: <TrendingUp className="h-6 w-6" />,
  },
]

export default function SeoServicesClientPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section
        className="pt-32 pb-20 px-4 relative overflow-hidden"
        style={{
          backgroundImage: "url(/photorealistic-astronaut-analyzing-seo-data.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-background/85" />
        <div className="container mx-auto max-w-6xl relative z-10">
          <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="text-center space-y-6">
            <motion.div variants={fadeInUp} className="inline-block">
              <span className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
                <Search className="h-4 w-4 mr-2" />
                Professional SEO Services
              </span>
            </motion.div>

            <motion.h1 variants={fadeInUp} className="text-4xl md:text-6xl font-bold text-balance">
              Dominate Search Results.
              <br />
              <span className="text-primary">Grow Your Business.</span>
            </motion.h1>

            <motion.p variants={fadeInUp} className="text-xl text-muted-foreground max-w-3xl mx-auto text-balance">
              Strategic SEO that drives sustainable organic growth. We don't just improve rankings—we increase qualified
              traffic, conversions, and revenue through proven optimization strategies.
            </motion.p>

            <motion.div variants={fadeInUp} className="flex flex-wrap gap-4 justify-center pt-4">
              <Button asChild size="lg" className="text-lg">
                <Link href="/ai-assessment-start">
                  Get Free SEO Audit
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="text-lg bg-transparent">
                <Link href="/contact">Schedule Consultation</Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Why SEO is Critical */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.h2 variants={fadeInUp} className="text-3xl md:text-5xl font-bold mb-4">
              Why SEO is <span className="text-primary">Non-Negotiable</span> in 2024
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Search engines are the backbone of online discovery. Without SEO, you're invisible.
            </motion.p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {whySeoCritical.map((item, index) => (
              <motion.div
                key={index}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeInUp}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-6 h-full bg-background/50 backdrop-blur border-primary/20 hover:border-primary/40 transition-colors">
                  <div className="text-5xl font-bold text-primary mb-2">{item.stat}</div>
                  <div className="font-semibold text-lg mb-2">{item.label}</div>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Common SEO Problems */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.h2 variants={fadeInUp} className="text-3xl md:text-5xl font-bold mb-4">
              Problems We <span className="text-primary">Solve</span>
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Every business faces unique SEO challenges. Here's how we address them.
            </motion.p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {commonSeoProblems.map((item, index) => (
              <motion.div
                key={index}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeInUp}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-6 h-full bg-background/50 backdrop-blur border-muted hover:border-primary/40 transition-colors">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 p-3 rounded-lg bg-destructive/10 text-destructive">{item.icon}</div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-2 text-destructive">{item.problem}</h3>
                      <p className="text-muted-foreground mb-3">{item.solution}</p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Our SEO Services */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.h2 variants={fadeInUp} className="text-3xl md:text-5xl font-bold mb-4">
              Comprehensive <span className="text-primary">SEO Services</span>
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-xl text-muted-foreground max-w-2xl mx-auto">
              From technical foundations to content strategy, we cover every aspect of search optimization.
            </motion.p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {seoServices.map((service, index) => (
              <motion.div
                key={index}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeInUp}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-6 h-full bg-background/50 backdrop-blur border-primary/20 hover:border-primary/40 transition-all hover:shadow-lg hover:shadow-primary/20">
                  <div className="text-primary mb-4">{service.icon}</div>
                  <h3 className="text-xl font-bold mb-3">{service.title}</h3>
                  <p className="text-muted-foreground mb-4">{service.description}</p>
                  <ul className="space-y-2">
                    {service.benefits.map((benefit, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm">
                        <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Process */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.h2 variants={fadeInUp} className="text-3xl md:text-5xl font-bold mb-4">
              Our <span className="text-primary">SEO Process</span>
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-xl text-muted-foreground max-w-2xl mx-auto">
              A proven methodology that delivers measurable results
            </motion.p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {seoProcess.map((step, index) => (
              <motion.div
                key={index}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeInUp}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-6 h-full bg-background/50 backdrop-blur border-primary/20 relative overflow-hidden">
                  <div className="absolute top-0 right-0 text-8xl font-bold text-primary/5 leading-none">
                    {step.step}
                  </div>
                  <div className="relative">
                    <div className="text-2xl font-bold text-primary mb-3">{step.step}</div>
                    <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                    <p className="text-muted-foreground">{step.description}</p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent">
        <div className="container mx-auto max-w-4xl text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="space-y-6"
          >
            <motion.h2 variants={fadeInUp} className="text-3xl md:text-5xl font-bold">
              Ready to Increase Your <span className="text-primary">Organic Traffic?</span>
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Get a free SEO audit and discover exactly what's holding your website back from ranking on page one.
            </motion.p>
            <motion.div variants={fadeInUp} className="flex flex-wrap gap-4 justify-center pt-4">
              <Button asChild size="lg" className="text-lg">
                <Link href="/ai-assessment-start">
                  Get Your Free SEO Audit
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="text-lg bg-transparent">
                <Link href="/services">View All Services</Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
