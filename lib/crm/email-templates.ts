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
 * $497 website offer — CONFIRMATION (they just applied).
 *
 * Written specifically for someone who submitted the $497 website application,
 * not a generic "thanks for your enquiry". It confirms what they signed up for in
 * their own terms, states the money plainly, and gives the two actions that move
 * the build forward. Both live on one page so there is a single link.
 */
function tplWebsiteOffer(ctx: TemplateContext): TemplateContent {
  const start = 'https://rocketopp.com/497-website/start'
  const body = `
    <p>${greeting(ctx.firstName)}</p>
    <p>You just applied for the <strong>$497 website</strong> &mdash; the one we design and build for you,
    then hand over so you can edit it yourself. Application received, and you&rsquo;re in.</p>
    <p>Quick recap of exactly what you signed up for, so nothing is a surprise:</p>
    <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;margin:20px 0;border:1px solid ${BORDER};border-radius:10px;background:${BG_SOFT};">
      <tr>
        <td style="padding:16px 20px;">
          <p style="margin:0 0 4px;font-size:13px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:${ORANGE};">What you get</p>
          <p style="margin:0;color:${TEXT};font-size:15px;line-height:1.6;">A complete website &mdash; not a template you fill in. Built on web0n, our own AI platform. Structured so Google <em>and</em> AI search can read it. Contact form wired straight to you. Then it&rsquo;s yours to edit and revise whenever you want, with no change-request fees.</p>
        </td>
      </tr>
      <tr><td style="padding:0 20px;"><div style="height:1px;background:${BORDER};"></div></td></tr>
      <tr>
        <td style="padding:16px 20px;">
          <p style="margin:0 0 4px;font-size:13px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:${ORANGE};">What it costs</p>
          <p style="margin:0;color:${TEXT};font-size:15px;line-height:1.6;"><strong>$247 today</strong> to reserve your build slot and start the work. <strong>$250 when it goes live</strong> and you&rsquo;ve approved it. <strong>$497 total</strong> &mdash; nothing hidden, no subscription.</p>
        </td>
      </tr>
      <tr><td style="padding:0 20px;"><div style="height:1px;background:${BORDER};"></div></td></tr>
      <tr>
        <td style="padding:16px 20px;">
          <p style="margin:0 0 4px;font-size:13px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:${ORANGE};">What happens next</p>
          <p style="margin:0;color:${TEXT};font-size:15px;line-height:1.6;">Pay the deposit and book a 15-minute kickoff &mdash; both on the same page. On the call we go through your services, your pages and your brand. Then I build it.</p>
        </td>
      </tr>
    </table>
    <p style="color:${MUTED};font-size:14px;">Not ready to pay yet? Book the call anyway and we&rsquo;ll confirm the scope first.
    If $497 genuinely won&rsquo;t cover what you need, I&rsquo;ll tell you that before you spend anything &mdash;
    I&rsquo;d rather lose the deposit than surprise you later.</p>
  `
  return {
    subject: 'Your $497 website — you\'re in. Here\'s step one.',
    html: shell({
      preheader: '$247 reserves your build slot, $250 at launch. Deposit + kickoff booking inside.',
      heading: 'Your $497 website is approved',
      bodyHtml: body,
      ctaHref: start,
      ctaLabel: 'Reserve my slot + book kickoff',
    }),
    text: `${greeting(ctx.firstName)}

You just applied for the $497 website - the one we design and build for you, then hand over so you can edit it yourself. Application received, and you're in.

WHAT YOU GET
A complete website, not a template you fill in. Built on web0n, our own AI platform. Structured so Google and AI search can read it. Contact form wired straight to you. Then it's yours to edit and revise whenever you want, with no change-request fees.

WHAT IT COSTS
$247 today to reserve your build slot and start the work. $250 when it goes live and you've approved it. $497 total - nothing hidden, no subscription.

WHAT HAPPENS NEXT
Pay the deposit and book a 15-minute kickoff, both on the same page. On the call we go through your services, your pages and your brand. Then I build it.

Do both here: ${start}

Not ready to pay yet? Book the call anyway and we'll confirm scope first. If $497 genuinely won't cover what you need, I'll tell you that before you spend anything.

- Mike
Founder, RocketOpp
mike@rocketopp.com`,
  }
}

/**
 * $497 website offer — PROMOTIONAL / OUTBOUND.
 *
 * Copy is Mike's, lightly tightened for email. Not a FormKind: nobody submitted
 * anything, so it has to earn attention on the story rather than confirm an action.
 *
 * Why this works and a generic promo does not: it opens by admitting AI does not
 * do what it claims — from a company that builds AI. That is a costly admission,
 * which is exactly why it is believable, and it reframes the $497 as access to a
 * real build programme rather than a discount. The $2,500–$10,000+ anchor is doing
 * the heavy lifting on price; state it before the $497, never after.
 *
 * The Friday deadline is real (lib/offer.ts nextDeadline() closes Friday 23:59:59
 * ET and reopens Monday), so it holds whichever week this sends in.
 */
