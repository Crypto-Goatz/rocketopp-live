import type { Metadata } from "next"
import Link from "next/link"
import {
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Mail,
  Calendar,
  ShieldCheck,
} from "lucide-react"
import Footer from "@/components/footer"
import { SectionBg } from "@/components/section-bg"
import { stripe } from "@/lib/stripe"
import { ResetOrder } from "./reset-order"

export const metadata: Metadata = {
  title: "Deposit confirmed — book your kickoff",
  robots: { index: false, follow: false },
}

interface PageProps {
  searchParams: Promise<{ session_id?: string; order_id?: string }>
}

interface ResolvedSession {
  email?: string
  amount: number | null
  currency: string
  orderId?: string
  serviceSlugs: string[]
  oneTimeLabel?: string
  recurringLabel?: string
  contactName?: string
}

async function resolveSession(
  sessionId: string | undefined,
): Promise<ResolvedSession | null> {
  if (!sessionId) return null
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId)
    const meta = session.metadata || {}
    return {
      email:
        session.customer_details?.email || session.customer_email || undefined,
      amount: session.amount_total ?? null,
      currency: session.currency || "usd",
      orderId: meta.order_id,
      serviceSlugs: (meta.service_slugs || "").split(",").filter(Boolean),
      oneTimeLabel: meta.quote_one_time_label,
      recurringLabel: meta.quote_recurring_label,
      contactName: session.customer_details?.name || meta.contact_name,
    }
  } catch (err) {
    console.error("[order/success] retrieve failed:", err)
    return null
  }
}

export default async function OrderSuccessPage({ searchParams }: PageProps) {
  const { session_id, order_id } = await searchParams
  const session = await resolveSession(session_id)

  const bookingUrl =
    process.env.CRM_KICKOFF_BOOKING_URL ||
    "https://api.leadconnectorhq.com/widget/booking/placeholder"
  const bookingUrlConfigured = !!process.env.CRM_KICKOFF_BOOKING_URL

  return (
    <>
      <ResetOrder />

      {/* Hero */}
      <section className="relative overflow-hidden pt-28 pb-12 md:pt-36 md:pb-16">
        <div className="absolute inset-0 grid-background opacity-[0.07] pointer-events-none" />
        <div className="container relative z-10 px-4 md:px-6">
          <div className="max-w-2xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 text-primary mb-6">
              <CheckCircle2 className="w-10 h-10" strokeWidth={2.2} />
            </div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/5 text-sm font-medium text-primary mb-6">
              <Sparkles className="w-4 h-4" />
              Deposit received
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-5">
              Now pick your kickoff time.
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
              {session?.contactName ? `${session.contactName}, your` : "Your"}{" "}
              $50 refundable deposit is in. Book directly on Mike's calendar
              below — kickoff calls run 30 minutes.
            </p>
          </div>
        </div>
      </section>

      {/* Booking widget */}
      <section className="relative overflow-hidden py-12">
        <SectionBg variant="solid-card" />
        <div className="container relative z-10 px-4 md:px-6">
          <div className="max-w-3xl mx-auto">
            <div className="card-lifted-xl p-3 md:p-4 overflow-hidden">
              {bookingUrlConfigured ? (
                <iframe
                  src={bookingUrl}
                  title="Schedule kickoff call"
                  className="w-full rounded-lg border border-border"
                  style={{ minHeight: 720, height: "80vh" }}
                  scrolling="yes"
                  loading="eager"
                />
              ) : (
                <div className="p-10 text-center space-y-3">
                  <Calendar className="w-10 h-10 text-primary mx-auto" />
                  <h3 className="text-xl font-bold">
                    Calendar coming online — Mike will email you in the next
                    hour with a direct booking link.
                  </h3>
                  <p className="text-sm text-muted-foreground max-w-md mx-auto">
                    Your deposit is confirmed and your slot is held. The
                    kickoff calendar embed is being finalized.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* What you get */}
      <section className="relative overflow-hidden py-16">
        <SectionBg variant="solid-deep" />
        <div className="container relative z-10 px-4 md:px-6">
          <div className="max-w-3xl mx-auto">
            <div className="card-lifted-xl p-6 md:p-8 space-y-5">
              <h2 className="text-xl font-bold">What happens at the kickoff</h2>
              <ol className="space-y-4">
                <li className="flex gap-4">
                  <div className="shrink-0 w-8 h-8 rounded-full bg-primary/15 text-primary flex items-center justify-center text-sm font-bold">
                    1
                  </div>
                  <div>
                    <p className="font-semibold">Walk through your AI brief</p>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      We review the brief together and adjust scope live if anything
                      should shift.
                    </p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="shrink-0 w-8 h-8 rounded-full bg-primary/15 text-primary flex items-center justify-center text-sm font-bold">
                    2
                  </div>
                  <div>
                    <p className="font-semibold">Lock the build phases</p>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      We confirm sequencing, deliverables, and the first ship.
                      Same-day work after this call.
                    </p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="shrink-0 w-8 h-8 rounded-full bg-primary/15 text-primary flex items-center justify-center text-sm font-bold">
                    3
                  </div>
                  <div>
                    <p className="font-semibold">Apply your deposit</p>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      $50 deposit applies to your final invoice. Or refund it on
                      the spot if we're not the fit.
                    </p>
                  </div>
                </li>
              </ol>

              {session && session.serviceSlugs.length > 0 && (
                <div className="pt-5 border-t border-border space-y-2">
                  <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">
                    Your locked quote
                  </h3>
                  {session.oneTimeLabel && session.oneTimeLabel !== "$0" && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        One-time build
                      </span>
                      <span className="font-bold tabular-nums">
                        {session.oneTimeLabel}
                      </span>
                    </div>
                  )}
                  {session.recurringLabel && session.recurringLabel !== "$0" && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        Monthly retainer
                      </span>
                      <span className="font-bold tabular-nums text-primary">
                        {session.recurringLabel}/mo
                      </span>
                    </div>
                  )}
                  {session.orderId && (
                    <div className="flex justify-between text-xs pt-1">
                      <span className="text-muted-foreground">Order ID</span>
                      <span className="font-mono text-muted-foreground">
                        {session.orderId}
                      </span>
                    </div>
                  )}
                </div>
              )}

              <div className="pt-5 border-t border-border flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                <ShieldCheck className="w-4 h-4 text-primary shrink-0" />
                <span>
                  $50 refundable for any reason within 7 days of the kickoff
                  call.
                </span>
              </div>
            </div>

            <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/store"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-card/50 px-6 py-2.5 text-sm font-semibold hover:border-primary/40 transition-colors"
              >
                Browse the store
              </Link>
              <a
                href={`mailto:Mike@rocketopp.com?subject=Order ${order_id || ""}`}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-sm font-bold text-primary-foreground hover:scale-[1.02] transition-transform"
              >
                <Mail className="w-4 h-4" />
                Email Mike directly
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}
