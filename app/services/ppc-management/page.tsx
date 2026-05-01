import type { Metadata } from "next"
import Link from "next/link"
import { BarChart3, CheckCircle, ArrowRight, Target, TrendingUp, DollarSign, Search, Zap, Eye, Sparkles, ShieldCheck, AlertTriangle, Activity, Workflow, GitBranch, Bot, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ServiceOfferSchema, FAQSchema, BreadcrumbSchema, HowToSchema } from "@/components/seo/json-ld"
import Footer from "@/components/footer"
import BlufBlock from "@/components/sxo/bluf-block"
import IndustryVsUsTable from "@/components/sxo/industry-vs-us-table"
import ProcessTimeline from "@/components/sxo/process-timeline"
import RelatedServices from "@/components/sxo/related-services"
import UcpLiveStrip from "@/components/ucp-live-strip"

export const metadata: Metadata = {
  title: "PPC Management — From $797/mo | AI-Optimized Google + Meta + LinkedIn Ads | RocketOpp",
  description:
    "Paid ads managed by AI, optimized by CRO9. Google, Meta, LinkedIn, X, TikTok — one team, transparent pricing, real ROI. From $797/mo. No long-term contracts.",
  keywords: [
    "PPC management cost",
    "Google Ads management pricing",
    "Meta Ads management",
    "LinkedIn Ads agency",
    "AI PPC optimization",
    "AI ad management",
    "paid search management",
    "ROI-focused PPC",
    "small business PPC",
    "PPC agency pricing 2026",
    "automated bid management",
    "AI media buying",
    "TikTok ads management",
    "RocketOpp PPC",
    "CRO9 ads",
  ],
  openGraph: {
    title: "PPC Management — AI-Optimized | RocketOpp",
    description: "From $797/mo. Google + Meta + LinkedIn + TikTok, one team, transparent pricing.",
    url: "https://rocketopp.com/services/ppc-management",
    type: "website",
  },
  alternates: { canonical: "https://rocketopp.com/services/ppc-management" },
}

const tiers = [
  { name: "PPC Starter", price: "$797/mo", headline: "One channel. AI-optimized. Real reporting.", bestFor: "Local businesses + service providers running 1 channel.",
    features: ["1 channel managed (Google OR Meta OR LinkedIn)", "Up to $5k/mo ad spend", "AI-optimized bidding + creative rotation", "Conversion tracking setup", "Weekly performance email", "Monthly strategy call", "Live ROI dashboard", "Cancel anytime"] },
  { name: "PPC Growth", price: "$1,997/mo", popular: true, headline: "Multi-channel media buying with AI in the loop.", bestFor: "Growing brands ($1M-$10M ARR) on 2-3 channels.",
    features: ["Everything in Starter, plus —", "3 channels managed (Google + Meta + 1 of: LinkedIn / TikTok / X)", "Up to $25k/mo ad spend", "Cross-channel attribution + budget reallocation", "Creative + copy production (4 variants/wk)", "CRO9 landing-page mutation engine", "Bi-weekly strategy calls", "Monthly executive deep-dive"] },
  { name: "PPC Enterprise", price: "$3,997/mo", headline: "Full-stack performance media + experimentation.", bestFor: "Enterprise + multi-location ($10M+ ARR) running everywhere.",
    features: ["Everything in Growth, plus —", "Unlimited channels (Google + Meta + LinkedIn + TikTok + X + Pinterest + Reddit)", "Unlimited ad spend (no fee scaling)", "Dedicated media buyer + AI strategist", "Multi-location campaign architecture", "Custom dashboards (looker / GA4 / your data warehouse)", "Quarterly creative refresh sprint", "Weekly strategy calls"] },
]

const comparisonRows = [
  { dimension: "Monthly fee", industry: "$1,500-$5,000/mo", rocketopp: "$797-$3,997/mo flat" },
  { dimension: "Pricing model", industry: "% of ad spend (incentive misaligned)", rocketopp: "Flat fee — we win when you do" },
  { dimension: "Time to first optimized campaigns", industry: "30-60 days", rocketopp: "7-14 days" },
  { dimension: "Channels managed", industry: "1-2 (extra fee per channel)", rocketopp: "1-7 included by tier" },
  { dimension: "AI in the bid + creative loop", industry: "Native platform AI only (untuned)", rocketopp: "CRO9 + custom GPT layer + landing-page mutations" },
  { dimension: "Landing page optimization", industry: "Quoted as separate engagement", rocketopp: "CRO9 mutation engine included on Growth+" },
  { dimension: "Creative + copy production", industry: "Outsourced, $200-$500/asset", rocketopp: "4+ variants/week included on Growth+" },
  { dimension: "Reporting", industry: "Monthly PDF", rocketopp: "Live ROI dashboard + weekly digest" },
]

