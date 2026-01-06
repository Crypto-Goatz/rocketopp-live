"use client"

import { useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Footer from "@/components/footer"

const timelineOptions = [
  {
    value: "now",
    label: "Now",
    description: "Ready to start immediately",
  },
  {
    value: "30days",
    label: "Within 30 Days",
    description: "Planning to begin this month",
  },
  {
    value: "90days",
    label: "Within 90 Days",
    description: "Looking to start this quarter",
  },
  {
    value: "year",
    label: "Within a Year",
    description: "Exploring options for future implementation",
  },
]

export default function AssessmentTimelinePage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [selectedTimeline, setSelectedTimeline] = useState<string | null>(null)

  const handleSubmit = async () => {
    if (!selectedTimeline) return

    const assessmentWebhookUrl = process.env.NEXT_PUBLIC_ASSESSMENT_WEBHOOK_URL
    if (assessmentWebhookUrl) {
      try {
        await fetch(assessmentWebhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            timeline: selectedTimeline,
            firstName: searchParams.get("firstName"),
            email: searchParams.get("email"),
          }),
        })
      } catch (error) {
        console.error("Failed to send to assessment webhook:", error)
      }
    }

    router.push("/assessment-thank-you")
  }

  return (
    <>
      <main className="min-h-screen pt-8 pb-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl mx-auto"
          >
            <div className="text-center mb-12">
              <Calendar className="h-16 w-16 text-primary mx-auto mb-4" />
              <h1 className="text-4xl font-bold mb-4">When do you want to begin your project?</h1>
              <p className="text-xl text-muted-foreground">
                Help us understand your timeline so we can prepare the best approach for your needs.
              </p>
            </div>

            <div className="space-y-4 mb-8">
              {timelineOptions.map((option) => (
                <Card
                  key={option.value}
                  className={`cursor-pointer transition-all hover:shadow-lg ${
                    selectedTimeline === option.value ? "border-primary border-2 bg-primary/5" : ""
                  }`}
                  onClick={() => setSelectedTimeline(option.value)}
                >
                  <CardContent className="p-6 flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold mb-1">{option.label}</h3>
                      <p className="text-sm text-muted-foreground">{option.description}</p>
                    </div>
                    <div
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        selectedTimeline === option.value ? "border-primary bg-primary" : "border-muted-foreground"
                      }`}
                    >
                      {selectedTimeline === option.value && <div className="w-3 h-3 rounded-full bg-white" />}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Button onClick={handleSubmit} disabled={!selectedTimeline} size="lg" className="w-full">
              Complete Assessment
            </Button>
          </motion.div>
        </div>
      </main>
      <Footer />
    </>
  )
}
