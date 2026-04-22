/**
 * HIPAA Knowledge Base — condensed for K-layer synthesis.
 *
 * Every citation here maps back to 45 CFR Part 164. The 2026 NPRM notes
 * reflect the Notice of Proposed Rulemaking HHS published in Jan 2025
 * (compliance deadline ~January 2027).
 *
 * This is the single source of truth for rocketopp.com/api/k/hipaa.
 */

export const HIPAA_RULE_CITATIONS = {
  // Security Rule — 45 CFR Part 164, Subpart C
  "164.308(a)(1)(i)": {
    title: "Security Management Process",
    type: "administrative",
    summary: "Implement policies/procedures to prevent, detect, contain, and correct security violations.",
    current: "required",
    nprm2026: "required + mandatory annual risk analysis + written remediation plan",
  },
  "164.308(a)(3)": {
    title: "Workforce Security",
    type: "administrative",
    summary: "Ensure workforce has appropriate ePHI access; terminate access promptly.",
    current: "required",
    nprm2026: "required + documented termination procedures within 1 hour",
  },
  "164.308(a)(4)": {
    title: "Information Access Management",
    type: "administrative",
    summary: "Role-based authorization before granting ePHI access.",
    current: "required",
    nprm2026: "required + explicit least-privilege enforcement",
  },
  "164.308(a)(5)": {
    title: "Security Awareness & Training",
    type: "administrative",
    summary: "Ongoing training program for all workforce members.",
    current: "addressable",
    nprm2026: "required — addressable category eliminated",
  },
  "164.308(a)(7)(ii)(A)": {
    title: "Data Backup Plan",
    type: "administrative",
    summary: "Establish retrievable exact copies of ePHI.",
    current: "required",
    nprm2026: "required + encryption of backups at rest",
  },
  "164.308(a)(8)": {
    title: "Evaluation",
    type: "administrative",
    summary: "Periodic technical + non-technical evaluation.",
    current: "required",
    nprm2026: "required + vulnerability scans every 6 months + penetration tests annually",
  },

  "164.310(a)(1)": {
    title: "Facility Access Controls",
    type: "physical",
    summary: "Limit physical access to electronic information systems.",
    current: "required",
  },
  "164.310(d)(1)": {
    title: "Device & Media Controls",
    type: "physical",
    summary: "Receipt and removal of hardware/media containing ePHI.",
    current: "required",
  },

  "164.312(a)(1)": {
    title: "Access Control",
    type: "technical",
    summary: "Technical policies allowing access only to authorized persons/software.",
    current: "required",
    nprm2026: "required + multi-factor authentication (MFA) mandatory for all workforce access",
  },
  "164.312(a)(2)(iv)": {
    title: "Encryption & Decryption",
    type: "technical",
    summary: "Mechanism to encrypt/decrypt ePHI.",
    current: "addressable",
    nprm2026: "required — encryption at rest and in transit, addressable category eliminated",
  },
  "164.312(b)": {
    title: "Audit Controls",
    type: "technical",
    summary: "Hardware/software/procedural mechanisms to record ePHI access.",
    current: "required",
    nprm2026: "required + audit logs retained ≥6 years + immutable logging",
  },
  "164.312(c)(1)": {
    title: "Integrity",
    type: "technical",
    summary: "Protect ePHI from improper alteration/destruction.",
    current: "required",
  },
  "164.312(d)": {
    title: "Person or Entity Authentication",
    type: "technical",
    summary: "Verify identity of person/entity seeking access.",
    current: "required",
    nprm2026: "required + MFA mandatory + session timeout ≤15 min idle",
  },
  "164.312(e)(1)": {
    title: "Transmission Security",
    type: "technical",
    summary: "Guard against unauthorized access to ePHI in transit.",
    current: "required",
    nprm2026: "required + TLS 1.3 minimum + HSTS required",
  },
  "164.312(e)(2)(ii)": {
    title: "Encryption (Transmission)",
    type: "technical",
    summary: "Encrypt ePHI during transmission where appropriate.",
    current: "addressable",
    nprm2026: "required — all ePHI in transit must be encrypted",
  },

  "164.404": {
    title: "Notification to Individuals (Breach)",
    type: "breach-notification",
    summary: "Notify affected individuals within 60 days of breach discovery.",
    current: "required",
  },
  "164.408": {
    title: "Notification to HHS (Breach)",
    type: "breach-notification",
    summary: "Notify HHS Secretary of breaches affecting ≥500 individuals within 60 days.",
    current: "required",
  },
  "164.410": {
    title: "Notification by Business Associate",
    type: "breach-notification",
    summary: "Business associate must notify covered entity of breach.",
    current: "required",
  },

  "164.502": {
    title: "Uses and Disclosures (Privacy Rule)",
    type: "privacy",
    summary: "Minimum necessary standard for PHI uses/disclosures.",
    current: "required",
  },
  "164.520": {
    title: "Notice of Privacy Practices",
    type: "privacy",
    summary: "Provide NPP to individuals; post on public-facing sites.",
    current: "required",
  },
} as const

