'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Shield, AlertTriangle, ArrowLeft, Loader2, FileText, Mail, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

function gradeColor(grade: string) {
  if (grade === 'A') return 'text-emerald-400'
  if (grade === 'B') return 'text-blue-400'
  if (grade === 'C') return 'text-amber-400'
  if (grade === 'D') return 'text-orange-400'
  return 'text-red-400'
}

function ResultsInner() {
  const params = useSearchParams()
  const [result, setResult] = useState<Record<string, unknown> | null>(null)
  const [scanning, setScanning] = useState(true)
  const [scanStep, setScanStep] = useState(0)
  const [error, setError] = useState('')
  const [ordering, setOrdering] = useState(false)
  const [orderEmail, setOrderEmail] = useState(params.get('email') || '')
  const [ordered, setOrdered] = useState(false)

  const url = params.get('url') || ''

  const SCAN_STEPS = [
    'Resolving DNS and checking connectivity...',
    'Analyzing TLS configuration and certificates...',
    'Scanning HTTP security headers...',
    'Checking privacy disclosures and NPP...',
    'Testing authentication endpoint security...',
    'Detecting EOL software and CORS issues...',
    'Scanning for data exposure risks...',
    'Evaluating against 2026 NPRM requirements...',
    'Computing dual compliance scores...',
  ]

  useEffect(() => {
    if (!url) { setError('No URL provided'); setScanning(false); return }

    // Animate scan steps
    const stepInterval = setInterval(() => {
      setScanStep(prev => (prev < SCAN_STEPS.length - 1 ? prev + 1 : prev))
    }, 3500)

    fetch('/api/hipaa/scan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        publicUrl: url,
        dashboardUrl: params.get('dashboardUrl') || url,
        email: params.get('email') || '',
        entityType: params.get('entityType') || 'unsure',
        state: params.get('state') || '',
      }),
    })
      .then(r => r.json())
      .then(data => {
        clearInterval(stepInterval)
        if (data.result) setResult(data.result)
        else setError(data.error || 'Scan failed')
      })
      .catch(() => { clearInterval(stepInterval); setError('Scan failed') })
      .finally(() => setScanning(false))

    return () => clearInterval(stepInterval)
  }, [url])

  async function handleOrder(e: React.FormEvent) {
    e.preventDefault()
    if (!orderEmail || !result) return
    setOrdering(true)
    try {
      const res = await fetch('/api/hipaa/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: orderEmail,
          publicUrl: url,
          dashboardUrl: params.get('dashboardUrl') || url,
          scanResult: result,
        }),
      })
      const data = await res.json()
      if (data.success) setOrdered(true)
      else setError(data.error || 'Order failed')
    } catch {
      setError('Failed to submit order')
    }
    setOrdering(false)
  }

  // ── Loading state with animated steps ──
  if (scanning) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          {/* 0nCore loading animation */}
          <div className="relative mb-8">
            <div className="w-20 h-20 mx-auto rounded-2xl bg-card border border-border flex items-center justify-center">
              <Shield className="h-8 w-8 text-red-400 animate-pulse" />
            </div>
            <div className="absolute inset-0 rounded-2xl" style={{
              background: 'radial-gradient(circle, rgba(239,68,68,0.1) 0%, transparent 70%)',
              animation: 'pulse 2s ease-in-out infinite',
            }} />
          </div>
          <h2 className="text-xl font-bold mb-2">Scanning {url}</h2>
          <p className="text-muted-foreground text-sm mb-8">Running 63 HIPAA compliance checks...</p>

          <div className="space-y-3 text-left">
            {SCAN_STEPS.map((step, i) => (
              <div key={i} className="flex items-center gap-3">
                {i < scanStep ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                ) : i === scanStep ? (
                  <Loader2 className="h-4 w-4 text-red-400 animate-spin shrink-0" />
                ) : (
                  <div className="h-4 w-4 rounded-full border border-border shrink-0" />
                )}
                <span className={`text-xs ${i <= scanStep ? 'text-foreground' : 'text-muted-foreground/40'}`}>{step}</span>
              </div>
            ))}
          </div>

          <div className="mt-8 flex items-center justify-center">
            <a href="https://0ncore.com" target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 text-xs text-muted-foreground/50 hover:text-muted-foreground transition-colors">
              <img src="https://0ncore.com/brand/0ncore-icon.png" alt="" className="h-3.5 w-3.5 rounded" />
              Powered by 0nCore AI Tools
            </a>
          </div>
        </div>
      </div>
    )
  }

  if (error || !result) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center max-w-md">
          <AlertTriangle className="h-12 w-12 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Scan Error</h2>
          <p className="text-muted-foreground mb-6">{error || 'Something went wrong.'}</p>
          <Button asChild><Link href="/hipaa">Try Again</Link></Button>
        </div>
      </div>
    )
  }

  const r = result as Record<string, unknown>

  // ── Order confirmed ──
  if (ordered) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-6">
            <CheckCircle2 className="h-8 w-8 text-emerald-400" />
          </div>
          <h2 className="text-2xl font-bold mb-3">Report Ordered</h2>
          <p className="text-muted-foreground mb-2">A confirmation email has been sent to <strong className="text-foreground">{orderEmail}</strong>.</p>
          <p className="text-muted-foreground mb-8">Your full HIPAA compliance report with all 63 check results, detailed remediation steps, and prioritized action plan will be delivered within <strong className="text-foreground">60 minutes</strong>.</p>
          <div className="rounded-lg border border-border bg-card p-4 text-left text-sm space-y-2 mb-8">
            <div className="flex items-center gap-2"><Mail className="h-4 w-4 text-emerald-400" /> Confirmation email sent</div>
            <div className="flex items-center gap-2"><FileText className="h-4 w-4 text-emerald-400" /> PDF summary attached</div>
            <div className="flex items-center gap-2"><Shield className="h-4 w-4 text-emerald-400" /> Full report within 60 minutes</div>
          </div>
          <Button asChild variant="outline"><Link href="/hipaa">Scan Another Site</Link></Button>
        </div>
      </div>
    )
  }

  // ── Minimal results ──
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-3xl px-6 py-12">
        <Link href="/hipaa" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-8">
          <ArrowLeft className="h-4 w-4" /> Back to Scanner
        </Link>

        <h1 className="text-2xl font-bold mb-1">HIPAA Compliance Scan Results</h1>
        <p className="text-muted-foreground text-sm mb-8">{url}</p>

        {/* Score cards */}
        <div className="grid gap-6 md:grid-cols-2 mb-8">
          <div className="rounded-xl border border-border bg-card p-8 text-center">
            <h3 className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wider">Current HIPAA Rule</h3>
            <div className={`text-6xl font-bold ${gradeColor(r.currentGrade as string)}`}>{r.currentGrade as string}</div>
            <div className="text-xl font-semibold mt-1 text-muted-foreground">{r.currentRuleScore as number}/100</div>
          </div>
          <div className="rounded-xl border border-border bg-card p-8 text-center">
            <h3 className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wider">2026 NPRM Readiness</h3>
            <div className={`text-6xl font-bold ${gradeColor(r.nprmGrade as string)}`}>{r.nprmGrade as string}</div>
            <div className="text-xl font-semibold mt-1 text-muted-foreground">{r.nprm2026Score as number}/100</div>
          </div>
        </div>

        {/* Finding counts */}
        <div className="grid grid-cols-4 gap-3 mb-10">
          <div className="rounded-lg border border-red-900/30 bg-red-950/20 p-3 text-center">
            <div className="text-2xl font-bold text-red-400">{r.criticalFindings as number}</div>
            <div className="text-[10px] text-muted-foreground uppercase">Critical</div>
          </div>
          <div className="rounded-lg border border-orange-900/30 bg-orange-950/20 p-3 text-center">
            <div className="text-2xl font-bold text-orange-400">{r.highFindings as number}</div>
            <div className="text-[10px] text-muted-foreground uppercase">High</div>
          </div>
          <div className="rounded-lg border border-amber-900/30 bg-amber-950/20 p-3 text-center">
            <div className="text-2xl font-bold text-amber-400">{r.mediumFindings as number}</div>
            <div className="text-[10px] text-muted-foreground uppercase">Medium</div>
          </div>
          <div className="rounded-lg border border-emerald-900/30 bg-emerald-950/20 p-3 text-center">
            <div className="text-2xl font-bold text-emerald-400">{r.passCount as number}</div>
            <div className="text-[10px] text-muted-foreground uppercase">Passed</div>
          </div>
        </div>

        {/* ═══ ORDER FULL REPORT ═══ */}
        <div className="rounded-xl border-2 border-red-500/30 bg-gradient-to-b from-red-950/10 to-card p-8 text-center mb-10">
          <FileText className="h-10 w-10 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Get Your Full Report</h2>
          <p className="text-muted-foreground text-sm mb-6 max-w-md mx-auto">
            The full report includes all 63 check results with pass/fail details, HIPAA rule references,
            severity ratings, a prioritized remediation roadmap, and state-specific compliance guidance.
            Delivered as a PDF to your inbox within 60 minutes.
          </p>

          <form onSubmit={handleOrder} className="max-w-sm mx-auto">
            <div className="mb-4">
              <input type="email" required placeholder="your@email.com" value={orderEmail} onChange={e => setOrderEmail(e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-center focus:outline-none focus:ring-2 focus:ring-red-500/40" />
            </div>
            <Button type="submit" disabled={ordering || !orderEmail}
              className="w-full bg-red-600 hover:bg-red-700 text-white h-11 text-sm font-semibold">
              {ordering ? 'Processing...' : 'Order Full Report Now — Free'}
            </Button>
            <p className="text-[10px] text-muted-foreground mt-3">Free during beta. No credit card required.</p>
          </form>
        </div>

        {/* 0nCore badge */}
        <div className="flex items-center justify-center pb-8">
          <a href="https://0ncore.com" target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-2 text-xs text-muted-foreground/50 hover:text-muted-foreground transition-colors">
            <img src="https://0ncore.com/brand/0ncore-icon.png" alt="" className="h-3.5 w-3.5 rounded" />
            Powered by 0nCore AI Tools
          </a>
        </div>
      </div>
    </div>
  )
}

export default function HIPAAResultsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center"><Loader2 className="h-12 w-12 animate-spin text-red-400" /></div>}>
      <ResultsInner />
    </Suspense>
  )
}
