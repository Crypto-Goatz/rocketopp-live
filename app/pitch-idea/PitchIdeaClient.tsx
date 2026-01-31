"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
  Lightbulb,
  Shield,
  Handshake,
  Rocket,
  CheckCircle,
  ArrowRight,
  Star,
  Zap,
  Clock,
  Users,
  Award,
  Phone,
  Mail,
  Brain,
  Lock,
  FileSignature,
  MessageSquare,
  TrendingUp,
  Target,
  Sparkles,
  Building2,
  DollarSign,
  PieChart,
  Calendar,
  Send,
  BadgeCheck
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Footer from "@/components/footer"
import Link from "next/link"

const ideaStages = [
  { value: "concept", label: "Just an idea / Concept" },
  { value: "research", label: "Done some research" },
  { value: "wireframes", label: "Have wireframes or mockups" },
  { value: "specs", label: "Have detailed specifications" },
  { value: "prototype", label: "Have a prototype/MVP" },
  { value: "existing", label: "Have an existing product to improve" },
]

const partnershipTypes = [
  { value: "equity", label: "Equity Partnership (we build for stake)" },
  { value: "revenue", label: "Revenue Share Agreement" },
  { value: "cofounder", label: "Co-Founder Arrangement" },
  { value: "custom", label: "Custom Development (I pay for development)" },
  { value: "unsure", label: "Not sure - let's discuss options" },
]

const industries = [
  { value: "ai", label: "AI / Machine Learning" },
  { value: "saas", label: "SaaS / Business Software" },
  { value: "healthcare", label: "Healthcare / MedTech" },
  { value: "fintech", label: "FinTech / Finance" },
  { value: "ecommerce", label: "E-Commerce / Retail" },
  { value: "education", label: "Education / EdTech" },
  { value: "productivity", label: "Productivity / Automation" },
  { value: "social", label: "Social / Community" },
  { value: "entertainment", label: "Entertainment / Media" },
  { value: "other", label: "Other" },
]

const processSteps = [
  {
    icon: Send,
    title: "Submit Your Idea",
    description: "Fill out our secure form with your basic information. No detailed idea description required yet.",
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: FileSignature,
    title: "Sign Our NDA",
    description: "We send you a mutual NDA before any detailed discussions. Your idea is legally protected.",
    color: "from-purple-500 to-pink-500",
  },
  {
    icon: MessageSquare,
    title: "Discovery Call",
    description: "We schedule a call to learn about your vision, goals, and what success looks like for you.",
    color: "from-orange-500 to-red-500",
  },
  {
    icon: TrendingUp,
    title: "Evaluation & Proposal",
    description: "Our team evaluates feasibility and market potential, then presents partnership options.",
    color: "from-green-500 to-emerald-500",
  },
]

const whyUs = [
  {
    icon: Brain,
    title: "AI-First Expertise",
    description: "We specialize in AI and machine learning applications. If your idea involves AI, we're the perfect partner.",
  },
  {
    icon: Rocket,
    title: "Proven Track Record",
    description: "200+ apps built, multiple successful launches, and deep experience across industries.",
  },
  {
    icon: Handshake,
    title: "True Partnerships",
    description: "We're not just developers - we become invested partners who want your success as much as you do.",
  },
  {
    icon: Zap,
    title: "Speed to Market",
    description: "Our agile process gets MVPs launched in 8-12 weeks. We move fast without sacrificing quality.",
  },
]

const partnershipModels = [
  {
    icon: PieChart,
    title: "Equity Partnership",
    description: "We invest our development resources in exchange for equity. Perfect for ideas with high growth potential.",
    features: ["No upfront costs", "Shared risk & reward", "Long-term alignment", "Active co-development"],
    highlight: true,
  },
  {
    icon: DollarSign,
    title: "Revenue Share",
    description: "We build your app with no or reduced upfront costs in exchange for a percentage of revenue.",
    features: ["Lower initial investment", "Pay as you earn", "Aligned incentives", "Ongoing support included"],
    highlight: false,
  },
  {
    icon: Building2,
    title: "Custom Development",
    description: "Traditional development where you own 100% of the product. Best for funded startups.",
    features: ["Full ownership", "Fixed or hourly pricing", "Defined scope", "Clear deliverables"],
    highlight: false,
  },
]

