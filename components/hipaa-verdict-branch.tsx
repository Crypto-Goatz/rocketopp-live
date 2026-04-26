'use client'

/**
 * Post-scan AI branching upsell.
 *
 * Given the free scan result (grade + critical count), show ONE of two
 * dramatically different CTA surfaces:
 *
 *   Path A · "You're ahead of most" — for solid sites. Future-proof pitch.
 *            Tier 3 NPRM Overview at $499 is the recommended upgrade.
 *
 *   Path B · "You have active exposure right now" — for failing sites.
 *            Tier 4 Full Compliance at $899 with dollar-figure risk framing.
 *
 * The cutoff is deterministic based on the existing result shape, no model
 * inference needed: a site with grade ≤ C or any critical finding lands
 * in Path B; A/B with zero criticals lands in Path A.
 */

import { Shield, Zap, TrendingUp, Lock, CheckCircle2, AlertTriangle, Flame, Crown, Telescope, FileText, ArrowRight, Phone, Clock } from 'lucide-react'

type Grade = 'A' | 'B' | 'C' | 'D' | 'F' | string

interface Props {
  currentGrade: Grade
  currentRuleScore: number
  nprmGrade: Grade
  nprm2026Score: number
  criticalFindings: number
  highFindings: number
  onOrder: (tier: 1 | 2 | 3 | 4) => void
  ordering: boolean
}

function isFailing(grade: Grade, critical: number): boolean {
  const g = grade.toUpperCase().charAt(0)
  if (critical >= 1) return true
  return g === 'C' || g === 'D' || g === 'F'
}

export function HipaaVerdictBranch({
  currentGrade,
  currentRuleScore,
  nprmGrade,
  nprm2026Score,
  criticalFindings,
  highFindings,
  onOrder,
  ordering,
}: Props) {
  const failing = isFailing(currentGrade, criticalFindings)
  return failing ? (
    <PathBFailing
      currentGrade={currentGrade}
      currentRuleScore={currentRuleScore}
      nprmGrade={nprmGrade}
      nprm2026Score={nprm2026Score}
      criticalFindings={criticalFindings}
      highFindings={highFindings}
      onOrder={onOrder}
      ordering={ordering}
    />
  ) : (
    <PathASolid
      currentGrade={currentGrade}
      nprmGrade={nprmGrade}
      nprm2026Score={nprm2026Score}
      highFindings={highFindings}
      onOrder={onOrder}
      ordering={ordering}
    />
  )
}

