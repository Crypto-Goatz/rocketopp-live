'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  ShieldCheck, AlertTriangle, Download, Calendar, Loader2, RefreshCw,
  ChevronRight, FileText, Code2, Telescope, Crown, Check, ExternalLink,
} from 'lucide-react'

interface ReportFinding {
  checkId: string
  name: string
  severity: 'critical' | 'high' | 'medium' | 'low'
  status: 'pass' | 'warning' | 'fail' | 'attestation-required'
  category: string
  ruleSection: string
  currentRuleStatus: string
  nprm2026: string
  impact: string
  effort: string
  originalDetail: string
  explanation: string
  whyItFails?: string
  devFix?: {
    stackDetected?: string
    steps: { index: number; title: string; body: string }[]
    verificationCommand?: string
    expectedOutput?: string
    estimatedMinutes: number
  }
  nprmAnalysis?: {
    today: string
    underNprm: string
    whatThisMeans: string
    relatedChanges?: string[]
  }
}

interface ReportBundle {
  orderId: string
  tier: 1 | 2 | 3 | 4
  tierMeta: { name: string; priceCents: number; anchorCents?: number; includesDevCode: boolean; includesNprmOverlay: boolean; includesSupportCall: boolean }
  customerEmail: string
  customerName?: string | null
  companyName: string
  creditHidden: boolean
  reportStatus: 'queued' | 'generating' | 'ready' | 'failed'
  reportGeneratedAt?: string
  supportCallExpiresAt?: string
  assessment: {
    publicUrl: string
    dashboardUrl: string
    currentGrade: string
    currentRuleScore: number
    nprmGrade: string
    nprm2026Score: number
    scanDate: string
  } | null
  executiveSummary: string
  findings: ReportFinding[]
  attestationItems: { checkId: string; name: string; ruleSection: string; severity: string; instruction: string }[]
  remediationPlan: { priority: number; checkId: string; name: string; severity: string; effort: string; estimatedMinutes: number }[]
  supportCallUrl?: string | null
  message?: string
}

