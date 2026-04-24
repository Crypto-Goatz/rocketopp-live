'use client'

/**
 * HIPAA Partner (affiliate) landing — matches /hipaa visual system.
 *
 *   - HipaaAnimatedBackground behind everything
 *   - Signup form posts to /api/hipaa/affiliate/signup → returns slug + portal
 *   - On success: shows referral link + "Open affiliate dashboard" CTA
 */

import { useState, useMemo } from 'react'
import Link from 'next/link'
import {
  ArrowRight, CheckCircle2, Link2, Gift, Wallet, DollarSign, Users,
  Copy, CheckCheck, Sparkles, Share2, Mail, Linkedin, Building2,
  TrendingUp, Rocket, ShieldCheck, Loader2,
} from 'lucide-react'
import { RocketOppLogo } from '@/components/logo/SiteLogo'
import { HipaaAnimatedBackground } from '@/components/hipaa-animated-background'
import { HipaaChatWidget } from '@/components/hipaa-chat-widget'

const TIER_PAYOUT = [
  { tier: 'Tier 1 — Cited Issues',     price: 149,  payout: 44.7  },
  { tier: 'Tier 2 — Developer Fix Kit', price: 399,  payout: 119.7 },
  { tier: 'Tier 3 — NPRM Overview',     price: 499,  payout: 149.7 },
  { tier: 'Tier 4 — Full Compliance',   price: 899,  payout: 269.7 },
  { tier: 'Enterprise (custom)',        price: 4800, payout: 1440  },
]

interface SignupSuccess {
  slug: string
  referralUrl: string
  portalUrl: string
  existing: boolean
}

