import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowUpRight, Sparkles, Lock, Zap } from 'lucide-react'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { LEAD_TOOLS, type LeadTool } from '@/lib/lead-tools/catalog'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'AI Lead Tools — Free Scans, Audits & Assessments | RocketOpp',
  description: 'A library of AI-powered lead-gen tools — HIPAA scans, AI readiness audits, SXO scans, lead magnet builders, and white-label assessments. Run them in minutes. Free + paid tiers. Powered by 0nMCP.',
  alternates: { canonical: 'https://rocketopp.com/ai-lead-tools' },
  openGraph: {
    title: 'AI Lead Tools — RocketOpp · powered by 0nMCP',
    description: 'Run scans. Score sites. Generate lead magnets. Audit AI-readiness. The mini-app library that doubles as your lead engine.',
    url: 'https://rocketopp.com/ai-lead-tools',
    type: 'website',
    images: [{ url: 'https://rocketopp.com/images/rocketopp-og.png', width: 1200, height: 630, alt: 'RocketOpp AI Lead Tools' }],
  },
  twitter: { card: 'summary_large_image', title: 'AI Lead Tools — RocketOpp', description: 'Free + paid AI scans, audits & assessments. Powered by 0nMCP.' },
}

const STATUS_ORDER: Record<LeadTool['status'], number> = { live: 0, beta: 1, soon: 2 }
const sorted = [...LEAD_TOOLS].sort((a, b) => STATUS_ORDER[a.status] - STATUS_ORDER[b.status])