const faqs = [
  {
    question: "How do I submit my app idea to RocketOpp?",
    answer: "Simply fill out our secure submission form with your basic contact information and a brief description of your idea. We'll schedule a call to discuss further details after you've signed our NDA for complete protection of your concept.",
  },
  {
    question: "Will my app idea be protected with an NDA?",
    answer: "Absolutely. Before any detailed discussions about your app idea, we provide a mutual NDA (Non-Disclosure Agreement) for you to review and sign. Your intellectual property protection is our top priority.",
  },
  {
    question: "What kind of app ideas is RocketOpp interested in?",
    answer: "We're particularly interested in AI-powered applications, SaaS platforms, automation tools, and innovative mobile apps. We evaluate ideas based on market potential, technical feasibility, and alignment with our expertise. We welcome ideas at any stage - from napkin sketches to detailed specifications.",
  },
  {
    question: "Do you offer partnership opportunities for app ideas?",
    answer: "Yes! We offer several partnership models including equity partnerships, revenue sharing agreements, and co-founder arrangements. If your idea has strong potential and aligns with our vision, we may invest our development resources in exchange for a stake in the project.",
  },
  {
    question: "How long does it take to hear back after submitting an idea?",
    answer: "We review every submission within 48-72 hours. If your idea shows promise, we'll reach out to schedule an initial consultation call. Even if we can't pursue a partnership, we provide feedback and may suggest alternative paths forward.",
  },
  {
    question: "What if I don't have technical skills - can I still pitch an idea?",
    answer: "Absolutely! Some of the best ideas come from people who understand a problem deeply but lack technical expertise. We handle all technical aspects of development. What we look for is a clear problem statement, understanding of your target market, and passion for the solution.",
  },
]

const stats = [
  { value: "200+", label: "Apps Built", icon: Rocket },
  { value: "48hr", label: "Response Time", icon: Clock },
  { value: "100%", label: "NDA Protected", icon: Shield },
  { value: "15+", label: "Active Partnerships", icon: Handshake },
]

