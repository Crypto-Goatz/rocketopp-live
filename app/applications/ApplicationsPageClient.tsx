"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { InquiryModal } from "@/components/inquiry-modal"
import Footer from "@/components/footer"

const applications = [
  {
    id: 1,
    title: "Enterprise CRM Pro",
    excerpt: "Custom AI-powered CRM built for a Fortune 500 company, handling 100K+ customer interactions daily.",
    image: "/enterprise-crm-dashboard-with-analytics.jpg",
  },
  {
    id: 2,
    title: "Healthcare Scheduling AI",
    excerpt: "Intelligent appointment management system reducing no-shows by 45% using predictive analytics.",
    image: "/medical-scheduling-calendar-interface.jpg",
  },
  {
    id: 3,
    title: "E-Commerce Optimizer",
    excerpt: "Self-optimizing product recommendation engine that increased conversion rates by 78% in 90 days.",
    image: "/ecommerce-product-recommendation-system.jpg",
  },
  {
    id: 4,
    title: "Manufacturing Workflow Hub",
    excerpt: "End-to-end automation platform managing inventory, production, and quality control for 15 facilities.",
    image: "/manufacturing-workflow-automation-dashboard.jpg",
  },
  {
    id: 5,
    title: "Real Estate Portal",
    excerpt: "AI-driven property matching system connecting buyers with their ideal properties using machine learning.",
    image: "/real-estate-property-search-portal.jpg",
  },
  {
    id: 6,
    title: "Financial Analytics Suite",
    excerpt: "Comprehensive financial reporting and forecasting platform processing millions in transactions daily.",
    image: "/financial-analytics-dashboard-charts.jpg",
  },
  {
    id: 7,
    title: "Education LMS",
    excerpt: "Learning management system with adaptive AI tutoring serving 50,000+ students across 12 institutions.",
    image: "/education-learning-management-system.jpg",
  },
  {
    id: 8,
    title: "Restaurant Chain Manager",
    excerpt:
      "Multi-location restaurant management system handling orders, inventory, and staff scheduling in real-time.",
    image: "/restaurant-management-system-interface.png",
  },
  {
    id: 9,
    title: "Legal Document AI",
    excerpt:
      "Contract analysis and generation platform reducing legal review time from days to hours with 99.7% accuracy.",
    image: "/legal-document-analysis-interface.jpg",
  },
]

export default function ApplicationsPageClient() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedApp, setSelectedApp] = useState<string | null>(null)

  const handleInquiry = (appTitle: string) => {
    setSelectedApp(appTitle)
    setIsModalOpen(true)
  }

  return (
    <>
      <main className="min-h-screen pt-8 pb-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Application Portfolio</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Explore real-world solutions we've built for businesses across industries. Each application is
              custom-designed to solve specific challenges and drive measurable results.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {applications.map((app, index) => (
              <motion.div
                key={app.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full flex flex-col hover:shadow-lg transition-shadow">
                  <div className="relative h-48 overflow-hidden rounded-t-lg">
                    <img src={app.image || "/placeholder.svg"} alt={app.title} className="w-full h-full object-cover" />
                  </div>
                  <CardHeader>
                    <CardTitle className="text-xl">{app.title}</CardTitle>
                    <CardDescription className="line-clamp-3">{app.excerpt}</CardDescription>
                  </CardHeader>
                  <CardContent className="mt-auto">
                    <Button onClick={() => handleInquiry(app.title)} className="w-full">
                      Inquiry
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
      <InquiryModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} selectedApp={selectedApp} />
    </>
  )
}
