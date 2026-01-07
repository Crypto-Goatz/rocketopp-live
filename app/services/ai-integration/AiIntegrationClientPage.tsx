"use client"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Brain, Zap, Shield, TrendingUp, Clock, Users, ChevronDown, ArrowRight, Star } from "lucide-react"
import { usePersonalizationStore } from "@/lib/personalization-store"
import { getPersonalizedContent, defaultContent } from "@/lib/content-variants"
import ShimmerHighlight from "@/components/shimmer-highlight"
import { useEffect, useState } from "react"
import Image from "next/image"

const partnerLogos = [
  { name: "OpenAI", logo: "/logos/openai.svg" },
  { name: "Slack", logo: "/logos/slack.svg" },
  { name: "Microsoft", logo: "/logos/microsoft.svg" },
  { name: "Google Cloud", logo: "/logos/google-cloud.svg" },
  { name: "AWS", logo: "/logos/aws.svg" },
  { name: "Salesforce", logo: "/logos/salesforce.svg" },
  { name: "HubSpot", logo: "/logos/hubspot.svg" },
  { name: "Zapier", logo: "/logos/zapier.svg" },
]

const faqs = [
  {
    q: "What is AI integration for business?",
    a: "AI integration for business involves implementing artificial intelligence technologies into your existing workflows, systems, and processes. This includes chatbots, predictive analytics, automated decision-making, natural language processing, and machine learning models that enhance productivity, reduce costs, and improve customer experiences.",
  },
  {
    q: "How long does AI integration typically take?",
    a: "Most AI integration projects take 4-12 weeks depending on complexity. Simple chatbot implementations can be completed in 2-4 weeks, while enterprise-wide AI automation systems may take 3-6 months. We provide detailed timelines during our free AI readiness assessment.",
  },
  {
    q: "What's the ROI of AI for business?",
    a: "Our clients typically see 300-500% ROI within the first year. This comes from reduced operational costs (40-60% reduction in manual tasks), increased sales (25-40% improvement in lead conversion), and improved customer satisfaction (50%+ reduction in response times).",
  },
  {
    q: "Do you work with existing systems like Salesforce or HubSpot?",
    a: "Yes, we specialize in integrating AI with existing business systems including Salesforce, HubSpot, Microsoft 365, Slack, and custom enterprise software. Our API-first approach ensures seamless connectivity with your current tech stack.",
  },
  {
    q: "Is my business data secure with AI integration?",
    a: "Absolutely. We implement enterprise-grade security protocols including end-to-end encryption, SOC 2 compliance, GDPR compliance, and on-premise deployment options. Your data never leaves your control unless explicitly authorized.",
  },
]

