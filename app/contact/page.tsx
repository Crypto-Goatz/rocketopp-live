import type { Metadata } from "next"
import { ContactForm } from "./contact-form"
import { Mail, Phone, Zap, Clock, Shield, Star } from "lucide-react"

export const metadata: Metadata = {
  title: "Contact Us - Get Started with RocketOpp",
  description:
    "Ready to transform your business with AI? Get in touch and we'll respond within 24 hours.",
}

export default function ContactPage() {
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
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-primary text-sm font-medium mb-6">
            <Zap className="h-4 w-4" />
            Response within 24 hours
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
            Let's Build{" "}
            <span className="bg-gradient-to-r from-primary via-orange-400 to-red-500 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(255,107,53,0.3)]">
              Together
            </span>
          </h1>
          <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto">
            Ready to transform your business with AI and automation?
            Tell us about your project and let's make it happen.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 max-w-6xl mx-auto">
          {/* Contact Form - Takes up 3 columns */}
          <div className="lg:col-span-3">
            <ContactForm />
          </div>

          {/* Sidebar - Takes up 2 columns */}
          <div className="lg:col-span-2 space-y-6">
            {/* Direct Contact Card */}
            <div className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800 backdrop-blur-sm">
              <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                <span className="text-primary">💬</span>
                Prefer to talk directly?
              </h3>
              <div className="space-y-4">
                <a
                  href="mailto:Mike@rocketopp.com"
                  className="flex items-center gap-3 p-3 rounded-xl bg-zinc-800/50 hover:bg-zinc-800 transition-colors group"
                >
                  <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                    <Mail className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Email Us</p>
                    <p className="text-xs text-zinc-500">Mike@rocketopp.com</p>
                  </div>
                </a>
                <a
                  href="tel:+18788881230"
                  className="flex items-center gap-3 p-3 rounded-xl bg-zinc-800/50 hover:bg-zinc-800 transition-colors group"
                >
                  <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                    <Phone className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Call Jessica (AI)</p>
                    <p className="text-xs text-zinc-500">+1 (878) 888-1230</p>
                  </div>
                </a>
              </div>
            </div>

            {/* Why Choose Us */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-primary/10 to-red-500/5 border border-primary/20">
              <h3 className="font-semibold text-lg mb-4">Why RocketOpp?</h3>
              <div className="space-y-3">
                {[
                  { icon: Zap, text: "AI-first approach to every solution" },
                  { icon: Clock, text: "Rapid delivery, no wasted time" },
                  { icon: Shield, text: "Enterprise-grade security" },
                  { icon: Star, text: "100+ successful projects delivered" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm text-zinc-400">
                    <item.icon className="h-4 w-4 text-primary flex-shrink-0" />
                    <span>{item.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Trust Badge */}
            <div className="p-4 rounded-xl bg-zinc-900/30 border border-zinc-800 text-center">
              <p className="text-xs text-zinc-500 mb-2">Trusted by agencies worldwide</p>
              <div className="flex items-center justify-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                ))}
              </div>
              <p className="text-sm font-medium mt-1">4.9/5 from 50+ reviews</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
