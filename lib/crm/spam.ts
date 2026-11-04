/**
 * Lightweight, dependency-free spam scoring for lead submissions.
 *
 * WHY HEURISTIC, NOT A CAPTCHA. Every form already funnels through
 * notifyFormSubmission, so one guard there covers all of them without touching
 * ten form components or adding a third-party script that hurts conversion. The
 * signals below come from the actual junk this site received: gmail addresses
 * with many dots (Gmail ignores dots, so it's the same inbox evading dedupe)
 * and names that are a single long random-case string.
 *
 * SCORED, NOT A SINGLE RULE. Any one signal can misfire on a real person, so we
 * add them up and only block at a threshold. A real lead trips at most one; the
 * bots trip several. `reasons` is returned for logging, never shown to the user.
 */

export interface SpamCheckInput {
  email?: string
  firstName?: string
  lastName?: string
  fullName?: string
  message?: string
  /** Honeypot field — if a hidden input is ever filled, it's a bot. */
  honeypot?: string
  /** Vercel BotID said this request is a bot (checkBotId().isBot). Decisive on its own. */
  bot?: boolean
}

export interface SpamVerdict {
  spam: boolean
  score: number
  reasons: string[]
}

const vowelRatio = (s: string): number => {
  const letters = s.replace(/[^a-z]/gi, '')
  if (!letters) return 1
  return (letters.match(/[aeiou]/gi)?.length ?? 0) / letters.length
}

/** A single long token with no spaces and few vowels — random-string junk. */
function looksRandom(token: string): boolean {
  const t = token.trim()
  return /^[A-Za-z0-9]{12,}$/.test(t) && !/\s/.test(t) && vowelRatio(t) < 0.34
}

const SPAM_KEYWORDS =
  /\b(viagra|casino|crypto\s?giveaway|seo\s?service|backlinks?|loan|bitcoin\s?doubl|porn|escort)\b/i

/** A name token that no language produces: a run of 4+ consonants (y counted as a consonant) or almost no vowels.
 *  Measured on the 2026-11-04 bot wave: Jdnsaikp, Ihbkyqkp, Xghrzac, Btxsxfgi, Zjksflxi, Bpxw, Tvzzk, Lbzvsssd, Gyjslqa all trip it. */
function looksGibberish(token: string): boolean {
  const t = token.replace(/[^a-z]/gi, '')
  if (t.length < 4) return false
  return /[^aeiou]{4,}/i.test(t) || vowelRatio(t) < 0.2 || (/[^aeiouy]{3,}/i.test(t) && vowelRatio(t) <= 0.34)
}

export function scoreSpam(input: SpamCheckInput): SpamVerdict {
  const reasons: string[] = []
  let score = 0

  // BotID (Vercel) already classified the request as a bot: decisive, logged as such.
  if (input.bot) {
    score += 3
    reasons.push('BotID flagged the request as a bot')
  }

  // Honeypot: +2, NOT decisive. Measured 2026-10-31: Mike's own real contact
  // form submission was dropped as "honeypot filled" because browser autofill
  // filled the hidden field — the lead was stored but never reached the CRM or
  // his inbox. A bot that fills the trap almost always trips a second signal too.
  if (input.honeypot && input.honeypot.trim() !== '') {
    score += 2
    reasons.push('honeypot filled')
  }

  const email = (input.email || '').trim().toLowerCase()
  const name = (input.fullName || `${input.firstName || ''} ${input.lastName || ''}`).trim()
  const message = input.message || ''

  // Dotted-gmail abuse — real users rarely use 4+ dots.
  const gmail = /@(gmail|googlemail)\.com$/.test(email)
  const localDots = (email.split('@')[0].match(/\./g) || []).length
  if (gmail && localDots >= 4) {
    score += 3
    reasons.push(`gmail local part has ${localDots} dots`)
  }

  // Random-string display name. Only +2 (not enough to block alone) — a real
  // long single-token name with few vowels exists (e.g. "Krishnamurthy") and
  // must not be lost. The bots pair it with a dotted-gmail, so they still clear
  // the threshold; a lone real name does not.
  if (name && !name.includes(' ') && looksRandom(name)) {
    score += 2
    reasons.push('name is a single random-looking token')
  }

  // Two-token name where BOTH tokens are gibberish: decisive (+3). One gibberish token: +1 only —
  // real names carry 4-consonant runs (Schwartz, Krzysztof), so a single token never blocks alone.
  // Measured 2026-11-04: the wave that got through used two random tokens each ("Jdnsaikp Yeafxg",
  // "Pekaceb Ihbkyqkp", "Btxsxfgi Betncor") with harvested real-looking emails, so the dotted-gmail rule never fired.
  const tokens = name.split(/\s+/).filter(Boolean)
  if (tokens.length >= 2) {
    const gib = tokens.filter(looksGibberish).length
    if (gib >= 2) { score += 3; reasons.push('first and last name are both gibberish') }
    else if (gib === 1) { score += 1; reasons.push('one name token looks like gibberish') }
  }

  // NOTE: we deliberately do NOT score the email local part for randomness —
  // real names as local parts ("krishnamurthy") trip it, and in the observed
  // spam it never fired anyway (their locals were short once dots were stripped).
  // The name + dotted-gmail signals catch the bots without that false-positive.

  // Obvious junk keywords in name or message.
  if (SPAM_KEYWORDS.test(name) || SPAM_KEYWORDS.test(message)) {
    score += 3
    reasons.push('spam keyword')
  }

  // A message that is mostly a URL.
  const urls = (message.match(/https?:\/\//gi) || []).length
  if (urls >= 2) {
    score += 2
    reasons.push(`${urls} urls in message`)
  }

  return { spam: score >= 3, score, reasons }
}

export const isLikelySpam = (input: SpamCheckInput): boolean => scoreSpam(input).spam
