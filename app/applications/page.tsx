import type { Metadata } from "next"
import ApplicationsPageClient from "./ApplicationsPageClient"

export const metadata: Metadata = {
  title: "Applications Portfolio",
  description:
    "Explore our portfolio of custom-built AI-powered applications. From enterprise CRMs to automation solutions, see what we've built for businesses like yours.",
  openGraph: {
      images: [{ url: 'https://rocketopp.com/api/og?title=Applications%20Portfolio&eyebrow=RocketOpp', width: 1200, height: 630, alt: "Applications Portfolio" }],
    title: "Applications Portfolio | RocketOpp",
    description: "Explore our portfolio of custom-built AI-powered applications",
    type: "website",
  },
}

export default function ApplicationsPage() {
  return <ApplicationsPageClient />
}
