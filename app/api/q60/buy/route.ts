/**
 * POST /api/q60/buy — Buy It Now on /q60-for-sale.
 *
 * 1. Emails Mike immediately (via notifyFormSubmission) that a buyer committed, BEFORE Stripe — so a buyer who
 *    abandons the card page is still a lead with a name and phone number.
 * 2. Creates a Stripe Checkout session for the holding deposit (CAR.depositCents, default $1,000). The balance is
 *    paid in person; a $25k card charge is a chargeback risk after the car has left, so it is never taken by card.
 * 3. Stripe returns to /q60-for-sale/reserved, which verifies payment_status server-side and emails Mike again.
 *
 * metadata.source = 'rocketopp-q60-deposit'. Both existing Stripe webhooks ignore it: stripe-store only handles
 * 'rocketopp-store' and 'rocketopp-order-deposit'; /api/webhooks/stripe breaks out when user_id is missing.
 */
import { NextRequest, NextResponse } from 'next/server'
import { checkBotId } from 'botid/server'
import { stripe } from '@/lib/stripe'
import { notifyFormSubmission } from '@/lib/crm/notify'
import { CAR, PATH, URL_ } from '@/lib/q60/listing'

export const runtime = 'nodejs'

const usd = (n: number) => n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })

export async function POST(req: NextRequest) {
  let d: Record<string, string>
  try { d = await req.json() } catch { return NextResponse.json({ ok: false, error: 'Bad request.' }, { status: 400 }) }

  const name = String(d.name || '').trim().slice(0, 120)
  const email = String(d.email || '').trim().slice(0, 200)
  const phone = String(d.phone || '').trim().slice(0, 40)
  const pickup = String(d.pickup || '').trim().slice(0, 300)
  const agreed = d.agree === 'on' || d.agree === 'true'

  if (!name || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email) || phone.replace(/\D/g, '').length < 10) {
    return NextResponse.json({ ok: false, error: 'Add your name, email and a phone number Mike can reach you on.' }, { status: 422 })
  }
  if (!agreed) {
    return NextResponse.json({ ok: false, error: 'Check the box to accept the purchase terms.' }, { status: 422 })
  }

  const bot = await checkBotId()
  if (bot.isBot) {
    return NextResponse.json({ ok: false, error: 'We could not verify this. Call or email mike@rocketopp.com to buy the car.' }, { status: 403 })
  }

  const deposit = CAR.depositCents / 100
  const ref = `q60_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`
  const [firstName, ...rest] = name.split(/\s+/)

  const notified = await notifyFormSubmission({
    email, firstName, lastName: rest.join(' '), fullName: name, phone,
    // Buyer free text stays out of `message` (spam-scored; "loan" is a keyword) and rides in extras instead.
    message: `BUY IT NOW at ${usd(CAR.price)}. Buyer accepted the terms and is being sent to pay the ${usd(deposit)} holding deposit.`,
    source: 'rocketopp-q60-buy-now', formName: 'Q60 Sale — Buy It Now', pageUrl: req.headers.get('referer') || URL_,
    tags: ['Q60 Sale', 'Q60 Buy Now'], honeypot: d.rk_hp, thankLead: false, userAgent: req.headers.get('user-agent'),
    extras: { Vehicle: CAR.title, Price: usd(CAR.price), Deposit: usd(deposit), 'Balance due at pickup': usd(CAR.price - deposit), 'Pickup / timing': pickup || '—', Reference: ref },
  })

  if (!process.env.STRIPE_SECRET_KEY) {
    // No card processing configured: the commitment is already in Mike's inbox; he arranges payment directly.
    return NextResponse.json({ ok: notified.received, fallback: true })
  }

  const base = process.env.NEXT_PUBLIC_APP_URL || 'https://rocketopp.com'
  const metadata: Record<string, string> = {
    source: 'rocketopp-q60-deposit', ref, buyer_name: name, buyer_email: email, buyer_phone: phone,
    pickup: pickup.slice(0, 450), price: String(CAR.price),
  }
  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [{
        quantity: 1,
        price_data: {
          currency: 'usd',
          unit_amount: CAR.depositCents,
          product_data: {
            name: `Holding deposit — ${CAR.title}`,
            description: `Applied to the ${usd(CAR.price)} price. Balance of ${usd(CAR.price - deposit)} due at pickup by cashier’s check or cleared wire. Refunded in full if the car is not as described. Ref ${ref}.`,
          },
        },
      }],
      customer_email: email,
      metadata,
      payment_intent_data: { metadata, description: `Q60 holding deposit ${ref}` },
      success_url: `${base}${PATH}/reserved?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${base}${PATH}?checkout=cancelled#buy`,
    })
    return NextResponse.json({ ok: true, url: session.url })
  } catch (err) {
    console.error('[q60/buy] stripe error:', err instanceof Error ? err.message : err)
    return NextResponse.json({ ok: notified.received, fallback: true })
  }
}
