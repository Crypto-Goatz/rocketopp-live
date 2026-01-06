import type { Metadata } from "next"
import AiIntegrationClientPage from "./AiIntegrationClientPage"

export const metadata: Metadata = {
  title: "AI for Business | AI Integration Services | Enterprise AI Solutions | Rocket Opp",
  description:
    "Transform your business with AI integration services from Rocket Opp. 25+ years experience implementing AI for business automation, chatbots, machine learning, and intelligent workflows. Trusted by Fortune 500 companies. Get your free AI assessment today.",
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
    title: "AI for Business | Enterprise AI Integration Services | Rocket Opp",
    description:
      "Transform your business operations with AI. 25+ years of experience integrating OpenAI, Slack, Microsoft, and custom AI solutions. 500+ successful implementations. Free AI readiness assessment.",
    type: "website",
    url: "https://rocketopp.com/services/ai-integration",
    images: [
      {
        url: "/photorealistic-astronaut-with-ai-neural-network.jpg",
        width: 1200,
        height: 630,
        alt: "AI Integration Services - Rocket Opp",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AI for Business | Enterprise AI Integration | Rocket Opp",
    description:
      "500+ successful AI implementations. OpenAI, Slack, Microsoft integrations. Free AI readiness assessment.",
  },
  alternates: {
    canonical: "https://rocketopp.com/services/ai-integration",
  },
}

export default function AiIntegrationPage() {
  return <AiIntegrationClientPage />
}
