import { NextRequest, NextResponse } from 'next/server'

import { offerLaunchEmail, offerPromoEmail, renderTemplate } from '@/lib/crm/email-templates'

/**
 * GET /api/emails/preview?kind=promo|confirmation[&format=source|text][&name=Mike]
 *
 * Renders the $497 offer emails straight from lib/crm/email-templates.ts so what
 * you preview and paste is byte-identical to what the app actually sends — one
 * source of truth, no build step, no separate HTML copy to drift.
 *
 *   ?kind=promo                  the outbound promo ("Claim Your Website")
 *   ?kind=confirmation           the post-application thank-you
 *   ?kind=launch                 the site-is-live final payment (&wordpress=1 for
 *                                the WordPress totals, &site=example.com to name it)
 *   &format=source               HTML as plain text, ready to copy into the CRM
 *   &format=text                 the plain-text part
 *   &name=Mike                   preview with a first name merged in
 *
 * Public because this is marketing copy, not customer data.
 */
export async function GET(req: NextRequest) {
  const kind = (req.nextUrl.searchParams.get('kind') || 'promo').toLowerCase()
  const format = (req.nextUrl.searchParams.get('format') || 'html').toLowerCase()
  const firstName = req.nextUrl.searchParams.get('name') || undefined

  const tpl =
    kind === 'confirmation' || kind === 'thankyou' || kind === 'thank-you'
      ? renderTemplate('website_offer', { firstName })
      : kind === 'launch'
        ? offerLaunchEmail({
            firstName,
            wordpress: req.nextUrl.searchParams.get('wordpress') === '1',
            siteUrl: req.nextUrl.searchParams.get('site') || undefined,
          })
        : offerPromoEmail({ firstName })

  if (format === 'text') {
    return new NextResponse(`Subject: ${tpl.subject}\n\n${tpl.text}\n`, {
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    })
  }

  if (format === 'source') {
    // Plain text so the markup is selectable/copyable rather than rendered.
    return new NextResponse(`<!-- Subject: ${tpl.subject} -->\n${tpl.html}`, {
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    })
  }

  return new NextResponse(tpl.html, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  })
}
