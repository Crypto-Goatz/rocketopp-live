/**
 * POST /api/k/hipaa — public HIPAA compliance Q&A, exposed as a 0nMCP K-layer add0n.
 *
 * Auth:
 *   Authorization: Bearer <K_LAYER_HIPAA_API_KEY>   (or any key in K_LAYER_KEYS)
 *
 * Body:
 *   {
 *     "question": "What does 45 CFR §164.312(d) require?",
 *     "context":  "optional — paste a scan finding or a report excerpt",
 *     "history":  [{ role, content }]   // optional, last 4 turns max
 *   }
 *
 * Response:
 *   {
 *     ok: true,
 *     k_layer: "hipaa",
 *     version: "1.0",
 *     tenant: "master",
 *     answer: "...",
 *     citations: [{ rule, title }],
 *     duration_ms: 1234,
 *     model: "llama-3.3-70b-versatile"
 *   }
 *
 * Rate limit: per-key in-memory token bucket. Upgrade to Redis when we scale.
 */

import { NextRequest, NextResponse } from "next/server"
import { askHipaa } from "@/lib/hipaa/ask"

export const runtime = "nodejs"
export const maxDuration = 60

interface KeyEntitlement {
  label: string
  perMinute: number
}

function parseEntitlements(): Record<string, KeyEntitlement> {
  const out: Record<string, KeyEntitlement> = {}
  const master = process.env.K_LAYER_HIPAA_API_KEY || process.env.K_LAYER_API_KEY
  if (master) out[master] = { label: "master", perMinute: 120 }

  const multi = process.env.K_LAYER_HIPAA_KEYS || process.env.K_LAYER_KEYS
  if (multi) {
    for (const entry of multi.split(",").map((s) => s.trim()).filter(Boolean)) {
      const [key, rest] = entry.split(":")
      if (!key || !rest) continue
      const [labelPart, rateStr] = rest.split(/[=:]/)
      out[key] = { label: labelPart || "tenant", perMinute: Number(rateStr) || 30 }
    }
  }
  return out
}

const BUCKETS = new Map<string, { tokens: number; last: number }>()

function takeToken(key: string, perMinute: number): boolean {
  const now = Date.now()
  const existing = BUCKETS.get(key)
  const rate = perMinute / 60000
  if (!existing) {
    BUCKETS.set(key, { tokens: perMinute - 1, last: now })
    return true
  }
  const elapsed = now - existing.last
  existing.tokens = Math.min(perMinute, existing.tokens + elapsed * rate)
  existing.last = now
  if (existing.tokens < 1) return false
  existing.tokens -= 1
  return true
}

export async function POST(req: NextRequest) {
  const auth = req.headers.get("authorization") || ""
  const key = auth.startsWith("Bearer ") ? auth.slice(7).trim() : ""
  if (!key) {
    return NextResponse.json({ error: "missing_bearer_token" }, { status: 401 })
  }

  const entitlements = parseEntitlements()
  const entitlement = entitlements[key]
  if (!entitlement) {
    return NextResponse.json({ error: "invalid_key" }, { status: 403 })
  }

  if (!takeToken(key, entitlement.perMinute)) {
    return NextResponse.json(
      { error: "rate_limited", message: `Exceeded ${entitlement.perMinute} calls/min.` },
      { status: 429 },
    )
  }

  const body = await req.json().catch(() => ({}))
  const question = String(body?.question || "").trim()
  const context = body?.context ? String(body.context).slice(0, 4000) : undefined
  const history = Array.isArray(body?.history)
    ? body.history
        .filter((m: unknown): m is { role: string; content: string } => {
          return typeof m === "object" && m !== null && "role" in m && "content" in m
        })
        .map((m: { role: string; content: string }) => ({
          role: m.role === "assistant" ? ("assistant" as const) : ("user" as const),
          content: String(m.content).slice(0, 2000),
        }))
        .slice(-8)
    : undefined

  if (question.length < 3) {
    return NextResponse.json({ error: "question_too_short" }, { status: 400 })
  }
  if (question.length > 2000) {
    return NextResponse.json({ error: "question_too_long" }, { status: 400 })
  }

  try {
    const result = await askHipaa({ question, context, history })
    return NextResponse.json({
      ok: true,
      k_layer: "hipaa",
      version: "1.0",
      tenant: entitlement.label,
      ...result,
    })
  } catch (e) {
    return NextResponse.json(
      { error: "synthesis_failed", message: e instanceof Error ? e.message : "unknown" },
      { status: 500 },
    )
  }
}

export async function GET() {
  return NextResponse.json({
    k_layer: "hipaa",
    version: "1.0",
    description:
      "HIPAA compliance Q&A. Cites 45 CFR Part 164 with 2026 NPRM overlay. Groq-powered synthesis over the RocketOpp HIPAA knowledge base.",
    endpoints: {
      ask: "POST /api/k/hipaa",
      manifest: "GET /api/k/hipaa",
    },
    auth: "Bearer <K_LAYER_HIPAA_API_KEY>",
    body: {
      question: "string (3-2000 chars)",
      context: "string? (≤4000 chars) — paste a scan finding or report excerpt",
      history: "{role, content}[]? — last 4 turns",
    },
    knowledge: {
      rule_sections: "45 CFR §164.308, §164.310, §164.312, §164.404, §164.408, §164.410, §164.502, §164.520",
      nprm_2026: "Proposed rulemaking changes (compliance ~Jan 2027) — MFA, encryption, 6mo scans, etc.",
      scanner_categories: "63 checks across 5 categories",
      penalty_tiers: "Current CMS adjusted penalty tiers",
    },
    docs: "https://rocketopp.com/hipaa",
  })
}
