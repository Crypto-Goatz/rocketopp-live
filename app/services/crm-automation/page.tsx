import type { Metadata } from "next"
import Link from "next/link"
import { Target, CheckCircle, ArrowRight, Clock, Mail, Users, Calendar, Zap, BarChart3, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ServiceOfferSchema, FAQSchema, BreadcrumbSchema } from "@/components/seo/json-ld"
import Footer from "@/components/footer"

export const metadata: Metadata = {
  title: "CRM Setup & Automation - Pricing & What's Included | RocketOpp",
  description:
    "CRM setup and automation from $1,497. Full CRM deployment with automated pipelines, email sequences, appointment booking, and lead scoring. Delivered in 1 week.",
  keywords: [
    "CRM setup cost",
    "CRM automation pricing",
    "CRM implementation cost",
    "automated sales pipeline",
    "email sequence automation",
    "lead scoring setup",
    "appointment booking automation",
    "CRM for small business cost",
    "sales automation pricing",
    "CRM configuration services",
  ],
  openGraph: {
    title: "CRM Setup & Automation - Pricing & What's Included | RocketOpp",
    description: "Full CRM automation from $1,497. Deployed in 1 week. Pipelines, emails, booking, lead scoring.",
    url: "https://rocketopp.com/services/crm-automation",
  },
  alternates: { canonical: "https://rocketopp.com/services/crm-automation" },
}

const tiers = [
  {
    name: "CRM Setup",
    price: "$1,497",
    timeline: "1 week",
    features: [
      "Full CRM configuration",
      "Contact import & organization",
      "3 automated pipelines",
      "Email sequence setup (5 sequences)",
      "Appointment booking calendar",
      "Lead capture forms",
      "Basic reporting dashboard",
      "Training session (1 hour)",
    ],
  },
  {
    name: "CRM Pro",
    price: "$2,997",
    timeline: "2 weeks",
    popular: true,
    features: [
      "Everything in CRM Setup",
      "AI lead scoring",
      "10 automated pipelines",
      "Advanced email sequences (15)",
      "SMS automation",
      "Webhook integrations",
      "Custom fields & workflows",
      "3 training sessions",
    ],
  },
  {
    name: "CRM Enterprise",
    price: "$5,997",
    timeline: "3 weeks",
    features: [
      "Everything in CRM Pro",
      "Multi-location setup",
      "Custom API integrations",
      "AI-powered follow-up sequences",
      "Revenue attribution tracking",
      "Advanced reporting & analytics",
      "0nMCP workflow integration",
      "Ongoing support (3 months)",
    ],
  },
]

const faqs = [
  {
    question: "How much does CRM setup and automation cost?",
    answer:
      "Industry average for CRM setup and automation is $3,000 - $10,000. RocketOpp starts at $1,497 because our team has deep expertise in CRM platforms and uses AI-powered tools to accelerate configuration. What takes traditional consultants weeks, we deliver in days.",
  },
  {
    question: "Which CRM platform do you use?",
    answer:
      "We work with industry-leading CRM platforms that include built-in automation, email marketing, SMS, appointment booking, and pipeline management. The platform is included in our service — no separate CRM subscription needed for most packages.",
  },
  {
    question: "Can you migrate my data from another CRM?",
    answer:
      "Yes. We handle full data migration from any CRM — HubSpot, Salesforce, Zoho, Pipedrive, or spreadsheets. Contact records, deal history, notes, and custom fields are all transferred. We verify data integrity after every migration.",
  },
  {
    question: "What is AI lead scoring?",
    answer:
      "AI lead scoring automatically ranks your leads by likelihood to convert. It analyzes behavior (email opens, page visits, form fills), demographics, and engagement history to assign a score. Your sales team focuses on hot leads, not cold ones.",
  },
  {
    question: "Do I need technical skills to manage the CRM?",
    answer:
      "No. The CRM comes with an intuitive interface for managing contacts, viewing pipelines, and sending campaigns. We provide training sessions and documentation. Our Pro and Enterprise tiers include multiple training sessions to ensure your team is fully comfortable.",
  },
]

export default function CRMAutomationPage() {
  return (
    <>
      <ServiceOfferSchema
        name="CRM Setup & Automation"
        description="Full CRM deployment with automated pipelines, email sequences, appointment booking, AI lead scoring, and workflow automation."
        serviceType="CRM Automation"
        url="https://rocketopp.com/services/crm-automation"
        price={1497}
      />
      <FAQSchema items={faqs} />
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "https://rocketopp.com" },
          { name: "Services", url: "https://rocketopp.com/services" },
          { name: "CRM Automation", url: "https://rocketopp.com/services/crm-automation" },
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
                Ships in 1 week
              </div>
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                CRM Setup & Automation — Pricing & What&apos;s Included
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
                Full CRM setup with automated pipelines, email sequences, appointment booking, and lead scoring. Starting at <span className="text-primary font-bold">$1,497</span>.
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
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">What&apos;s Automated</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {[
                { icon: Target, title: "Sales Pipelines", desc: "Visual deal tracking with automated stage progression and notifications." },
                { icon: Mail, title: "Email Sequences", desc: "Drip campaigns, follow-ups, and nurture sequences that run on autopilot." },
                { icon: Calendar, title: "Appointment Booking", desc: "Online scheduling with automated confirmations and reminders." },
                { icon: Users, title: "Lead Scoring", desc: "AI ranks leads by conversion likelihood so your team focuses on winners." },
                { icon: Phone, title: "SMS Automation", desc: "Automated text messages for confirmations, reminders, and follow-ups." },
                { icon: BarChart3, title: "Reporting", desc: "Revenue tracking, pipeline analytics, and performance dashboards." },
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
              From basic CRM setup to full enterprise automation.
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
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Automate Your Sales?</h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
              Stop losing leads to manual follow-up. Full CRM automation in 1 week for $1,497.
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
