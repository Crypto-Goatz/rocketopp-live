'use client'

/**
 * APEX — rebuilt on Groq. Single-page conversational assessment.
 *
 * Layout:
 *   - Desktop: left column stays fixed (question + input); right column is
 *     a vertically scrolling event stream with a gradient mask fade on
 *     top + bottom. Newest events animate in from the top and push older
 *     ones down with framer-motion's `layout` prop.
 *   - Mobile: no stream column; only the question and the most-recent AI
 *     insight render, one at a time.
 *
 * Every AI call goes to /api/apex/* — no keys leak to the client. PDF is
 * generated client-side with jspdf.
 */

import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ApexLogo } from '@/components/apex/ApexLogo'
import type {
  AppState, Assessment, ChatMsg, Collected, Competitor, InfoStep,
  Insight, Personalization, Turn,
} from '@/components/apex/types'

const TOTAL_STEPS = 7
const INDUSTRY_OPTIONS = ['Home Services', 'Restaurant', 'Retail', 'Automotive', 'Professional Services']

const INDUSTRY_INSIGHTS: Record<string, { title: string; text: string }> = {
  'Restaurant':             { title: 'Restaurant Industry Insight', text: 'The National Restaurant Association reports that 79% of diners check a website before visiting. A **clear, mobile-friendly menu** is critical.' },
  'Home Services':          { title: 'Home Services Insight',        text: '**88% of customers** read online reviews to determine a local business\u2019s quality. Trust signals on your site are paramount.' },
  'Retail':                 { title: 'Retail Insight',               text: 'Shopify data reveals that online stores with a strong brand narrative see **3-4 times higher** conversion rates.' },
  'Automotive':             { title: 'Automotive Insight',           text: '75% of auto-service searches start online. An **easy-to-use online booking** system significantly lifts appointments.' },
  'Professional Services':  { title: 'Professional Services Insight', text: '**Case studies and testimonials** are the most effective credibility content for professional services, per LinkedIn.' },
  'default':                { title: 'Business Insight',              text: 'Websites that load in under **2 seconds** have significantly higher conversion rates. Speed is a feature.' },
}

type StreamEvent =
  | { id: string; kind: 'qa'; question: string; answer: string }
  | { id: string; kind: 'insight'; insight: Insight }

function uid(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID()
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
}

function carveJson(text: string): string | null {
  const s = text.indexOf('{')
  const e = text.lastIndexOf('}')
  if (s < 0 || e < 0 || e <= s) return null
  return text.slice(s, e + 1)
}

function parseAndHighlight(text: string | undefined | null): React.ReactNode {
  if (!text) return null
  return text.split(/\*\*(.*?)\*\*/g).map((part, i) =>
    i % 2 === 1
      ? <span key={i} className="text-[#F97316] font-semibold">{part}</span>
      : <span key={i}>{part}</span>
  )
}

