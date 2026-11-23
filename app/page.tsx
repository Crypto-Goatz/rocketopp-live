import type { Metadata } from "next"
import { OrganizationSchema, WebsiteSchema, LocalBusinessSchema } from "@/components/seo/json-ld"
import { FreeWebsiteLanding } from "@/components/free-website/free-website-landing"

/**
 * THE HOMEPAGE IS THE WEBSITE OFFER (Mike, 2026-10-31; 2026-11-23: custom websites + free CRM, year-end price revealed by form): "we want to simply begin helping small businesses get off the
 * ground, particularly in the service industry." The previous homepage (the AI-agency pitch, the $497 offer video, the stat
 * strips) is in git history before this commit. Metadata is set here, not through withCro9Meta, because the stored CRO9 meta
 * for "/" still describes the old pitch.
 */
const TITLE = "Custom Small Business Website — Year-End Price | RocketOpp"
const DESCRIPTION =
  "Custom-built small business websites — not a template — with a free CRM for your customers and leads. One flat year-end price through December 31, the lowest we've offered. Fill out your details to reveal the price."

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: "https://rocketopp.com" },
  openGraph: {
    type: "website", locale: "en_US", url: "https://rocketopp.com", siteName: "RocketOpp", title: TITLE, description: DESCRIPTION,
    images: [{ url: "https://rocketopp.com/images/rocketopp-og.png", width: 1200, height: 630, alt: "RocketOpp — custom small business websites" }],
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION, site: "@rocketopp", creator: "@rocketopp" },
  robots: { index: true, follow: true },
}

export default function HomePage() {
  return (
    <>
      <OrganizationSchema
        description="Custom websites for small service businesses, with a free CRM for customers and leads."
        sameAs={["https://twitter.com/rocketopp", "https://linkedin.com/company/rocketopp", "https://github.com/rocketopp"]}
      />
      <WebsiteSchema description="A custom website for your service business. Book a free consultation." />
      <LocalBusinessSchema description="Custom websites for small service businesses, with a free CRM for customers and leads." />
      <FreeWebsiteLanding />
    </>
  )
}
