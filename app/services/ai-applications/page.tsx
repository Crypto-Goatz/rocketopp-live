import type { Metadata } from "next"
import Image from "next/image"
import { Cpu, Bot, Zap, Brain, MessageSquare, Workflow, Database, Shield, CheckCircle, ArrowRight, Star, Award, Sparkles, BarChart3 } from "lucide-react"
import { ServiceHero } from "@/components/service-hero"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Footer from "@/components/footer"

export const metadata: Metadata = {
  title: "AI Application Development | Custom AI Solutions & Automation | RocketOpp",
  description: "Build intelligent AI applications that transform your business. Custom chatbots, process automation, and AI tools built by experts. From concept to deployment in weeks.",
  keywords: "AI applications, artificial intelligence, AI chatbots, process automation, machine learning, AI integration, custom AI solutions, business automation, AI development, RocketOpp",
  authors: [{ name: "RocketOpp", url: "https://rocketopp.com" }],
  openGraph: {
    title: "AI Application Development | Custom AI Solutions | RocketOpp",
    description: "Build intelligent AI applications that transform your business. Custom chatbots, automation, and AI tools.",
    url: "https://rocketopp.com/services/ai-applications",
    siteName: "RocketOpp",
    images: [
      {
        url: "https://rocketopp.com/og-ai-applications.jpg",
        width: 1200,
        height: 630,
        alt: "RocketOpp AI Application Development",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Application Development | RocketOpp",
    description: "Custom AI applications that transform your business operations.",
    images: ["https://rocketopp.com/twitter-ai-applications.jpg"],
  },
  alternates: {
    canonical: "https://rocketopp.com/services/ai-applications",
  },
}

const services = [
  {
    id: "chatbots",
    icon: Bot,
    title: "AI Chatbots & Assistants",
    description: "Intelligent conversational AI that handles customer support, lead qualification, and sales—24/7 without breaks.",
    features: ["Natural Language Understanding", "Multi-Channel Deployment", "Custom Training on Your Data"]
  },
  {
    id: "automation",
    icon: Workflow,
    title: "Process Automation",
    description: "Automate repetitive tasks and workflows with AI. From data entry to complex decision-making processes.",
    features: ["Workflow Orchestration", "Intelligent Decision Making", "Integration with Existing Tools"]
  },
  {
    id: "tools",
    icon: Brain,
    title: "Custom AI Tools",
    description: "Purpose-built AI applications designed for your specific business needs and industry requirements.",
    features: ["Industry-Specific Solutions", "Scalable Architecture", "Continuous Learning"]
  },
  {
    icon: Database,
    title: "AI Data Analysis",
    description: "Transform raw data into actionable insights with AI-powered analytics and reporting systems.",
    features: ["Predictive Analytics", "Pattern Recognition", "Automated Reporting"]
  },
]

const useCases = [
  { title: "Customer Support", description: "AI chatbots reduce response time by 80% while handling 65% of inquiries autonomously." },
  { title: "Lead Qualification", description: "Intelligent scoring and routing that increases conversion rates by 40%." },
  { title: "Document Processing", description: "Extract and process data from documents 10x faster than manual methods." },
  { title: "Content Generation", description: "AI-assisted content creation for marketing, documentation, and communications." },
]

const stats = [
  { value: "85%", label: "Cost Reduction" },
  { value: "24/7", label: "Availability" },
  { value: "10x", label: "Faster Processing" },
  { value: "40%", label: "Conversion Lift" },
]

const faqs = [
  {
    question: "How long does it take to build a custom AI application?",
    answer: "Most AI applications can be built in 4-12 weeks depending on complexity. Simple chatbots may take 2-4 weeks, while complex automation systems can take 8-16 weeks. We use agile development to deliver working features incrementally."
  },
  {
    question: "Do I need to provide training data for AI applications?",
    answer: "Not always. For general-purpose AI, we leverage pre-trained models. For custom applications, we work with your existing data (documents, conversations, processes) to train AI specifically for your use case. We handle all data processing securely."
  },
  {
    question: "How do you ensure AI security and data privacy?",
    answer: "All AI applications are built with enterprise-grade security. Data is encrypted at rest and in transit. We can deploy on your infrastructure or use secure cloud providers. We're SOC 2 compliant and follow GDPR/CCPA guidelines."
  },
  {
    question: "Can AI integrate with my existing systems?",
    answer: "Absolutely. We build AI applications that integrate seamlessly with your existing CRM, ERP, helpdesk, and other business systems via APIs. We support integrations with Salesforce, HubSpot, Zendesk, and 100+ other platforms."
  },
  {
    question: "What's the pricing model for AI applications?",
    answer: "AI applications start at $10,000 for basic chatbots and scale based on complexity, integration requirements, and usage volume. We offer both project-based pricing and ongoing subscription models. ROI is typically achieved within 3-6 months."
  },
]

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "AI Application Development",
  "provider": {
    "@type": "Organization",
    "name": "RocketOpp",
    "url": "https://rocketopp.com"
  },
  "description": "Custom AI application development including chatbots, process automation, and intelligent business tools.",
  "areaServed": "Worldwide",
  "serviceType": "AI Development",
  "offers": {
    "@type": "Offer",
    "price": "10000",
    "priceCurrency": "USD",
    "priceSpecification": {
      "@type": "PriceSpecification",
      "price": "10000",
      "priceCurrency": "USD",
      "minPrice": "10000"
    }
  }
}

export default function AIApplicationsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main className="flex min-h-screen flex-col bg-background">
        <ServiceHero
          icon={<Cpu className="w-6 h-6" />}
          title="AI That Works For You"
          subtitle="Intelligence On Demand"
          description="Custom AI applications that automate tasks, enhance customer experiences, and unlock insights hidden in your data. Built by experts who understand both AI and business."
          gradient="from-orange-500 to-red-500"
          visualVariant="nodes"
          floatingCards={[
            { value: "50K+", label: "Tasks/Day", color: "text-orange-500", position: "top-left" },
            { value: "99.7%", label: "Accuracy", color: "text-green-500", position: "bottom-right" },
            { value: "0.3s", label: "Response", color: "text-red-400", position: "mid-left" },
          ]}
          stats={[
            { value: "85%", label: "Cost Savings" },
            { value: "24/7", label: "Availability" },
            { value: "10x", label: "Faster" },
          ]}
          ctaText="Explore AI Solutions"
          ctaHref="/contact?service=ai-applications"
        />

        {/* Visual Showcase */}
        <section className="py-16 bg-gradient-to-b from-background to-muted/30">
          <div className="container">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="relative">
                <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-primary/20">
                  <Image
                    src="/photorealistic-astronaut-with-ai-neural-network.jpg"
                    alt="AI Neural Network Visualization"
                    width={600}
                    height={400}
                    className="w-full h-auto object-cover"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <p className="text-white/80 text-sm">Advanced AI neural networks powering your business</p>
                  </div>
                </div>
                {/* Floating accent images */}
                <div className="absolute -top-6 -right-6 w-32 h-32 rounded-xl overflow-hidden shadow-xl border-2 border-background hidden lg:block">
                  <Image
                    src="/photorealistic-astronaut-analyzing-seo-data.jpg"
                    alt="AI Data Analysis"
                    width={128}
                    height={128}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-6 -left-6 w-40 h-28 rounded-xl overflow-hidden shadow-xl border-2 border-background hidden lg:block">
                  <Image
                    src="/photorealistic-astronaut-controlling-automated.jpg"
                    alt="Process Automation"
                    width={160}
                    height={112}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div>
                <span className="text-primary text-sm font-semibold uppercase tracking-wider">The Future of Business</span>
                <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-6">AI-Powered Intelligence at Scale</h2>
                <p className="text-muted-foreground text-lg mb-6">
                  Our AI solutions combine cutting-edge machine learning with practical business applications.
                  We don't just build AI—we build AI that understands your business, learns from your data,
                  and delivers measurable results.
                </p>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span><strong>Custom-trained models</strong> on your unique business data</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span><strong>Enterprise-grade security</strong> with SOC 2 compliance</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span><strong>Seamless integration</strong> with your existing systems</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

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
              <h2 className="text-3xl md:text-4xl font-bold mb-4">AI Solutions That Transform Business</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                From intelligent chatbots to complex automation systems, we build AI that delivers measurable ROI.
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
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
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

        {/* Use Cases */}
        <section className="py-20 bg-muted/30">
          <div className="container">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Real-World AI Impact</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                See how businesses are using AI to drive measurable results.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {useCases.map((useCase, i) => (
                <div key={i} className="p-6 bg-card rounded-xl border hover:border-primary/50 transition-all">
                  <Sparkles className="w-8 h-8 text-primary mb-4" />
                  <h3 className="text-lg font-bold mb-2">{useCase.title}</h3>
                  <p className="text-sm text-muted-foreground">{useCase.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Our Products */}
        <section className="py-20">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Explore Our AI Products</h2>
              <p className="text-lg text-muted-foreground">
                Ready-to-use AI tools available in our marketplace.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <Link href="/marketplace/rocket-plus" className="p-6 bg-card rounded-xl border hover:border-primary/50 transition-all group">
                <h3 className="font-bold mb-2 group-hover:text-primary transition-colors">Rocket+</h3>
                <p className="text-sm text-muted-foreground">50+ AI-powered automation tools for CRM</p>
              </Link>
              <Link href="/marketplace/mcpfed" className="p-6 bg-card rounded-xl border hover:border-primary/50 transition-all group">
                <h3 className="font-bold mb-2 group-hover:text-primary transition-colors">MCPFED</h3>
                <p className="text-sm text-muted-foreground">MCP server directory and management</p>
              </Link>
              <Link href="/marketplace/botcoaches" className="p-6 bg-card rounded-xl border hover:border-primary/50 transition-all group">
                <h3 className="font-bold mb-2 group-hover:text-primary transition-colors">BotCoaches</h3>
                <p className="text-sm text-muted-foreground">Personalized AI coaching profiles</p>
              </Link>
            </div>
          </div>
        </section>

        {/* FAQs */}
        <section className="py-20 bg-muted/30">
          <div className="container">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Everything you need to know about AI application development.
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
            <div className="max-w-4xl mx-auto bg-gradient-to-br from-orange-500/10 to-red-500/10 rounded-2xl p-8 md:p-12 border border-orange-500/20 text-center">
              <Cpu className="w-16 h-16 text-primary mx-auto mb-6" />
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Leverage AI?</h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                Let's explore how AI can transform your business operations and drive growth.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Button size="lg" asChild className="group">
                  <Link href="/contact?service=ai-applications">
                    Get AI Consultation
                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/marketplace">Browse AI Products</Link>
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