export const NPRM_2026_HEADLINES = [
  "MFA becomes mandatory for all ePHI access (was 'addressable')",
  "Encryption at rest becomes required (was 'addressable') — includes backups",
  "Encryption in transit becomes required — TLS 1.3 minimum",
  "The 'addressable' implementation specification category is eliminated — everything is 'required'",
  "Vulnerability scans required every 6 months, penetration tests annually",
  "Annual written risk analysis required with documented remediation plan",
  "Audit logs must be retained ≥6 years and be tamper-evident/immutable",
  "Session timeout maximum of 15 minutes idle for all ePHI systems",
  "Workforce termination procedures must revoke access within 1 hour",
  "Security training must be role-specific, not generic",
] as const

export const CHECK_CATEGORIES = [
  {
    id: "transport-security",
    name: "Transport Security",
    count: 14,
    rule_basis: ["164.312(e)(1)", "164.312(e)(2)(ii)"],
    covers: [
      "TLS version + cipher strength",
      "HSTS header presence + preload",
      "Valid TLS certificate (not expired, not self-signed, correct SAN)",
      "HTTP → HTTPS redirect chain (no plaintext hops)",
      "Encryption in transit for all endpoints",
    ],
  },
  {
    id: "privacy-disclosures",
    name: "Privacy Disclosures",
    count: 10,
    rule_basis: ["164.520", "164.502"],
    covers: [
      "Notice of Privacy Practices posted and linked",
      "CMS transparency disclosure (where applicable)",
      "Content freshness (NPP updated within 3 years)",
      "Contact information for privacy officer",
      "Patient rights language present",
    ],
  },
  {
    id: "security-headers",
    name: "Security Headers",
    count: 13,
    rule_basis: ["164.312(c)(1)", "164.312(a)(1)"],
    covers: [
      "Content-Security-Policy (no wildcards, no unsafe-inline)",
      "X-Frame-Options or CSP frame-ancestors (clickjacking)",
      "X-Content-Type-Options: nosniff",
      "Referrer-Policy",
      "CORS Access-Control-Allow-Origin (no wildcard on credentialed endpoints)",
      "Server/X-Powered-By exposure (fingerprinting)",
      "Permissions-Policy",
    ],
  },
  {
    id: "authentication-controls",
    name: "Authentication Controls",
    count: 12,
    rule_basis: ["164.312(d)", "164.312(a)(1)", "164.308(a)(4)"],
    covers: [
      "MFA availability/enforcement on patient/provider portals",
      "Session cookie flags (Secure, HttpOnly, SameSite)",
      "Open/self-registration on patient portals (should be invite/verify)",
      "Rate limiting on login endpoints",
      "Password policy strength",
      "Session timeout (15 min idle per 2026 NPRM)",
    ],
  },
  {
    id: "data-exposure",
    name: "Data Exposure",
    count: 14,
    rule_basis: ["164.308(a)(1)(i)", "164.502", "164.312(b)"],
    covers: [
      "phpinfo()/server-status/env/.git exposure",
      "End-of-life software (PHP <8.1, Apache <2.4.58, WordPress core/plugins)",
      "Third-party trackers on pages that touch PHI without a signed BAA",
      "Exposed logs, error traces, debug endpoints",
      "Directory listing enabled",
      "Verbose error pages leaking stack traces",
      "Publicly indexed admin/dashboard URLs",
    ],
  },
] as const

