'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { X, Sparkles, Mail, Globe } from 'lucide-react'
import { AiScanSequence, SCAN_TOTAL_MS } from './ai-scan-sequence'

const SHOW_KEY = 'rocketopp-aireadiness-shown-at'
const COOLDOWN_MS = 24 * 60 * 60 * 1000 // 24h
// Don't fire on these — already in a flow or transactional surface
const EXCLUDED_PATHS = [
  '/checkout',
  '/order',
  '/ai-readiness',
  '/dashboard',
  '/login',
  '/register',
  '/hipaa',
  '/gtm',
]

export function ExitIntentAiReadiness() {
  const router = useRouter()
  const pathname = usePathname() || ''
  const [open, setOpen] = useState(false)
  const [email, setEmail] = useState('')
  const [domain, setDomain] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const armedRef = useRef(false)

  // ── Arm the exit-intent listener ─────────────────────────────────────
  useEffect(() => {
    // Check exclusions
    if (EXCLUDED_PATHS.some((p) => pathname.startsWith(p))) return

    // Check 24h cooldown
    try {
      const last = Number(localStorage.getItem(SHOW_KEY) || 0)
      if (last && Date.now() - last < COOLDOWN_MS) return
    } catch {
      /* localStorage may be blocked; allow fallthrough */
    }

    // Wait 5s before arming so we don't fire on quick bounce
    const armTimer = setTimeout(() => {
      armedRef.current = true
    }, 5000)

    const handleMouseOut = (e: MouseEvent) => {
      if (!armedRef.current) return
      if (open) return
      // Only trigger when leaving via the top edge
      if (e.clientY > 0) return
      // Ignore relatedTarget that's a select dropdown / iframe
      if (e.relatedTarget) return
      armedRef.current = false
      setOpen(true)
      try {
        localStorage.setItem(SHOW_KEY, String(Date.now()))
      } catch {
        /* ignore */
      }
    }

    document.addEventListener('mouseout', handleMouseOut)
    return () => {
      clearTimeout(armTimer)
      document.removeEventListener('mouseout', handleMouseOut)
    }
  }, [pathname, open])

  // ── ESC to close ─────────────────────────────────────────────────────
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open])

  // ── State machine: idle → scanning (animation + API in parallel) → redirect ──
  const [scanId, setScanId] = useState<string | null>(null)
  const [scanError, setScanError] = useState<string | null>(null)
  const [animationDone, setAnimationDone] = useState(false)

  // When BOTH the scan_id is back AND the animation has finished, redirect.
  useEffect(() => {
    if (!loading) return
    if (scanId && animationDone) {
      router.push(`/ai-readiness/thanks?scanId=${scanId}`)
    }
  }, [loading, scanId, animationDone, router])

  // If the API errors during scan, surface it without leaving the user stuck.
  useEffect(() => {
    if (scanError && animationDone) {
      setError(scanError)
      setLoading(false)
      setScanError(null)
    }
  }, [scanError, animationDone])

  const cleanedDomain = domain.trim().replace(/^https?:\/\//, '').replace(/\/$/, '')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    if (!email || !domain) {
      setError('Email and domain are both required.')
      return
    }
    // Flip into scanning state immediately so the animation starts at t=0 and
    // can run in parallel with the API request. The redirect waits for both.
    setLoading(true)
    setScanId(null)
    setScanError(null)
    setAnimationDone(false)

    try {
      const res = await fetch('/api/ai-readiness/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          domain: cleanedDomain,
          source: 'exit-intent',
        }),
      })
      const data = await res.json()
      if (!res.ok || !data.scan_id) {
        throw new Error(data.error || 'Could not start the scan.')
      }
      setScanId(data.scan_id as string)
    } catch (err) {
      setScanError(err instanceof Error ? err.message : 'Something went wrong.')
    }
  }

  if (!open) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="exit-intent-title"
      className="fixed inset-0 z-[200] flex items-center justify-center px-4 py-6"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={() => setOpen(false)}
      />

      {/* Panel */}
      <div className="relative w-full max-w-lg bg-card border border-border rounded-2xl shadow-2xl shadow-black/60 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
        {/* Accent header — only when not scanning */}
        {!loading && (
          <div className="relative bg-gradient-to-br from-primary/30 via-orange-500/15 to-transparent p-6 pb-5">
            <button
              onClick={() => setOpen(false)}
              aria-label="Close"
              className="absolute top-3 right-3 p-1.5 rounded-lg text-foreground/60 hover:text-foreground hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/15 border border-primary/30 text-primary text-xs font-bold uppercase tracking-widest mb-3">
              <Sparkles className="w-3 h-3" />
              Free · 60 seconds
            </div>
            <h2 id="exit-intent-title" className="text-2xl md:text-3xl font-bold tracking-tight">
              Wait — get a free{" "}
              <span className="bg-gradient-to-r from-primary via-orange-400 to-primary bg-clip-text text-transparent">
                AI Readiness scan
              </span>{" "}
              of your site.
            </h2>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
              We'll grade your site on AI-search visibility, schema, performance,
              and conversion signals. Personalized report in your inbox in under
              a minute.
            </p>
          </div>
        )}

        {/* Scanning sequence — replaces the form once submitted */}
        {loading && (
          <AiScanSequence
            domain={cleanedDomain || 'your site'}
            onComplete={() => setAnimationDone(true)}
          />
        )}

        {/* Form — only when not scanning */}
        {!loading && (
        <form onSubmit={handleSubmit} className="p-6 pt-2 space-y-4">
          <div>
            <label htmlFor="ei-email" className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1 block">
              Your email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                id="ei-email"
                type="email"
                required
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="w-full pl-10 pr-3 py-2.5 rounded-lg bg-background border border-border focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary text-sm"
              />
            </div>
          </div>

          <div>
            <label htmlFor="ei-domain" className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1 block">
              Site to scan
            </label>
            <div className="relative">
              <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                id="ei-domain"
                type="text"
                required
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                placeholder="yourdomain.com"
                className="w-full pl-10 pr-3 py-2.5 rounded-lg bg-background border border-border focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary text-sm"
              />
            </div>
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <button
            type="submit"
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-base font-bold text-primary-foreground shadow-[0_0_24px_-8px_rgba(255,107,53,0.6)] hover:scale-[1.02] transition-transform"
          >
            <Sparkles className="w-4 h-4" />
            Get my free scan
          </button>

          <p className="text-xs text-muted-foreground text-center">
            No card. No call. We'll email the report straight to your inbox.
            Unsubscribe anytime.
          </p>
        </form>
        )}
      </div>
    </div>
  )
}
