import type { Metadata } from "next"
import WebsiteDesignClientPage from "./WebsiteDesignClientPage"

import { withCro9Meta } from '@/lib/cro9-meta'
const metadataBase: Metadata = {
  title: "Professional Website Design & Development | Rocket Opp",
  description:
    "Rocket Opp creates stunning, high-performing, SEO-optimized, and responsive websites tailored to elevate your brand and engage your audience.",
}

export async function generateMetadata(): Promise<Metadata> {
  return withCro9Meta('/services/website-design', metadataBase)
}

export default function WebsiteDesignPage() {
  return <WebsiteDesignClientPage />
}
