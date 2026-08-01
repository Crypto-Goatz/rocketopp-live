import type { Metadata } from "next"
import Link from "next/link"
import {
  ArrowRight,
  CheckCircle2,
  Users,
  CreditCard,
  LayoutDashboard,
  ShieldCheck,
  AlertTriangle,
  Clock,
  GitBranch,
  Gauge,
} from "lucide-react"
import {
  ServiceOfferSchema,
  FAQSchema,
  BreadcrumbSchema,
  HowToSchema,
} from "@/components/seo/json-ld"
import Footer from "@/components/footer"
import BlufBlock from "@/components/sxo/bluf-block"
import IndustryVsUsTable from "@/components/sxo/industry-vs-us-table"
import ProcessTimeline from "@/components/sxo/process-timeline"
import RelatedServices from "@/components/sxo/related-services"
import UcpLiveStrip from "@/components/ucp-live-strip"

// ━━━ SEO Metadata ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const metadata: Metadata = {
  title: "SaaS Platform Development — Multi-Tenant, Billed, and Yours",
  description:
    "We build the SaaS platform you sell: multi-tenant auth, subscription billing, admin dashboards, and tenant isolation that holds. From $12,500, live in 6 weeks, you own the repo.",
  keywords: [
    "SaaS platform development",
    "build a SaaS platform",
    "multi-tenant SaaS development",
    "SaaS MVP development company",
    "subscription billing integration",
    "Stripe Connect development",
    "white label SaaS platform",
    "custom SaaS application",
    "multi-tenant architecture",
    "SaaS admin dashboard",
    "row level security Supabase",
    "SaaS development cost",
  ],
  openGraph: {
    title: "SaaS Platform Development — Multi-Tenant, Billed, Yours | RocketOpp",
    description:
      "Multi-tenant auth, subscription billing, and admin dashboards. From $12,500, live in 6 weeks, and you own the code.",
    url: "https://rocketopp.com/services/saas-platforms",
    type: "website",
  },
  alternates: { canonical: "https://rocketopp.com/services/saas-platforms" },
}

// ━━━ Page data — content lives at the top, layout below ━━━━━━━━━━━━━━━━━━━━

/**
 * Per lib/stats.ts RULE 2: numbers about RocketOpp / 0n must be checkable in the
 * repos, on npm, or on a live site. The proof points on this page are our own
 * shipped platforms — 0nCore (0ncore.com), CRO9 (cro9.com), RocketPost
 * (rocketpost.co) — all multi-tenant, all billing, all live and visitable.
 *
 * There is deliberately NO industry benchmark number on this page. We do not
 * have a sourced study on average SaaS build cost or timeline, so the
 * comparison table below is structural, not statistical. Do not add an
 * unsourced average to it.
 */

const CAPABILITIES = [
  {
    Icon: Users,
    title: "Multi-tenancy that actually isolates",
    body: "Every row carries a tenant. Row-level security enforces it at the database, not in your application code — so a missed WHERE clause in a route handler cannot leak one customer's data to another. This is the part that is expensive to retrofit and cheap to do first.",
  },
  {
    Icon: CreditCard,
    title: "Billing wired to entitlement",
    body: "Subscriptions, trials, upgrades, downgrades, proration, failed payments, and dunning — connected to what the user can actually do. A cancelled plan should close the door on the next request, not the next billing cycle.",
  },
  {
    Icon: LayoutDashboard,
    title: "The admin dashboard you forgot to scope",
    body: "Every SaaS needs a back office: find a customer, see their plan, comp an account, refund, impersonate to reproduce a bug. Teams routinely skip it and end up running the business from SQL. We build it in.",
  },
  {
    Icon: ShieldCheck,
    title: "Auth that survives contact with users",
    body: "Sign-up, sign-in, password reset, email verification, OAuth providers, sessions that persist across subdomains, and roles. Boring, load-bearing, and the source of most launch-week emergencies when it is rushed.",
  },
  {
    Icon: Gauge,
    title: "Usage metering, if you charge for it",
    body: "Per-seat is easy. Per-execution, per-credit, and hybrid plans need event capture, aggregation, quota enforcement, and an honest usage view for the customer. We have shipped metered billing and will tell you if your pricing model needs it.",
  },
  {
    Icon: GitBranch,
    title: "You own the repo",
    body: "Source, infrastructure config, migrations, and documentation are handed over at launch. No platform seat on your own product, and no vendor positioned between you and your customers.",
  },
]

