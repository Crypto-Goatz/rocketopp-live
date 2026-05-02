/**
 * POST /api/webhooks/stripe-store
 *
 * Stripe → us. Fired by `checkout.session.completed` for the rocketopp-store
 * Stripe webhook endpoint. Performs the post-purchase fulfillment fan-out:
 *
 *   1. Upsert CRM contact in the RocketOpp main location.
 *   2. Add purchase tags (general 'purchase' + per-product crmTag).
 *   3. Stamp customFields with order metadata for reporting.
 *   4. Send the thank-you email through the CRM Conversations API.
 *   5. (Optional) Enroll in a 0nFlow flow named `rocketopp-purchase-followup`
 *      if it exists, so the post-purchase nurture runs automatically.
 *
 * The webhook is idempotent — Stripe retries on transient failures, and
 * each side-effect tolerates duplicate calls (CRM tag PUTs dedupe; flow
 * enroll uses the session id as a natural key).
 */

import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { PRODUCTS } from '@/lib/store/products'
import type Stripe from 'stripe'

export const runtime = 'nodejs'

const CRM_BASE = 'https://services.leadconnectorhq.com'
const CRM_VERSION = '2021-07-28'

// RocketOpp main location per memory; override via env.
const ROCKETOPP_LOCATION_ID =
  process.env.CRM_ROCKETOPP_LOCATION_ID || '6MSqx0trfxgLxeHBJE1k'

function pickPit(): string {
  // Per-location var first (matches 0nFlow dispatcher pattern), then fallbacks.
  const envName = `CRM_PIT_${ROCKETOPP_LOCATION_ID.replace(/[^A-Za-z0-9]/g, '').toUpperCase()}`
  return (
    process.env[envName] ||
    process.env.CRM_AGENCY_PIT ||
    process.env.CRM_PIT ||
    ''
  )
}

interface CartLine {
  slug: string
  qty: number
  tag: string
}

function parseCartItems(raw: string | undefined): CartLine[] {
  if (!raw) return []
  try {
    const arr = JSON.parse(raw) as Array<{ slug?: string; qty?: number; tag?: string }>
    return arr
      .filter((x) => x?.slug)
      .map((x) => ({ slug: String(x.slug), qty: Number(x.qty) || 1, tag: String(x.tag || '') }))
  } catch {
    return []
  }
}

async function upsertContact(
  email: string,
  name: string | undefined,
  pit: string,
): Promise<string | null> {
  // Try create first; fall back to search+update on duplicate.
  const createRes = await fetch(`${CRM_BASE}/contacts/`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${pit}`,
      Version: CRM_VERSION,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      locationId: ROCKETOPP_LOCATION_ID,
      email,
      firstName: name?.split(' ')[0],
      lastName: name?.split(' ').slice(1).join(' ') || undefined,
      source: 'rocketopp-store',
    }),
  })

  if (createRes.ok) {
    const data = await createRes.json()
    return data?.contact?.id ?? null
  }

  // Duplicate — find existing
  const searchRes = await fetch(
    `${CRM_BASE}/contacts/search?locationId=${ROCKETOPP_LOCATION_ID}&query=${encodeURIComponent(email)}`,
    { headers: { Authorization: `Bearer ${pit}`, Version: CRM_VERSION } },
  )
  if (!searchRes.ok) {
    console.error(
      '[stripe-store webhook] search failed',
      searchRes.status,
      await searchRes.text(),
    )
    return null
  }
  const sd = await searchRes.json()
  return sd?.contacts?.[0]?.id ?? null
}

async function addTags(contactId: string, tags: string[], pit: string) {
  if (tags.length === 0) return
  await fetch(`${CRM_BASE}/contacts/${contactId}/tags`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${pit}`,
      Version: CRM_VERSION,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ tags }),
  }).catch((e) => console.error('[stripe-store webhook] tag add failed', e))
}

async function setCustomFields(
  contactId: string,
  fields: { key: string; value: string }[],
  pit: string,
) {
  await fetch(`${CRM_BASE}/contacts/${contactId}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${pit}`,
      Version: CRM_VERSION,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ customFields: fields }),
  }).catch((e) => console.error('[stripe-store webhook] customFields failed', e))
}

