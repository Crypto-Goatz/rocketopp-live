import type { Metadata } from "next"
import AiCrmClientPage from "./AiCrmClientPage"

export const metadata: Metadata = {
  title: "AI-Powered CRM | Enterprise Technology for Small Business | RocketOpp",
  description:
    "Custom AI-powered CRM solutions starting at $5,000. Enterprise-level technology at 90% less than industry standard. Fully customized applications with built-in AI for businesses of all sizes.",
  keywords:
    "AI CRM, custom CRM, enterprise CRM, small business CRM, affordable CRM, AI-powered customer relationship management, custom business applications",
  openGraph: {
    title: "AI-Powered CRM - Enterprise Technology Made Affordable",
    description:
      "Custom AI-powered CRM starting at $5,000. We're bringing enterprise technology to small businesses at 90% less than industry standard pricing.",
    type: "website",
  },
}

export default function AiCrmPage() {
  return <AiCrmClientPage />
}
