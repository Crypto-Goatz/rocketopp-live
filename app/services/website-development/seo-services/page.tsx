import type { Metadata } from "next"
import SeoServicesClientPage from "./SeoServicesClientPage"

export const metadata: Metadata = {
  title: "Professional SEO Services | Search Engine Optimization | RocketOpp",
  description:
    "Expert SEO services that drive organic traffic, improve search rankings, and grow your business. Technical SEO, content optimization, and proven strategies for sustainable growth.",
  keywords: [
    "SEO services",
    "search engine optimization",
    "technical SEO",
    "local SEO",
    "SEO audit",
    "keyword research",
    "link building",
    "on-page SEO",
    "off-page SEO",
    "SEO strategy",
  ].join(", "),
  openGraph: {
    title: "Professional SEO Services | RocketOpp",
    description: "Drive organic traffic and improve search rankings with expert SEO strategies.",
    type: "website",
  },
}

export default function SeoServicesPage() {
  return <SeoServicesClientPage />
}