export function ReportView({ orderId, token }: { orderId: string; token: string }) {
  const [report, setReport] = useState<ReportBundle | null>(null)
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState<string | null>(null)
  const [expandedFinding, setExpandedFinding] = useState<string | null>(null)

  async function load() {
    setErr(null)
    try {
      const r = await fetch(`/api/hipaa/report/${orderId}?t=${encodeURIComponent(token)}`)
      const data = await r.json()
      if (!r.ok) { setErr(data?.error || 'load_failed'); return }
      setReport(data)
    } catch (e) {
      setErr(e instanceof Error ? e.message : 'load_failed')
    } finally { setLoading(false) }
  }

  useEffect(() => { load() }, [orderId, token])

  // Auto-poll if still generating
  useEffect(() => {
    if (report?.reportStatus === 'ready' || report?.reportStatus === 'failed') return
    if (err) return
    const id = setInterval(() => load(), 30_000)
    return () => clearInterval(id)
  }, [report?.reportStatus, err])

  if (loading) {
    return <div className="flex items-center justify-center min-h-[60vh]"><Loader2 className="w-8 h-8 text-orange-400 animate-spin" /></div>
  }
  if (err) {
    return (
      <section className="max-w-xl mx-auto py-16 px-4 text-center">
        <AlertTriangle className="w-10 h-10 text-rose-400 mx-auto mb-3" />
        <h1 className="text-xl font-bold mb-2">We couldn&rsquo;t open this report</h1>
        <p className="text-sm text-muted-foreground mb-6">The link may be invalid or expired. Open your dashboard to see your purchases.</p>
        <Link href="/dashboard/hipaa" className="text-sm underline underline-offset-4">Go to dashboard →</Link>
      </section>
    )
  }
  if (!report) return null

  if (report.reportStatus !== 'ready') {
    return (
      <section className="max-w-xl mx-auto py-16 px-4 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-orange-500/10 border border-orange-500/30 mb-4">
          <Loader2 className="w-8 h-8 text-orange-400 animate-spin" />
        </div>
        <div className="text-xs font-semibold uppercase tracking-[0.2em] text-orange-400 mb-2">{report.reportStatus}</div>
        <h1 className="text-2xl font-bold mb-3">Your Tier {report.tier} report is being generated</h1>
        <p className="text-sm text-muted-foreground mb-6">{report.message || "We'll auto-refresh this page every 30 seconds. Typical generation time is under 2 minutes."}</p>
        <button onClick={load} className="inline-flex items-center gap-1.5 text-sm underline underline-offset-4 text-muted-foreground hover:text-foreground">
          <RefreshCw className="w-3.5 h-3.5" /> Check now
        </button>
      </section>
    )
  }

  const a = report.assessment
  const criticalCount = report.findings.filter((f) => f.severity === 'critical').length
  const highCount     = report.findings.filter((f) => f.severity === 'high').length
  const daysLeft = report.supportCallExpiresAt ? Math.max(0, Math.ceil((new Date(report.supportCallExpiresAt).getTime() - Date.now()) / 86400000)) : 0

  const scoreClass = (n: number) => n >= 80 ? 'text-emerald-400' : n >= 60 ? 'text-amber-400' : 'text-rose-400'
  const sevCls = (s: string) => s === 'critical' ? 'text-rose-400 bg-rose-500/10 border-rose-500/30' : s === 'high' ? 'text-orange-400 bg-orange-500/10 border-orange-500/30' : s === 'medium' ? 'text-amber-400 bg-amber-500/10 border-amber-500/30' : 'text-sky-400 bg-sky-500/10 border-sky-500/30'

  const tierIcon = report.tier === 1 ? <FileText className="w-4 h-4" /> : report.tier === 2 ? <Code2 className="w-4 h-4" /> : report.tier === 3 ? <Telescope className="w-4 h-4" /> : <Crown className="w-4 h-4" />

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Top bar */}
      <div className="flex items-center justify-between flex-wrap gap-3 mb-8">
        {!report.creditHidden ? (
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-orange-500/30 bg-orange-500/5 text-orange-400 text-xs font-semibold uppercase tracking-[0.18em]">
            <ShieldCheck className="w-3.5 h-3.5" /> Powered by 0nCore AI Tools
          </div>
        ) : <div />}
        <div className="flex items-center gap-2">
          <Link href="/dashboard/hipaa" className="text-xs text-muted-foreground hover:text-foreground">My reports →</Link>
          <button onClick={() => window.print()} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border hover:bg-card text-xs font-semibold">
            <Download className="w-3.5 h-3.5" /> Save as PDF
          </button>
        </div>
      </div>

      {/* Title block */}
      <div className="mb-10 pb-8 border-b border-border">
        <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground mb-2">
          {tierIcon} Tier {report.tier} · {report.tierMeta.name}
        </div>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">{report.companyName} — HIPAA Readiness Report</h1>
        {a && <p className="text-sm text-muted-foreground">{a.publicUrl} · scanned {new Date(a.scanDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>}
      </div>

      {/* Scorecards */}
      {a && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
          <div className="rounded-xl border border-border bg-card p-4">
            <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">Current Rule</div>
            <div className={`text-3xl font-bold tabular-nums ${scoreClass(a.currentRuleScore)}`}>{a.currentRuleScore}<span className="text-base text-muted-foreground ml-1">/100 · {a.currentGrade}</span></div>
          </div>
          <div className="rounded-xl border border-border bg-card p-4">
            <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">2026 NPRM</div>
            <div className={`text-3xl font-bold tabular-nums ${scoreClass(a.nprm2026Score)}`}>{a.nprm2026Score}<span className="text-base text-muted-foreground ml-1">/100 · {a.nprmGrade}</span></div>
          </div>
          <div className="rounded-xl border border-border bg-card p-4">
            <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">Critical</div>
            <div className="text-3xl font-bold tabular-nums text-rose-400">{criticalCount}</div>
          </div>
          <div className="rounded-xl border border-border bg-card p-4">
            <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">High</div>
            <div className="text-3xl font-bold tabular-nums text-orange-400">{highCount}</div>
          </div>
        </div>
      )}

      {/* Support call card (Tier 4) */}
      {report.supportCallUrl && (
        <div className="rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 p-6 mb-10">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center text-white"><Calendar className="w-5 h-5" /></div>
              <div>
                <div className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-400 mb-1">Included: 60-day support call</div>
                <div className="font-semibold text-lg mb-1">Book your 30-min session with a compliance engineer</div>
                <p className="text-xs text-muted-foreground">Expires in <strong>{daysLeft} days</strong>. Bring your remediation work and we&rsquo;ll validate.</p>
              </div>
            </div>
            <a href={report.supportCallUrl} target="_blank" rel="noopener"
               className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-semibold hover:opacity-90">
              Book your call <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      )}

      {/* Executive summary */}
      <section className="mb-12">
        <div className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground mb-3">Executive Summary</div>
        <div className="prose prose-sm max-w-none text-foreground/90 whitespace-pre-wrap leading-relaxed">{report.executiveSummary}</div>
      </section>

      {/* Findings */}
      <section className="mb-12">
        <div className="flex items-baseline justify-between mb-4">
          <h2 className="text-xl font-bold">Findings ({report.findings.length})</h2>
          <div className="text-xs text-muted-foreground">Priority order</div>
        </div>
        <div className="space-y-3">
          {report.findings.map((f, i) => {
            const open = expandedFinding === f.checkId
            return (
              <article key={f.checkId} className="rounded-xl border border-border bg-card overflow-hidden">
                <button onClick={() => setExpandedFinding(open ? null : f.checkId)} className="w-full text-left p-5 hover:bg-muted/40 transition-colors">
                  <div className="flex items-start gap-4">
                    <div className="text-xs font-mono text-muted-foreground w-8 pt-1">{String(i + 1).padStart(2, '0')}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full border font-semibold uppercase tracking-wider ${sevCls(f.severity)}`}>{f.severity}</span>
                        <span className="text-xs font-mono text-muted-foreground">§{f.ruleSection}</span>
                        {f.status === 'fail' && <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-500 text-white font-semibold uppercase tracking-wider">FAIL</span>}
                      </div>
                      <div className="font-semibold text-base">{f.name}</div>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{f.explanation}</p>
                    </div>
                    <ChevronRight className={`w-4 h-4 mt-1.5 text-muted-foreground shrink-0 transition-transform ${open ? 'rotate-90' : ''}`} />
                  </div>
                </button>

                {open && (
                  <div className="border-t border-border bg-muted/20 p-5 space-y-5">
                    <Block label="Plain-English explanation">
                      <p className="text-sm leading-relaxed">{f.explanation}</p>
                    </Block>

                    {f.whyItFails && (
                      <Block label="Why HIPAA would flag this">
                        <p className="text-sm leading-relaxed text-muted-foreground">{f.whyItFails}</p>
                      </Block>
                    )}

                    {f.nprmAnalysis && (
                      <Block label="Current vs. 2026 NPRM">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                          <div className="rounded-lg border border-border bg-background p-3">
                            <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">Today</div>
                            <p className="text-xs leading-relaxed">{f.nprmAnalysis.today}</p>
                          </div>
                          <div className="rounded-lg border border-orange-500/30 bg-orange-500/5 p-3">
                            <div className="text-[10px] font-semibold uppercase tracking-wider text-orange-400 mb-1">Under 2026 NPRM</div>
                            <p className="text-xs leading-relaxed">{f.nprmAnalysis.underNprm}</p>
                          </div>
                        </div>
                        <p className="text-sm leading-relaxed"><strong>What this means:</strong> {f.nprmAnalysis.whatThisMeans}</p>
                        {f.nprmAnalysis.relatedChanges && f.nprmAnalysis.relatedChanges.length > 0 && (
                          <ul className="mt-3 space-y-1 text-xs text-muted-foreground">
                            {f.nprmAnalysis.relatedChanges.map((r, j) => <li key={j}>· {r}</li>)}
                          </ul>
                        )}
                      </Block>
                    )}

                    {f.devFix && (
                      <Block label={`Developer fix${f.devFix.stackDetected ? ' — ' + f.devFix.stackDetected : ''}`}>
                        <ol className="space-y-4">
                          {f.devFix.steps.map((s) => (
                            <li key={s.index} className="rounded-lg border border-border bg-background p-4">
                              <div className="flex items-center gap-2 mb-2">
                                <div className="w-6 h-6 rounded-full bg-foreground text-background font-bold text-xs flex items-center justify-center">{s.index}</div>
                                <div className="font-semibold text-sm">{s.title}</div>
                              </div>
                              <MarkdownLite body={s.body} />
                            </li>
                          ))}
                        </ol>
                        {f.devFix.verificationCommand && (
                          <div className="mt-4 rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-3">
                            <div className="text-[10px] font-semibold uppercase tracking-wider text-emerald-400 mb-1">Verify</div>
                            <pre className="text-xs font-mono overflow-x-auto"><code>{f.devFix.verificationCommand}</code></pre>
                            {f.devFix.expectedOutput && <div className="text-[11px] text-muted-foreground mt-2">Expected: {f.devFix.expectedOutput}</div>}
                          </div>
                        )}
                        <div className="mt-3 text-[11px] text-muted-foreground">Estimated time: ~{f.devFix.estimatedMinutes} min</div>
                      </Block>
                    )}
                  </div>
                )}
              </article>
            )
          })}
        </div>
      </section>

      {/* Attestation items */}
      {report.attestationItems.length > 0 && (
        <section className="mb-12">
          <div className="flex items-baseline justify-between mb-4">
            <h2 className="text-xl font-bold">Attestation required ({report.attestationItems.length})</h2>
            <div className="text-xs text-muted-foreground">Policies we can&rsquo;t verify externally — you confirm these in writing</div>
          </div>
          <ul className="space-y-2">
            {report.attestationItems.map((a) => (
              <li key={a.checkId} className="rounded-xl border border-border bg-card p-4">
                <div className="flex items-start gap-3">
                  <Check className="w-4 h-4 text-muted-foreground mt-1 shrink-0" />
                  <div className="flex-1">
                    <div className="font-semibold text-sm">{a.name}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">§{a.ruleSection} · {a.severity}</div>
                    <p className="text-sm mt-2">{a.instruction}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Remediation plan */}
      {report.remediationPlan.length > 0 && (
        <section className="mb-12">
          <div className="flex items-baseline justify-between mb-4">
            <h2 className="text-xl font-bold">Priority remediation plan</h2>
          </div>
          <div className="rounded-xl border border-border bg-card overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted/40 text-[10px] uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="text-left p-3">#</th>
                  <th className="text-left p-3">Finding</th>
                  <th className="text-left p-3 hidden md:table-cell">Severity</th>
                  <th className="text-left p-3 hidden lg:table-cell">Effort</th>
                  <th className="text-right p-3">Est. time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {report.remediationPlan.map((r) => (
                  <tr key={r.checkId}>
                    <td className="p-3 font-mono text-xs text-muted-foreground">{String(r.priority).padStart(2, '0')}</td>
                    <td className="p-3">{r.name}</td>
                    <td className="p-3 hidden md:table-cell"><span className={`text-[10px] px-2 py-0.5 rounded-full border font-semibold uppercase ${sevCls(r.severity)}`}>{r.severity}</span></td>
                    <td className="p-3 hidden lg:table-cell font-mono text-xs">{r.effort}</td>
                    <td className="p-3 text-right tabular-nums text-xs text-muted-foreground">{r.estimatedMinutes} min</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="mt-16 pt-8 border-t border-border text-xs text-muted-foreground text-center space-y-2">
        <p>This report is informational. It does not constitute legal advice. Reply to your confirmation email with any questions.</p>
        <p>Order reference: <code className="font-mono">{report.orderId}</code></p>
        {!report.creditHidden && <p>Generated by the <a href="https://0ncore.com" className="underline">0nCore</a> AI compliance engine · {report.tierMeta.name}</p>}
      </footer>
    </div>
  )
}

function Block({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">{label}</div>
      {children}
    </div>
  )
}

/** Minimal markdown renderer — supports code fences + paragraphs + inline code. */
function MarkdownLite({ body }: { body: string }) {
  const parts = body.split(/```(\w*)\n([\s\S]*?)```/g)
  const rendered: React.ReactNode[] = []
  for (let i = 0; i < parts.length; i++) {
    if (i % 3 === 0) {
      const text = parts[i]
      if (text.trim()) {
        rendered.push(
          <div key={`p${i}`} className="text-sm leading-relaxed whitespace-pre-wrap">
            {text.split(/(`[^`]+`)/g).map((seg, j) =>
              seg.startsWith('`') && seg.endsWith('`')
                ? <code key={j} className="px-1 py-0.5 rounded bg-muted text-[0.9em] font-mono">{seg.slice(1, -1)}</code>
                : <span key={j}>{seg}</span>
            )}
          </div>
        )
      }
    } else if (i % 3 === 2) {
      const lang = parts[i - 1]
      rendered.push(
        <pre key={`c${i}`} className="my-2 rounded-lg bg-black/80 border border-border p-3 overflow-x-auto">
          {lang && <div className="text-[10px] text-muted-foreground mb-2 font-mono uppercase tracking-wider">{lang}</div>}
          <code className="text-xs font-mono text-emerald-100">{parts[i]}</code>
        </pre>
      )
    }
  }
  return <div className="space-y-2">{rendered}</div>
}