export default function Page() {
  const liveCount = LEAD_TOOLS.filter(t => t.status === 'live').length
  const totalCount = LEAD_TOOLS.length

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <main className="pt-24 pb-20">
        {/* Hero */}
        <section className="container mx-auto px-4 max-w-5xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-orange-500/30 bg-orange-500/5 text-orange-400 text-[10px] font-bold uppercase tracking-[0.22em] mb-5">
            <Sparkles className="w-3 h-3" /> Powered by 0nMCP
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-[1.04] mb-5 max-w-4xl">
            AI Lead Tools. <br />
            <span className="bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
              Scan. Assess. Score. Win.
            </span>
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl">
            A growing library of AI-powered diagnostic tools — run a scan, get a score, walk away with a real strategy. Each one captures the lead, ships an actual report, and feeds your dashboard.
          </p>
          <div className="mt-8 flex items-center gap-3 flex-wrap">
            <Link
              href="/apex"
              className="inline-flex items-center gap-2 h-11 px-5 rounded-lg bg-gradient-to-r from-orange-500 to-amber-500 text-black font-bold text-sm hover:brightness-110 transition"
            >
              Start with the free assessment <ArrowUpRight className="w-4 h-4" />
            </Link>
            <Link
              href="/hipaa"
              className="inline-flex items-center gap-2 h-11 px-5 rounded-lg border border-white/15 bg-white/[0.03] text-sm font-semibold hover:bg-white/[0.06] transition"
            >
              HIPAA Scan ($149)
            </Link>
          </div>
          <p className="text-xs text-muted-foreground mt-5 font-mono">
            — {liveCount} live · {totalCount - liveCount} shipping next · all powered by 0nMCP
          </p>
        </section>

        {/* Trust strip */}
        <section className="container mx-auto px-4 max-w-5xl mt-16">
          <div className="grid sm:grid-cols-3 gap-3">
            <Trust icon={<Zap className="w-4 h-4" />}      label="Real reports"    body="Every tool ships a real artifact — PDF, dashboard, or actionable plan. Not just a promise." />
            <Trust icon={<Lock className="w-4 h-4" />}     label="Locked-in pricing" body="The price you see is the price you pay. Onboarding only adjusts it downward." />
            <Trust icon={<Sparkles className="w-4 h-4" />} label="Affiliate-ready"   body="White-label any tool to your audience. 30% recurring on every paid tier." />
          </div>
        </section>

        {/* Tool grid */}
        <section className="container mx-auto px-4 max-w-6xl mt-20">
          <div className="flex items-baseline justify-between mb-6 flex-wrap gap-3">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight">— The library</h2>
            <span className="text-xs text-muted-foreground font-mono">{sorted.length} tools</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {sorted.map(tool => <ToolCard key={tool.slug} tool={tool} />)}
          </div>
        </section>

        {/* Affiliate CTA */}
        <section className="container mx-auto px-4 max-w-5xl mt-24">
          <div className="rounded-2xl border border-orange-500/20 bg-gradient-to-br from-orange-500/5 to-transparent p-7 md:p-9 grid md:grid-cols-[1fr,auto] gap-5 items-center">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-orange-400 mb-2">— Agency partner program</div>
              <h3 className="text-2xl md:text-3xl font-bold tracking-tight mb-2">
                White-label these tools. Pass them to your clients.
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl">
                Drop your branding on any scan, share the affiliate URL, earn 30% on every conversion. We host, maintain, and run the AI — you keep the relationship.
              </p>
            </div>
            <Link
              href="/hipaa/affiliate"
              className="inline-flex items-center gap-2 h-12 px-6 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-black font-bold text-sm hover:brightness-110 transition whitespace-nowrap"
            >
              Become a partner <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

function ToolCard({ tool }: { tool: LeadTool }) {
  const Icon = tool.icon
  const isLive = tool.status === 'live'

  return (
    <Link
      href={tool.href}
      className="group relative block rounded-2xl border border-border/60 bg-card/40 backdrop-blur-sm hover:border-primary/30 transition-all duration-300 hover:-translate-y-0.5 overflow-hidden"
    >
      {/* Hero image */}
      {tool.imageUrl ? (
        <div className="relative aspect-[16/9] w-full overflow-hidden bg-black">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={tool.imageUrl}
            alt={tool.name}
            loading="lazy"
            className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${!isLive ? 'opacity-70' : ''}`}
          />
          <div className="absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-card to-transparent pointer-events-none" />
          {tool.badge && (
            <span className={`absolute top-3 right-3 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md border backdrop-blur-md ${
              tool.badge === 'Free'        ? 'border-emerald-500/40 bg-emerald-500/20 text-emerald-300' :
              tool.badge === 'Best seller' ? 'border-orange-500/40 bg-orange-500/20 text-orange-300' :
              tool.badge === 'New'         ? 'border-violet-500/40 bg-violet-500/20 text-violet-200' :
                                             'border-amber-500/40 bg-amber-500/20 text-amber-200'
            }`}>{tool.badge}</span>
          )}
        </div>
      ) : (
        <div className={`relative aspect-[16/9] w-full overflow-hidden bg-gradient-to-br ${tool.gradient}`}>
          <div className="absolute inset-0 flex items-center justify-center">
            <Icon className="w-12 h-12 text-white/40" />
          </div>
        </div>
      )}

      <div className="p-6">
        <div className="flex items-start gap-3 mb-3">
          <div className={`w-9 h-9 -mt-7 rounded-lg bg-gradient-to-br ${tool.gradient} flex items-center justify-center shadow-lg shrink-0 ring-2 ring-card`}>
            <Icon className="w-4 h-4 text-white" />
          </div>
          <h3 className="text-lg font-bold tracking-tight group-hover:text-primary transition-colors flex-1 min-w-0 leading-snug">
            {tool.name}
          </h3>
        </div>

        <p className="text-sm text-muted-foreground mb-5 leading-relaxed">{tool.tagline}</p>

        <div className="flex items-end justify-between">
          <div>
            <div className="text-2xl font-black tracking-tight">{tool.priceLabel}</div>
            <div className="text-[11px] text-muted-foreground font-mono mt-0.5">{tool.delivery}</div>
          </div>
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary group-hover:gap-2 transition-all">
            {tool.ctaLabel} <ArrowUpRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>
    </Link>
  )
}

function Trust({ icon, label, body }: { icon: React.ReactNode; label: string; body: string }) {
  return (
    <div className="rounded-xl border border-border/60 bg-card/40 p-5">
      <div className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-orange-400 mb-2">
        {icon} — {label}
      </div>
      <p className="text-sm text-muted-foreground leading-relaxed">{body}</p>
    </div>
  )
}
