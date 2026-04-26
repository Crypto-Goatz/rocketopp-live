'use client'

/**
 * GTM Reality Check — landing page
 *
 * Flow:
 *   1. 5-question AI pre-assessment (multi-step form)
 *   2. POST /api/gtm/checkout  → Stripe session → payment
 *   3. Stripe success → /gtm/book?session_id={id}  → embedded GHL calendar
 *
 * Visual system: matches rocketopp.com — dark bg, lava gradients, Inter.
 */

import { useState, useRef } from 'react'
import Link from 'next/link'
import {
  CheckCircle2, ChevronRight, Clock, Zap, Target, MessageSquare,
  BarChart3, ArrowRight, ChevronDown, Rocket,
} from 'lucide-react'

// ─── Types ────────────────────────────────────────────────────────────────────

interface AssessmentData {
  q1: string  // business description + ICP
  q2: string  // revenue stage
  q3: string  // biggest bottleneck
  q4: string[] // channels
  q5: string  // 90-day goal
  email: string
  firstName: string
}

// ─── FAQ data ─────────────────────────────────────────────────────────────────

const FAQS = [
  {
    q: 'What do I need to prepare before the call?',
    a: "Nothing. The assessment is your prep. Show up ready to talk through your business — we'll have already analyzed your situation from your answers.",
  },
  {
    q: 'How is this different from a free consultation?',
    a: "Free calls are exploratory. This is diagnostic. The AI pre-brief means we've analyzed your GTM before we get on — the 30 minutes is spent solving, not discovering. You leave with 3 specific, executable fixes.",
  },
  {
    q: "What if I'm pre-revenue or just starting?",
    a: "This is when a GTM Reality Check is most valuable. Getting the fundamentals right before spending money on ads or building out a sales process is the highest-leverage investment you can make at any stage.",
  },
  {
    q: 'How quickly can I book after paying?',
    a: 'Immediately. After payment, you land directly on the booking calendar. Pick a time and you get a Zoom link instantly. Slots are first-come, first-served.',
  },
  {
    q: "What's the refund policy?",
    a: "If you show up to the call and feel like you got zero value, we'll refund you. We stand behind the work.",
  },
]

// ─── Problem cards ────────────────────────────────────────────────────────────

const PROBLEMS = [
  { icon: Target, label: 'Wrong ICP', desc: "You're targeting who could buy, not who will buy right now." },
  { icon: MessageSquare, label: 'Vague Messaging', desc: 'Your offer sounds like everyone else. No one feels spoken to.' },
  { icon: BarChart3, label: 'Wrong Channels', desc: "Spending time on channels your actual buyers don't use." },
  { icon: Zap, label: 'CTA Friction', desc: "Your close is adding hesitation instead of removing it." },
]

// ─── Step definitions ─────────────────────────────────────────────────────────

const REVENUE_OPTIONS = [
  { value: 'pre-revenue', label: 'Pre-revenue / just starting' },
  { value: 'under-1k',    label: 'Under $1,000/mo' },
  { value: '1k-10k',      label: '$1,000 – $10,000/mo' },
  { value: '10k-plus',    label: '$10,000+/mo' },
]

const BOTTLENECK_OPTIONS = [
  { value: 'lead-gen',        label: 'Not enough leads / traffic' },
  { value: 'conversion',      label: 'Leads but can\'t convert or close' },
  { value: 'messaging',       label: 'Unclear messaging / positioning' },
  { value: 'wrong-audience',  label: 'Reaching the wrong audience' },
]

const CHANNEL_OPTIONS = [
  { value: 'linkedin',    label: 'LinkedIn' },
  { value: 'cold-email',  label: 'Cold Email' },
  { value: 'paid-ads',    label: 'Paid Ads (Google / Meta)' },
  { value: 'content-seo', label: 'Content / SEO' },
  { value: 'referrals',   label: 'Referrals / Word of Mouth' },
  { value: 'none',        label: 'Nothing consistent yet' },
]

// ─── Component ────────────────────────────────────────────────────────────────