const DELIVERABLES = [
  "Data model and tenancy design — the decision everything else inherits",
  "Auth: sign-up, sign-in, reset, verification, OAuth, roles, sessions",
  "Multi-tenant isolation enforced at the database with row-level security",
  "Subscription billing with plans, trials, upgrades, proration, and dunning",
  "Entitlement checks so plan state actually gates product access",
  "Customer-facing dashboard — the product surface your users log into",
  "Admin back office — search, plan management, comps, refunds, impersonation",
  "Transactional email for the lifecycle events that cannot silently fail",
  "Deployment, monitoring, and error alerting on your infrastructure",
  "Handoff: repo, migrations, credentials, docs, and a walkthrough recording",
]

const comparisonRows = [
  {
    dimension: "Tenancy model",
    industry: "Decided implicitly, patched when the first leak is reported",
    rocketopp: "Designed in week 1 and enforced by row-level security in the database",
    win: true,
  },
  {
    dimension: "Billing",
    industry: "Checkout works; upgrades, proration, and dunning arrive later",
    rocketopp: "Full lifecycle wired to entitlement before launch",
    win: true,
  },
  {
    dimension: "Admin back office",
    industry: "Out of scope — the team runs the business from database queries",
    rocketopp: "In scope by default, because you will need it in week one",
    win: true,
  },
  {
    dimension: "Who owns the code",
    industry: "The agency, or a low-code platform you cannot leave",
    rocketopp: "You do. Repo, migrations, and infrastructure config at handoff",
    win: true,
  },
  {
    dimension: "What you can show investors",
    industry: "A prototype that demos well and cannot take payment",
    rocketopp: "A platform taking real money from real tenants",
    win: true,
  },
  {
    dimension: "Proof it works",
    industry: "A portfolio of screenshots",
    rocketopp: "0ncore.com, cro9.com and rocketpost.co — multi-tenant, billing, live",
    win: true,
  },
]

const processSteps = [
  {
    number: "01",
    title: "Model the tenant",
    when: "Week 1",
    body: "Who is the customer — a person, a company, an agency with sub-accounts? That answer determines your schema, your billing, your permissions, and how hard growth will be later. We settle it before writing product code.",
    icon: Users,
  },
  {
    number: "02",
    title: "Auth and isolation",
    when: "Week 2",
    body: "Sign-up through session handling, roles, and row-level security policies on every tenant-scoped table. We test isolation by trying to break it — reading across tenants deliberately and confirming the database refuses.",
    icon: ShieldCheck,
  },
  {
    number: "03",
    title: "Billing and entitlement",
    when: "Week 3",
    body: "Plans, trials, upgrades, downgrades, proration, failed payments, and dunning — then the entitlement layer that makes plan state gate real product access on the very next request.",
    icon: CreditCard,
  },
  {
    number: "04",
    title: "The product surface",
    when: "Weeks 4–5",
    body: "The dashboard your customers log into, built on the tenancy and entitlement foundation underneath. This is the part that differs entirely per client, and it is why scoping is a conversation, not a form.",
    icon: LayoutDashboard,
  },
  {
    number: "05",
    title: "Admin, deploy, hand over",
    when: "Week 6",
    body: "Back office, monitoring, error alerting, and production deployment. Then the repo, migrations, credentials, docs, and a walkthrough recording are yours, with 30 days of tuning while your first real tenants arrive.",
    icon: GitBranch,
  },
]

