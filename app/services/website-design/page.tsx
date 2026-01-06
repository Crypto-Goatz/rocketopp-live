import type { Metadata } from "next"
import WebsiteDesignClientPage from "./WebsiteDesignClientPage"

export const metadata: Metadata = {
  title: "Professional Website Design & Development | Rocket Opp",
  description:
    "Rocket Opp creates stunning, high-performing, SEO-optimized, and responsive websites tailored to elevate your brand and engage your audience.",
}

export default function WebsiteDesignPage() {
  return <WebsiteDesignClientPage />
}
