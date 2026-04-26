'use client'

/**
 * HIPAA NPRM Countdown card — premium version.
 *
 *   - Real-time countdown (days · hours · minutes · seconds), updates every
 *     second, always-running white digits
 *   - Animated SVG process timeline that draws icons in lava gradient on a
 *     loop, line sweeps between them
 *   - Glowing lava headline
 *   - Deep dark drop-shadow with bright inner edge; hover presses card
 *     inward while lifting the countdown up with a lava glow halo
 *   - CTA that launches the elite assessment
 */

import { useEffect, useState } from 'react'
import {
  AlertTriangle,
  ShieldCheck,
  Lock,
  Ban,
  Bug,
  Radar,
  ArrowRight,
  Sparkles,
} from 'lucide-react'

const DEADLINE_ISO = '2027-01-01T00:00:00Z'

interface Props {
  onStartAssessment: () => void
}

interface Remaining {
  days: number
  hours: number
  minutes: number
  seconds: number
}

function computeRemaining(): Remaining {
  const now = Date.now()
  const target = new Date(DEADLINE_ISO).getTime()
  let diff = Math.max(0, target - now)
  const days = Math.floor(diff / 86_400_000)
  diff -= days * 86_400_000
  const hours = Math.floor(diff / 3_600_000)
  diff -= hours * 3_600_000
  const minutes = Math.floor(diff / 60_000)
  diff -= minutes * 60_000
  const seconds = Math.floor(diff / 1000)
  return { days, hours, minutes, seconds }
}

const TIMELINE_STEPS = [
  { icon: ShieldCheck, label: 'MFA Mandatory' },
  { icon: Lock, label: 'Encryption at Rest' },
  { icon: Ban, label: '"Addressable" Eliminated' },
  { icon: Bug, label: 'Biennial Pen Tests' },
  { icon: Radar, label: '6-Month Vuln Scans' },
] as const

