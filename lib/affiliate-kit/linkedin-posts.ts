/**
 * 5 LinkedIn post templates — different angles, all end-capped with the
 * affiliate's referral URL. Copy-paste ready. Each post hits different
 * audience pains (compliance officer, MSP, dev lead, CEO, consultant).
 */

export function linkedinPosts(refUrl: string): { filename: string; body: string } {
  const body = `# LinkedIn Post Templates — HIPAA Compliance Scanner

_Copy-paste ready. Post cadence: one per week for five weeks keeps the
program top-of-mind without sounding like a pitch loop._

---

## Post 1 — The "I just ran one" hook (best first post)

Ran a HIPAA scan on a client's patient portal this morning.

51 automated checks. 15 minutes. $149.

The report came back with 14 findings — every one cited to a specific 45
CFR §164 section, with a plain-English explanation my client's in-house
team could act on that afternoon.

For context: the average HHS breach settlement in 2025 was $275,000. The
Security Rule gets rewritten every quarter in enforcement actions, not in
the text.

If you run a healthcare practice, a covered entity, or you're a business
associate touching ePHI — there's no excuse to not have one of these in
the OCR binder.

${refUrl}

---

## Post 2 — The NPRM urgency angle

The 2026 HIPAA NPRM will change the cost of every covered entity's
compliance program.

What's changing:

→ MFA becomes mandatory for every ePHI access path.
→ Encryption at rest becomes mandatory (no more "addressable").
→ Biennial penetration tests become mandatory.
→ Annual Security Risk Analysis becomes explicit.
→ 24-hour breach notification for business associates.

Expected deadline: Q1 2027.

Most compliance programs I've reviewed are budgeted for the 2025 rule.
That budget is going to be short by six figures once the NPRM finalizes.

The cheapest thing you can do today is run a baseline scan. Finds where
you are. Tells you exactly which 45 CFR §164 sections the NPRM is about
to tighten on you. Does it in 15 minutes.

${refUrl}

---

## Post 3 — The MSP / consultancy angle

If you're an MSP or a compliance consultancy working with healthcare
clients, here's a tool I wish existed five years ago.

Automated 51-point HIPAA scan. AI-written report. Every finding cited
to the rule. Delivered in 15 minutes.

Tier 1 at $149 is low enough to hand a new client on the first call as
proof of capability.
Tier 4 at $899 is thorough enough to anchor a $15,000 remediation
engagement.

I've started using it as the discovery artifact for every new healthcare
prospect. Shortens the sales cycle from four weeks to one call.

Kit at ${refUrl}

---

## Post 4 — The developer-lead angle

Your engineering team spends time on HIPAA that should be spent on product.

Every one of these I've seen eats 20+ hours of dev time per cycle:

- Researching which 45 CFR §164 subsection applies to a specific finding.
- Translating compliance language into real HTTP header configs.
- Writing verification commands your auditor will accept.
- Re-running manually after each fix.

The $399 Developer Fix Kit does all four. Stack-detected. Pasteable code
fences. Real curl and openssl verifications. Rescans are free.

I'd rather my devs ship features.

${refUrl}

---

## Post 5 — The CEO "what's this worth" angle

A HIPAA compliance report is not a compliance deliverable. It is a risk
transfer artifact.

Without one, your organization owns the entire risk of an OCR action.

With one — dated, written, evidenced — you have demonstrated ongoing
monitoring, which is the specific evidentiary requirement under 45 CFR
§164.308(a)(1)(ii)(A).

The price of the artifact is $149 to $899 depending on tier. The median
OCR settlement in 2025 was $275,000. That is a 300x to 1,800x risk
transfer ratio.

This math only works if the artifact is actually produced, on a cadence,
and filed.

${refUrl}

---

## Post cadence tips

- Space posts 5–7 days apart. Daily posts suppress reach.
- Best days for healthcare-decision-maker content: Tuesday and Wednesday
  mornings (8:30–10:00 ET).
- Always end-cap with the referral URL on its own line — LinkedIn
  auto-unfurls it into a preview card.
- Don't hashtag #HIPAA in every post — mix in #healthcare, #compliance,
  #OCR, #infosec so the account doesn't look mono-topic.

---

_Questions? Reply to your partner dashboard — we'll update the kit as we
learn what converts._
`
  return { filename: 'linkedin-post-templates.md', body }
}