export function ApexClient() {
  const [appState, setAppState] = useState<AppState>('intro')
  const [infoStep, setInfoStep] = useState<InfoStep>('name')
  const [personalization, setPersonalization] = useState<Personalization>({
    name: '', company: '', website: '', zipCode: '', industry: '',
  })

  const [currentTurn, setCurrentTurn] = useState<Turn | null>(null)
  const [currentAnswer, setCurrentAnswer] = useState('')
  const [loadingMessage, setLoadingMessage] = useState<string | null>(null)

  const [conversation, setConversation] = useState<ChatMsg[]>([]) // for /api/apex/chat
  const [events, setEvents] = useState<StreamEvent[]>([])         // render source
  const [competitors, setCompetitors] = useState<Competitor[]>([])
  const [assessmentStep, setAssessmentStep] = useState(0)
  const [assessment, setAssessment] = useState<Assessment | null>(null)
  const [contact, setContact] = useState<{ name: string; email: string; phone?: string } | null>(null)
  const [blueprintUrl, setBlueprintUrl] = useState<string | null>(null)

  const textRef = useRef<HTMLTextAreaElement>(null)

  // Derive the flat arrays the backend calls need.
  const collected: Collected[] = useMemo(
    () => events.filter((e): e is Extract<StreamEvent, { kind: 'qa' }> => e.kind === 'qa'),
    [events],
  )
  const insights: Insight[] = useMemo(
    () => events.filter((e): e is Extract<StreamEvent, { kind: 'insight' }> => e.kind === 'insight').map(e => e.insight),
    [events],
  )
  // Newest-first + latest insight for the mobile card.
  const reversed = useMemo(() => [...events].reverse(), [events])
  const latestInsight = useMemo(() => {
    for (let i = events.length - 1; i >= 0; i--) {
      if (events[i].kind === 'insight') return (events[i] as Extract<StreamEvent, { kind: 'insight' }>).insight
    }
    return null
  }, [events])

  function pushQA(question: string, answer: string) {
    setEvents(prev => [...prev, { id: uid(), kind: 'qa', question, answer }])
  }
  function pushInsight(insight: Insight) {
    setEvents(prev => [...prev, { id: uid(), kind: 'insight', insight }])
  }

  useEffect(() => {
    const t = setTimeout(() => setAppState('consent'), 2200)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    if (textRef.current) {
      textRef.current.style.height = 'auto'
      textRef.current.style.height = `${textRef.current.scrollHeight}px`
    }
  }, [currentAnswer])

  function beginInfo() {
    setAppState('collectingInfo')
    setCurrentTurn({ question: "Welcome to APEX. To start, what's your **name**?" })
  }

  async function callChat(history: ChatMsg[], latestUser: string): Promise<string> {
    const msgs = [...history, { role: 'user' as const, content: latestUser }]
    const res = await fetch('/api/apex/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: msgs }),
    })
    const data = await res.json()
    if (!res.ok || !data.text) throw new Error(data?.error || 'chat_failed')
    return data.text as string
  }

  function processModelTurn(text: string) {
    if (text.startsWith('ASSESSMENT_COMPLETE:')) {
      const json = carveJson(text.slice('ASSESSMENT_COMPLETE:'.length)) || carveJson(text)
      let parsed: Assessment = {}
      if (json) {
        try { parsed = JSON.parse(json) as Assessment } catch { parsed = {} }
      }
      if (Object.keys(parsed).length === 0) {
        parsed = {
          'Executive Summary':     'Session complete. A RocketOpp strategist will review your transcript and email a full blueprint.',
          'Strategic Next Steps':  'Watch your inbox — your personalized blueprint arrives within 24 hours.',
        }
      }
      setAssessment(parsed)
      setAppState('capturing')
      return
    }
    const json = carveJson(text)
    if (!json) {
      setCurrentTurn({ question: 'My apologies — I **misspoke**. Could you rephrase your last answer?' })
      return
    }
    try {
      setCurrentTurn(JSON.parse(json))
    } catch {
      setCurrentTurn({ question: 'My apologies — I **misspoke**. Could you rephrase your last answer?' })
    }
  }

  async function sendTurn(latestUser: string) {
    setLoadingMessage('Thinking...')
    setCurrentTurn(null)
    try {
      const text = await callChat(conversation, latestUser)
      const nextHistory: ChatMsg[] = [...conversation, { role: 'user', content: latestUser }, { role: 'assistant', content: text }]
      setConversation(nextHistory)
      processModelTurn(text)
    } catch {
      setCurrentTurn({ question: 'System error. Recalibrating — **please try again**.' })
    } finally {
      setLoadingMessage(null)
    }
  }

  async function runProactiveAnalysis(websiteAnswer: string) {
    const updated = { ...personalization, website: websiteAnswer }
    setPersonalization(updated)
    setCurrentTurn(null)

    try {
      setLoadingMessage(`Capturing screenshot of **${websiteAnswer}**...`)
      const shot = await fetch('/api/apex/screenshot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: websiteAnswer }),
      }).then(r => r.json()).catch(() => ({ ok: false }))

      if (shot?.ok && shot.imageUrl) {
        setLoadingMessage('Running **proactive website analysis**...')
        const analysis = await fetch('/api/apex/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ imageUrl: shot.imageUrl }),
        }).then(r => r.json()).catch(() => ({}))

        if (analysis?.seo) pushInsight({ type: 'standard', title: analysis.seo.title, text: analysis.seo.text })
        if (analysis?.mobile) pushInsight({ type: 'standard', title: analysis.mobile.title, text: analysis.mobile.text })
      } else {
        pushInsight({
          type: 'standard',
          title: 'Analysis Note',
          text: "Automated website capture hit a snag — we'll **proceed** with the info you've provided.",
        })
      }

      setLoadingMessage('Identifying **local competitors**...')
      const comps = await fetch('/api/apex/competitors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ companyName: updated.company, zipCode: updated.zipCode, industry: updated.industry }),
      }).then(r => r.json()).catch(() => ({ competitors: [] }))

      const list: Competitor[] = comps?.competitors || []
      setCompetitors(list)
      setLoadingMessage(null)
      setAppState('selectingCompetitors')
    } catch {
      setLoadingMessage(null)
      setAppState('interacting')
      await sendTurn(`My name is ${updated.name}, company is ${updated.company}, industry is ${updated.industry}, website is ${updated.website}. Please ask the first critical question.`)
    }
  }

  async function submitAnswer(answer: string) {
    if (loadingMessage || !answer.trim()) return

    if (currentTurn?.question) {
      const q = currentTurn.question.replace(/\*\*(.*?)\*\*/g, '$1')
      pushQA(q, answer)
    }
    if (currentTurn?.insight) pushInsight({ ...currentTurn.insight })
    setCurrentAnswer('')

    const trimmed = answer.trim()

    if (appState === 'collectingInfo') {
      switch (infoStep) {
        case 'name':
          setPersonalization(p => ({ ...p, name: trimmed }))
          setInfoStep('company')
          setCurrentTurn({ question: `A pleasure, ${trimmed}. What is your **company's name**?` })
          break
        case 'company':
          setPersonalization(p => ({ ...p, company: trimmed }))
          setInfoStep('zipCode')
          setCurrentTurn({ question: `And your business **zip code**?` })
          break
        case 'zipCode':
          setPersonalization(p => ({ ...p, zipCode: trimmed }))
          setInfoStep('industry')
          setCurrentTurn({
            question: `Thanks. What's your primary **business category**?`,
            options: INDUSTRY_OPTIONS,
          })
          break
        case 'industry': {
          setPersonalization(p => ({ ...p, industry: trimmed }))
          setInfoStep('website')
          const key = Object.keys(INDUSTRY_INSIGHTS).find(k => trimmed.toLowerCase().includes(k.toLowerCase())) || 'default'
          const ins = INDUSTRY_INSIGHTS[key]
          setCurrentTurn({
            question: `Got it. And what is your company's **website address**?`,
            insight: { title: ins.title, text: ins.text },
          })
          break
        }
        case 'website':
          await runProactiveAnalysis(trimmed)
          break
      }
      return
    }

    if (appState === 'interacting') {
      setAssessmentStep(s => s + 1)
      await sendTurn(trimmed)
    }
  }

  function pickCompetitors(selected: Competitor[]) {
    pushInsight({ type: 'competitive_analysis', title: 'Your Competitive Landscape', competitors: selected })
    const names = selected.filter(c => !c.isPlayer).map(c => c.name).join(', ')
    setAppState('interacting')
    const first = `Name: ${personalization.name}. Company: ${personalization.company}. Industry: ${personalization.industry}. Website: ${personalization.website}. Competitors: ${names || 'None identified'}. We've reviewed the initial analysis. Ask me the first critical assessment question.`
    sendTurn(first)
  }

  async function handleLead(info: { name: string; email: string; phone: string }) {
    setContact(info)
    setAppState('generating')
    try {
      const [{ jsPDF }] = await Promise.all([import('jspdf')])
      const doc = new jsPDF({ unit: 'pt', format: 'letter' })
      doc.setFont('helvetica', 'bold'); doc.setFontSize(24)
      doc.setTextColor(249, 115, 22)
      doc.text('APEX Strategic Blueprint', 40, 60)
      doc.setTextColor(30, 30, 30); doc.setFontSize(11); doc.setFont('helvetica', 'normal')
      doc.text(`Prepared for ${info.name} · ${personalization.company}`, 40, 80)

      let y = 120
      const sections: Array<[keyof Assessment, string]> = [
        ['Executive Summary',     'Executive Summary'],
        ['Identified Strengths',  'Identified Strengths'],
        ['Critical Weaknesses',   'Critical Weaknesses'],
        ['Market Opportunities',  'Market Opportunities'],
        ['Competitive Threats',   'Competitive Threats'],
        ['Social Media Presence', 'Social Media Presence'],
        ['Strategic Next Steps',  'Strategic Next Steps'],
      ]
      for (const [key, label] of sections) {
        const val = assessment?.[key] || ''
        if (!val) continue
        if (y > 700) { doc.addPage(); y = 60 }
        doc.setFont('helvetica', 'bold'); doc.setFontSize(13); doc.setTextColor(249, 115, 22)
        doc.text(label, 40, y); y += 18
        doc.setFont('helvetica', 'normal'); doc.setFontSize(11); doc.setTextColor(40, 40, 40)
        const lines = doc.splitTextToSize(val, 520) as string[]
        doc.text(lines, 40, y); y += (lines.length * 14) + 18
      }
      const blobUrl = URL.createObjectURL(doc.output('blob'))
      setBlueprintUrl(blobUrl)

      await fetch('/api/apex/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: info.name, email: info.email, phone: info.phone,
          company: personalization.company, website: personalization.website,
          zipCode: personalization.zipCode, industry: personalization.industry,
          blueprintUrl: null,
          assessment, conversation: collected,
        }),
      }).catch(() => {})

      setTimeout(() => setAppState('outro'), 1200)
    } catch {
      setAppState('outro')
    }
  }

  // ------------- render -------------

  if (appState === 'intro') {
    return (
      <div className="min-h-screen bg-[#08090c] text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-28 h-28 mx-auto mb-6"><ApexLogo className="w-full h-full" /></div>
          <div className="text-xs tracking-[0.3em] text-white/50 font-mono animate-pulse">APEX AI :: INITIALIZING</div>
        </div>
      </div>
    )
  }

  if (appState === 'consent') return <ConsentModal onConsent={beginInfo} />
  if (appState === 'selectingCompetitors') return <CompetitorStep competitors={competitors} onSubmit={pickCompetitors} />
  if (appState === 'capturing' && assessment) return <LeadCapture userName={personalization.name} onSubmit={handleLead} />
  if (appState === 'generating') return <Generating />
  if (appState === 'outro' && assessment) {
    return (
      <Summary
        data={assessment}
        insights={insights}
        userName={contact?.name}
        companyName={personalization.company}
        blueprintUrl={blueprintUrl}
      />
    )
  }

  // collectingInfo / interacting
  return (
    <main className="h-screen overflow-hidden bg-[#08090c] text-white flex flex-col lg:flex-row">
      {/* Left — fixed question column */}
      <section className="flex-1 min-w-0 lg:h-screen flex items-center justify-center p-6">
        <div className="w-full max-w-xl">
          {appState === 'interacting' && (
            <div className="mb-6 h-1.5 rounded-full bg-white/5 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#F97316] to-[#EA580C] transition-[width] duration-500"
                style={{ width: `${Math.min(100, (assessmentStep / TOTAL_STEPS) * 100)}%` }}
              />
            </div>
          )}
          {loadingMessage ? (
            <div className="text-center">
              <h1 className="text-2xl md:text-3xl font-bold mb-4">{parseAndHighlight(loadingMessage)}</h1>
              <Dots />
            </div>
          ) : currentTurn ? (
            <>
              <h1 className="text-3xl md:text-4xl font-bold text-center mb-8 leading-tight">
                {parseAndHighlight(currentTurn.question)}
              </h1>
              {currentTurn.options ? (
                <div className="flex flex-wrap justify-center gap-3">
                  {currentTurn.options.map((o, i) => (
                    <button
                      key={i}
                      onClick={() => submitAnswer(o)}
                      className="px-5 py-3 rounded-lg border border-white/10 bg-white/[0.03] text-sm font-semibold hover:bg-[#F97316]/10 hover:border-[#F97316]/40 transition"
                    >{o}</button>
                  ))}
                </div>
              ) : (
                <div className="relative">
                  <textarea
                    ref={textRef}
                    value={currentAnswer}
                    onChange={(e) => setCurrentAnswer(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault()
                        if (currentAnswer.trim()) submitAnswer(currentAnswer)
                      }
                    }}
                    placeholder="Type your answer…"
                    rows={1}
                    className="w-full bg-[#0e1014] border border-white/10 focus:border-[#F97316]/60 rounded-lg px-4 py-3 pr-14 text-lg outline-none resize-none"
                  />
                  <button
                    onClick={() => submitAnswer(currentAnswer)}
                    disabled={!currentAnswer.trim()}
                    aria-label="Send"
                    className="absolute bottom-2.5 right-2.5 w-9 h-9 inline-flex items-center justify-center rounded-md bg-[#F97316] text-white disabled:opacity-40"
                  >→</button>
                </div>
              )}

              {/* Mobile-only: single latest insight inline below the question */}
              {latestInsight && (
                <div className="mt-8 lg:hidden">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={latestInsight.title || 'latest'}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.25 }}
                    >
                      <div className="text-[10px] tracking-[0.18em] uppercase text-white/45 font-mono mb-2">— Latest insight</div>
                      <InsightCard ins={latestInsight} />
                    </motion.div>
                  </AnimatePresence>
                </div>
              )}
            </>
          ) : null}
        </div>
      </section>

      {/* Right — scrollable stream, gradient-masked */}
      <aside
        className="hidden lg:block flex-1 min-w-0 lg:h-screen border-l border-white/5 bg-[#0b0d12] relative"
      >
        <div
          className="h-full overflow-y-auto p-8 pt-10 pb-12"
          style={{
            WebkitMaskImage: 'linear-gradient(to bottom, transparent 0, black 36px, black calc(100% - 48px), transparent 100%)',
            maskImage:       'linear-gradient(to bottom, transparent 0, black 36px, black calc(100% - 48px), transparent 100%)',
          }}
        >
          <div className="w-full max-w-md mx-auto">
            <div className="text-[10px] tracking-[0.18em] uppercase text-white/45 font-mono mb-5 sticky top-0 bg-[#0b0d12]/80 backdrop-blur-sm py-1 z-10">— Live Assessment</div>
            {events.length === 0 ? (
              <div className="text-sm text-white/45">Insights will appear here as the conversation unfolds.</div>
            ) : (
              <motion.div layout className="space-y-3">
                <AnimatePresence initial={false}>
                  {reversed.map((e) => (
                    <motion.div
                      key={e.id}
                      layout
                      initial={{ opacity: 0, y: -14, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      transition={{ type: 'spring', stiffness: 380, damping: 32, mass: 0.8 }}
                    >
                      {e.kind === 'insight'
                        ? <InsightCard ins={e.insight} />
                        : <QACard question={e.question} answer={e.answer} />}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
          </div>
        </div>
      </aside>
    </main>
  )
}

/* ------------- subcomponents ------------- */

function ConsentModal({ onConsent }: { onConsent: () => void }) {
  return (
    <div className="min-h-screen bg-[#08090c] text-white flex items-center justify-center p-6">
      <div className="max-w-lg w-full rounded-2xl border border-white/10 bg-[#0e1014] p-7">
        <div className="w-16 h-16 mb-4"><ApexLogo className="w-full h-full" /></div>
        <h1 className="text-2xl font-bold mb-2">Before we begin.</h1>
        <p className="text-sm text-white/65 leading-relaxed">
          APEX is a conversational AI that conducts a free business assessment for you. We use the
          answers you provide, a public screenshot of your site, and anonymized competitor data to
          produce a strategic blueprint. No account required. Your email is used only to send the
          blueprint and to let a RocketOpp strategist follow up.
        </p>
        <button onClick={onConsent} className="mt-6 w-full h-11 rounded-lg bg-[#F97316] text-white font-bold">
          Start my assessment →
        </button>
        <p className="text-[11px] text-white/40 mt-3">
          By continuing you agree to our Privacy Policy. This is an informational tool, not consulting advice.
        </p>
      </div>
    </div>
  )
}

function CompetitorStep({ competitors, onSubmit }: { competitors: Competitor[]; onSubmit: (selected: Competitor[]) => void }) {
  const [picked, setPicked] = useState<Set<string>>(
    new Set(competitors.filter(c => !c.isPlayer).slice(0, 4).map(c => c.name)),
  )
  function toggle(name: string) {
    setPicked(prev => {
      const next = new Set(prev)
      if (next.has(name)) next.delete(name); else next.add(name)
      return next
    })
  }
  const selected = useMemo(() => {
    const you = competitors.find(c => c.isPlayer)
    const rest = competitors.filter(c => !c.isPlayer && picked.has(c.name))
    return you ? [you, ...rest] : rest
  }, [picked, competitors])

  return (
    <div className="min-h-screen bg-[#08090c] text-white p-6">
      <div className="max-w-2xl mx-auto">
        <div className="text-[10px] tracking-[0.18em] uppercase text-white/45 font-mono mb-2">— Competitive Landscape</div>
        <h1 className="text-3xl font-bold mb-2">Confirm your top local competitors.</h1>
        <p className="text-sm text-white/60 mb-8">We found these nearby. Pick the ones that actually compete with you — we&apos;ll scope the rest of the assessment around them.</p>
        <div className="space-y-2">
          {competitors.map((c) => {
            const active = c.isPlayer || picked.has(c.name)
            return (
              <button
                key={c.name}
                onClick={() => !c.isPlayer && toggle(c.name)}
                disabled={c.isPlayer}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-lg border text-left ${
                  c.isPlayer
                    ? 'border-[#F97316]/40 bg-[#F97316]/5'
                    : active
                      ? 'border-[#F97316]/40 bg-[#F97316]/5'
                      : 'border-white/10 bg-white/[0.02] hover:bg-white/[0.04]'
                }`}
              >
                <div>
                  <div className="text-sm font-semibold">{c.name}{c.isPlayer ? ' · (you)' : ''}</div>
                  {!c.isPlayer && (
                    <div className="text-[11px] text-white/45 font-mono mt-1">
                      {c.rating.toFixed(1)}★ · {c.userRatingsTotal} reviews
                    </div>
                  )}
                </div>
                {!c.isPlayer && (
                  <span className={`text-xs font-bold ${active ? 'text-[#F97316]' : 'text-white/30'}`}>
                    {active ? 'PICKED' : '＋'}
                  </span>
                )}
              </button>
            )
          })}
        </div>
        <button
          onClick={() => onSubmit(selected)}
          className="mt-8 w-full h-12 rounded-lg bg-[#F97316] text-white font-bold text-sm"
        >Continue with {picked.size} competitor{picked.size === 1 ? '' : 's'} →</button>
      </div>
    </div>
  )
}

function LeadCapture({ userName, onSubmit }: { userName: string; onSubmit: (v: { name: string; email: string; phone: string }) => void }) {
  const [step, setStep] = useState<'email' | 'phone'>('email')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  return (
    <div className="min-h-screen bg-[#08090c] text-white flex items-center justify-center p-6">
      <div className="max-w-lg w-full">
        <div className="w-14 h-14 mb-4 mx-auto"><ApexLogo className="w-full h-full" /></div>
        <h1 className="text-3xl font-bold text-center mb-6">Finalizing strategic blueprint…</h1>
        {step === 'email' ? (
          <form onSubmit={(e) => { e.preventDefault(); if (email.trim()) setStep('phone') }}>
            <h2 className="text-lg font-semibold text-center mb-1">Perfect, {userName}.</h2>
            <p className="text-sm text-white/60 text-center mb-5">Where should I send your blueprint?</p>
            <input
              type="email" required autoFocus
              value={email} onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full bg-transparent border-b-2 border-white/15 focus:border-[#F97316] outline-none py-2 text-xl text-center"
            />
            <button disabled={!email.trim()} className="mt-8 w-full h-12 rounded-lg bg-[#F97316] text-white font-bold disabled:opacity-40">Continue</button>
          </form>
        ) : (
          <form onSubmit={(e) => { e.preventDefault(); onSubmit({ name: userName, email, phone }) }}>
            <h2 className="text-lg font-semibold text-center mb-1">Excellent.</h2>
            <p className="text-sm text-white/60 text-center mb-5">What number should a RocketOpp strategist use to follow up? (optional)</p>
            <input
              type="tel" autoFocus
              value={phone} onChange={(e) => setPhone(e.target.value)}
              placeholder="(555) 123-4567"
              className="w-full bg-transparent border-b-2 border-white/15 focus:border-[#F97316] outline-none py-2 text-xl text-center"
            />
            <button className="mt-8 w-full h-12 rounded-lg bg-[#F97316] text-white font-bold">Request my consultation</button>
            <button type="button" onClick={() => onSubmit({ name: userName, email, phone: '' })} className="mt-3 w-full text-sm text-white/55 hover:text-white">Maybe later</button>
          </form>
        )}
      </div>
    </div>
  )
}

function Generating() {
  return (
    <div className="min-h-screen bg-[#08090c] text-white flex items-center justify-center">
      <div className="text-center">
        <div className="w-24 h-24 mx-auto mb-6"><ApexLogo className="w-full h-full animate-pulse" /></div>
        <h1 className="text-2xl font-bold mb-2">Compiling blueprint</h1>
        <p className="text-sm text-white/55">Aggregating insights · generating PDF · transmitting to your inbox…</p>
      </div>
    </div>
  )
}

function Summary({ data, insights, userName, companyName, blueprintUrl }: {
  data: Assessment
  insights: Insight[]
  userName?: string
  companyName?: string
  blueprintUrl: string | null
}) {
  return (
    <div className="min-h-screen bg-[#08090c] text-white p-6">
      <div className="max-w-3xl mx-auto">
        <div className="text-[10px] tracking-[0.18em] uppercase text-white/45 font-mono mb-2">— Strategic Blueprint</div>
        <h1 className="text-4xl font-bold mb-1">{companyName ? companyName : 'Your business'}</h1>
        <p className="text-sm text-white/60 mb-8">Prepared for {userName || 'you'} — a RocketOpp strategist will follow up to schedule a complimentary session.</p>

        {blueprintUrl && (
          <a href={blueprintUrl} download="apex-blueprint.pdf" className="inline-flex items-center gap-2 px-5 h-11 rounded-lg bg-[#F97316] text-white font-bold text-sm mb-8">
            Download the PDF blueprint ↓
          </a>
        )}

        <div className="space-y-6">
          {Object.entries(data).filter(([, v]) => v).map(([k, v]) => (
            <section key={k} className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
              <div className="text-[10px] tracking-[0.18em] uppercase text-[#F97316] font-mono mb-2">— {k}</div>
              <p className="text-[15px] leading-relaxed text-white/85">{v as string}</p>
            </section>
          ))}
          {insights.length > 0 && (
            <section className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
              <div className="text-[10px] tracking-[0.18em] uppercase text-[#F97316] font-mono mb-3">— Captured Insights</div>
              <div className="space-y-3">
                {insights.map((ins, i) => <InsightCard key={i} ins={ins} />)}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  )
}

function InsightCard({ ins }: { ins: Insight }) {
  if (ins.type === 'competitive_analysis' && ins.competitors) {
    return (
      <div className="rounded-lg border border-white/10 bg-white/[0.02] p-3">
        <div className="text-[10px] tracking-[0.18em] uppercase text-white/45 font-mono mb-2">— {ins.title || 'Competitive landscape'}</div>
        <ul className="text-[13px] space-y-1">
          {ins.competitors.map(c => (
            <li key={c.name} className="flex justify-between">
              <span className={c.isPlayer ? 'text-[#F97316] font-semibold' : 'text-white/80'}>{c.name}{c.isPlayer ? ' (you)' : ''}</span>
              <span className="text-white/45 font-mono text-[11px]">{c.rating.toFixed(1)}★ · {c.userRatingsTotal}</span>
            </li>
          ))}
        </ul>
      </div>
    )
  }
  if (ins.type === 'social_media_analysis' && ins.platforms) {
    return (
      <div className="rounded-lg border border-white/10 bg-white/[0.02] p-3">
        <div className="text-[10px] tracking-[0.18em] uppercase text-white/45 font-mono mb-2">— {ins.title || 'Social snapshot'}</div>
        <div className="space-y-2">
          {ins.platforms.map(p => (
            <div key={p.platform}>
              <div className="text-[12px] font-semibold">{p.platform}</div>
              <div className="text-[12px] text-white/65">{p.analysis}</div>
              <div className="text-[12px] text-[#F97316] mt-0.5">→ {p.recommendation}</div>
            </div>
          ))}
        </div>
      </div>
    )
  }
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.02] p-3">
      <div className="text-[10px] tracking-[0.18em] uppercase text-white/45 font-mono mb-1">— {ins.title}</div>
      <p className="text-[13px] text-white/80">{parseAndHighlight(ins.text || '')}</p>
    </div>
  )
}

function QACard({ question, answer }: { question: string; answer: string }) {
  return (
    <div className="rounded-lg border border-white/5 bg-white/[0.02] p-3 text-sm">
      <div className="text-[10px] text-white/40 uppercase tracking-wider mb-1 font-mono">— Q &amp; A</div>
      <div className="text-white/65 text-[13px]">{question}</div>
      <div className="text-white font-medium mt-1">{answer}</div>
    </div>
  )
}

function Dots() {
  return (
    <div className="inline-flex gap-1.5">
      <span className="w-2 h-2 rounded-full bg-[#F97316] animate-pulse" />
      <span className="w-2 h-2 rounded-full bg-[#F97316] animate-pulse [animation-delay:120ms]" />
      <span className="w-2 h-2 rounded-full bg-[#F97316] animate-pulse [animation-delay:240ms]" />
    </div>
  )
}
