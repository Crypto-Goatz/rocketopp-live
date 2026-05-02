import type { Metadata } from "next"
import { PenTool } from "lucide-react"
import { ServicePageTemplate } from "@/components/order/service-page-template"

export const metadata: Metadata = {
  title: "Content Marketing — AI-Citation Ready — RocketOpp",
  description:
    "Blog posts written for humans AND AI engines. SXO + schema baked in. Distributed automatically. Starting at $1,497/mo for 4 posts. Scale to 8 or 12.",
  alternates: { canonical: "https://rocketopp.com/services/web-marketing/content-marketing" },
}

export default function ContentMarketingPage() {
  return (
    <ServicePageTemplate
      slug="web-marketing-content"
      Icon={PenTool}
      headline="Content that gets cited by ChatGPT."
      subhead="4-12 posts a month, written for humans first and AI engines second. Schema baked in, distribution included, SXO-scored above 90."
      longDescription="Most content marketing in 2026 is dead the day it ships — generic LLM slop nobody reads. Our content is the opposite: every post starts with a real BLUF (Bottom Line Up Front), gets scored against the SXO rubric, and ships with FAQ + HowTo schema so it can be cited by ChatGPT, Claude, and Perplexity. We write it. We optimize it. We post it to your blog. We distribute it to LinkedIn, Reddit, Dev.to, and 0nmcp.com if it fits. You get a content calendar you can read in 30 seconds and a monthly report on what's actually driving traffic."
      features={[
        "Topic research from your real customer questions (Reddit + GSC + sales transcripts)",
        "Posts written by humans, edited by humans, scored by AI (SXO ≥ 90)",
        "FAQ + HowTo schema markup on every post",
        "BLUF formatting — answer in the first 2 sentences",
        "AI-citation testing: we check ChatGPT/Perplexity for your topics weekly",
        "Multi-platform distribution: LinkedIn, Reddit, Dev.to, partner blogs",
        "Internal linking + topic-cluster strategy",
        "Monthly content + traffic report",
      ]}
      outcomes={[
        "AI engines start citing you for your target topics within 60-90 days",
        "Long-tail organic traffic compounds — by month 6 you're ranking on queries you didn't know existed",
        "Conversion rate from blog visitors lifts 2-3x because content actually answers the question",
        "Sales team has linkable answers for every common objection",
      ]}
      faqs={[
        {
          q: "Is this written by AI?",
          a: "No. Every post is human-written, then SXO-scored by our internal AI tools. Pure-AI content is detectable, generic, and gets penalized by both Google and AI engines. We use AI to score and improve — never to draft.",
        },
        {
          q: "What topics will you write about?",
          a: "Whatever your customers actually ask. We pull from your sales call transcripts, support tickets, GSC queries, and Reddit threads in your space. The first month is heavy on research; month 2+ ships on a calendar you approve.",
        },
        {
          q: "Do you also do videos and podcasts?",
          a: "Not directly — we focus on written content with schema. We can repurpose your written content into LinkedIn carousels and short-form video scripts as part of the Distribution add-on.",
        },
        {
          q: "What's the difference between this and SXO?",
          a: "SXO is the engine — Living DOM, scoring, Brave-fact-checking, AI-citation engineering on your existing site. Content Marketing is the supply — new posts every month feeding into that engine. Most clients run both.",
        },
        {
          q: "Can I get more than 12 posts a month?",
          a: "Yes — at higher volumes we use a hybrid AI-assisted human workflow. Custom quote required; talk to us in the order wizard.",
        },
      ]}
    />
  )
}
