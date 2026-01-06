"use client"

import { useEffect, useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Rocket,
  Calendar,
  ClipboardCheck,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  TrendingUp,
  Users,
  Zap,
  Target,
  Loader2,
} from "lucide-react"
import { generatePersonalizedContent } from "@/app/actions/personalized-content-action"
import { Footer } from "@/components/footer"

interface PersonalizedContent {
  headline: string
  subheadline: string
  painPoints: string[]
  solutions: string[]
  benefits: string[]
  cta: string
  industryInsight: string
}

function PersonalizedContent() {
  const searchParams = useSearchParams()
  const [content, setContent] = useState<PersonalizedContent | null>(null)
  const [isGenerating, setIsGenerating] = useState(true)
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null)
  const [loadingMessage, setLoadingMessage] = useState("")

  const firstName = searchParams.get("name") || "Friend"
  const industry = searchParams.get("industry") || ""
  const companyName = searchParams.get("company") || ""
  const wantsStrategy = searchParams.get("strategy") === "true"

  const displayIndustry = industry
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")

  // Loading messages that rotate
  const loadingMessages = [
    `${firstName}, we're crafting a page just for ${companyName || "your business"}...`,
    `Analyzing how AI can transform the ${displayIndustry} industry...`,
    `Building personalized recommendations for ${companyName || "you"}...`,
    `Your custom page will show exactly how AI benefits ${displayIndustry}...`,
    `Almost there! Finalizing your personalized experience...`,
  ]

  useEffect(() => {
    let messageIndex = 0
    const messageInterval = setInterval(() => {
      messageIndex = (messageIndex + 1) % loadingMessages.length
      setLoadingMessage(loadingMessages[messageIndex])
    }, 2500)

    setLoadingMessage(loadingMessages[0])

    return () => clearInterval(messageInterval)
  }, [firstName, companyName, displayIndustry])

  useEffect(() => {
    async function loadContent() {
      try {
        const result = await generatePersonalizedContent({
          firstName,
          industry,
          companyName,
        })
        setContent(result)
        setGeneratedImageUrl(
          `/placeholder.svg?height=600&width=800&query=professional ${displayIndustry} worker using modern technology tablet laptop in office photorealistic`,
        )
      } catch (error) {
        console.error("Failed to generate content:", error)
        setContent({
          headline: `${firstName}, Transform Your ${displayIndustry} Business with AI`,
          subheadline: `Discover how RocketOpp's enterprise-grade solutions can revolutionize ${companyName || "your company"}`,
          painPoints: [
            "Struggling with manual processes that waste hours daily",
            "Losing leads due to slow follow-up times",
            "Competitors using technology you don't have access to",
          ],
          solutions: [
            "AI-powered automation that works 24/7",
            "Instant lead capture and nurturing systems",
            "Enterprise technology at small business prices",
          ],
          benefits: [
            "Save 20+ hours per week on repetitive tasks",
            "Increase conversion rates by up to 300%",
            "Access the same tools Fortune 500 companies use",
          ],
          cta: "Start Your Free AI Assessment",
          industryInsight: `The ${displayIndustry} industry is rapidly evolving, and businesses that embrace AI are seeing 3x faster growth than those who don't.`,
        })
      } finally {
        setIsGenerating(false)
      }
    }

    loadContent()
  }, [firstName, industry, companyName, displayIndustry])

  const trackConversion = (action: string) => {
    try {
      const webhookUrl = process.env.NEXT_PUBLIC_PERSONALIZATION_WEBHOOK_URL
      if (webhookUrl) {
        fetch(webhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            event: "conversion",
            action,
            firstName,
            industry,
            companyName,
            timestamp: new Date().toISOString(),
          }),
        }).catch(() => {})
      }
    } catch {
      // Silently fail
    }
  }

  // Loading State with beautiful animation
  if (isGenerating) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-xl mx-auto px-4"
        >
          {/* Animated Rocket */}
          <motion.div
            animate={{
              y: [0, -20, 0],
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
            className="mb-8"
          >
            <div className="relative w-32 h-32 mx-auto">
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-pulse" />
              <div className="relative w-full h-full flex items-center justify-center">
                <Rocket className="w-16 h-16 text-primary" />
              </div>
            </div>
          </motion.div>

          {/* Loading Spinner */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            className="mb-6"
          >
            <Loader2 className="w-8 h-8 text-primary mx-auto" />
          </motion.div>

          {/* Dynamic Loading Message */}
          <AnimatePresence mode="wait">
            <motion.p
              key={loadingMessage}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-lg text-muted-foreground"
            >
              {loadingMessage}
            </motion.p>
          </AnimatePresence>

          {/* Progress Bar */}
          <div className="mt-8 w-full max-w-xs mx-auto">
            <div className="h-1 bg-muted rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-primary"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 8, ease: "linear" }}
              />
            </div>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1, ease: [0.4, 0, 0.2, 1] }}
      className="min-h-screen bg-background"
    >
      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          {generatedImageUrl && (
            <Image
              src={generatedImageUrl || "/placeholder.svg"}
              alt={`${displayIndustry} professional using technology`}
              fill
              className="object-cover"
              priority
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-background/90 via-background/70 to-background" />
        </div>

        <div className="container relative z-10 px-4 py-20">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="max-w-4xl mx-auto text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6"
            >
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm text-primary font-medium">
                Personalized for {firstName}
                {companyName && ` at ${companyName}`}
              </span>
            </motion.div>

            <h1 className="text-4xl md:text-6xl font-black text-foreground mb-6 leading-tight">{content?.headline}</h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">{content?.subheadline}</p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-8 py-6 text-lg shadow-xl shadow-primary/25"
                onClick={() => trackConversion("assessmentClicked")}
                asChild
              >
                <Link href="/ai-assessment">
                  <ClipboardCheck className="mr-2 h-5 w-5" />
                  Free AI Assessment
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-primary/30 hover:bg-primary/10 font-semibold px-8 py-6 text-lg bg-transparent"
                onClick={() => trackConversion("appointmentClicked")}
                asChild
              >
                <Link href="/contact">
                  <Calendar className="mr-2 h-5 w-5" />
                  Schedule Consultation
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Industry Insight */}
      {content && (
        <section className="py-16 bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5">
          <div className="container px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-3xl mx-auto text-center"
            >
              <TrendingUp className="h-12 w-12 text-primary mx-auto mb-4" />
              <p className="text-xl text-foreground font-medium italic">&ldquo;{content.industryInsight}&rdquo;</p>
            </motion.div>
          </div>
        </section>
      )}

      {/* Pain Points & Solutions */}
      {content && (
        <section className="py-20">
          <div className="container px-4">
            <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
              <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
                <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                  <Target className="h-6 w-6 text-red-500" />
                  Challenges You&apos;re Facing
                </h2>
                <ul className="space-y-4">
                  {content.painPoints.map((point, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      className="flex items-start gap-3 p-4 rounded-lg bg-red-500/5 border border-red-500/10"
                    >
                      <div className="w-2 h-2 rounded-full bg-red-500 mt-2 flex-shrink-0" />
                      <span className="text-muted-foreground">{point}</span>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>

              <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
                <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                  <Zap className="h-6 w-6 text-primary" />
                  Our Solutions for {displayIndustry}
                </h2>
                <ul className="space-y-4">
                  {content.solutions.map((solution, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      className="flex items-start gap-3 p-4 rounded-lg bg-primary/5 border border-primary/10"
                    >
                      <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-foreground">{solution}</span>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            </div>
          </div>
        </section>
      )}

      {/* Benefits */}
      {content && (
        <section className="py-20 bg-muted/30">
          <div className="container px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                What {companyName || "Your Business"} Will Gain
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Real results from real {displayIndustry} businesses using RocketOpp
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {content.benefits.map((benefit, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Card className="h-full bg-background/50 border-primary/10 hover:border-primary/30 transition-colors">
                    <CardContent className="p-6 text-center">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                        <CheckCircle2 className="h-6 w-6 text-primary" />
                      </div>
                      <p className="text-foreground font-medium">{benefit}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CRM Trial CTA */}
      <section className="py-20">
        <div className="container px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <Card className="bg-gradient-to-br from-primary/10 via-background to-primary/5 border-primary/20 overflow-hidden">
              <CardContent className="p-8 md:p-12">
                <div className="flex flex-col md:flex-row items-center gap-8">
                  <div className="flex-1 text-center md:text-left">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 text-primary text-sm font-medium mb-4">
                      <Rocket className="h-4 w-4" />
                      Exclusive Offer for {firstName}
                    </div>
                    <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                      Try Rocket+CRM Free for 14 Days
                    </h3>
                    <p className="text-muted-foreground mb-6">
                      Experience the same AI-powered CRM that&apos;s helping {displayIndustry} businesses increase their
                      revenue by 40%. No credit card required.
                    </p>
                    <Button
                      size="lg"
                      className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-8"
                      onClick={() => trackConversion("crmTrialClicked")}
                      asChild
                    >
                      <Link href="/services/ai-crm">
                        Start Free Trial
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Link>
                    </Button>
                  </div>
                  <div className="flex-shrink-0">
                    <div className="w-32 h-32 rounded-full bg-primary/10 flex items-center justify-center">
                      <Users className="h-16 w-16 text-primary" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* AI Strategy CTA (only if they didn't opt in) */}
      {!wantsStrategy && (
        <section className="py-20 bg-gradient-to-b from-background to-primary/5">
          <div className="container px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-3xl mx-auto text-center"
            >
              <Sparkles className="h-12 w-12 text-primary mx-auto mb-6" />
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Get Your Free AI Marketing Strategy
              </h2>
              <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
                {firstName}, discover exactly how AI can transform {companyName || `your ${displayIndustry} business`}.
                Our experts will create a customized roadmap just for you.
              </p>
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-10 py-6 text-lg"
                onClick={() => trackConversion("assessmentClicked")}
                asChild
              >
                <Link href="/ai-assessment">
                  Get My Free Strategy
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </motion.div>
          </div>
        </section>
      )}

      <Footer />
    </motion.div>
  )
}

export default function PersonalizedPageClient() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
      }
    >
      <PersonalizedContent />
    </Suspense>
  )
}