const tiers = [
  {
    name: "SaaS Launch",
    price: "$12,500",
    meta: "one-time · 6 weeks",
    headline: "A real platform taking real money.",
    bestFor:
      "Founders who need to be selling, not demoing — and investors who ask to see the billing.",
    features: [
      "Multi-tenant architecture with row-level security",
      "Full auth: sign-up, reset, verification, OAuth, roles",
      "Subscription billing with trials and proration",
      "Entitlement layer gating product access by plan",
      "Customer dashboard + admin back office",
      "Deployment, monitoring, error alerting",
      "Repo handoff — you own it",
      "30 days post-launch tuning",
    ],
    cta: { label: "Scope my platform", href: "/order?seed=saas-platforms" },
  },
  {
    name: "SaaS Scale",
    price: "$24,500",
    meta: "one-time · 10 weeks",
    popular: true,
    headline: "Usage-based billing and agency-grade tenancy.",
    bestFor:
      "Platforms with metered pricing, sub-accounts, or resellers underneath them.",
    features: [
      "Everything in Launch, plus —",
      "Usage metering with quota enforcement",
      "Hybrid pricing — seats plus consumption",
      "Nested tenancy for agencies and sub-accounts",
      "White-label theming per tenant",
      "Stripe Connect for revenue sharing with resellers",
      "0nMCP integration — 1,640 tools available to your product",
      "Public API with keys, scopes, and rate limits",
    ],
    cta: { label: "Scope a scale build", href: "/order?seed=saas-platforms" },
  },
  {
    name: "Embedded",
    price: "Custom",
    meta: "retainer",
    headline: "Your product team, on retainer.",
    bestFor:
      "Live platforms that need continuous delivery rather than another project.",
    features: [
      "Everything in Scale, plus —",
      "Ongoing feature delivery on a standing retainer",
      "Performance and cost work as you grow",
      "SOC-2-oriented hardening if you are heading to enterprise deals",
      "SLA + priority response",
      "Direct line into the 0nMCP roadmap",
    ],
    cta: { label: "Talk to Mike", href: "/contact" },
  },
]

const faqs = [
  {
    question: "How much does it cost to build a SaaS platform?",
    answer:
      "A launch-ready multi-tenant platform with authentication, subscription billing, a customer dashboard, and an admin back office starts at $12,500 and takes about six weeks. Adding usage-based metering, nested tenancy for agencies or resellers, white-label theming, and a public API is $24,500 over roughly ten weeks. Ongoing product development runs as a retainer. The variable that moves the number is not the plumbing — auth, tenancy, and billing are broadly the same shape every time — it is the product surface your customers actually log in to use.",
  },
  {
    question: "What does multi-tenant actually mean, and why does it matter so much?",
    answer:
      "Multi-tenant means many customers share one deployment while each sees only their own data. It matters because it is the one decision that is genuinely expensive to change later — it touches your schema, your queries, your permissions, your billing, and your migrations. We enforce it with row-level security in the database rather than in application code, so a mistake in a single route handler cannot expose one tenant's records to another. Retrofitting that onto a single-tenant codebase usually means a rewrite.",
  },
  {
    question: "Do you use a low-code platform or write real code?",
    answer:
      "Real code — TypeScript, Next.js, Postgres, and Stripe, deployed on infrastructure you control. Low-code tools are genuinely good for internal tools and prototypes. They become a problem when the product you are selling lives inside someone else's platform, because your margin, your uptime, and your ability to leave are all set by a vendor. If a low-code tool is the right answer for your case, we will say so and point you at one.",
  },
  {
    question: "Can I see a SaaS platform you have actually built?",
    answer:
      "Yes, and you can use them without talking to us first. 0nCore (0ncore.com) is a multi-tenant platform with auth, subscription billing, and an add-on marketplace. CRO9 (cro9.com) runs analytics and conversion tooling across client sites. RocketPost (rocketpost.co) is a subscription product with tiered plans. All three are live, all three take payment, and all three run the same architecture described on this page.",
  },
  {
    question: "Who owns the code and the customer data?",
    answer:
      "You own both. At handoff you receive the repository, the database migrations, the infrastructure configuration, the credentials, and a walkthrough recording. The platform is deployed to your accounts — your Vercel, your database, your Stripe — so your customer relationships and your payment processing are yours from day one. There is no per-seat licence on your own product and no vendor who can switch it off.",
  },
  {
    question: "What if I only need a prototype to raise money?",
    answer:
      "Then say so and we will scope it smaller — but be aware of the trade. A prototype that cannot take payment tends to be the thing you throw away, and investors increasingly ask to see real revenue mechanics rather than a clickable demo. The six-week Launch build exists precisely because the gap between 'it demos' and 'it charges people' is where most SaaS projects quietly stall.",
  },
  {
    question: "How long until my first paying customer can sign up?",
    answer:
      "Six weeks for the Launch build, and that milestone is deliberate: the definition of done is a stranger creating an account, entering a card, being charged, and receiving exactly what their plan entitles them to. Billing lands in week 3, so you will see money move through the system in a test environment about halfway through the engagement rather than at the very end.",
  },
]

