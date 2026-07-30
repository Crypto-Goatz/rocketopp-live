'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { ArrowRight, Check, Loader2, ShieldCheck, Sparkles } from 'lucide-react'

/**
 * "Just tell it what to change" — the animated demo under the hero.
 *
 * Shows the actual mechanic rather than describing it: a plain-English request
 * types itself out, then the pipeline stages resolve one by one (parse → code
 * checks → human review → live). That sequence IS the pitch, because the human
 * review step is what separates this from an AI that edits your site unsupervised.
 *
 * Honesty constraints baked in:
 *  - The timing says "usually within the hour", matching what we actually
 *    promise. It never implies instant.
 *  - The review stage is shown explicitly, because we do review every change and
 *    that is the reassuring part, not a caveat to hide.
 *  - Requests are the real examples Mike gave, not invented capability.
 *
 * Respects prefers-reduced-motion: the animation is replaced with all three
 * requests shown statically and the pipeline in its completed state.
 */

const REQUESTS = [
  'Change the phone number on the contact page to (724) 555-0199',
  'Add a new service called In-Home Consults and write the content for it',
  'Send a thank you email as soon as they fill out our contact form',
] as const

const STAGES = [
  { label: 'Request understood', detail: 'Parsed into concrete site changes' },
  { label: 'Code checks passed', detail: 'Build, links, schema, mobile layout' },
  { label: 'Reviewed by our team', detail: 'A human signs off before anything ships' },
  { label: 'Live on your site', detail: 'Usually within the hour' },
] as const

const TYPE_MS = 26
const STAGE_MS = 620
const HOLD_MS = 2200

