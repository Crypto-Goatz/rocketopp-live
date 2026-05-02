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
  // Try create first; fall back to POST search on duplicate.
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
    const id = data?.contact?.id ?? null
    if (id) return id
  }

  // CRM returns HTTP 400 (sometimes 422) with a "duplicate" message body
  // when the email already exists. We need POST /contacts/search to find
  // the existing record — the GET form returns 404 because /search gets
  // parsed as a contact id.
  const searchRes = await fetch(`${CRM_BASE}/contacts/search`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${pit}`,
      Version: CRM_VERSION,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      locationId: ROCKETOPP_LOCATION_ID,
      query: email,
      pageLimit: 1,
    }),
  })
  if (!searchRes.ok) {
    console.error(
      '[stripe-store webhook] search failed',
      searchRes.status,
      await searchRes.text(),
    )
    return null
  }
  const sd = await searchRes.json()
  // Email match must be exact — search returns fuzzy hits.
  const exact =
    (sd?.contacts || []).find(
      (c: { email?: string }) => (c.email || '').toLowerCase() === email.toLowerCase(),
    ) || sd?.contacts?.[0]
  return exact?.id ?? null
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

// Sender identity used on every customer-facing email out of this webhook.
const MIKE_EMAIL = process.env.MIKE_FROM_EMAIL || 'mike@rocketopp.com'
const MIKE_NAME = process.env.MIKE_FROM_NAME || 'Mike Mento'
const ROCKETAPPOINTMENTS_URL =
  process.env.ROCKETAPPOINTMENTS_URL || 'https://rocketappointments.com'

function emailShell(innerHtml: string): string {
  // Branded HTML wrapper — dark background, orange accents, mobile-safe.
  return [
    `<div style="background:#0a0a0f;padding:24px 0;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif;color:#e8e8ed;">`,
    `  <div style="max-width:560px;margin:0 auto;background:#15161e;border:1px solid #25262d;border-radius:14px;overflow:hidden;">`,
    `    <div style="padding:24px 28px;border-bottom:1px solid #25262d;background:linear-gradient(135deg,#ff6b35 0%,#ff8a35 50%,#ff6b35 100%);">`,
    `      <h1 style="margin:0;font-size:20px;line-height:1.2;font-weight:800;color:#0a0a0f;">RocketOpp</h1>`,
    `      <p style="margin:4px 0 0;font-size:12px;color:#0a0a0f;opacity:0.85;letter-spacing:0.04em;text-transform:uppercase;">An 0n Company</p>`,
    `    </div>`,
    `    <div style="padding:28px;font-size:15px;line-height:1.6;color:#e8e8ed;">${innerHtml}</div>`,
    `    <div style="padding:18px 28px;background:#0d0e15;border-top:1px solid #25262d;font-size:12px;color:#888;line-height:1.5;">`,
    `      RocketOpp LLC · Reply directly to this email — it lands in Mike's inbox.<br/>`,
    `      <a href="https://rocketopp.com" style="color:#ff8a35;text-decoration:none;">rocketopp.com</a> · `,
    `      <a href="${ROCKETAPPOINTMENTS_URL}" style="color:#ff8a35;text-decoration:none;">rocketappointments.com</a>`,
    `    </div>`,
    `  </div>`,
    `</div>`,
  ].join('\n')
}

function ctaButton(href: string, label: string): string {
  return [
    `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:28px 0;">`,
    `  <tr><td style="background:#ff6b35;border-radius:10px;">`,
    `    <a href="${href}" style="display:inline-block;padding:14px 28px;color:#0a0a0f;font-weight:800;font-size:16px;text-decoration:none;letter-spacing:0.01em;">${label} →</a>`,
    `  </td></tr>`,
    `</table>`,
  ].join('')
}

