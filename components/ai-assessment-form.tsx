"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { usePersonalizationStore, type Industry, type PrimaryNeed } from "@/lib/personalization-store"
import { sendPersonalizationEmail } from "@/app/actions/send-email-action"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

const industries: { value: Industry; label: string }[] = [
  { value: "construction", label: "Construction" },
  { value: "e-commerce", label: "eCommerce" },
  { value: "financial-services", label: "Financial Services" },
  { value: "automotive-services", label: "Automotive Services" },
  { value: "day-spa", label: "Day Spa" },
  { value: "family-lawyers", label: "Family Lawyers" },
  { value: "franchise-businesses", label: "Franchise Businesses" },
  { value: "general-contractors", label: "General Contractors" },
  { value: "general-practitioners", label: "General Practitioners" },
  { value: "healthcare", label: "Healthcare" },
  { value: "home-services", label: "Home Services" },
  { value: "insurance-companies", label: "Insurance Companies" },
  { value: "lawncare-services", label: "Lawncare Services" },
  { value: "manufacturing", label: "Manufacturing" },
  { value: "professional-painting", label: "Professional Painting" },
  { value: "real-estate", label: "Real Estate" },
  { value: "retail-shop", label: "Retail Shop" },
  { value: "social-influencers", label: "Social Influencers" },
  { value: "telemedicine-services", label: "Telemedicine Services" },
  { value: "trucking-logistics", label: "Trucking & Logistics" },
  { value: "other", label: "Other" },
]

const primaryNeeds: { value: PrimaryNeed; label: string }[] = [
  { value: "website-help", label: "Website Help" },
  { value: "online-marketing", label: "Online Marketing" },
  { value: "automating-tasks", label: "Automating Tasks" },
  { value: "customer-management", label: "Customer Management" },
  { value: "leads-sales", label: "Leads & Sales" },
  { value: "app-development", label: "App Development" },
  { value: "ai-integration", label: "AI Integration" },
]

export default function AiAssessmentForm() {
  const store = usePersonalizationStore()
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)

    try {
      // Validate required fields
      if (
        !store.userName ||
        !store.userEmail ||
        !store.userPhone ||
        !store.userTitle ||
        !store.companyName ||
        !store.industry ||
        !store.zipCode ||
        !store.primaryNeed
      ) {
        throw new Error("Please fill in all required fields")
      }

      // Send email with form data
      const emailResult = await sendPersonalizationEmail({
        userName: store.userName,
        userEmail: store.userEmail,
        userPhone: store.userPhone,
        userTitle: store.userTitle,
        companyName: store.companyName,
        industry: store.getIndustryDisplayName(store.industry),
        zipCode: store.zipCode,
        primaryNeed: store.primaryNeed,
        hasWebsite: store.hasWebsite,
        websiteAddress: store.websiteAddress || undefined,
      })

      if (!emailResult.success) {
        throw new Error(emailResult.message)
      }

      // Navigate to AI assessment page
      router.push("/ai-assessment")
    } catch (err) {
      console.error("Failed to submit form:", err)
      setError(err instanceof Error ? err.message : "An unexpected error occurred")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>AI-Powered Business Assessment</CardTitle>
        <CardDescription>
          Help us understand your business so we can provide personalized recommendations.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && <div className="p-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">{error}</div>}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="userName">Your Name *</Label>
              <Input
                id="userName"
                value={store.userName || ""}
                onChange={(e) => store.setUserName(e.target.value)}
                placeholder="John Doe"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="userTitle">Your Title *</Label>
              <Input
                id="userTitle"
                value={store.userTitle || ""}
                onChange={(e) => store.setUserTitle(e.target.value)}
                placeholder="CEO, Manager, etc."
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="companyName">Company Name *</Label>
            <Input
              id="companyName"
              value={store.companyName || ""}
              onChange={(e) => store.setCompanyName(e.target.value)}
              placeholder="Your Company Name"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="userEmail">Email Address *</Label>
              <Input
                id="userEmail"
                type="email"
                value={store.userEmail || ""}
                onChange={(e) => store.setUserEmail(e.target.value)}
                placeholder="john@company.com"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="userPhone">Phone Number *</Label>
              <Input
                id="userPhone"
                type="tel"
                value={store.userPhone || ""}
                onChange={(e) => store.setUserPhone(e.target.value)}
                placeholder="(555) 123-4567"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="industry">Industry *</Label>
              <Select value={store.industry || ""} onValueChange={(value) => store.setIndustry(value as Industry)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your industry" />
                </SelectTrigger>
                <SelectContent>
                  {industries.map((industry) => (
                    <SelectItem key={industry.value} value={industry.value}>
                      {industry.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="zipCode">Zip Code *</Label>
              <Input
                id="zipCode"
                value={store.zipCode || ""}
                onChange={(e) => store.setZipCode(e.target.value)}
                placeholder="12345"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Primary Need *</Label>
            <RadioGroup
              value={store.primaryNeed || ""}
              onValueChange={(value) => store.setPrimaryNeed(value as PrimaryNeed)}
              className="grid grid-cols-1 md:grid-cols-2 gap-2"
            >
              {primaryNeeds.map((need) => (
                <div key={need.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={need.value} id={need.value} />
                  <Label htmlFor={need.value} className="text-sm">
                    {need.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label>Do you currently have a website?</Label>
            <RadioGroup
              value={store.hasWebsite ? "yes" : "no"}
              onValueChange={(value) => store.setHasWebsite(value === "yes")}
              className="flex space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="website-yes" />
                <Label htmlFor="website-yes">Yes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="website-no" />
                <Label htmlFor="website-no">No</Label>
              </div>
            </RadioGroup>
          </div>

          {store.hasWebsite && (
            <div className="space-y-2">
              <Label htmlFor="websiteAddress">Website Address</Label>
              <Input
                id="websiteAddress"
                type="url"
                value={store.websiteAddress || ""}
                onChange={(e) => store.setWebsiteAddress(e.target.value)}
                placeholder="https://yourwebsite.com"
              />
            </div>
          )}

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating Your Assessment...
              </>
            ) : (
              "Generate AI Assessment"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
