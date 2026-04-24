/**
 * Tier 1 "Cited Issues" explainer — the forwardable $149 starter offer.
 * Written for a non-technical stakeholder to understand what they're buying
 * and why the price is low.
 */

export function tier1Explainer(refUrl: string): { filename: string; body: string } {
  const body = `# HIPAA Compliance Report — Cited Issues ($149)

## What is this, in one paragraph

A fully automated 51-point scan of your public-facing website and its
subdomains, followed by an AI-written report that translates every finding
into plain English — with the exact 45 CFR §164 rule section it maps to.
Delivered in under 15 minutes. No discovery call. No consultant engagement.

## Why $149

The work you are paying for is (a) the scan infrastructure, (b) the AI
writer that produces the finding-by-finding explanation, and (c) the
ongoing calibration against every HHS enforcement action we catalog. The
base tier is priced where most practices can approve it without bringing it
to the board — which is exactly the point. You want to get a real
compliance artifact in front of the people who can act on it, not schedule
another quarterly meeting about it.

## What is inside the report

- Every one of the 51 findings, cited to its specific 45 CFR §164
  subsection (for example §164.312(a)(2)(iv) — encryption and decryption).
- A plain-English explanation of _why_ the issue matters and _what an
  auditor would flag_ if they landed on it first.
- A prioritized remediation order: the top five things to fix in the next
  two weeks, followed by the rest.
- An attestation checklist: 14 one-line confirmations your staff walks
  through to demonstrate ongoing monitoring, keyed to the exact rule text.
- A printable HTML report you can commit to your OCR audit binder
  verbatim, dated, and attributable to RocketOpp.

## What is _not_ in this tier

- **No developer code** — we tell you where the failure is and what rule
  it breaks; we do not write the stack-specific fix. Tier 2 ($399) adds
  pasteable code.
- **No NPRM overlay** — Tier 1 is current rule only. The 2026 NPRM
  overlay (side-by-side current vs proposed) is the Tier 3 ($499) add-on.
- **No support call** — Tier 4 ($899) includes a 30-minute working
  session with a compliance engineer. Tier 1 is self-service.

## Who this is right for

- A clinic or covered entity that wants a real, defensible compliance
  artifact in the OCR binder this week.
- A business associate who needs to show a covered-entity client proof
  of ongoing monitoring.
- An MSP or compliance consultancy who wants to hand a new client
  something real on the first call.
- Any healthcare operator who has been meaning to "get a HIPAA review
  on the calendar" for eighteen months.

## Who this is _not_ right for

- Anyone who needs the developer fix kit — go straight to Tier 2 ($399).
- Anyone who is planning for the 2026 NPRM compliance cycle — go to
  Tier 3 ($499).
- Anyone who wants a compliance engineer on a call with their dev team —
  go to Tier 4 ($899).

## How the delivery works

1. Submit your domain on ${refUrl}
2. The scanner runs passively — only standard HTTP GET and HEAD. No
   credentials, no form submissions, no ePHI touched.
3. Within 15 minutes the AI-written report is generated and emailed.
4. You (or your developer) remediate. Rescans are free — always.

## The 15-minute guarantee

If the pipeline stalls for any reason and we cannot deliver inside 15
minutes, we refund the order. This has happened to under 0.2% of orders
in Q1 2026. The SLA is the ceiling, not the average.

---

**Start the scan:** ${refUrl}

---

_This explainer is written for informational purposes. Engagement with the
RocketOpp HIPAA scanner is a one-time commercial service and does not
create a consulting or legal relationship._
`
  return { filename: 'tier-1-cited-issues-explainer.md', body }
}
