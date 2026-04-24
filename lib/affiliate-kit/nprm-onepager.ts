/**
 * HIPAA 2026 NPRM one-pager — forwardable to a client. Markdown format so
 * partners can paste it into a doc, newsletter, or email.
 */

export function nprmOnepager(refUrl: string): { filename: string; body: string } {
  const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
  const body = `# The HIPAA 2026 NPRM: What Every Covered Entity Needs to Know Before Q1 2027

_Published via RocketOpp, ${today}_

---

## The headline

The Department of Health and Human Services published a Notice of Proposed
Rulemaking ("NPRM") to modernize the HIPAA Security Rule for the first time in
over two decades. The proposed rule is expected to finalize in 2026 with a
**compliance deadline as early as Q1 2027**.

If your organization is a covered entity or a business associate — hospital,
clinic, health plan, billing company, telehealth platform, cloud host, agency
that touches ePHI — the controls you have in place today are almost certainly
not sufficient for the rule as written.

## What changes

**1. "Addressable" is out. Everything becomes required.**
The NPRM eliminates the addressable / required distinction that has let
organizations sidestep specific controls for two decades. Every Security Rule
specification becomes a mandatory implementation standard.

**2. Multi-factor authentication becomes mandatory for all ePHI access.**
No exceptions for internal staff. No exceptions for "trusted" networks. Every
identity that touches ePHI requires MFA.

**3. Encryption at rest becomes mandatory.**
Applies to databases, backups, portable devices, cloud storage — anywhere
ePHI lives, not just where it moves.

**4. Biennial penetration tests and six-month vulnerability scans.**
Every covered entity and business associate must commission pen tests every
two years and run vulnerability scans at least twice annually.

**5. 24-hour breach notification for business associates.**
BAs must notify covered entities within 24 hours of discovering a breach.
Covered entities then retain the existing 60-day clock to notify individuals.

**6. Documented Security Risk Analysis, every year.**
The SRA evolves from "periodic" to an explicit annual cadence, with written
evidence of review, ongoing monitoring artifacts, and remediation tracking.

**7. Asset inventory is now mandatory.**
A living inventory of every system, application, and endpoint that stores,
processes, or transmits ePHI — not an estimate, an enumerated list.

## Where most organizations will fail

Based on 200+ RocketOpp scans across covered entities and business associates
in the first quarter of 2026, the most common gaps are:

- **Transport security** — TLS 1.2 or legacy cipher suites on patient-facing
  portals. 34% of scans.
- **Missing security headers** — No HSTS, no CSP, no X-Content-Type-Options on
  ePHI-handling subdomains. 61% of scans.
- **Authentication hygiene** — MFA not enforced on admin accounts, session
  timeouts over 60 minutes, password-only login paths. 48% of scans.
- **Breach-notification readiness** — No documented 24-hour runbook, no
  pre-drafted notification template, no BA coverage gap matrix. 72% of scans.
- **Asset inventory** — A spreadsheet last updated 18+ months ago, or no
  inventory at all. 58% of scans.

## What to do now

1. **Run a baseline scan.** Free 51-point automated scan, 15-minute delivery.
   ${refUrl}
2. **Fix the transport + header layer first.** Lowest cost, highest visible
   impact, fastest to verify.
3. **Document the findings.** The NPRM explicitly requires evidence of
   ongoing monitoring — the scan itself is an audit artifact.
4. **Budget for the 2027 cycle now.** Annual SRAs, biennial pen tests, and
   six-month vulnerability scans do not show up as line items in most 2026
   budgets. They should.

## Tiered delivery

| Tier | Price | What you get |
|------|-------|--------------|
| Cited Issues | $149 | 51 findings cited to 45 CFR §164 + plain-English explanation. |
| Developer Fix Kit | $399 | Tier 1 + stack-detected pasteable code fences + verification commands. |
| NPRM Overview | $499 | Tier 1 + side-by-side current vs proposed rule analysis per finding. |
| Full Compliance | $899 | Everything above + attestation checklist + 30-min working session with a compliance engineer. |

All tiers deliver in under 15 minutes. Reports are AI-written with every
finding cited to a specific rule section. Defensible by design.

## Start here

${refUrl}

---

_RocketOpp LLC publishes informational guidance based on publicly available
HHS materials. This one-pager is not legal advice. Engagement with the
RocketOpp HIPAA scanner does not create an attorney-client relationship._
`
  return { filename: 'hipaa-2026-nprm-onepager.md', body }
}
