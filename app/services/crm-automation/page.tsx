import type { Metadata } from "next"
import Link from "next/link"
import { Target, CheckCircle, ArrowRight, Mail, Users, Calendar, Zap, BarChart3, Phone, Workflow, Sparkles, ShieldCheck, AlertTriangle, Activity, GitBranch, Database } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ServiceOfferSchema, FAQSchema, BreadcrumbSchema, HowToSchema } from "@/components/seo/json-ld"
import Footer from "@/components/footer"
import BlufBlock from "@/components/sxo/bluf-block"
import IndustryVsUsTable from "@/components/sxo/industry-vs-us-table"
import ProcessTimeline from "@/components/sxo/process-timeline"
import RelatedServices from "@/components/sxo/related-services"
import UcpLiveStrip from "@/components/ucp-live-strip"

export const metadata: Metadata = {
  title: "CRM Setup & Automation — From $1,497 | Pipelines, Lead Scoring, Sequences | RocketOpp",
  description:
    "Full CRM setup with automated pipelines, AI lead scoring, email + SMS sequences, appointment booking, and revenue reporting. Ships in 1 week. From $1,497.",
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
    title: "CRM Setup & Automation from $1,497 | RocketOpp",
    description: "Full CRM with AI lead scoring, automated sequences, and appointment booking. Ships in 1 week.",
    url: "https://rocketopp.com/services/crm-automation",
    type: "website",
  },
  alternates: { canonical: "https://rocketopp.com/services/crm-automation" },
}

const tiers = [
  { name: "CRM Starter", price: "$1,497", headline: "Get a working CRM in 7 days.", bestFor: "Solo founders + small teams just leaving spreadsheets.",
    features: ["Full CRM setup (pipelines, custom fields, tags)", "Lead capture forms (3) wired to CRM", "Basic email + SMS sequences (5 flows)", "Calendar / appointment booking", "Lead scoring (rule-based)", "Reporting dashboard", "1 hour of training", "30 days of refinement"] },
  { name: "CRM Growth", price: "$4,497", popular: true, headline: "Automate the entire revenue motion.", bestFor: "Scaling teams with 100+ leads/mo and active sales reps.",
    features: ["Everything in Starter, plus —", "AI lead scoring (real-time, not rule-based)", "12 automated email + SMS sequences", "Multi-step appointment booking + reminders", "Auto-enrichment + CRM data hygiene agent", "Sales call summary → CRM agent", "Live revenue dashboard", "60 days of refinement + 2 strategy calls"] },
  { name: "CRM Enterprise", price: "From $9,997", headline: "Multi-team, multi-location revenue infrastructure.", bestFor: "Multi-location service businesses + scaling sales orgs.",
    features: ["Everything in Growth, plus —", "Multi-location pipeline architecture", "Custom integrations (3+ business systems)", "Role-based access + audit trail", "Advanced reporting + cohort analytics", "Quarterly playbook reviews", "Dedicated CRM strategist", "Unlimited refinement"] },
]

const comparisonRows = [
  { dimension: "Setup cost", industry: "$3,000-$10,000", rocketopp: "$1,497-$9,997" },
  { dimension: "Time to first working pipeline", industry: "4-8 weeks", rocketopp: "1 week" },
  { dimension: "Sequences included on day 1", industry: "0-2", rocketopp: "5-12 fully written + tested" },
  { dimension: "Lead scoring model", industry: "Manual rules or extra add-on", rocketopp: "AI-based, included in Growth+" },
  { dimension: "Data hygiene + auto-enrichment", industry: "Bolt-on tools, $200-$500/mo", rocketopp: "Built-in agent, included in Growth+" },
  { dimension: "Sales call → CRM update", industry: "Manual rep entry, mostly skipped", rocketopp: "AI agent summarizes + writes, no rep effort" },
  { dimension: "Reporting", industry: "Build it yourself in Looker/spreadsheets", rocketopp: "Live revenue dashboard included" },
  { dimension: "Refinement after launch", industry: "Hourly billing", rocketopp: "30-90 days included" },
]