export default function PlainEnglishDemo() {
  const [reduced, setReduced] = useState(false)
  const [idx, setIdx] = useState(0)
  const [typed, setTyped] = useState('')
  const [stage, setStage] = useState(-1)
  const timers = useRef<ReturnType<typeof setTimeout>[]>([])

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduced(mq.matches)
    const onChange = () => setReduced(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  // One self-scheduling cycle: type the request, resolve each stage, hold, advance.
  useEffect(() => {
    if (reduced) return
    const clear = () => {
      timers.current.forEach(clearTimeout)
      timers.current = []
    }
    clear()
    setTyped('')
    setStage(-1)

    const text = REQUESTS[idx]
    let i = 0
    const push = (fn: () => void, ms: number) => {
      timers.current.push(setTimeout(fn, ms))
    }

    const typeNext = () => {
      i += 1
      setTyped(text.slice(0, i))
      if (i < text.length) {
        push(typeNext, TYPE_MS)
      } else {
        STAGES.forEach((_, s) => push(() => setStage(s), STAGE_MS * (s + 1)))
        push(() => setIdx((p) => (p + 1) % REQUESTS.length), STAGE_MS * STAGES.length + HOLD_MS)
      }
    }
    push(typeNext, 400)
    return clear
  }, [idx, reduced])

  const shown = reduced ? REQUESTS[0] : typed
  const stagesDone = reduced ? STAGES.length - 1 : stage

  const caret = useMemo(
    () => !reduced && typed.length < REQUESTS[idx].length,
    [reduced, typed, idx],
  )

  return (
    <section className="border-y border-border bg-muted/10 py-16 md:py-24">
      <div className="container mx-auto max-w-5xl px-4">
        {/* ---- Copy ---- */}
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-primary">
            <ShieldCheck className="h-3.5 w-3.5" />
            Patent pending
          </span>

          <h2 className="mt-6 text-3xl font-bold tracking-tight md:text-4xl">
            Change your own website by{' '}
            <span className="bg-gradient-to-r from-primary via-orange-400 to-primary bg-clip-text text-transparent">
              just asking
            </span>
            .
          </h2>

          <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
            These sites are built on our own patent-pending technology, which means you update
            them yourself — in plain English. No dashboard to learn, no tickets, no calling us and
            waiting for a quote to change a phone number.
          </p>
        </div>

        {/* ---- The demo ---- */}
        <div className="mx-auto mt-12 max-w-2xl">
          <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-2xl shadow-black/40">
            {/* Chrome */}
            <div className="flex items-center gap-2 border-b border-border bg-muted/30 px-4 py-3">
              <span className="h-2.5 w-2.5 rounded-full bg-muted-foreground/25" />
              <span className="h-2.5 w-2.5 rounded-full bg-muted-foreground/25" />
              <span className="h-2.5 w-2.5 rounded-full bg-muted-foreground/25" />
              <span className="ml-2 font-mono text-xs text-muted-foreground">
                yoursite.com — request a change
              </span>
            </div>

            <div className="p-5 sm:p-6">
              {/* The request */}
              <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
                You
              </p>
              <div className="mt-2 min-h-[86px] rounded-xl border border-primary/25 bg-primary/[0.06] p-4">
                {reduced ? (
                  <ul className="space-y-2">
                    {REQUESTS.map((r) => (
                      <li key={r} className="text-[15px] leading-relaxed text-foreground">
                        &ldquo;{r}&rdquo;
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p
                    className="text-[15px] leading-relaxed text-foreground"
                    aria-live="polite"
                    aria-atomic="true"
                  >
                    &ldquo;{shown}
                    {caret && (
                      <span className="ml-0.5 inline-block h-[1.05em] w-[2px] translate-y-[3px] animate-pulse bg-primary align-middle" />
                    )}
                    {!caret && '"'}
                  </p>
                )}
              </div>

              {/* The pipeline */}
              <p className="mt-6 text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
                0n AI
              </p>
              <ol className="mt-3 space-y-2.5">
                {STAGES.map((s, i) => {
                  const done = stagesDone >= i
                  const active = !reduced && stagesDone === i - 1
                  const last = i === STAGES.length - 1
                  return (
                    <li
                      key={s.label}
                      className={`flex items-start gap-3 transition-opacity duration-500 ${
                        done || active ? 'opacity-100' : 'opacity-35'
                      }`}
                    >
                      <span
                        className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg transition-colors duration-500 ${
                          done
                            ? last
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-primary/15 text-primary'
                            : 'bg-muted text-muted-foreground'
                        }`}
                      >
                        {done ? (
                          last ? (
                            <ArrowRight className="h-3.5 w-3.5" strokeWidth={3} />
                          ) : (
                            <Check className="h-3.5 w-3.5" strokeWidth={3} />
                          )
                        ) : active ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <span className="h-1.5 w-1.5 rounded-full bg-current opacity-50" />
                        )}
                      </span>
                      <span className="min-w-0">
                        <span
                          className={`block text-sm font-semibold ${
                            done && last ? 'text-primary' : 'text-foreground'
                          }`}
                        >
                          {s.label}
                        </span>
                        <span className="block text-xs text-muted-foreground">{s.detail}</span>
                      </span>
                    </li>
                  )
                })}
              </ol>
            </div>
          </div>

          {/* Request indicator */}
          {!reduced && (
            <div className="mt-4 flex justify-center gap-1.5" aria-hidden>
              {REQUESTS.map((r, i) => (
                <span
                  key={r}
                  className={`h-1 rounded-full transition-all duration-500 ${
                    i === idx ? 'w-6 bg-primary' : 'w-1.5 bg-border'
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* ---- The honest part ---- */}
        <div className="mx-auto mt-10 max-w-3xl rounded-2xl border border-border bg-card p-6">
          <h3 className="flex items-center gap-2 font-bold">
            <Sparkles className="h-4 w-4 text-primary" />
            A human still checks everything
          </h3>
          <p className="mt-3 leading-relaxed text-muted-foreground">
            We are not letting an AI loose on your live website unsupervised. Every request runs
            through automated code checks, then we review the result, test what the AI produced,
            and keep tuning it before anything goes out. That is why the answer takes about an hour
            instead of a second — and why the site still works afterwards.
          </p>
        </div>
      </div>
    </section>
  )
}
