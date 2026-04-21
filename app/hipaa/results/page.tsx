'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Shield, CheckCircle2, XCircle, AlertTriangle, ArrowLeft, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

type Check = {
  id: string
  name: string
  ruleSection: string
  severity: string
  status: string
  detail: string
  remediation?: string
}

type ScanResult = {
  currentRuleScore: number
  nprm2026Score: number
  currentGrade: string
  nprmGrade: string
  publicChecks: Check[]
  dashboardChecks: Check[]
  universalChecks: Check[]
  criticalFindings: number
  highFindings: number
  remediationPriority: { priority: number; checkId: string; name: string; effort: string; impact: string }[]
}

function gradeColor(grade: string) {
  if (grade === 'A') return 'text-emerald-400'
  if (grade === 'B') return 'text-blue-400'
  if (grade === 'C') return 'text-amber-400'
  if (grade === 'D') return 'text-orange-400'
  return 'text-red-400'
}

function statusBadge(status: string) {
  if (status === 'pass') return <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-400"><CheckCircle2 className="h-3 w-3" /> PASS</span>
  if (status === 'fail') return <span className="inline-flex items-center gap-1 text-xs font-medium text-red-400"><XCircle className="h-3 w-3" /> FAIL</span>
  if (status === 'warning') return <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-400"><AlertTriangle className="h-3 w-3" /> WARN</span>
  return <span className="inline-flex items-center gap-1 text-xs font-medium text-zinc-400"><Shield className="h-3 w-3" /> ATTEST</span>
}

