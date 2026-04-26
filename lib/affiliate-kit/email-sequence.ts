/**
 * 3-touch email sequence — warm contact → open scan → tier upgrade. Each
 * email is tight, under 200 words, and ends on a single CTA with the
 * affiliate's referral URL.
 */

export function emailSequence(refUrl: string): { filename: string; body: string } {
  const body = `# 3-Touch Email Sequence — HIPAA Compliance

_Send to a warm contact (existing client, former colleague, or a real
introduction). Do NOT use this as cold outreach — that breaks your
attribution and hurts deliverability._

---

## Email 1 — The soft intro (send at day 0)

**Subject:** HIPAA scan — worth a look

Hey {{firstName}},

Saw something that made me think of you. A team I'm working with built an
automated HIPAA compliance scanner — 51 checks, rule-cited findings, 15-min
delivery. Tier 1 is $149. No sales call, no consultant engagement.

I've run it on a couple of healthcare sites this month and it caught real
stuff — TLS config on a patient portal, missing CSP headers, a session
timeout set to four hours.

If you want to see what your public-facing ePHI surfaces look like to an
auditor, here:

${refUrl}

Run it on whatever domain you want. It's passive (no form submissions,
no credentials, no ePHI touched). If the findings matter, we can talk
through them.

— {{yourName}}

---

## Email 2 — The follow-up (send at day 4 if no reply)

**Subject:** Re: HIPAA scan — worth a look

{{firstName}},

Quick follow-up in case the last note got buried.

Two things worth knowing:

1. The 2026 NPRM is about to finalize. MFA becomes mandatory. Encryption
   at rest becomes mandatory. Biennial pen tests become mandatory. Most
   compliance programs I've seen are not budgeted for this.

2. The scan is evidence of ongoing monitoring — which is the specific
   artifact 45 CFR §164.308(a)(1)(ii)(A) requires in an audit. Even a
   clean scan is a document your OCR binder needs.

15 minutes. $149.

${refUrl}

— {{yourName}}

---

## Email 3 — The value anchor (send at day 10 if still no reply)

**Subject:** One more HIPAA note

{{firstName}},

Last one on this, then I'll drop it.

Median HHS settlement for a HIPAA enforcement action in 2025 was $275,000.
The cost of the baseline report that would have caught the finding is
$149. That's a 1,800x risk transfer ratio.

If you've been meaning to "get a HIPAA review on the calendar" and it
keeps slipping, this is the cheapest possible way to get the artifact
produced and stop carrying the whole risk yourself.

${refUrl}

If it's not a fit, totally understood — no more emails from me on this.

— {{yourName}}

---

## Operating notes

- **Send from a real inbox.** This sequence is written for a 1:1 relationship,
  not a blast. Marketing automation tools will flag it as unsubscribable.
- **Personalize {{firstName}} and {{yourName}}** before sending. Mail-merge
  is fine, fake familiarity is not.
- **Use the referral URL verbatim.** The ref cookie is 60 days — any paid
  tier your contact buys in that window is attributed to you, even if
  they click through a different channel later.
- **Stop at email 3.** If they haven't replied, they're not the right fit
  right now. Re-engage in 90 days with a different angle (NPRM update,
  new tier launch).
- **Track replies in your partner dashboard.** Once they reply and land
  on the scan, the click logs in your dashboard in real time.

---

_Questions? Reply to your partner dashboard — we'll update the kit as we
learn what converts._
`
  return { filename: 'hipaa-email-sequence-3-touch.md', body }
}
