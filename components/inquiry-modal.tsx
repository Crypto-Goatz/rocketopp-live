"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRouter } from "next/navigation"

interface InquiryModalProps {
  isOpen: boolean
  onClose: () => void
  selectedApp: string | null
}

const services = [
  "AI-Powered CRM",
  "Website Design",
  "SEO Services",
  "Conversion Optimization",
  "App Development",
  "AI Integration",
  "AI for Business",
  "Automation",
  "PPC Advertising",
  "Social Media Marketing",
  "Content Marketing",
]

export function InquiryModal({ isOpen, onClose, selectedApp }: InquiryModalProps) {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    service: "",
    project: "",
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleNext = () => {
    setStep(2)
  }

  const handleSendDetails = async () => {
    const webhookUrl = process.env.NEXT_PUBLIC_INQUIRY_WEBHOOK_URL
    if (webhookUrl) {
      try {
        await fetch(webhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...formData, selectedApp }),
        })
      } catch (error) {
        console.error("[v0] Failed to send to inquiry webhook:", error)
      }
    }

    const params = new URLSearchParams({
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      service: formData.service,
      project: formData.project,
      app: selectedApp || "",
    })
    router.push(`/inquiry-thank-you?${params.toString()}`)
    onClose()
    resetForm()
  }

  const handleStartAssessment = async () => {
    const inquiryWebhookUrl = process.env.NEXT_PUBLIC_INQUIRY_WEBHOOK_URL
    if (inquiryWebhookUrl) {
      try {
        await fetch(inquiryWebhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...formData, selectedApp }),
        })
      } catch (error) {
        console.error("[v0] Failed to send to inquiry webhook:", error)
      }
    }

    const params = new URLSearchParams({
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      service: formData.service,
      project: formData.project,
      app: selectedApp || "",
    })
    router.push(`/assessment-timeline?${params.toString()}`)
    onClose()
    resetForm()
  }

  const resetForm = () => {
    setStep(1)
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      service: "",
      project: "",
    })
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-background rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">{step === 1 ? "Start Your Inquiry" : "Tell Us About Your Project"}</h2>
              <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
                <X className="h-6 w-6" />
              </button>
            </div>

            {selectedApp && (
              <div className="mb-4 p-3 bg-primary/10 rounded-lg border border-primary/20">
                <p className="text-sm text-muted-foreground">Inquiring about:</p>
                <p className="font-semibold text-primary">{selectedApp}</p>
              </div>
            )}

            {step === 1 && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange("firstName", e.target.value)}
                      placeholder="John"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange("lastName", e.target.value)}
                      placeholder="Doe"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="john@company.com"
                  />
                </div>

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
                  <Label htmlFor="service">Service Interested In</Label>
                  <Select value={formData.service} onValueChange={(value) => handleInputChange("service", value)}>
                    <SelectTrigger id="service">
                      <SelectValue placeholder="Select a service" />
                    </SelectTrigger>
                    <SelectContent>
                      {services.map((service) => (
                        <SelectItem key={service} value={service}>
                          {service}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button onClick={handleNext} className="w-full" disabled={!formData.firstName || !formData.email}>
                  Next <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="project">Tell us about your project</Label>
                  <Textarea
                    id="project"
                    value={formData.project}
                    onChange={(e) => handleInputChange("project", e.target.value)}
                    placeholder="Describe your project goals, challenges, and what you're looking to achieve..."
                    rows={6}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Button onClick={handleSendDetails} variant="outline" className="w-full bg-transparent">
                    Send Details
                  </Button>
                  <Button onClick={handleStartAssessment} className="w-full">
                    Start Assessment
                  </Button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
