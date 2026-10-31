import type { Metadata } from "next"
import { withCro9Meta } from "@/lib/cro9-meta"
import { ServicePage } from "@/components/services/service-page"

/** Rebuilt 2026-10-31 on the shared service template (components/services/service-page.tsx, content in lib/services/main.ts). */
const metadataBase: Metadata = {
  title:
    "SXO (Search Experience Optimization) — Process, Results & AI Search Visibility",
  description:
    "SXO replaces SEO for the AI era. Combine search optimization, UX, and conversion in one strategy — powered by CRO9 and the 0n ecosystem. First customer: 82 → 92 score in under 30 days.",
  keywords: [
    "SXO pricing",
    "search experience optimization",
    "SEO is dead",
    "AI SEO 2026",
    "llms.txt service",
    "Living DOM website",
    "AI Overviews optimization",
    "GEO optimization",
    "AEO optimization",
    "ChatGPT visibility",
    "Perplexity citations",
    "Google AI Overviews ranking",
    "SXO vs SEO",
    "RocketOpp SXO",
    "CRO9",
    "0nMCP",
  ],
  openGraph: {
      images: [{ url: 'https://rocketopp.com/api/og?title=SXO%20%E2%80%94%20The%20SEO%20Replacement%20for%20the%20AI%20Era&eyebrow=Services', width: 1200, height: 630, alt: "SXO — The SEO Replacement for the AI Era" }],
    title: "SXO — The SEO Replacement for the AI Era | RocketOpp",
    description:
      "SXO: Search + UX + Conversion + AI engine readiness in one protocol. Powered by CRO9.",
    url: "https://rocketopp.com/services/sxo",
    type: "website",
  },
  alternates: { canonical: "https://rocketopp.com/services/sxo" },
}

export async function generateMetadata(): Promise<Metadata> {
  return withCro9Meta('/services/sxo', metadataBase)
}

export default function Page() {
  return <ServicePage slug="sxo" />
}
