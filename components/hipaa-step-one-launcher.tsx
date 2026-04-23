'use client'

/**
 * STEP 1 — "What is your main website?"
 *
 * The public entry point on /hipaa. A single focused field that launches
 * the Elite Assessment modal pre-filled with the URL the visitor types,
 * so the modal starts at Step 2 (entity type) with no redundant prompt.
 */

import { useState } from 'react'
import { ArrowRight, Globe, Shield, Zap } from 'lucide-react'
import { HipaaEliteAssessment } from './hipaa-elite-assessment'

export function HipaaStepOneLauncher() {
  const [url, setUrl] = useState('')
  const [launched, setLaunched] = useState(false)

  function launch(e?: React.FormEvent) {
    if (e) e.preventDefault()
    if (!url.trim()) return
    let value = url.trim()
    if (!/^https?:\/\//i.test(value)) value = `https://${value}`
    setUrl(value)
    setLaunched(true)
  }

  return (
    <>
      <div className="hipaa-step1 relative mx-auto max-w-2xl rounded-3xl overflow-hidden">
        <div className="hipaa-step1__topline" />
        <div className="hipaa-step1__glow-tl" />
        <div className="hipaa-step1__glow-br" />

        <div className="relative p-7 md:p-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-orange-500/35 bg-orange-500/5 text-orange-400 text-[10px] font-bold uppercase tracking-[0.24em] mb-4">
            <Shield className="h-3.5 w-3.5" />
            Step 1 · Elite Assessment
          </div>

          <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight mb-2">
            What is your main website?
          </h2>
          <p className="text-sm text-white/55 max-w-md mx-auto mb-7 leading-relaxed">
            Start here. We'll run a passive 51-point HIPAA compliance scan and draft
            your cited report in under 15 minutes.
          </p>

          <form onSubmit={launch} className="max-w-lg mx-auto">
            <div className="hipaa-step1__field relative rounded-xl">
              <div className="absolute left-4 top-1/2 -translate-y-1/2">
                <Globe className="h-5 w-5 text-white/35" />
              </div>
              <input
                type="text"
                autoFocus
                required
                placeholder="yourpractice.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') launch()
                }}
                className="w-full h-16 pl-12 pr-36 bg-transparent text-base md:text-lg text-white placeholder:text-white/25 focus:outline-none"
              />
              <button
                type="submit"
                disabled={!url.trim()}
                className="hipaa-step1__cta absolute right-2 top-1/2 -translate-y-1/2 inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-bold disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Zap className="h-4 w-4" />
                Continue
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </form>

          <div className="mt-5 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[11px] text-white/35">
            <span>Passive scan — we never log in or touch PHI</span>
            <span className="text-white/15">·</span>
            <span>~30 seconds</span>
            <span className="text-white/15">·</span>
            <span>Free</span>
          </div>
        </div>

        <style jsx>{`
          .hipaa-step1 {
            background: linear-gradient(145deg, #120905 0%, #080504 100%);
            border: 1px solid rgba(255, 107, 53, 0.18);
            box-shadow:
              0 40px 100px -24px rgba(0, 0, 0, 0.9),
              0 0 60px -20px rgba(255, 107, 53, 0.3),
              inset 0 1px 0 rgba(255, 255, 255, 0.04);
          }
          .hipaa-step1__topline {
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
            background-size: 200% 100%;
            animation: hipaaStep1Shimmer 4s linear infinite;
          }
          @keyframes hipaaStep1Shimmer {
            0% { background-position: 0% 0; }
            100% { background-position: 200% 0; }
          }
          .hipaa-step1__glow-tl,
          .hipaa-step1__glow-br {
            position: absolute;
            width: 240px;
            height: 240px;
            border-radius: 50%;
            filter: blur(70px);
            pointer-events: none;
          }
          .hipaa-step1__glow-tl {
            top: -80px;
            left: -80px;
            background: radial-gradient(circle, rgba(239, 68, 68, 0.3), transparent 70%);
          }
          .hipaa-step1__glow-br {
            bottom: -90px;
            right: -90px;
            background: radial-gradient(circle, rgba(245, 158, 11, 0.22), transparent 70%);
          }
          .hipaa-step1__field {
            background: rgba(255, 255, 255, 0.03);
            border: 1.5px solid rgba(255, 107, 53, 0.25);
            box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.04);
            transition: border-color 0.2s ease, box-shadow 0.2s ease;
          }
          .hipaa-step1__field:focus-within {
            border-color: rgba(255, 107, 53, 0.65);
            box-shadow:
              inset 0 1px 0 rgba(255, 255, 255, 0.05),
              0 0 0 4px rgba(255, 107, 53, 0.12);
          }
          .hipaa-step1__cta {
            background: linear-gradient(135deg, #ef4444, #ff6b35, #f59e0b);
            color: #fff;
            box-shadow: 0 6px 20px -4px rgba(255, 107, 53, 0.55);
            transition: transform 0.2s ease, box-shadow 0.3s ease;
          }
          .hipaa-step1__cta:not(:disabled):hover {
            transform: translateY(-1px) scale(1.02);
            box-shadow: 0 10px 26px -4px rgba(255, 107, 53, 0.7);
          }
        `}</style>
      </div>

      <HipaaEliteAssessment
        open={launched}
        onClose={() => setLaunched(false)}
        initialUrl={url}
      />
    </>
  )
}
