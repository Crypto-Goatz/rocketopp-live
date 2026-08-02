'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { ArrowRight, Check, Loader2, X } from 'lucide-react'

/**
 * $497 offer capture, opened from the blog sidebar.
 *
 * The branching question is the point of the form: someone who already has a
 * site is a rebuild/SXO conversation and we want the URL so the first reply can
 * reference their actual pages. Someone who does not is a from-scratch build,
 * where asking for a URL is noise — so that branch collapses to a single CTA
 * instead of an empty field they have to skip past.
 *
 * Posts to /api/leads, which already routes into the CRM with tags and custom
 * fields, rather than inventing a second lead path.
 */
export default function OfferModal({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  const [hasSite, setHasSite] = useState<'yes' | 'no' | null>(null)
  const [status, setStatus] = useState<'idle' | 'sending' | 'done' | 'error'>('idle')
  const [error, setError] = useState('')
  const panelRef = useRef<HTMLDivElement>(null)
  const firstFieldRef = useRef<HTMLInputElement>(null)

  // Escape closes; focus moves into the form when it opens.
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    const t = setTimeout(() => firstFieldRef.current?.focus(), 60)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
      clearTimeout(t)
    }
  }, [open, onClose])

  const submit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      setStatus('sending')
      setError('')
      const fd = new FormData(e.currentTarget)
      const name = String(fd.get('name') || '').trim()
      const [firstName, ...rest] = name.split(/\s+/)

      try {
        const res = await fetch('/api/leads', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            firstName: firstName || name,
            lastName: rest.join(' ') || undefined,
            email: String(fd.get('email') || '').trim(),
            phone: String(fd.get('phone') || '').trim() || undefined,
            company: String(fd.get('company') || '').trim() || undefined,
            service: '$497 Website Offer',
            formName: 'Blog Sidebar — $497 Offer',
            source: 'blog-sidebar-497',
            pageUrl: typeof window !== 'undefined' ? window.location.href : undefined,
            tags: ['Website Lead', '$497 Offer', hasSite === 'yes' ? 'Has Website' : 'No Website'],
            customFields: {
              has_website: hasSite ?? 'unanswered',
              current_website: String(fd.get('website') || '').trim(),
            },
          }),
        })
        if (!res.ok) throw new Error(`Request failed (${res.status})`)
        setStatus('done')
      } catch (err) {
        setStatus('error')
        setError(err instanceof Error ? err.message : 'Something went wrong')
      }
    },
    [hasSite],
  )

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center p-0 sm:items-center sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label="Get the $497 website offer"
    >
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />

      <div
        ref={panelRef}
        className="relative max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-t-3xl border border-white/10 bg-[#0e0e12] p-6 shadow-2xl sm:rounded-3xl sm:p-8"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-lg text-zinc-400 transition-colors hover:bg-white/5 hover:text-white"
        >
          <X className="h-4 w-4" />
        </button>

        {status === 'done' ? (
          <div className="py-6 text-center">
            <div className="mx-auto mb-5 grid h-14 w-14 place-items-center rounded-2xl bg-emerald-500/15 text-emerald-400">
              <Check className="h-7 w-7" />
            </div>
            <h2 className="text-2xl font-bold text-white">Got it — thank you.</h2>
            <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-zinc-400">
              Mike reads these himself and replies personally, usually the same
              day. If you shared a URL, the reply will reference your actual
              pages rather than a template.
            </p>
            <button
              onClick={onClose}
              className="mt-7 rounded-xl border border-white/15 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:border-primary/50"
            >
              Close
            </button>
          </div>
        ) : (
          <>
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary">
              The $497 Website
            </p>
            <h2 className="mt-2 text-2xl font-bold leading-tight text-white">
              Built for you. Yours to edit.
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-zinc-400">
              Tell us where you are now and we&rsquo;ll come back with what it
              would actually take — not a brochure.
            </p>

            <form onSubmit={submit} className="mt-6 space-y-4">
              <Field label="Name" htmlFor="of-name" required>
                <input
                  ref={firstFieldRef}
                  id="of-name"
                  name="name"
                  required
                  autoComplete="name"
                  className={INPUT}
                  placeholder="Jane Smith"
                />
              </Field>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Email" htmlFor="of-email" required>
                  <input
                    id="of-email"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    className={INPUT}
                    placeholder="jane@company.com"
                  />
                </Field>
                <Field label="Phone" htmlFor="of-phone">
                  <input
                    id="of-phone"
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    className={INPUT}
                    placeholder="(724) 555-0100"
                  />
                </Field>
              </div>

              <Field label="Company" htmlFor="of-company">
                <input
                  id="of-company"
                  name="company"
                  autoComplete="organization"
                  className={INPUT}
                  placeholder="Company name"
                />
              </Field>

              <fieldset className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
                <legend className="px-1 text-sm font-semibold text-white">
                  Do you have a website right now?
                </legend>
                <div className="mt-3 flex gap-3">
                  {(['yes', 'no'] as const).map((v) => (
                    <label
                      key={v}
                      className={`flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium capitalize transition-colors ${
                        hasSite === v
                          ? 'border-primary bg-primary/15 text-white'
                          : 'border-white/10 text-zinc-400 hover:border-white/25'
                      }`}
                    >
                      <input
                        type="radio"
                        name="has_website"
                        value={v}
                        checked={hasSite === v}
                        onChange={() => setHasSite(v)}
                        className="sr-only"
                      />
                      <span
                        aria-hidden
                        className={`grid h-4 w-4 place-items-center rounded-full border ${
                          hasSite === v ? 'border-primary' : 'border-white/30'
                        }`}
                      >
                        {hasSite === v && (
                          <span className="h-2 w-2 rounded-full bg-primary" />
                        )}
                      </span>
                      {v}
                    </label>
                  ))}
                </div>

                {/* Yes -> we want the URL, so the reply can be specific. */}
                {hasSite === 'yes' && (
                  <div className="mt-4">
                    <Field label="What's the URL?" htmlFor="of-website" required>
                      <input
                        id="of-website"
                        name="website"
                        required
                        inputMode="url"
                        className={INPUT}
                        placeholder="yourcompany.com"
                      />
                    </Field>
                  </div>
                )}

                {/* No -> asking for a URL is noise. Straight to the offer. */}
                {hasSite === 'no' && (
                  <a
                    href="/497-website"
                    className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg border border-white/15 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:border-primary/50 hover:text-primary"
                  >
                    Learn more about the $497 build
                    <ArrowRight className="h-3.5 w-3.5" />
                  </a>
                )}
              </fieldset>

              {status === 'error' && (
                <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
                  {error}. You can also email mike@rocketopp.com directly.
                </p>
              )}

              <button
                type="submit"
                disabled={status === 'sending'}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-bold text-primary-foreground transition-transform hover:scale-[1.01] disabled:opacity-60"
              >
                {status === 'sending' ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Sending…
                  </>
                ) : (
                  <>
                    Send it over
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>

              <p className="text-center text-[11px] leading-relaxed text-zinc-500">
                No autoresponder sequence. Mike replies himself.
              </p>
            </form>
          </>
        )}
      </div>
    </div>
  )
}

const INPUT =
  'w-full rounded-lg border border-white/10 bg-black/40 px-3.5 py-2.5 text-sm text-white placeholder:text-zinc-600 outline-none transition-colors focus:border-primary/60'

function Field({
  label,
  htmlFor,
  required,
  children,
}: {
  label: string
  htmlFor: string
  required?: boolean
  children: React.ReactNode
}) {
  return (
    <div>
      <label
        htmlFor={htmlFor}
        className="mb-1.5 block text-xs font-semibold text-zinc-300"
      >
        {label}
        {required && <span className="ml-0.5 text-primary">*</span>}
      </label>
      {children}
    </div>
  )
}
