/**
 * /q60-for-sale/reserved — where Stripe returns after the Buy It Now deposit.
 *
 * The URL alone proves nothing (anyone can type it), so the session is fetched from Stripe server-side and the
 * page only says "reserved" when payment_status is 'paid' and the session is one of ours. Mike is emailed once per
 * session: the notification is skipped if a 'rocketopp-q60-deposit-paid' row for this session already exists.
 */
import type { Metadata } from 'next'
import { stripe } from '@/lib/stripe'
import { supabaseAdmin } from '@/lib/db/supabase'
import { notifyFormSubmission } from '@/lib/crm/notify'
import { CAR, PATH } from '@/lib/q60/listing'
import { serif, sans } from '../fonts'
import s from '../q60.module.css'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = { title: { absolute: 'Q60 reserved' }, robots: { index: false, follow: false } }

const usd = (n: number) => n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })

async function verify(sessionId: string) {
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId)
    if (session.metadata?.source !== 'rocketopp-q60-deposit') return null
    if (session.payment_status !== 'paid') return { paid: false as const, session }
    return { paid: true as const, session }
  } catch { return null }
}

async function notifyOnce(sessionId: string, m: Record<string, string>, amount: number) {
  const { data } = await supabaseAdmin.from('contact_submissions').select('id')
    .eq('source', 'rocketopp-q60-deposit-paid').eq('raw->extras->>stripe_session', sessionId).limit(1)
  if (data && data.length) return
  const [firstName, ...rest] = (m.buyer_name || '').split(/\s+/)
  await notifyFormSubmission({
    email: m.buyer_email, firstName, lastName: rest.join(' '), fullName: m.buyer_name, phone: m.buyer_phone,
    message: `DEPOSIT PAID — ${usd(amount)} received by card. The Q60 is sold pending pickup. Balance due ${usd(CAR.price - amount)}.`,
    source: 'rocketopp-q60-deposit-paid', formName: 'Q60 Sale — Deposit Paid', pageUrl: `https://rocketopp.com${PATH}/reserved`,
    tags: ['Q60 Sale', 'Q60 Deposit Paid'], thankLead: false,
    extras: { Vehicle: CAR.title, Price: usd(CAR.price), 'Deposit paid': usd(amount), 'Balance due': usd(CAR.price - amount), 'Pickup / timing': m.pickup || '—', Reference: m.ref, stripe_session: sessionId },
  })
}

export default async function Reserved({ searchParams }: { searchParams: Promise<{ session_id?: string }> }) {
  const { session_id } = await searchParams
  const v = session_id ? await verify(session_id) : null

  if (v?.paid) {
    const amount = (v.session.amount_total ?? CAR.depositCents) / 100
    await notifyOnce(session_id!, (v.session.metadata || {}) as Record<string, string>, amount)
  }

  return (
    <div className={`${s.root} ${serif.variable} ${sans.variable}`} style={{ minHeight: '100svh' }}>
      <main className={s.main} style={{ padding: '96px 20px 80px', maxWidth: 760 }}>
        {v?.paid ? (
          <>
            <p className={s.kicker}>Deposit received</p>
            <h1 className={s.h2}>The Q60 is yours. It’s off the market.</h1>
            <p className={s.lede}>Your {usd((v.session.amount_total ?? CAR.depositCents) / 100)} deposit is in and Mike has been notified. He’ll call you today to set the pickup.</p>
            <div className={s.terms}>
              <p><strong>At pickup:</strong> {usd(CAR.price - (v.session.amount_total ?? CAR.depositCents) / 100)} by cashier’s check, or by wire that has cleared before the handover.</p>
              <p><strong>You leave with:</strong> the keys, the signed title (paid off, no lien), every receipt, both dyno sheets, and the EcuTek license transfer through TPG Tuning.</p>
              <p>If the car isn’t as described when you see it, the deposit is refunded in full.</p>
            </div>
          </>
        ) : v && !v.paid ? (
          <>
            <h1 className={s.h2}>Payment is still processing.</h1>
            <p className={s.lede}>Stripe hasn’t confirmed the deposit yet. Refresh this page in a minute, or email mike@rocketopp.com.</p>
          </>
        ) : (
          <>
            <h1 className={s.h2}>We couldn’t find that payment.</h1>
            <p className={s.lede}>Nothing was charged on this link. <a href={`${PATH}#buy`}>Back to the car</a>, or email mike@rocketopp.com.</p>
          </>
        )}
        <p style={{ marginTop: 32 }}><a href={PATH}>← Back to the listing</a></p>
      </main>
    </div>
  )
}