export function GtmLanding() {
  const [step, setStep] = useState(0) // 0-4 = questions, 5 = contact + submit
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const formRef = useRef<HTMLDivElement>(null)

  const [data, setData] = useState<AssessmentData>({
    q1: '', q2: '', q3: '', q4: [], q5: '', email: '', firstName: '',
  })

  const totalSteps = 5

  function scrollToForm() {
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  function nextStep() {
    setStep(s => {
      const next = Math.min(s + 1, totalSteps)
      setTimeout(scrollToForm, 50)
      return next
    })
  }

  function prevStep() {
    setStep(s => {
      const prev = Math.max(s - 1, 0)
      setTimeout(scrollToForm, 50)
      return prev
    })
  }

  function toggleChannel(val: string) {
    setData(d => ({
      ...d,
      q4: d.q4.includes(val) ? d.q4.filter(v => v !== val) : [...d.q4, val],
    }))
  }

  async function handleSubmit() {
    if (!data.email || !data.firstName || !data.q5) return
    setSubmitting(true)
    setError('')
    try {
      const res = await fetch('/api/gtm/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Checkout failed')
      window.location.href = json.url
    } catch (e: any) {
      setError(e.message || 'Something went wrong. Try again.')
      setSubmitting(false)
    }
  }

  // Progress dots
  function ProgressDots() {
    return (
      <div className="flex gap-2 mb-8">
        {Array.from({ length: totalSteps }).map((_, i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
              i < step ? 'bg-green-500' : i === step ? 'bg-orange-500' : 'bg-white/10'
            }`}
          />
        ))}
      </div>
    )
  }

  // Radio option
  function RadioOpt({ value, label, selected, onSelect }: {
    value: string; label: string; selected: boolean; onSelect: () => void
  }) {
    return (
      <button
        onClick={onSelect}
        className={`flex items-center gap-3 w-full text-left px-4 py-3.5 rounded-xl border transition-all duration-150 ${
          selected
            ? 'border-orange-500 bg-orange-500/10 text-white'
            : 'border-white/10 bg-white/5 text-gray-300 hover:border-orange-500/50 hover:bg-orange-500/5'
        }`}
      >
        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
          selected ? 'border-orange-500 bg-orange-500' : 'border-white/30'
        }`}>
          {selected && <div className="w-2 h-2 rounded-full bg-white" />}
        </div>
        <span className="text-sm font-medium">{label}</span>
      </button>
    )
  }

  // Checkbox option
  function CheckOpt({ value, label, checked }: {
    value: string; label: string; checked: boolean
  }) {
    return (
      <button
        onClick={() => toggleChannel(value)}
        className={`flex items-center gap-3 w-full text-left px-4 py-3.5 rounded-xl border transition-all duration-150 ${
          checked
            ? 'border-orange-500 bg-orange-500/10 text-white'
            : 'border-white/10 bg-white/5 text-gray-300 hover:border-orange-500/50 hover:bg-orange-500/5'
        }`}
      >
        <div className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center flex-shrink-0 ${
          checked ? 'border-orange-500 bg-orange-500' : 'border-white/30'
        }`}>
          {checked && (
            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          )}
        </div>
        <span className="text-sm font-medium">{label}</span>
      </button>
    )
  }

  function StepLabel({ n }: { n: number }) {
    return (
      <p className="text-xs font-bold tracking-widest uppercase text-orange-400 mb-2">
        Question {n} of {totalSteps}
      </p>
    )
  }

  return (
    <div className="min-h-screen bg-[#07070f] text-white font-sans antialiased">

      {/* ── NAV ── */}
      <nav className="sticky top-0 z-50 flex items-center justify-between px-6 md:px-10 py-4
                      bg-[#07070f]/85 backdrop-blur-md border-b border-white/8">
        <Link href="/" className="text-lg font-black tracking-tight">
          Rocket<span className="text-orange-500">Opp</span>
        </Link>
        <button
          onClick={scrollToForm}
          className="flex items-center gap-1.5 text-sm font-bold bg-orange-500 hover:bg-orange-400
                     text-white px-4 py-2 rounded-lg transition-colors"
        >
          Start Free Assessment <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </nav>

      {/* ── HERO ── */}
      <section className="relative pt-24 pb-20 px-6 text-center overflow-hidden">
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 70% 50% at 50% 0%, rgba(255,92,26,0.12) 0%, transparent 70%)' }} />

        <div className="inline-flex items-center gap-2 bg-orange-500/12 border border-orange-500/30
                        text-orange-300 text-xs font-bold tracking-wider uppercase
                        px-4 py-1.5 rounded-full mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse" />
          AI-Powered · 30-Min Session · Immediate Delivery
        </div>

        <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter leading-[1.05] mb-6 max-w-4xl mx-auto">
          Your GTM Has a Leak.<br />
          <span className="text-orange-500">Let&apos;s Find It.</span>
        </h1>

        <p className="text-gray-400 text-lg md:text-xl max-w-xl mx-auto mb-10 leading-relaxed">
          Answer 5 questions. Our AI analyzes your go-to-market before the call —
          so your 30 minutes are spent <em className="not-italic text-white">fixing</em>, not diagnosing.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-400 mb-10">
          {[
            { icon: Clock,         label: '30-Minute Strategy Call' },
            { icon: CheckCircle2,  label: 'AI Pre-Brief Before the Call' },
            { icon: Zap,           label: '3 Actionable Fixes Guaranteed' },
          ].map(({ icon: Icon, label }) => (
            <span key={label} className="flex items-center gap-2">
              <Icon className="w-4 h-4 text-orange-500" />
              {label}
            </span>
          ))}
        </div>

        <div className="inline-flex items-baseline gap-2 bg-white/5 border border-white/10
                        rounded-2xl px-8 py-4 mb-8">
          <span className="text-5xl font-black tracking-tight">$49</span>
          <span className="text-gray-400 text-base">one-time</span>
        </div>

        <div className="block">
          <button
            onClick={scrollToForm}
            className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-400 text-white
                       font-bold text-lg px-10 py-5 rounded-xl transition-all duration-200
                       shadow-[0_8px_32px_rgba(255,92,26,0.35)] hover:shadow-[0_12px_40px_rgba(255,92,26,0.5)]
                       hover:-translate-y-0.5"
          >
            Start My Free AI Assessment <ArrowRight className="w-5 h-5" />
          </button>
          <p className="text-gray-500 text-sm mt-3">Takes 3 minutes · Pay only after completing the assessment</p>
        </div>
      </section>

      {/* ── PROBLEM ── */}
      <section className="bg-white/[0.02] border-y border-white/8 py-20 px-6">
        <div className="max-w-3xl mx-auto">
          <p className="text-orange-400 text-xs font-bold tracking-widest uppercase mb-3">The Problem</p>
          <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-4">
            Most businesses aren&apos;t losing because<br />
            their product is <span className="text-orange-500">bad</span>.
          </h2>
          <p className="text-gray-400 mb-10">They&apos;re losing because their GTM is broken — and they don&apos;t know exactly where.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {PROBLEMS.map(({ icon: Icon, label, desc }) => (
              <div key={label} className="bg-[#0e0e1a] border border-white/8 rounded-xl p-5">
                <Icon className="w-7 h-7 text-orange-500 mb-3" />
                <h3 className="font-bold mb-1.5 text-sm">{label}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="py-20 px-6">
        <div className="max-w-2xl mx-auto">
          <p className="text-orange-400 text-xs font-bold tracking-widest uppercase mb-3">How It Works</p>
          <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-12">
            From assessment to answers<br />in <span className="text-orange-500">under an hour</span>.
          </h2>
          <div className="space-y-0">
            {[
              {
                n: '1',
                title: 'Complete the AI Assessment',
                desc: 'Answer 5 focused questions about your business, audience, and current GTM. Takes about 3 minutes.',
                tag: '🤖 AI analyzes your answers',
              },
              {
                n: '2',
                title: 'Unlock Your Session for $49',
                desc: 'After submitting, you go to a secure Stripe checkout. One payment unlocks your booking link.',
                tag: '🔒 Secure Stripe checkout',
              },
              {
                n: '3',
                title: 'Book Your 30-Minute Call',
                desc: 'Pick any open slot. You get a Zoom link immediately. Slots fill fast — book right after paying.',
                tag: '📅 Live calendar booking',
              },
              {
                n: '4',
                title: 'We Show Up Ready',
                desc: "Mike receives your AI pre-brief before the call — your GTM profile, bottlenecks, and hypothesis. No cold starts.",
                tag: '⚡ 3 prioritized fixes on the call',
              },
            ].map(({ n, title, desc, tag }, i, arr) => (
              <div key={n} className="flex gap-5 relative pb-10 last:pb-0">
                {i < arr.length - 1 && (
                  <div className="absolute left-[18px] top-10 bottom-0 w-0.5
                                  bg-gradient-to-b from-orange-500 to-transparent" />
                )}
                <div className="w-9 h-9 rounded-full bg-orange-500 flex items-center justify-center
                                font-black text-sm flex-shrink-0 z-10">
                  {n}
                </div>
                <div className="pt-1">
                  <h3 className="font-bold text-base mb-1.5">{title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed mb-2">{desc}</p>
                  <span className="inline-block text-xs font-semibold text-blue-300
                                   bg-blue-500/10 border border-blue-500/20 px-3 py-1 rounded-full">
                    {tag}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ASSESSMENT FORM ── */}
      <section className="bg-white/[0.02] border-y border-white/8 py-20 px-6" id="assessment">
        <div className="max-w-2xl mx-auto">
          <p className="text-orange-400 text-xs font-bold tracking-widest uppercase mb-3">AI Pre-Assessment</p>
          <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-2">
            Tell us about your GTM.<br />We&apos;ll tell you what&apos;s <span className="text-orange-500">broken</span>.
          </h2>
          <p className="text-gray-400 text-sm mb-10">5 questions · ~3 minutes · Analyzed by AI before your call</p>

          {/* Form card */}
          <div
            ref={formRef}
            className="relative bg-[#0e0e1a] border border-white/10 rounded-2xl p-6 md:p-10
                       overflow-hidden scroll-mt-24"
          >
            {/* lava top bar */}
            <div className="absolute inset-x-0 top-0 h-0.5
                            bg-gradient-to-r from-orange-500 via-red-400 to-orange-500" />

            <ProgressDots />

            {/* ── Q1: Business + ICP ── */}
            {step === 0 && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-200">
                <StepLabel n={1} />
                <p className="text-xl font-bold mb-6 leading-snug">
                  What does your business do, and who is your ideal customer?
                </p>
                <textarea
                  value={data.q1}
                  onChange={e => setData(d => ({ ...d, q1: e.target.value }))}
                  className="w-full bg-white/5 border border-white/10 focus:border-orange-500/60
                             rounded-xl px-4 py-3.5 text-sm text-white placeholder:text-gray-500
                             resize-none min-h-[120px] outline-none transition-colors"
                  placeholder="e.g. We help SaaS founders automate their outbound. Ideal customer is a B2B SaaS company with 5–50 employees doing $10k–$100k MRR."
                  maxLength={500}
                />
                <div className="flex justify-between items-center mt-6">
                  <span className="text-xs text-gray-500">Step 1 of {totalSteps}</span>
                  <button
                    disabled={!data.q1.trim()}
                    onClick={nextStep}
                    className="flex items-center gap-2 bg-orange-500 hover:bg-orange-400 disabled:opacity-40
                               disabled:cursor-not-allowed text-white font-bold text-sm px-6 py-2.5
                               rounded-lg transition-colors"
                  >
                    Next <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* ── Q2: Revenue ── */}
            {step === 1 && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-200">
                <StepLabel n={2} />
                <p className="text-xl font-bold mb-6 leading-snug">What&apos;s your current monthly revenue?</p>
                <div className="space-y-2.5">
                  {REVENUE_OPTIONS.map(o => (
                    <RadioOpt
                      key={o.value}
                      value={o.value}
                      label={o.label}
                      selected={data.q2 === o.value}
                      onSelect={() => setData(d => ({ ...d, q2: o.value }))}
                    />
                  ))}
                </div>
                <div className="flex justify-between items-center mt-6">
                  <button onClick={prevStep} className="text-sm text-gray-400 hover:text-white transition-colors">← Back</button>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-500">Step 2 of {totalSteps}</span>
                    <button
                      disabled={!data.q2}
                      onClick={nextStep}
                      className="flex items-center gap-2 bg-orange-500 hover:bg-orange-400 disabled:opacity-40
                                 disabled:cursor-not-allowed text-white font-bold text-sm px-6 py-2.5
                                 rounded-lg transition-colors"
                    >
                      Next <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ── Q3: Bottleneck ── */}
            {step === 2 && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-200">
                <StepLabel n={3} />
                <p className="text-xl font-bold mb-6 leading-snug">What&apos;s your biggest GTM bottleneck right now?</p>
                <div className="space-y-2.5">
                  {BOTTLENECK_OPTIONS.map(o => (
                    <RadioOpt
                      key={o.value}
                      value={o.value}
                      label={o.label}
                      selected={data.q3 === o.value}
                      onSelect={() => setData(d => ({ ...d, q3: o.value }))}
                    />
                  ))}
                </div>
                <div className="flex justify-between items-center mt-6">
                  <button onClick={prevStep} className="text-sm text-gray-400 hover:text-white transition-colors">← Back</button>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-500">Step 3 of {totalSteps}</span>
                    <button
                      disabled={!data.q3}
                      onClick={nextStep}
                      className="flex items-center gap-2 bg-orange-500 hover:bg-orange-400 disabled:opacity-40
                                 disabled:cursor-not-allowed text-white font-bold text-sm px-6 py-2.5
                                 rounded-lg transition-colors"
                    >
                      Next <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ── Q4: Channels ── */}
            {step === 3 && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-200">
                <StepLabel n={4} />
                <p className="text-xl font-bold mb-2 leading-snug">Which channels are you currently using?</p>
                <p className="text-gray-400 text-sm mb-6">Select all that apply</p>
                <div className="space-y-2.5">
                  {CHANNEL_OPTIONS.map(o => (
                    <CheckOpt
                      key={o.value}
                      value={o.value}
                      label={o.label}
                      checked={data.q4.includes(o.value)}
                    />
                  ))}
                </div>
                <div className="flex justify-between items-center mt-6">
                  <button onClick={prevStep} className="text-sm text-gray-400 hover:text-white transition-colors">← Back</button>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-500">Step 4 of {totalSteps}</span>
                    <button
                      disabled={data.q4.length === 0}
                      onClick={nextStep}
                      className="flex items-center gap-2 bg-orange-500 hover:bg-orange-400 disabled:opacity-40
                                 disabled:cursor-not-allowed text-white font-bold text-sm px-6 py-2.5
                                 rounded-lg transition-colors"
                    >
                      Next <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ── Q5 + Contact ── */}
            {step === 4 && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-200">
                <StepLabel n={5} />
                <p className="text-xl font-bold mb-6 leading-snug">
                  What does success look like for you in the next 90 days?
                </p>
                <textarea
                  value={data.q5}
                  onChange={e => setData(d => ({ ...d, q5: e.target.value }))}
                  className="w-full bg-white/5 border border-white/10 focus:border-orange-500/60
                             rounded-xl px-4 py-3.5 text-sm text-white placeholder:text-gray-500
                             resize-none min-h-[100px] outline-none transition-colors mb-5"
                  placeholder="e.g. Close 3 new clients at $2k/month. Get to $10k MRR. Land my first enterprise deal."
                  maxLength={500}
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 mb-1.5">First Name</label>
                    <input
                      type="text"
                      value={data.firstName}
                      onChange={e => setData(d => ({ ...d, firstName: e.target.value }))}
                      placeholder="Mike"
                      className="w-full bg-white/5 border border-white/10 focus:border-orange-500/60
                                 rounded-xl px-4 py-3 text-sm text-white placeholder:text-gray-500
                                 outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 mb-1.5">
                      Email — where we send your pre-brief summary
                    </label>
                    <input
                      type="email"
                      value={data.email}
                      onChange={e => setData(d => ({ ...d, email: e.target.value }))}
                      placeholder="you@yourbusiness.com"
                      className="w-full bg-white/5 border border-white/10 focus:border-orange-500/60
                                 rounded-xl px-4 py-3 text-sm text-white placeholder:text-gray-500
                                 outline-none transition-colors"
                    />
                  </div>
                </div>

                {/* Summary before pay */}
                <div className="bg-black/30 border border-white/8 rounded-xl p-5 mb-6">
                  <p className="text-xs font-bold tracking-widest uppercase text-orange-400 mb-4">
                    What&apos;s included — $49
                  </p>
                  {[
                    ['AI GTM Pre-Brief', 'Generated from your answers — Mike reviews it before the call'],
                    ['30-Minute Live Strategy Session', 'Via Zoom — no pitch, no fluff, just your GTM situation'],
                    ['3 Prioritized GTM Fixes', 'Specific and executable — delivered on the call'],
                    ['Written Follow-Up Summary', 'Your 3 fixes emailed after the call'],
                  ].map(([title, sub]) => (
                    <div key={title} className="flex gap-3 mb-3 last:mb-0">
                      <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-semibold leading-tight">{title}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{sub}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {error && (
                  <p className="text-red-400 text-sm mb-4 bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-2">
                    {error}
                  </p>
                )}

                <div className="flex justify-between items-center">
                  <button onClick={prevStep} className="text-sm text-gray-400 hover:text-white transition-colors">← Back</button>
                  <button
                    disabled={!data.q5.trim() || !data.email.trim() || !data.firstName.trim() || submitting}
                    onClick={handleSubmit}
                    className="flex items-center gap-2 bg-orange-500 hover:bg-orange-400 disabled:opacity-50
                               disabled:cursor-not-allowed text-white font-bold text-base px-8 py-3.5
                               rounded-xl transition-all shadow-[0_4px_20px_rgba(255,92,26,0.35)]
                               hover:shadow-[0_6px_28px_rgba(255,92,26,0.5)]"
                  >
                    {submitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Creating checkout…
                      </>
                    ) : (
                      <>
                        Pay $49 &amp; Book My Call <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-3 text-center">
                  🔒 Secure Stripe checkout · Redirected to booking calendar immediately after payment
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── DELIVERABLES ── */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto">
          <p className="text-orange-400 text-xs font-bold tracking-widest uppercase mb-3">Deliverables</p>
          <h2 className="text-3xl font-black tracking-tight mb-10">Everything you walk away with.</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { icon: '🤖', title: 'AI GTM Pre-Brief', desc: "Before your call, our AI generates your GTM diagnostic — profile, failure points, and the hypothesis we'll validate together." },
              { icon: '🎯', title: 'Bottleneck Identification', desc: 'We isolate the single highest-impact problem in your GTM. Not a list of 15 things — the one thing costing you the most.' },
              { icon: '⚡', title: '3 Executable Fixes', desc: 'Not advice. Not frameworks. Three specific, prioritized actions you can begin executing today.' },
              { icon: '📋', title: 'Written Follow-Up', desc: 'After the call, you receive a written summary of your 3 fixes by email — nothing gets lost.' },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="bg-white/[0.03] border border-white/8 rounded-xl p-6">
                <div className="text-3xl mb-4">{icon}</div>
                <h3 className="font-bold text-sm mb-2">{title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── UPSELL: 48-hr Website ── */}
      <section className="py-20 px-6 bg-white/[0.02] border-y border-white/8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-gradient-to-br from-orange-500/10 to-orange-500/5
                          border border-orange-500/25 rounded-2xl p-8 md:p-10 text-center">
            <span className="inline-block bg-orange-500 text-white text-xs font-bold
                             tracking-wider uppercase px-3 py-1 rounded-full mb-5">
              Add-On Service
            </span>
            <h2 className="text-2xl md:text-3xl font-black tracking-tight mb-3">
              Need a Website That Converts?
            </h2>
            <p className="text-gray-400 mb-6 text-sm leading-relaxed max-w-lg mx-auto">
              After your GTM call, we can build your 3-page site in 48 hours —
              all copy written, 5 images, contact form with lead email notifications.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm font-medium mb-8">
              {['3 Pages', 'All Copy Written', '5 Images', 'Lead Notifications', 'Mobile Responsive', '48-Hr Delivery'].map(f => (
                <span key={f} className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-green-400" />{f}
                </span>
              ))}
            </div>
            <div className="text-4xl font-black tracking-tight mb-6">
              $500 <span className="text-base font-normal text-gray-400">flat · 48-hr delivery</span>
            </div>
            <a
              href="mailto:mike@rocketopp.com?subject=48-Hour Website Inquiry"
              className="inline-block bg-orange-500 hover:bg-orange-400 text-white font-bold
                         px-8 py-3.5 rounded-xl transition-colors text-sm"
            >
              Get My 48-Hr Website →
            </a>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-20 px-6">
        <div className="max-w-2xl mx-auto">
          <p className="text-orange-400 text-xs font-bold tracking-widest uppercase mb-3">FAQ</p>
          <h2 className="text-3xl font-black tracking-tight mb-8">Common questions.</h2>
          <div className="space-y-0">
            {FAQS.map((faq, i) => (
              <div key={i} className="border-b border-white/8 py-5">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="flex justify-between items-center w-full text-left gap-4"
                >
                  <span className="font-semibold text-sm">{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-orange-400 flex-shrink-0 transition-transform duration-200 ${
                      openFaq === i ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {openFaq === i && (
                  <p className="text-gray-400 text-sm leading-relaxed mt-3 animate-in fade-in duration-200">
                    {faq.a}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="bg-white/[0.02] border-t border-white/8 py-20 px-6 text-center">
        <div className="max-w-xl mx-auto">
          <p className="text-orange-400 text-xs font-bold tracking-widest uppercase mb-3">Ready?</p>
          <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-4">
            Stop guessing. Start <span className="text-orange-500">fixing</span>.
          </h2>
          <p className="text-gray-400 mb-8">
            Your GTM is either working or it has a leak. In 30 minutes, we&apos;ll tell you exactly which — and what to do about it.
          </p>
          <button
            onClick={scrollToForm}
            className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-400 text-white
                       font-bold text-lg px-10 py-5 rounded-xl transition-all
                       shadow-[0_8px_32px_rgba(255,92,26,0.35)] hover:-translate-y-0.5"
          >
            Start My AI Assessment <ArrowRight className="w-5 h-5" />
          </button>
          <p className="text-gray-500 text-sm mt-3">$49 · 30-min session · 3 actionable fixes guaranteed</p>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-white/8 py-8 px-6 text-center">
        <p className="text-lg font-black mb-3">Rocket<span className="text-orange-500">Opp</span></p>
        <div className="flex justify-center gap-6 text-sm text-gray-500 mb-3">
          <Link href="/" className="hover:text-white transition-colors">Home</Link>
          <Link href="/hipaa" className="hover:text-white transition-colors">HIPAA Scanner</Link>
          <a href="mailto:mike@rocketopp.com" className="hover:text-white transition-colors">Contact</a>
          <a href="https://0nmcp.com" className="hover:text-white transition-colors">0nMCP</a>
        </div>
        <p className="text-xs text-gray-600">© 2026 RocketOpp LLC · All rights reserved</p>
      </footer>

    </div>
  )
}
