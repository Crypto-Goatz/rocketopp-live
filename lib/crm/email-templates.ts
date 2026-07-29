// ============================================================
// RocketOpp Email Templates
// ============================================================
// Thank-you / auto-reply emails sent to form submitters.
// Shell is inbox-safe (light bg, inline-styles only, 600px wide).
// ============================================================

export type FormKind =
  | 'contact'
  | 'support'
  | 'general'
  | 'request_app'
  | 'pitch_idea'
  | 'assessment'
  | 'website_offer'

export interface TemplateContent {
  subject: string
  html: string
  text: string
}

export interface TemplateContext {
  firstName?: string
  ticketId?: string | number
}

const ORANGE = '#ff6b35'
const ORANGE_DARK = '#ff3b00'
const TEXT = '#111111'
const MUTED = '#666666'
const BORDER = '#eeeeee'
const BG = '#ffffff'
const BG_SOFT = '#fafafa'

function shell(opts: {
  preheader: string
  heading: string
  bodyHtml: string
  ctaHref?: string
  ctaLabel?: string
  signoff?: string
}) {
  const { preheader, heading, bodyHtml, ctaHref, ctaLabel, signoff = 'Mike' } = opts
  const cta = ctaHref
    ? `<tr><td align="center" style="padding:8px 32px 24px;"><a href="${ctaHref}" style="display:inline-block;background:${ORANGE};color:#ffffff;text-decoration:none;font-weight:600;font-size:15px;padding:13px 28px;border-radius:6px;">${ctaLabel || 'Learn more'}</a></td></tr>`
    : ''

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${heading}</title>
</head>
<body style="margin:0;padding:0;background:${BG_SOFT};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;color:${TEXT};">
<span style="display:none !important;opacity:0;color:transparent;height:0;width:0;max-height:0;max-width:0;overflow:hidden;mso-hide:all;">${preheader}</span>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${BG_SOFT};">
  <tr><td align="center" style="padding:32px 16px;">
    <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:600px;background:${BG};border-radius:12px;overflow:hidden;box-shadow:0 1px 2px rgba(0,0,0,0.04);">
      <tr><td style="background:linear-gradient(135deg,${ORANGE} 0%,${ORANGE_DARK} 100%);padding:36px 32px;color:#ffffff;">
        <div style="font-size:13px;font-weight:600;letter-spacing:0.12em;text-transform:uppercase;opacity:0.9;">RocketOpp</div>
        <div style="font-size:26px;font-weight:700;line-height:1.25;margin-top:8px;">${heading}</div>
      </td></tr>
      <tr><td style="padding:32px 32px 8px;font-size:16px;line-height:1.6;color:${TEXT};">
        ${bodyHtml}
      </td></tr>
      ${cta}
      <tr><td style="padding:24px 32px 32px;font-size:15px;line-height:1.6;color:${TEXT};border-top:1px solid ${BORDER};margin-top:8px;">
        — ${signoff}<br>
        <span style="color:${MUTED};font-size:13px;">Founder, RocketOpp · <a href="mailto:mike@rocketopp.com" style="color:${ORANGE};text-decoration:none;">mike@rocketopp.com</a></span>
      </td></tr>
      <tr><td style="padding:16px 32px 28px;background:${BG_SOFT};color:${MUTED};font-size:12px;line-height:1.6;text-align:center;">
        RocketOpp · Ship AI apps that actually work<br>
        <a href="https://rocketopp.com" style="color:${MUTED};text-decoration:underline;">rocketopp.com</a>
        · <a href="https://rocketopp.com/contact" style="color:${MUTED};text-decoration:underline;">Contact</a>
      </td></tr>
    </table>
  </td></tr>
</table>
</body>
</html>`
}

function greeting(firstName?: string): string {
  return firstName ? `Hey ${firstName},` : 'Hey there,'
}

// ------------------------------------------------------------
// Templates
// ------------------------------------------------------------

function tplContact(ctx: TemplateContext): TemplateContent {
  const body = `
    <p>${greeting(ctx.firstName)}</p>
    <p>Thanks for reaching out — your message landed with me directly, and I'll be the one replying.</p>
    <p>Most people hear back <strong>within 24 hours</strong> (business days). If it's urgent, just reply to this email and I'll bump it to the top.</p>
    <p>While you're waiting, here's a quick read on how we work and what you can expect:</p>
  `
  return {
    subject: 'Got your note — I\'ll reply within 24 hours',
    html: shell({
      preheader: 'Your message reached Mike. A real reply is coming within 24 hours.',
      heading: 'Thanks — message received',
      bodyHtml: body,
      ctaHref: 'https://rocketopp.com/about',
      ctaLabel: 'How we work',
    }),
    text: `${greeting(ctx.firstName)}\n\nThanks for reaching out — your message landed with me directly.\n\nMost people hear back within 24 hours (business days). If it's urgent, just reply to this email.\n\nHow we work: https://rocketopp.com/about\n\n— Mike\nFounder, RocketOpp\nmike@rocketopp.com`,
  }
}

