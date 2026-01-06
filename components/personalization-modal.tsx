"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, ArrowRight, Sparkles, Rocket, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { usePersonalizationStore, industryOptionsForSelect, type Industry } from "@/lib/personalization-store"
import { useRouter } from "next/navigation"

interface PersonalizationModalProps {
  isOpen: boolean
  onClose: () => void
}

type Step = "intro" | "company"

export function PersonalizationModal({ isOpen, onClose }: PersonalizationModalProps) {
  const [step, setStep] = useState<Step>("intro")
  const [firstName, setFirstName] = useState("")
  const [industry, setIndustry] = useState<Industry>(null)
  const [companyName, setCompanyName] = useState("")
  const [wantsStrategy, setWantsStrategy] = useState(false)
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const router = useRouter()

  const {
    setUserName,
    setIndustry: storeSetIndustry,
    setCompanyName: storeSetCompanyName,
    setUserEmail,
  } = usePersonalizationStore()

  const handleNextFromIntro = () => {
    if (!firstName || !industry) return
    setStep("company")
  }

  const handleSubmit = async () => {
    if (wantsStrategy && !email) return

    setIsSubmitting(true)

    // Store personalization data
    setUserName(firstName)
    storeSetIndustry(industry)
    storeSetCompanyName(companyName || null)
    if (email) setUserEmail(email)

    // Send to webhook (non-blocking)
    try {
      const webhookUrl = process.env.NEXT_PUBLIC_PERSONALIZATION_WEBHOOK_URL
      if (webhookUrl && webhookUrl.trim() !== "") {
        fetch(webhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            firstName,
            industry,
            companyName: companyName || null,
            email: email || null,
            wantsAiStrategy: wantsStrategy,
            timestamp: new Date().toISOString(),
            source: "personalization-modal",
          }),
        }).catch(() => {})
      }
    } catch {
      // Silently fail
    }

    const params = new URLSearchParams({
      name: firstName,
      industry: industry || "",
      company: companyName,
      strategy: String(wantsStrategy),
      email: email || "",
    })

    handleClose()
    router.push(`/personalized?${params.toString()}`)
  }

  const handleClose = () => {
    setStep("intro")
    setFirstName("")
    setIndustry(null)
    setCompanyName("")
    setWantsStrategy(false)
    setEmail("")
    onClose()
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
        style={{ isolation: "isolate" }}
      >
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          onClick={handleClose}
        />

        {/* Modal Content */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="relative w-full max-w-lg bg-background border border-border rounded-2xl shadow-2xl overflow-visible z-[9999]"
        >
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-muted transition-colors z-10"
          >
            <X className="h-5 w-5 text-muted-foreground" />
          </button>

          <AnimatePresence mode="wait">
            {step === "intro" && (
              <motion.div
                key="intro"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="p-8"
              >
                <div className="text-center mb-8">
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, repeatDelay: 2 }}
                    className="inline-block mb-4"
                  >
                    <Rocket className="h-12 w-12 text-primary" />
                  </motion.div>
                  <h2 className="text-2xl font-bold text-foreground mb-2">Let&apos;s Personalize Your Experience</h2>
                  <p className="text-muted-foreground">Tell us a bit about yourself for tailored recommendations</p>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-foreground">
                      What&apos;s your first name?
                    </Label>
                    <Input
                      id="firstName"
                      placeholder="Enter your first name"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="bg-muted/50 border-border"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="industry" className="text-foreground">
                      What industry are you in?
                    </Label>
                    <Select value={industry || ""} onValueChange={(val) => setIndustry(val as Industry)}>
                      <SelectTrigger className="bg-muted/50 border-border">
                        <SelectValue placeholder="Select your industry" />
                      </SelectTrigger>
                      <SelectContent
                        className="z-[99999] bg-background border border-border"
                        position="popper"
                        sideOffset={4}
                      >
                        {industryOptionsForSelect.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <Button
                    onClick={handleNextFromIntro}
                    disabled={!firstName || !industry}
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-6"
                  >
                    Next
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </div>
              </motion.div>
            )}

            {step === "company" && (
              <motion.div
                key="company"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="p-8"
              >
                <div className="text-center mb-8">
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                    className="inline-block mb-4"
                  >
                    <Sparkles className="h-12 w-12 text-primary" />
                  </motion.div>
                  <h2 className="text-2xl font-bold text-foreground mb-2">Almost there, {firstName}!</h2>
                  <p className="text-muted-foreground">Just a couple more details</p>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="companyName" className="text-foreground">
                      Company Name <span className="text-muted-foreground">(optional)</span>
                    </Label>
                    <Input
                      id="companyName"
                      placeholder="Enter your company name"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      className="bg-muted/50 border-border"
                    />
                  </div>

                  {/* AI Strategy CTA */}
                  <div className="p-4 rounded-xl bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20">
                    <div className="flex items-start gap-3">
                      <Checkbox
                        id="aiStrategy"
                        checked={wantsStrategy}
                        onCheckedChange={(checked) => setWantsStrategy(checked as boolean)}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <Label htmlFor="aiStrategy" className="text-foreground font-medium cursor-pointer">
                          Get an AI-Powered Marketing Strategy FREE
                        </Label>
                        <p className="text-sm text-muted-foreground mt-1">
                          Receive a personalized AI assessment for your business
                        </p>
                      </div>
                    </div>

                    <AnimatePresence>
                      {wantsStrategy && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="mt-4 space-y-2">
                            <Label htmlFor="email" className="text-foreground flex items-center gap-2">
                              <Mail className="h-4 w-4 text-primary" />
                              Where should we send your personalized assessment?
                            </Label>
                            <Input
                              id="email"
                              type="email"
                              placeholder="your@email.com"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              className="bg-background/50 border-primary/30"
                              required
                            />
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <Button
                    onClick={handleSubmit}
                    disabled={isSubmitting || (wantsStrategy && !email)}
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-6"
                  >
                    {isSubmitting ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                      >
                        <Rocket className="h-5 w-5" />
                      </motion.div>
                    ) : (
                      <>
                        Generate My Page
                        <Rocket className="ml-2 h-5 w-5" />
                      </>
                    )}
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
