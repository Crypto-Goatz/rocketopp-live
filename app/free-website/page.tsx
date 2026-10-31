import type { Metadata } from "next"
import { FreeWebsiteLanding } from "@/components/free-website/free-website-landing"

/** The free-website offer at its own address (for ads and links); the homepage is the same page, so this one points to it as canonical. */
export const metadata: Metadata = {
  title: { absolute: "A Free Website for Your Service Business | RocketOpp" },
  description: "No purchase necessary. Book a free consultation — if we're a good fit, we build your small business a website for free. The only cost is our lead management tool, $49/month.",
  alternates: { canonical: "https://rocketopp.com" },
}

export default function FreeWebsitePage() {
  return <FreeWebsiteLanding />
}