const processSteps = [
  { number: "01", title: "Revenue audit", when: "Day 1-2", body: "We map your sales motion: where leads come from, how they get qualified, when they convert, what falls through the cracks. Every gap becomes a pipeline stage or an automation.", icon: Activity },
  { number: "02", title: "Pipeline + field architecture", when: "Day 3-4", body: "We build your pipelines, custom fields, tags, and segments. Modeled to your real sales motion, not the generic CRM template.", icon: GitBranch },
  { number: "03", title: "Sequences + automations live", when: "Day 5-7", body: "5-12 email + SMS sequences shipped, every form wired to the right pipeline, calendar bookings flowing in, and lead scoring computing in real time.", icon: Workflow },
  { number: "04", title: "AI agents on top", when: "Week 2", body: "Lead scoring agent, data hygiene agent, sales call summary agent — all running on 0nMCP with your CRM as the source of truth. Reps stop doing data entry.", icon: Zap },
  { number: "05", title: "Train + handoff", when: "Week 2", body: "1-hour walkthrough for your team. Everyone leaves knowing how to use it without us. Documentation + Loom videos for new hires.", icon: Users },
  { number: "06", title: "Refine + report", when: "Day 30-90", body: "We watch the dashboard for 30-90 days, tune sequences, fix anything weird, and ship a deep-dive report on revenue impact at the end.", icon: BarChart3 },
]

const faqs = [
  { question: "What is CRM automation?", answer: "CRM automation is the practice of removing manual sales-ops work — lead routing, follow-up sequences, appointment confirmation, data enrichment, call summaries, deal-stage updates — by letting your CRM do them in the background. Done well, your reps spend their time on calls and closing, not on typing names into a database." },
  { question: "How much does professional CRM setup cost in 2026?", answer: "Industry average for a real CRM implementation is $3,000-$10,000 with a 4-8 week timeline. RocketOpp ships Starter in 7 days for $1,497 because we use proven pipeline templates customized to your sales motion + the same 0nMCP automation layer that powers all our other services. Growth ($4,497) adds AI scoring + agent layer; Enterprise (from $9,997) adds multi-location + custom integrations." },
  { question: "What CRM platforms do you work with?", answer: "We are platform-agnostic. We've built engagements on HubSpot, Salesforce, Pipedrive, Zoho, ActiveCampaign, Keap, and our own CRM stack. Tell us what you're on or want to be on; we have the integration layer ready. The 0nMCP foundation means migrating between platforms later is way less painful than it would be otherwise." },
  { question: "Will my data import cleanly from spreadsheets / old CRM?", answer: "Yes. Data import + cleanup is built into every engagement. We dedupe contacts, normalize phone + email formats, map old fields to new ones, and run a hygiene pass before go-live. You can ship from day one with clean data, not the mess you've been carrying for years." },
  { question: "Do you set up email deliverability and SMS compliance?", answer: "Yes. Email sequences are useless if they hit spam. We configure SPF, DKIM, DMARC, warm-up cadence, and segmentation to keep deliverability above 95%. SMS includes opt-in flow + TCPA-compliant footer. Both are part of every plan." },
  { question: "What does AI lead scoring actually do?", answer: "Rule-based scoring (the industry default) gives the same lead the same score every time based on form fields. AI scoring learns from your closed-won vs closed-lost history — if leads from a certain industry / company size / behavior pattern are converting, that pattern's score goes up automatically. The result: your reps spend more time on the leads that actually buy." },
  { question: "Can I keep my existing email / phone tools?", answer: "Yes. We integrate with whatever you already use (Gmail, Outlook, Twilio, OpenPhone, RingCentral, etc.) so you don't lose history. The CRM becomes the conductor; the existing tools stay as the instruments." },
  { question: "How fast will my team adopt this?", answer: "Adoption is the part most CRM projects flunk. We solve it three ways: (1) we build to your real workflow, not the generic CRM tutorial; (2) the AI agents do the data entry, so reps don't have to; (3) the 1-hour training + Loom video set means new hires onboard in a day. Real adoption rates from our last 5 engagements: 90%+ active use after 30 days." },
  { question: "Can I cancel anytime?", answer: "Project-based engagements (Starter, Growth, Enterprise) include the build + 30-90 days of refinement. After that you own the CRM outright. Optional managed-service contracts (where we keep adding sequences + agents) are month-to-month, no contract." },
]

