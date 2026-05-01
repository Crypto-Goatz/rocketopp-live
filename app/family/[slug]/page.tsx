import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import {
  Activity,
  ArrowRight,
  Bot,
  CheckCircle2,
  Cpu,
  Database,
  Eye,
  ExternalLink,
  FileText,
  GitBranch,
  Globe,
  GraduationCap,
  Layers,
  Lock,
  Mail,
  Rocket,
  Search,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp,
  Workflow,
  Zap,
} from "lucide-react"
import {
  FamilyMember,
  FAMILY_MEMBERS,
  getFamilyMember,
} from "@/lib/rocketopp-family"
import { OrganizationSchema, FAQSchema, BreadcrumbSchema } from "@/components/seo/json-ld"
import Footer from "@/components/footer"
import LeadCaptureForm from "@/components/family/lead-capture-form"
import UcpLiveStrip from "@/components/ucp-live-strip"

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Activity,
  Bot,
  CheckCircle2,
  Cpu,
  Database,
  Eye,
  FileText,
  GitBranch,
  Globe,
  GraduationCap,
  Layers,
  Lock,
  Mail,
  Rocket,
  Search,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp,
  Workflow,
  Zap,
}

function Icon({ name, className }: { name?: string; className?: string }) {
  const Cmp = name ? ICON_MAP[name] : null
  if (!Cmp) return <Sparkles className={className} />
  return <Cmp className={className} />
}

