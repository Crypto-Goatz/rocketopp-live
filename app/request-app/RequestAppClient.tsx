"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
  Smartphone,
  Globe,
  Cpu,
  Rocket,
  CheckCircle,
  ArrowRight,
  Star,
  Zap,
  Shield,
  Clock,
  Users,
  Award,
  MapPin,
  Phone,
  Mail,
  Building2,
  Sparkles,
  Code2,
  Database,
  Cloud
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Footer from "@/components/footer"
import Link from "next/link"
import Image from "next/image"

const appTypes = [
  { value: "mobile-ios", label: "iOS Mobile App" },
  { value: "mobile-android", label: "Android Mobile App" },
  { value: "mobile-cross", label: "Cross-Platform Mobile App" },
  { value: "web-app", label: "Web Application" },
  { value: "saas", label: "SaaS Platform" },
  { value: "ai-powered", label: "AI-Powered Application" },
  { value: "enterprise", label: "Enterprise Solution" },
  { value: "ecommerce", label: "E-Commerce Platform" },
  { value: "other", label: "Other / Not Sure Yet" },
]

const budgetRanges = [
  { value: "15k-25k", label: "$15,000 - $25,000 (MVP)" },
  { value: "25k-50k", label: "$25,000 - $50,000" },
  { value: "50k-100k", label: "$50,000 - $100,000" },
  { value: "100k-250k", label: "$100,000 - $250,000" },
  { value: "250k+", label: "$250,000+" },
  { value: "not-sure", label: "Not Sure / Need Guidance" },
]

const timelines = [
  { value: "asap", label: "ASAP - Ready to Start" },
  { value: "1-month", label: "Within 1 Month" },
  { value: "1-3-months", label: "1-3 Months" },
  { value: "3-6-months", label: "3-6 Months" },
  { value: "exploring", label: "Just Exploring Options" },
]

const features = [
  { icon: Smartphone, title: "Mobile Apps", desc: "iOS & Android" },
  { icon: Globe, title: "Web Apps", desc: "Progressive & Responsive" },
  { icon: Cpu, title: "AI Integration", desc: "Machine Learning" },
  { icon: Cloud, title: "Cloud Native", desc: "Scalable & Secure" },
]

const stats = [
  { value: "200+", label: "Apps Delivered", icon: Rocket },
  { value: "4.9", label: "Client Rating", icon: Star },
  { value: "98%", label: "On-Time Delivery", icon: Clock },
  { value: "$50M+", label: "Client Revenue", icon: Zap },
]

const testimonials = [
  {
    quote: "RocketOpp transformed our business idea into a fully functional app in just 12 weeks. The AI features they built have completely automated our customer service.",
    author: "Sarah Mitchell",
    role: "CEO, Pittsburgh Healthcare Solutions",
    rating: 5,
  },
  {
    quote: "As a Pittsburgh startup, finding a local team that understood AI was crucial. RocketOpp exceeded every expectation and delivered under budget.",
    author: "James Wilson",
    role: "Founder, SteelCity Tech",
    rating: 5,
  },
  {
    quote: "Our e-commerce app increased sales by 340% in the first year. The recommendation engine RocketOpp built is incredible.",
    author: "Maria Garcia",
    role: "Owner, Strip District Boutique",
    rating: 5,
  },
]

const portfolioImages = [
  { src: "/images/portfolio/app-dashboard-dark.jpg", alt: "Enterprise Dashboard App - Dark Mode Analytics Interface" },
  { src: "/images/portfolio/mobile-app-screens.jpg", alt: "Mobile App Design - iOS and Android Screens" },
  { src: "/images/portfolio/ai-interface.jpg", alt: "AI-Powered Application Interface" },
]