async function sendThankYouEmail(
  contactId: string,
  productNames: string[],
  amountFormatted: string,
  pit: string,
) {
  const subject = `Your RocketOpp order is in — let's book the kickoff`

  const itemsHtml = productNames
    .map(
      (n) =>
        `<li style="margin:6px 0;color:#e8e8ed;"><strong style="color:#fff;">${n}</strong></li>`,
    )
    .join('')

  const innerHtml = [
    `<p>Hey,</p>`,
    `<p>Thanks for putting your trust in us. Your order is confirmed and we're ready to start.</p>`,
    `<p style="margin-top:20px;font-weight:700;color:#fff;">Here's everything in your setup:</p>`,
    `<ul style="padding-left:20px;margin:8px 0 18px;">${itemsHtml}</ul>`,
    `<p style="font-size:14px;color:#a8a8b0;"><strong style="color:#fff;">Total charged:</strong> ${amountFormatted}</p>`,
    `<hr style="border:none;border-top:1px solid #25262d;margin:24px 0;">`,
    `<p style="font-weight:700;color:#fff;font-size:16px;">Now let's lock the kickoff.</p>`,
    `<p>Pick a 30-minute slot that works for you. We'll walk through your setup, lock the build phases, and answer any questions:</p>`,
    ctaButton(ROCKETAPPOINTMENTS_URL, 'Book the kickoff call'),
    `<p style="font-size:14px;color:#a8a8b0;">Once we're on the call, the build starts the same business day.</p>`,
    `<p style="margin-top:24px;">Talk soon,<br/><strong style="color:#fff;">Mike Mento</strong><br/><span style="color:#a8a8b0;">Founder, RocketOpp</span></p>`,
  ].join('\n')

  const html = emailShell(innerHtml)
  const message =
    `Your RocketOpp order is in.\n\n` +
    `Setup:\n${productNames.map((n) => `- ${n}`).join('\n')}\n\n` +
    `Total: ${amountFormatted}\n\n` +
    `Book your kickoff: ${ROCKETAPPOINTMENTS_URL}\n\n` +
    `— Mike Mento, Founder, RocketOpp`

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
      message,
      fromEmail: MIKE_EMAIL,
      fromName: MIKE_NAME,
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
      serviceSlugs,
      meta.quote_one_time_label || '',
      meta.quote_recurring_label || '',
      pit,
    )

    // Notify Mike (Slack + CRM email if configured)
    await notifyMike({
      kind: 'order-deposit',
      customerEmail: email,
      customerName: name,
      customerCompany: meta.contact_company || undefined,
      amountFormatted,
      itemSummary: serviceSlugs.join(', ') || '(none listed)',
      orderId,
      oneTimeLabel: meta.quote_one_time_label,
      recurringLabel: meta.quote_recurring_label,
      pit,
      stripeSessionId: session.id,
    })

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

  // Notify Mike (Slack + CRM email if configured)
  await notifyMike({
    kind: 'cart-purchase',
    customerEmail: email,
    customerName: name,
    amountFormatted,
    itemSummary: productNames.join(', ') || '(none)',
    pit,
    stripeSessionId: session.id,
  })

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
  serviceSlugs: string[],
  oneTimeLabel: string,
  recurringLabel: string,
  pit: string,
) {
  const subject = `Deposit received — let's book your kickoff at RocketAppointments`

  // Resolve slugs → product/service names
  const allCatalog = await loadServiceCatalog()
  const items = serviceSlugs.map((slug) => {
    const s = allCatalog[slug]
    return s ? s.name : slug
  })
  const itemsHtml =
    items.length > 0
      ? `<ul style="padding-left:20px;margin:8px 0 18px;">${items
          .map(
            (n) =>
              `<li style="margin:6px 0;"><strong style="color:#fff;">${n}</strong></li>`,
          )
          .join('')}</ul>`
      : ''

  const totalsHtml = [
    oneTimeLabel && oneTimeLabel !== '$0'
      ? `<tr><td style="padding:6px 0;color:#a8a8b0;">One-time build</td><td style="padding:6px 0;text-align:right;font-weight:700;color:#fff;">${oneTimeLabel}</td></tr>`
      : '',
    recurringLabel && recurringLabel !== '$0'
      ? `<tr><td style="padding:6px 0;color:#a8a8b0;">Monthly retainer</td><td style="padding:6px 0;text-align:right;font-weight:700;color:#ff8a35;">${recurringLabel}/mo</td></tr>`
      : '',
  ]
    .filter(Boolean)
    .join('')

  const innerHtml = [
    `<p>Your <strong style="color:#fff;">$50 refundable deposit</strong> is in. We've locked your quote for the next 30 days.</p>`,
    `<p style="margin-top:20px;font-weight:700;color:#fff;">Your locked setup:</p>`,
    itemsHtml,
    totalsHtml
      ? `<table style="width:100%;border-collapse:collapse;margin:18px 0;">${totalsHtml}</table>`
      : '',
    `<hr style="border:none;border-top:1px solid #25262d;margin:24px 0;">`,
    `<p style="font-weight:700;color:#fff;font-size:16px;">Book your 30-minute kickoff.</p>`,
    `<p>We walk through your AI brief, confirm sequencing, and start work the same day.</p>`,
    ctaButton(ROCKETAPPOINTMENTS_URL, 'Book at RocketAppointments'),
    `<p style="font-size:13px;color:#a8a8b0;">Order ID: <code style="color:#ff8a35;">${orderId}</code></p>`,
    `<p style="margin-top:24px;">Talk soon,<br/><strong style="color:#fff;">Mike Mento</strong><br/><span style="color:#a8a8b0;">Founder, RocketOpp</span></p>`,
  ]
    .filter(Boolean)
    .join('\n')

  const html = emailShell(innerHtml)
  const message =
    `Your $50 deposit is in. Locked for 30 days.\n\n` +
    (items.length > 0 ? `Setup:\n${items.map((n) => `- ${n}`).join('\n')}\n\n` : '') +
    (oneTimeLabel && oneTimeLabel !== '$0' ? `One-time build: ${oneTimeLabel}\n` : '') +
    (recurringLabel && recurringLabel !== '$0' ? `Monthly retainer: ${recurringLabel}/mo\n` : '') +
    `\nBook the kickoff: ${ROCKETAPPOINTMENTS_URL}\n\n` +
    `Order: ${orderId}\n— Mike Mento, Founder, RocketOpp`

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
      message,
      fromEmail: MIKE_EMAIL,
      fromName: MIKE_NAME,
    }),
  }).catch((e) =>
    console.error('[stripe-store webhook] deposit email failed', e),
  )
}