function sevBadge(sev: string) {
  const colors: Record<string, string> = { critical: 'bg-red-950/50 text-red-400 border-red-800/30', high: 'bg-orange-950/50 text-orange-400 border-orange-800/30', medium: 'bg-amber-950/50 text-amber-400 border-amber-800/30', low: 'bg-zinc-800 text-zinc-400 border-zinc-700' }
  return <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium border ${colors[sev] || colors.low}`}>{sev}</span>
}

function ResultsInner() {
  const params = useSearchParams()
  const [result, setResult] = useState<ScanResult | null>(null)
  const [scanning, setScanning] = useState(true)
  const [error, setError] = useState('')
  const [tab, setTab] = useState<'public' | 'dashboard' | 'universal'>('public')

  const scanType = params.get('scanType') || 'current'
  const url = params.get('url') || ''

  useEffect(() => {
    if (!url) { setError('No URL provided'); setScanning(false); return }
    fetch('/api/hipaa/scan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        publicUrl: url,
        dashboardUrl: params.get('dashboardUrl') || url,
        entityType: params.get('entityType') || 'unsure',
        state: params.get('state') || '',
        scanType,
      }),
    })
      .then(r => r.json())
      .then(data => {
        if (data.result) setResult(data.result)
        else setError(data.error || 'Scan failed')
      })
      .catch(() => setError('Scan failed'))
      .finally(() => setScanning(false))
  }, [url, scanType, params])

  if (scanning) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Scanning {url}</h2>
          <p className="text-muted-foreground text-sm">Running 51 HIPAA checks... this takes about 30 seconds.</p>
        </div>
      </div>
    )
  }

  if (error || !result) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center max-w-md">
          <XCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Scan Error</h2>
          <p className="text-muted-foreground mb-6">{error || 'Something went wrong.'}</p>
          <Button asChild><Link href="/hipaa">Try Again</Link></Button>
        </div>
      </div>
    )
  }

  const checks = tab === 'public' ? result.publicChecks : tab === 'dashboard' ? result.dashboardChecks : result.universalChecks

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-5xl px-6 py-12">
        <Link href="/hipaa" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-8">
          <ArrowLeft className="h-4 w-4" /> Back to Scanner
        </Link>

        <h1 className="text-3xl font-bold mb-2">HIPAA Compliance Report</h1>
        <p className="text-muted-foreground mb-8">{url}</p>

        {/* Score cards */}
        <div className="grid gap-6 md:grid-cols-2 mb-10">
          <div className="rounded-xl border border-border bg-card p-8 text-center">
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Current HIPAA Rule</h3>
            <div className={`text-6xl font-bold ${gradeColor(result.currentGrade)}`}>{result.currentGrade}</div>
            <div className="text-2xl font-semibold mt-1">{result.currentRuleScore}/100</div>
          </div>
          {(scanType === 'nprm2026') && (
            <div className="rounded-xl border border-border bg-card p-8 text-center">
              <h3 className="text-sm font-medium text-muted-foreground mb-2">2026 NPRM Readiness</h3>
              <div className={`text-6xl font-bold ${gradeColor(result.nprmGrade)}`}>{result.nprmGrade}</div>
              <div className="text-2xl font-semibold mt-1">{result.nprm2026Score}/100</div>
            </div>
          )}
        </div>

        {/* Finding counts */}
        <div className="grid grid-cols-4 gap-4 mb-10">
          <div className="rounded-lg border border-red-900/30 bg-red-950/20 p-4 text-center">
            <div className="text-2xl font-bold text-red-400">{result.criticalFindings}</div>
            <div className="text-xs text-muted-foreground">Critical</div>
          </div>
          <div className="rounded-lg border border-orange-900/30 bg-orange-950/20 p-4 text-center">
            <div className="text-2xl font-bold text-orange-400">{result.highFindings}</div>
            <div className="text-xs text-muted-foreground">High</div>
          </div>
          <div className="rounded-lg border border-amber-900/30 bg-amber-950/20 p-4 text-center">
            <div className="text-2xl font-bold text-amber-400">{result.publicChecks.filter(c => c.status === 'warning').length + result.dashboardChecks.filter(c => c.status === 'warning').length}</div>
            <div className="text-xs text-muted-foreground">Warnings</div>
          </div>
          <div className="rounded-lg border border-emerald-900/30 bg-emerald-950/20 p-4 text-center">
            <div className="text-2xl font-bold text-emerald-400">{result.publicChecks.filter(c => c.status === 'pass').length + result.dashboardChecks.filter(c => c.status === 'pass').length}</div>
            <div className="text-xs text-muted-foreground">Passed</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 border-b border-border">
          {(['public', 'dashboard', 'universal'] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                tab === t ? 'border-red-400 text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              {t === 'public' ? `Public (${result.publicChecks.length})` : t === 'dashboard' ? `Dashboard (${result.dashboardChecks.length})` : `Universal (${result.universalChecks.length})`}
            </button>
          ))}
        </div>

        {/* Check results */}
        <div className="space-y-3 mb-12">
          {checks.map((c) => (
            <div key={c.id} className="rounded-lg border border-border bg-card p-4">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-3">
                  <code className="text-xs text-muted-foreground">{c.id}</code>
                  <span className="font-medium text-sm">{c.name}</span>
                  {sevBadge(c.severity)}
                </div>
                {statusBadge(c.status)}
              </div>
              <p className="text-sm text-muted-foreground mt-1">{c.detail}</p>
              {c.remediation && (
                <p className="text-sm text-red-400/80 mt-2 pl-3 border-l-2 border-red-900/30">{c.remediation}</p>
              )}
              <div className="text-xs text-muted-foreground/50 mt-2">HIPAA {c.ruleSection}</div>
            </div>
          ))}
        </div>

        {/* Remediation roadmap */}
        {result.remediationPriority.length > 0 && (
          <>
            <h2 className="text-2xl font-bold mb-4">Remediation Roadmap</h2>
            <div className="overflow-x-auto rounded-lg border border-border mb-12">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th className="text-left p-3 font-semibold w-16">#</th>
                    <th className="text-left p-3 font-semibold">Check</th>
                    <th className="text-left p-3 font-semibold">Effort</th>
                    <th className="text-left p-3 font-semibold">Impact</th>
                  </tr>
                </thead>
                <tbody>
                  {result.remediationPriority.slice(0, 15).map((r) => (
                    <tr key={r.priority} className="border-b border-border/50">
                      <td className="p-3 text-muted-foreground">{r.priority}</td>
                      <td className="p-3 font-medium">{r.name}</td>
                      <td className="p-3">{sevBadge(r.effort)}</td>
                      <td className="p-3">{sevBadge(r.impact)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* CTA */}
        <div className="rounded-xl border border-border bg-card p-8 text-center">
          <h3 className="text-xl font-bold mb-2">Need Help Fixing These Issues?</h3>
          <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
            RocketOpp offers full HIPAA remediation — security headers, TLS hardening, privacy policies, MFA setup, and ongoing compliance monitoring.
          </p>
          <Button size="lg" className="bg-red-600 hover:bg-red-700 text-white" asChild>
            <a href="https://api.leadconnectorhq.com/widget/booking/cKgZH39iPMdbXN7hk81A" target="_blank" rel="noopener noreferrer">
              Book Free Remediation Consultation
            </a>
          </Button>
        </div>
      </div>
    </div>
  )
}

export default function HIPAAResultsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-red-400" />
      </div>
    }>
      <ResultsInner />
    </Suspense>
  )
}