export default function PitchIdeaClient() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    company: "",
    ideaStage: "",
    industry: "",
    partnershipType: "",
    briefDescription: "",
    targetMarket: "",
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
      const response = await fetch("/api/leads/pitch-idea", {
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
            <div className="w-24 h-24 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-500/30">
              <CheckCircle className="w-12 h-12 text-green-500" />
            </div>
            <h1 className="text-4xl font-bold mb-4">Idea Received!</h1>
            <p className="text-xl text-muted-foreground mb-6">
              Thanks, {formData.firstName}! Your idea submission has been received and is now in our review queue.
            </p>
            <div className="bg-card rounded-xl border border-border p-6 mb-8 text-left">
              <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-orange-500" />
                What Happens Next
              </h2>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>You'll receive an email confirmation within 5 minutes</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Our team reviews your submission within 48-72 hours</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>We'll send you our NDA to review and sign</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Once signed, we'll schedule a discovery call to discuss your idea in detail</span>
                </li>
              </ul>
            </div>
            <p className="text-muted-foreground mb-8">
              Can't wait? Call us directly at{" "}
              <a href="tel:+18788881238" className="text-primary font-semibold hover:underline">
                (878) 888-1238
              </a>
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="/">
                  Return Home
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/services">Explore Our Services</Link>
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
        <section className="relative py-20 lg:py-32 overflow-hidden" id="top">
          {/* Background Effects */}
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 via-transparent to-purple-500/5" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(249,115,22,0.15),transparent)]" />

          {/* Grid Pattern */}
          <div
            className="absolute inset-0 opacity-[0.02]"
            style={{
              backgroundImage: `linear-gradient(to right, currentColor 1px, transparent 1px),
                                linear-gradient(to bottom, currentColor 1px, transparent 1px)`,
              backgroundSize: "60px 60px",
            }}
          />

          {/* Floating Elements */}
          <div className="absolute top-20 left-10 w-72 h-72 bg-orange-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-orange-500/5 rounded-full blur-3xl" />

          <div className="container relative">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-orange-500/10 to-purple-500/10 border border-orange-500/20 mb-6">
                  <Lightbulb className="w-4 h-4 text-orange-500" />
                  <span className="text-sm font-medium">We're Actively Seeking Innovative Ideas</span>
                </div>

                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight hero-description">
                  Submit Your{" "}
                  <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                    App Idea
                  </span>
                  <br />
                  <span className="text-3xl md:text-4xl lg:text-5xl">We Build Dreams Into Reality</span>
                </h1>

                <p className="text-xl text-muted-foreground mb-8 leading-relaxed hero-description">
                  Have a brilliant app idea? We're looking for visionary partners. Submit your concept for a free evaluation.
                  <strong className="text-foreground"> NDA protection guaranteed</strong> before any detailed discussions.
                  We're especially motivated to partner on <strong className="text-foreground">AI applications</strong>.
                </p>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  {stats.map((stat, i) => {
                    const Icon = stat.icon
                    return (
                      <div key={i} className="text-center p-4 rounded-lg bg-card/50 border border-border/50 backdrop-blur-sm">
                        <Icon className="w-5 h-5 mx-auto mb-2 text-orange-500" />
                        <div className="text-2xl font-bold">{stat.value}</div>
                        <div className="text-xs text-muted-foreground">{stat.label}</div>
                      </div>
                    )
                  })}
                </div>

                {/* Trust Badges */}
                <div className="flex flex-wrap items-center gap-6 text-sm">
                  <div className="flex items-center gap-2 text-green-500">
                    <Lock className="w-4 h-4" />
                    <span className="font-medium">NDA Protected</span>
                  </div>
                  <div className="flex items-center gap-2 text-blue-500">
                    <Clock className="w-4 h-4" />
                    <span className="font-medium">48hr Response</span>
                  </div>
                  <div className="flex items-center gap-2 text-purple-500">
                    <Handshake className="w-4 h-4" />
                    <span className="font-medium">Partnership Options</span>
                  </div>
                </div>

                {/* Phone CTA */}
                <div className="mt-8 p-4 rounded-xl bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/20">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center flex-shrink-0">
                      <Phone className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Prefer to talk? Schedule a call with us</p>
                      <a href="tel:+18788881238" className="text-2xl font-bold text-primary hover:underline">
                        (878) 888-1238
                      </a>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Form */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <div className="bg-card rounded-2xl border border-border shadow-2xl p-8 relative overflow-hidden">
                  {/* Form Glow Effect */}
                  <div className="absolute -top-20 -right-20 w-40 h-40 bg-orange-500/20 rounded-full blur-3xl" />

                  <div className="relative">
                    <div className="text-center mb-6">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-500 text-sm mb-4">
                        <BadgeCheck className="w-4 h-4" />
                        Free Evaluation
                      </div>
                      <h2 className="text-2xl font-bold mb-2">Pitch Your Idea</h2>
                      <p className="text-muted-foreground">We review every submission personally</p>
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
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange("email", e.target.value)}
                          placeholder="john@example.com"
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
                            placeholder="(555) 123-4567"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="company">Company (if any)</Label>
                          <Input
                            id="company"
                            value={formData.company}
                            onChange={(e) => handleInputChange("company", e.target.value)}
                            placeholder="Your Company"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="industry">Industry / Category *</Label>
                        <Select value={formData.industry} onValueChange={(value) => handleInputChange("industry", value)} required>
                          <SelectTrigger id="industry">
                            <SelectValue placeholder="Select industry" />
                          </SelectTrigger>
                          <SelectContent>
                            {industries.map((ind) => (
                              <SelectItem key={ind.value} value={ind.value}>
                                {ind.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="ideaStage">Idea Stage</Label>
                          <Select value={formData.ideaStage} onValueChange={(value) => handleInputChange("ideaStage", value)}>
                            <SelectTrigger id="ideaStage">
                              <SelectValue placeholder="Select stage" />
                            </SelectTrigger>
                            <SelectContent>
                              {ideaStages.map((stage) => (
                                <SelectItem key={stage.value} value={stage.value}>
                                  {stage.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="partnershipType">Partnership Interest</Label>
                          <Select value={formData.partnershipType} onValueChange={(value) => handleInputChange("partnershipType", value)}>
                            <SelectTrigger id="partnershipType">
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                              {partnershipTypes.map((type) => (
                                <SelectItem key={type.value} value={type.value}>
                                  {type.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="briefDescription">Brief Description *</Label>
                        <Textarea
                          id="briefDescription"
                          value={formData.briefDescription}
                          onChange={(e) => handleInputChange("briefDescription", e.target.value)}
                          placeholder="Give us a high-level overview. Don't worry - we'll sign an NDA before discussing details."
                          rows={3}
                          required
                        />
                        <p className="text-xs text-muted-foreground">Keep it brief - we'll get into details after the NDA is signed.</p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="targetMarket">Who is this for?</Label>
                        <Input
                          id="targetMarket"
                          value={formData.targetMarket}
                          onChange={(e) => handleInputChange("targetMarket", e.target.value)}
                          placeholder="e.g., Small business owners, healthcare providers, etc."
                        />
                      </div>

                      <Button
                        type="submit"
                        size="lg"
                        className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-lg h-14"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                            Submitting...
                          </>
                        ) : (
                          <>
                            <Lightbulb className="mr-2 w-5 h-5" />
                            Submit My Idea
                            <ArrowRight className="ml-2 w-5 h-5" />
                          </>
                        )}
                      </Button>

                      <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                        <Lock className="w-3 h-3" />
                        <span>Your information is secure and never shared</span>
                      </div>
                    </form>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-20 bg-muted/30">
          <div className="container">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                How We Protect & Evaluate Your Idea
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Your intellectual property is precious. Here's our proven process for secure idea evaluation.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {processSteps.map((step, i) => {
                const Icon = step.icon
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="relative"
                  >
                    {i < processSteps.length - 1 && (
                      <div className="hidden lg:block absolute top-12 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-border to-transparent" />
                    )}
                    <div className="p-6 rounded-xl bg-card border border-border hover:border-orange-500/50 transition-all h-full">
                      <div className="flex items-center gap-4 mb-4">
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${step.color} flex items-center justify-center shadow-lg`}>
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-sm font-bold">
                          {i + 1}
                        </div>
                      </div>
                      <h3 className="text-lg font-bold mb-2">{step.title}</h3>
                      <p className="text-sm text-muted-foreground">{step.description}</p>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </section>

        {/* NDA Emphasis Section */}
        <section className="py-20">
          <div className="container">
            <div className="max-w-4xl mx-auto">
              <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-2xl p-8 md:p-12 border border-green-500/20">
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-500 text-sm mb-4">
                      <Shield className="w-4 h-4" />
                      Your Protection Guaranteed
                    </div>
                    <h2 className="text-3xl font-bold mb-4">NDA Before Any Details</h2>
                    <p className="text-muted-foreground mb-6">
                      We understand the value of your intellectual property. That's why we <strong className="text-foreground">never</strong> ask for
                      detailed specifications until you've reviewed and signed our mutual Non-Disclosure Agreement.
                    </p>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>Mutual NDA protects both parties</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>Your idea remains your property</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>Legal protection before detailed discussions</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>Industry-standard confidentiality terms</span>
                      </li>
                    </ul>
                  </div>
                  <div className="flex justify-center">
                    <div className="relative">
                      <div className="w-48 h-48 rounded-full bg-gradient-to-br from-green-500/20 to-emerald-500/20 flex items-center justify-center">
                        <FileSignature className="w-24 h-24 text-green-500" />
                      </div>
                      <div className="absolute -top-4 -right-4 w-16 h-16 rounded-full bg-card border-2 border-green-500 flex items-center justify-center">
                        <Lock className="w-8 h-8 text-green-500" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Partnership Models */}
        <section className="py-20 bg-muted/30">
          <div className="container">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Partnership Models That Work For You
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                We're flexible. Whether you want to bootstrap with equity or have funding for custom development, we have options.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {partnershipModels.map((model, i) => {
                const Icon = model.icon
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className={`p-8 rounded-2xl border transition-all ${
                      model.highlight
                        ? "bg-gradient-to-br from-orange-500/10 to-red-500/10 border-orange-500/30 shadow-lg shadow-orange-500/10"
                        : "bg-card border-border hover:border-orange-500/30"
                    }`}
                  >
                    {model.highlight && (
                      <div className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-orange-500/20 text-orange-500 text-xs font-medium mb-4">
                        <Star className="w-3 h-3 fill-current" />
                        Most Popular
                      </div>
                    )}
                    <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 ${
                      model.highlight
                        ? "bg-gradient-to-br from-orange-500 to-red-500"
                        : "bg-muted"
                    }`}>
                      <Icon className={`w-7 h-7 ${model.highlight ? "text-white" : "text-primary"}`} />
                    </div>
                    <h3 className="text-xl font-bold mb-3">{model.title}</h3>
                    <p className="text-muted-foreground mb-6">{model.description}</p>
                    <ul className="space-y-2">
                      {model.features.map((feature, j) => (
                        <li key={j} className="flex items-center gap-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Why RocketOpp */}
        <section className="py-20">
          <div className="container">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 mb-6">
                <Brain className="w-4 h-4 text-purple-500" />
                <span className="text-sm font-medium">AI-First Development Team</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Why Partner With RocketOpp?
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                We're not just developers - we're entrepreneurs who understand what it takes to build successful products.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {whyUs.map((item, i) => {
                const Icon = item.icon
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="p-6 rounded-xl bg-card border border-border hover:border-purple-500/50 transition-all group"
                  >
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </motion.div>
                )
              })}
            </div>

            {/* AI Focus Callout */}
            <div className="mt-12 max-w-3xl mx-auto">
              <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-xl p-6 border border-purple-500/20 text-center">
                <Sparkles className="w-10 h-10 text-purple-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">We're Especially Excited About AI Ideas</h3>
                <p className="text-muted-foreground">
                  Our team specializes in artificial intelligence, machine learning, and automation. If your idea involves AI -
                  chatbots, predictive analytics, natural language processing, or intelligent automation - we're highly motivated
                  to explore partnership opportunities.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQs */}
        <section className="py-20 bg-muted/30">
          <div className="container">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Everything you need to know about submitting your app idea.
              </p>
            </div>

            <div className="max-w-3xl mx-auto space-y-4">
              {faqs.map((faq, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="p-6 bg-card rounded-xl border border-border hover:border-orange-500/30 transition-all"
                >
                  <h3 className="font-bold mb-3 flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    {faq.question}
                  </h3>
                  <p className="text-muted-foreground pl-8">{faq.answer}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-20">
          <div className="container">
            <div className="max-w-4xl mx-auto bg-gradient-to-br from-orange-500/10 to-red-500/10 rounded-2xl p-8 md:p-12 border border-orange-500/20 text-center relative overflow-hidden">
              {/* Background Decoration */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-red-500/10 rounded-full blur-3xl" />

              <div className="relative">
                <Lightbulb className="w-16 h-16 text-orange-500 mx-auto mb-6" />
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Share Your Vision?</h2>
                <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                  The next great app could be yours. Submit your idea today and let's explore what we can build together.
                </p>
                <div className="flex flex-wrap gap-4 justify-center mb-8">
                  <Button size="lg" asChild className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-lg h-14 px-8">
                    <a href="#top">
                      <Lightbulb className="mr-2 w-5 h-5" />
                      Submit Your Idea
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </a>
                  </Button>
                  <Button size="lg" variant="outline" asChild className="text-lg h-14 px-8">
                    <a href="tel:+18788881238">
                      <Phone className="mr-2 w-5 h-5" />
                      Call (878) 888-1238
                    </a>
                  </Button>
                </div>
                <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-green-500" />
                    <span>NDA Protected</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-blue-500" />
                    <span>48hr Response</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Handshake className="w-4 h-4 text-purple-500" />
                    <span>Partnership Ready</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
