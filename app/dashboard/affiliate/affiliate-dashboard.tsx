'use client'

/**
 * HIPAA Partner Dashboard
 *
 *   - Lookup by email (lightweight claim) — matches the email used at signup.
 *   - Shows referral link, click/conversion stats, downloads, and payout info.
 *   - Payout form updates hipaa_affiliates.payout_* columns via PUT.
 */

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import {
  Link2, Copy, CheckCheck, Download, Wallet, TrendingUp, Users, DollarSign,
  Loader2, ArrowRight, Mail, Linkedin, FileText, Sparkles, Lock,
} from 'lucide-react'

interface Affiliate {
  id: string
  slug: string
  email: string
  first_name: string | null
  last_name: string | null
  company: string | null
  payout_method: string | null
  payout_email: string | null
  commission_rate: number
  total_clicks: number
  total_conversions: number
  total_earned_cents: number
  total_paid_cents: number
}

interface ClickRow {
  id: string
  created_at: string
  converted: boolean
  order_amount_cents: number | null
  commission_cents: number | null
  utm_source: string | null
  utm_medium: string | null
  landing_path: string | null
}

interface PayoutRow {
  id: string
  amount_cents: number
  status: string
  period_start: string | null
  period_end: string | null
  paid_at: string | null
  method: string | null
  reference: string | null
}

