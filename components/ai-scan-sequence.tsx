'use client'

import { useState, useEffect } from 'react'
import {
  Search,
  Code2,
  Bot,
  ShieldCheck,
  BarChart3,
  Sparkles,
  Check,
  Loader2,
} from 'lucide-react'

interface Step {
  label: string
  detail: string
  Icon: typeof Search
  /** Cumulative ms by which this step is complete. */
  doneAt: number
}

const STEPS: Step[] = [
  { label: 'Resolving DNS + crawling homepage', detail: 'GET /, parsing <head>, sitemap.xml, robots.txt', Icon: Search,      doneAt: 1200 },
  { label: 'Checking AI-search visibility',     detail: 'GPTBot · ChatGPT-User · Claude-Web · Perplexity', Icon: Bot,         doneAt: 2600 },
  { label: 'Reading schema + structured data',  detail: 'JSON-LD · llms.txt · OpenGraph · Twitter card',    Icon: Code2,       doneAt: 4000 },
  { label: 'Measuring conversion signals',      detail: 'BLUF · CTAs · forms · social proof',               Icon: BarChart3,   doneAt: 5200 },
  { label: 'Verifying trust + security',        detail: 'TLS · CSP · privacy · contact info',               Icon: ShieldCheck, doneAt: 6400 },
  { label: 'Scoring + writing your report',     detail: 'Groq llama-3.3-70b · 0-100 score · 4 priorities', Icon: Sparkles,    doneAt: 7800 },
]

const TOTAL_MS = STEPS[STEPS.length - 1].doneAt

export interface ScanSequenceProps {
  /** Domain being scanned — shown in the header. */
  domain: string
  /** Fires once the animation finishes. Pair with API completion to time the redirect. */
  onComplete?: () => void
}

/**
 * Multi-step scan animation. Each step lights up sequentially with a check
 * mark when complete; current step pulses. Bottom progress bar fills 0→100%.
 *
 * Designed to feel like real diagnostic output rather than a generic spinner.
 * Total runtime ~7.8s — long enough to feel substantive, short enough to not
 * frustrate. Calls onComplete() at the end so the parent can redirect.
 */
export function AiScanSequence({ domain, onComplete }: ScanSequenceProps) {
  const [elapsed, setElapsed] = useState(0)
  const [done, setDone] = useState(false)

  useEffect(() => {
    const start = performance.now()
    let raf = 0
    const tick = () => {
      const e = performance.now() - start
      setElapsed(e)
      if (e >= TOTAL_MS) {
        setDone(true)
        onComplete?.()
        return
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [onComplete])

  const progressPct = Math.min(100, Math.round((elapsed / TOTAL_MS) * 100))
  const currentIdx = STEPS.findIndex((s) => elapsed < s.doneAt)
  const visibleIdx = currentIdx === -1 ? STEPS.length - 1 : currentIdx

  return (
    <div className="px-6 py-6 space-y-5" role="status" aria-live="polite">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="relative shrink-0 w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center">
          {done ? (
            <Check className="w-5 h-5 text-primary" strokeWidth={3} />
          ) : (
            <Loader2 className="w-5 h-5 text-primary animate-spin" />
          )}
          <span className="absolute inset-0 rounded-xl bg-primary/15 animate-ping" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-bold uppercase tracking-widest text-primary">
            {done ? 'Scan complete' : 'Scanning'}
          </p>
          <p className="font-semibold truncate">{domain}</p>
        </div>
        <span className="font-mono text-xs text-muted-foreground tabular-nums shrink-0">
          {progressPct}%
        </span>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 w-full rounded-full bg-card overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-primary via-orange-400 to-primary transition-all duration-100 ease-out"
          style={{ width: `${progressPct}%` }}
        />
      </div>

      {/* Step list */}
      <ul className="space-y-2.5 font-mono text-[13px]">
        {STEPS.map((s, i) => {
          const isDone = elapsed >= s.doneAt
          const isCurrent = !isDone && i === visibleIdx
          const isPending = !isDone && !isCurrent
          const Icon = s.Icon
          return (
            <li
              key={s.label}
              className={`flex items-start gap-3 transition-all ${
                isPending ? 'opacity-30' : 'opacity-100'
              }`}
            >
              <div
                className={`shrink-0 w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${
                  isDone
                    ? 'bg-primary text-primary-foreground'
                    : isCurrent
                    ? 'bg-primary/15 text-primary'
                    : 'bg-card text-muted-foreground'
                }`}
              >
                {isDone ? (
                  <Check className="w-3.5 h-3.5" strokeWidth={3} />
                ) : isCurrent ? (
                  <Icon className="w-3.5 h-3.5 animate-pulse" />
                ) : (
                  <Icon className="w-3.5 h-3.5" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p
                  className={`${
                    isDone || isCurrent ? 'text-foreground' : 'text-muted-foreground'
                  } leading-tight font-semibold`}
                >
                  {s.label}
                  {isCurrent && (
                    <span className="ml-1 inline-block animate-pulse">…</span>
                  )}
                </p>
                <p className="text-[11px] text-muted-foreground/70 mt-0.5 truncate">
                  {s.detail}
                </p>
              </div>
            </li>
          )
        })}
      </ul>

      <p className="text-xs text-muted-foreground text-center pt-1">
        {done
          ? 'Redirecting to your report…'
          : 'You can close this — your report will email when ready.'}
      </p>
    </div>
  )
}

export const SCAN_TOTAL_MS = TOTAL_MS
