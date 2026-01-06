import type { Metadata } from "next"
import { Workflow, FileText, Users, Zap, CheckCircle, ArrowRight, Bot, BookOpen, Settings, TrendingUp, Target, Shield, Clock, BarChart3 } from "lucide-react"
import { ServiceHero } from "@/components/service-hero"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Footer from "@/components/footer"

export const metadata: Metadata = {
  title: "SOP Automation | Standard Operating Procedures | Systems That Scale | RocketOpp",
  description: "Transform chaotic processes into streamlined systems. We document, automate, and train your team on SOPs that actually work. AI-powered workflow automation that scales your business.",
  keywords: "SOP automation, standard operating procedures, business process automation, workflow automation, process documentation, team training, AI automation, business systems, operational efficiency, RocketOpp",
  authors: [{ name: "RocketOpp", url: "https://rocketopp.com" }],
  openGraph: {
    title: "SOP Automation | Systems That Scale | RocketOpp",
    description: "Transform chaotic processes into streamlined systems. AI-powered SOP automation that scales your business.",
    url: "https://rocketopp.com/services/sop-automation",
    siteName: "RocketOpp",
    images: [
      {
        url: "https://rocketopp.com/og-sop-automation.jpg",
        width: 1200,
        height: 630,
        alt: "RocketOpp SOP Automation Services",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SOP Automation | RocketOpp",
    description: "Transform chaotic processes into AI-powered systems.",
    images: ["https://rocketopp.com/twitter-sop-automation.jpg"],
  },
  alternates: {
    canonical: "https://rocketopp.com/services/sop-automation",
  },
}

const services = [
  {
    id: "documentation",
    icon: FileText,
    title: "Process Documentation",
    description: "Transform tribal knowledge into clear, actionable documentation. We capture every step, decision point, and exception so nothing falls through the cracks.",
    features: ["Step-by-Step Guides", "Video Documentation", "Decision Trees", "Exception Handling"]
  },
  {
    id: "automation",
    icon: Zap,
    title: "Workflow Automation",
    description: "Turn documented processes into automated workflows. Reduce manual work, eliminate human error, and free your team for high-value tasks.",
    features: ["Trigger-Based Actions", "Multi-System Integration", "Conditional Logic", "Error Handling"]
  },
  {
    id: "training",
    icon: Users,
    title: "Team Training & Onboarding",
    description: "Create interactive training programs that get new hires productive faster. AI-powered learning paths adapt to each team member's pace.",
    features: ["Interactive Courses", "Knowledge Testing", "Progress Tracking", "AI Coaching"]
  },
  {
    id: "ai",
    icon: Bot,
    title: "AI-Powered Optimization",
    description: "Continuously improve your SOPs with AI analysis. Identify bottlenecks, suggest improvements, and keep processes evolving with your business.",
    features: ["Process Analytics", "Bottleneck Detection", "Improvement Suggestions", "Compliance Monitoring"]
  },
]

const benefits = [
  { icon: Clock, title: "Save 20+ Hours/Week", description: "Automated workflows handle repetitive tasks while you focus on growth" },
  { icon: Shield, title: "Reduce Errors by 90%", description: "Documented processes with built-in checks eliminate costly mistakes" },
  { icon: TrendingUp, title: "Scale Without Chaos", description: "Consistent systems let you grow without proportionally growing headcount" },
  { icon: Target, title: "Faster Onboarding", description: "New team members reach full productivity in days, not months" },
]

const approach = [
  { title: "Discover", description: "We shadow your team to understand how work actually gets done—not how it's supposed to." },
  { title: "Document", description: "Transform observations into clear, visual documentation with AI-enhanced clarity." },
  { title: "Automate", description: "Build workflows that handle routine tasks and route exceptions to the right people." },
  { title: "Train", description: "Roll out interactive training so everyone executes consistently." },
  { title: "Optimize", description: "Monitor, measure, and continuously improve based on real performance data." },
]

const stats = [
  { value: "85%", label: "Time Savings" },
  { value: "90%", label: "Error Reduction" },
  { value: "3x", label: "Faster Onboarding" },
  { value: "100%", label: "Process Coverage" },
]

const faqs = [
  {
    question: "What processes benefit most from SOP automation?",
    answer: "Any repeatable process with multiple steps, handoffs between people, or integration with software. Common wins include client onboarding, order fulfillment, content approval workflows, reporting routines, and employee onboarding. If you do it more than once a week, it's worth systematizing."
  },
  {
    question: "How long does it take to document and automate a process?",
    answer: "Simple processes (5-10 steps) can be documented in a day and automated in a week. Complex workflows with multiple decision points typically take 2-4 weeks. We work in phases, delivering value incrementally rather than waiting for a massive rollout."
  },
  {
    question: "Will this work with our existing tools?",
    answer: "We integrate with most popular business tools—CRMs, project management, communication platforms, accounting software, and more. Our automation runs through webhooks, APIs, and native integrations. If your tools have an API, we can connect them."
  },
  {
    question: "How do you handle processes that have a lot of exceptions?",
    answer: "Exception handling is actually where we shine. We document the 80% that follows the happy path, then create decision trees and escalation paths for exceptions. AI helps route unusual cases to the right person while capturing data to improve the process over time."
  },
  {
    question: "What if our processes change frequently?",
    answer: "We build flexibility into every SOP. Documentation is version-controlled, automations have adjustable parameters, and training modules can be updated without rebuilding from scratch. Plus, our AI optimization continuously suggests improvements based on actual usage."
  },
]

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "SOP Automation Services",
  "provider": {
    "@type": "Organization",
    "name": "RocketOpp",
    "url": "https://rocketopp.com"
  },
  "description": "Professional SOP automation services including process documentation, workflow automation, team training, and AI optimization.",
  "areaServed": "Worldwide",
  "serviceType": "Business Process Automation",
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

export default function SOPAutomationPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main className="flex min-h-screen flex-col bg-background">
        <ServiceHero
          icon={<Workflow className="w-6 h-6" />}
          title="Chaos to System. Process to Profit."
          subtitle="Systems That Scale"
          description="Transform scattered processes into streamlined systems. We document, automate, and train your team on SOPs that eliminate chaos, reduce errors, and let you scale without losing your mind."
          gradient="from-indigo-500 to-violet-500"
          stats={[
            { value: "85%", label: "Time Saved" },
            { value: "90%", label: "Error Reduction" },
            { value: "3x", label: "Faster Onboarding" },
          ]}
          ctaText="Get SOP Audit"
          ctaHref="/contact?service=sop-automation"
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

        {/* Benefits */}
        <section className="py-20">
          <div className="container">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Systematize Your Business?</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Stop reinventing the wheel. Build once, execute consistently, and scale without the chaos.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {benefits.map((benefit, i) => {
                const Icon = benefit.icon
                return (
                  <div key={i} className="p-6 bg-card rounded-xl border text-center hover:border-primary/50 transition-all">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center mx-auto mb-4">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-bold mb-2">{benefit.title}</h3>
                    <p className="text-sm text-muted-foreground">{benefit.description}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Services */}
        <section className="py-20 bg-muted/30">
          <div className="container">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Complete SOP Solutions</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                From documentation to automation to training—everything you need to build systems that scale.
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
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
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
        <section className="py-20">
          <div className="container">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Our 5-Phase Process</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                A proven methodology that delivers working systems, not just documentation.
              </p>
            </div>

            <div className="grid md:grid-cols-5 gap-4">
              {approach.map((step, i) => (
                <div key={i} className="relative p-6 bg-card rounded-xl border hover:border-primary/50 transition-all group text-center">
                  <div className="text-4xl font-bold text-primary/10 mb-3 group-hover:text-primary/20 transition-colors">
                    0{i + 1}
                  </div>
                  <h3 className="text-lg font-bold mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Use Cases */}
        <section className="py-20 bg-muted/30">
          <div className="container">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Common SOP Automation Projects</h2>
                <p className="text-lg text-muted-foreground">
                  Real examples of processes we've systematized for clients.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="p-6 bg-card rounded-xl border">
                  <h3 className="font-bold mb-3 flex items-center gap-2">
                    <Users className="w-5 h-5 text-primary" />
                    Client Onboarding
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    From signed contract to fully set up client in 24 hours instead of 2 weeks. Automated welcome sequences, account setup, and kickoff scheduling.
                  </p>
                </div>
                <div className="p-6 bg-card rounded-xl border">
                  <h3 className="font-bold mb-3 flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-primary" />
                    Employee Onboarding
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    New hires reach productivity in days with self-paced training, automated tool provisioning, and milestone tracking.
                  </p>
                </div>
                <div className="p-6 bg-card rounded-xl border">
                  <h3 className="font-bold mb-3 flex items-center gap-2">
                    <Settings className="w-5 h-5 text-primary" />
                    Service Delivery
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Consistent, high-quality delivery across your team. Checklists, approvals, and handoffs that ensure nothing gets missed.
                  </p>
                </div>
                <div className="p-6 bg-card rounded-xl border">
                  <h3 className="font-bold mb-3 flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-primary" />
                    Reporting & Analytics
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Automated report generation and distribution. Pull data from multiple sources, transform, and deliver to stakeholders without lifting a finger.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQs */}
        <section className="py-20">
          <div className="container">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Common questions about SOP automation answered.
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
        <section className="py-20 bg-muted/30">
          <div className="container">
            <div className="max-w-4xl mx-auto bg-gradient-to-br from-indigo-500/10 to-violet-500/10 rounded-2xl p-8 md:p-12 border border-indigo-500/20 text-center">
              <Workflow className="w-16 h-16 text-primary mx-auto mb-6" />
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Systematize?</h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                Get a free SOP audit and discover which processes will give you the biggest wins when automated.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Button size="lg" asChild className="group">
                  <Link href="/contact?service=sop-automation">
                    Get Free SOP Audit
                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/marketplace/rocket-plus">View Automation Tools</Link>
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
