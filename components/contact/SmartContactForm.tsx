"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { ArrowRight, ArrowLeft, CheckCircle2, Loader2, Sparkles, Calendar } from "lucide-react"
import { cn } from "@/lib/utils"

// CRO tracking event types
type CROEvent = {
  type: "form_view" | "step_start" | "step_complete" | "field_focus" | "field_blur" | "form_submit" | "form_abandon" | "booking_shown"
  step?: number
  field?: string
  value?: string
  timestamp: number
  sessionId: string
  variant?: string
}

// Form step configuration - AI can modify these
interface FormStep {
  id: string
  title: string
  subtitle: string
  fields: FormField[]
}

interface FormField {
  id: string
  type: "text" | "email" | "tel" | "textarea" | "select" | "chips"
  label: string
  placeholder: string
  required: boolean
  options?: { value: string; label: string }[]
}

// Default form configuration
const defaultFormSteps: FormStep[] = [
  {
    id: "intro",
    title: "Let's get started",
    subtitle: "Tell us a bit about yourself",
    fields: [
      { id: "name", type: "text", label: "Your Name", placeholder: "John Smith", required: true },
      { id: "email", type: "email", label: "Email Address", placeholder: "john@company.com", required: true },
    ],
  },
  {
    id: "project",
    title: "What brings you here?",
    subtitle: "Select all that apply",
    fields: [
      {
        id: "interest",
        type: "chips",
        label: "I'm interested in",
        placeholder: "",
        required: true,
        options: [
          { value: "ai-automation", label: "AI & Automation" },
          { value: "web-development", label: "Web Development" },
          { value: "crm-integration", label: "CRM Integration" },
          { value: "consulting", label: "Strategy Consulting" },
          { value: "other", label: "Something Else" },
        ],
      },
    ],
  },
  {
    id: "details",
    title: "Tell us more",
    subtitle: "A brief description helps us prepare",
    fields: [
      {
        id: "message",
        type: "textarea",
        label: "Project Details",
        placeholder: "What are you looking to build or improve? Any specific challenges you're facing?",
        required: false,
      },
    ],
  },
  {
    id: "timeline",
    title: "What's your timeline?",
    subtitle: "When are you looking to get started?",
    fields: [
      {
        id: "timeline",
        type: "chips",
        label: "Timeline",
        placeholder: "",
        required: true,
        options: [
          { value: "asap", label: "ASAP" },
          { value: "1-2-weeks", label: "1-2 Weeks" },
          { value: "1-month", label: "Within a Month" },
          { value: "exploring", label: "Just Exploring" },
        ],
      },
    ],
  },
]