export function AffiliateDashboard() {
  const params = useSearchParams()
  const initialEmail = params.get('email') || ''

  const [email, setEmail] = useState(initialEmail)
  const [claimedEmail, setClaimedEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [affiliate, setAffiliate] = useState<Affiliate | null>(null)
  const [clicks, setClicks] = useState<ClickRow[]>([])
  const [payouts, setPayouts] = useState<PayoutRow[]>([])
  const [referralUrl, setReferralUrl] = useState('')
  const [copied, setCopied] = useState(false)

  const load = useCallback(async (targetEmail: string) => {
    setLoading(true)
    setError(null)
    try {
      const r = await fetch(`/api/hipaa/affiliate/me?email=${encodeURIComponent(targetEmail)}`)
      const data = await r.json()
      if (!r.ok) throw new Error(data?.error || 'lookup_failed')
      setAffiliate(data.affiliate)
      setClicks(data.clicks || [])
      setPayouts(data.payouts || [])
      setReferralUrl(data.referralUrl)
      setClaimedEmail(targetEmail)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'lookup_failed')
      setAffiliate(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (initialEmail) void load(initialEmail)
  }, [initialEmail, load])

  async function copyLink() {
    if (!referralUrl) return
    await navigator.clipboard.writeText(referralUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (!affiliate) {
    return (
      <div className="mx-auto max-w-md py-16 px-5">
        <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-8">
          <div className="flex items-center gap-2 mb-2 text-emerald-300">
            <Lock className="h-4 w-4" /> Partner Dashboard
          </div>
          <h1 className="text-2xl font-bold mb-2">Open your partner dashboard</h1>
          <p className="text-sm text-white/55 mb-6">Enter the email you signed up with to view your link, clicks, and payouts.</p>

          <form
            onSubmit={(e) => { e.preventDefault(); if (email) void load(email.trim().toLowerCase()) }}
            className="space-y-3"
          >
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full h-11 rounded-lg bg-black/40 border border-white/15 px-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-emerald-400/60"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 h-11 rounded-lg bg-gradient-to-r from-emerald-500 to-cyan-500 text-black font-bold text-sm disabled:opacity-50"
            >
              {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Looking up…</> : <>Open dashboard <ArrowRight className="h-4 w-4" /></>}
            </button>
            {error && (
              <div className="text-[12px] font-medium text-rose-300 bg-rose-500/10 border border-rose-500/30 rounded-lg px-3 py-2">
                {error === 'not_found' ? 'No partner account on that email. ' : error.replace(/_/g, ' ')}
                {error === 'not_found' && (
                  <Link href="/hipaa/affiliate" className="underline ml-1">Sign up here →</Link>
                )}
              </div>
            )}
          </form>
        </div>
      </div>
    )
  }

  const conversionRate = affiliate.total_clicks > 0
    ? ((affiliate.total_conversions / affiliate.total_clicks) * 100).toFixed(1)
    : '0.0'

  return (
    <div className="mx-auto max-w-6xl py-10 px-5 space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-400/30 bg-emerald-400/10 text-emerald-300 text-[10px] font-bold uppercase tracking-[0.22em] mb-3">
            <Sparkles className="w-3 h-3" /> HIPAA Partner
          </div>
          <h1 className="text-3xl font-black">
            Welcome back, {affiliate.first_name || affiliate.email.split('@')[0]}.
          </h1>
          <p className="text-sm text-white/55 mt-1">Commission rate: <strong className="text-emerald-300">{Math.round(affiliate.commission_rate * 100)}%</strong> on every paid tier.</p>
        </div>
        <Link
          href="/hipaa/affiliate"
          className="text-xs font-semibold text-white/50 hover:text-white"
        >
          Program terms →
        </Link>
      </div>

      {/* Referral link */}
      <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-5 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <Link2 className="h-5 w-5 text-emerald-300 shrink-0" />
          <div className="min-w-0">
            <div className="text-[10px] font-bold uppercase tracking-widest text-emerald-300/80 mb-0.5">Your referral link</div>
            <code className="text-sm text-white truncate block">{referralUrl}</code>
          </div>
        </div>
        <button
          onClick={copyLink}
          className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest px-4 h-10 rounded-lg bg-emerald-500/20 text-emerald-200 border border-emerald-500/30 hover:bg-emerald-500/30"
        >
          {copied ? <><CheckCheck className="h-4 w-4" /> Copied</> : <><Copy className="h-4 w-4" /> Copy</>}
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard icon={<Users className="h-4 w-4" />} label="Clicks" value={affiliate.total_clicks.toString()} />
        <StatCard icon={<TrendingUp className="h-4 w-4" />} label="Conversions" value={affiliate.total_conversions.toString()} sub={`${conversionRate}% rate`} />
        <StatCard icon={<DollarSign className="h-4 w-4" />} label="Earned" value={`$${(affiliate.total_earned_cents / 100).toFixed(2)}`} tone="success" />
        <StatCard icon={<Wallet className="h-4 w-4" />} label="Paid out" value={`$${(affiliate.total_paid_cents / 100).toFixed(2)}`} />
      </div>

      {/* Payment info + Downloads */}
      <div className="grid md:grid-cols-2 gap-5">
        <PayoutForm affiliate={affiliate} email={claimedEmail} onSaved={() => void load(claimedEmail)} />
        <Downloads referralUrl={referralUrl} />
      </div>

      {/* Recent clicks */}
      <div className="rounded-2xl border border-white/10 bg-black/30 overflow-hidden">
        <div className="px-5 py-3 border-b border-white/10 flex items-center justify-between">
          <h3 className="text-sm font-bold">Recent activity</h3>
          <span className="text-[11px] text-white/35">{clicks.length} shown</span>
        </div>
        {clicks.length === 0 ? (
          <div className="py-10 text-center text-sm text-white/40">No clicks yet. Share your link to get started.</div>
        ) : (
          <div className="divide-y divide-white/5">
            {clicks.map((c) => (
              <div key={c.id} className="px-5 py-3 flex items-center gap-4 flex-wrap text-sm">
                <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-widest border ${
                  c.converted
                    ? 'text-emerald-300 bg-emerald-500/10 border-emerald-500/25'
                    : 'text-white/60 bg-white/5 border-white/10'
                }`}>
                  {c.converted ? 'Converted' : 'Click'}
                </span>
                <span className="text-white/55 text-xs">{new Date(c.created_at).toLocaleString()}</span>
                {c.landing_path && <span className="text-white/40 text-xs truncate">{c.landing_path}</span>}
                {c.converted && c.commission_cents != null && (
                  <span className="ml-auto text-emerald-300 font-bold tabular-nums text-xs">+ ${(c.commission_cents / 100).toFixed(2)}</span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Payouts */}
      <div className="rounded-2xl border border-white/10 bg-black/30 overflow-hidden">
        <div className="px-5 py-3 border-b border-white/10">
          <h3 className="text-sm font-bold">Payouts</h3>
        </div>
        {payouts.length === 0 ? (
          <div className="py-10 text-center text-sm text-white/40">No payouts yet. First payout runs on the 1st of the month after your first conversion clears the 14-day window.</div>
        ) : (
          <div className="divide-y divide-white/5">
            {payouts.map((p) => (
              <div key={p.id} className="px-5 py-3 flex items-center gap-4 flex-wrap text-sm">
                <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-widest border ${
                  p.status === 'paid'
                    ? 'text-emerald-300 bg-emerald-500/10 border-emerald-500/25'
                    : 'text-amber-200 bg-amber-500/10 border-amber-500/25'
                }`}>
                  {p.status}
                </span>
                <span className="text-white/55 text-xs">{p.period_start} → {p.period_end}</span>
                <span className="text-white/40 text-xs">{p.method || '—'}</span>
                <span className="ml-auto text-white font-bold tabular-nums text-sm">${(p.amount_cents / 100).toFixed(2)}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function StatCard({ icon, label, value, sub, tone }: { icon: React.ReactNode; label: string; value: string; sub?: string; tone?: 'success' }) {
  const color = tone === 'success' ? 'text-emerald-300' : 'text-white'
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
      <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-white/40 mb-1.5">
        {icon} {label}
      </div>
      <div className={`text-2xl font-black tabular-nums ${color}`}>{value}</div>
      {sub && <div className="text-[11px] text-white/40 mt-0.5">{sub}</div>}
    </div>
  )
}

function PayoutForm({ affiliate, email, onSaved }: { affiliate: Affiliate; email: string; onSaved: () => void }) {
  const [payoutMethod, setPayoutMethod] = useState(affiliate.payout_method || 'ach')
  const [payoutEmail,  setPayoutEmail]  = useState(affiliate.payout_email || email)
  const [bankName,     setBankName]     = useState('')
  const [accountLast4, setAccountLast4] = useState('')
  const [routing,      setRouting]      = useState('')
  const [saving, setSaving] = useState(false)
  const [saved,  setSaved]  = useState(false)
  const [err,    setErr]    = useState<string | null>(null)

  async function save(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true); setSaved(false); setErr(null)
    try {
      const r = await fetch('/api/hipaa/affiliate/me', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          payoutMethod,
          payoutEmail,
          payoutDetails: payoutMethod === 'ach'
            ? { bankName, accountLast4, routing }
            : {},
        }),
      })
      const data = await r.json()
      if (!r.ok) throw new Error(data?.error || 'save_failed')
      setSaved(true)
      onSaved()
    } catch (e) {
      setErr(e instanceof Error ? e.message : 'save_failed')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
      <div className="flex items-center gap-2 mb-2">
        <Wallet className="h-4 w-4 text-emerald-300" />
        <h3 className="text-sm font-bold">Payment info</h3>
      </div>
      <p className="text-xs text-white/50 mb-4">
        Payouts route through the RocketOpp partner engine in our CRM. Add your info so we can split the order the moment an invoice clears.
      </p>

      <form onSubmit={save} className="space-y-3">
        <div>
          <span className="block text-[10px] font-bold uppercase tracking-widest text-white/40 mb-1.5">Method</span>
          <div className="grid grid-cols-2 gap-2">
            {(['ach', 'paypal'] as const).map((m) => (
              <label key={m} className={`h-10 rounded-lg border flex items-center justify-center text-xs font-semibold cursor-pointer ${
                payoutMethod === m ? 'border-emerald-400/60 bg-emerald-500/10 text-emerald-200' : 'border-white/10 bg-black/30 text-white/70 hover:border-white/20'
              }`}>
                <input type="radio" name="method" className="hidden" checked={payoutMethod === m} onChange={() => setPayoutMethod(m)} />
                {m.toUpperCase()}
              </label>
            ))}
          </div>
        </div>

        <SmallField label="Payout email" type="email" value={payoutEmail} onChange={setPayoutEmail} />

        {payoutMethod === 'ach' && (
          <>
            <SmallField label="Bank name"       value={bankName}     onChange={setBankName} />
            <div className="grid grid-cols-2 gap-3">
              <SmallField label="Routing number" value={routing} onChange={setRouting} placeholder="9 digits" />
              <SmallField label="Account last 4" value={accountLast4} onChange={setAccountLast4} placeholder="####" />
            </div>
            <p className="text-[10px] text-white/40">We never store the full account number. RocketOpp CRM requests it via its secure partner vault once you save this form.</p>
          </>
        )}

        {err && <div className="text-[12px] font-medium text-rose-300 bg-rose-500/10 border border-rose-500/30 rounded-lg px-3 py-2">{err.replace(/_/g, ' ')}</div>}
        {saved && <div className="text-[12px] font-medium text-emerald-300 bg-emerald-500/10 border border-emerald-500/30 rounded-lg px-3 py-2">Payment info saved.</div>}

        <button
          type="submit"
          disabled={saving}
          className="w-full inline-flex items-center justify-center gap-2 h-11 rounded-lg bg-white text-black font-bold text-sm disabled:opacity-50 hover:bg-white/90"
        >
          {saving ? <><Loader2 className="h-4 w-4 animate-spin" /> Saving…</> : 'Save payment info'}
        </button>
      </form>
    </div>
  )
}

function SmallField({ label, value, onChange, type = 'text', placeholder }: { label: string; value: string; onChange: (v: string) => void; type?: string; placeholder?: string }) {
  return (
    <label className="block">
      <span className="block text-[10px] font-bold uppercase tracking-widest text-white/40 mb-1.5">{label}</span>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-10 rounded-lg bg-black/40 border border-white/10 px-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-emerald-400/60"
      />
    </label>
  )
}

function Downloads({ referralUrl }: { referralUrl: string }) {
  const items = [
    { icon: <FileText className="h-4 w-4" />,  title: 'HIPAA NPRM one-pager',       desc: 'Why every covered entity needs a scan before Q1 2027.', href: '/api/hipaa/affiliate/downloads/nprm-onepager' },
    { icon: <FileText className="h-4 w-4" />,  title: 'Tier 1 explainer PDF',       desc: '$149 gateway offer breakdown — forwardable to a client.', href: '/api/hipaa/affiliate/downloads/tier1-explainer' },
    { icon: <Linkedin className="h-4 w-4" />,  title: 'LinkedIn post templates',    desc: '5 ready-to-post angles with hooks and CTAs.',             href: '/api/hipaa/affiliate/downloads/linkedin-posts' },
    { icon: <Mail className="h-4 w-4" />,      title: 'Client email sequence',      desc: '3-touch follow-up sequence for warm contacts.',           href: '/api/hipaa/affiliate/downloads/email-sequence' },
  ]
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
      <div className="flex items-center gap-2 mb-2">
        <Download className="h-4 w-4 text-emerald-300" />
        <h3 className="text-sm font-bold">Marketing kit</h3>
      </div>
      <p className="text-xs text-white/50 mb-4">
        Copy-paste materials. Every link is prefilled with your referral slug.
      </p>
      <ul className="space-y-2">
        {items.map((it) => (
          <li key={it.title}>
            <a
              href={`${it.href}?ref=${encodeURIComponent(referralUrl.split('ref=')[1] || '')}`}
              className="flex items-start gap-3 p-3 rounded-lg border border-white/10 hover:border-emerald-400/40 hover:bg-emerald-500/5 transition"
            >
              <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-500/15 text-emerald-300 border border-emerald-500/20 shrink-0">{it.icon}</span>
              <span className="min-w-0">
                <span className="block text-sm font-semibold text-white">{it.title}</span>
                <span className="block text-[12px] text-white/50">{it.desc}</span>
              </span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}