export function offerPromoEmail(ctx: TemplateContext = {}): TemplateContent {
  const offer = 'https://rocketopp.com/497-website'
  const body = `
    <p>Hi${ctx.firstName ? ' ' + ctx.firstName : ''}, this is Mike with RocketOpp.</p>

    <p>You may know me from LinkedIn, from connecting with one of our apps, or you may
    already be a client. Either way &mdash; I hope I&rsquo;m catching you at a good time.</p>

    <p><strong>Since 2003 &mdash; 23 years &mdash; we&rsquo;ve been building websites. Over 3,500 of them.</strong>
    We&rsquo;ve been through a lot of ups and downs, but this AI craze is something entirely
    different. It&rsquo;s next level. It&rsquo;s opening doors that shouldn&rsquo;t be opened and putting
    half-built technology all over the internet.</p>

    <p>If you don&rsquo;t know this by now: <strong>AI doesn&rsquo;t actually do what it says it&rsquo;s going to
    do.</strong> Especially when it comes to websites and apps.</p>

    <p>So we&rsquo;re here to help fix that problem. There&rsquo;s nothing wrong with AI &mdash; in fact
    it&rsquo;s awesome when it&rsquo;s built correctly. So we went ahead and did that. We built an app
    that will eventually build amazing websites for people&hellip; but not quite yet.</p>

    <p>The truth is, <strong>AI still needs an expert to guide it.</strong> I&rsquo;m saying that after 36
    months of developing this programming. It doesn&rsquo;t matter how much data we give it to
    learn from &mdash; it simply can&rsquo;t beat a human touch.</p>

    <p>So we decided to compromise, for now.</p>

    <p>We&rsquo;re going to guide the AI, fill in the gaps, and help it learn <em>while we build</em>.
    The only way to do that is to actually build thousands of websites &mdash; so rather than
    waste all that time on practice runs, I made the choice to build them for real customers
    instead. The sites come out quicker, and you get a top-tier product.</p>

    <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;margin:22px 0;border:1px solid ${BORDER};border-radius:10px;background:${BG_SOFT};">
      <tr>
        <td style="padding:18px 20px;">
          <p style="margin:0 0 6px;font-size:13px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:${MUTED};">Normally</p>
          <p style="margin:0 0 16px;color:${TEXT};font-size:16px;line-height:1.5;">These AI-built sites run <strong>$2,500 &ndash; $10,000+</strong>, depending on what you decide to build.</p>
          <div style="height:1px;background:${BORDER};margin-bottom:16px;"></div>
          <p style="margin:0 0 6px;font-size:13px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:${ORANGE};">Now through Friday</p>
          <p style="margin:0;color:${TEXT};font-size:22px;font-weight:800;line-height:1.3;">$497 &mdash; complete website, built for you.</p>
        </td>
      </tr>
    </table>

    <p style="color:${MUTED};font-size:14px;">Once it&rsquo;s live it&rsquo;s yours to edit and revise yourself, any time,
    with no change-request fees. E-commerce, memberships and custom apps aren&rsquo;t covered at this price &mdash;
    those we&rsquo;ll quote you honestly. And nothing is charged until we&rsquo;ve confirmed $497 actually covers
    what you need.</p>
  `
  return {
    subject: "23 years, 3,500 websites — and the truth about AI",
    html: shell({
      preheader:
        'AI does not do what it claims. We are guiding it while we build - $497 through Friday.',
      heading: 'A real website. $497. Through Friday.',
      bodyHtml: body,
      ctaHref: offer,
      ctaLabel: 'Claim Your Website',
    }),
    text: `Hi${ctx.firstName ? ' ' + ctx.firstName : ''}, this is Mike with RocketOpp.

You may know me from LinkedIn, from connecting with one of our apps, or you may already be a client. Either way - I hope I'm catching you at a good time.

Since 2003 - 23 years - we've been building websites. Over 3,500 of them. We've been through a lot of ups and downs, but this AI craze is something entirely different. It's next level. It's opening doors that shouldn't be opened and putting half-built technology all over the internet.

If you don't know this by now: AI doesn't actually do what it says it's going to do. Especially when it comes to websites and apps.

So we're here to help fix that problem. There's nothing wrong with AI - in fact it's awesome when it's built correctly. So we went ahead and did that. We built an app that will eventually build amazing websites for people... but not quite yet.

The truth is, AI still needs an expert to guide it. I'm saying that after 36 months of developing this programming. It doesn't matter how much data we give it to learn from - it simply can't beat a human touch.

So we decided to compromise, for now.

We're going to guide the AI, fill in the gaps, and help it learn while we build. The only way to do that is to actually build thousands of websites - so rather than waste all that time on practice runs, I made the choice to build them for real customers instead. The sites come out quicker, and you get a top-tier product.

NORMALLY: these AI-built sites run $2,500 - $10,000+, depending on what you decide to build.

NOW THROUGH FRIDAY: $497 - complete website, built for you.

Claim your website: ${offer}

Once it's live it's yours to edit and revise yourself, any time, with no change-request fees. E-commerce, memberships and custom apps aren't covered at this price - those we'll quote you honestly. And nothing is charged until we've confirmed $497 actually covers what you need.

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