const relatedLinks = [
  {
    label: "Agentic AI Apps",
    href: "/services/agentic-ai-apps",
    hint: "$4,997 — agents with real tool access, often built into these platforms",
  },
  {
    label: "MCP Server Integration",
    href: "/services/mcp-integration",
    hint: "$1,997 — give your platform 1,640 tools across 111 services",
  },
  {
    label: "App Development",
    href: "/services/app-development",
    hint: "Single-tenant applications when you are not selling seats",
  },
  {
    label: "AI Applications",
    href: "/services/ai-applications",
    hint: "Custom AI software beyond the platform pattern",
  },
  {
    label: "See 0nCore live",
    href: "https://0ncore.com",
    hint: "A multi-tenant platform we built and run — go use it",
    external: true,
  },
  {
    label: "See CRO9 live",
    href: "https://cro9.com",
    hint: "Analytics and conversion tooling across client sites",
    external: true,
  },
]

// ━━━ Page ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export default function SaasPlatformsPage() {
  return (
    <>
      <ServiceOfferSchema
        name="SaaS Platform Development"
        description="Custom multi-tenant SaaS platform development: tenant isolation with row-level security, full authentication, subscription billing wired to entitlement, customer dashboards, and an admin back office. From $12,500, live in 6 weeks, client owns the repository."
        serviceType="SaaS Platform Development"
        url="https://rocketopp.com/services/saas-platforms"
        price={12500}
      />
      <FAQSchema items={faqs} />
      <HowToSchema
        name="How RocketOpp ships a SaaS platform"
        description="A five-step process from tenancy model to a live multi-tenant platform taking payment, in six weeks."
        totalTime="P42D"
        steps={processSteps.map((s) => ({ name: s.title, text: s.body }))}
      />
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "https://rocketopp.com" },
          { name: "Services", url: "https://rocketopp.com/services" },
          {
            name: "SaaS Platforms",
            url: "https://rocketopp.com/services/saas-platforms",
          },
        ]}
      />

      <main className="min-h-screen">
        {/* ━━━ BLUF ━━━ */}
        <BlufBlock
          badge="Multi-tenant from day one"
          bottomLine="We build the SaaS platform you sell — multi-tenant auth, subscription billing, and an admin back office — and you own the repository. From $12,500, taking real payments in six weeks."
          context="The definition of done is not a demo. It is a stranger creating an account, entering a card, being charged, and getting exactly what their plan entitles them to. Tenant isolation is enforced by the database, not by remembering to write the right WHERE clause."
          stats={[
            { label: "Live in", value: "6 weeks" },
            { label: "Starts at", value: "$12,500" },
            { label: "Billing lands", value: "Week 3" },
            { label: "You own", value: "The repo" },
          ]}
          primaryCta={{ label: "Scope my platform", href: "/order?seed=saas-platforms" }}
          secondaryCta={{ label: "See pricing", href: "#pricing" }}
        />

        {/* ━━━ Live ecosystem heartbeat ━━━ */}
        <UcpLiveStrip />

        {/* ━━━ The problem ━━━ */}
        <section className="border-b border-border py-16 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="mx-auto max-w-3xl">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-yellow-500/30 bg-yellow-500/5 px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-widest text-yellow-500">
                <AlertTriangle className="h-3 w-3" />
                Where SaaS builds actually die
              </div>
              <h2 className="text-balance text-3xl font-bold tracking-tight md:text-4xl">
                Not in the features. In the plumbing nobody scoped.
              </h2>
              <div className="mt-6 space-y-4 text-base leading-relaxed text-muted-foreground md:text-lg">
                <p>
                  The demo goes well. The screens look right. Then someone asks
                  what happens when a customer downgrades mid-cycle, or how an
                  agency invites a sub-account, or whether a cancelled card
                  actually closes the door — and the answer is a quiet three
                  weeks of unplanned work.
                </p>
                <p>
                  Underneath that sits the decision almost nobody makes on
                  purpose:{" "}
                  <span className="font-semibold text-foreground">
                    how tenants are separated
                  </span>
                  . Get it wrong and you do not find out during the build. You
                  find out when a customer sees a row that belongs to someone
                  else, and by then it is woven through every query you have
                  written.
                </p>
                <p>
                  So we build in the opposite order. Tenancy, auth, billing, and
                  entitlement come first, because they are the parts that are
                  expensive to change and boring to demo. Your product surface
                  sits on top of a foundation that already holds.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ━━━ Capabilities ━━━ */}
        <section className="border-b border-border py-16 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="text-balance text-3xl font-bold tracking-tight md:text-5xl">
                What every platform{" "}
                <span className="bg-gradient-to-r from-rose-500 via-pink-500 to-rose-500 bg-clip-text text-transparent">
                  actually needs
                </span>
              </h2>
              <p className="mt-3 text-base text-muted-foreground md:text-lg">
                Six things that are in scope here and quietly optional elsewhere.
              </p>
            </div>
            <div className="mx-auto mt-12 grid max-w-6xl gap-4 md:grid-cols-2 lg:grid-cols-3">
              {CAPABILITIES.map(({ Icon, title, body }) => (
                <div key={title} className="card-lifted p-6">
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-rose-500/10 text-rose-400">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mb-2 text-lg font-bold tracking-tight">
                    {title}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ━━━ Deliverables ━━━ */}
        <section className="border-b border-border bg-card/20 py-16 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="mx-auto grid max-w-5xl gap-10 md:grid-cols-[1fr_1.2fr] md:items-start">
              <div>
                <h2 className="text-balance text-3xl font-bold tracking-tight md:text-4xl">
                  What you actually receive
                </h2>
                <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                  A platform in production with paying tenants on it, plus
                  everything needed to keep building without us.
                </p>
                <Link
                  href="/order?seed=saas-platforms"
                  className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-primary-foreground shadow-[0_0_32px_rgba(255,107,53,0.3)] transition-transform hover:scale-[1.02]"
                >
                  Build my quote
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
              <ul className="space-y-3">
                {DELIVERABLES.map((d) => (
                  <li key={d} className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-rose-400" />
                    <span className="text-sm leading-relaxed text-foreground/90">
                      {d}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* ━━━ Structural comparison (table-trap) ━━━ */}
        <IndustryVsUsTable
          heading="A typical SaaS build vs this one"
          caption="Compared on what is in scope and who owns what — not on benchmarks, because we have no sourced study on average SaaS build cost and are not going to invent one."
          rows={comparisonRows}
          footnote="* Structural comparison. The 'typical' column describes patterns we repeatedly find when taking over stalled builds, not a published benchmark."
        />

        {/* ━━━ Process ━━━ */}
        <ProcessTimeline
          heading="Six weeks, tenancy model to first paying customer"
          caption="Billing lands in week 3, so you watch money move through the system halfway in — not on the last day."
          steps={processSteps}
        />

        {/* ━━━ Pricing ━━━ */}
        <section
          id="pricing"
          className="relative overflow-hidden border-y border-border bg-card/20 py-16 md:py-24"
        >
          <div className="container px-4 md:px-6">
            <div className="mx-auto mb-12 max-w-3xl text-center">
              <h2 className="text-balance text-3xl font-bold tracking-tight md:text-5xl">
                <span className="bg-gradient-to-r from-rose-500 via-pink-500 to-rose-500 bg-clip-text text-transparent">
                  SaaS Platform Pricing
                </span>
              </h2>
              <p className="mt-3 text-base text-muted-foreground md:text-lg">
                One-time builds, not seats. Deployed to your accounts, owned by
                you.
              </p>
            </div>

            <div className="mx-auto grid max-w-6xl gap-5 lg:grid-cols-3">
              {tiers.map((tier) => (
                <div
                  key={tier.name}
                  className={`card-lifted-xl relative flex flex-col p-7 ${
                    tier.popular ? "border-2 border-rose-500/50" : ""
                  }`}
                >
                  {tier.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-rose-500 to-pink-600 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white">
                      Most scoped
                    </div>
                  )}
                  <p className="text-xs font-bold uppercase tracking-widest text-rose-400">
                    {tier.name}
                  </p>
                  <div className="mt-3 flex items-baseline gap-2">
                    <span className="text-4xl font-bold tracking-tight">
                      {tier.price}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {tier.meta}
                  </p>
                  <p className="mt-4 text-sm font-semibold leading-snug">
                    {tier.headline}
                  </p>
                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                    {tier.bestFor}
                  </p>
                  <ul className="mt-6 flex-1 space-y-2.5">
                    {tier.features.map((f) => (
                      <li key={f} className="flex items-start gap-2">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-rose-400" />
                        <span className="text-sm leading-snug text-foreground/85">
                          {f}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={tier.cta.href}
                    className={`mt-7 inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-bold transition-transform hover:scale-[1.02] ${
                      tier.popular
                        ? "bg-gradient-to-r from-rose-500 to-pink-600 text-white"
                        : "bg-primary text-primary-foreground"
                    }`}
                  >
                    {tier.cta.label}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              ))}
            </div>

            <p className="mx-auto mt-8 max-w-2xl text-center text-xs leading-relaxed text-muted-foreground">
              Every build is deployed to your own accounts — your hosting, your
              database, your Stripe — so revenue and customer data never route
              through us. Infrastructure is billed by your providers at cost.
            </p>
          </div>
        </section>

        {/* ━━━ FAQ (mirrors FAQSchema above) ━━━ */}
        <section className="border-b border-border py-16 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="mx-auto max-w-3xl">
              <h2 className="text-balance text-3xl font-bold tracking-tight md:text-4xl">
                Questions people actually ask
              </h2>
              <div className="mt-10 space-y-8">
                {faqs.map((faq) => (
                  <div
                    key={faq.question}
                    className="border-l-2 border-rose-500/40 pl-5"
                  >
                    <h3 className="text-lg font-bold tracking-tight">
                      {faq.question}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {faq.answer}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ━━━ Final CTA ━━━ */}
        <section className="border-b border-border py-16 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="mx-auto max-w-3xl space-y-5 text-center">
              <h2 className="text-balance text-3xl font-bold tracking-tight md:text-4xl">
                Bring the idea. We will tell you what it costs to charge for it.
              </h2>
              <p className="text-base leading-relaxed text-muted-foreground">
                Scoping is a conversation, not a form — the plumbing is
                predictable, your product surface is not. If an off-the-shelf
                tool already does what you need, we would rather tell you that
                than build it twice.
              </p>
              <div className="flex flex-col justify-center gap-3 pt-2 sm:flex-row">
                <Link
                  href="/order?seed=saas-platforms"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-7 py-3 text-base font-bold text-primary-foreground shadow-[0_0_32px_rgba(255,107,53,0.35)] transition-transform hover:scale-[1.02]"
                >
                  Build my custom quote
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-card/50 px-7 py-3 text-base font-semibold transition-colors hover:border-primary/40"
                >
                  Talk to Mike directly
                </Link>
              </div>
              <p className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                30 minutes from quote to kickoff
              </p>
            </div>
          </div>
        </section>

        {/* ━━━ Related ━━━ */}
        <RelatedServices links={relatedLinks} />
      </main>

      <Footer />
    </>
  )
}
