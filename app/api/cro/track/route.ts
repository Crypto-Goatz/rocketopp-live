import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// CRO Event tracking endpoint
// Stores events for analysis and AI-driven optimization
export async function POST(request: NextRequest) {
  try {
    const event = await request.json()

    // Add metadata
    const enrichedEvent = {
      ...event,
      user_agent: request.headers.get("user-agent"),
      ip_hash: hashIP(request.headers.get("x-forwarded-for") || "unknown"),
      page_url: request.headers.get("referer"),
      created_at: new Date().toISOString(),
    }

    // Store in Supabase for analysis
    const { error } = await supabase
      .from("cro_events")
      .insert({
        session_id: event.sessionId,
        event_type: event.type,
        event_data: enrichedEvent,
        variant: event.variant || "default",
        step: event.step,
        field: event.field,
      })

    if (error) {
      console.error("CRO tracking error:", error)
      // Don't fail the request - tracking should be non-blocking
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("CRO tracking failed:", error)
    // Return success anyway - tracking shouldn't block UX
    return NextResponse.json({ success: true })
  }
}

// Simple IP hashing for privacy
function hashIP(ip: string): string {
  let hash = 0
  for (let i = 0; i < ip.length; i++) {
    const char = ip.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash
  }
  return Math.abs(hash).toString(36)
}