export default function RequestAppClient() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    company: "",
    appType: "",
    budget: "",
    timeline: "",
    description: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch("/api/leads/request-app", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setIsSubmitted(true)
      }
    } catch (error) {
      console.error("Form submission error:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubmitted) {
    return (
      <>
        <main className="min-h-screen flex items-center justify-center px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-2xl mx-auto text-center"
          >
            <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-500" />
            </div>
            <h1 className="text-4xl font-bold mb-4">Request Received!</h1>
            <p className="text-xl text-muted-foreground mb-8">
              Thanks, {formData.firstName}! A RocketOpp expert will review your app request and contact you within 24 hours to discuss your project.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="/assessment">
                  Take Free AI Assessment
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/applications">View Our Portfolio</Link>
              </Button>
            </div>
          </motion.div>
        </main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <main className="min-h-screen">
        {/* Hero Section */}
        <section className="relative py-20 lg:py-32 overflow-hidden">
          {/* Background Effects */}
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 via-transparent to-purple-500/5" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(249,115,22,0.15),transparent)]" />

          {/* Floating Elements */}
          <div className="absolute top-20 left-10 w-72 h-72 bg-orange-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />

          <div className="container relative">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/20 mb-6">
                  <MapPin className="w-4 h-4 text-orange-500" />
                  <span className="text-sm font-medium">Pittsburgh's #1 App Development Agency</span>
                </div>

                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                  Request Your{" "}
                  <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                    Custom App
                  </span>
                </h1>

                <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                  Transform your idea into a powerful mobile or web application. Pittsburgh's leading AI-powered development team is ready to bring your vision to life.
                </p>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  {stats.map((stat, i) => {
                    const Icon = stat.icon
                    return (
                      <div key={i} className="text-center p-4 rounded-lg bg-card/50 border border-border/50">
                        <Icon className="w-5 h-5 mx-auto mb-2 text-orange-500" />
                        <div className="text-2xl font-bold">{stat.value}</div>
                        <div className="text-xs text-muted-foreground">{stat.label}</div>
                      </div>
                    )
                  })}
                </div>

                {/* Trust Badges */}
                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-green-500" />
                    <span>NDA Protected</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-blue-500" />
                    <span>24hr Response</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-yellow-500" />
                    <span>Top Rated Agency</span>
                  </div>
                </div>
              </motion.div>

              {/* Form */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <div className="bg-card rounded-2xl border border-border shadow-2xl p-8">
                  <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold mb-2">Start Your Project</h2>
                    <p className="text-muted-foreground">Free consultation - No obligation</p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name *</Label>
                        <Input
                          id="firstName"
                          value={formData.firstName}
                          onChange={(e) => handleInputChange("firstName", e.target.value)}
                          placeholder="John"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name *</Label>
                        <Input
                          id="lastName"
                          value={formData.lastName}
                          onChange={(e) => handleInputChange("lastName", e.target.value)}
                          placeholder="Doe"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Business Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        placeholder="john@company.com"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => handleInputChange("phone", e.target.value)}
                          placeholder="(412) 555-0123"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="company">Company</Label>
                        <Input
                          id="company"
                          value={formData.company}
                          onChange={(e) => handleInputChange("company", e.target.value)}
                          placeholder="Your Company"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="appType">What type of app do you need? *</Label>
                      <Select value={formData.appType} onValueChange={(value) => handleInputChange("appType", value)} required>
                        <SelectTrigger id="appType">
                          <SelectValue placeholder="Select app type" />
                        </SelectTrigger>
                        <SelectContent>
                          {appTypes.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="budget">Budget Range</Label>
                        <Select value={formData.budget} onValueChange={(value) => handleInputChange("budget", value)}>
                          <SelectTrigger id="budget">
                            <SelectValue placeholder="Select budget" />
                          </SelectTrigger>
                          <SelectContent>
                            {budgetRanges.map((range) => (
                              <SelectItem key={range.value} value={range.value}>
                                {range.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="timeline">Timeline</Label>
                        <Select value={formData.timeline} onValueChange={(value) => handleInputChange("timeline", value)}>
                          <SelectTrigger id="timeline">
                            <SelectValue placeholder="When to start" />
                          </SelectTrigger>
                          <SelectContent>
                            {timelines.map((t) => (
                              <SelectItem key={t.value} value={t.value}>
                                {t.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Tell us about your app idea *</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => handleInputChange("description", e.target.value)}
                        placeholder="Describe your app idea, the problem it solves, and any specific features you have in mind..."
                        rows={4}
                        required
                      />
                    </div>

                    <Button
                      type="submit"
                      size="lg"
                      className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          Request Free Consultation
                          <ArrowRight className="ml-2 w-4 h-4" />
                        </>
                      )}
                    </Button>

                    <p className="text-xs text-center text-muted-foreground">
                      By submitting, you agree to our privacy policy. We'll never spam or share your info.
                    </p>
                  </form>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* What We Build Section */}
        <section className="py-20 bg-muted/30">
          <div className="container">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Pittsburgh's Full-Service App Development
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                From mobile apps to enterprise SaaS platforms, we build applications that drive real business results.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, i) => {
                const Icon = feature.icon
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="p-6 rounded-xl bg-card border border-border hover:border-orange-500/50 transition-all group"
                  >
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-lg font-bold mb-1">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.desc}</p>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-20">
          <div className="container">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Trusted by Pittsburgh Businesses
              </h2>
              <p className="text-lg text-muted-foreground">
                See what our clients say about working with RocketOpp.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="p-6 rounded-xl bg-card border border-border"
                >
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, j) => (
                      <Star key={j} className="w-5 h-5 fill-yellow-500 text-yellow-500" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-6 italic">"{testimonial.quote}"</p>
                  <div>
                    <div className="font-bold">{testimonial.author}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Why Pittsburgh Section - Local SEO */}
        <section className="py-20 bg-muted/30">
          <div className="container">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  Why Choose a Pittsburgh App Developer?
                </h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    <strong className="text-foreground">Local Understanding:</strong> We know Pittsburgh businesses. From the Strip District to Shadyside, we understand the unique challenges and opportunities in our market.
                  </p>
                  <p>
                    <strong className="text-foreground">Face-to-Face Collaboration:</strong> Unlike offshore teams, we're available for in-person meetings, whiteboard sessions, and ongoing partnership.
                  </p>
                  <p>
                    <strong className="text-foreground">Pittsburgh Tech Talent:</strong> Our team draws from CMU, Pitt, and Pittsburgh's thriving tech ecosystem - world-class talent at competitive rates.
                  </p>
                  <p>
                    <strong className="text-foreground">Regional Network:</strong> We've helped Pittsburgh startups, established businesses, and enterprise clients across healthcare, manufacturing, fintech, and more.
                  </p>
                </div>

                <div className="mt-8 p-6 rounded-xl bg-card border border-border">
                  <h3 className="font-bold mb-4 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-orange-500" />
                    Serving Greater Pittsburgh
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Downtown Pittsburgh, Oakland, Shadyside, Squirrel Hill, East Liberty, Strip District, South Side, North Shore, Lawrenceville, Bloomfield, Mt. Lebanon, Sewickley, Cranberry Township, and all surrounding areas.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="aspect-[4/3] rounded-xl overflow-hidden bg-gradient-to-br from-orange-500/20 to-red-500/20 flex items-center justify-center">
                    <Code2 className="w-16 h-16 text-orange-500/50" />
                  </div>
                  <div className="aspect-square rounded-xl overflow-hidden bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center">
                    <Database className="w-16 h-16 text-purple-500/50" />
                  </div>
                </div>
                <div className="space-y-4 pt-8">
                  <div className="aspect-square rounded-xl overflow-hidden bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center">
                    <Cpu className="w-16 h-16 text-blue-500/50" />
                  </div>
                  <div className="aspect-[4/3] rounded-xl overflow-hidden bg-gradient-to-br from-green-500/20 to-emerald-500/20 flex items-center justify-center">
                    <Sparkles className="w-16 h-16 text-green-500/50" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20">
          <div className="container">
            <div className="max-w-4xl mx-auto bg-gradient-to-br from-orange-500/10 to-red-500/10 rounded-2xl p-8 md:p-12 border border-orange-500/20 text-center">
              <Rocket className="w-16 h-16 text-orange-500 mx-auto mb-6" />
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Build Your App?</h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                Join 200+ Pittsburgh businesses that have transformed their ideas into powerful applications with RocketOpp.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Button size="lg" asChild className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600">
                  <a href="#top">
                    Start Your Project
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </a>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="tel:+18788881230">
                    <Phone className="mr-2 w-4 h-4" />
                    Call Jessica AI
                  </Link>
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