export function HipaaNprmCard({ onStartAssessment }: Props) {
  const [rem, setRem] = useState<Remaining | null>(null)

  useEffect(() => {
    setRem(computeRemaining())
    const id = setInterval(() => setRem(computeRemaining()), 1000)
    return () => clearInterval(id)
  }, [])

  const days = rem?.days ?? '—'
  const hh = rem ? String(rem.hours).padStart(2, '0') : '--'
  const mm = rem ? String(rem.minutes).padStart(2, '0') : '--'
  const ss = rem ? String(rem.seconds).padStart(2, '0') : '--'

  return (
    <div className="hipaa-nprm-card group relative rounded-2xl overflow-hidden">
      <div className="hipaa-nprm-card__body relative p-6 md:p-7">
        {/* Top lava accent line */}
        <div className="hipaa-nprm-card__topline" />

        {/* Ambient corner glows */}
        <div className="hipaa-nprm-card__corner hipaa-nprm-card__corner--tl" />
        <div className="hipaa-nprm-card__corner hipaa-nprm-card__corner--br" />

        {/* Header */}
        <div className="flex items-center justify-center gap-2">
          <AlertTriangle className="h-4 w-4 text-orange-400" />
          <div className="hipaa-nprm-card__headline text-xs font-black uppercase tracking-[0.22em]">
            2026 NPRM Countdown
          </div>
        </div>

        {/* Countdown — lifts on card hover */}
        <div className="hipaa-nprm-card__countdown-wrap mt-5 relative text-center">
          <div className="hipaa-nprm-card__countdown-halo" />
          <div className="relative flex flex-col items-center">
            <div className="text-6xl md:text-7xl font-black tracking-tight text-white leading-none hipaa-nprm-card__big">
              {days}
            </div>
            <div className="mt-2 text-sm text-white/60 max-w-[14rem] leading-snug">
              days to estimated compliance deadline
            </div>
          </div>
          <div className="mt-4 flex items-center justify-center gap-3 text-[13px] font-mono font-bold uppercase tracking-wider">
            <Time label="HR" value={hh} />
            <span className="hipaa-nprm-card__colon">:</span>
            <Time label="MIN" value={mm} />
            <span className="hipaa-nprm-card__colon">:</span>
            <Time label="SEC" value={ss} />
          </div>
        </div>

        {/* Animated SVG process timeline */}
        <div className="mt-6 text-center">
          <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/35 mb-3">
            What changes for you
          </div>
          <ProcessTimeline />
        </div>

        {/* Disclaimer pill */}
        <div className="mt-5 rounded-lg border border-white/10 bg-black/40 px-3 py-2.5 text-[11px] leading-relaxed text-white/55 text-center">
          Tier 3 and 4 reports overlay every finding against the proposed rule so you know
          what breaks today vs. what breaks when the rule finalizes.
        </div>

        {/* Elite assessment CTA */}
        <button
          onClick={onStartAssessment}
          className="hipaa-nprm-card__cta group/cta mt-5 w-full relative flex items-center justify-center gap-2 rounded-xl px-5 py-3.5 font-bold text-sm text-white overflow-hidden"
        >
          <span className="hipaa-nprm-card__cta-bg" />
          <span className="relative flex items-center gap-2 z-10">
            <Sparkles className="h-4 w-4" />
            Start Elite Compliance Assessment
            <ArrowRight className="h-4 w-4 group-hover/cta:translate-x-0.5 transition-transform" />
          </span>
        </button>
      </div>

      <style jsx>{`
        .hipaa-nprm-card {
          background: linear-gradient(145deg, #1a0f08 0%, #0a0604 60%, #050302 100%);
          border: 1px solid rgba(255, 107, 53, 0.2);
          box-shadow:
            0 40px 80px -20px rgba(0, 0, 0, 0.95),
            0 0 60px -20px rgba(255, 107, 53, 0.35),
            inset 0 1px 0 rgba(255, 255, 255, 0.05);
          transition:
            box-shadow 0.4s cubic-bezier(0.16, 1, 0.3, 1),
            transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .hipaa-nprm-card:hover {
          transform: scale(0.995);
          box-shadow:
            inset 0 6px 22px rgba(0, 0, 0, 0.7),
            inset 0 0 40px rgba(255, 107, 53, 0.1),
            0 0 40px -10px rgba(255, 107, 53, 0.25);
        }
        .hipaa-nprm-card__topline {
          position: absolute;
          inset: 0 0 auto 0;
          height: 2px;
          background: linear-gradient(
            90deg,
            transparent 0%,
            #ef4444 20%,
            #ff6b35 50%,
            #f59e0b 80%,
            transparent 100%
          );
          opacity: 0.9;
        }
        .hipaa-nprm-card__corner {
          position: absolute;
          width: 180px;
          height: 180px;
          border-radius: 50%;
          filter: blur(40px);
          pointer-events: none;
        }
        .hipaa-nprm-card__corner--tl {
          top: -60px;
          left: -60px;
          background: radial-gradient(circle, rgba(239, 68, 68, 0.25), transparent 70%);
        }
        .hipaa-nprm-card__corner--br {
          bottom: -80px;
          right: -80px;
          background: radial-gradient(circle, rgba(245, 158, 11, 0.18), transparent 70%);
        }
        .hipaa-nprm-card__headline {
          background: linear-gradient(135deg, #ff6b35 0%, #f59e0b 50%, #ef4444 100%);
          background-clip: text;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          filter: drop-shadow(0 0 14px rgba(255, 107, 53, 0.35));
        }
        .hipaa-nprm-card__countdown-wrap {
          transition:
            transform 0.5s cubic-bezier(0.16, 1, 0.3, 1),
            filter 0.5s ease-out;
        }
        .hipaa-nprm-card:hover .hipaa-nprm-card__countdown-wrap {
          transform: translateY(-14px) scale(1.06);
          filter: drop-shadow(0 20px 30px rgba(255, 107, 53, 0.45));
        }
        .hipaa-nprm-card__big {
          background: linear-gradient(180deg, #ffffff 0%, #ffe4d1 100%);
          background-clip: text;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          text-shadow: 0 0 40px rgba(255, 255, 255, 0.15);
        }
        .hipaa-nprm-card__countdown-halo {
          position: absolute;
          inset: -30px -20px -20px -20px;
          border-radius: 50%;
          background: radial-gradient(
            ellipse at center,
            rgba(255, 107, 53, 0) 0%,
            rgba(255, 107, 53, 0) 60%,
            transparent 100%
          );
          filter: blur(30px);
          opacity: 0;
          transition: opacity 0.5s ease-out, background 0.5s ease-out;
          pointer-events: none;
        }
        .hipaa-nprm-card:hover .hipaa-nprm-card__countdown-halo {
          opacity: 1;
          background: radial-gradient(
            ellipse at center,
            rgba(255, 107, 53, 0.55) 0%,
            rgba(245, 158, 11, 0.25) 40%,
            transparent 75%
          );
        }
        .hipaa-nprm-card__cta {
          border: 1px solid rgba(255, 107, 53, 0.4);
          background: rgba(0, 0, 0, 0.4);
          transition:
            transform 0.2s ease-out,
            box-shadow 0.3s ease-out,
            border-color 0.3s ease-out;
        }
        .hipaa-nprm-card__cta:hover {
          border-color: rgba(255, 107, 53, 0.7);
          box-shadow: 0 10px 30px -8px rgba(255, 107, 53, 0.5);
          transform: translateY(-1px);
        }
        .hipaa-nprm-card__cta-bg {
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, #ef4444 0%, #ff6b35 45%, #f59e0b 100%);
          opacity: 0;
          transition: opacity 0.25s ease-out;
        }
        .hipaa-nprm-card__cta:hover .hipaa-nprm-card__cta-bg {
          opacity: 1;
        }
        .hipaa-nprm-card__time-value {
          font-size: 1.35rem;
          font-weight: 900;
          color: #ffffff;
          letter-spacing: 0.02em;
          text-shadow: 0 0 18px rgba(255, 255, 255, 0.35), 0 0 32px rgba(255, 107, 53, 0.25);
        }
        .hipaa-nprm-card__time-label {
          margin-top: 3px;
          font-size: 9.5px;
          font-weight: 700;
          letter-spacing: 0.18em;
          color: rgba(255, 255, 255, 0.45);
        }
        .hipaa-nprm-card__colon {
          font-size: 1.35rem;
          font-weight: 900;
          color: rgba(255, 107, 53, 0.7);
          text-shadow: 0 0 12px rgba(255, 107, 53, 0.5);
          transform: translateY(-6px);
        }
      `}</style>
    </div>
  )
}

