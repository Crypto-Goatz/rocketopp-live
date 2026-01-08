import type { Metadata } from "next"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Link from "next/link"
import Footer from "@/components/footer"
import {
  Users,
  Mail,
  MessageSquare,
  BarChart3,
  Calendar,
  Globe,
  Zap,
  Phone,
  FileText,
  Target,
  TrendingUp,
  CheckCircle,
  ArrowRight,
  Rocket,
  Bot,
  Workflow,
} from "lucide-react"

export const metadata: Metadata = {
  title: "Rocket Clients | All-In-One Marketing & Sales Automation Platform",
  description:
    "Rocket Clients is a complete CRM, email marketing, funnel building, AI chatbot, and automation platform. Replace 10+ tools with one powerful solution. Built for agencies and growing businesses.",
  keywords: "CRM, marketing automation, sales automation, email marketing, AI chatbots, funnel builder, appointment scheduling, business automation",
  openGraph: {
    title: "Rocket Clients | All-In-One Marketing & Sales Platform",
    description: "Replace 10+ tools with one powerful platform. CRM, email, funnels, chatbots, and more.",
    type: "website",
  },
}

const features = [
  {
    icon: Users,
    title: "CRM & Pipeline Management",
    description: "Track every lead, deal, and customer interaction in one place. Visual pipelines, custom fields, and smart automations keep your sales process on track.",
  },
  {
    icon: Mail,
    title: "Email & SMS Marketing",
    description: "Create beautiful campaigns, automate sequences, and segment your audience. A/B testing, analytics, and deliverability optimization built-in.",
  },
  {
    icon: Bot,
    title: "AI-Powered Chatbots",
    description: "Deploy intelligent chatbots on your website, Facebook, and Instagram. Qualify leads, book appointments, and answer questions 24/7.",
  },
  {
    icon: Globe,
    title: "Website & Funnel Builder",
    description: "Drag-and-drop builder for landing pages, full websites, and sales funnels. Mobile-optimized templates and built-in A/B testing.",
  },
  {
    icon: Calendar,
    title: "Appointment Scheduling",
    description: "Eliminate back-and-forth emails. Automated reminders, calendar sync, and round-robin booking for teams.",
  },
  {
    icon: Phone,
    title: "Phone System & Call Tracking",
    description: "Built-in VoIP, call recording, voicemail drops, and call tracking. Know exactly which campaigns drive calls.",
  },
  {
    icon: Workflow,
    title: "Workflow Automation",
    description: "Build complex automations without code. Trigger actions based on any event—form submissions, purchases, tag changes, and more.",
  },
  {
    icon: FileText,
    title: "Forms & Surveys",
    description: "Capture leads with custom forms and surveys. Conditional logic, file uploads, and instant CRM integration.",
  },
  {
    icon: BarChart3,
    title: "Analytics & Reporting",
    description: "Track every metric that matters. Attribution reporting, pipeline analytics, and custom dashboards.",
  },
]

const useCases = [
  {
    title: "Marketing Agencies",
    description: "Manage unlimited client accounts from one dashboard. White-label everything and scale your agency.",
    icon: Target,
  },
  {
    title: "Local Businesses",
    description: "Get found online, capture leads, and convert them into customers with automated follow-up.",
    icon: Globe,
  },
  {
    title: "Coaches & Consultants",
    description: "Book calls, nurture leads, and deliver programs—all from one platform.",
    icon: Users,
  },
  {
    title: "E-Commerce Brands",
    description: "Recover abandoned carts, segment buyers, and drive repeat purchases with targeted campaigns.",
    icon: TrendingUp,
  },
]

const stats = [
  { value: "10+", label: "Tools Replaced" },
  { value: "85%", label: "Time Saved" },
  { value: "3x", label: "Lead Conversion" },
  { value: "$500+", label: "Monthly Savings" },
]

const comparisonTools = [
  "HubSpot CRM",
  "Mailchimp",
  "Calendly",
  "ClickFunnels",
  "ActiveCampaign",
  "Twilio",
  "Intercom",
  "Typeform",
  "Google Analytics",
  "Zapier",
]

export default function RocketClientsPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-20 md:py-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-2 mb-6">
              <Rocket className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">Powered by RocketOpp</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-6">
              <span className="text-foreground">One Platform.</span>
              <br />
              <span className="bg-gradient-to-r from-primary via-orange-400 to-red-500 bg-clip-text text-transparent">
                Every Tool You Need.
              </span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Rocket Clients replaces your CRM, email marketing, funnels, scheduling, chatbots, and more—all in one
              powerful platform built for growth.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button size="lg" asChild className="group">
                <Link href="/contact?service=rocket-clients">
                  Start Free Trial
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="#features">See All Features</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="py-12 bg-muted/30 border-y border-border">
        <div className="container mx-auto px-4">
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

      {/* Tools Replaced */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Replace Your Entire Tech Stack</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Stop paying for 10+ different tools. Rocket Clients does it all.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto">
            {comparisonTools.map((tool, i) => (
              <div
                key={i}
                className="px-4 py-2 bg-card border border-border rounded-full text-sm text-muted-foreground line-through decoration-primary/50"
              >
                {tool}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything You Need to Grow</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              From lead capture to customer retention, Rocket Clients handles every stage of your business growth.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => {
              const Icon = feature.icon
              return (
                <Card key={i} className="p-6 hover:border-primary/50 transition-all group">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-red-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm">{feature.description}</p>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Built for Businesses Like Yours</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Whether you're an agency managing clients or a local business capturing leads, Rocket Clients scales with you.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {useCases.map((useCase, i) => {
              const Icon = useCase.icon
              return (
                <Card key={i} className="p-6 text-center hover:border-primary/50 transition-all">
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="font-bold mb-2">{useCase.title}</h3>
                  <p className="text-sm text-muted-foreground">{useCase.description}</p>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Why Rocket Clients */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Businesses Choose Rocket Clients</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                {[
                  "All-in-one platform eliminates integration headaches",
                  "White-label options for agencies and resellers",
                  "Unlimited contacts on all plans",
                  "World-class support and onboarding",
                  "Regular feature updates at no extra cost",
                  "Enterprise-grade security and compliance",
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
              <div className="bg-gradient-to-br from-primary/10 to-red-500/10 rounded-2xl p-8 border border-primary/20">
                <h3 className="text-xl font-bold mb-4">Start Growing Today</h3>
                <p className="text-muted-foreground mb-6">
                  Join thousands of businesses using Rocket Clients to streamline operations and accelerate growth.
                </p>
                <div className="space-y-4">
                  <Button size="lg" className="w-full group" asChild>
                    <Link href="/contact?service=rocket-clients">
                      Get Started Free
                      <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                  <p className="text-xs text-center text-muted-foreground">
                    14-day free trial. No credit card required.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Simplify Your Business?</h2>
            <p className="text-xl text-muted-foreground mb-8">
              Stop juggling tools. Start growing with one powerful platform.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="/contact?service=rocket-clients">Start Free Trial</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/contact">Schedule a Demo</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
