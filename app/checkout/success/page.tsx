import type { Metadata } from "next"
import Link from "next/link"
import { CheckCircle2, Sparkles, ArrowRight, Mail, Clock } from "lucide-react"
import Footer from "@/components/footer"
import { SectionBg } from "@/components/section-bg"
import { stripe } from "@/lib/stripe"
import { ClearCart } from "./clear-cart"

export const metadata: Metadata = {
  title: "Thanks — Your order is in",
  robots: { index: false, follow: false },
}

interface PageProps {
  searchParams: Promise<{ session_id?: string }>
}

interface ResolvedSession {
  email?: string
  amount: number | null
  currency: string
  itemNames: string[]
  receiptUrl?: string | null
  mode: string | null
}

async function resolveSession(sessionId: string | undefined): Promise<ResolvedSession | null> {
  if (!sessionId) return null
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["line_items", "line_items.data.price.product"],
    })
    const items = (session.line_items?.data || []).map((li) => {
      const p = li.price?.product
      const name =
        typeof p === "object" && p && "name" in p
          ? (p.name as string)
          : li.description || "Item"
      return name
    })
    return {
      email: session.customer_details?.email || session.customer_email || undefined,
      amount: session.amount_total ?? null,
      currency: session.currency || "usd",
      itemNames: items,
      mode: session.mode,
    }
  } catch (err) {
    console.error("[checkout/success] retrieve failed:", err)
    return null
  }
}

function formatUsd(cents: number, currency = "usd"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(cents / 100)
}

export default async function CheckoutSuccessPage({ searchParams }: PageProps) {
  const { session_id } = await searchParams
  const session = await resolveSession(session_id)

  return (
    <>
      <ClearCart />

      <section className="relative overflow-hidden pt-28 pb-12 md:pt-36 md:pb-16">
        <div className="absolute inset-0 grid-background opacity-[0.07] pointer-events-none" />
        <div className="container relative z-10 px-4 md:px-6">
          <div className="max-w-2xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 text-primary mb-6">
              <CheckCircle2 className="w-10 h-10" strokeWidth={2.2} />
            </div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/5 text-sm font-medium text-primary mb-6">
              <Sparkles className="w-4 h-4" />
              Order received
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-5">
              You're in.
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
              Your order is confirmed and we've kicked off the build. A
              receipt is on its way to{" "}
              {session?.email ? (
                <strong className="text-foreground">{session.email}</strong>
              ) : (
                "your inbox"
              )}{" "}
              right now.
            </p>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden py-16 md:py-20">
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
                      <Mail className="w-4 h-4 text-primary" />
                      Receipt + onboarding email
                    </p>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      Sent immediately. Includes your order number and a link
                      to start the intake.
                    </p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="shrink-0 w-8 h-8 rounded-full bg-primary/15 text-primary flex items-center justify-center text-sm font-bold">
                    2
                  </div>
                  <div>
                    <p className="font-semibold flex items-center gap-2">
                      <Clock className="w-4 h-4 text-primary" />
                      Kickoff within 24 hours
                    </p>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      Mike personally reviews every order and reaches out
                      with next steps the same business day.
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
                      Build starts
                    </p>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      Standard turnaround on every product is published —
                      we'll hit it or refund the difference.
                    </p>
                  </div>
                </li>
              </ol>

              {session && session.itemNames.length > 0 && (
                <div className="pt-5 border-t border-border space-y-3">
                  <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">
                    Order details
                  </h3>
                  <ul className="space-y-1.5 text-sm">
                    {session.itemNames.map((n, i) => (
                      <li key={i} className="flex justify-between">
                        <span>{n}</span>
                      </li>
                    ))}
                  </ul>
                  {session.amount != null && (
                    <div className="flex justify-between pt-3 border-t border-border font-bold">
                      <span>Total</span>
                      <span className="text-primary tabular-nums">
                        {formatUsd(session.amount, session.currency)}
                        {session.mode === "subscription" && (
                          <span className="text-xs font-normal text-muted-foreground">
                            {" "}
                            /mo
                          </span>
                        )}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/store"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-card/50 px-6 py-2.5 text-sm font-semibold hover:border-primary/40 transition-colors"
              >
                Browse more
              </Link>
              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-sm font-bold text-primary-foreground hover:scale-[1.02] transition-transform"
              >
                Go to dashboard
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}
