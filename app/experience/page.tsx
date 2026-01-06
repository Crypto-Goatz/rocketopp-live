import type { Metadata } from "next"
import ExperiencePageClient from "./ExperiencePageClient"

export const metadata: Metadata = {
  title: "25+ Years of Digital Excellence | RocketOpp Experience & Testimonials",
  description:
    "Discover why businesses trust RocketOpp with 25+ years of proven results. Read client testimonials, view our award-winning portfolio, and see the websites we've built.",
  keywords:
    "web development testimonials, digital agency reviews, website design portfolio, award winning web agency, client success stories",
  openGraph: {
    title: "25+ Years of Digital Excellence | RocketOpp Experience",
    description:
      "Trusted by hundreds of businesses. See our testimonials, awards, and portfolio of successful projects.",
    type: "website",
  },
}

export default function ExperiencePage() {
  return <ExperiencePageClient />
}
