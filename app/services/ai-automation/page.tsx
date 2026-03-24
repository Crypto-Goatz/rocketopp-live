import type { Metadata } from "next"
import Link from "next/link"
import { Cpu, CheckCircle, ArrowRight, Clock, Bot, MessageSquare, Zap, Workflow, Brain, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ServiceOfferSchema, FAQSchema, BreadcrumbSchema } from "@/components/seo/json-ld"
import Footer from "@/components/footer"

export const metadata: Metadata = {
  title: "AI Business Automation - Pricing & What's Included | RocketOpp",
  description:
    "AI business automation from $2,997. Custom AI systems that automate operations — customer service, lead qualification, content creation. Delivered in 2 weeks. Powered by 0nMCP.",
  keywords: [
    "AI for business cost",
    "business automation pricing",
    "AI automation services",
    "custom AI systems",
    "AI chatbot for business",
    "AI lead qualification",
    "business process automation cost",
    "AI integration pricing",
    "enterprise AI systems",
    "AI workflow automation",
  ],
  openGraph: {
    title: "AI Business Automation - Pricing & What's Included | RocketOpp",
    description: "Custom AI automation from $2,997. Delivered in 2 weeks. Powered by 0nMCP.",
    url: "https://rocketopp.com/services/ai-automation",
  },
  alternates: { canonical: "https://rocketopp.com/services/ai-automation" },
}

const tiers = [
  {
    name: "AI Starter",
    price: "$2,997",
    timeline: "2 weeks",
    features: [
      "AI chatbot for customer service",
      "Lead qualification automation",
      "Email response automation",
      "FAQ bot with your content",
      "Integration with your CRM",
      "Analytics dashboard",
      "Training & documentation",
      "1 month of support",
    ],
  },
  {
    name: "AI Business Suite",
    price: "$5,997",
    timeline: "3 weeks",
    popular: true,
    features: [
      "Everything in AI Starter",
      "Multi-channel AI (web, email, SMS)",
      "AI content generation pipeline",
      "Automated reporting & insights",
      "Custom AI agents (up to 3)",
      "Workflow orchestration via 0nMCP",
      "API integrations (up to 10 services)",
      "3 months of support",
    ],
  },
  {
    name: "AI Enterprise",
    price: "$12,997",
    timeline: "6 weeks",
    features: [
      "Everything in Business Suite",
      "Unlimited custom AI agents",
      "Full 0nMCP deployment (1,171 tools)",
      "MCP server integration",
      "Custom model fine-tuning",
      "On-premise or cloud deployment",
      "SLA & priority support",
      "12 months of support",
    ],
  },
]

const faqs = [
  {
    question: "How much does AI automation cost for a small business?",
    answer:
      "Industry average for custom AI systems is $5,000 - $25,000. RocketOpp starts at $2,997 because we build on 0nMCP — our orchestration platform with 1,171 pre-built tools across 54 services. Instead of building from scratch, we configure and connect existing capabilities.",
  },
  {
    question: "What can AI automation actually do for my business?",
    answer:
      "AI automation can handle customer service inquiries 24/7, qualify and route leads automatically, generate content (emails, social posts, reports), analyze data and surface insights, automate repetitive workflows, and much more. The typical business saves 15-30 hours per week.",
  },
  {
    question: "Do I need technical knowledge to use AI automation?",
    answer:
      "No. We build everything with user-friendly interfaces. Your team interacts with AI through chat, dashboards, and simple buttons — not code. We provide full training and documentation so anyone on your team can manage the system.",
  },
  {
    question: "What AI models do you use?",
    answer:
      "We use the best model for each task. Claude (Anthropic) for complex reasoning and customer service, GPT-4 for content generation, and specialized models for specific tasks. Our 0nMCP orchestrator routes to the optimal model automatically.",
  },
  {
    question: "How do you handle data privacy with AI?",
    answer:
      "Data privacy is foundational. All data is encrypted at rest and in transit. We use enterprise AI APIs with data processing agreements. Your data is never used to train AI models. We can deploy on-premise for maximum security (Enterprise tier).",
  },
]

