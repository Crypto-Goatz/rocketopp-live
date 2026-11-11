/**
 * POST /api/q60/lead — "Make an offer" and "Ask a question" on /q60-for-sale.
 *
 * Goes through notifyFormSubmission, the same path as /api/contact/submit, so it lands in Mike's inbox,
 * the CRM and contact_submissions. thankLead is false: the stock thank-you templates are about RocketOpp
 * services, not a car, and would confuse a buyer.
 */
import { NextRequest, NextResponse } from 'next/server'
import { checkBotId } from 'botid/server'
import { notifyFormSubmission } from '@/lib/crm/notify'
import { CAR, URL_ } from '@/lib/q60/listing'

export const runtime = 'nodejs'

const KINDS = {
  offer: { formName: 'Q60 Sale — Offer', tags: ['Q60 Sale', 'Q60 Offer'] },
  question: { formName: 'Q60 Sale — Question', tags: ['Q60 Sale', 'Q60 Question'] },
} as const

const usd = (n: number) => n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })

export async function POST(req: NextRequest) {
  let d: Record<string, string>
  try { d = await req.json() } catch { return NextResponse.json({ ok: false, error: 'Bad request.' }, { status: 400 }) }

  const kind = d.kind === 'offer' ? 'offer' : 'question'
  const k = KINDS[kind]
  const name = String(d.name || '').trim().slice(0, 120)
  const email = String(d.email || '').trim().slice(0, 200)
  const phone = String(d.phone || '').trim().slice(0, 40)
  const message = String(d.message || '').trim().slice(0, 4000)
  const offer = Number(String(d.offer || '').replace(/[^0-9.]/g, '')) || 0
  const payment = String(d.payment || '').slice(0, 40)
  const timeline = String(d.timeline || '').slice(0, 60)

  if (!name || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return NextResponse.json({ ok: false, error: 'Add your name and a valid email.' }, { status: 422 })
  }
  if (kind === 'offer' && offer < 1000) {
    return NextResponse.json({ ok: false, error: 'Enter your offer amount.' }, { status: 422 })
  }

  const bot = await checkBotId()
  if (bot.isBot) {
    return NextResponse.json({ ok: false, error: 'We could not verify this submission. Email mike@rocketopp.com directly.' }, { status: 403 })
  }

  const [firstName, ...rest] = name.split(/\s+/)
  const subjectLine = kind === 'offer'
    ? `Offer ${usd(offer)} on the Q60 (asking ${usd(CAR.price)})`
    : 'Question about the Q60'

  const result = await notifyFormSubmission({
    email,
    firstName,
    lastName: rest.join(' '),
    fullName: name,
    phone: phone || undefined,
    // Only our own summary goes in `message`: scoreSpam keyword-matches it, and "loan" is on that list —
    // a buyer writing about a bank loan would be blocked. The buyer's words ride in extras (emailed + stored).
    message: subjectLine,
    source: `rocketopp-q60-${kind}`,
    formName: k.formName,
    pageUrl: req.headers.get('referer') || URL_,
    tags: [...k.tags],
    honeypot: d.rk_hp,
    thankLead: false,
    userAgent: req.headers.get('user-agent'),
    extras: {
      Vehicle: CAR.title,
      'Asking (Buy It Now)': usd(CAR.price),
      ...(kind === 'offer' ? { Offer: usd(offer), 'Paying with': payment || '—', 'Timeline': timeline || '—' } : {}),
      "Buyer's message": message || '—',
    },
  })

  if (!result.received) {
    return NextResponse.json({ ok: false, error: 'That did not go through. Email mike@rocketopp.com directly.' }, { status: 502 })
  }
  return NextResponse.json({ ok: true })
}
