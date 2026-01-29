import type { Metadata } from "next"
import AiIntegrationClientPage from "./AiIntegrationClientPage"
import { Breadcrumbs, breadcrumbPaths } from "@/components/seo/breadcrumbs"
import { TestimonialsSection } from "@/components/seo/testimonials"
import { FAQSchema } from "@/components/seo/json-ld"
import Footer from "@/components/footer"

export const metadata: Metadata = {
  title: "AI for Business | AI Integration Services | Enterprise AI Solutions | RocketOpp",
  description:
    "Transform your business with AI integration services from RocketOpp. 25+ years experience implementing AI for business automation, chatbots, machine learning, and intelligent workflows. Trusted by Fortune 500 companies. Get your free AI assessment today.",
  keywords: [
    "AI for business",
    "AI integration for business",
    "business AI solutions",
    "enterprise AI integration",
    "AI automation",
    "machine learning for business",
    "AI chatbots",
    "intelligent automation",
    "AI consulting",
    "business process automation",
    "AI implementation",
    "artificial intelligence services",
  ],
  openGraph: {
    title: "AI for Business | Enterprise AI Integration Services | RocketOpp",
    description:
      "Transform your business operations with AI. 25+ years of experience integrating OpenAI, Slack, Microsoft, and custom AI solutions. 500+ successful implementations. Free AI readiness assessment.",
    type: "website",
    url: "https://rocketopp.com/services/ai-integration",
    images: [
      {
        url: "/photorealistic-astronaut-with-ai-neural-network.jpg",
        width: 1200,
        height: 630,
        alt: "AI Integration Services - RocketOpp",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AI for Business | Enterprise AI Integration | RocketOpp",
    description:
      "500+ successful AI implementations. OpenAI, Slack, Microsoft integrations. Free AI readiness assessment.",
  },
  alternates: {
    canonical: "https://rocketopp.com/services/ai-integration",
  },
}

const aiIntegrationFAQs = [
  {
    question: "What AI technologies do you integrate?",
    answer: "We integrate all major AI platforms including OpenAI (GPT-4, Claude), custom machine learning models, natural language processing, computer vision, and conversational AI. We work with AWS, Google Cloud, Azure, and specialized AI providers."
  },
  {
    question: "How long does AI integration typically take?",
    answer: "Simple chatbot or AI assistant integrations can be deployed in 1-2 weeks. More complex enterprise integrations typically take 4-8 weeks depending on scope, data requirements, and existing infrastructure."
  },
  {
    question: "Do I need technical expertise to use AI after integration?",
    answer: "No. We design AI systems that are user-friendly and require no technical knowledge to operate. We also provide training and ongoing support to ensure your team can maximize the value of your AI investment."
  },
  {
    question: "What ROI can I expect from AI integration?",
    answer: "Most clients see ROI within 3-6 months. Common benefits include 40-70% reduction in manual tasks, 24/7 customer support capability, faster response times, and improved accuracy in data processing and decision-making."
  },
  {
    question: "Is my data secure with AI integration?",
    answer: "Absolutely. We implement enterprise-grade security including encryption, access controls, and compliance with GDPR, HIPAA, and other regulations. Your data never leaves your control without explicit permission."
  }
]

export default function AiIntegrationPage() {
  return (
    <>
      <FAQSchema items={aiIntegrationFAQs} />

      {/* Breadcrumbs */}
      <div className="container mx-auto px-4 pt-8">
        <Breadcrumbs items={breadcrumbPaths.aiIntegration} />
      </div>

      <AiIntegrationClientPage />

      {/* Testimonials filtered to AI services */}
      <TestimonialsSection
        title="AI Integration Success Stories"
        subtitle="See how businesses are transforming with our AI solutions"
        filterByService="AI Integration"
        maxItems={4}
      />

      <Footer />
    </>
  )
}
