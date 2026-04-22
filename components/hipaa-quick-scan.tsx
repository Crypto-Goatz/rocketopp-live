'use client'

/**
 * HipaaQuickScan — drop-in "free 0nCore scan" at the top of /hipaa.
 *
 * Flow:
 *   1. User fills: public URL, dashboard URL, email, company name
 *   2. POST /api/hipaa/scan  (browser → rocketopp.com proxy → 0ncore.com public mode)
 *   3. 0nCore-branded loading state while the scanner runs
 *   4. Show minimal results (scores + top 5 failed checks)
 *   5. "Order the full report now" → /hipaa/order?aid=<assessmentId>&...
 */

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowRight, Loader2, ShieldCheck, AlertTriangle, ExternalLink, Sparkles } from 'lucide-react'

interface TopFinding { name: string; severity: string; detail: string }

interface ScanResult {
  result: {
    currentRuleScore: number
    nprm2026Score: number
    currentGrade: string
    nprmGrade: string
    criticalFindings: number
    highFindings: number
  }
  topFindings: TopFinding[]
  assessmentId: string | null
}

export function HipaaQuickScan() {
  const router = useRouter()
  const [publicUrl, setPublicUrl] = useState('')
  const [dashboardUrl, setDashboardUrl] = useState('')
  const [email, setEmail] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState<string | null>(null)
  const [result, setResult] = useState<ScanResult | null>(null)

  async function run(e: React.FormEvent) {
    e.preventDefault()
    setErr(null); setResult(null)
    if (!publicUrl || !email) {
      setErr('Public URL and email are required.')
      return
    }
    setLoading(true)
    try {
      const r = await fetch('/api/hipaa/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          publicUrl,
          dashboardUrl: dashboardUrl || publicUrl,
          email,
          companyName: companyName || publicUrl.replace(/^https?:\/\//, '').replace(/\/.*$/, ''),
          entityType: 'unsure',
          state: '',
        }),
      })
      const data = await r.json()
      if (!r.ok) throw new Error(data?.error || 'scan_failed')
      setResult(data as ScanResult)
    } catch (e) {
      setErr(e instanceof Error ? e.message : 'Scan failed')
    } finally {
      setLoading(false)
    }
  }

  function goOrder() {
    if (!result?.assessmentId) return
    const params = new URLSearchParams({
      aid: result.assessmentId,
      email,
      company: companyName || publicUrl.replace(/^https?:\/\//, '').replace(/\/.*$/, ''),
    })
    router.push(`/hipaa/order?${params.toString()}`)
  }

  const scoreClass = (n: number) =>
    n >= 80 ? 'text-emerald-400' : n >= 60 ? 'text-amber-400' : 'text-rose-400'

  if (loading) {
    return <LoadingState />
  }

  if (result) {
    const r = result.result
    return (
      <section className="max-w-3xl mx-auto rounded-2xl border border-border bg-card overflow-hidden shadow-xl shadow-orange-500/5">
        <div className="bg-gradient-to-br from-orange-500/10 to-transparent p-6 border-b border-border">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-orange-400 mb-2">
            <Sparkles className="w-3.5 h-3.5" /> Scan complete · Preview only
          </div>
          <h2 className="text-2xl font-bold">
            We found <span className="text-rose-400">{r.criticalFindings} critical</span> + <span className="text-orange-400">{r.highFindings} high</span> risk items
          </h2>
          <p className="text-sm text-muted-foreground mt-2">
            This is a preview of the top 5 findings. Order the full report to see every control we checked, why each matters, and the prioritised remediation plan — delivered in under 60 minutes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-border">
          <div className="p-6 bg-card">
            <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Current HIPAA Rule</div>
            <div className="flex items-baseline gap-2">
              <div className={`text-5xl font-bold tabular-nums ${scoreClass(r.currentRuleScore)}`}>{r.currentRuleScore}</div>
              <div className="text-lg text-muted-foreground">/ 100 · {r.currentGrade}</div>
            </div>
          </div>
          <div className="p-6 bg-card">
            <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">2026 NPRM (upcoming)</div>
            <div className="flex items-baseline gap-2">
              <div className={`text-5xl font-bold tabular-nums ${scoreClass(r.nprm2026Score)}`}>{r.nprm2026Score}</div>
              <div className="text-lg text-muted-foreground">/ 100 · {r.nprmGrade}</div>
            </div>
          </div>
        </div>

        {result.topFindings.length > 0 && (
          <div className="p-6 border-t border-border">
            <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Top findings</div>
            <ul className="space-y-2">
              {result.topFindings.map((f, i) => (
                <li key={i} className="flex gap-3 p-3 rounded-lg border border-border bg-background/40">
                  <SeverityDot severity={f.severity} />
                  <div className="flex-1">
                    <div className="font-semibold text-sm">{f.name}</div>
                    <div className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{f.detail}</div>
                  </div>
                  <span className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">{f.severity}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="p-6 border-t border-border bg-gradient-to-br from-orange-500/10 to-rose-500/10">
          <button
            onClick={goOrder}
            className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 rounded-lg bg-gradient-to-r from-orange-500 to-rose-500 text-white font-bold text-base hover:opacity-90 transition-opacity"
          >
            Order the full report now <ArrowRight className="w-4 h-4" />
          </button>
          <p className="text-[11px] text-center text-muted-foreground mt-3">
            We&rsquo;ll email your initial findings PDF immediately and the full report within 60 minutes.
          </p>
        </div>
      </section>
    )
  }

  return (
    <section className="max-w-3xl mx-auto rounded-2xl border border-border bg-card overflow-hidden shadow-xl shadow-orange-500/5">
      <div className="p-6 md:p-8 border-b border-border bg-gradient-to-br from-orange-500/5 to-transparent">
        <OnCoreBadge />
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mt-5 mb-3">
          Free HIPAA readiness scan
        </h1>
        <p className="text-sm md:text-base text-muted-foreground">
          30-second automated assessment against the HIPAA Security Rule + the 2026 NPRM. Get a preview of your grade + top findings. Order the full report if you like what you see.
        </p>
      </div>

      <form onSubmit={run} className="p-6 md:p-8 space-y-4">
        <Field label="Public website URL *" hint="The site patients visit.">
          <input
            value={publicUrl}
            onChange={(e) => setPublicUrl(e.target.value)}
            type="url"
            placeholder="https://yourclinic.com"
            required
            className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:border-orange-500 outline-none text-sm"
          />
        </Field>
        <Field label="Dashboard / portal URL" hint="Optional — the authenticated portal, if different.">
          <input
            value={dashboardUrl}
            onChange={(e) => setDashboardUrl(e.target.value)}
            type="url"
            placeholder="https://portal.yourclinic.com"
            className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:border-orange-500 outline-none text-sm"
          />
        </Field>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Company name" hint="For your report header.">
            <input
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              type="text"
              placeholder="Acme Health"
              className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:border-orange-500 outline-none text-sm"
            />
          </Field>
          <Field label="Email *" hint="Where we send your report.">
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="you@yourclinic.com"
              required
              className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:border-orange-500 outline-none text-sm"
            />
          </Field>
        </div>

        {err && (
          <div className="flex items-center gap-2 p-3 rounded-lg border border-rose-500/30 bg-rose-500/10 text-sm text-rose-400">
            <AlertTriangle className="w-4 h-4" /> {err}
          </div>
        )}

        <button
          type="submit"
          disabled={loading || !publicUrl || !email}
          className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 rounded-lg bg-gradient-to-r from-orange-500 to-rose-500 text-white font-bold text-base hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Run free scan <ArrowRight className="w-4 h-4" />
        </button>

        <p className="text-[11px] text-center text-muted-foreground">
          No credit card. Passive HTTP checks only — we never submit forms or access patient data.
        </p>
      </form>
    </section>
  )
}

function LoadingState() {
  return (
    <section className="max-w-3xl mx-auto rounded-2xl border border-border bg-card overflow-hidden">
      <div className="p-12 text-center">
        <OnCoreBadge />
        <div className="mt-8 relative inline-flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-orange-500 to-rose-500 blur-xl opacity-40 animate-pulse" />
          <Loader2 className="relative w-12 h-12 text-orange-400 animate-spin" />
        </div>
        <div className="mt-6 text-lg font-semibold">Running 51-point scan…</div>
        <p className="mt-2 text-sm text-muted-foreground">
          Powered by the <strong className="text-orange-400">0nCore</strong> scanner — cross-checking your site against the Security Rule + the 2026 NPRM.
        </p>
        <div className="mt-6 space-y-2 text-left max-w-md mx-auto">
          <Step text="Fetching public URL + dashboard URL" done />
          <Step text="Testing transport security + headers" done />
          <Step text="Checking authentication controls" />
          <Step text="Inspecting data exposure surfaces" />
          <Step text="Applying NPRM 2026 overlay" />
        </div>
      </div>
    </section>
  )
}

function Step({ text, done }: { text: string; done?: boolean }) {
  return (
    <div className="flex items-center gap-2 text-xs">
      <div className={`w-1.5 h-1.5 rounded-full ${done ? 'bg-emerald-400' : 'bg-orange-400 animate-pulse'}`} />
      <span className={done ? 'text-muted-foreground' : 'text-foreground'}>{text}</span>
    </div>
  )
}

function OnCoreBadge() {
  return (
    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-orange-500/30 bg-orange-500/5 text-orange-400 text-xs font-semibold uppercase tracking-[0.18em]">
      <ShieldCheck className="w-3.5 h-3.5" /> Powered by <a href="https://0ncore.com" target="_blank" rel="noopener" className="underline underline-offset-2 inline-flex items-center gap-1">0nCore AI Tools <ExternalLink className="w-3 h-3" /></a>
    </div>
  )
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">{label}</label>
      {hint && <p className="text-[11px] text-muted-foreground/80 mb-2">{hint}</p>}
      {children}
    </div>
  )
}

function SeverityDot({ severity }: { severity: string }) {
  const color =
    severity === 'critical' ? 'bg-rose-500' :
    severity === 'high'     ? 'bg-orange-500' :
    severity === 'medium'   ? 'bg-amber-500' : 'bg-sky-500'
  return <div className={`w-2.5 h-2.5 rounded-full ${color} shrink-0 mt-1.5`} />
}