// ━━━ Static params + metadata ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export function generateStaticParams() {
  return FAMILY_MEMBERS.map((m) => ({ slug: m.slug }))
}

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const member = getFamilyMember(slug)
  if (!member) return { title: "Not Found | RocketOpp" }

  const keywordList = member.keywords.map((k) => k.query).join(", ")
  const canonical = `https://rocketopp.com/family/${member.slug}`

  return {
    title: `${member.name} — ${member.tagline.split(".")[0]} | RocketOpp Family`,
    description: member.bluf.slice(0, 160),
    keywords: keywordList,
    openGraph: {
      title: `${member.name} | RocketOpp Family`,
      description: member.tagline,
      url: canonical,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${member.name} | RocketOpp Family`,
      description: member.tagline,
    },
    alternates: { canonical },
  }
}

// ━━━ Page ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export default async function FamilyDeepDivePage({ params }: PageProps) {
  const { slug } = await params
  const member = getFamilyMember(slug)
  if (!member) return notFound()

  return (
    <>
      <OrganizationSchema description={member.bluf} />
      <FAQSchema items={member.faqs} />
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "https://rocketopp.com" },
          { name: "Family", url: "https://rocketopp.com/family" },
          { name: member.name, url: `https://rocketopp.com/family/${member.slug}` },
        ]}
      />

      <main className="min-h-screen">
        {/* ━━━ Hero (BLUF + Living DOM marker + stats) ━━━ */}
        <section className="relative overflow-hidden border-b border-border">
          <div
            aria-hidden
            className="pointer-events-none absolute -top-20 left-1/2 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-primary/[0.06] blur-[140px]"
          />
          <div className="container relative z-10 px-4 py-14 md:px-6 md:py-20">
            {/* Living DOM marker */}
            <div className="mb-6 flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground/70">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
              </span>
              <span className="font-mono text-[10px] tracking-widest text-emerald-500">
                Living DOM Active
              </span>
              <span aria-hidden className="text-muted-foreground/30">·</span>
              <span className="font-mono text-[10px] tracking-widest text-muted-foreground/70">
                Part of the RocketOpp family
              </span>
            </div>

            {/* Brand badge */}
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/8 px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-widest text-primary">
              <Icon name={member.icon} className="h-3 w-3" />
              {member.name}
            </div>

            {/* H1 */}
            <h1 className="text-balance text-4xl font-bold tracking-tight md:text-6xl">
              <span className="bg-gradient-to-r from-primary via-orange-400 to-primary bg-clip-text text-transparent">
                {member.name}
              </span>
            </h1>
            <p className="mt-4 max-w-3xl text-base text-muted-foreground md:text-xl">
              {member.tagline}
            </p>

            {/* BLUF block */}
            <div className="mt-8 rounded-2xl border-l-4 border-primary bg-primary/[0.04] p-6 md:p-8">
              <div className="mb-2 font-mono text-[10px] uppercase tracking-widest text-primary">
                Bottom Line Up Front
              </div>
              <p className="text-balance text-lg font-semibold leading-relaxed text-foreground md:text-xl">
                {member.bluf}
              </p>
              <p className="mt-4 text-base leading-relaxed text-muted-foreground md:text-lg">
                {member.context}
              </p>
            </div>

            {/* Stats */}
            <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {member.stats.map((s) => (
                <div
                  key={s.label}
                  className="rounded-2xl border border-border bg-card/50 px-4 py-4 text-center backdrop-blur"
                >
                  <div className="text-2xl font-black tabular-nums text-primary md:text-3xl">
                    {s.value}
                  </div>
                  <div className="mt-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>

            {/* Visit live site CTA */}
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <a
                href={member.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-base font-bold text-primary-foreground shadow-[0_0_28px_rgba(255,107,0,0.35)] transition-transform hover:scale-[1.02]"
              >
                Visit {member.name}
                <ExternalLink className="h-4 w-4" />
              </a>
              <a
                href="#lead"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-card/40 px-6 py-3 text-base font-semibold text-foreground transition-colors hover:border-primary/40 hover:text-primary"
              >
                Get the deep-dive
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </section>

        <UcpLiveStrip />

        {/* ━━━ Build story ━━━ */}
        <section className="border-b border-border py-16 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="mx-auto max-w-3xl">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/8 px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-widest text-primary">
                <GitBranch className="h-3 w-3" />
                The build
              </div>
              <h2 className="text-balance text-3xl font-bold tracking-tight md:text-4xl">
                How {member.name} got built — and why.
              </h2>
              <div className="mt-6 space-y-5 text-base leading-relaxed text-muted-foreground md:text-lg">
                {member.buildStory.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ━━━ 0nMCP utilization ━━━ */}
        <section className="border-b border-border py-16 md:py-24 bg-card/30">
          <div className="container px-4 md:px-6">
            <div className="mx-auto max-w-3xl">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/8 px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-widest text-primary">
                <Cpu className="h-3 w-3" />
                Built on 0nMCP
              </div>
              <h2 className="text-balance text-3xl font-bold tracking-tight md:text-4xl">
                How agentic AI runs {member.name} on autopilot.
              </h2>
              <div className="mt-6 space-y-5 text-base leading-relaxed text-muted-foreground md:text-lg">
                {member.mcpStory.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
              <Link
                href="/family/0nmcp"
                className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
              >
                See how 0nMCP composes the entire family
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </div>
        </section>

        {/* ━━━ Capabilities grid ━━━ */}
        <section className="border-b border-border py-16 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="mx-auto mb-12 max-w-3xl text-center">
              <h2 className="text-balance text-3xl font-bold tracking-tight md:text-4xl">
                What {member.name} actually does.
              </h2>
              <p className="mt-3 text-base text-muted-foreground md:text-lg">
                Six capabilities. Each one composes with the rest of the RocketOpp stack.
              </p>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {member.capabilities.map((c) => (
                <div
                  key={c.title}
                  className="rounded-2xl border border-border bg-card/50 p-6 backdrop-blur transition-colors hover:border-primary/40"
                >
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl border border-primary/30 bg-primary/10 text-primary">
                    <Icon name={c.icon} className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground">{c.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{c.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ━━━ Benefits checklist ━━━ */}
        <section className="border-b border-border py-16 md:py-24 bg-card/20">
          <div className="container px-4 md:px-6">
            <div className="mx-auto max-w-3xl">
              <h2 className="text-balance text-3xl font-bold tracking-tight md:text-4xl">
                Why {member.name} matters to your business.
              </h2>
              <ul className="mt-8 space-y-3">
                {member.benefits.map((b) => (
                  <li
                    key={b}
                    className="flex items-start gap-3 rounded-xl border border-border bg-card/50 p-4 backdrop-blur"
                  >
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                    <span className="text-base text-foreground md:text-lg">{b}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* ━━━ Lead-capture form (the conversion event) ━━━ */}
        <section id="lead" className="relative overflow-hidden border-b border-border py-16 md:py-24">
          <div
            aria-hidden
            className="pointer-events-none absolute -top-32 left-1/2 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-primary/[0.08] blur-[140px]"
          />
          <div className="container relative z-10 px-4 md:px-6">
            <div className="mx-auto max-w-2xl">
              <div className="mb-6 text-center">
                <h2 className="text-balance text-3xl font-bold tracking-tight md:text-4xl">
                  Get the {member.name} deep-dive.
                </h2>
                <p className="mt-3 text-base text-muted-foreground md:text-lg">
                  Architecture notes, real-world build stories, the agentic AI patterns we use to make it run on autopilot. Drop your email — we&apos;ll send it.
                </p>
              </div>
              <LeadCaptureForm
                familySlug={member.slug}
                familyName={member.name}
                offer={`Send me the ${member.name} deep-dive + a personal note from Mike`}
                cta="Send the deep-dive"
                tags={[`family-${member.slug}-leadgen`]}
              />
            </div>
          </div>
        </section>

        {/* ━━━ FAQ ━━━ */}
        <section className="border-b border-border py-16 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="mx-auto max-w-3xl text-center mb-12">
              <h2 className="text-balance text-3xl font-bold tracking-tight md:text-4xl">
                Frequently asked questions
              </h2>
              <p className="mt-3 text-base text-muted-foreground md:text-lg">
                The honest answers a buyer would want before booking a call.
              </p>
            </div>
            <div className="mx-auto max-w-3xl space-y-4">
              {member.faqs.map((f) => (
                <details
                  key={f.question}
                  className="group rounded-2xl border border-border bg-card/50 p-5 transition-colors hover:border-primary/40"
                >
                  <summary className="flex cursor-pointer items-start justify-between gap-3 list-none">
                    <h3 className="text-base font-bold text-foreground md:text-lg">
                      {f.question}
                    </h3>
                    <span className="font-mono text-xl text-primary transition-transform group-open:rotate-45">
                      +
                    </span>
                  </summary>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground md:text-base">
                    {f.answer}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* ━━━ Related family members ━━━ */}
        <section className="border-t border-border bg-card/20 py-14 md:py-20">
          <div className="container px-4 md:px-6">
            <div className="mx-auto max-w-3xl text-center mb-10">
              <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
                Other RocketOpp family sites
              </h2>
              <p className="mt-2 text-sm text-muted-foreground md:text-base">
                Each one composes with {member.name}. Pick another to explore.
              </p>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {(member.related ?? FAMILY_MEMBERS.filter((m) => m.slug !== member.slug).slice(0, 6).map((m) => m.slug))
                .map((rs) => {
                  const r = getFamilyMember(rs)
                  if (!r) return null
                  return (
                    <Link
                      key={r.slug}
                      href={`/family/${r.slug}`}
                      className="group flex items-start gap-3 rounded-2xl border border-border bg-card/50 p-4 backdrop-blur transition-colors hover:border-primary/40"
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-primary/30 bg-primary/10 text-primary">
                        <Icon name={r.icon} className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-semibold text-foreground group-hover:text-primary">
                          {r.name}
                        </div>
                        <div className="mt-0.5 text-xs text-muted-foreground line-clamp-2">
                          {r.tagline}
                        </div>
                      </div>
                      <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground/50 transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
                    </Link>
                  )
                })}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
