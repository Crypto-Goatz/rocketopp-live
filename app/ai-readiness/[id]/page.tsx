import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import {
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Calendar,
  Globe,
  Loader2,
} from "lucide-react"
import { createClient } from "@supabase/supabase-js"
import Footer from "@/components/footer"
import { SectionBg } from "@/components/section-bg"

export const dynamic = "force-dynamic"

interface PageProps {
  params: Promise<{ id: string }>
}

interface Scan {
  id: string
  email: string
  domain: string
  status: "pending" | "complete" | "failed"
  score: number | null
  summary: string | null
  priorities: { title: string; why: string }[] | null
  recommendations: string[] | null
  created_at: string
  completed_at: string | null
}

async function getScan(id: string): Promise<Scan | null> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || ""
  if (!url || !key) return null
  const supabase = createClient(url, key)
  const { data, error } = await supabase
    .from("ai_readiness_scans")
    .select(
      "id,email,domain,status,score,summary,priorities,recommendations,created_at,completed_at",
    )
    .eq("id", id)
    .single()
  if (error || !data) return null
  return data as Scan
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params
  const scan = await getScan(id)
  if (!scan) return { title: "Report not found" }
  return {
    title: `AI Readiness scan — ${scan.domain}${scan.score != null ? ` (${scan.score}/100)` : ""}`,
    robots: { index: false, follow: false },
  }
}

function gradeColor(score: number): { bg: string; text: string; ring: string; label: string } {
  if (score >= 80) return { bg: "bg-emerald-500/10", text: "text-emerald-400", ring: "ring-emerald-500/40", label: "Strong" }
  if (score >= 50) return { bg: "bg-amber-500/10", text: "text-amber-400", ring: "ring-amber-500/40", label: "Mixed" }
  return { bg: "bg-rose-500/10", text: "text-rose-400", ring: "ring-rose-500/40", label: "At risk" }
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export default async function AiReadinessReportPage({ params }: PageProps) {
  const { id } = await params
  const scan = await getScan(id)
  if (!scan) notFound()

  // Pending state — auto-refresh every 5s
  if (scan.status !== "complete" || scan.score == null) {
    return (
      <>
        <meta httpEquiv="refresh" content="5" />
        <section className="relative overflow-hidden pt-28 pb-20 min-h-[60vh] flex items-center">
          <div className="absolute inset-0 grid-background opacity-[0.07] pointer-events-none" />
          <div className="container relative z-10 px-4 md:px-6 text-center">
            <div className="max-w-md mx-auto space-y-4">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary">
                <Loader2 className="w-8 h-8 animate-spin" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold">
                Generating your report…
              </h1>
              <p className="text-muted-foreground">
                Scanning <strong className="text-foreground">{scan.domain}</strong>{" "}
                — this page will refresh automatically in a few seconds.
              </p>
              <p className="text-xs text-muted-foreground pt-3">
                Submitted {formatDate(scan.created_at)}
              </p>
            </div>
          </div>
        </section>
        <Footer />
      </>
    )
  }

  const colors = gradeColor(scan.score)

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden pt-24 pb-12 md:pt-32 md:pb-16">
        <div className="absolute inset-0 grid-background opacity-[0.07] pointer-events-none" />
        <div className="container relative z-10 px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/5 text-sm font-medium text-primary mb-6">
              <Sparkles className="w-4 h-4" />
              AI Readiness Report
            </div>
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-3">
              {scan.domain}
            </h1>
            <p className="text-sm text-muted-foreground inline-flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5" /> {scan.domain}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />{" "}
                {scan.completed_at ? formatDate(scan.completed_at) : formatDate(scan.created_at)}
              </span>
            </p>
          </div>
        </div>
      </section>

      {/* Score */}
      <section className="relative overflow-hidden py-12 md:py-16">
        <SectionBg variant="solid-card" />
        <div className="container relative z-10 px-4 md:px-6">
          <div className="max-w-2xl mx-auto">
            <div
              className={`relative rounded-3xl border-2 ${colors.ring.replace("ring-", "border-")} ${colors.bg} p-8 md:p-12 text-center`}
            >
              <div className={`text-7xl md:text-8xl font-extrabold ${colors.text} leading-none tabular-nums`}>
                {scan.score}
              </div>
              <div className="text-xs uppercase tracking-[0.25em] text-muted-foreground mt-3">
                / 100 · {colors.label}
              </div>
              {scan.summary && (
                <p className="mt-6 text-base md:text-lg leading-relaxed text-foreground/90 max-w-xl mx-auto">
                  {scan.summary}
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Priorities */}
      {scan.priorities && scan.priorities.length > 0 && (
        <section className="relative overflow-hidden py-16 md:py-20">
          <SectionBg variant="solid-deep" />
          <div className="container relative z-10 px-4 md:px-6">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold mb-8">
                Top priorities
              </h2>
              <div className="space-y-3">
                {scan.priorities.map((p, i) => (
                  <div key={i} className="card-lifted p-5 flex gap-4">
                    <div className="shrink-0 w-9 h-9 rounded-full bg-primary/15 text-primary flex items-center justify-center text-sm font-bold tabular-nums">
                      {i + 1}
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold leading-tight">{p.title}</p>
                      <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                        {p.why}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Recommendations */}
      {scan.recommendations && scan.recommendations.length > 0 && (
        <section className="relative overflow-hidden py-16 md:py-20">
          <SectionBg variant="solid-card" />
          <div className="container relative z-10 px-4 md:px-6">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold mb-8">
                What to do next
              </h2>
              <ul className="space-y-3">
                {scan.recommendations.map((r, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-3 p-4 rounded-xl border border-border bg-card/30 backdrop-blur"
                  >
                    <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                    <span className="text-base leading-relaxed">{r}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="relative overflow-hidden py-16 md:py-20">
        <SectionBg variant="seam" />
        <div className="container relative z-10 px-4 md:px-6">
          <div className="max-w-2xl mx-auto text-center space-y-5">
            <h2 className="text-3xl md:text-4xl font-bold">
              Ready to fix it?
            </h2>
            <p className="text-muted-foreground">
              We can implement every priority on this list. Build a custom
              quote in 60 seconds, or book a free 30-minute call to talk it
              through.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
              <Link
                href="/order"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-7 py-3 text-base font-bold text-primary-foreground shadow-[0_0_32px_rgba(255,107,53,0.35)] hover:scale-[1.02] transition-transform"
              >
                Build my custom quote
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href={process.env.ROCKETAPPOINTMENTS_URL || "https://rocketappointments.com"}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-card/50 px-7 py-3 text-base font-semibold hover:border-primary/40 transition-colors"
              >
                Book a 30-min call
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}
