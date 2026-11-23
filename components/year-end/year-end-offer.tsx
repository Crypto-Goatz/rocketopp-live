"use client"

import { useEffect, useState } from "react"
import { ArrowRight, Check, Loader2, Lock, CalendarCheck } from "lucide-react"
import "./year-end.css"

/**
 * THE YEAR-END WEBSITE OFFER (Mike, 2026-11-23). Websites built now through December 31 at one flat year-end price.
 * The price is NOT in this file, the page HTML or any bundle: /api/contact/submit (form "year_end") returns it after a
 * real submit, and only then is it shown. The countdown is to a real deadline (Dec 31, 2026, 23:59 ET). No scarcity
 * numbers, no testimonials. Copy facts: custom built for businesses we feel are a good fit, not cookie-cutter; three
 * patent-pending tools including a free CRM; the consultation is free.
 */

/** Dec 31, 2026 23:59:59 Eastern (EST, UTC-5). */
export const YEAR_END_DEADLINE = Date.parse("2027-01-01T04:59:59Z")

const TRADE_OPTIONS = [
  "Plumbing", "HVAC", "Electrical", "Roofing", "Landscaping", "Cleaning", "Contracting / remodeling", "Auto repair",
  "Salon or spa", "Pet care", "Moving", "Pest control", "Other",
]
/** /free-website/<slug> → the matching option, so a trade page arrives pre-filled. */
const TRADE_BY_SLUG: Record<string, string> = {
  plumbers: "Plumbing", hvac: "HVAC", electricians: "Electrical", roofers: "Roofing", landscapers: "Landscaping",
  "cleaning-services": "Cleaning", contractors: "Contracting / remodeling", "auto-repair": "Auto repair",
  "salons-and-spas": "Salon or spa", "pet-care": "Pet care", movers: "Moving", "pest-control": "Pest control",
}
const STATES = [
  "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "DC", "FL", "GA", "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD",
  "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ", "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC",
  "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY",
]

function useNow(intervalMs = 1000) {
  const [now, setNow] = useState<number | null>(null)
  useEffect(() => {
    setNow(Date.now())
    const t = setInterval(() => setNow(Date.now()), intervalMs)
    return () => clearInterval(t)
  }, [intervalMs])
  return now
}

function parts(ms: number) {
  const s = Math.max(0, Math.floor(ms / 1000))
  return { d: Math.floor(s / 86400), h: Math.floor((s % 86400) / 3600), m: Math.floor((s % 3600) / 60), s: s % 60 }
}

export function Countdown({ compact = false }: { compact?: boolean }) {
  const now = useNow()
  if (now !== null && now > YEAR_END_DEADLINE) return <span className="ye-cd-ended">The year-end offer has ended</span>
  const p = now === null ? null : parts(YEAR_END_DEADLINE - now)
  const cells: [string, number | undefined][] = [["days", p?.d], ["hrs", p?.h], ["min", p?.m], ["sec", p?.s]]
  return (
    <div className={compact ? "ye-cd ye-cd-compact" : "ye-cd"} role="timer" aria-label="Time left until December 31 at 11:59 PM Eastern">
      {cells.map(([label, v]) => (
        <div key={label} className="ye-cd-cell">
          <b suppressHydrationWarning>{v === undefined ? "--" : String(v).padStart(2, "0")}</b>
          <span>{label}</span>
        </div>
      ))}
    </div>
  )
}

/** Thin bar for the very top of a page: deadline + one button to the form. */
export function YearEndStrip({ href = "#consultation" }: { href?: string }) {
  return (
    <div className="ye-strip">
      <div className="ye-strip-in">
        <span className="ye-strip-dot" aria-hidden />
        <p><b>Year-end website pricing</b><span> — through December 31</span></p>
        <Countdown compact />
        <a href={href} className="ye-strip-btn">Reveal my price <ArrowRight /></a>
      </div>
    </div>
  )
}

type Reveal = { price: string; headline: string; next: string; bookUrl: string }