function Time({ label, value }: { label: string; value: string }) {
  return (
    <span className="hipaa-nprm-card__time inline-flex flex-col items-center leading-none">
      <span className="hipaa-nprm-card__time-value tabular-nums">{value}</span>
      <span className="hipaa-nprm-card__time-label">{label}</span>
    </span>
  )
}

function ProcessTimeline() {
  return (
    <div className="relative">
      <svg
        className="w-full"
        viewBox="0 0 500 92"
        preserveAspectRatio="xMidYMid meet"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="lava" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#ef4444" />
            <stop offset="50%" stopColor="#ff6b35" />
            <stop offset="100%" stopColor="#f59e0b" />
          </linearGradient>
          <filter id="lavaGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Dormant connecting line */}
        <line
          x1="40"
          x2="460"
          y1="32"
          y2="32"
          stroke="rgba(255,255,255,0.12)"
          strokeWidth="2"
          strokeLinecap="round"
        />
        {/* Animated sweep line on top — draws left→right then resets */}
        <line
          x1="40"
          x2="460"
          y1="32"
          y2="32"
          stroke="url(#lava)"
          strokeWidth="2.5"
          strokeLinecap="round"
          filter="url(#lavaGlow)"
          className="hipaa-nprm-card__sweep"
        />
      </svg>

      {/* Icon row — absolutely positioned over the SVG */}
      <div className="absolute inset-0 flex items-start justify-between px-[6%]">
        {TIMELINE_STEPS.map((step, i) => {
          const Icon = step.icon
          return (
            <div
              key={step.label}
              className="flex flex-col items-center w-[18%]"
              style={{ ['--i' as string]: i }}
            >
              <div className="hipaa-nprm-card__icon relative">
                <Icon
                  className="h-4 w-4 text-white relative z-10"
                  strokeWidth={2.5}
                />
              </div>
              <div className="mt-2 text-center text-[9.5px] font-semibold text-white/55 leading-tight">
                {step.label}
              </div>
            </div>
          )
        })}
      </div>

      <style jsx>{`
        @keyframes hipaaSweep {
          0% {
            stroke-dasharray: 0 420;
          }
          70% {
            stroke-dasharray: 420 0;
          }
          100% {
            stroke-dasharray: 420 0;
          }
        }
        .hipaa-nprm-card__sweep {
          stroke-dasharray: 0 420;
          animation: hipaaSweep 6s cubic-bezier(0.65, 0, 0.35, 1) infinite;
        }

        .hipaa-nprm-card__icon {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #0a0604;
          border: 1.5px solid rgba(255, 255, 255, 0.12);
          position: relative;
          animation: hipaaLight 6s linear infinite;
          animation-delay: calc(var(--i) * 1s);
        }
        .hipaa-nprm-card__icon::before {
          content: '';
          position: absolute;
          inset: -3px;
          border-radius: 50%;
          background: linear-gradient(135deg, #ef4444, #ff6b35, #f59e0b);
          opacity: 0;
          filter: blur(6px);
          transition: opacity 0.3s ease-out;
          animation: hipaaLightGlow 6s linear infinite;
          animation-delay: calc(var(--i) * 1s);
          z-index: -1;
        }

        @keyframes hipaaLight {
          0%,
          70%,
          100% {
            background: #0a0604;
            border-color: rgba(255, 255, 255, 0.12);
          }
          15%,
          25% {
            background: linear-gradient(135deg, #ef4444, #ff6b35, #f59e0b);
            border-color: rgba(255, 107, 53, 0.9);
          }
        }
        @keyframes hipaaLightGlow {
          0%,
          70%,
          100% {
            opacity: 0;
          }
          15%,
          25% {
            opacity: 0.85;
          }
        }
      `}</style>
    </div>
  )
}