// Generate session ID for tracking
const generateSessionId = () => {
  if (typeof window !== "undefined") {
    let sessionId = sessionStorage.getItem("cro_session_id")
    if (!sessionId) {
      sessionId = `cro_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      sessionStorage.setItem("cro_session_id", sessionId)
    }
    return sessionId
  }
  return `cro_${Date.now()}`
}

interface SmartContactFormProps {
  variant?: string
  onComplete?: (data: Record<string, string | string[]>) => void
}

export function SmartContactForm({ variant = "default", onComplete }: SmartContactFormProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState<Record<string, string | string[]>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const [showBooking, setShowBooking] = useState(false)
  const [sessionId] = useState(generateSessionId)
  const [formSteps] = useState<FormStep[]>(defaultFormSteps)

  // Track CRO event
  const trackEvent = useCallback(async (event: Omit<CROEvent, "timestamp" | "sessionId" | "variant">) => {
    const fullEvent: CROEvent = {
      ...event,
      timestamp: Date.now(),
      sessionId,
      variant,
    }

    // Send to CRO endpoint
    try {
      await fetch("/api/cro/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(fullEvent),
      })
    } catch (e) {
      // Silent fail for tracking
    }

    // Also track in analytics if available
    if (typeof window !== "undefined" && (window as any).gtag) {
      (window as any).gtag("event", event.type, {
        step: event.step,
        field: event.field,
        variant,
      })
    }
  }, [sessionId, variant])

  // Track form view on mount
  useEffect(() => {
    trackEvent({ type: "form_view" })
    trackEvent({ type: "step_start", step: 0 })
  }, [trackEvent])

  // Track abandonment on unmount
  useEffect(() => {
    return () => {
      if (!isComplete && currentStep > 0) {
        trackEvent({ type: "form_abandon", step: currentStep })
      }
    }
  }, [isComplete, currentStep, trackEvent])

  const handleFieldChange = (fieldId: string, value: string | string[]) => {
    setFormData((prev) => ({ ...prev, [fieldId]: value }))
  }

  const handleChipToggle = (fieldId: string, chipValue: string) => {
    const current = (formData[fieldId] as string[]) || []
    const updated = current.includes(chipValue)
      ? current.filter((v) => v !== chipValue)
      : [...current, chipValue]
    handleFieldChange(fieldId, updated)
  }

  const isStepValid = () => {
    const step = formSteps[currentStep]
    return step.fields.every((field) => {
      if (!field.required) return true
      const value = formData[field.id]
      if (Array.isArray(value)) return value.length > 0
      return value && value.trim().length > 0
    })
  }

  const handleNext = async () => {
    if (!isStepValid()) return

    trackEvent({ type: "step_complete", step: currentStep })

    if (currentStep < formSteps.length - 1) {
      setCurrentStep((prev) => prev + 1)
      trackEvent({ type: "step_start", step: currentStep + 1 })
    } else {
      // Submit form
      setIsSubmitting(true)
      try {
        await fetch("/api/contact/submit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...formData, sessionId, variant }),
        })
        trackEvent({ type: "form_submit" })
        setIsComplete(true)
        onComplete?.(formData)

        // Show booking after a short delay
        setTimeout(() => {
          setShowBooking(true)
          trackEvent({ type: "booking_shown" })
        }, 1500)
      } catch (e) {
        console.error("Form submission failed:", e)
      } finally {
        setIsSubmitting(false)
      }
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1)
      trackEvent({ type: "step_start", step: currentStep - 1 })
    }
  }

  const renderField = (field: FormField) => {
    switch (field.type) {
      case "chips":
        return (
          <div className="flex flex-wrap gap-2">
            {field.options?.map((option) => {
              const selected = ((formData[field.id] as string[]) || []).includes(option.value)
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleChipToggle(field.id, option.value)}
                  className={cn(
                    "px-4 py-2 rounded-full border-2 text-sm font-medium transition-all",
                    selected
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border hover:border-primary/50 hover:bg-primary/5"
                  )}
                >
                  {option.label}
                </button>
              )
            })}
          </div>
        )
      case "textarea":
        return (
          <Textarea
            id={field.id}
            placeholder={field.placeholder}
            value={(formData[field.id] as string) || ""}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
            onFocus={() => trackEvent({ type: "field_focus", field: field.id, step: currentStep })}
            onBlur={() => trackEvent({ type: "field_blur", field: field.id, step: currentStep })}
            className="min-h-[120px] resize-none"
          />
        )
      default:
        return (
          <Input
            id={field.id}
            type={field.type}
            placeholder={field.placeholder}
            value={(formData[field.id] as string) || ""}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
            onFocus={() => trackEvent({ type: "field_focus", field: field.id, step: currentStep })}
            onBlur={() => trackEvent({ type: "field_blur", field: field.id, step: currentStep })}
          />
        )
    }
  }

  if (isComplete && showBooking) {
    return (
      <div className="space-y-6">
        <Card className="border-2 border-green-500/30 bg-green-500/5">
          <CardContent className="py-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-green-500/10">
                <CheckCircle2 className="h-6 w-6 text-green-500" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Thank you, {formData.name}!</h3>
                <p className="text-muted-foreground text-sm">We'll be in touch within 24 hours.</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-primary/20 shadow-xl shadow-primary/5">
          <CardHeader className="bg-gradient-to-r from-primary/5 to-orange-500/5 border-b border-primary/10">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Calendar className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle>Skip the wait - Book a call now</CardTitle>
                <CardDescription>Get on our calendar for a faster response</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="h-[550px] w-full bg-background">
              <iframe
                src="https://links.rocketclients.com/widget/booking/p4EEMwP9hLoGQ1eF7pv0"
                style={{ width: "100%", height: "100%", border: "none", overflow: "hidden" }}
                scrolling="no"
                id="discovery-call-booking-post-form"
                title="Schedule a Discovery Call"
              ></iframe>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (isComplete) {
    return (
      <Card className="border-2 border-primary/20">
        <CardContent className="py-12 text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 rounded-full bg-primary/10 animate-pulse">
              <Sparkles className="h-8 w-8 text-primary" />
            </div>
          </div>
          <h3 className="font-semibold text-xl mb-2">Processing your request...</h3>
          <p className="text-muted-foreground">One moment while we prepare your next steps.</p>
        </CardContent>
      </Card>
    )
  }

  const step = formSteps[currentStep]
  const progress = ((currentStep + 1) / formSteps.length) * 100

  return (
    <Card className="border-2 border-primary/20 shadow-xl shadow-primary/5 overflow-hidden">
      {/* Progress bar */}
      <div className="h-1 bg-muted">
        <div
          className="h-full bg-gradient-to-r from-primary to-orange-400 transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      <CardHeader className="pb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-muted-foreground font-medium">
            Step {currentStep + 1} of {formSteps.length}
          </span>
          <div className="flex items-center gap-1 text-xs text-primary">
            <Sparkles className="h-3 w-3" />
            <span>AI-Powered</span>
          </div>
        </div>
        <CardTitle className="text-2xl">{step.title}</CardTitle>
        <CardDescription className="text-base">{step.subtitle}</CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {step.fields.map((field) => (
          <div key={field.id} className="space-y-2">
            {field.type !== "chips" && (
              <Label htmlFor={field.id} className="text-sm font-medium">
                {field.label}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </Label>
            )}
            {renderField(field)}
          </div>
        ))}

        <div className="flex items-center justify-between pt-4">
          <Button
            variant="ghost"
            onClick={handleBack}
            disabled={currentStep === 0}
            className={cn(currentStep === 0 && "invisible")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>

          <Button
            onClick={handleNext}
            disabled={!isStepValid() || isSubmitting}
            className="bg-gradient-to-r from-primary to-orange-500 hover:from-primary/90 hover:to-orange-500/90"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Submitting...
              </>
            ) : currentStep === formSteps.length - 1 ? (
              <>
                Submit
                <CheckCircle2 className="h-4 w-4 ml-2" />
              </>
            ) : (
              <>
                Continue
                <ArrowRight className="h-4 w-4 ml-2" />
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
