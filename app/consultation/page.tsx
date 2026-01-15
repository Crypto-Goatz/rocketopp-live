import type { Metadata } from "next"
import Link from "next/link"
import { Video, CheckCircle2, Clock, Zap, ArrowRight, Calendar, MessageSquare } from "lucide-react"

export const metadata: Metadata = {
  title: "Book a Consultation - Free Discovery Call | RocketOpp",
  description:
    "Schedule a free 30-minute discovery call with the RocketOpp team. Discuss your AI and automation needs and get expert guidance.",
}

export default function ConsultationPage() {
  return (
    <div className="min-h-screen bg-zinc-950 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-red-500/15 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-orange-500/5 rounded-full blur-3xl" />

        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px),
                             linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)`,
            backgroundSize: '60px 60px'
          }}
        />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-16 md:py-24">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-primary text-sm font-medium mb-6">
            <Video className="h-4 w-4" />
            Free 30-Minute Strategy Call
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
            Let's Talk{" "}
            <span className="bg-gradient-to-r from-primary via-orange-400 to-red-500 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(255,107,53,0.3)]">
              Strategy
            </span>
          </h1>
          <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto">
            Book a free discovery call to discuss your project and explore how AI and automation can transform your business.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Main CTA Card */}
          <div className="p-8 md:p-12 rounded-3xl bg-zinc-900/50 border border-zinc-800 backdrop-blur-sm mb-8">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-red-500 mb-4">
                <Calendar className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold mb-2">Schedule Your Discovery Call</h2>
              <p className="text-zinc-400">Choose the option that works best for you</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Option 1: Contact Form */}
              <Link
                href="/contact"
                className="p-6 rounded-2xl bg-zinc-800/50 border border-zinc-700 hover:border-primary/50 transition-all group"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                    <MessageSquare className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Send a Message</h3>
                    <p className="text-sm text-zinc-500">We'll reach out within 24h</p>
                  </div>
                </div>
                <p className="text-sm text-zinc-400 mb-4">
                  Tell us about your project and we'll schedule a call at a time that works for you.
                </p>
                <div className="flex items-center text-primary text-sm font-medium group-hover:gap-2 transition-all">
                  Fill out form
                  <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>

              {/* Option 2: Direct Call */}
              <a
                href="tel:+18788881230"
                className="p-6 rounded-2xl bg-gradient-to-br from-primary/10 to-red-500/5 border border-primary/20 hover:border-primary/40 transition-all group"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 rounded-xl bg-primary/20 group-hover:bg-primary/30 transition-colors">
                    <Zap className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Talk to Jessica (AI)</h3>
                    <p className="text-sm text-zinc-500">Available 24/7</p>
                  </div>
                </div>
                <p className="text-sm text-zinc-400 mb-4">
                  Call now and speak with our AI assistant who can answer questions and schedule your call.
                </p>
                <div className="flex items-center text-primary text-sm font-medium">
                  +1 (878) 888-1230
                  <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </a>
            </div>
          </div>

          {/* What to Expect */}
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: Clock,
                title: "30 Minutes",
                description: "Focused conversation about your needs and goals",
              },
              {
                icon: CheckCircle2,
                title: "No Obligation",
                description: "Free consultation with zero pressure",
              },
              {
                icon: Zap,
                title: "Expert Guidance",
                description: "Get actionable recommendations you can use",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="p-6 rounded-2xl bg-zinc-900/30 border border-zinc-800 text-center"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 mb-4">
                  <item.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-zinc-500">{item.description}</p>
              </div>
            ))}
          </div>

          {/* Topics We Cover */}
          <div className="mt-12 p-8 rounded-2xl bg-zinc-900/30 border border-zinc-800">
            <h3 className="text-xl font-bold mb-6 text-center">What We Can Discuss</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                "AI integration and automation strategies",
                "Custom software development needs",
                "CRM optimization and workflows",
                "MCP tools and Claude integration",
                "Agency scaling and operations",
                "White-label solutions for your clients",
              ].map((topic, i) => (
                <div key={i} className="flex items-center gap-3 text-zinc-400">
                  <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <span>{topic}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
