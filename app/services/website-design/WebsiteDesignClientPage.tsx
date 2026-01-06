"use client"

// import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import {
  Palette,
  CheckCircle,
  AlertTriangle,
  Code2,
  Smartphone,
  Zap,
  Shield,
  TrendingUp,
  Users,
  Award,
  ArrowRight,
  Star,
} from "lucide-react"
import { usePersonalizationStore } from "@/lib/personalization-store"
import { getPersonalizedContent, defaultContent } from "@/lib/content-variants"
import ShimmerHighlight from "@/components/shimmer-highlight"
import { useEffect, useState } from "react"

const vitalQuestions = [
  {
    question: "What is a meta description?",
    answer:
      "A brief summary of a webpage’s content that appears in search engine results. Crucial for attracting clicks and SEO.",
  },
  {
    question: "Importance of mobile-first design?",
    answer:
      "Prioritizes mobile user experience, ensuring responsiveness as a significant portion of web traffic is mobile.",
  },
  {
    question: "How to optimize images for faster loading?",
    answer:
      "Compressing images, using appropriate formats (like WebP), and implementing lazy loading to enhance site speed.",
  },
  {
    question: "Best practices for website accessibility (a11y)?",
    answer:
      "Making sites usable for people with disabilities (alt text, color contrast, keyboard navigation, ARIA roles).",
  },
  {
    question: "How to implement secure HTTPS protocols?",
    answer: "Using SSL/TLS certificates to encrypt data, protect users, and improve search engine trust.",
  },
]

const expertiseAreas = [
  {
    icon: Code2,
    title: "Custom Web Development",
    description:
      "Hand-coded solutions using Next.js, React, and modern frameworks for optimal performance and scalability.",
    stats: "500+ projects delivered",
  },
  {
    icon: Smartphone,
    title: "Responsive Design",
    description: "Mobile-first approach ensuring flawless experiences across all devices and screen sizes.",
    stats: "100% mobile optimized",
  },
  {
    icon: Zap,
    title: "Performance Optimization",
    description: "Lightning-fast load times with advanced caching, lazy loading, and Core Web Vitals optimization.",
    stats: "Sub-2s page loads",
  },
  {
    icon: Shield,
    title: "Security & Compliance",
    description: "Enterprise-grade security with SSL, data encryption, and GDPR/CCPA compliance built-in.",
    stats: "Zero security breaches",
  },
]

const processSteps = [
  {
    number: "01",
    title: "Discovery & Strategy",
    description:
      "Deep dive into your business goals, target audience, and competitive landscape to create a winning strategy.",
    duration: "1-2 weeks",
  },
  {
    number: "02",
    title: "Design & Prototyping",
    description:
      "Create stunning visual designs and interactive prototypes for your approval before development begins.",
    duration: "2-3 weeks",
  },
  {
    number: "03",
    title: "Development & Testing",
    description: "Build your website with clean code, rigorous testing, and continuous quality assurance throughout.",
    duration: "4-6 weeks",
  },
  {
    number: "04",
    title: "Launch & Optimization",
    description: "Deploy your site with proper SEO setup, analytics integration, and ongoing performance monitoring.",
    duration: "1-2 weeks",
  },
]

const results = [
  { metric: "Average Traffic Increase", value: "245%", icon: TrendingUp },
  { metric: "Conversion Rate Improvement", value: "187%", icon: Users },
  { metric: "Page Load Speed", value: "1.8s", icon: Zap },
  { metric: "Client Satisfaction", value: "98%", icon: Star },
]

const faqs = [
  {
    question: "How long does it take to design and develop a professional website?",
    answer:
      "A typical custom website takes 8-12 weeks from start to launch, depending on complexity and features. We provide detailed timelines during our discovery phase and keep you updated throughout the process.",
  },
  {
    question: "What makes RocketOpp's website design different from competitors?",
    answer:
      "We combine 25 years of experience with cutting-edge technology like Next.js 16 and React 19. Our websites aren't just beautiful—they're built for speed, security, and conversion optimization with AI-powered personalization.",
  },
  {
    question: "Do you provide ongoing maintenance and support after launch?",
    answer:
      "Yes. We offer comprehensive maintenance plans including security updates, content updates, performance monitoring, and technical support. Your website is a long-term investment, and we're here to protect it.",
  },
  {
    question: "How do you ensure my website will rank well on Google?",
    answer:
      "Every website we build follows Google's E-E-A-T guidelines with technical SEO optimization, fast loading speeds, mobile responsiveness, structured data markup, and content strategy aligned with search intent.",
  },
  {
    question: "Can you redesign my existing website without losing SEO rankings?",
    answer:
      "Absolutely. We use strategic 301 redirects, preserve SEO equity, maintain URL structure where beneficial, and implement comprehensive migration plans to ensure you maintain or improve your rankings.",
  },
  {
    question: "What is your pricing structure for website design?",
    answer:
      "Our custom websites start at $5,000 for small business sites and scale based on features, integrations, and complexity. We provide transparent quotes with no hidden fees after our initial consultation.",
  },
]

