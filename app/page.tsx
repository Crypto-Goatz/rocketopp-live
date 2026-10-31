import type { Metadata } from "next"
import { OrganizationSchema, WebsiteSchema, LocalBusinessSchema } from "@/components/seo/json-ld"
import { FreeWebsiteLanding } from "@/components/free-website/free-website-landing"

/**
 * THE HOMEPAGE IS THE FREE WEBSITE OFFER (Mike, 2026-10-31): "we want to simply begin helping small businesses get off the
 * ground, particularly in the service industry." The previous homepage (the AI-agency pitch, the $497 offer video, the stat
 * strips) is in git history before this commit. Metadata is set here, not through withCro9Meta, because the stored CRO9 meta
 * for "/" still describes the old pitch.
 */
const TITLE = "A Free Website for Your Service Business | RocketOpp"
const DESCRIPTION =
  "No purchase necessary. Book a free consultation — if we're a good fit, we build your small business a website for free. The only cost is our lead management tool for contacts and appointments, $49/month."

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: "https://rocketopp.com" },
  openGraph: {
    type: "website", locale: "en_US", url: "https://rocketopp.com", siteName: "RocketOpp", title: TITLE, description: DESCRIPTION,
    images: [{ url: "https://rocketopp.com/images/rocketopp-og.png", width: 1200, height: 630, alt: "RocketOpp — a free website for your service business" }],
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION, site: "@rocketopp", creator: "@rocketopp" },
  robots: { index: true, follow: true },
}

export default function HomePage() {
  return (
    <>
      <OrganizationSchema
        description="Free websites for small service businesses, with a lead management tool for contacts and appointments."
        sameAs={["https://twitter.com/rocketopp", "https://linkedin.com/company/rocketopp", "https://github.com/rocketopp"]}
      />
      <WebsiteSchema description="A free website for your service business. Book a free consultation." />
      <LocalBusinessSchema description="Free websites for small service businesses, with a lead management tool for contacts and appointments." />
      <FreeWebsiteLanding />
    </>
  )
}
