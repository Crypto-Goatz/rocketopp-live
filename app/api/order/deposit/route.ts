/**
 * POST /api/order/deposit
 *
 * Body: { selected, contact, aiSummary?, oneTimeTotal, recurringTotal }
 *
 * Creates a Stripe Checkout session for a $50 refundable deposit.
 * Stores the entire quote in metadata so the webhook (in
 * /api/webhooks/stripe-store) can:
 *   - upsert the CRM contact
 *   - tag with `deposit-paid`, `order-pending`, plus per-service tags
 *   - stamp customFields with quote details
 *   - send the thank-you with kickoff booking link
 *
 * Always one-time mode (deposit is a single $50 charge).
 */

import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { SERVICES, formatUsd } from '@/lib/order/services-catalog'
import { calculateQuote } from '@/lib/order/order-store'
import type { SelectedService, OrderContact } from '@/lib/order/order-store'

export const runtime = 'nodejs'

const DEPOSIT_CENTS = 5000

interface Body {
  selected: SelectedService[]
  contact: OrderContact
  aiSummary?: string
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as Body
    const selected = body.selected || []
    const contact = body.contact

    if (!contact?.email || !contact?.name) {
      return NextResponse.json(
        { error: 'Name and email are required' },
        { status: 400 },
      )
    }
    if (selected.length === 0) {
      return NextResponse.json(
        { error: 'No services selected' },
        { status: 400 },
      )
    }

    const quote = calculateQuote(selected)

    // Generate a short order id we can carry through metadata + display.
    const orderId = `ord_${Math.random().toString(36).slice(2, 10)}${Date.now().toString(36)}`

    // Build short list of service slugs + crm tags for the webhook.
    const serviceSlugs = selected.map((s) => s.slug)
    const crmTags = [
      'deposit-paid',
      'order-pending',
      ...serviceSlugs.map((s) => `quote-${s}`),
    ]

    // Slim metadata (Stripe key 50, value 500 char caps).
    const metadata: Record<string, string> = {
      source: 'rocketopp-order-deposit',
      order_id: orderId,
      contact_name: (contact.name || '').slice(0, 100),
      contact_email: (contact.email || '').slice(0, 100),
      contact_company: (contact.company || '').slice(0, 100),
      contact_phone: (contact.phone || '').slice(0, 50),
      contact_industry: (contact.industry || '').slice(0, 80),
      contact_timeline: (contact.timeline || '').slice(0, 30),
      service_slugs: serviceSlugs.join(',').slice(0, 480),
      crm_tags: crmTags.join(',').slice(0, 480),
      quote_one_time_cents: String(quote.oneTimeTotal),
      quote_recurring_cents: String(quote.recurringTotal),
      quote_one_time_label: formatUsd(quote.oneTimeTotal).slice(0, 40),
      quote_recurring_label: formatUsd(quote.recurringTotal).slice(0, 40),
    }

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://rocketopp.com'

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: 'usd',
            unit_amount: DEPOSIT_CENTS,
            product_data: {
              name: 'RocketOpp Project Deposit (refundable)',
              description: `Locks the quote for 30 days and books a kickoff call directly with Mike. Order ${orderId}.`,
              metadata: { order_id: orderId },
            },
          },
        },
      ],
      success_url: `${baseUrl}/order/success?session_id={CHECKOUT_SESSION_ID}&order_id=${orderId}`,
      cancel_url: `${baseUrl}/order?cancelled=1`,
      customer_email: contact.email,
      metadata,
      payment_intent_data: { metadata },
    })

    return NextResponse.json({ url: session.url, order_id: orderId })
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'unknown'
    console.error('[order/deposit] error:', msg)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
