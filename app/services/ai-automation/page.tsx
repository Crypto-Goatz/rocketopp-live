import type { Metadata } from "next"
import { withCro9Meta } from "@/lib/cro9-meta"
import { ServicePage } from "@/components/services/service-page"

/** Rebuilt 2026-10-31 on the shared service template (components/services/service-page.tsx, content in lib/services/main.ts). */
const metadataBase: Metadata = {
  title: "AI Business Automation — Workflows, Agents & Ops Automation",
  description:
    "Custom AI automation systems built on 0nMCP. Replace 5-10 manual workflows with AI agents that run 24/7 — from lead qualification to customer support to content production. Ships in 2 weeks.",
  keywords: [
    "AI business automation",
    "workflow automation services",
    "AI agents for business",
    "custom AI automation",
    "AI agent development",
    "business process automation",
    "AI-powered automation",
    "0nMCP automation",
    "RPA replacement",
    "intelligent automation",
    "no-code automation",
    "AI customer service",
    "AI lead qualification",
    "AI ops automation",
    "AI for SMB",
    "build an AI agent",
  ],
  openGraph: {
      images: [{ url: 'https://rocketopp.com/api/og?title=AI%20Business%20Automation%20%E2%80%94%20Custom%20AI%20Systems&eyebrow=Services', width: 1200, height: 630, alt: "AI Business Automation — Custom AI Systems" }],
    title: "AI Business Automation — Custom AI Systems | RocketOpp",
    description: "AI agents that actually execute. 5-10 workflows automated. Powered by 0nMCP and 1,640+ tools.",
    url: "https://rocketopp.com/services/ai-automation",
    type: "website",
  },
  alternates: { canonical: "https://rocketopp.com/services/ai-automation" },
}

export async function generateMetadata(): Promise<Metadata> {
  return withCro9Meta('/services/ai-automation', metadataBase)
}

export default function Page() {
  return <ServicePage slug="ai-automation" />
}
