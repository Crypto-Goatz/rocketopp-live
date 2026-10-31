import type { Metadata } from "next"
import { withCro9Meta } from "@/lib/cro9-meta"
import { ServicePage } from "@/components/services/service-page"

/** Rebuilt 2026-10-31 on the shared service template (components/services/service-page.tsx, content in lib/services/main.ts). */
const metadataBase: Metadata = {
  title: "PPC Management — AI-Optimized Google, Meta & LinkedIn Ads",
  description:
    "Paid ads managed by AI, optimized by CRO9. Google, Meta, LinkedIn, X, TikTok — one team, real ROI, no long-term contracts.",
  keywords: [
    "PPC management cost",
    "Google Ads management pricing",
    "Meta Ads management",
    "LinkedIn Ads agency",
    "AI PPC optimization",
    "AI ad management",
    "paid search management",
    "ROI-focused PPC",
    "small business PPC",
    "PPC agency pricing 2026",
    "automated bid management",
    "AI media buying",
    "TikTok ads management",
    "RocketOpp PPC",
    "CRO9 ads",
  ],
  openGraph: {
      images: [{ url: 'https://rocketopp.com/api/og?title=PPC%20Management%20%E2%80%94%20AI-Optimized&eyebrow=Services', width: 1200, height: 630, alt: "PPC Management — AI-Optimized" }],
    title: "PPC Management — AI-Optimized | RocketOpp",
    description: "Google + Meta + LinkedIn + TikTok, managed by one team with AI in the loop.",
    url: "https://rocketopp.com/services/ppc-management",
    type: "website",
  },
  alternates: { canonical: "https://rocketopp.com/services/ppc-management" },
}

export async function generateMetadata(): Promise<Metadata> {
  return withCro9Meta('/services/ppc-management', metadataBase)
}

export default function Page() {
  return <ServicePage slug="ppc-management" />
}
