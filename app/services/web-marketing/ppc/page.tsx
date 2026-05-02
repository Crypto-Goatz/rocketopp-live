import type { Metadata } from "next"
import { BarChart3 } from "lucide-react"
import { ServicePageTemplate } from "@/components/order/service-page-template"

export const metadata: Metadata = {
  title: "PPC Management — Google, Meta, LinkedIn Ads — RocketOpp",
  description:
    "AI-managed paid ads on Google, Meta, and LinkedIn. CRO9-optimized landing pages. Real ROI tracking, weekly reports. Starting at $797/mo management fee.",
  alternates: { canonical: "https://rocketopp.com/services/web-marketing/ppc" },
}

export default function PpcPage() {
  return (
    <ServicePageTemplate
      slug="web-marketing-ppc"
      Icon={BarChart3}
      headline="Paid ads, run by an AI that doesn't sleep."
      subhead="Single-platform PPC management starting at $797/mo. We handle Google, Meta, or LinkedIn — pick one, scale when ready."
      longDescription="This is the lean version of our PPC service: one platform, dialed in. Most businesses don't need the full multi-platform bundle on day one — they need ONE channel that's actually profitable. Our AI manages bids and budgets in real time. CRO9 tests landing-page variants automatically. You get a weekly Slack message with what changed and what to do next. The day your CAC drops below your target, we tell you to spend more. The day it spikes, we tell you to pause."
      features={[
        "Choose one platform: Google, Meta (Facebook + Instagram), or LinkedIn",
        "AI bid management + automatic budget reallocation",
        "CRO9 landing-page A/B testing per campaign",
        "GA4 + Meta Pixel + LinkedIn Insight tracking setup",
        "Audience research + persona-based segmentation",
        "Creative refresh every 2 weeks (image, copy, hook)",
        "Weekly Slack ROI report with do/don't recommendations",
        "Direct access to your ad ops team — no account managers in the way",
      ]}
      outcomes={[
        "Most clients see CAC drop 25-40% within the first 60 days",
        "Best-performing creative + audience pair surfaced by AI in week 1",
        "Real revenue attribution (not last-click) tied to GA4 conversions",
        "Spend levels you can defend to your CFO with one screenshot",
      ]}
      faqs={[
        {
          q: "Is the ad spend included?",
          a: "No — the $797/mo is management. Ad spend is paid directly to Google/Meta/LinkedIn from your account. Most clients run $2-10K/mo in ad spend.",
        },
        {
          q: "What's the minimum ad spend?",
          a: "$2,000/mo is recommended for meaningful data within 30 days. Below that, the algorithm doesn't have enough signal to optimize. No hard minimum — we'll work with whatever budget you bring.",
        },
        {
          q: "Which platform should I start with?",
          a: "Depends on your audience. B2B SaaS → LinkedIn or Google. B2C / e-commerce → Meta. Local services → Google + Meta. We'll tell you on the kickoff call which platform fits your customer.",
        },
        {
          q: "Can I add more platforms later?",
          a: "Yes — we have an Add platform option in the order wizard ($500/mo for each additional platform), or you can upgrade to the full PPC & Paid Ads tier ($797 base + multi-platform scoping).",
        },
        {
          q: "What if my campaigns aren't profitable?",
          a: "We'll tell you within 60 days. Sometimes the offer needs to change. Sometimes the targeting is wrong. Sometimes the channel is wrong for your business — and we'll route you to where you should actually be spending.",
        },
      ]}
    />
  )
}
