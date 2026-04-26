/**
 * askHipaa — single synthesis call powering /api/k/hipaa + /api/hipaa/chat.
 *
 * Groq llama-3.3-70b-versatile (enforced by the "GROQ ONLY" rule). No Anthropic.
 * The full HIPAA knowledge base is inlined as the system prompt so every answer
 * cites 45 CFR §164 + flags 2026 NPRM deltas without an extra retrieval step.
 */

import {
  HIPAA_RULE_CITATIONS,
  NPRM_2026_HEADLINES,
  CHECK_CATEGORIES,
  COMMON_TERMS,
  PENALTY_TIERS,
  ESCALATION,
  ROCKETOPP_HIPAA_PRODUCT,
} from "./knowledge"

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions"

interface GroqResponse {
  choices?: Array<{ message?: { content?: string } }>
  error?: { message?: string }
}

async function callGroq(
  model: string,
  messages: Array<{ role: string; content: string }>,
  temperature: number,
): Promise<string> {
  const apiKey = process.env.GROQ_API_KEY
  if (!apiKey) throw new Error("GROQ_API_KEY not configured")

  const res = await fetch(GROQ_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ model, messages, temperature, max_tokens: 800 }),
  })

  const data = (await res.json()) as GroqResponse
  if (!res.ok) {
    throw new Error(data.error?.message || `Groq ${res.status}`)
  }
  const content = data.choices?.[0]?.message?.content
  if (!content) throw new Error("Groq returned empty response")
  return content.trim()
}

export interface AskHipaaInput {
  question: string
  context?: string
  history?: Array<{ role: "user" | "assistant"; content: string }>
}

export interface AskHipaaResult {
  answer: string
  citations: Array<{ rule: string; title: string }>
  duration_ms: number
  model: string
}

function buildSystemPrompt(): string {
  const citations = Object.entries(HIPAA_RULE_CITATIONS)
    .map(([section, info]) => {
      const nprm = "nprm2026" in info ? `  2026 NPRM: ${(info as { nprm2026: string }).nprm2026}` : ""
      return `- 45 CFR §${section} — ${info.title} (${info.type}, ${info.current})\n  ${info.summary}${nprm ? "\n" + nprm : ""}`
    })
    .join("\n")

  const categories = CHECK_CATEGORIES.map(
    (c) => `- ${c.name} (${c.count} checks, maps to ${c.rule_basis.join(", ")}): ${c.covers.join("; ")}`,
  ).join("\n")

  const terms = Object.entries(COMMON_TERMS)
    .map(([term, def]) => `- ${term}: ${def}`)
    .join("\n")

  const penalties = PENALTY_TIERS.map(
    (p) => `- Tier ${p.tier} (${p.knowledge}): $${p.min.toLocaleString()}-$${p.max.toLocaleString()} per violation, $${p.annual_cap.toLocaleString()} annual cap`,
  ).join("\n")

  const tiers = ROCKETOPP_HIPAA_PRODUCT.tiers
    .map((t) => {
      const anchor = "anchor" in t ? (t as { anchor?: number }).anchor : undefined
      return `  - Tier ${t.id} "${t.name}" — $${t.price}${anchor ? ` (anchor $${anchor})` : ""}: ${t.delivers}`
    })
    .join("\n")

  return `You are the RocketOpp HIPAA compliance assistant. You answer questions about the HIPAA Privacy Rule, Security Rule, Breach Notification Rule, and the 2026 NPRM proposed updates.

Your knowledge base is below. Every answer MUST cite the specific 45 CFR §164 section(s) when applicable. If the 2026 NPRM changes a requirement, flag it explicitly.

═══════════════════════════════════════
RULE CITATIONS (45 CFR Part 164)
═══════════════════════════════════════
${citations}

═══════════════════════════════════════
2026 NPRM HEADLINES (compliance ~Jan 2027)
═══════════════════════════════════════
${NPRM_2026_HEADLINES.map((h) => `- ${h}`).join("\n")}

═══════════════════════════════════════
ROCKETOPP SCANNER CATEGORIES (63 checks)
═══════════════════════════════════════
${categories}

═══════════════════════════════════════
KEY TERMS
═══════════════════════════════════════
${terms}

═══════════════════════════════════════
CIVIL MONETARY PENALTIES (2025 adjusted)
═══════════════════════════════════════
${penalties}

═══════════════════════════════════════
ESCALATION + REPORTING
═══════════════════════════════════════
- OCR Complaint Portal: ${ESCALATION.ocr_complaint_portal}
- OCR Phone: ${ESCALATION.ocr_phone}
- Breach notification deadline: 60 days from discovery (§164.404 individuals, §164.408 HHS for ≥500)
- HHS notification threshold: ≥${ESCALATION.breach_hhs_threshold} individuals → report within 60 days

═══════════════════════════════════════
ROCKETOPP HIPAA REPORT PRODUCT
═══════════════════════════════════════
${tiers}
- Delivery SLA: ${ROCKETOPP_HIPAA_PRODUCT.delivery_sla_minutes} minutes
- Free scan: ${ROCKETOPP_HIPAA_PRODUCT.scan_url}
- Dashboard: ${ROCKETOPP_HIPAA_PRODUCT.dashboard_url}
- Book a call: ${ROCKETOPP_HIPAA_PRODUCT.book_call_url}

═══════════════════════════════════════
RESPONSE STYLE
═══════════════════════════════════════
- Direct, concise, and confident. No fluff.
- Cite rule sections inline: "per 45 CFR §164.312(d)".
- If the 2026 NPRM changes the rule, say so: "Under current law this is 'addressable', but the 2026 NPRM makes it required."
- If the question is not HIPAA-related, politely redirect.
- If a user asks about ordering a report, mention the relevant tier and link to ${ROCKETOPP_HIPAA_PRODUCT.scan_url}.
- Never invent rule sections or penalty amounts that are not in the knowledge base above.
- Keep answers under 200 words unless the user explicitly asks for more detail.
- Use plain English. Avoid acronyms without first defining them.`
}

function extractCitations(text: string): Array<{ rule: string; title: string }> {
  const pattern = /§(\d{3}\.\d{3}(?:\([a-z0-9]+\))?(?:\([a-z0-9]+\))?(?:\([ivxIVX]+\))?)/g
  const found = new Set<string>()
  let m: RegExpExecArray | null
  while ((m = pattern.exec(text)) !== null) found.add(m[1])
  return Array.from(found)
    .map((rule) => {
      const info = (HIPAA_RULE_CITATIONS as Record<string, { title: string }>)[rule]
      return info ? { rule, title: info.title } : null
    })
    .filter((x): x is { rule: string; title: string } => x !== null)
}

export async function askHipaa(input: AskHipaaInput): Promise<AskHipaaResult> {
  const start = Date.now()
  const model = "llama-3.3-70b-versatile"

  const history = (input.history || []).slice(-8) // last 4 turns
  const userPrompt = input.context
    ? `Context (from current scan or report): ${input.context}\n\nQuestion: ${input.question}`
    : input.question

  const messages: Array<{ role: string; content: string }> = [
    { role: "system", content: buildSystemPrompt() },
    ...history,
    { role: "user", content: userPrompt },
  ]

  const text = await callGroq(model, messages, 0.3)

  return {
    answer: text,
    citations: extractCitations(text),
    duration_ms: Date.now() - start,
    model,
  }
}