const processSteps = [
  { number: "01", title: "Audit + ICP lock", when: "Day 1-3", body: "We audit existing accounts (if any), interview your sales team, lock in the ideal customer profile + offer. The AI is only as smart as the targeting + creative we feed it.", icon: Activity },
  { number: "02", title: "Tracking + attribution", when: "Day 4-7", body: "GA4, server-side tagging, conversion API for Meta, Enhanced Conversions for Google, CRM webhooks. The AI needs clean signal to optimize against — we wire it before launch.", icon: GitBranch },
  { number: "03", title: "Creative + landing pages", when: "Week 2", body: "4-12 ad variants per channel, written + designed in your brand voice. Landing pages built with CRO9 mutation engine so they self-optimize once traffic flows.", icon: Workflow },
  { number: "04", title: "Launch + optimize", when: "Week 2-3", body: "Campaigns go live with AI-optimized bids + creative rotation. Daily monitoring weeks 1-3 so we catch any tracking gap or creative misfire before it burns budget.", icon: Zap },
  { number: "05", title: "Cross-channel attribution", when: "Week 3+", body: "Once data flows, we layer cross-channel attribution and start reallocating budget to the highest-ROI placements automatically. AI watches for diminishing returns + flags it.", icon: TrendingUp },
  { number: "06", title: "Compound + experiment", when: "Month 2+", body: "Weekly creative refresh, monthly experiment plan (new audiences, new offers, new channels). Goal: every month is better-performing than the last.", icon: Bot },
]

const faqs = [
  { question: "What is PPC and is it still worth it in 2026?", answer: "PPC (pay-per-click) advertising means buying targeted clicks on Google, Meta (Facebook/Instagram), LinkedIn, TikTok, X, Pinterest, or Reddit. It's still worth it in 2026 — but the bar is higher because AI-driven platforms reward operators who feed them clean targeting + creative. Done right, PPC is the most predictable channel a business can run because you can scale spend the moment it's profitable. Done wrong (no AI in the loop, no clean tracking, mediocre creative), it's where marketing budgets die." },
  { question: "How much does PPC management cost in 2026?", answer: "Industry average is $1,500-$5,000/mo on a percentage-of-spend model — which means as you scale, the fee scales with you (incentive misaligned). RocketOpp charges flat fees: Starter $797 (1 channel, up to $5k/mo spend), Growth $1,997 (3 channels, up to $25k/mo spend), Enterprise $3,997 (unlimited channels, unlimited spend). The savings compound the bigger your spend gets." },
  { question: "Which platform should I be running?", answer: "It depends on your ICP. Local services + e-commerce: usually Google + Meta. B2B / SaaS: LinkedIn primary, Google supporting, X for thought leadership. DTC + Gen Z: TikTok + Meta. Enterprise + niche: Reddit + LinkedIn. We start with the channel that matches your customer + scale into others as data proves the unit economics." },
  { question: "What's CRO9 and why is it on the ads page?", answer: "CRO9 is our self-learning conversion-rate optimization engine. Once your ads start sending traffic, CRO9 mutates the landing page in real time based on visitor behavior — different headline for different audiences, different CTA placement, different social proof. The result: every visitor sees the version of your page most likely to convert them. It's why our PPC ROI numbers beat the agency-average even when we're spending less." },
  { question: "How fast will I see results?", answer: "Tracking + first campaigns live: 7-14 days. First optimized performance signal: 21-30 days (the AI needs ~2 weeks of conversion data to start tuning bids effectively). First clear ROI win: month 2. Scaling decision: month 3. We don't sugarcoat the timeline — anyone promising profitable Day-1 ROAS is selling you something else." },
  { question: "Do you guarantee results?", answer: "We guarantee execution: tracking will be clean, ads will be in market by Day 14, weekly digest will land every Monday, monthly call will happen. We don't guarantee CPA / ROAS targets because they depend on your offer + market — but we do agree to a target with you at kickoff and we keep optimizing until we hit it. If we miss it after 60 days of clean data, we don't bill the next month." },
  { question: "Will you use my existing accounts or build new ones?", answer: "We always work in your accounts (Google Ads MCC link, Meta Business Manager partner access, LinkedIn Ad account share). You own the data, the campaign history, and the audiences. If you ever leave us, everything stays in your accounts — no held-hostage scenarios." },
  { question: "What about creative production?", answer: "Growth + Enterprise include 4+ ad variants per week, written and designed by our team using AI-assisted production (Groq-driven copy + Midjourney/Flux for visuals + your brand library). Starter clients can add creative as a $300/mo add-on or supply their own. Either way, we run weekly creative-fatigue analysis and refresh before performance dips." },
  { question: "Can I cancel anytime?", answer: "Yes — every PPC plan is month-to-month. No ramp-up fees, no minimum-term contracts, no exit fees. We make it stupidly easy to leave because we want you to stay because the numbers are good, not because the paperwork is hostile." },
]