export function YearEndOffer({ id = "consultation", trade }: { id?: string; trade?: string }) {
  const [f, setF] = useState({
    firstName: "", lastName: "", business: "", email: "", phone: "", website: "", noWebsite: false,
    city: "", state: "", trade: (trade && TRADE_BY_SLUG[trade]) || "", tradeOther: "",
    rk_hp: "", // honeypot — see app/contact/contact-form.tsx
  })
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState("")
  const [reveal, setReveal] = useState<Reveal | null>(null)

  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setF((p) => ({ ...p, [k]: e.target.type === "checkbox" ? (e.target as HTMLInputElement).checked : e.target.value }))

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setBusy(true)
    try {
      const ctrl = new AbortController()
      const timer = setTimeout(() => ctrl.abort(), 25_000)
      const res = await fetch("/api/contact/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          form: "year_end",
          firstName: f.firstName, lastName: f.lastName, business: f.business, email: f.email, phone: f.phone,
          website: f.noWebsite ? "" : f.website, noWebsite: f.noWebsite, city: f.city, state: f.state,
          trade: f.trade === "Other" ? (f.tradeOther ? `Other: ${f.tradeOther}` : "Other") : f.trade,
          rk_hp: f.rk_hp,
        }),
        signal: ctrl.signal,
      }).finally(() => clearTimeout(timer))
      const data = await res.json().catch(() => ({ error: `The server answered ${res.status}.` }))
      if (!res.ok || !data.reveal) throw new Error(data.error || "Something went wrong")
      setReveal(data.reveal as Reveal)
    } catch (err) {
      const msg = err instanceof Error && err.name !== "AbortError" ? err.message : "That took too long to send"
      setError(`${msg} — please call (878) 888-1230 and we'll take it from there.`)
    } finally {
      setBusy(false)
    }
  }

  return (
    <section id={id} className="ye scroll-mt-24" aria-labelledby={`${id}-title`}>
      <div className="ye-glow" aria-hidden />
      <div className="ye-wrap">
        <div className="ye-pitch">
          <p className="ye-eyebrow"><span className="ye-strip-dot" aria-hidden /> Year-end offer · through December 31</p>
          <h2 id={`${id}-title`} className="ye-h2">
            One flat year-end price. <em>The lowest we&rsquo;ve ever offered.</em>
          </h2>
          <p className="ye-lede">
            We&rsquo;re building websites from now through December 31 at one flat year-end price &mdash; the lowest
            we&rsquo;ve ever offered. Fill out your details to reveal the price.
          </p>
          <Countdown />
          <ul className="ye-points">
            <li><Check /> Custom built for your business &mdash; not cookie-cutter</li>
            <li><Check /> Three of our patent-pending tools, including a free CRM for your customers and leads</li>
            <li><Check /> Free consultation, for businesses we feel are a good fit</li>
          </ul>
        </div>

        <div className="ye-card">
          {reveal ? (
            <div className="ye-reveal" role="status" aria-live="polite">
              <p className="ye-eyebrow">Your year-end price</p>
              <p className="ye-price">{reveal.price}</p>
              <p className="ye-reveal-head">{reveal.headline}</p>
              <p className="ye-reveal-next">{reveal.next}</p>
              <a href={reveal.bookUrl} className="ye-btn" target="_blank" rel="noopener">
                <CalendarCheck /> Book your free consult
              </a>
              <p className="ye-fine">Questions? Call (878) 888-1230.</p>
            </div>
          ) : (
            <form onSubmit={submit}>
              <input type="text" name="rk_hp" value={f.rk_hp} onChange={set("rk_hp")} tabIndex={-1} autoComplete="new-password"
                data-lpignore="true" data-1p-ignore="true" aria-hidden="true" className="ye-hp" />
              <p className="ye-card-title"><Lock /> Reveal your price</p>
              {error && <p className="ye-error" role="alert">{error}</p>}
              <div className="ye-grid">
                <label>First name<span aria-hidden>*</span><input required autoComplete="given-name" value={f.firstName} onChange={set("firstName")} /></label>
                <label>Last name<input autoComplete="family-name" value={f.lastName} onChange={set("lastName")} /></label>
                <label className="ye-full">Business name<span aria-hidden>*</span><input required autoComplete="organization" value={f.business} onChange={set("business")} /></label>
                <label>Email<span aria-hidden>*</span><input required type="email" autoComplete="email" value={f.email} onChange={set("email")} /></label>
                <label>Phone<input type="tel" autoComplete="tel" value={f.phone} onChange={set("phone")} /></label>
                <label className="ye-full">Current website
                  <input type="text" inputMode="url" placeholder="yourbusiness.com" autoComplete="url" value={f.noWebsite ? "" : f.website}
                    onChange={set("website")} disabled={f.noWebsite} />
                </label>
                <label className="ye-check ye-full"><input type="checkbox" checked={f.noWebsite} onChange={set("noWebsite")} /> I don&rsquo;t have one yet</label>
                <label>City<input autoComplete="address-level2" value={f.city} onChange={set("city")} /></label>
                <label>State
                  <select autoComplete="address-level1" value={f.state} onChange={set("state")}>
                    <option value="">Select</option>
                    {STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </label>
                <label className="ye-full">What does your business do?
                  <select value={f.trade} onChange={set("trade")}>
                    <option value="">Select</option>
                    {TRADE_OPTIONS.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </label>
                {f.trade === "Other" && (
                  <label className="ye-full">Tell us in a few words<input value={f.tradeOther} onChange={set("tradeOther")} placeholder="e.g. bakery, photographer" /></label>
                )}
              </div>
              <button type="submit" className="ye-btn" disabled={busy}>
                {busy ? <Loader2 className="ye-spin" /> : <>Reveal my price <ArrowRight /></>}
              </button>
              <p className="ye-fine">By submitting you agree to our <a href="/privacy">Privacy Policy</a>.</p>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}
