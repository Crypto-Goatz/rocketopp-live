'use client'

/**
 * HIPAA magic-link login modal.
 *
 * Collects the email the customer ordered with, plus their website URL
 * and company name for verification, then sends a magic link to their
 * HIPAA dashboard at /dashboard/hipaa.
 *
 * The website + company fields are friction-by-design: they make the
 * signin feel "verified" and give support a paper trail, but the
 * server-side magic-link is keyed on email alone.
 */

import { useState } from 'react'
import { Shield, Mail, Globe, Building2, Loader2, ArrowRight, CheckCircle2, X } from 'lucide-react'

interface Props {
  trigger: React.ReactNode
}

export function HipaaLoginModal({ trigger }: Props) {
  const [open, setOpen] = useState(false)
  const [email, setEmail] = useState('')
  const [website, setWebsite] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return
    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/hipaa/magic/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          website: website.trim() || null,
          companyName: companyName.trim() || null,
        }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data?.error || 'Failed to send magic link')
      }
      setSent(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  function handleClose() {
    setOpen(false)
    // Reset after the close animation
    setTimeout(() => {
      setSent(false)
      setError(null)
      setEmail('')
      setWebsite('')
      setCompanyName('')
    }, 300)
  }

  return (
    <>
      <span onClick={() => setOpen(true)} style={{ cursor: 'pointer' }}>
        {trigger}
      </span>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="hipaa-login-title"
          className="hipaa-login-overlay fixed inset-0 z-[9999] overflow-y-auto"
          onClick={handleClose}
        >
          {/* Inner flex wrapper — min-h-full so it fills the scroll container.
             items-center vertically centers when there's room; overflow
             scrolls naturally when the panel is taller than the viewport. */}
          <div className="flex min-h-full items-center justify-center p-4">
            <div
              onClick={(e) => e.stopPropagation()}
              className="hipaa-login-panel relative w-full max-w-md rounded-2xl overflow-hidden"
            >
            {/* Cinematic lava edges + radial corner glows (matches elite assessment) */}
            <div className="hipaa-login-edge hipaa-login-edge--top" />
            <div className="hipaa-login-edge hipaa-login-edge--bottom" />
            <div className="hipaa-login-glow hipaa-login-glow--tl" />
            <div className="hipaa-login-glow hipaa-login-glow--br" />

            <button
              onClick={handleClose}
              aria-label="Close"
              className="absolute top-4 right-4 h-8 w-8 rounded-lg border border-white/10 bg-white/5 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="p-8">
              {!sent ? (
                <>
                  <div className="flex items-center gap-3 mb-6">
                    <div
                      className="h-11 w-11 rounded-xl flex items-center justify-center"
                      style={{
                        background: 'linear-gradient(135deg, #ef4444, #f97316)',
                        boxShadow: '0 0 20px rgba(239,68,68,0.3)',
                      }}
                    >
                      <Shield className="h-5 w-5 text-white" strokeWidth={2.5} />
                    </div>
                    <div>
                      <h2 id="hipaa-login-title" className="text-lg font-bold text-white">
                        Access your HIPAA dashboard
                      </h2>
                      <p className="text-xs text-white/50 mt-0.5">
                        We'll email you a magic link — no password.
                      </p>
                    </div>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <Field
                      id="email"
                      label="Email address"
                      hint="The email you used when you ordered your report"
                      icon={<Mail className="h-4 w-4 text-white/40" />}
                      type="email"
                      required
                      placeholder="you@company.com"
                      value={email}
                      onChange={setEmail}
                    />

                    <Field
                      id="website"
                      label="Website"
                      hint="The site we scanned for you"
                      icon={<Globe className="h-4 w-4 text-white/40" />}
                      type="url"
                      placeholder="https://yourpractice.com"
                      value={website}
                      onChange={setWebsite}
                    />

                    <Field
                      id="company"
                      label="Company name"
                      hint="The practice, clinic, or business"
                      icon={<Building2 className="h-4 w-4 text-white/40" />}
                      type="text"
                      placeholder="Acme Health, Inc."
                      value={companyName}
                      onChange={setCompanyName}
                    />

                    {error && (
                      <div className="rounded-lg border border-red-500/30 bg-red-950/40 px-3 py-2 text-xs text-red-300">
                        {error}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={loading || !email}
                      className="group w-full h-12 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                      style={{
                        background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                        color: '#fff',
                        boxShadow: '0 4px 20px rgba(239,68,68,0.25)',
                      }}
                    >
                      {loading ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Sending…
                        </>
                      ) : (
                        <>
                          Send magic link
                          <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                        </>
                      )}
                    </button>

                    <p className="text-[11px] text-white/30 text-center">
                      We'll send a one-time link that expires in 30 minutes.
                    </p>
                  </form>
                </>
              ) : (
                <div className="text-center py-4">
                  <div
                    className="mx-auto h-14 w-14 rounded-2xl flex items-center justify-center mb-5"
                    style={{
                      background: 'linear-gradient(135deg, rgba(16,185,129,0.2), rgba(16,185,129,0.05))',
                      border: '1px solid rgba(16,185,129,0.3)',
                    }}
                  >
                    <CheckCircle2 className="h-7 w-7 text-emerald-400" strokeWidth={2.2} />
                  </div>
                  <h2 className="text-xl font-bold text-white mb-2">Check your inbox</h2>
                  <p className="text-sm text-white/60 leading-relaxed mb-6">
                    We sent a magic link to{' '}
                    <span className="text-white font-semibold">{email}</span>. Click it to jump
                    straight into your HIPAA dashboard.
                  </p>
                  <div className="rounded-lg border border-white/10 bg-white/[0.03] p-3 mb-5 text-left">
                    <p className="text-[11px] text-white/40 uppercase tracking-wide mb-1">Don't see it?</p>
                    <p className="text-xs text-white/60">
                      Check spam, or make sure this is the email you used when you ordered.
                      Links expire in 30 minutes.
                    </p>
                  </div>
                  <button
                    onClick={handleClose}
                    className="text-xs text-white/50 hover:text-white transition-colors"
                  >
                    Close
                  </button>
                </div>
              )}
            </div>
            </div>
          </div>

          <style jsx>{`
            .hipaa-login-overlay {
              background: radial-gradient(
                ellipse at center,
                rgba(0, 0, 0, 0.85),
                rgba(0, 0, 0, 0.95)
              );
              backdrop-filter: blur(14px);
              animation: hipaaLoginFade 0.3s ease-out;
            }
            .hipaa-login-panel {
              background: linear-gradient(145deg, #120905 0%, #070403 100%);
              border: 1px solid rgba(255, 107, 53, 0.18);
              box-shadow:
                0 60px 120px -20px rgba(0, 0, 0, 0.9),
                0 0 80px -20px rgba(255, 107, 53, 0.25);
              animation: hipaaLoginPop 0.45s cubic-bezier(0.16, 1, 0.3, 1);
            }
            .hipaa-login-edge {
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
              animation: hipaaLoginShimmer 3s linear infinite;
              z-index: 15;
            }
            .hipaa-login-edge--top { top: 0; }
            .hipaa-login-edge--bottom { bottom: 0; }
            .hipaa-login-glow {
              position: absolute;
              width: 260px;
              height: 260px;
              border-radius: 50%;
              filter: blur(60px);
              pointer-events: none;
            }
            .hipaa-login-glow--tl {
              top: -80px;
              left: -80px;
              background: radial-gradient(circle, rgba(239, 68, 68, 0.32), transparent 70%);
            }
            .hipaa-login-glow--br {
              bottom: -100px;
              right: -100px;
              background: radial-gradient(circle, rgba(245, 158, 11, 0.22), transparent 70%);
            }
            @keyframes hipaaLoginFade {
              from { opacity: 0; }
              to { opacity: 1; }
            }
            @keyframes hipaaLoginPop {
              from {
                opacity: 0;
                transform: translateY(20px) scale(0.96);
              }
              to {
                opacity: 1;
                transform: translateY(0) scale(1);
              }
            }
            @keyframes hipaaLoginShimmer {
              0% { background-position: 0% 0; }
              100% { background-position: 200% 0; }
            }
          `}</style>
        </div>
      )}
    </>
  )
}

function Field({
  id,
  label,
  hint,
  icon,
  type,
  required = false,
  placeholder,
  value,
  onChange,
}: {
  id: string
  label: string
  hint: string
  icon: React.ReactNode
  type: string
  required?: boolean
  placeholder: string
  value: string
  onChange: (v: string) => void
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-xs font-semibold text-white/80 mb-1.5">
        {label}
        {required && <span className="text-red-400 ml-1">*</span>}
      </label>
      <div
        className="relative rounded-lg border border-white/10 bg-white/[0.03] focus-within:border-red-500/40 focus-within:bg-white/[0.05] transition-colors"
      >
        <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">{icon}</div>
        <input
          id={id}
          type={type}
          required={required}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full h-11 pl-10 pr-4 bg-transparent text-sm text-white placeholder:text-white/25 focus:outline-none"
        />
      </div>
      <p className="text-[11px] text-white/35 mt-1 ml-1">{hint}</p>
    </div>
  )
}