const relatedLinks = [
  { label: "AI Business Automation", href: "/services/ai-automation", hint: "$2,997 — replace 5-10 workflows with AI agents" },
  { label: "MCP Server Integration", href: "/services/mcp-integration", hint: "$1,997 — connect any business to 1,500+ tools" },
  { label: "PPC & Paid Ads", href: "/services/ppc-management", hint: "$797/mo — feed the CRM with qualified leads" },
  { label: "SXO (Search Experience Optimization)", href: "/services/sxo", hint: "From $997/mo — drive organic leads to the CRM" },
  { label: "0nMCP — the orchestrator", href: "https://0nmcp.com", hint: "1,554 tools, 96 services", external: true },
  { label: "Read the CRM playbook", href: "/blog", hint: "How we ship CRMs that actually get used" },
]

export default function CrmAutomationPage() {
  return (
    <>
      <ServiceOfferSchema name="CRM Setup & Automation" description="Full CRM setup with automated pipelines, AI lead scoring, email + SMS sequences, and appointment booking." serviceType="CRM Implementation + Automation" url="https://rocketopp.com/services/crm-automation" price={1497} priceUnit="ONE_TIME" />
      <FAQSchema items={faqs} />
      <HowToSchema name="How RocketOpp ships a CRM automation engagement" description="From revenue audit to fully-automated pipeline in seven days." totalTime="P7D" steps={processSteps.map((s) => ({ name: s.title, text: s.body }))} />
      <BreadcrumbSchema items={[{ name: "Home", url: "https://rocketopp.com" }, { name: "Services", url: "https://rocketopp.com/services" }, { name: "CRM Automation", url: "https://rocketopp.com/services/crm-automation" }]} />

      <main className="min-h-screen">
        <BlufBlock
          badge="Pipelines + AI scoring + sequences in 7 days"
          bottomLine="Get a fully-automated CRM in 7 days. Pipelines, AI lead scoring, email + SMS sequences, calendar booking, data hygiene agent, and live revenue reporting — all running by next Friday."
          context="Built on 0nMCP so your CRM connects to 1,500+ tools day one. Platform-agnostic — we work with HubSpot, Salesforce, Pipedrive, Zoho, ActiveCampaign, Keap, or our own stack. From $1,497 (Starter) to $9,997+ (Enterprise multi-location)."
          stats={[
            { label: "Time to working pipeline", value: "7 days" },
            { label: "Sequences shipped day 1", value: "5-12" },
            { label: "Starting price", value: "$1,497" },
            { label: "Adoption rate (last 5 engagements)", value: "90%+" },
          ]}
          primaryCta={{ label: "Book a CRM call", href: "/contact" }}
          secondaryCta={{ label: "See pricing", href: "#pricing" }}
        />

        <UcpLiveStrip />

        <section className="border-b border-border py-16 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="mx-auto max-w-3xl">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-yellow-500/30 bg-yellow-500/5 px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-widest text-yellow-500">
                <AlertTriangle className="h-3 w-3" /> What a broken CRM costs you
              </div>
              <h2 className="text-balance text-3xl font-bold tracking-tight md:text-4xl">Bad CRMs don&apos;t lose deals — they hide them.</h2>
              <div className="mt-6 space-y-4 text-base leading-relaxed text-muted-foreground md:text-lg">
                <p>The average sales rep spends <strong className="text-foreground">~21% of their week on CRM data entry</strong>. That&apos;s one full day per week your highest-paid people spend not selling.</p>
                <p>Then there are the leads that never get followed up because the rep was on a call, the appointments missed because nobody confirmed, the warm leads that go cold because no sequence ever ran. Most teams lose <strong className="text-foreground">20-40% of pipeline value</strong> to invisible CRM debt.</p>
                <p>A CRM that automates the boring 80% turns reps back into closers. The math on a 7-day, $1,497 setup is rounding error compared to the lost-pipeline cost of doing nothing.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-border py-16 md:py-24 bg-card/30">
          <div className="container px-4 md:px-6">
            <div className="mx-auto max-w-3xl text-center mb-12">
              <h2 className="text-balance text-3xl font-bold tracking-tight md:text-4xl">What you get out of the box.</h2>
              <p className="mt-3 text-base text-muted-foreground md:text-lg">Six layers of CRM automation — every plan ships with at least the foundation, Growth + Enterprise ship the full stack.</p>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[
                { icon: Workflow, title: "Pipelines + custom fields", desc: "Modeled to your actual sales motion. Stages, tags, custom fields, automation triggers — all set up day one." },
                { icon: Mail, title: "Email + SMS sequences", desc: "5-12 sequences shipped fully written, deliverability-tuned, and tested. New leads get the right cadence the moment they land." },
                { icon: Calendar, title: "Booking + reminders", desc: "Calendar tied to the CRM. Reminders, no-show recovery, post-meeting follow-up — all automated." },
                { icon: Target, title: "AI lead scoring", desc: "Real-time scoring that learns from your closed-won/lost history. Reps see hot leads at the top of their list automatically." },
                { icon: Database, title: "Data hygiene agent", desc: "Auto-enriches contacts, dedupes records, normalizes phone/email, summarizes calls into the CRM. Reps stop doing data entry." },
                { icon: BarChart3, title: "Revenue reporting", desc: "Live dashboard: pipeline value, conversion by stage, rep performance, sequence effectiveness. No more Sunday-night spreadsheets." },
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

        <IndustryVsUsTable heading="CRM Setup: Industry vs RocketOpp" caption="The same scope of work. We're cheaper because the AI does the work the agency charges you for manually." rows={comparisonRows} footnote="* Industry baselines: Clutch.co + Capterra implementation pricing data 2026." />
        <ProcessTimeline heading="How we ship a CRM engagement" caption="Seven days from kickoff to working pipeline." steps={processSteps} />

        <section id="pricing" className="border-y border-border py-16 md:py-24 bg-card/20">
          <div className="container px-4 md:px-6">
            <div className="mx-auto max-w-3xl text-center mb-12">
              <h2 className="text-balance text-3xl font-bold tracking-tight md:text-5xl">
                <span className="bg-gradient-to-r from-primary via-orange-400 to-primary bg-clip-text text-transparent">CRM pricing</span>
              </h2>
              <p className="mt-3 text-base text-muted-foreground md:text-lg">One-time setup fees. You own the CRM. 30-day results guarantee.</p>
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
                    <Link href="/contact">Start {tier.name.replace("CRM ", "")}<ArrowRight className="ml-1.5 h-4 w-4" /></Link>
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
                  <div className="mb-1 font-mono text-[10px] uppercase tracking-widest text-primary">30-day adoption guarantee</div>
                  <h3 className="text-lg font-bold md:text-xl">Hit 90%+ team adoption in 30 days, or we keep tuning.</h3>
                  <p className="mt-1 text-sm text-muted-foreground">If your team isn&apos;t actively using the CRM after 30 days, we keep refining workflows + retraining at no extra cost until they are. Adoption is the only metric that matters.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-border py-16 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="mx-auto max-w-3xl text-center mb-12">
              <h2 className="text-balance text-3xl font-bold tracking-tight md:text-4xl">Frequently asked questions</h2>
              <p className="mt-3 text-base text-muted-foreground md:text-lg">From the founders who&apos;ve actually shipped this.</p>
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
                <Activity className="h-3 w-3" /> 30-min call · Free · No commitment
              </div>
              <h2 className="text-balance text-3xl font-bold tracking-tight md:text-5xl">Show us your sales motion. We&apos;ll show you the CRM.</h2>
              <p className="mt-4 text-base leading-relaxed text-muted-foreground md:text-lg">30 minutes. We map your pipeline, identify the 3 biggest automation wins, and tell you what it costs to ship in 7 days.</p>
              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Button asChild size="lg" className="text-base"><Link href="/contact">Book the call <ArrowRight className="ml-2 h-4 w-4" /></Link></Button>
                <Button asChild variant="outline" size="lg" className="text-base"><Link href="/services/ai-automation">See AI Automation</Link></Button>
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