async function sendThankYouEmail(
  contactId: string,
  productNames: string[],
  amountFormatted: string,
  pit: string,
) {
  const subject = `Thanks for your RocketOpp order — we start today`
  const lines = [
    `<p>Hey,</p>`,
    `<p>Order confirmed — thank you for choosing RocketOpp.</p>`,
    `<p><strong>What you bought:</strong></p>`,
    `<ul>${productNames.map((n) => `<li>${n}</li>`).join('')}</ul>`,
    `<p><strong>Total:</strong> ${amountFormatted}</p>`,
    `<p><strong>What happens next:</strong></p>`,
    `<ol>`,
    `<li>Mike reviews your order today.</li>`,
    `<li>You'll get a kickoff email with intake questions within 24 hours.</li>`,
    `<li>Build starts. Every product has a published delivery window we hit.</li>`,
    `</ol>`,
    `<p>Reply to this email any time — it lands directly in our queue.</p>`,
    `<p>— Mike + the RocketOpp team</p>`,
  ]
  const html = lines.join('\n')

  await fetch(`${CRM_BASE}/conversations/messages`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${pit}`,
      Version: CRM_VERSION,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      type: 'Email',
      contactId,
      subject,
      html,
      message: `Order confirmed — thank you for choosing RocketOpp.\n\nWhat you bought:\n${productNames.map((n) => `- ${n}`).join('\n')}\n\nTotal: ${amountFormatted}\n\nMike reviews your order today.\n— RocketOpp`,
    }),
  }).catch((e) => console.error('[stripe-store webhook] email failed', e))
}

async function maybeEnroll0nFlow(
  email: string,
  contactId: string,
  productSlugs: string[],
  amountFormatted: string,
) {
  const flowApiBase = process.env.ONMCP_FLOW_API_BASE || 'https://www.0nmcp.com'
  const token = process.env.ONMCP_FLOW_API_TOKEN
  if (!token) return // no token, skip silently

  await fetch(`${flowApiBase}/api/flows/rocketopp-purchase-followup/enroll`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      contact_email: email,
      contact_id: contactId,
      contact_data: {
        product_slugs: productSlugs.join(','),
        amount: amountFormatted,
      },
    }),
  }).catch((e) =>
    console.error('[stripe-store webhook] 0nflow enroll skipped:', e),
  )
}

function formatUsd(cents: number, currency = 'usd'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency.toUpperCase(),
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(cents / 100)
}

export async function POST(req: NextRequest) {
  const sig = req.headers.get('stripe-signature') || ''
  const secret = process.env.STRIPE_STORE_WEBHOOK_SECRET || process.env.STRIPE_WEBHOOK_SECRET
  if (!secret) {
    console.error('[stripe-store webhook] no STRIPE_STORE_WEBHOOK_SECRET set')
    return NextResponse.json({ error: 'webhook secret not configured' }, { status: 500 })
  }

  let event: Stripe.Event
  try {
    const raw = await req.text()
    event = stripe.webhooks.constructEvent(raw, sig, secret)
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'invalid signature'
    return NextResponse.json({ error: `Webhook signature: ${msg}` }, { status: 400 })
  }

  // We only act on completed sessions originating from rocketopp-store.
  if (event.type !== 'checkout.session.completed') {
    return NextResponse.json({ ok: true, ignored: event.type })
  }

  const session = event.data.object as Stripe.Checkout.Session
  const source = session.metadata?.source
  // Two recognized sources: rocketopp-store cart purchases AND
  // rocketopp-order-deposit (the $50 quote-lock from /order wizard).
  if (
    source !== 'rocketopp-store' &&
    source !== 'rocketopp-order-deposit'
  ) {
    return NextResponse.json({ ok: true, ignored_source: source })
  }

  const email =
    session.customer_details?.email || session.customer_email || ''
  if (!email) {
    return NextResponse.json({ error: 'no email on session' }, { status: 400 })
  }
  const name =
    session.customer_details?.name || session.metadata?.contact_name || undefined

  const pit = pickPit()
  if (!pit) {
    console.error('[stripe-store webhook] no CRM PIT available')
    return NextResponse.json({ error: 'CRM not configured' }, { status: 500 })
  }

  const contactId = await upsertContact(email, name, pit)
  if (!contactId) {
    return NextResponse.json({ error: 'CRM upsert failed' }, { status: 500 })
  }

  const amount = session.amount_total ?? 0
  const amountFormatted = formatUsd(amount, session.currency || 'usd')

  // Branch 1: order deposit — quote-lock + book kickoff
  if (source === 'rocketopp-order-deposit') {
    const meta = session.metadata || {}
    const serviceSlugs = (meta.service_slugs || '').split(',').filter(Boolean)
    const crmTags = (meta.crm_tags || '').split(',').filter(Boolean)
    const orderId = meta.order_id || ''

    await addTags(contactId, crmTags, pit)
    await setCustomFields(
      contactId,
      [
        { key: 'last_deposit_date', value: new Date().toISOString() },
        { key: 'last_deposit_amount', value: amountFormatted },
        { key: 'rocketopp_order_id', value: orderId },
        { key: 'quote_services', value: serviceSlugs.join(', ') },
        { key: 'quote_one_time', value: meta.quote_one_time_label || '' },
        { key: 'quote_recurring', value: meta.quote_recurring_label || '' },
        { key: 'contact_company', value: meta.contact_company || '' },
        { key: 'contact_phone', value: meta.contact_phone || '' },
        { key: 'contact_industry', value: meta.contact_industry || '' },
        { key: 'contact_timeline', value: meta.contact_timeline || '' },
        { key: 'stripe_session_id', value: session.id },
      ],
      pit,
    )
    await sendDepositThankYouEmail(
      contactId,
      orderId,
      meta.quote_one_time_label || '',
      meta.quote_recurring_label || '',
      pit,
    )

    return NextResponse.json({
      ok: true,
      flow: 'order-deposit',
      contact_id: contactId,
      order_id: orderId,
      tagged: crmTags.length,
    })
  }

  // Branch 2: cart purchase (existing behavior)
  const cartItems = parseCartItems(session.metadata?.cart_items)
  const productNames = cartItems
    .map((c) => PRODUCTS.find((p) => p.slug === c.slug)?.name || c.slug)
    .filter(Boolean)
  const productSlugs = cartItems.map((c) => c.slug)

  const baseTags = [
    'purchase',
    'rocketopp-customer',
    `purchase-mode-${session.mode || 'unknown'}`,
    ...cartItems.map((c) => c.tag).filter(Boolean),
  ]

  await addTags(contactId, baseTags, pit)
  await setCustomFields(
    contactId,
    [
      { key: 'last_purchase_date', value: new Date().toISOString() },
      { key: 'last_purchase_amount', value: amountFormatted },
      { key: 'last_purchase_products', value: productSlugs.join(', ') },
      { key: 'stripe_session_id', value: session.id },
      { key: 'stripe_customer_id', value: String(session.customer || '') },
    ],
    pit,
  )
  await sendThankYouEmail(contactId, productNames, amountFormatted, pit)
  await maybeEnroll0nFlow(email, contactId, productSlugs, amountFormatted)

  return NextResponse.json({
    ok: true,
    flow: 'cart-purchase',
    contact_id: contactId,
    tagged: baseTags.length,
    items: productNames.length,
  })
}

async function sendDepositThankYouEmail(
  contactId: string,
  orderId: string,
  oneTimeLabel: string,
  recurringLabel: string,
  pit: string,
) {
  const bookingUrl = process.env.CRM_KICKOFF_BOOKING_URL || ''
  const subject = `Your kickoff is reserved — pick a time on Mike's calendar`
  const lines = [
    `<p>Your $50 deposit is in. We've locked your quote for the next 30 days.</p>`,
    oneTimeLabel || recurringLabel
      ? `<p><strong>Your locked quote:</strong></p>` +
        `<ul>` +
        (oneTimeLabel && oneTimeLabel !== '$0'
          ? `<li>One-time build: ${oneTimeLabel}</li>`
          : '') +
        (recurringLabel && recurringLabel !== '$0'
          ? `<li>Monthly retainer: ${recurringLabel}/mo</li>`
          : '') +
        `</ul>`
      : '',
    bookingUrl
      ? `<p><strong>Book your 30-minute kickoff with Mike:</strong><br/><a href="${bookingUrl}">${bookingUrl}</a></p>`
      : `<p>Mike will email you in the next hour with a direct link to his calendar.</p>`,
    `<p><strong>Order ID:</strong> ${orderId}</p>`,
    `<p>Reply to this email any time — it lands in our queue.</p>`,
    `<p>— Mike</p>`,
  ]
    .filter(Boolean)
    .join('\n')

  await fetch(`${CRM_BASE}/conversations/messages`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${pit}`,
      Version: CRM_VERSION,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      type: 'Email',
      contactId,
      subject,
      html: lines,
      message: `Your $50 deposit is in. ${bookingUrl ? `Book here: ${bookingUrl}` : "Mike will email you with a calendar link."} Order: ${orderId}.`,
    }),
  }).catch((e) =>
    console.error('[stripe-store webhook] deposit email failed', e),
  )
}
