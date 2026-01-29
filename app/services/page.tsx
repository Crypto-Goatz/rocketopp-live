import type { Metadata } from "next"
import Footer from "@/components/footer"
import ServicesPageClient from "./ServicesPageClient"
import { Breadcrumbs, breadcrumbPaths } from "@/components/seo/breadcrumbs"
import { TestimonialsSection } from "@/components/seo/testimonials"
import { FAQSchema } from "@/components/seo/json-ld"

export const metadata: Metadata = {
  title: "Our Services | RocketOpp - AI & Automation Solutions",
  description:
    "Explore RocketOpp's comprehensive digital solutions: Website Design, AI Integration, App Development, CRM Automation, and strategic Web Marketing services to elevate your business.",
  keywords: [
    "AI automation services",
    "website design",
    "app development",
    "CRM automation",
    "digital marketing",
    "SEO services",
    "business automation"
  ],
  openGraph: {
    title: "Our Services | RocketOpp",
    description: "Enterprise-level technology solutions at 90% less than industry standard.",
    url: "https://rocketopp.com/services",
    type: "website"
  }
}

// Service FAQs for schema
const serviceFAQs = [
  {
    question: "What services does RocketOpp offer?",
    answer: "RocketOpp offers comprehensive digital solutions including Website Design, AI Integration, App Development, CRM Automation, Digital Marketing, and SEO Services. All our solutions are powered by cutting-edge AI technology."
  },
  {
    question: "How is RocketOpp different from other agencies?",
    answer: "We deliver enterprise-level technology solutions at 90% less than industry standard pricing. Our AI-first approach means faster delivery, smarter automation, and tools that work 24/7 while you sleep."
  },
  {
    question: "Do you offer custom solutions?",
    answer: "Yes, every solution we build is tailored to your specific business needs. We don't do cookie-cutter templates - we create custom AI-powered systems that solve your unique challenges."
  },
  {
    question: "How long does a typical project take?",
    answer: "Project timelines vary based on scope, but our AI-powered development process is significantly faster than traditional agencies. Most websites launch in 2-4 weeks, and automation projects can be deployed in days."
  },
  {
    question: "Do you provide ongoing support?",
    answer: "Absolutely. We offer 24/7 support through our AI assistant Jessica, plus dedicated human support for complex issues. Our automations run continuously and we monitor them proactively."
  }
]

export default function ServicesPage() {
  return (
    <>
      <FAQSchema items={serviceFAQs} />

      {/* Breadcrumbs */}
      <div className="container mx-auto px-4 pt-8">
        <Breadcrumbs items={breadcrumbPaths.services} />
      </div>

      <ServicesPageClient />

      {/* Testimonials Section */}
      <TestimonialsSection
        title="Trusted by Businesses Everywhere"
        subtitle="See what our clients say about our services"
        maxItems={6}
      />

      <Footer />
    </>
  )
}