const technologies = [
  "Next.js 16",
  "React 19",
  "TypeScript",
  "Tailwind CSS",
  "Vercel",
  "Node.js",
  "PostgreSQL",
  "Redis",
  "AI Integration",
]

export default function WebsiteDesignClientPage() {
  const { industry, userName, companyName, getIndustryDisplayName } = usePersonalizationStore()
  const [pageContent, setPageContent] = useState(defaultContent)
  const [contentKey, setContentKey] = useState("websiteDesignInitial")
  const [shimmerActive, setShimmerActive] = useState(false)

  useEffect(() => {
    const newContent = getPersonalizedContent(industry, companyName, userName)
    setPageContent(newContent)
    const newKey = `websiteDesign-${industry}-${companyName}-${userName}`
    if (newKey !== contentKey) {
      setContentKey(newKey)
      setShimmerActive(true)
      const timer = setTimeout(() => setShimmerActive(false), 1500)
      return () => clearTimeout(timer)
    }
  }, [industry, userName, companyName, contentKey])

  const industryDisplayName = getIndustryDisplayName(industry)

  const benefitsList = [
    { id: "tech", text: pageContent.websiteDesignBenefit || "Technically Sound & Built on Modern Technologies" },
    { id: "custom", text: `Uniquely Custom-Designed to Reflect Your ${companyName ? companyName + "'s" : "Brand"}` },
    {
      id: "seo",
      text: `SEO-Optimized for Higher Search Rankings ${industryDisplayName !== "Your Industry" ? `in the ${industryDisplayName} market` : ""}`,
    },
    { id: "responsive", text: "Fully Responsive for All Devices" },
    { id: "secure", text: "Secure, Fast, and Reliable" },
  ]

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* <Navbar /> */}

      <main className="flex-grow">
        {/* Hero Section - Enhanced with animations */}
        <section
          className="py-20 md:py-28 bg-primary/5 dark:bg-primary/10 relative overflow-hidden"
          style={{
            backgroundImage: `url('/photorealistic-astronaut-building-futuristic-websi.jpg')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-background/90 dark:bg-background/85" />
          <div className="container text-center relative z-10">
            <div className="animate-fade-in">
              <Palette className="h-20 w-20 text-primary mx-auto mb-6 animate-pulse" />
              <h1 className="text-5xl md:text-6xl font-bold tracking-tighter mb-6 animate-slide-up">
                <ShimmerHighlight active={shimmerActive} delay={0.1}>
                  Professional Website Design & Development
                </ShimmerHighlight>
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto mb-8 animate-slide-up animation-delay-200">
                <ShimmerHighlight active={shimmerActive} delay={0.2}>
                  Custom websites built with 25 years of expertise. We create high-performance digital experiences that
                  drive results for businesses
                  {industryDisplayName !== "Your Industry" ? ` in the ${industryDisplayName} industry` : ""}.
                </ShimmerHighlight>
              </p>
              <div className="flex flex-wrap gap-4 justify-center mb-6 animate-slide-up animation-delay-400">
                <Button asChild size="lg" className="group">
                  <Link href="/#contact?service=website-design">
                    Get Your Free Consultation
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link href="/applications">View Our Portfolio</Link>
                </Button>
              </div>
              <div className="flex flex-wrap gap-6 justify-center text-sm text-muted-foreground animate-slide-up animation-delay-600">
                <div className="flex items-center gap-2">
                  <Award className="h-4 w-4 text-primary" />
                  <span>25+ Years Experience</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>500+ Websites Delivered</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-primary" />
                  <span>98% Client Satisfaction</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Results Section with hover animations */}
        <section className="py-16 md:py-20 bg-muted/30">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Proven Results That Drive Business Growth</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Our data-driven approach delivers measurable improvements for our clients
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {results.map((result, index) => {
                const Icon = result.icon
                return (
                  <div
                    key={result.metric}
                    className="p-6 bg-card rounded-lg border shadow-sm hover:shadow-lg hover:scale-105 transition-all duration-300 hover:border-primary/50 group"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <Icon className="h-8 w-8 text-primary mb-4 group-hover:scale-110 transition-transform" />
                    <div className="text-4xl font-bold text-primary mb-2">{result.value}</div>
                    <div className="text-sm text-muted-foreground">{result.metric}</div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Expertise Areas with enhanced hover effects */}
        <section className="py-16 md:py-20">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Comprehensive Website Design Expertise</h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                We don't just build websites—we craft digital experiences backed by decades of proven expertise in every
                aspect of web development
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              {expertiseAreas.map((area, index) => {
                const Icon = area.icon
                return (
                  <div
                    key={area.title}
                    className="p-8 bg-card rounded-lg border hover:border-primary/50 shadow-sm hover:shadow-xl transition-all duration-300 group hover:-translate-y-2"
                  >
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-primary/10 rounded-lg group-hover:bg-primary group-hover:scale-110 transition-all">
                        <Icon className="h-8 w-8 text-primary group-hover:text-primary-foreground transition-colors" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                          {area.title}
                        </h3>
                        <p className="text-muted-foreground mb-3">{area.description}</p>
                        <div className="text-sm font-semibold text-primary">{area.stats}</div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Our Process Section with step animations */}
        <section className="py-16 md:py-20 bg-muted/30">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Battle-Tested Website Design Process</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Refined over 25 years and 500+ projects, our proven process delivers exceptional results every time
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {processSteps.map((step, index) => (
                <div
                  key={step.number}
                  className="relative p-6 bg-card rounded-lg border hover:border-primary/50 hover:shadow-lg transition-all duration-300 group hover:-translate-y-1"
                >
                  <div className="text-6xl font-bold text-primary/10 group-hover:text-primary/20 transition-colors mb-4">
                    {step.number}
                  </div>
                  <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">{step.title}</h3>
                  <p className="text-muted-foreground mb-4 text-sm">{step.description}</p>
                  <div className="text-xs font-semibold text-primary border-t pt-3 mt-3">Timeline: {step.duration}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Technology Stack Section */}
        <section className="py-16 md:py-20">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Built With Cutting-Edge Technology</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                We use the latest, most reliable technologies trusted by industry leaders
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-4">
              {technologies.map((tech, index) => (
                <div
                  key={tech}
                  className="px-6 py-3 bg-card border rounded-full hover:border-primary hover:bg-primary/5 hover:scale-110 transition-all duration-300 cursor-default"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <span className="font-semibold text-sm">{tech}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 md:py-20 bg-muted/30">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Frequently Asked Questions About Website Design</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Expert answers to help you make informed decisions about your website investment
              </p>
            </div>
            <div className="max-w-4xl mx-auto space-y-6">
              {faqs.map((faq, index) => (
                <div
                  key={faq.question}
                  className="p-6 bg-card rounded-lg border hover:border-primary/50 hover:shadow-lg transition-all duration-300 group"
                >
                  <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors flex items-start gap-3">
                    <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0 mt-1" />
                    <span>{faq.question}</span>
                  </h3>
                  <p className="text-muted-foreground ml-9">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Trust Signals Section */}
        <section className="py-16 md:py-20">
          <div className="container">
            <div className="max-w-4xl mx-auto bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl p-8 md:p-12 border border-primary/20">
              <div className="text-center mb-8">
                <Award className="h-16 w-16 text-primary mx-auto mb-4" />
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Leading Businesses Choose RocketOpp</h2>
                <p className="text-lg text-muted-foreground">
                  25 years of experience. 500+ successful projects. Zero compromises on quality.
                </p>
              </div>
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="text-center">
                  <div className="text-4xl font-bold text-primary mb-2">25+</div>
                  <div className="text-sm text-muted-foreground">Years in Business</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-primary mb-2">500+</div>
                  <div className="text-sm text-muted-foreground">Websites Built</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-primary mb-2">98%</div>
                  <div className="text-sm text-muted-foreground">Client Retention</div>
                </div>
              </div>
              <div className="text-center">
                <Button asChild size="lg" className="group">
                  <Link href="/#contact?service=website-design">
                    Start Your Project Today
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Warning Section about DIY pitfalls */}
        <section className="py-16 md:py-20 bg-destructive/5 dark:bg-destructive/10">
          <div className="container">
            <div className="max-w-4xl mx-auto text-center">
              <AlertTriangle className="h-16 w-16 text-destructive mx-auto mb-6 animate-pulse" />
              <h2 className="text-3xl md:text-4xl font-bold mb-6">The Hidden Costs of DIY Website Design</h2>
              <div className="text-left space-y-4 mb-8">
                <div className="p-4 bg-card rounded-lg border border-destructive/20">
                  <h3 className="font-bold text-destructive mb-2">Time Investment</h3>
                  <p className="text-muted-foreground text-sm">
                    Most business owners spend 200+ hours learning and building a DIY website, time better spent growing
                    their business.
                  </p>
                </div>
                <div className="p-4 bg-card rounded-lg border border-destructive/20">
                  <h3 className="font-bold text-destructive mb-2">Technical Debt</h3>
                  <p className="text-muted-foreground text-sm">
                    DIY websites often have security vulnerabilities, slow loading speeds, and poor mobile experiences
                    that hurt your brand.
                  </p>
                </div>
                <div className="p-4 bg-card rounded-lg border border-destructive/20">
                  <h3 className="font-bold text-destructive mb-2">Lost Revenue</h3>
                  <p className="text-muted-foreground text-sm">
                    A poorly designed website can cost you thousands in lost sales, damaged credibility, and missed
                    opportunities.
                  </p>
                </div>
              </div>
              <Button asChild size="lg" variant="outline" className="group bg-transparent">
                <Link href="/#contact?service=website-consultation">
                  Get Expert Guidance
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />

      <style jsx global>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }
        
        .animate-slide-up {
          animation: slide-up 0.8s ease-out;
        }
        
        .animation-delay-200 {
          animation-delay: 0.2s;
          opacity: 0;
          animation-fill-mode: forwards;
        }
        
        .animation-delay-400 {
          animation-delay: 0.4s;
          opacity: 0;
          animation-fill-mode: forwards;
        }
        
        .animation-delay-600 {
          animation-delay: 0.6s;
          opacity: 0;
          animation-fill-mode: forwards;
        }
      `}</style>
    </div>
  )
}
