import type { Metadata } from "next"
import { FreeWebsiteLanding } from "@/components/free-website/free-website-landing"

/** The website offer at its own address (URL kept from the old free-website offer for links and SEO) (for ads and links); the homepage is the same page, so this one points to it as canonical. */
export const metadata: Metadata = {
  title: { absolute: "Custom Small Business Website — Year-End Price | RocketOpp" },
  description: "Custom-built small business websites — not a template — with a free CRM for your customers and leads. One flat year-end price through December 31. Fill out your details to reveal the price.",
  alternates: { canonical: "https://rocketopp.com" },
}

export default function FreeWebsitePage() {
  return <FreeWebsiteLanding />
}
