"use client"

/**
 * Lead Capture Form — drop-in form used on every /family/[slug] deep-dive page.
 *
 * POSTs to /api/leads which fires the existing CRM notify pipeline. Fields
 * captured: firstName, email, phone (optional), the family slug, and the page URL.
 * Tags vary by family member so segments stay clean in the CRM.
 */

import { useState } from "react"
import { ArrowRight, CheckCircle2, Loader2 } from "lucide-react"

interface LeadCaptureFormProps {
  familySlug: string
  familyName: string
  /** What the lead gets — shown above the form. */
  offer: string
  /** CTA button copy. */
  cta?: string
  /** Tags applied to the CRM contact when the form fires. */
  tags?: string[]
  /** Optional dark/light variant — defaults to dark. */
  variant?: "dark" | "light"
}

export default function LeadCaptureForm({
  familySlug,
  familyName,
  offer,
  cta = "Get the deep-dive",
  tags = ["RocketOpp Family Lead"],
  variant = "dark",
}: LeadCaptureFormProps) {
  const [firstName, setFirstName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName,
          email,
          phone: phone || undefined,
          source: `family-${familySlug}`,
          formName: `${familyName} Deep-Dive`,
          pageUrl: typeof window !== "undefined" ? window.location.href : `https://rocketopp.com/family/${familySlug}`,
          tags: ["RocketOpp Family", `family-${familySlug}`, ...tags],
        }),
      })
      if (!res.ok) {
        const j = await res.json().catch(() => ({}))
        throw new Error(j.error || `Server returned ${res.status}`)
      }
      setDone(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong — try again or email mike@rocketopp.com")
    } finally {
      setSubmitting(false)
    }
  }

  if (done) {
    return (
      <div className="rounded-2xl border border-primary/30 bg-primary/[0.05] p-6 md:p-8 text-center">
        <CheckCircle2 className="mx-auto mb-3 h-10 w-10 text-primary" />
        <h3 className="text-xl font-bold text-foreground md:text-2xl">You&apos;re in.</h3>
        <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground md:text-base">
          We&apos;ll send the {familyName} deep-dive to <strong className="text-foreground">{email}</strong> shortly. If you&apos;re ready to talk now, reply to that email.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-primary/20 bg-card/40 p-6 backdrop-blur md:p-8">
      <div className="mb-5">
        <div className="font-mono text-[10px] uppercase tracking-widest text-primary mb-2">
          {familyName} — instant lead-gen
        </div>
        <h3 className="text-xl font-bold text-foreground md:text-2xl">{offer}</h3>
      </div>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <div className="md:col-span-1">
          <label className="block font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-1">
            First name *
          </label>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
            className="w-full rounded-xl border border-border bg-background px-4 py-3 text-base text-foreground outline-none focus:border-primary/50"
            placeholder="Your first name"
          />
        </div>
        <div className="md:col-span-1">
          <label className="block font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-1">
            Email *
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full rounded-xl border border-border bg-background px-4 py-3 text-base text-foreground outline-none focus:border-primary/50"
            placeholder="you@company.com"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-1">
            Phone (optional)
          </label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full rounded-xl border border-border bg-background px-4 py-3 text-base text-foreground outline-none focus:border-primary/50"
            placeholder="+1 555 555 5555"
          />
        </div>
      </div>
      {error && (
        <p className="mt-3 text-sm text-red-400">{error}</p>
      )}
      <div className="mt-5 flex items-center justify-between gap-3">
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-base font-bold text-primary-foreground shadow-[0_0_28px_rgba(255,107,0,0.35)] transition-transform hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Sending…
            </>
          ) : (
            <>
              {cta}
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
        <p className="hidden text-xs text-muted-foreground md:block">
          No spam. Unsubscribe anytime. Mike reads every reply personally.
        </p>
      </div>
    </form>
  )
}