// ---------------------------------------------------------------------------
// Path A — solid today, vulnerable to NPRM. Emerald/cyan palette, confident tone.
// ---------------------------------------------------------------------------
function PathASolid({
  currentGrade,
  nprmGrade,
  nprm2026Score,
  highFindings,
  onOrder,
  ordering,
}: {
  currentGrade: Grade
  nprmGrade: Grade
  nprm2026Score: number
  highFindings: number
  onOrder: (tier: 1 | 2 | 3 | 4) => void
  ordering: boolean
}) {
  const nprmBad = nprm2026Score < 80
  return (
    <div className="hipaa-verdict hipaa-verdict--a relative rounded-3xl overflow-hidden">
      <div className="hipaa-verdict__topline" />
      <div className="relative p-7 md:p-10">
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/35 bg-emerald-500/5 text-emerald-300 text-[10px] font-bold uppercase tracking-[0.22em] mb-3">
            <Shield className="h-3.5 w-3.5" /> Verdict · You're ahead
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight">
            You scored <span className="hipaa-verdict__glow-a">{currentGrade}</span> today.
          </h2>
          <p className="mt-3 text-white/65 max-w-2xl mx-auto leading-relaxed">
            Most practices we scan fail outright. You're not one of them — which means you
            have something valuable worth defending: <strong className="text-emerald-300">a clean OCR posture.</strong>
          </p>
        </div>

        {/* Risk band — what the NPRM breaks */}
        {nprmBad && (
          <div className="rounded-2xl border border-amber-500/25 bg-amber-500/[0.03] p-5 mb-6">
            <div className="flex items-start gap-3">
              <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shrink-0">
                <Clock className="h-4 w-4 text-white" strokeWidth={2.6} />
              </div>
              <div>
                <div className="text-sm font-bold text-amber-200">
                  But you'd drop to <strong className="text-amber-100">{nprmGrade}</strong> under the 2026 NPRM.
                </div>
                <p className="text-xs text-amber-100/70 leading-relaxed mt-1">
                  The proposed rule flips most "addressable" controls to "required." Your current stack
                  was designed for today — not January 2027. Lock in your lead while competitors scramble.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Primary recommended tier — NPRM Overview */}
        <div className="hipaa-verdict__card relative rounded-2xl p-6 mb-4">
          <div className="flex items-start justify-between gap-4 mb-4 flex-wrap">
            <div>
              <div className="inline-flex items-center gap-2 px-2 py-1 rounded-full border border-emerald-500/35 bg-emerald-500/10 text-emerald-300 text-[10px] font-bold uppercase tracking-widest mb-2">
                <TrendingUp className="h-3 w-3" /> Recommended for you
              </div>
              <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                <Telescope className="h-5 w-5 text-emerald-400" /> Tier 3 · NPRM Overview
              </h3>
              <p className="text-sm text-white/55 mt-1">
                Your findings overlaid with the proposed rule. Exactly what breaks, what stays the same,
                what to prioritize now.
              </p>
            </div>
            <div className="text-right shrink-0">
              <div className="text-3xl font-black text-white">$499</div>
              <div className="text-[10px] text-white/40">One-time · 15-minute delivery</div>
            </div>
          </div>
          <ul className="grid gap-2 grid-cols-1 md:grid-cols-2 mb-5">
            {[
              'All 51 rule-cited findings',
              'Per-finding: current vs. 2026 delta',
              'Business-impact analysis',
              'Printable attestation checklist',
              'Related NPRM changes flagged',
              'PDF archive you can keep forever',
            ].map((b) => (
              <li key={b} className="flex items-start gap-2 text-xs text-white/70">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
                {b}
              </li>
            ))}
          </ul>
          <button
            onClick={() => onOrder(3)}
            disabled={ordering}
            className="hipaa-verdict__cta hipaa-verdict__cta--a w-full inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3.5 font-bold text-sm text-white disabled:opacity-50"
          >
            {ordering ? 'Processing…' : 'Lock in my lead — Tier 3'}
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        {/* Secondary choice */}
        <div className="flex items-center justify-center gap-4 flex-wrap text-xs">
          <button
            onClick={() => onOrder(4)}
            disabled={ordering}
            className="text-white/60 hover:text-white underline underline-offset-4 disabled:opacity-50"
          >
            Or go all-in with Tier 4 Full Compliance ($899, includes dev kit + support call)
          </button>
        </div>

        {highFindings > 0 && (
          <div className="mt-4 text-center text-[11px] text-white/40">
            {highFindings} high-severity issue{highFindings === 1 ? '' : 's'} found · worth closing before peers catch up
          </div>
        )}

        {/* Voice bot escape hatch */}
        <div className="mt-5 flex items-center justify-center gap-2 text-xs text-white/45">
          <Phone className="h-3 w-3" />
          Not sure?
          <a href="tel:+18788881230" className="text-emerald-300 hover:text-emerald-200 font-semibold underline underline-offset-2">
            Talk to the AI voice agent — (878) 888-1230
          </a>
        </div>
      </div>

      <style jsx>{`
        .hipaa-verdict {
          background: linear-gradient(145deg, #031a12 0%, #040806 100%);
          border: 1px solid rgba(16, 185, 129, 0.2);
          backdrop-filter: blur(20px);
          box-shadow:
            0 40px 100px -20px rgba(0, 0, 0, 0.9),
            0 0 60px -20px rgba(16, 185, 129, 0.25),
            inset 0 1px 0 rgba(255, 255, 255, 0.04);
        }
        .hipaa-verdict__topline {
          position: absolute;
          inset: 0 0 auto 0;
          height: 2px;
          background: linear-gradient(
            90deg,
            transparent,
            #10b981 30%,
            #06b6d4 70%,
            transparent
          );
          background-size: 200% 100%;
          animation: hipaaVerdictShimmer 4s linear infinite;
        }
        .hipaa-verdict__card {
          background: linear-gradient(145deg, rgba(16, 185, 129, 0.06), rgba(0, 0, 0, 0.3));
          border: 1px solid rgba(16, 185, 129, 0.25);
          backdrop-filter: blur(12px);
          box-shadow: 0 20px 50px -14px rgba(0, 0, 0, 0.7);
        }
        .hipaa-verdict__glow-a {
          background: linear-gradient(135deg, #10b981, #06b6d4);
          background-clip: text;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          filter: drop-shadow(0 0 24px rgba(16, 185, 129, 0.5));
        }
        .hipaa-verdict__cta--a {
          background: linear-gradient(135deg, #10b981, #06b6d4);
          box-shadow: 0 12px 30px -6px rgba(16, 185, 129, 0.55);
          transition: transform 0.2s, box-shadow 0.3s;
        }
        .hipaa-verdict__cta--a:not(:disabled):hover {
          transform: translateY(-1px);
          box-shadow: 0 16px 34px -6px rgba(16, 185, 129, 0.7);
        }
        @keyframes hipaaVerdictShimmer {
          0% { background-position: 0% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Path B — failing now. Lava palette, urgent tone, dollar figures.
// ---------------------------------------------------------------------------
function PathBFailing({
  currentGrade,
  currentRuleScore,
  nprmGrade,
  nprm2026Score,
  criticalFindings,
  highFindings,
  onOrder,
  ordering,
}: {
  currentGrade: Grade
  currentRuleScore: number
  nprmGrade: Grade
  nprm2026Score: number
  criticalFindings: number
  highFindings: number
  onOrder: (tier: 1 | 2 | 3 | 4) => void
  ordering: boolean
}) {
  // Penalty exposure math — illustrative maxima only.
  const perViolationMax = 68928
  const annualCap = 2067813
  const estimatedExposure = Math.min(
    criticalFindings * perViolationMax + highFindings * (perViolationMax / 4),
    annualCap,
  )

  return (
    <div className="hipaa-verdict hipaa-verdict--b relative rounded-3xl overflow-hidden">
      <div className="hipaa-verdict__topline" />
      <div className="hipaa-verdict__pulse" />
      <div className="relative p-7 md:p-10">
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-red-500/45 bg-red-500/10 text-red-300 text-[10px] font-bold uppercase tracking-[0.22em] mb-3 animate-pulse">
            <AlertTriangle className="h-3.5 w-3.5" /> Active exposure detected
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight">
            You scored <span className="hipaa-verdict__glow-b">{currentGrade}</span> — failing today.
          </h2>
          <p className="mt-3 text-white/70 max-w-2xl mx-auto leading-relaxed">
            <strong className="text-red-300">{criticalFindings} critical</strong> and{' '}
            <strong className="text-orange-300">{highFindings} high</strong> violations are live on your
            site right now. The 2026 NPRM won't save you — this is current law.
          </p>
        </div>

        {/* Penalty exposure tile */}
        <div className="rounded-2xl border border-red-500/30 bg-red-950/30 p-5 mb-6">
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-red-500 via-orange-500 to-amber-500 flex items-center justify-center shrink-0 shadow-[0_0_18px_rgba(239,68,68,0.4)]">
              <Flame className="h-5 w-5 text-white" strokeWidth={2.4} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-bold uppercase tracking-wider text-red-300 mb-1">
                OCR civil penalty exposure — illustrative
              </div>
              <div className="text-3xl font-black text-white tabular-nums">
                up to ${estimatedExposure.toLocaleString()}
                <span className="text-sm text-white/40 ml-2">/ year</span>
              </div>
              <p className="text-[11px] text-white/55 mt-1 leading-relaxed">
                Based on {criticalFindings} critical × ${perViolationMax.toLocaleString()} + {highFindings} high-severity
                findings, capped at the annual max of ${annualCap.toLocaleString()}. Actual OCR settlements vary.
              </p>
            </div>
          </div>
        </div>

        {/* Recommended: Full Compliance */}
        <div className="hipaa-verdict__card hipaa-verdict__card--b relative rounded-2xl p-6 mb-4">
          <div className="absolute top-4 right-4 inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-widest bg-red-500 text-white px-2 py-1 rounded-full">
            <Zap className="h-3 w-3" /> Fix today
          </div>
          <div className="mb-4">
            <div className="inline-flex items-center gap-2 px-2 py-1 rounded-full border border-orange-500/40 bg-orange-500/10 text-orange-300 text-[10px] font-bold uppercase tracking-widest mb-2">
              Recommended for your situation
            </div>
            <h3 className="text-2xl font-bold text-white flex items-center gap-2">
              <Crown className="h-5 w-5 text-amber-300" /> Tier 4 · Full Compliance
            </h3>
            <p className="text-sm text-white/60 mt-1">
              Every finding · rule citation · pasteable developer fix · verification command ·
              2026 NPRM overlay · 60-day support call.
            </p>
          </div>
          <div className="flex items-end gap-3 mb-4">
            <div className="text-4xl font-black text-white">$899</div>
            <div className="text-sm text-white/40 line-through mb-1">$1,499</div>
            <div className="text-[11px] text-amber-300 ml-auto">15-min delivery · OCR binder-ready</div>
          </div>
          <ul className="grid gap-2 grid-cols-1 md:grid-cols-2 mb-5">
            {[
              'Every rule-cited finding',
              'Stack-detected dev fixes',
              'Pasteable code + verify commands',
              'Estimated minutes per fix',
              '2026 NPRM overlay per finding',
              '60-day AI-assisted support call',
              'Attestation checklist for OCR',
              'Interactive remediation dashboard',
            ].map((b) => (
              <li key={b} className="flex items-start gap-2 text-xs text-white/75">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
                {b}
              </li>
            ))}
          </ul>
          <button
            onClick={() => onOrder(4)}
            disabled={ordering}
            className="hipaa-verdict__cta hipaa-verdict__cta--b w-full inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3.5 font-black text-sm text-white disabled:opacity-50"
          >
            {ordering ? 'Processing…' : 'Close the gaps — Tier 4 · $899'}
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        {/* Ladder of alternatives */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs">
          <button
            onClick={() => onOrder(1)}
            disabled={ordering}
            className="rounded-xl border border-white/10 bg-white/[0.02] p-3 text-left hover:bg-white/[0.05] disabled:opacity-50 transition-colors"
          >
            <div className="flex items-center gap-1.5 text-white/70 mb-1 font-semibold">
              <FileText className="h-3.5 w-3.5" /> Tier 1 · $149
            </div>
            <div className="text-[10.5px] text-white/45 leading-snug">Cited findings, no code fixes</div>
          </button>
          <button
            onClick={() => onOrder(2)}
            disabled={ordering}
            className="rounded-xl border border-white/10 bg-white/[0.02] p-3 text-left hover:bg-white/[0.05] disabled:opacity-50 transition-colors"
          >
            <div className="flex items-center gap-1.5 text-white/70 mb-1 font-semibold">
              <Lock className="h-3.5 w-3.5" /> Tier 2 · $399
            </div>
            <div className="text-[10.5px] text-white/45 leading-snug">Dev fix kit, no NPRM overlay</div>
          </button>
          <button
            onClick={() => onOrder(3)}
            disabled={ordering}
            className="rounded-xl border border-white/10 bg-white/[0.02] p-3 text-left hover:bg-white/[0.05] disabled:opacity-50 transition-colors"
          >
            <div className="flex items-center gap-1.5 text-white/70 mb-1 font-semibold">
              <Telescope className="h-3.5 w-3.5" /> Tier 3 · $499
            </div>
            <div className="text-[10.5px] text-white/45 leading-snug">NPRM overlay, no dev kit</div>
          </button>
        </div>

        {/* Voice bot escape hatch */}
        <div className="mt-5 flex items-center justify-center gap-2 text-xs text-white/60">
          <Phone className="h-3 w-3 text-red-300" />
          Need to escalate?
          <a href="tel:+18788881230" className="text-red-300 hover:text-red-200 font-semibold underline underline-offset-2">
            AI voice agent · (878) 888-1230 · 24/7
          </a>
        </div>
      </div>

      <style jsx>{`
        .hipaa-verdict--b {
          background: linear-gradient(145deg, #1a0604 0%, #070202 100%);
          border: 1px solid rgba(239, 68, 68, 0.25);
          backdrop-filter: blur(20px);
          box-shadow:
            0 40px 100px -20px rgba(0, 0, 0, 0.95),
            0 0 80px -20px rgba(239, 68, 68, 0.35),
            inset 0 1px 0 rgba(255, 255, 255, 0.04);
        }
        .hipaa-verdict--b .hipaa-verdict__topline {
          background: linear-gradient(
            90deg,
            transparent,
            #ef4444 30%,
            #ff6b35 55%,
            #f59e0b 80%,
            transparent
          );
          background-size: 200% 100%;
          animation: hipaaVerdictShimmer 2.5s linear infinite;
        }
        .hipaa-verdict__pulse {
          position: absolute;
          inset: -1px;
          border-radius: inherit;
          box-shadow: inset 0 0 80px rgba(239, 68, 68, 0.15);
          animation: hipaaVerdictBreathe 3.5s ease-in-out infinite;
          pointer-events: none;
        }
        .hipaa-verdict__card--b {
          background: linear-gradient(145deg, rgba(239, 68, 68, 0.08), rgba(0, 0, 0, 0.4));
          border: 1px solid rgba(239, 68, 68, 0.3);
          backdrop-filter: blur(12px);
          box-shadow: 0 20px 50px -14px rgba(0, 0, 0, 0.8), 0 0 40px -16px rgba(239, 68, 68, 0.35);
        }
        .hipaa-verdict__glow-b {
          background: linear-gradient(135deg, #ef4444, #ff6b35, #f59e0b);
          background-clip: text;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          filter: drop-shadow(0 0 28px rgba(239, 68, 68, 0.7));
          animation: hipaaVerdictGlow 2.5s ease-in-out infinite;
        }
        .hipaa-verdict__cta--b {
          background: linear-gradient(135deg, #ef4444, #ff6b35, #f59e0b);
          box-shadow: 0 14px 32px -6px rgba(239, 68, 68, 0.65);
          transition: transform 0.2s, box-shadow 0.3s;
        }
        .hipaa-verdict__cta--b:not(:disabled):hover {
          transform: translateY(-1px);
          box-shadow: 0 18px 36px -6px rgba(239, 68, 68, 0.8);
        }
        @keyframes hipaaVerdictBreathe {
          0%, 100% { box-shadow: inset 0 0 80px rgba(239, 68, 68, 0.12); }
          50% { box-shadow: inset 0 0 100px rgba(239, 68, 68, 0.22); }
        }
        @keyframes hipaaVerdictGlow {
          0%, 100% { filter: drop-shadow(0 0 22px rgba(239, 68, 68, 0.6)); }
          50% { filter: drop-shadow(0 0 36px rgba(239, 68, 68, 0.9)); }
        }
      `}</style>
    </div>
  )
}
