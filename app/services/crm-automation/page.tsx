import type { Metadata } from "next"
import { withCro9Meta } from "@/lib/cro9-meta"
import { ServicePage } from "@/components/services/service-page"

/** Rebuilt 2026-10-31 on the shared service template (components/services/service-page.tsx, content in lib/services/main.ts). */
const metadataBase: Metadata = {
  title: "CRM Setup & Automation — Pipelines, Lead Scoring & Sequences",
  description:
    "Full CRM setup with automated pipelines, AI lead scoring, email + SMS sequences, appointment booking, and revenue reporting. Ships in 1 week.",
  keywords: [
    "CRM setup cost",
    "CRM automation services",
    "CRM implementation 2026",
    "AI lead scoring",
    "automated lead qualification",
    "GoHighLevel setup",
    "HubSpot setup",
    "Salesforce alternative",
    "small business CRM",
    "CRM for service business",
    "AI sales pipeline",
    "automated email sequences",
    "appointment booking automation",
    "CRM data hygiene",
    "RocketOpp CRM",
  ],
  openGraph: {
      images: [{ url: 'https://rocketopp.com/api/og?title=CRM%20Setup%20%26%20Automation&eyebrow=Services', width: 1200, height: 630, alt: "CRM Setup & Automation" }],
    title: "CRM Setup & Automation | RocketOpp",
    description: "Full CRM with AI lead scoring, automated sequences, and appointment booking. Ships in 1 week.",
    url: "https://rocketopp.com/services/crm-automation",
    type: "website",
  },
  alternates: { canonical: "https://rocketopp.com/services/crm-automation" },
}

export async function generateMetadata(): Promise<Metadata> {
  return withCro9Meta('/services/crm-automation', metadataBase)
}

export default function Page() {
  return <ServicePage slug="crm-automation" />
}