export default function AIAutomationPage() {
  return (
    <>
      <ServiceOfferSchema
        name="AI Business Automation"
        description="Custom AI systems for business automation — customer service, lead qualification, content creation. Powered by 0nMCP with 1,171 tools across 54 services."
        serviceType="AI Business Automation"
        url="https://rocketopp.com/services/ai-automation"
        price={2997}
      />
      <FAQSchema items={faqs} />
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "https://rocketopp.com" },
          { name: "Services", url: "https://rocketopp.com/services" },
          { name: "AI Automation", url: "https://rocketopp.com/services/ai-automation" },
        ]}
      />

      <main className="min-h-screen">
        <section className="pt-24 pb-16 md:pt-32 md:pb-20 relative overflow-hidden">
          <div className="absolute inset-0 grid-background opacity-20" />
          <div className="absolute inset-0 grid-gradient" />
          <div className="container relative z-10 px-4 md:px-6">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/5 text-sm font-medium text-primary mb-6">
                <Clock className="w-4 h-4" />
                Ships in 2 weeks
              </div>
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                AI Business Automation — Pricing & What&apos;s Included
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
                Custom AI systems that automate your operations. From customer service to lead qualification to content creation. Starting at <span className="text-primary font-bold">$2,997</span>.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="text-lg px-8 py-6" asChild>
                  <Link href="/contact">
                    Get Started <ArrowRight className="ml-2 w-5 h-5" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="text-lg px-8 py-6" asChild>
                  <a href="#pricing">See Pricing</a>
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24 bg-card/50">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">What AI Can Do For You</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {[
                { icon: Bot, title: "AI Customer Service", desc: "24/7 chatbot trained on your business. Handles inquiries, books appointments, qualifies leads." },
                { icon: MessageSquare, title: "Smart Lead Routing", desc: "AI scores and routes leads to the right person. No more manual triage." },
                { icon: FileText, title: "Content Generation", desc: "Blog posts, social media, emails, and reports generated automatically." },
                { icon: Workflow, title: "Workflow Automation", desc: "Automate repetitive processes with 0nMCP's 1,171 connected tools." },
                { icon: Brain, title: "AI Insights", desc: "Automated analysis of your business data with actionable recommendations." },
                { icon: Zap, title: "Multi-Channel", desc: "One AI brain across web chat, email, SMS, and social media." },
              ].map((item) => {
                const Icon = item.icon
                return (
                  <div key={item.title} className="card-lifted p-6 space-y-3">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary">
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-bold">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        <section id="pricing" className="py-16 md:py-24">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">Pricing</h2>
            <p className="text-center text-muted-foreground mb-12 max-w-xl mx-auto">
              From single chatbot to full enterprise AI deployment.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {tiers.map((tier) => (
                <div
                  key={tier.name}
                  className={`card-lifted p-6 space-y-6 ${tier.popular ? "border-primary ring-2 ring-primary/20" : ""}`}
                >
                  {tier.popular && (
                    <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-bold">
                      Most Popular
                    </div>
                  )}
                  <div>
                    <h3 className="text-xl font-bold">{tier.name}</h3>
                    <div className="mt-2">
                      <span className="text-4xl font-bold text-primary">{tier.price}</span>
                    </div>
                    <div className="mt-1 inline-flex items-center gap-1.5 text-sm text-muted-foreground">
                      <Clock className="w-3.5 h-3.5" />
                      Ships in {tier.timeline}
                    </div>
                  </div>
                  <ul className="space-y-3">
                    {tier.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Button className="w-full" variant={tier.popular ? "default" : "outline"} asChild>
                    <Link href="/contact">
                      Get Started <ArrowRight className="ml-1.5 w-4 h-4" />
                    </Link>
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24 bg-card/50">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Frequently Asked Questions</h2>
            <div className="max-w-3xl mx-auto space-y-6">
              {faqs.map((faq) => (
                <div key={faq.question} className="card-lifted p-6">
                  <h3 className="text-lg font-bold mb-3">{faq.question}</h3>
                  <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24">
          <div className="container px-4 md:px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Automate?</h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
              Save 15-30 hours per week with AI automation. Starting at $2,997.
            </p>
            <Button size="lg" className="text-lg px-8 py-6" asChild>
              <Link href="/contact">
                Get Started Today <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}
