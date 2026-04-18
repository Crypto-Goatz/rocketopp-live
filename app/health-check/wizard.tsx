"use client"

import { useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { ArrowRight, ArrowLeft, CheckCircle2, Globe, Shield, Code, Search, Clock, Network, Mail, Loader2 } from 'lucide-react'

type Step = 1 | 2 | 3 | 4

const TESTS = [
  { id: 'infrastructure', icon: Network, title: 'Infrastructure map', desc: 'DNS + subdomain sweep + CT logs' },
  { id: 'tls', icon: Shield, title: 'TLS / certificate posture', desc: 'Cert validity, issuers, expiration' },
  { id: 'headers', icon: Globe, title: 'Security headers + CORS', desc: 'HSTS, CSP, X-Frame, cookie flags' },
  { id: 'stack', icon: Code, title: 'Framework fingerprint', desc: 'Runtime, framework, EOL versions' },
  { id: 'paths', icon: Search, title: 'Attack-surface sweep', desc: '.env, .git, phpinfo, backups, admin' },
  { id: 'assets', icon: Clock, title: 'Asset freshness', desc: 'When was the site actually maintained?' },
] as const

type TestId = typeof TESTS[number]['id']

function cleanUrl(input: string): string {
  let u = input.trim()
  if (!u) return ''
  u = u.replace(/^https?:\/\//i, '').replace(/\/.*$/, '')
  return u.toLowerCase()
}

function isValidHost(h: string): boolean {
  return /^[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)+$/i.test(h)
}

function isValidEmail(e: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.trim())
}

export function HealthCheckWizard() {
  const [step, setStep] = useState<Step>(1)
  const [url, setUrl] = useState('')
  const [selected, setSelected] = useState<Set<TestId>>(new Set(TESTS.map((t) => t.id)))
  const [firstName, setFirstName] = useState('')
  const [email, setEmail] = useState('')
  const [company, setCompany] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const cleanedUrl = useMemo(() => cleanUrl(url), [url])
  const urlOk = isValidHost(cleanedUrl)
  const emailOk = isValidEmail(email)

  const toggle = (id: TestId) => {
    setSelected((prev) => {
      const n = new Set(prev)
      if (n.has(id)) n.delete(id); else n.add(id)
      return n
    })
  }

  async function submit() {
    setError('')
    if (!urlOk) { setError('Enter a valid domain (e.g. example.com)'); return }
    if (selected.size === 0) { setError('Pick at least one check'); return }
    if (!emailOk) { setError('Enter a valid email'); return }
    setSubmitting(true)
    try {
      const r = await fetch('/api/health-audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: cleanedUrl,
          categories: Array.from(selected),
          firstName,
          email,
          company,
        }),
      })
      if (!r.ok) {
        const j = await r.json().catch(() => ({}))
        throw new Error(j.error || 'Submission failed')
      }
      setStep(4)
    } catch (e: any) {
      setError(e.message || 'Something went wrong')
    } finally {
      setSubmitting(false)
    }
  }

  if (step === 4) {
    return (
      <div className="max-w-2xl mx-auto card-lifted-xl p-10 md:p-14 text-center">
        <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-6">
          <CheckCircle2 className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Your audit is running</h2>
        <p className="text-lg text-muted-foreground mb-2">
          We&apos;re scanning <span className="font-mono text-foreground">{cleanedUrl}</span> across {selected.size} test categor{selected.size === 1 ? 'y' : 'ies'}.
        </p>
        <p className="text-lg text-muted-foreground mb-8">
          Your report will be in <span className="font-semibold text-foreground">{email}</span> within 5–10 minutes.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button variant="outline" onClick={() => { setStep(1); setUrl(''); setSelected(new Set(TESTS.map((t) => t.id))); }}>
            Audit another site
          </Button>
          <Button asChild>
            <a href="/">Back to home</a>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Progress bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-3">
          {([1, 2, 3] as Step[]).map((n) => (
            <div key={n} className="flex items-center flex-1">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-colors ${
                step >= n ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
              }`}>
                {step > n ? <CheckCircle2 className="w-5 h-5" /> : n}
              </div>
              {n < 3 && <div className={`flex-1 h-0.5 mx-2 transition-colors ${step > n ? 'bg-primary' : 'bg-muted'}`} />}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-3 text-xs md:text-sm text-center text-muted-foreground">
          <div className={step >= 1 ? 'text-foreground font-medium' : ''}>Website</div>
          <div className={step >= 2 ? 'text-foreground font-medium' : ''}>What to check</div>
          <div className={step >= 3 ? 'text-foreground font-medium' : ''}>Where to send it</div>
        </div>
      </div>

      <div className="card-lifted-xl p-6 md:p-10">
        {step === 1 && (
          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-2">What are we auditing?</h2>
            <p className="text-muted-foreground mb-6">Enter the website you want graded. Apex domain or any subdomain — we&apos;ll map the rest.</p>
            <label className="block text-sm font-medium mb-2">Website URL</label>
            <div className="relative">
              <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                autoFocus
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="example.com"
                className="w-full pl-11 pr-4 py-4 rounded-lg border border-border bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-lg font-mono"
                onKeyDown={(e) => { if (e.key === 'Enter' && urlOk) setStep(2) }}
              />
            </div>
            {url && !urlOk && <p className="text-sm text-red-500 mt-2">Enter a valid domain (e.g. example.com)</p>}

            <div className="mt-8 flex justify-end">
              <Button size="lg" disabled={!urlOk} onClick={() => setStep(2)}>
                Next: Pick checks
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-2">What should we check?</h2>
            <p className="text-muted-foreground mb-6">All six are recommended. Uncheck any you want to skip.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {TESTS.map((t) => {
                const active = selected.has(t.id)
                const Icon = t.icon
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => toggle(t.id)}
                    className={`text-left p-4 rounded-lg border-2 transition-all ${
                      active
                        ? 'border-primary bg-primary/5'
                        : 'border-border bg-background hover:border-primary/40'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-9 h-9 rounded-md flex items-center justify-center shrink-0 ${active ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold flex items-center gap-2">
                          {t.title}
                          {active && <CheckCircle2 className="w-4 h-4 text-primary" />}
                        </div>
                        <div className="text-sm text-muted-foreground mt-0.5">{t.desc}</div>
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>

            <div className="mt-8 flex justify-between">
              <Button size="lg" variant="outline" onClick={() => setStep(1)}>
                <ArrowLeft className="mr-2 w-5 h-5" />
                Back
              </Button>
              <Button size="lg" disabled={selected.size === 0} onClick={() => setStep(3)}>
                Next: Get results
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-2">Where should we send it?</h2>
            <p className="text-muted-foreground mb-6">Your report lands here in 5–10 minutes. We&apos;ll only email about this audit.</p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Email <span className="text-primary">*</span></label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="email"
                    autoFocus
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@company.com"
                    className="w-full pl-11 pr-4 py-4 rounded-lg border border-border bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">First name</label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Your first name"
                    className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Company</label>
                  <input
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="Optional"
                    className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                  />
                </div>
              </div>
            </div>

            {error && (
              <div className="mt-6 p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-600 text-sm">
                {error}
              </div>
            )}

            <div className="mt-8 p-4 rounded-lg bg-muted/50 text-sm text-muted-foreground">
              <div className="font-semibold text-foreground mb-1">Auditing:</div>
              <div className="font-mono text-foreground">{cleanedUrl}</div>
              <div className="mt-2 text-xs">{selected.size} check{selected.size === 1 ? '' : 's'} selected · ~{Math.max(2, Math.min(10, selected.size * 2))} min</div>
            </div>

            <div className="mt-8 flex justify-between">
              <Button size="lg" variant="outline" onClick={() => setStep(2)} disabled={submitting}>
                <ArrowLeft className="mr-2 w-5 h-5" />
                Back
              </Button>
              <Button size="lg" disabled={!emailOk || submitting} onClick={submit}>
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 w-5 h-5 animate-spin" />
                    Queuing...
                  </>
                ) : (
                  <>
                    Run my audit
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