export function AffiliateLanding() {
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', company: '', linkedinUrl: '',
    referralSource: '', acceptedTerms: false,
  })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<SignupSuccess | null>(null)
  const [copied, setCopied] = useState(false)

  const canSubmit = form.firstName && form.lastName && form.email && form.acceptedTerms && !submitting

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!canSubmit) return
    setSubmitting(true)
    setError(null)
    try {
      const r = await fetch('/api/hipaa/affiliate/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await r.json()
      if (!r.ok) throw new Error(data?.error || 'signup_failed')
      setSuccess(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'signup_failed')
    } finally {
      setSubmitting(false)
    }
  }

  async function copyLink() {
    if (!success?.referralUrl) return
    await navigator.clipboard.writeText(success.referralUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <>
      <HipaaAnimatedBackground />

      <div className="relative min-h-screen text-white overflow-hidden">
        {/* Mini nav */}
        <header className="relative z-20 border-b border-white/10 bg-black/30 backdrop-blur-xl">
          <div className="mx-auto max-w-6xl px-5 h-14 flex items-center justify-between">
            <Link href="/hipaa" className="flex items-center gap-2 hover:opacity-90">
              <RocketOppLogo className="h-6 w-auto" />
              <span className="text-[11px] font-bold uppercase tracking-widest text-white/50">HIPAA Partner Program</span>
            </Link>
            <Link
              href="/dashboard/affiliate"
              className="text-xs font-semibold text-white/70 hover:text-white"
            >
              Partner dashboard →
            </Link>
          </div>
        </header>

        {/* Hero */}
        <section className="relative z-10 mx-auto max-w-6xl px-5 pt-12 pb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-400/30 bg-emerald-400/10 text-emerald-300 text-[10px] font-bold uppercase tracking-[0.22em] mb-4">
            <Sparkles className="w-3 h-3" /> New · Now enrolling
          </div>
          <h1 className="text-4xl md:text-6xl font-black leading-[1.05] tracking-tight max-w-3xl">
            Refer healthcare. <br />
            <span className="bg-gradient-to-r from-emerald-300 via-cyan-300 to-sky-300 bg-clip-text text-transparent">
              Earn 30% on every report.
            </span>
          </h1>
          <p className="mt-5 text-lg text-white/70 max-w-2xl">
            Partner with the fastest HIPAA compliance scanner on the market. Share one link —
            get paid every time a covered entity, business associate, or healthcare agency
            buys a report. Payouts through the RocketOpp partner engine.
          </p>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-3 max-w-3xl">
            <Stat icon={<DollarSign className="h-4 w-4" />} label="Commission" value="30%" sub="on every paid tier" />
            <Stat icon={<Users className="h-4 w-4" />} label="Audience fit" value="150K+" sub="US covered entities" />
            <Stat icon={<TrendingUp className="h-4 w-4" />} label="Top payout" value="$1,440" sub="per enterprise referral" />
          </div>
        </section>

        {/* Two-column: signup + what you get */}
        <section className="relative z-10 mx-auto max-w-6xl px-5 py-6 grid md:grid-cols-[1.1fr_1fr] gap-8 items-start">
          {/* Signup / success card */}
          <div className="rounded-3xl border border-white/15 bg-gradient-to-br from-slate-900/80 to-black/60 backdrop-blur-xl p-7 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.8)]">
            {!success ? (
              <>
                <div className="flex items-center gap-2 mb-4">
                  <Rocket className="h-4 w-4 text-emerald-400" />
                  <h2 className="text-xl font-bold">Activate in 60 seconds</h2>
                </div>
                <p className="text-sm text-white/60 mb-6">
                  Submit the form, get your unique referral link + marketing kit instantly.
                  No interview, no waitlist.
                </p>

                <form onSubmit={onSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="First name *" value={form.firstName} onChange={(v) => setForm({ ...form, firstName: v })} />
                    <Field label="Last name *"  value={form.lastName}  onChange={(v) => setForm({ ...form, lastName: v })} />
                  </div>
                  <Field label="Work email *"  type="email" value={form.email}   onChange={(v) => setForm({ ...form, email: v })} />
                  <Field label="Company (optional)" value={form.company}   onChange={(v) => setForm({ ...form, company: v })} />
                  <Field label="LinkedIn URL (optional)" value={form.linkedinUrl} onChange={(v) => setForm({ ...form, linkedinUrl: v })} placeholder="https://linkedin.com/in/..." />
                  <Field label="How will you refer clients? (optional)" value={form.referralSource} onChange={(v) => setForm({ ...form, referralSource: v })} placeholder="LinkedIn DMs, newsletter, client base..." />

                  <label className="flex items-start gap-2.5 text-[12px] text-white/70 cursor-pointer select-none pt-2">
                    <input
                      type="checkbox"
                      checked={form.acceptedTerms}
                      onChange={(e) => setForm({ ...form, acceptedTerms: e.target.checked })}
                      className="mt-0.5 h-4 w-4 rounded border-white/20 bg-black/40 accent-emerald-400"
                    />
                    <span>
                      I agree to the RocketOpp partner terms: 30% commission on paid HIPAA reports,
                      payouts monthly via ACH or PayPal after a 14-day chargeback window, no
                      self-referrals, no paid search on RocketOpp trademarks.
                    </span>
                  </label>

                  {error && (
                    <div className="text-[12px] font-medium text-rose-300 bg-rose-500/10 border border-rose-500/30 rounded-lg px-3 py-2">
                      {error.replace(/_/g, ' ')}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={!canSubmit}
                    className="w-full inline-flex items-center justify-center gap-2 px-5 h-12 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-black font-bold text-sm disabled:opacity-50 hover:brightness-110"
                  >
                    {submitting ? <><Loader2 className="h-4 w-4 animate-spin" /> Activating…</> : <>Create my partner account <ArrowRight className="h-4 w-4" /></>}
                  </button>
                </form>
              </>
            ) : (
              <div>
                <div className="flex items-center gap-2 mb-3 text-emerald-300">
                  <CheckCircle2 className="h-5 w-5" />
                  <h2 className="text-xl font-bold">
                    {success.existing ? 'Welcome back — your link is ready.' : "You're in. Welcome to the program."}
                  </h2>
                </div>
                <p className="text-sm text-white/65 mb-6">
                  Here is your unique referral link. Anyone who lands on /hipaa with
                  <code className="mx-1 px-1.5 py-0.5 rounded bg-white/10 text-[11px] text-white/80">?ref={success.slug}</code>
                  and buys gets tracked to you.
                </p>

                <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4 flex items-center justify-between gap-3 mb-5">
                  <div className="flex items-center gap-3 min-w-0">
                    <Link2 className="h-4 w-4 text-emerald-300 shrink-0" />
                    <code className="text-xs md:text-sm text-white truncate">{success.referralUrl}</code>
                  </div>
                  <button
                    onClick={copyLink}
                    className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest px-3 h-8 rounded-md bg-emerald-500/20 text-emerald-200 border border-emerald-500/30 hover:bg-emerald-500/30"
                  >
                    {copied ? <><CheckCheck className="h-3.5 w-3.5" /> Copied</> : <><Copy className="h-3.5 w-3.5" /> Copy</>}
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <a
                    href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(success.referralUrl)}`}
                    target="_blank" rel="noreferrer"
                    className="inline-flex items-center justify-center gap-2 h-11 rounded-lg bg-[#0A66C2]/90 text-white text-xs font-semibold hover:bg-[#0A66C2]"
                  >
                    <Linkedin className="h-4 w-4" /> Share on LinkedIn
                  </a>
                  <a
                    href={`mailto:?subject=${encodeURIComponent('HIPAA compliance scan — worth a look')}&body=${encodeURIComponent(`Just ran one of these for a client — fast and rule-cited. Take a look: ${success.referralUrl}`)}`}
                    className="inline-flex items-center justify-center gap-2 h-11 rounded-lg bg-white/10 border border-white/15 text-white text-xs font-semibold hover:bg-white/15"
                  >
                    <Mail className="h-4 w-4" /> Email a client
                  </a>
                </div>

                <Link
                  href={`/dashboard/affiliate?email=${encodeURIComponent(form.email)}`}
                  className="mt-5 inline-flex items-center justify-center gap-2 w-full h-12 rounded-xl bg-white text-black font-bold text-sm hover:bg-white/90"
                >
                  Open partner dashboard <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            )}
          </div>

          {/* Right rail: benefits */}
          <div className="space-y-5">
            <Benefit icon={<DollarSign className="h-4 w-4" />} title="30% commission on every tier">
              $44.70 on a $149 report. $269.70 on a $899 Full Compliance. $1,440 on a $4,800 enterprise deal.
            </Benefit>
            <Benefit icon={<Wallet className="h-4 w-4" />} title="Monthly payouts — ACH or PayPal">
              Commissions clear a 14-day chargeback window, then auto-pay on the 1st. Payment info configured in your partner dashboard.
            </Benefit>
            <Benefit icon={<Share2 className="h-4 w-4" />} title="Marketing kit included">
              Copy-paste LinkedIn posts, email sequences, the NPRM one-pager, and a $149 starter-tier explainer PDF.
            </Benefit>
            <Benefit icon={<ShieldCheck className="h-4 w-4" />} title="Cookie window: 60 days">
              If someone clicks your link and buys any tier in the next 60 days, it's yours — even if they check out later.
            </Benefit>
            <Benefit icon={<Building2 className="h-4 w-4" />} title="Built for consultancies + MSPs">
              Refer one regional hospital system and a single Full Compliance order pays more than most Stripe Atlas filings.
            </Benefit>
          </div>
        </section>

        {/* Payout table */}
        <section className="relative z-10 mx-auto max-w-6xl px-5 py-12">
          <h2 className="text-2xl font-bold mb-1">What each referral pays</h2>
          <p className="text-sm text-white/55 mb-5">All tiers are one-time payments. You earn on the purchase, not per-month billing.</p>
          <div className="rounded-2xl border border-white/10 bg-black/30 overflow-hidden">
            <div className="grid grid-cols-3 px-5 py-3 border-b border-white/10 text-[10px] font-bold uppercase tracking-widest text-white/50">
              <div>Product</div>
              <div className="text-right">Customer pays</div>
              <div className="text-right">You earn</div>
            </div>
            {TIER_PAYOUT.map((t) => (
              <div key={t.tier} className="grid grid-cols-3 px-5 py-3.5 border-b border-white/5 last:border-0 items-center">
                <div className="text-sm font-semibold">{t.tier}</div>
                <div className="text-right text-sm text-white/70 tabular-nums">${t.price.toLocaleString()}</div>
                <div className="text-right text-sm font-bold text-emerald-300 tabular-nums">${t.payout.toLocaleString()}</div>
              </div>
            ))}
          </div>
          <p className="text-[11px] text-white/40 mt-3">Enterprise payouts reflect 30% of the base engagement fee; custom-scope work may include additional bonuses negotiated in writing.</p>
        </section>

        {/* FAQ */}
        <section className="relative z-10 mx-auto max-w-4xl px-5 py-10 space-y-4">
          <h2 className="text-2xl font-bold mb-2">FAQ</h2>
          <Faq q="When do I get paid?">
            Commissions clear a 14-day chargeback window, then pay out on the 1st of the following month via ACH or PayPal.
            Enter your payout info in the partner dashboard once you sign up.
          </Faq>
          <Faq q="How is tracking handled?">
            Your link includes <code className="px-1 py-0.5 rounded bg-white/10 text-[11px]">?ref=your-slug</code>.
            We set a first-party cookie for 60 days. Any HIPAA report purchase in that window is attributed to you,
            even if they come back through a different channel later.
          </Faq>
          <Faq q="Can I promote on paid ads?">
            Yes — your own domains, LinkedIn sponsored content, newsletters. <strong>No bidding on RocketOpp trademarks</strong>{' '}
            (e.g., "RocketOpp HIPAA", "rocketopp.com"). That kills attribution for everyone and gets your commission clawed back.
          </Faq>
          <Faq q="Do I need to be a compliance expert?">
            No. You refer. We deliver the report. Our AI pipeline writes every finding cited to 45 CFR §164 so your clients get a
            defensible audit artifact without you authoring a word.
          </Faq>
          <Faq q="How does the CRM payout split work?">
            Your payment info feeds directly into the RocketOpp partner engine inside our CRM.
            Commissions are issued from the RocketOpp sub-location on the billed order, so your split
            arrives the same cycle as our invoice clears.
          </Faq>
        </section>

        <footer className="relative z-10 border-t border-white/5 py-8 text-center text-[11px] text-white/35">
          RocketOpp LLC · HIPAA Partner Program ·
          <Link href="/hipaa" className="ml-1 hover:text-white/60">Back to /hipaa</Link>
        </footer>
      </div>

      <HipaaChatWidget />
    </>
  )
}

function Field({ label, value, onChange, type = 'text', placeholder }: {
  label: string; value: string; onChange: (v: string) => void; type?: string; placeholder?: string
}) {
  return (
    <label className="block">
      <span className="block text-[11px] font-bold uppercase tracking-widest text-white/50 mb-1.5">{label}</span>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-11 rounded-lg bg-black/40 border border-white/15 px-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-emerald-400/60 focus:ring-2 focus:ring-emerald-400/15"
      />
    </label>
  )
}

function Stat({ icon, label, value, sub }: { icon: React.ReactNode; label: string; value: string; sub: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-md p-4">
      <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-white/40 mb-1.5">
        {icon} {label}
      </div>
      <div className="text-2xl font-black tabular-nums">{value}</div>
      <div className="text-[11px] text-white/45 mt-0.5">{sub}</div>
    </div>
  )
}

function Benefit({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
      <div className="flex items-center gap-2 mb-1.5">
        <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-emerald-500/15 text-emerald-300 border border-emerald-500/20">{icon}</span>
        <h3 className="text-sm font-bold">{title}</h3>
      </div>
      <p className="text-[13px] text-white/60 leading-relaxed">{children}</p>
    </div>
  )
}

function Faq({ q, children }: { q: string; children: React.ReactNode }) {
  return (
    <details className="group rounded-xl border border-white/10 bg-white/[0.02] px-5 py-3 open:bg-white/[0.04]">
      <summary className="flex items-center justify-between cursor-pointer list-none">
        <span className="text-sm font-semibold">{q}</span>
        <span className="text-white/40 text-lg group-open:rotate-45 transition-transform">+</span>
      </summary>
      <div className="mt-3 text-[13px] text-white/60 leading-relaxed">{children}</div>
    </details>
  )
}
