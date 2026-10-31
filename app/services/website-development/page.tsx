import type { Metadata } from "next"
import { withCro9Meta } from "@/lib/cro9-meta"
import { ServicePage } from "@/components/services/service-page"

/** Rebuilt 2026-10-31 on the shared service template (components/services/service-page.tsx, content in lib/services/main.ts). */
const metadataBase: Metadata = {
  title: "Website Development — What's Included & How We Build",
  description:
    "Free websites for small service businesses, after a free consultation. Custom websites built with AI, launched in 2 weeks. Mobile-first, SEO-optimized, conversion-focused. See what's included.",
  keywords: [
    "cost for website design",
    "website development pricing",
    "how much does a website cost",
    "professional website cost",
    "custom website development",
    "affordable website design",
    "Next.js website development",
    "responsive web design cost",
    "e-commerce website pricing",
    "website development agency",
  ],
  openGraph: {
      images: [{ url: 'https://rocketopp.com/api/og?title=Website%20Development%20%E2%80%94%20What%27s%20Included&eyebrow=Services', width: 1200, height: 630, alt: "Website Development — What's Included" }],
    title: "Website Development — What's Included | RocketOpp",
    description: "Free websites for small service businesses. Launched in 2 weeks. See exactly what's included.",
    url: "https://rocketopp.com/services/website-development",
  },
  alternates: { canonical: "https://rocketopp.com/services/website-development" },
}

export async function generateMetadata(): Promise<Metadata> {
  return withCro9Meta('/services/website-development', metadataBase)
}

export default function Page() {
  return <ServicePage slug="website-development" />
}
