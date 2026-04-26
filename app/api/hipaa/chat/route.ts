/**
 * POST /api/hipaa/chat — internal endpoint for the HIPAA chat widget.
 *
 * No Bearer auth. Rate-limited by IP. Shares the askHipaa() synthesis layer
 * with /api/k/hipaa. Keeps request bodies small and latency under 15s.
 */

import { NextRequest, NextResponse } from "next/server"
import { askHipaa } from "@/lib/hipaa/ask"

export const runtime = "nodejs"
export const maxDuration = 30

const IP_BUCKETS = new Map<string, { count: number; windowStart: number }>()
const WINDOW_MS = 60_000
const MAX_PER_MINUTE = 20

function clientIp(req: NextRequest): string {
  const fwd = req.headers.get("x-forwarded-for")
  if (fwd) return fwd.split(",")[0]!.trim()
  const real = req.headers.get("x-real-ip")
  if (real) return real.trim()
  return "unknown"
}

function allowIp(ip: string): boolean {
  const now = Date.now()
  const existing = IP_BUCKETS.get(ip)
  if (!existing || now - existing.windowStart > WINDOW_MS) {
    IP_BUCKETS.set(ip, { count: 1, windowStart: now })
    return true
  }
  existing.count += 1
  return existing.count <= MAX_PER_MINUTE
}

export async function POST(req: NextRequest) {
  const ip = clientIp(req)
  if (!allowIp(ip)) {
    return NextResponse.json(
      { error: "rate_limited", message: `Limit ${MAX_PER_MINUTE}/min. Try again in a minute.` },
      { status: 429 },
    )
  }

  const body = await req.json().catch(() => ({}))
  const question = String(body?.message || body?.question || "").trim()
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

  if (question.length < 2) {
    return NextResponse.json({ error: "question_too_short" }, { status: 400 })
  }
  if (question.length > 2000) {
    return NextResponse.json({ error: "question_too_long" }, { status: 400 })
  }

  try {
    const result = await askHipaa({ question, context, history })
    return NextResponse.json({
      reply: result.answer,
      citations: result.citations,
      duration_ms: result.duration_ms,
    })
  } catch (e) {
    return NextResponse.json(
      { error: "synthesis_failed", message: e instanceof Error ? e.message : "unknown" },
      { status: 500 },
    )
  }
}