export const COMMON_TERMS = {
  "PHI": "Protected Health Information — individually identifiable health information held/transmitted by a covered entity or business associate.",
  "ePHI": "Electronic Protected Health Information — PHI in electronic form. Subject to the HIPAA Security Rule.",
  "Covered Entity": "Health plans, healthcare clearinghouses, and healthcare providers that transmit health information electronically.",
  "Business Associate": "Any person/entity that performs services for a covered entity involving PHI. Requires a BAA.",
  "BAA": "Business Associate Agreement — required contract between a covered entity and any vendor handling PHI.",
  "NPP": "Notice of Privacy Practices — mandatory public-facing disclosure of how a covered entity uses/discloses PHI.",
  "OCR": "Office for Civil Rights (HHS) — enforces HIPAA Privacy and Security Rules.",
  "NPRM": "Notice of Proposed Rulemaking — HHS published major HIPAA Security Rule updates in January 2025, compliance ~January 2027.",
  "Addressable": "A Security Rule implementation specification category where the covered entity can implement, document an equivalent alternative, or document why neither is reasonable. Eliminated under 2026 NPRM.",
  "Required": "A Security Rule implementation specification that must be implemented. No flexibility.",
  "Safe Harbor": "Under §13402(h) of HITECH, encrypted PHI that meets NIST standards is exempt from breach-notification requirements.",
} as const

export const PENALTY_TIERS = [
  { tier: 1, knowledge: "Did not know", min: 137, max: 68928, annual_cap: 2067813 },
  { tier: 2, knowledge: "Reasonable cause (not willful neglect)", min: 1379, max: 68928, annual_cap: 2067813 },
  { tier: 3, knowledge: "Willful neglect — corrected within 30 days", min: 13785, max: 68928, annual_cap: 2067813 },
  { tier: 4, knowledge: "Willful neglect — not corrected", min: 68928, max: 2067813, annual_cap: 2067813 },
] as const

export const ESCALATION = {
  ocr_complaint_portal: "https://ocrportal.hhs.gov/ocr/",
  ocr_phone: "1-800-368-1019",
  breach_notification_deadline_hours: 60 * 24, // 60 days from discovery
  breach_hhs_threshold: 500,
} as const

export const ROCKETOPP_HIPAA_PRODUCT = {
  tiers: [
    { id: 1, name: "Cited Issues", price: 149, delivers: "Every finding cited to 45 CFR §164, plain-English explanation, printable report." },
    { id: 2, name: "Developer Fix Kit", price: 399, delivers: "Everything in Tier 1 + stack-detected developer code fixes, verification commands." },
    { id: 3, name: "NPRM Overview", price: 499, delivers: "Everything in Tier 1 + 2026 NPRM delta per finding + business impact." },
    { id: 4, name: "Full Compliance", price: 899, anchor: 1499, delivers: "Everything + dev fixes + NPRM + 60-day free support call. Best value." },
  ],
  delivery_sla_minutes: 15,
  scan_url: "https://rocketopp.com/hipaa#scan",
  dashboard_url: "https://rocketopp.com/dashboard/hipaa",
  book_call_url: "https://rocketopp.com/hipaa/book-call",
} as const

export type HipaaAnswerCitation = {
  rule: string
  title: string
  summary: string
}