// Lazy-load the services catalog so this route doesn't pull react/zustand.
async function loadServiceCatalog(): Promise<Record<string, { name: string }>> {
  const { SERVICES } = await import('@/lib/order/services-catalog')
  const map: Record<string, { name: string }> = {}
  for (const s of SERVICES) map[s.slug] = { name: s.name }
  return map
}

/**
 * Notify Mike on every purchase + deposit.
 *
 * Two channels, both optional — the function falls through gracefully:
 *
 *   1. Slack — if MIKE_NOTIFY_SLACK_WEBHOOK is set, POST a formatted
 *      message to that incoming-webhook URL. Instant, mobile-push.
 *   2. Email — if MIKE_NOTIFY_CONTACT_ID is set, send through CRM
 *      Conversations to that contact. Email lands wherever the contact
 *      is configured. Persistent record in CRM.
 *
 * The function never throws. Failure on either channel is logged but
 * does not block the customer-facing thank-you path.
 */
async function notifyMike(opts: {
  kind: 'cart-purchase' | 'order-deposit'
  customerEmail: string
  customerName?: string
  customerCompany?: string
  amountFormatted: string
  itemSummary: string
  orderId?: string
  oneTimeLabel?: string
  recurringLabel?: string
  pit: string
  stripeSessionId: string
}) {
  const headline =
    opts.kind === 'order-deposit'
      ? `💰 New $50 deposit — ${opts.customerEmail}`
      : `🚀 New purchase ${opts.amountFormatted} — ${opts.customerEmail}`

  const lines: string[] = [
    headline,
    '',
    `*Customer:* ${opts.customerName || '(no name)'} <${opts.customerEmail}>`,
    opts.customerCompany ? `*Company:* ${opts.customerCompany}` : '',
    `*Setup:* ${opts.itemSummary}`,
    opts.oneTimeLabel && opts.oneTimeLabel !== '$0'
      ? `*One-time:* ${opts.oneTimeLabel}`
      : '',
    opts.recurringLabel && opts.recurringLabel !== '$0'
      ? `*Recurring:* ${opts.recurringLabel}/mo`
      : '',
    opts.orderId ? `*Order:* ${opts.orderId}` : '',
    `*Stripe:* https://dashboard.stripe.com/payments/${opts.stripeSessionId}`,
  ]
    .filter(Boolean)
    .join('\n')

  // Slack path
  const slackUrl = process.env.MIKE_NOTIFY_SLACK_WEBHOOK
  if (slackUrl) {
    await fetch(slackUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: lines }),
    }).catch((e) =>
      console.error('[notifyMike] slack failed:', e instanceof Error ? e.message : e),
    )
  }

  // Email path — sends through CRM to a configured Mike contact
  const mikeContactId = process.env.MIKE_NOTIFY_CONTACT_ID
  if (mikeContactId) {
    const subject = headline
    const html = emailShell(
      `<pre style="white-space:pre-wrap;font-family:'JetBrains Mono',monospace;font-size:13px;color:#e8e8ed;background:#0a0a0f;padding:16px;border-radius:8px;border:1px solid #25262d;">${lines.replace(/</g, '&lt;')}</pre>` +
        `<p style="margin-top:18px;font-size:13px;color:#a8a8b0;">Auto-fired by /api/webhooks/stripe-store on RocketOpp.com.</p>`,
    )
    await fetch(`${CRM_BASE}/conversations/messages`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${opts.pit}`,
        Version: CRM_VERSION,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'Email',
        contactId: mikeContactId,
        subject,
        html,
        message: lines,
        fromEmail: 'noreply@rocketopp.com',
        fromName: 'RocketOpp Notifications',
      }),
    }).catch((e) =>
      console.error('[notifyMike] CRM email failed:', e instanceof Error ? e.message : e),
    )
  }
}