const relatedLinks = [
  { label: "SXO (Search Experience Optimization)", href: "/services/sxo", hint: "From $997/mo — feed organic alongside the paid" },
  { label: "CRM Setup & Automation", href: "/services/crm-automation", hint: "$1,497 — capture + nurture every lead the ads send" },
  { label: "AI Business Automation", href: "/services/ai-automation", hint: "$2,997 — auto-qualify ad leads with AI agents" },
  { label: "MCP Server Integration", href: "/services/mcp-integration", hint: "$1,997 — connect ads, CRM, and AI in one stack" },
  { label: "CRO9 — the optimization engine", href: "https://cro9.com", hint: "Living DOM that mutates landing pages in real time", external: true },
  { label: "Read the PPC playbook", href: "/blog", hint: "Real campaigns, real numbers, real failures" },
]

export default function PpcManagementPage() {
  return (
    <>
      <ServiceOfferSchema name="PPC Management" description="AI-optimized paid advertising management across Google, Meta, LinkedIn, TikTok, X — flat-fee pricing, real ROI." serviceType="PPC / Paid Media Management" url="https://rocketopp.com/services/ppc-management" price={797} priceUnit="MONTH" />
      <FAQSchema items={faqs} />
      <HowToSchema name="How RocketOpp ships a PPC engagement" description="Six steps from audit to compounding paid performance." totalTime="P14D" steps={processSteps.map((s) => ({ name: s.title, text: s.body }))} />
      <BreadcrumbSchema items={[{ name: "Home", url: "https://rocketopp.com" }, { name: "Services", url: "https://rocketopp.com/services" }, { name: "PPC Management", url: "https://rocketopp.com/services/ppc-management" }]} />

      <main className="min-h-screen">
        <BlufBlock
          badge="Flat-fee pricing — we win when you do"
          bottomLine="Paid ads managed by AI, optimized by CRO9. Google, Meta, LinkedIn, TikTok, X — one team, transparent flat-fee pricing, real ROI on a live dashboard. From $797/mo."
          context="The industry runs on percentage-of-spend, which means agencies make more when YOU spend more — even on bad campaigns. We charge flat fees because incentives should match. Plus the CRO9 mutation engine is included on Growth+ — your landing pages self-optimize as the ads send traffic."
          stats={[
            { label: "Channels covered", value: "Up to 7" },
            { label: "Time to first optimized campaign", value: "14 days" },
            { label: "Pricing model", value: "Flat fee" },
            { label: "Starting price", value: "$797/mo" },
          ]}
          primaryCta={{ label: "Book a PPC call", href: "/contact" }}
          secondaryCta={{ label: "See pricing", href: "#pricing" }}
        />

        <UcpLiveStrip />

        <section className="border-b border-border py-16 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="mx-auto max-w-3xl">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-yellow-500/30 bg-yellow-500/5 px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-widest text-yellow-500">
                <AlertTriangle className="h-3 w-3" /> The percentage-of-spend trap
              </div>
              <h2 className="text-balance text-3xl font-bold tracking-tight md:text-4xl">Your agency is making more when you waste more.</h2>
              <div className="mt-6 space-y-4 text-base leading-relaxed text-muted-foreground md:text-lg">
                <p>The standard PPC model — <strong className="text-foreground">15-20% of monthly ad spend</strong> — sounds reasonable until you do the math. At $20k/mo spend, that&apos;s $3-4k of agency fee. At $50k/mo, it&apos;s $7.5-10k. The fee scales with the volume even when the campaigns are flat-lining.</p>
                <p>Worse: when budgets get cut, the agency&apos;s revenue gets cut. <strong className="text-foreground">The incentive is to convince you to spend more</strong>, not to make sure every dollar earns its keep.</p>
                <p>Flat fees flip the math. We earn the same whether you spend $5k or $50k — so our entire job becomes maximizing ROI per dollar so you grow into the next tier on results, not on hope.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-border py-16 md:py-24 bg-card/30">
          <div className="container px-4 md:px-6">
            <div className="mx-auto max-w-3xl text-center mb-12">
              <h2 className="text-balance text-3xl font-bold tracking-tight md:text-4xl">What you get every week.</h2>
              <p className="mt-3 text-base text-muted-foreground md:text-lg">Six layers of paid performance — same disciplined cycle, every plan.</p>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[
                { icon: Search, title: "Bid + audience optimization", desc: "AI watches every campaign 24/7. Bids adjust to current intent + competition. Audiences expand and contract based on conversion patterns." },
                { icon: Workflow, title: "Creative refresh", desc: "4-12 new ad variants per week (Growth+) so creative fatigue never kills performance. Tested, ranked, scaled — losers killed automatically." },
                { icon: Globe, title: "Cross-channel attribution", desc: "Money flows where it earns. We track touchpoints across Google, Meta, LinkedIn, TikTok and reallocate budget to the highest-ROI placements weekly." },
                { icon: Bot, title: "CRO9 landing pages", desc: "Self-optimizing pages that mutate in real time. Different headline for different audience, different CTA placement, different social proof — automatically." },
                { icon: BarChart3, title: "Live ROI dashboard", desc: "One screen. Every channel. Every campaign. Every dollar. No PDF reports, no waiting for the monthly check-in to know if you're winning." },
                { icon: TrendingUp, title: "Strategy that compounds", desc: "Bi-weekly or weekly calls (depending on plan). New experiments, new audiences, new channels. The point is making month N+1 better than month N. Always." },
              ].map((item) => {
                const Icon = item.icon
                return (
                  <div key={item.title} className="rounded-2xl border border-border bg-card/50 p-6 backdrop-blur transition-colors hover:border-primary/40">
                    <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl border border-primary/30 bg-primary/10 text-primary">
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="text-lg font-bold text-foreground">{item.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.desc}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        <IndustryVsUsTable heading="PPC Management: Industry vs RocketOpp" caption="Same execution layer, smarter pricing model + smarter AI." rows={comparisonRows} footnote="* Industry baselines: 2026 paid-media RFP averages + WordStream / SearchEngineLand benchmarks." />
        <ProcessTimeline heading="How we ship a PPC engagement" caption="Two weeks from kickoff to optimized campaigns in market." steps={processSteps} />

        <section id="pricing" className="border-y border-border py-16 md:py-24 bg-card/20">
          <div className="container px-4 md:px-6">
            <div className="mx-auto max-w-3xl text-center mb-12">
              <h2 className="text-balance text-3xl font-bold tracking-tight md:text-5xl">
                <span className="bg-gradient-to-r from-primary via-orange-400 to-primary bg-clip-text text-transparent">PPC pricing</span>
              </h2>
              <p className="mt-3 text-base text-muted-foreground md:text-lg">Flat monthly fees. No long-term contracts. Cancel anytime.</p>
            </div>
            <div className="mx-auto grid max-w-6xl grid-cols-1 gap-5 lg:grid-cols-3">
              {tiers.map((tier) => (
                <div key={tier.name} className={`relative flex flex-col rounded-2xl border p-7 backdrop-blur ${tier.popular ? "border-primary/40 bg-gradient-to-br from-primary/[0.05] via-card/40 to-transparent ring-1 ring-primary/20" : "border-border bg-card/40"}`}>
                  {tier.popular && (
                    <div className="absolute -top-3 left-7 inline-flex items-center gap-1 rounded-full bg-primary px-3 py-0.5 font-mono text-[10px] font-bold uppercase tracking-widest text-primary-foreground">
                      <Sparkles className="h-3 w-3" /> Most popular
                    </div>
                  )}
                  <h3 className="text-xl font-bold text-foreground">{tier.name}</h3>
                  <div className="mt-1 text-sm text-muted-foreground">{tier.headline}</div>
                  <div className="mt-5"><span className="text-4xl font-black text-primary">{tier.price}</span></div>
                  <p className="mt-3 text-xs italic text-muted-foreground">{tier.bestFor}</p>
                  <ul className="mt-5 flex-1 space-y-2.5">
                    {tier.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm">
                        <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                        <span className={f.startsWith("Everything in") ? "font-semibold text-foreground" : "text-muted-foreground"}>{f}</span>
                      </li>
                    ))}
                  </ul>
                  <Button asChild size="lg" className="mt-6 w-full" variant={tier.popular ? "default" : "outline"}>
                    <Link href="/contact">Start {tier.name.replace("PPC ", "")}<ArrowRight className="ml-1.5 h-4 w-4" /></Link>
                  </Button>
                </div>
              ))}
            </div>
            <div className="mx-auto mt-10 max-w-3xl rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/[0.06] via-card/40 to-transparent p-6 md:p-8">
              <div className="flex flex-col items-center gap-4 md:flex-row">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-primary/30 bg-primary/15">
                  <ShieldCheck className="h-7 w-7 text-primary" />
                </div>
                <div className="flex-1 text-center md:text-left">
                  <div className="mb-1 font-mono text-[10px] uppercase tracking-widest text-primary">Performance guarantee</div>
                  <h3 className="text-lg font-bold md:text-xl">Hit your CPA / ROAS target after 60 days, or we don&apos;t bill the next month.</h3>
                  <p className="mt-1 text-sm text-muted-foreground">We agree to a measurable target at kickoff. After 60 days of clean data, if we haven&apos;t hit it, the next month&apos;s fee is on us while we keep optimizing. No 12-month contracts. No exit fees. Real skin in the game.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-border py-16 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="mx-auto max-w-3xl text-center mb-12">
              <h2 className="text-balance text-3xl font-bold tracking-tight md:text-4xl">Frequently asked questions</h2>
              <p className="mt-3 text-base text-muted-foreground md:text-lg">Real answers from operators who&apos;ve spent millions in ad budgets.</p>
            </div>
            <div className="mx-auto max-w-3xl space-y-4">
              {faqs.map((faq) => (
                <details key={faq.question} className="group rounded-2xl border border-border bg-card/50 p-5 transition-colors hover:border-primary/40">
                  <summary className="flex cursor-pointer items-start justify-between gap-3 list-none">
                    <h3 className="text-base font-bold text-foreground md:text-lg">{faq.question}</h3>
                    <span className="font-mono text-xl text-primary transition-transform group-open:rotate-45">+</span>
                  </summary>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground md:text-base">{faq.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden border-b border-border py-16 md:py-24">
          <div aria-hidden className="pointer-events-none absolute -top-32 left-1/2 h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-primary/[0.06] blur-[140px]" />
          <div className="container relative z-10 px-4 md:px-6">
            <div className="mx-auto max-w-3xl rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/[0.05] via-card/40 to-transparent p-10 text-center md:p-14">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/8 px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-widest text-primary">
                <Activity className="h-3 w-3" /> Free audit · 30 minutes · No commitment
              </div>
              <h2 className="text-balance text-3xl font-bold tracking-tight md:text-5xl">Show us your ad accounts. We&apos;ll show you what&apos;s leaking.</h2>
              <p className="mt-4 text-base leading-relaxed text-muted-foreground md:text-lg">Free 30-minute audit of any active Google / Meta / LinkedIn account. We tell you the 3 biggest leaks + what we&apos;d charge to fix them. If we can&apos;t find anything worth fixing, we&apos;ll say that too.</p>
              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Button asChild size="lg" className="text-base"><Link href="/contact">Get the free audit <ArrowRight className="ml-2 h-4 w-4" /></Link></Button>
                <Button asChild variant="outline" size="lg" className="text-base"><Link href="/services/sxo">Pair with SXO</Link></Button>
              </div>
            </div>
          </div>
        </section>

        <RelatedServices links={relatedLinks} />
      </main>
      <Footer />
    </>
  )
}
