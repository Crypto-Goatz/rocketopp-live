import type { Metadata } from "next"
import { Search } from "lucide-react"
import { ServicePageTemplate } from "@/components/order/service-page-template"

export const metadata: Metadata = {
  title: "SEO Optimization Services — RocketOpp",
  description:
    "Traditional SEO that still moves the needle: keyword research, on-page, technical, local. Monthly retainer starting at $797/mo. Audits, content, and link building included.",
  alternates: { canonical: "https://rocketopp.com/services/web-marketing/seo" },
}

export default function SeoPage() {
  return (
    <ServicePageTemplate
      slug="web-marketing-seo"
      Icon={Search}
      headline="SEO that ranks. Period."
      subhead="Keyword research, on-page, technical, local — done by humans who actually know what they're doing, ramped by AI to move 4x faster."
      longDescription="Most agencies will sell you 'SEO' and hand you a spreadsheet of keywords no one searches for. We focus on the queries your buyers actually type, fix the technical debt that's holding you back, and ship content + links every month. You get a monthly report you can read in 5 minutes — what we did, what moved, what's next. No fluff. If you'd rather skip traditional SEO and jump to SXO (the AI-search-aware version), we'll route you there instead."
      features={[
        "Comprehensive technical audit (Core Web Vitals, crawl, schema)",
        "Keyword research with intent + difficulty scoring",
        "On-page optimization across your top 20 pages",
        "Internal-linking strategy + topic clusters",
        "Local SEO (Google Business Profile, citations, reviews)",
        "Monthly link building (white-hat outreach + digital PR)",
        "Monthly written report — what moved, what's next",
        "Slack channel for direct access (no ticket queues)",
      ]}
      outcomes={[
        "Average +47% organic traffic within 90 days on the keywords we target",
        "Top-10 placements on commercial intent queries that drive revenue",
        "Page-load + Core Web Vitals consistently above the green threshold",
        "GSC + GA4 dashboards you can read without us in the room",
      ]}
      faqs={[
        {
          q: "Why do you offer SEO if SXO is the future?",
          a: "Because not every client is ready to rebuild for AI search. Traditional SEO still drives 60-80% of search traffic for most industries. We meet you where you are — and when you're ready, we route you to SXO seamlessly.",
        },
        {
          q: "How long until I see results?",
          a: "Technical fixes show up in 2-4 weeks. Content + ranking lift starts at 60-90 days. Anyone promising you faster than that is either lying or buying spammy backlinks that'll hurt you in 6 months.",
        },
        {
          q: "Do you guarantee rankings?",
          a: "No, and you should run from anyone who does. We guarantee the work — audits, content, links, optimization — and we report on what's working. Google and AI engines decide the rankings.",
        },
        {
          q: "What's the contract like?",
          a: "Month-to-month. No long-term lock-in. Cancel any time. Most clients stay 12+ months because the compounding actually works, but you're not stuck.",
        },
        {
          q: "Can I just buy a one-time audit?",
          a: "Yes — that's our $1,997 SEO Audit + Roadmap. You get the full technical + content audit, a 90-day prioritized roadmap, and a 30-min call to walk through it. Many clients use this to validate they want a retainer first. Add it through the order wizard.",
        },
      ]}
    />
  )
}
