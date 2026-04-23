'use client'

/**
 * HIPAA Elite Assessment — cinematic multi-step modal.
 *
 * Flow:
 *   Step 1: Website + Dashboard URLs
 *   Step 2: Entity type + State
 *   Step 3: Contact (email, name, company)
 *   Step 4: Confirm & Scan
 *   Step 5: Transition into scanning animation → navigate to /hipaa/results
 *
 * Design:
 *   - Dark-glass surface with animated lava-gradient accent lines
 *   - Each step slides/fades across; persistent progress dots at top
 *   - Chat widget hint in the corner (the real widget is always mounted on
 *     /hipaa page, so we just nudge users toward it)
 */

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  X,
  ArrowRight,
  ArrowLeft,
  Globe,
  Layers,
  Building2,
  Mail,
  MapPin,
  CheckCircle2,
  Loader2,
  Sparkles,
  Shield,
  MessageSquare,
  ChevronRight,
} from 'lucide-react'

interface Props {
  open: boolean
  onClose: () => void
}

const STATES = ['AL','AK','AZ','AR','CA','CO','CT','DE','DC','FL','GA','HI','ID','IL','IN','IA','KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT','VA','WA','WV','WI','WY']

export function HipaaEliteAssessment({ open, onClose }: Props) {
  const router = useRouter()

  const [step, setStep] = useState(0)
  const [direction, setDirection] = useState<'forward' | 'back'>('forward')

  // Form state
  const [publicUrl, setPublicUrl] = useState('')
  const [dashboardUrl, setDashboardUrl] = useState('')
  const [entityType, setEntityType] = useState<'covered-entity' | 'business-associate' | 'both' | 'unsure'>('unsure')
  const [state, setState] = useState('')
  const [email, setEmail] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!open) {
      // reset after close animation
      setTimeout(() => {
        setStep(0)
        setDirection('forward')
      }, 300)
    }
  }, [open])

  // Esc to close
  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open, onClose])

  function next() {
    setDirection('forward')
    setStep((s) => Math.min(s + 1, 4))
  }
  function back() {
    setDirection('back')
    setStep((s) => Math.max(s - 1, 0))
  }

  function canAdvance(): boolean {
    if (step === 0) return publicUrl.trim().length > 3
    if (step === 1) return entityType !== undefined
    if (step === 2) return email.includes('@')
    if (step === 3) return true
    return false
  }

  async function submit() {
    setSubmitting(true)
    setDirection('forward')
    setStep(4)
    // Route to scan results with params — matches the existing pipeline.
    const params = new URLSearchParams({
      url: publicUrl,
      ...(dashboardUrl && { dashboardUrl }),
      ...(email && { email }),
      ...(companyName && { companyName }),
      entityType,
      ...(state && { state }),
    })
    // Small delay so the success animation plays
    setTimeout(() => {
      router.push(`/hipaa/results?${params}`)
    }, 2200)
  }

  if (!open) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="hipaa-elite-title"
      className="hipaa-elite-overlay fixed inset-0 z-[9999] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="hipaa-elite-panel relative w-full max-w-2xl rounded-3xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Animated lava edge */}
        <div className="hipaa-elite-edge-top" />
        <div className="hipaa-elite-edge-bottom" />
        <div className="hipaa-elite-glow-tl" />
        <div className="hipaa-elite-glow-br" />

        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 z-20 h-9 w-9 rounded-lg border border-white/10 bg-white/5 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="relative p-6 md:p-10 z-10">
          {/* Header */}
          <div className="flex items-center gap-3 mb-4">
            <div
              className="h-11 w-11 rounded-xl flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg,#ef4444,#ff6b35,#f59e0b)',
                boxShadow: '0 0 24px rgba(255,107,53,0.4)',
              }}
            >
              <Shield className="h-5 w-5 text-white" strokeWidth={2.6} />
            </div>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-[0.24em] text-orange-400">
                Elite Assessment · 51 checks
              </div>
              <h2 id="hipaa-elite-title" className="text-xl font-bold text-white leading-tight">
                Let's see exactly where you stand.
              </h2>
            </div>
          </div>

          {/* Progress dots */}
          <ProgressDots current={step} total={5} />

          {/* Steps */}
          <div className="relative mt-7 min-h-[280px]">
            {step === 0 && (
              <Scene direction={direction} key="s0">
                <StepHeading
                  eyebrow="Target"
                  title="Which site do you want scanned?"
                  subtitle="Your public site and, optionally, a patient dashboard or portal URL."
                />
                <Field
                  label="Public website URL"
                  required
                  icon={<Globe className="h-4 w-4 text-white/40" />}
                  type="url"
                  placeholder="https://yourpractice.com"
                  value={publicUrl}
                  onChange={setPublicUrl}
                />
                <Field
                  label="Dashboard / portal URL"
                  hint="If left blank we scan the main URL for both layers."
                  icon={<Layers className="h-4 w-4 text-white/40" />}
                  type="url"
                  placeholder="https://portal.yourpractice.com"
                  value={dashboardUrl}
                  onChange={setDashboardUrl}
                />
              </Scene>
            )}

            {step === 1 && (
              <Scene direction={direction} key="s1">
                <StepHeading
                  eyebrow="Context"
                  title="Who are you to HIPAA?"
                  subtitle="This calibrates which §164 subparts we weight most heavily in your report."
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { id: 'covered-entity', label: 'Covered Entity', sub: 'Provider, plan, clearinghouse' },
                    { id: 'business-associate', label: 'Business Associate', sub: 'Vendor with a signed BAA' },
                    { id: 'both', label: 'Both', sub: 'Hybrid entity' },
                    { id: 'unsure', label: 'Not Sure', sub: "We'll figure it out in the report" },
                  ].map((o) => (
                    <button
                      key={o.id}
                      onClick={() => setEntityType(o.id as typeof entityType)}
                      className={`text-left rounded-xl border p-4 transition-all ${
                        entityType === o.id
                          ? 'border-orange-500/70 bg-orange-500/10 shadow-[0_0_20px_rgba(255,107,53,0.2)]'
                          : 'border-white/10 bg-white/[0.03] hover:border-white/25 hover:bg-white/[0.06]'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <div className="font-bold text-sm text-white">{o.label}</div>
                        {entityType === o.id && (
                          <CheckCircle2 className="h-4 w-4 text-orange-400" />
                        )}
                      </div>
                      <div className="text-[11px] text-white/50">{o.sub}</div>
                    </button>
                  ))}
                </div>

                <div className="mt-5">
                  <label className="block text-xs font-semibold text-white/70 mb-1.5">
                    State
                  </label>
                  <div className="relative rounded-lg border border-white/10 bg-white/[0.03] focus-within:border-orange-500/40 transition-colors">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
                    <select
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      className="w-full h-11 pl-10 pr-4 bg-transparent text-sm text-white focus:outline-none appearance-none"
                    >
                      <option value="" className="bg-zinc-950">Optional — select state</option>
                      {STATES.map((s) => (
                        <option key={s} value={s} className="bg-zinc-950">
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </Scene>
            )}

            {step === 2 && (
              <Scene direction={direction} key="s2">
                <StepHeading
                  eyebrow="Delivery"
                  title="Where should we send your results?"
                  subtitle="Your report is delivered in under 15 minutes. We never share it."
                />
                <Field
                  label="Email"
                  required
                  icon={<Mail className="h-4 w-4 text-white/40" />}
                  type="email"
                  placeholder="you@company.com"
                  value={email}
                  onChange={setEmail}
                />
                <Field
                  label="Company / practice name"
                  icon={<Building2 className="h-4 w-4 text-white/40" />}
                  type="text"
                  placeholder="Acme Health, Inc."
                  value={companyName}
                  onChange={setCompanyName}
                />
              </Scene>
            )}

            {step === 3 && (
              <Scene direction={direction} key="s3">
                <StepHeading
                  eyebrow="Confirm"
                  title="Ready to scan."
                  subtitle="We'll run all 51 checks and draft a prioritized findings report against both current HIPAA and the 2026 NPRM."
                />
                <div className="rounded-xl border border-white/10 bg-black/40 divide-y divide-white/5">
                  <Row label="Public URL" value={publicUrl || '—'} />
                  {dashboardUrl && <Row label="Dashboard URL" value={dashboardUrl} />}
                  <Row label="Entity type" value={entityType.replace('-', ' ')} />
                  {state && <Row label="State" value={state} />}
                  <Row label="Email" value={email || '—'} />
                  {companyName && <Row label="Company" value={companyName} />}
                </div>
                <div className="mt-4 rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-3 text-[11px] leading-relaxed text-white/70">
                  <strong className="text-emerald-300">Passive scan only.</strong> We never log in,
                  submit forms, or access patient data. No PHI touched. ~30 seconds.
                </div>
              </Scene>
            )}

            {step === 4 && (
              <Scene direction="forward" key="s4">
                <div className="text-center py-6">
                  <div className="hipaa-elite-scanloop mx-auto mb-6" />
                  <div className="text-[10px] font-bold uppercase tracking-[0.24em] text-orange-400 mb-2">
                    Initiating
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">
                    Deploying the scanner
                  </h3>
                  <p className="text-sm text-white/60 max-w-sm mx-auto">
                    Connecting to {new URL(publicUrl || 'https://example.com').hostname}. Your
                    report will stream in as findings land.
                  </p>
                </div>
              </Scene>
            )}
          </div>

          {/* Footer nav */}
          {step < 4 && (
            <div className="mt-6 flex items-center justify-between gap-3">
              {step > 0 ? (
                <button
                  onClick={back}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-white/70 hover:bg-white/10"
                >
                  <ArrowLeft className="h-4 w-4" /> Back
                </button>
              ) : (
                <div className="text-[11px] text-white/40 flex items-center gap-1.5">
                  <MessageSquare className="h-3.5 w-3.5" /> Chat available anytime —
                  corner bottom-right
                </div>
              )}

              {step < 3 ? (
                <button
                  onClick={next}
                  disabled={!canAdvance()}
                  className="hipaa-elite-primary group inline-flex items-center gap-2 rounded-xl px-6 py-2.5 text-sm font-semibold text-white disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Continue
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                </button>
              ) : (
                <button
                  onClick={submit}
                  disabled={submitting}
                  className="hipaa-elite-primary group inline-flex items-center gap-2 rounded-xl px-6 py-2.5 text-sm font-semibold text-white disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" /> Launching
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" />
                      Start scan
                      <ChevronRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                    </>
                  )}
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .hipaa-elite-overlay {
          background: radial-gradient(ellipse at center, rgba(0,0,0,0.85), rgba(0,0,0,0.95));
          backdrop-filter: blur(14px);
          animation: hipaaEliteFade 0.3s ease-out;
        }
        .hipaa-elite-panel {
          background: linear-gradient(145deg, #120905 0%, #070403 100%);
          border: 1px solid rgba(255, 107, 53, 0.18);
          box-shadow:
            0 60px 120px -20px rgba(0, 0, 0, 0.9),
            0 0 80px -20px rgba(255, 107, 53, 0.25);
          animation: hipaaElitePop 0.45s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .hipaa-elite-edge-top,
        .hipaa-elite-edge-bottom {
          position: absolute;
          left: 0;
          right: 0;
          height: 2px;
          background: linear-gradient(
            90deg,
            transparent 0%,
            #ef4444 25%,
            #ff6b35 50%,
            #f59e0b 75%,
            transparent 100%
          );
          background-size: 200% 100%;
          animation: hipaaShimmer 3s linear infinite;
          z-index: 15;
        }
        .hipaa-elite-edge-top { top: 0; }
        .hipaa-elite-edge-bottom { bottom: 0; }
        .hipaa-elite-glow-tl,
        .hipaa-elite-glow-br {
          position: absolute;
          width: 280px;
          height: 280px;
          border-radius: 50%;
          filter: blur(60px);
          pointer-events: none;
        }
        .hipaa-elite-glow-tl {
          top: -80px;
          left: -80px;
          background: radial-gradient(circle, rgba(239,68,68,0.35), transparent 70%);
        }
        .hipaa-elite-glow-br {
          bottom: -100px;
          right: -100px;
          background: radial-gradient(circle, rgba(245,158,11,0.25), transparent 70%);
        }
        .hipaa-elite-primary {
          background: linear-gradient(135deg, #ef4444, #ff6b35, #f59e0b);
          box-shadow: 0 8px 24px -6px rgba(255, 107, 53, 0.55);
          transition: transform 0.2s, box-shadow 0.3s;
        }
        .hipaa-elite-primary:not(:disabled):hover {
          transform: translateY(-1px);
          box-shadow: 0 14px 32px -6px rgba(255, 107, 53, 0.65);
        }
        .hipaa-elite-scanloop {
          width: 64px;
          height: 64px;
          border-radius: 50%;
          background: conic-gradient(from 0deg, transparent, #ff6b35, #f59e0b, transparent);
          mask: radial-gradient(circle, transparent 55%, black 56%);
          -webkit-mask: radial-gradient(circle, transparent 55%, black 56%);
          animation: hipaaSpin 1.2s linear infinite;
          filter: drop-shadow(0 0 12px rgba(255, 107, 53, 0.6));
        }
        @keyframes hipaaEliteFade {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes hipaaElitePop {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.96);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        @keyframes hipaaShimmer {
          0% { background-position: 0% 0; }
          100% { background-position: 200% 0; }
        }
        @keyframes hipaaSpin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}

function ProgressDots({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center gap-1.5">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={`h-1 rounded-full transition-all duration-500 ${
            i === current
              ? 'w-10 bg-gradient-to-r from-red-500 via-orange-500 to-amber-500 shadow-[0_0_8px_rgba(255,107,53,0.6)]'
              : i < current
                ? 'w-4 bg-orange-400/40'
                : 'w-4 bg-white/10'
          }`}
        />
      ))}
    </div>
  )
}

function Scene({
  direction,
  children,
}: {
  direction: 'forward' | 'back'
  children: React.ReactNode
}) {
  return (
    <div
      className="space-y-4"
      style={{
        animation: `hipaaScene${direction === 'forward' ? 'Fwd' : 'Back'} 0.4s cubic-bezier(0.16, 1, 0.3, 1)`,
      }}
    >
      {children}
      <style jsx>{`
        @keyframes hipaaSceneFwd {
          from {
            opacity: 0;
            transform: translateX(32px);
            filter: blur(4px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
            filter: blur(0);
          }
        }
        @keyframes hipaaSceneBack {
          from {
            opacity: 0;
            transform: translateX(-32px);
            filter: blur(4px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
            filter: blur(0);
          }
        }
      `}</style>
    </div>
  )
}

function StepHeading({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string
  title: string
  subtitle: string
}) {
  return (
    <div className="mb-1">
      <div className="text-[10px] font-bold uppercase tracking-[0.22em] text-orange-400 mb-1">
        {eyebrow}
      </div>
      <h3 className="text-xl font-bold text-white">{title}</h3>
      <p className="text-sm text-white/60 mt-1 leading-relaxed">{subtitle}</p>
    </div>
  )
}

function Field({
  label,
  hint,
  icon,
  type,
  required = false,
  placeholder,
  value,
  onChange,
}: {
  label: string
  hint?: string
  icon: React.ReactNode
  type: string
  required?: boolean
  placeholder: string
  value: string
  onChange: (v: string) => void
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-white/80 mb-1.5">
        {label}
        {required && <span className="text-orange-400 ml-1">*</span>}
      </label>
      <div className="relative rounded-lg border border-white/10 bg-white/[0.03] focus-within:border-orange-500/40 focus-within:bg-white/[0.05] transition-colors">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
          {icon}
        </div>
        <input
          type={type}
          required={required}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full h-11 pl-10 pr-4 bg-transparent text-sm text-white placeholder:text-white/25 focus:outline-none"
        />
      </div>
      {hint && <p className="text-[11px] text-white/35 mt-1 ml-1">{hint}</p>}
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between px-4 py-2.5 text-sm">
      <span className="text-white/45">{label}</span>
      <span className="text-white font-medium truncate max-w-[60%] text-right">
        {value}
      </span>
    </div>
  )
}