function tplSupport(ctx: TemplateContext): TemplateContent {
  const ticketLine = ctx.ticketId
    ? `Your ticket ID is <strong>#${ctx.ticketId}</strong> — reference it in any follow-up.`
    : `I'll track your ticket from my side and follow up directly.`
  const body = `
    <p>${greeting(ctx.firstName)}</p>
    <p>Support ticket received. ${ticketLine}</p>
    <p>For anything blocking your day-to-day, expect a first response <strong>within 2 business hours</strong>. For general questions, within 24 hours.</p>
    <p>If the situation changes or something else breaks, just reply to this email — it keeps everything on one thread.</p>
  `
  return {
    subject: ctx.ticketId ? `Support ticket #${ctx.ticketId} received` : 'Support ticket received',
    html: shell({
      preheader: 'Your ticket is in. First response within 2 business hours on urgent items.',
      heading: 'We\'ve got your ticket',
      bodyHtml: body,
      ctaHref: 'https://rocketopp.com/support',
      ctaLabel: 'View support center',
    }),
    text: `${greeting(ctx.firstName)}\n\nSupport ticket received${ctx.ticketId ? ` (#${ctx.ticketId})` : ''}.\n\nUrgent: first response within 2 business hours.\nGeneral: within 24 hours.\n\nReply to this email for updates.\n\n— RocketOpp Support`,
  }
}

function tplGeneral(ctx: TemplateContext): TemplateContent {
  const body = `
    <p>${greeting(ctx.firstName)}</p>
    <p>Appreciate you taking the time to reach out. I got your note and I'll personally follow up shortly.</p>
    <p>If you came here looking for:</p>
    <ul style="padding-left:20px;margin:12px 0;">
      <li><strong>A custom app built for you</strong> — I'll send a short intake form</li>
      <li><strong>An AI assessment of your market</strong> — <a href="https://rocketopp.com/ai-assessment" style="color:${ORANGE};text-decoration:none;font-weight:600;">start it here</a></li>
      <li><strong>To pitch an idea</strong> — <a href="https://rocketopp.com/pitch-idea" style="color:${ORANGE};text-decoration:none;font-weight:600;">share the details</a></li>
    </ul>
    <p>Otherwise, reply to this email and tell me what's on your mind.</p>
  `
  return {
    subject: 'Got your note',
    html: shell({
      preheader: 'Personal follow-up coming shortly.',
      heading: 'Thanks for reaching out',
      bodyHtml: body,
    }),
    text: `${greeting(ctx.firstName)}\n\nGot your note. Personal follow-up coming shortly.\n\nCustom app: reply and I'll send an intake form\nAI assessment: https://rocketopp.com/ai-assessment\nPitch an idea: https://rocketopp.com/pitch-idea\n\n— Mike`,
  }
}

function tplRequestApp(ctx: TemplateContext): TemplateContent {
  const body = `
    <p>${greeting(ctx.firstName)}</p>
    <p>Your app request is in, and I've already started reviewing it.</p>
    <p><strong>Here's exactly what happens next:</strong></p>
    <ol style="padding-left:20px;margin:12px 0;line-height:1.9;">
      <li>I review your brief end-to-end (today or tomorrow)</li>
      <li>If it's a fit, you get a <strong>scoping call invite</strong> within 48 hours</li>
      <li>From there — fixed-scope proposal, timeline, and a clear path to shipping</li>
    </ol>
    <p>If you forgot to mention something or want to add context, reply to this email. The more specific the better.</p>
  `
  return {
    subject: 'Your app request is in — here\'s what happens next',
    html: shell({
      preheader: 'Review today or tomorrow. Scoping call invite within 48 hours if it fits.',
      heading: 'Your app request is in',
      bodyHtml: body,
      ctaHref: 'https://rocketopp.com/request-app',
      ctaLabel: 'Add more details',
    }),
    text: `${greeting(ctx.firstName)}\n\nYour app request is in, and I've already started reviewing it.\n\nNext steps:\n1. I review your brief end-to-end\n2. Scoping call invite within 48 hours if it's a fit\n3. Fixed-scope proposal, timeline, and a clear path to shipping\n\nReply to add context.\n\n— Mike`,
  }
}

function tplPitchIdea(ctx: TemplateContext): TemplateContent {
  const body = `
    <p>${greeting(ctx.firstName)}</p>
    <p>Your idea landed — and it's safe here. We don't discuss what's in your brief with anyone until an NDA is in place.</p>
    <p><strong>The process from here:</strong></p>
    <ol style="padding-left:20px;margin:12px 0;line-height:1.9;">
      <li><strong>NDA</strong> — you'll get a mutual NDA to sign (auto, no lawyer needed)</li>
      <li><strong>Discovery call</strong> — 30 minutes to understand the vision</li>
      <li><strong>Go / no-go</strong> — within 48-72 hours of the call, with a clear reason either way</li>
    </ol>
    <p>If we move forward, we talk structure — equity, revenue share, co-founder, or fee-for-service. Whatever fits.</p>
    <p>If you have wireframes, research, or a deck, reply to this email and attach them. It speeds things up.</p>
  `
  return {
    subject: 'Got your idea — here\'s the next step',
    html: shell({
      preheader: 'NDA first, discovery call next, go/no-go within 48-72 hours.',
      heading: 'Your idea is in (and safe)',
      bodyHtml: body,
      ctaHref: 'https://rocketopp.com/request-app',
      ctaLabel: 'See how we build',
    }),
    text: `${greeting(ctx.firstName)}\n\nYour idea landed — and it's safe here.\n\nProcess:\n1. NDA (mutual, auto)\n2. Discovery call (30 min)\n3. Go/no-go within 48-72 hours\n\nReply with any wireframes or decks.\n\n— Mike`,
  }
}

function tplAssessment(ctx: TemplateContext): TemplateContent {
  const body = `
    <p>${greeting(ctx.firstName)}</p>
    <p>Your AI Assessment is <strong>queued and running now</strong>. You'll get your personalized competitive blueprint delivered by email within the next <strong>24-48 hours</strong>.</p>
    <p><strong>What's in the blueprint:</strong></p>
    <ul style="padding-left:20px;margin:12px 0;line-height:1.9;">
      <li>A competitive map of your market (who actually ranks, who's losing)</li>
      <li>Your specific strengths and the three gaps most likely to cost you revenue</li>
      <li>The exact moves (in order) that compound fastest</li>
      <li>Where AI can do the heavy lifting — and where it can't</li>
    </ul>
    <p>While you wait: if anything new comes up or you want to add context to the analysis, reply to this email. The more I know, the sharper the output.</p>
  `
  return {
    subject: 'Your AI Assessment is running — blueprint arrives in 24-48 hours',
    html: shell({
      preheader: 'Personalized competitive blueprint delivered in 24-48 hours.',
      heading: 'Your AI Assessment is running',
      bodyHtml: body,
      ctaHref: 'https://rocketopp.com/ai-assessment',
      ctaLabel: 'View assessment status',
    }),
    text: `${greeting(ctx.firstName)}\n\nYour AI Assessment is queued and running.\n\nPersonalized blueprint delivered in 24-48 hours.\n\nIncludes:\n• Competitive map of your market\n• Your strengths + three revenue-costing gaps\n• Exact next moves in order\n• Where AI helps (and where it doesn't)\n\nReply to add context.\n\n— Mike`,
  }
}


/**
 * $497 website offer confirmation.
 *
 * This is the money email. Rather than "we'll be in touch", it gives the two
 * actions that actually move the project forward: pay the $247 deposit to lock
 * the build slot, and book the 15-minute kickoff on the calendar. Both live on
 * one page so there is a single link to click.
 */
function tplWebsiteOffer(ctx: TemplateContext): TemplateContent {
  const start = 'https://rocketopp.com/497-website/start'
  const body = `
    <p>${greeting(ctx.firstName)}</p>
    <p>Got your application for the <strong>$497 website</strong> — you're in. Here's exactly what happens next, and you can do both parts right now.</p>
    <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;margin:22px 0;border:1px solid ${BORDER};border-radius:10px;background:${BG_SOFT};">
      <tr>
        <td style="padding:18px 20px;">
          <p style="margin:0 0 6px;font-size:13px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:${ORANGE};">Step 1 &middot; Lock your build slot</p>
          <p style="margin:0;color:${TEXT};font-size:15px;line-height:1.6;">A <strong>$247 deposit</strong> reserves your slot and starts the build. The remaining <strong>$250</strong> is due when the site goes live — total $497, nothing hidden.</p>
        </td>
      </tr>
      <tr><td style="padding:0 20px;"><div style="height:1px;background:${BORDER};"></div></td></tr>
      <tr>
        <td style="padding:18px 20px;">
          <p style="margin:0 0 6px;font-size:13px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:${ORANGE};">Step 2 &middot; Book your kickoff</p>
          <p style="margin:0;color:${TEXT};font-size:15px;line-height:1.6;">Pick a 15-minute slot on my calendar. We go through your services, your pages and your brand — then I build it.</p>
        </td>
      </tr>
    </table>
    <p>Both are on the same page. Deposit takes a minute, booking takes another.</p>
    <p style="color:${MUTED};font-size:14px;">Not ready to pay yet? Book the call anyway and we'll confirm the scope first — I'd rather tell you $497 won't cover it than take the deposit and surprise you later.</p>
  `
  return {
    subject: 'You\'re in — reserve your $497 build slot',
    html: shell({
      preheader: 'Two steps: $247 deposit to lock your slot, then book your 15-minute kickoff.',
      heading: 'You\'re in — let\'s lock it in',
      bodyHtml: body,
      ctaHref: start,
      ctaLabel: 'Pay deposit + book kickoff',
    }),
    text: `${greeting(ctx.firstName)}

Got your application for the $497 website - you're in.

STEP 1 - Lock your build slot
A $247 deposit reserves your slot and starts the build. The remaining $250 is due when the site goes live. Total $497, nothing hidden.

STEP 2 - Book your kickoff
Pick a 15-minute slot on my calendar. We go through your services, pages and brand, then I build it.

Do both here: ${start}

Not ready to pay yet? Book the call anyway and we'll confirm scope first - I'd rather tell you $497 won't cover it than take the deposit and surprise you later.

- Mike
Founder, RocketOpp
mike@rocketopp.com`,
  }
}

const BUILDERS: Record<FormKind, (ctx: TemplateContext) => TemplateContent> = {
  contact: tplContact,
  support: tplSupport,
  general: tplGeneral,
  website_offer: tplWebsiteOffer,
  request_app: tplRequestApp,
  pitch_idea: tplPitchIdea,
  assessment: tplAssessment,
}

export function renderTemplate(kind: FormKind, ctx: TemplateContext = {}): TemplateContent {
  const builder = BUILDERS[kind] || tplGeneral
  return builder(ctx)
}

// Map the /lib/crm/notify.ts FormSource string onto a FormKind
export function formKindFromSource(source: string | undefined): FormKind {
  if (!source) return 'general'
  const s = source.toLowerCase()
  if (s.includes('497') || s.includes('website-offer') || s.includes('website_offer')) return 'website_offer'
  if (s.includes('assessment')) return 'assessment'
  if (s.includes('support')) return 'support'
  if (s.includes('pitch')) return 'pitch_idea'
  if (s.includes('request-app') || s.includes('request_app')) return 'request_app'
  if (s.includes('contact')) return 'contact'
  return 'general'
}

// Stable slugs for CRM upload
export const CRM_TEMPLATE_SLUGS: Record<FormKind, string> = {
  contact: 'rocketopp-thankyou-contact',
  support: 'rocketopp-thankyou-support',
  general: 'rocketopp-thankyou-general',
  request_app: 'rocketopp-thankyou-request-app',
  pitch_idea: 'rocketopp-thankyou-pitch-idea',
  assessment: 'rocketopp-thankyou-assessment',
  website_offer: 'rocketopp-thankyou-497-offer',
}

export const ALL_KINDS: FormKind[] = [
  'contact',
  'support',
  'general',
  'request_app',
  'pitch_idea',
  'assessment',
  'website_offer',
]