export default function AiIntegrationClientPage() {
  const { industry, userName, companyName, getIndustryDisplayName } = usePersonalizationStore()
  const [pageContent, setPageContent] = useState(defaultContent)
  const [contentKey, setContentKey] = useState("aiIntegrationInitial")
  const [shimmerActive, setShimmerActive] = useState(false)
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  useEffect(() => {
    const newContent = getPersonalizedContent(industry, companyName, userName)
    setPageContent(newContent)
    const newKey = `aiIntegration-${industry}-${companyName}-${userName}`
    if (newKey !== contentKey) {
      setContentKey(newKey)
      setShimmerActive(true)
      const timer = setTimeout(() => setShimmerActive(false), 1500)
      return () => clearTimeout(timer)
    }
  }, [industry, userName, companyName, contentKey])

  const industryDisplayName = getIndustryDisplayName(industry)

  const aiBenefits = [
    {
      id: "personalized",
      title: "AI-Powered Personalization",
      description: `Deliver hyper-personalized experiences that increase conversions by 40%. Our AI analyzes user behavior in real-time to tailor content, recommendations, and interactions specifically for ${industryDisplayName !== "Your Industry" ? industryDisplayName : "your"} customers.`,
      icon: <Zap className="h-8 w-8 text-primary" />,
      stat: "40%",
      statLabel: "Conversion Increase",
    },
    {
      id: "automation",
      title: "Intelligent Workflow Automation",
      description: `Eliminate 60% of repetitive tasks with AI automation. From document processing to customer inquiries, our AI solutions handle the mundane so your ${companyName || industryDisplayName} team focuses on high-value work.`,
      icon: <Brain className="h-8 w-8 text-primary" />,
      stat: "60%",
      statLabel: "Task Reduction",
    },
    {
      id: "insights",
      title: "Predictive Analytics & Insights",
      description: `Make decisions backed by AI-driven predictions. Our machine learning models analyze your ${companyName || industryDisplayName} data to forecast trends, identify opportunities, and prevent problems before they occur.`,
      icon: <TrendingUp className="h-8 w-8 text-primary" />,
      stat: "85%",
      statLabel: "Prediction Accuracy",
    },
    {
      id: "support",
      title: "24/7 AI Customer Support",
      description: `Deploy intelligent chatbots that handle 80% of customer inquiries instantly. Our AI support solutions integrate with Slack, Microsoft Teams, and your existing help desk to provide round-the-clock assistance.`,
      icon: <Users className="h-8 w-8 text-primary" />,
      stat: "80%",
      statLabel: "Inquiries Resolved",
    },
    {
      id: "security",
      title: "AI-Enhanced Security",
      description: `Protect your business with AI-powered threat detection. Our systems identify and neutralize security risks in real-time, ensuring your ${companyName || industryDisplayName} data remains safe and compliant.`,
      icon: <Shield className="h-8 w-8 text-primary" />,
      stat: "99.9%",
      statLabel: "Threat Detection",
    },
    {
      id: "speed",
      title: "Accelerated Time-to-Market",
      description: `Launch AI features 3x faster with our proven implementation frameworks. We've refined our process over 500+ successful deployments to minimize risk and maximize speed.`,
      icon: <Clock className="h-8 w-8 text-primary" />,
      stat: "3x",
      statLabel: "Faster Deployment",
    },
  ]

  const processSteps = [
    {
      step: "1",
      title: "AI Readiness Assessment",
      description: `We analyze your ${companyName || industryDisplayName} operations to identify high-impact AI opportunities and create a prioritized roadmap.`,
      duration: "1-2 weeks",
    },
    {
      step: "2",
      title: "Solution Architecture",
      description: `Our AI architects design custom solutions that integrate seamlessly with your existing systems including Salesforce, HubSpot, and Slack.`,
      duration: "2-3 weeks",
    },
    {
      step: "3",
      title: "Development & Training",
      description: `We build and train AI models on your specific data, ensuring accuracy and relevance for your ${industryDisplayName} use cases.`,
      duration: "4-8 weeks",
    },
    {
      step: "4",
      title: "Deployment & Optimization",
      description: `Launch your AI solutions with continuous monitoring and optimization to ensure peak performance and ROI.`,
      duration: "Ongoing",
    },
  ]

  const caseStudyStats = [
    { value: "500+", label: "AI Implementations" },
    { value: "$2.3B", label: "Revenue Generated" },
    { value: "98%", label: "Client Satisfaction" },
    { value: "25+", label: "Years Experience" },
  ]

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-grow">
        {/* Hero Section */}
        <section
          className="py-16 md:py-24 relative overflow-hidden"
          style={{
            backgroundImage: "url(/photorealistic-astronaut-with-ai-neural-network.jpg)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-background/85" />
          <div className="container relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full mb-6">
                <Star className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">Trusted by Fortune 500 Companies</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold tracking-tighter mb-6">
                <ShimmerHighlight active={shimmerActive} delay={0.1}>
                  AI for Business That Actually Delivers Results
                </ShimmerHighlight>
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed">
                <ShimmerHighlight active={shimmerActive} delay={0.2}>
                  Transform your {companyName || industryDisplayName} operations with enterprise AI integration. 500+
                  successful implementations. 300-500% average ROI. OpenAI, Slack, Microsoft certified partners.
                </ShimmerHighlight>
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="text-lg px-8 py-6">
                  <Link href="/ai-assessment">
                    Get Free AI Assessment
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="text-lg px-8 py-6 bg-transparent">
                  <Link href="#case-studies">View Case Studies</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Partner Logos */}
        <section className="py-12 border-b border-border/50">
          <div className="container">
            <p className="text-center text-sm text-muted-foreground mb-8 uppercase tracking-wider">
              Certified Integration Partners
            </p>
            <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
              {partnerLogos.map((partner) => (
                <div
                  key={partner.name}
                  className="flex items-center justify-center h-12 w-32 grayscale hover:grayscale-0 opacity-60 hover:opacity-100 transition-all duration-300"
                >
                  <Image
                    src={partner.logo || "/placeholder.svg"}
                    alt={`${partner.name} AI Integration Partner`}
                    width={120}
                    height={40}
                    className="object-contain h-full w-auto"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-primary/5">
          <div className="container">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {caseStudyStats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-4xl md:text-5xl font-bold text-primary mb-2">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits Grid */}
        <section className="py-16 md:py-24">
          <div className="container">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                How AI Integration Transforms Your{" "}
                {companyName || (industryDisplayName !== "Your Industry" ? industryDisplayName : "Business")}
              </h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                Our AI for business solutions deliver measurable results across every department. From sales and
                marketing to operations and customer service.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {aiBenefits.map((benefit, index) => (
                <div
                  key={benefit.id}
                  className="group p-8 card-lifted-xl"
                >
                  <div className="flex items-center justify-between mb-6">
                    <div className="p-3 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                      {benefit.icon}
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-primary">{benefit.stat}</div>
                      <div className="text-xs text-muted-foreground">{benefit.statLabel}</div>
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold mb-3">
                    <ShimmerHighlight active={shimmerActive} delay={0.3 + index * 0.05}>
                      {benefit.title}
                    </ShimmerHighlight>
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    <ShimmerHighlight active={shimmerActive} delay={0.35 + index * 0.05}>
                      {benefit.description}
                    </ShimmerHighlight>
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Process Section */}
        <section className="py-16 md:py-24 bg-muted/30">
          <div className="container">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Proven AI Integration Process</h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                25+ years of experience distilled into a battle-tested methodology. We've refined this process across
                500+ implementations to minimize risk and maximize ROI.
              </p>
            </div>
            <div className="grid md:grid-cols-4 gap-6">
              {processSteps.map((item, index) => (
                <div key={item.step} className="relative">
                  {index < processSteps.length - 1 && (
                    <div className="hidden md:block absolute top-8 left-1/2 w-full h-0.5 bg-border" />
                  )}
                  <div className="relative p-6 card-lifted-sm z-10">
                    <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-2xl font-bold mb-4 mx-auto">
                      {item.step}
                    </div>
                    <h3 className="text-lg font-semibold mb-2 text-center">
                      <ShimmerHighlight active={shimmerActive} delay={0.4 + index * 0.05}>
                        {item.title}
                      </ShimmerHighlight>
                    </h3>
                    <p className="text-sm text-muted-foreground text-center mb-3">
                      <ShimmerHighlight active={shimmerActive} delay={0.45 + index * 0.05}>
                        {item.description}
                      </ShimmerHighlight>
                    </p>
                    <div className="text-xs text-primary font-medium text-center">{item.duration}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Large CTA Section */}
        <section className="py-20 md:py-32 bg-primary text-primary-foreground relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 50%, white 1px, transparent 1px)",
                backgroundSize: "60px 60px",
              }}
            />
          </div>
          <div className="container relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl md:text-5xl font-bold mb-6">Ready to Transform Your Business with AI?</h2>
              <p className="text-xl md:text-2xl opacity-90 mb-8">
                Get a free AI readiness assessment and discover how AI integration can deliver 300-500% ROI for{" "}
                {companyName || `your ${industryDisplayName}`}.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" variant="secondary" className="text-lg px-10 py-6">
                  <Link href="/ai-assessment">
                    Start Free Assessment
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="text-lg px-10 py-6 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 bg-transparent"
                >
                  <Link href="/#contact">Schedule Consultation</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 md:py-24">
          <div className="container">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
                AI for Business: Frequently Asked Questions
              </h2>
              <p className="text-lg text-muted-foreground text-center mb-12">
                Expert answers to common questions about AI integration for business.
              </p>
              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <div key={index} className="border border-border rounded-lg overflow-hidden">
                    <button
                      onClick={() => setOpenFaq(openFaq === index ? null : index)}
                      className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-muted/50 transition-colors"
                    >
                      <span className="font-medium pr-4">{faq.q}</span>
                      <ChevronDown
                        className={`h-5 w-5 text-muted-foreground transition-transform duration-200 flex-shrink-0 ${openFaq === index ? "rotate-180" : ""}`}
                      />
                    </button>
                    <div
                      className={`overflow-hidden transition-all duration-300 ${openFaq === index ? "max-h-96" : "max-h-0"}`}
                    >
                      <p className="px-6 pb-4 text-muted-foreground leading-relaxed">{faq.a}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Trust Section */}
        <section className="py-16 bg-muted/30">
          <div className="container">
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div className="p-6">
                <Shield className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Enterprise-Grade Security</h3>
                <p className="text-sm text-muted-foreground">
                  SOC 2 Type II certified. GDPR & HIPAA compliant. Your data is always protected.
                </p>
              </div>
              <div className="p-6">
                <Users className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Dedicated AI Team</h3>
                <p className="text-sm text-muted-foreground">
                  Work with certified AI engineers, data scientists, and integration specialists.
                </p>
              </div>
              <div className="p-6">
                <TrendingUp className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Guaranteed ROI</h3>
                <p className="text-sm text-muted-foreground">
                  We stand behind our work with performance guarantees and ongoing optimization.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-16 md:py-24">
          <div className="container text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Start Your AI Transformation Today</h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join 500+ businesses that have transformed their operations with our AI integration services.
            </p>
            <Button asChild size="lg" className="text-lg px-10 py-6">
              <Link href="/ai-assessment">
                Get Free AI Assessment
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
