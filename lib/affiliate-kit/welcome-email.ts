/**
 * Affiliate welcome email — branded, with referral link + dashboard CTA +
 * marketing-kit pointers. Sent server-side via the CRM's
 * /conversations/messages endpoint so we don't need a separate ESP key.
 */

interface EmailInput {
  firstName: string
  email: string
  slug: string
  referralUrl: string
  contactId: string | null
  locationId: string
}

const BRAND = '#F97316'
const BG    = '#08090c'
const CARD  = '#0e1014'
const TEXT  = 'rgba(255,255,255,0.92)'
const MUTED = 'rgba(255,255,255,0.6)'

export function buildAffiliateWelcomeHtml({ firstName, slug, referralUrl }: EmailInput): string {
  const portalUrl = 'https://rocketopp.com/dashboard/affiliate'
  const kitNprm   = `https://rocketopp.com/api/hipaa/affiliate/downloads/nprm-onepager?ref=${encodeURIComponent(slug)}`
  const kitTier1  = `https://rocketopp.com/api/hipaa/affiliate/downloads/tier1-explainer?ref=${encodeURIComponent(slug)}`
  const kitLi     = `https://rocketopp.com/api/hipaa/affiliate/downloads/linkedin-posts?ref=${encodeURIComponent(slug)}`
  const kitEmail  = `https://rocketopp.com/api/hipaa/affiliate/downloads/email-sequence?ref=${encodeURIComponent(slug)}`

  return `<!doctype html>
<html><body style="margin:0;padding:0;background:${BG};font-family:'Inter',Arial,sans-serif;color:${TEXT}">
<table width="100%" cellpadding="0" cellspacing="0" style="background:${BG}"><tr><td align="center" style="padding:32px 16px">
  <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;background:${CARD};border-radius:16px;border:1px solid rgba(255,255,255,0.08);overflow:hidden">
    <tr><td style="padding:32px 32px 8px">
      <div style="font-family:monospace;font-size:11px;letter-spacing:.15em;text-transform:uppercase;color:${BRAND};margin-bottom:14px">— RocketOpp · HIPAA Partner</div>
      <h1 style="margin:0 0 12px;font-size:28px;line-height:1.15;font-weight:800;color:#fff">You're in, ${firstName}.</h1>
      <p style="margin:0 0 20px;font-size:15px;line-height:1.55;color:${MUTED}">
        Welcome aboard the HIPAA Partner Program. Your unique referral link is below — anyone who lands on /hipaa with this URL and buys gets tracked to you for 60 days. 30% commission on every paid tier.
      </p>
    </td></tr>
    <tr><td style="padding:0 32px">
      <table width="100%" cellpadding="0" cellspacing="0" style="background:rgba(52,211,153,0.06);border:1px solid rgba(52,211,153,0.30);border-radius:12px">
        <tr><td style="padding:18px 20px">
          <div style="font-family:monospace;font-size:10px;letter-spacing:.18em;text-transform:uppercase;color:#34d399;margin-bottom:6px">— Your referral link</div>
          <div style="font-family:monospace;font-size:14px;color:#fff;word-break:break-all">${referralUrl}</div>
          <div style="font-family:monospace;font-size:11px;color:${MUTED};margin-top:8px">code: <strong style="color:${BRAND}">${slug}</strong></div>
        </td></tr>
      </table>
    </td></tr>
    <tr><td style="padding:24px 32px 8px">
      <a href="${portalUrl}" style="display:inline-block;background:${BRAND};color:#0a0a0a;text-decoration:none;font-weight:700;padding:12px 22px;border-radius:10px;font-size:14px">Open partner dashboard →</a>
    </td></tr>
    <tr><td style="padding:24px 32px 4px">
      <div style="font-family:monospace;font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:${MUTED};margin-bottom:12px">— Marketing kit</div>
      <table width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;line-height:1.5">
        <tr><td style="padding:6px 0"><a href="${kitNprm}" style="color:#fff;text-decoration:none">→ NPRM one-pager (forwardable to a client)</a></td></tr>
        <tr><td style="padding:6px 0"><a href="${kitTier1}" style="color:#fff;text-decoration:none">→ Tier 1 explainer ($149 entry offer)</a></td></tr>
        <tr><td style="padding:6px 0"><a href="${kitLi}" style="color:#fff;text-decoration:none">→ 5 LinkedIn post templates</a></td></tr>
        <tr><td style="padding:6px 0"><a href="${kitEmail}" style="color:#fff;text-decoration:none">→ 3-touch email sequence</a></td></tr>
      </table>
    </td></tr>
    <tr><td style="padding:28px 32px 32px">
      <hr style="border:0;border-top:1px solid rgba(255,255,255,0.08);margin:0 0 20px">
      <div style="font-size:12px;line-height:1.55;color:${MUTED}">
        Commissions clear a 14-day chargeback window then auto-pay on the 1st via ACH or PayPal. Set your payout method anytime in the dashboard. Questions: just reply to this email.
      </div>
    </td></tr>
  </table>
  <div style="margin-top:16px;font-size:11px;color:rgba(255,255,255,0.35)">RocketOpp LLC · HIPAA Partner Program · sent to ${firstName}</div>
</td></tr></table>
</body></html>`
}

export function buildAffiliateWelcomeText({ firstName, slug, referralUrl }: EmailInput): string {
  return `Welcome to the RocketOpp HIPAA Partner Program, ${firstName}.

Your referral link:
  ${referralUrl}

Your code: ${slug}

Anyone who lands on /hipaa with this URL and buys gets tracked to you for 60 days. 30% commission on every paid tier.

Open your partner dashboard:
  https://rocketopp.com/dashboard/affiliate

Marketing kit:
  - NPRM one-pager:    https://rocketopp.com/api/hipaa/affiliate/downloads/nprm-onepager?ref=${slug}
  - Tier 1 explainer:  https://rocketopp.com/api/hipaa/affiliate/downloads/tier1-explainer?ref=${slug}
  - LinkedIn posts:    https://rocketopp.com/api/hipaa/affiliate/downloads/linkedin-posts?ref=${slug}
  - Email sequence:    https://rocketopp.com/api/hipaa/affiliate/downloads/email-sequence?ref=${slug}

Commissions clear a 14-day chargeback window then auto-pay on the 1st via ACH or PayPal.

— RocketOpp`
}

/**
 * Send the welcome email via the CRM. CRM hosts our outbound email
 * pipeline so we don't need a separate ESP token.
 */
export async function sendAffiliateWelcomeEmail(input: EmailInput): Promise<{ ok: boolean; error?: string }> {
  if (!input.contactId) return { ok: false, error: 'no_crm_contact_id' }
  const html = buildAffiliateWelcomeHtml(input)
  const subject = `You're in — your HIPAA Partner referral link`
  const fromEmail = process.env.CRM_FROM_EMAIL || 'noreply@rocketopp.com'

  const url = 'https://services.leadconnectorhq.com/conversations/messages'
  const token = process.env.CRM_PIT_ROCKETOPP || process.env.CRM_PIT || ''
  if (!token) return { ok: false, error: 'no_crm_pit' }

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        Version: '2021-04-15',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type:        'Email',
        contactId:   input.contactId,
        subject,
        html,
        emailFrom:   fromEmail,
        message:     buildAffiliateWelcomeText(input),
      }),
    })
    if (!res.ok) {
      const detail = await res.text().catch(() => '')
      return { ok: false, error: `crm_${res.status}_${detail.slice(0, 120)}` }
    }
    return { ok: true }
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : 'unknown' }
  }
}
