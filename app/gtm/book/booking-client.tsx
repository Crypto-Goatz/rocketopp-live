'use client'

/**
 * GtmBookingClient — client component for /gtm/book
 *
 * Shows:
 *   • Payment confirmed banner + 3-step progress bar
 *   • Assessment summary (from Stripe metadata)
 *   • AI pre-brief generating status card
 *   • Embedded GHL discovery-call calendar (iframe)
 *   • What happens next cards
 */

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { CheckCircle2, Calendar, Loader2 } from 'lucide-react'

interface Props {
  firstName:  string
  email:      string
  assessment: Record<string, string>
  bookingUrl: string
  sessionId:  string
}

const REVENUE_MAP: Record<string, string> = {
  'pre-revenue': 'Pre-revenue / just starting',
  'under-1k':    'Under $1,000/mo',
  '1k-10k':      '$1,000 – $10,000/mo',
  '10k-plus':    '$10,000+/mo',
}

const BOTTLENECK_MAP: Record<string, string> = {
  'lead-gen':       'Not enough leads / traffic',
  'conversion':     "Leads but can't convert or close",
  'messaging':      'Unclear messaging / positioning',
  'wrong-audience': 'Reaching the wrong audience',
}

export function GtmBookingClient({ firstName, email, assessment, bookingUrl, sessionId }: Props) {
  const [calLoaded, setCalLoaded] = useState(false)

  // Build pre-filled calendar URL (GHL supports email param)
  const calUrl = email
    ? `${bookingUrl}${bookingUrl.includes('?') ? '&' : '?'}email=${encodeURIComponent(email)}&name=${encodeURIComponent(firstName)}&session_id=${sessionId}`
    : bookingUrl

  // Fallback: show manual booking message if URL is still the placeholder
  const isPlaceholder = bookingUrl.includes('DISCOVERY_CALL_CALENDAR_ID')

  useEffect(() => {
    // Fallback: show calendar after 10s even if onload doesn't fire
    const t = setTimeout(() => setCalLoaded(true), 10000)
    return () => clearTimeout(t)
  }, [])

  return (
    <div className="min-h-screen bg-[#07070f] text-white font-sans antialiased">

      {/* NAV */}
      <nav className="flex items-center justify-between px-6 py-4 border-b border-white/8">
        <Link href="/" className="text-lg font-black tracking-tight">
          Rocket<span className="text-orange-500">Opp</span>
        </Link>
        <span className="text-xs text-gray-500">
          <span className="text-green-400 font-semibold">● Paid</span> · Session confirmed
        </span>
      </nav>

      {/* PAYMENT CONFIRMED BANNER */}
      <div className="bg-green-500/10 border-b border-green-500/20 px-6 py-4 flex items-start gap-4">
        <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 mt-0.5">
          <CheckCircle2 className="w-5 h-5 text-white" />
        </div>
        <div>
          <p className="font-bold text-base">
            Payment confirmed{firstName ? ` — welcome, ${firstName}` : ''}. You&apos;re in.
          </p>
          <p className="text-sm text-gray-400 mt-0.5">
            Your AI GTM Pre-Brief is being generated. Pick a time below to lock in your 30-minute session.
          </p>
        </div>
      </div>

      {/* PROGRESS BAR */}
      <div className="max-w-xl mx-auto px-6 pt-10 pb-4">
        <div className="flex items-center justify-center gap-2">
          {/* Step 1 */}
          <div className="flex flex-col items-center gap-1.5">
            <div className="w-9 h-9 rounded-full bg-green-500 flex items-center justify-center font-black text-sm">✓</div>
            <span className="text-xs text-white font-semibold text-center">Assessment<br />Complete</span>
          </div>
          <div className="h-0.5 w-12 bg-green-500" />
          {/* Step 2 */}
          <div className="flex flex-col items-center gap-1.5">
            <div className="w-9 h-9 rounded-full bg-orange-500 flex items-center justify-center font-black text-sm">✓</div>
            <span className="text-xs text-white font-semibold text-center">Payment<br />Confirmed</span>
          </div>
          <div className="h-0.5 w-12 bg-orange-500" />
          {/* Step 3 */}
          <div className="flex flex-col items-center gap-1.5">
            <div className="w-9 h-9 rounded-full bg-orange-500 flex items-center justify-center font-black text-sm ring-4 ring-orange-500/25">3</div>
            <span className="text-xs text-orange-300 font-semibold text-center">Book Your<br />Call</span>
          </div>
        </div>
      </div>

      {/* MAIN */}
      <div className="max-w-2xl mx-auto px-6 pb-20 space-y-6 mt-6">

        {/* AI Pre-brief status */}
        <div className="flex items-center gap-4 bg-blue-500/8 border border-blue-500/20 rounded-xl p-5">
          <div className="text-3xl flex-shrink-0">🤖</div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-sm">AI Pre-Brief generating now</p>
            <p className="text-xs text-gray-400 mt-0.5">
              Your answers are being analyzed. Mike will have your GTM diagnostic before the call — no cold starts.
            </p>
          </div>
          <span className="flex-shrink-0 text-xs font-bold text-blue-300 bg-blue-500/12 border border-blue-500/25 px-3 py-1 rounded-full">
            In Progress
          </span>
        </div>

        {/* Assessment summary */}
        {Object.values(assessment).some(Boolean) && (
          <div className="bg-[#0e0e1a] border border-white/8 rounded-xl p-5">
            <p className="text-xs font-bold tracking-widest uppercase text-orange-400 mb-4">Your Assessment Summary</p>
            <div className="space-y-3">
              {[
                { label: 'Business / ICP',   value: assessment.business },
                { label: 'Monthly revenue',  value: REVENUE_MAP[assessment.revenue] || assessment.revenue },
                { label: 'GTM bottleneck',   value: BOTTLENECK_MAP[assessment.bottleneck] || assessment.bottleneck },
                { label: 'Active channels',  value: assessment.channels },
                { label: '90-day goal',      value: assessment.goal },
              ].filter(r => r.value).map(({ label, value }) => (
                <div key={label} className="flex gap-3 text-sm border-b border-white/5 pb-3 last:border-0 last:pb-0">
                  <span className="text-gray-500 min-w-[130px] flex-shrink-0 text-xs pt-0.5">{label}</span>
                  <span className="text-gray-200 font-medium leading-snug">{value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Calendar section */}
        <div className="bg-[#0e0e1a] border border-white/8 rounded-xl overflow-hidden">
          {/* Calendar header */}
          <div className="flex items-center gap-4 px-5 py-4 border-b border-white/8">
            <div className="w-10 h-10 rounded-xl bg-orange-500/15 border border-orange-500/25 flex items-center justify-center flex-shrink-0">
              <Calendar className="w-5 h-5 text-orange-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-sm">GTM Reality Check — 30 Min</p>
              <p className="text-xs text-gray-400">with Mike · RocketOpp LLC · via Zoom</p>
            </div>
            <span className="flex-shrink-0 text-xs font-semibold text-green-400 bg-green-500/10 border border-green-500/20 px-3 py-1 rounded-full">
              🟢 Slots Available
            </span>
          </div>

          {/* Calendar body */}
          {isPlaceholder ? (
            /* Placeholder state while env var isn't set */
            <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
              <Calendar className="w-10 h-10 text-orange-400 mb-4" />
              <p className="font-bold mb-2">Calendar coming online shortly</p>
              <p className="text-gray-400 text-sm mb-6 max-w-sm">
                To book your slot right now, email Mike directly and he&apos;ll send a calendar link within 15 minutes.
              </p>
              <a
                href={`mailto:mike@rocketopp.com?subject=GTM Reality Check Booking — ${firstName}&body=Hi Mike, I just paid for the GTM Reality Check (session: ${sessionId}). Please send me a booking link. Thanks!`}
                className="inline-block bg-orange-500 hover:bg-orange-400 text-white font-bold text-sm px-6 py-3 rounded-xl transition-colors"
              >
                Email Mike to Book →
              </a>
            </div>
          ) : (
            /* GHL Calendar embed */
            <div className="relative">
              {!calLoaded && (
                <div className="absolute inset-0 flex items-center justify-center bg-[#0e0e1a] z-10 min-h-[400px]">
                  <div className="flex flex-col items-center gap-3">
                    <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
                    <p className="text-sm text-gray-400">Loading available times…</p>
                  </div>
                </div>
              )}
              <iframe
                src={calUrl}
                className="w-full min-h-[700px] block border-0"
                onLoad={() => setCalLoaded(true)}
                title="Book your GTM Reality Check"
              />
            </div>
          )}
        </div>

        {/* What happens next */}
        <div className="grid grid-cols-2 gap-3">
          {[
            { n: '01', title: 'Confirmation Email',  desc: "You'll get a Zoom link and calendar invite the moment you book." },
            { n: '02', title: 'AI Pre-Brief Sent',   desc: "Mike receives your GTM analysis before the call — no discovery time wasted." },
            { n: '03', title: 'Show Up Ready',        desc: 'Nothing to prepare. Just be ready to talk through your business.' },
            { n: '04', title: '3 Fixes in Writing',  desc: 'After the call, your action summary arrives by email within 1 hour.' },
          ].map(({ n, title, desc }) => (
            <div key={n} className="bg-white/[0.03] border border-white/8 rounded-xl p-4">
              <p className="text-orange-500 font-black text-lg mb-1.5">{n}</p>
              <p className="font-bold text-sm mb-1">{title}</p>
              <p className="text-gray-400 text-xs leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>

      </div>

      {/* FOOTER */}
      <footer className="border-t border-white/8 py-6 px-6 text-center">
        <p className="text-sm text-gray-500">
          Questions? <a href="mailto:mike@rocketopp.com" className="text-orange-400 hover:text-orange-300">mike@rocketopp.com</a>
          {' · '}
          <Link href="/" className="hover:text-white transition-colors">RocketOpp LLC</Link>
        </p>
      </footer>

    </div>
  )
}
