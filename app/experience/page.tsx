import type { Metadata } from "next"
import ExperiencePageClient from "./ExperiencePageClient"

export const metadata: Metadata = {
  title: "23 Years of Digital Excellence",
  description:
    "RocketOpp has been building for the web since 2003. See our portfolio, the work we've shipped, and how we approach web design, development and AI systems.",
  keywords:
    "web design portfolio, digital agency experience, website development portfolio, western pennsylvania web agency",
  openGraph: {
      images: [{ url: 'https://rocketopp.com/api/og?title=23%20Years%20of%20Digital%20Excellence&eyebrow=RocketOpp', width: 1200, height: 630, alt: "23 Years of Digital Excellence" }],
    title: "23 Years of Digital Excellence | RocketOpp Experience",
    description:
      "Building for the web since 2003. See our portfolio and how we work.",
    type: "website",
  },
}

export default function ExperiencePage() {
  return <ExperiencePageClient />
}
