import type { Metadata } from "next"
import ExperiencePageClient from "./ExperiencePageClient"

export const metadata: Metadata = {
  title: "25+ Years of Digital Excellence | RocketOpp Experience",
  description:
    "RocketOpp has been building for the web since 1999. See our portfolio, the work we've shipped, and how we approach web design, development and AI systems.",
  keywords:
    "web design portfolio, digital agency experience, website development portfolio, western pennsylvania web agency",
  openGraph: {
    title: "25+ Years of Digital Excellence | RocketOpp Experience",
    description:
      "Building for the web since 1999. See our portfolio and how we work.",
    type: "website",
  },
}

export default function ExperiencePage() {
  return <ExperiencePageClient />
}
