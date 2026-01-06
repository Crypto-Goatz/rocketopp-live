import type { Metadata } from "next"
import ConversionOptimizationClientPage from "./ConversionOptimizationClientPage"

export const metadata: Metadata = {
  title: "Conversion Rate Optimization (CRO) | AI-Powered Self-Optimizing Websites | RocketOpp",
  description:
    "Transform visitors into customers with our AI-powered conversion optimization. Self-optimizing websites that track visitor behavior, automatically adjust content, colors, and layouts for maximum conversions.",
  keywords:
    "conversion rate optimization, CRO, AI optimization, self-optimizing websites, conversion tracking, behavioral analytics, A/B testing, website optimization, user behavior tracking, conversion funnel",
  openGraph: {
    title: "AI-Powered Conversion Rate Optimization | RocketOpp",
    description:
      "Self-optimizing websites that automatically improve conversion rates using advanced AI and behavioral tracking.",
    type: "website",
  },
}

export default function ConversionOptimizationPage() {
  return <ConversionOptimizationClientPage />
}
