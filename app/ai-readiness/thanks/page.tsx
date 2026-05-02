import type { Metadata } from "next"
import Link from "next/link"
import { CheckCircle2, Mail, Sparkles, ArrowRight, Clock } from "lucide-react"
import Footer from "@/components/footer"
import { SectionBg } from "@/components/section-bg"

export const metadata: Metadata = {
  title: "Your AI Readiness scan is in motion",
  robots: { index: false, follow: false },
}

interface PageProps {
  searchParams: Promise<{ scanId?: string }>
}

export default async function ThanksPage({ searchParams }: PageProps) {
  const { scanId } = await searchParams

  return (
    <>
      <section className="relative overflow-hidden pt-28 pb-12 md:pt-36 md:pb-16">
        <div className="absolute inset-0 grid-background opacity-[0.07] pointer-events-none" />
        <div className="container relative z-10 px-4 md:px-6">
          <div className="max-w-2xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 text-primary mb-6">
              <CheckCircle2 className="w-10 h-10" strokeWidth={2.2} />
            </div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/5 text-sm font-medium text-primary mb-6">
              <Sparkles className="w-4 h-4" />
              Scan started
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-5">
              Your scan is on the way.
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
              Check your inbox in the next 60 seconds — your full AI Readiness
              report is being generated and emailed directly from Mike.
            </p>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden py-12 md:py-16">
        <SectionBg variant="solid-card" />
        <div className="container relative z-10 px-4 md:px-6">
          <div className="max-w-2xl mx-auto">
            <div className="card-lifted-xl p-6 md:p-8 space-y-5">
              <h2 className="text-xl font-bold">What happens next</h2>
              <ol className="space-y-4">
                <li className="flex gap-4">
                  <div className="shrink-0 w-8 h-8 rounded-full bg-primary/15 text-primary flex items-center justify-center text-sm font-bold">
                    1
                  </div>
                  <div>
                    <p className="font-semibold flex items-center gap-2">
                      <Clock className="w-4 h-4 text-primary" />
                      Generated in ~60 seconds
                    </p>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      Our AI scoring engine is running right now — score,
                      priorities, and concrete fix recommendations.
                    </p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="shrink-0 w-8 h-8 rounded-full bg-primary/15 text-primary flex items-center justify-center text-sm font-bold">
                    2
                  </div>
                  <div>
                    <p className="font-semibold flex items-center gap-2">
                      <Mail className="w-4 h-4 text-primary" />
                      Email from mike@rocketopp.com
                    </p>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      Branded report with your full score, top 4 priorities,
                      and 5 actionable recommendations.
                    </p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="shrink-0 w-8 h-8 rounded-full bg-primary/15 text-primary flex items-center justify-center text-sm font-bold">
                    3
                  </div>
                  <div>
                    <p className="font-semibold flex items-center gap-2">
                      <ArrowRight className="w-4 h-4 text-primary" />
                      View it on rocketopp.com
                    </p>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      The email links to a permanent shareable copy at{" "}
                      {scanId ? (
                        <Link
                          href={`/ai-readiness/${scanId}`}
                          className="text-primary hover:underline"
                        >
                          your report page
                        </Link>
                      ) : (
                        "your report page"
                      )}
                      .
                    </p>
                  </div>
                </li>
              </ol>
            </div>

            {scanId && (
              <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  href={`/ai-readiness/${scanId}`}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-base font-bold text-primary-foreground hover:scale-[1.02] transition-transform"
                >
                  View your report
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/store"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-card/50 px-6 py-3 text-sm font-semibold hover:border-primary/40 transition-colors"
                >
                  Browse the store
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}
