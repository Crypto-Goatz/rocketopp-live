import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    // Validate required fields
    if (!data.name || !data.email) {
      return NextResponse.json(
        { success: false, error: "Name and email are required" },
        { status: 400 }
      )
    }

    // Store the lead in Supabase
    const { data: lead, error } = await supabase
      .from("contact_submissions")
      .insert({
        name: data.name,
        email: data.email,
        phone: data.phone || null,
        interests: data.interest || [],
        message: data.message || null,
        timeline: data.timeline || null,
        session_id: data.sessionId,
        variant: data.variant || "default",
        source: "contact_form",
        status: "new",
        metadata: {
          user_agent: request.headers.get("user-agent"),
          referer: request.headers.get("referer"),
        },
      })
      .select()
      .single()

    if (error) {
      console.error("Contact submission error:", error)
      return NextResponse.json(
        { success: false, error: "Failed to save submission" },
        { status: 500 }
      )
    }

    // Track successful submission as CRO conversion
    await supabase.from("cro_events").insert({
      session_id: data.sessionId,
      event_type: "conversion",
      event_data: { lead_id: lead?.id, email: data.email },
      variant: data.variant || "default",
    })

    // TODO: Send notification email to team
    // TODO: Create contact in CRM via webhook

    return NextResponse.json({ success: true, leadId: lead?.id })
  } catch (error) {
    console.error("Contact submission failed:", error)
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    )
  }
}
