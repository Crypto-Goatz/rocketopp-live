import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// GHL Configuration
const GHL_LOCATION_ID = process.env.GHL_LOCATION_ID || "6MSqx0trfxgLxeHBJE1k"
const GHL_API_KEY = process.env.GHL_LOCATION_API_KEY // Location PIT or access token

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

    // Split name into first/last
    const nameParts = data.name.trim().split(" ")
    const firstName = nameParts[0]
    const lastName = nameParts.slice(1).join(" ") || ""

    // Store the lead in Supabase
    const { data: lead, error: supabaseError } = await supabase
      .from("contact_submissions")
      .insert({
        name: data.name,
        email: data.email,
        phone: data.phone || null,
        company: data.company || null,
        message: data.message || null,
        source: "contact_form",
        status: "new",
        metadata: {
          user_agent: request.headers.get("user-agent"),
          referer: request.headers.get("referer"),
        },
      })
      .select()
      .single()

    if (supabaseError) {
      console.error("Supabase error:", supabaseError)
      // Continue anyway - don't fail if Supabase fails
    }

    // Send to GHL
    let ghlContactId = null
    if (GHL_API_KEY) {
      try {
        const ghlResponse = await fetch(
          "https://services.leadconnectorhq.com/contacts/",
          {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${GHL_API_KEY}`,
              "Content-Type": "application/json",
              "Version": "2021-07-28",
            },
            body: JSON.stringify({
              locationId: GHL_LOCATION_ID,
              firstName,
              lastName,
              email: data.email,
              phone: data.phone || undefined,
              companyName: data.company || undefined,
              source: "RocketOpp Contact Form",
              tags: ["website-lead", "contact-form"],
              customFields: [
                {
                  key: "message",
                  field_value: data.message || "",
                },
              ],
            }),
          }
        )

        if (ghlResponse.ok) {
          const ghlData = await ghlResponse.json()
          ghlContactId = ghlData.contact?.id

          // Update Supabase with GHL contact ID
          if (lead?.id && ghlContactId) {
            await supabase
              .from("contact_submissions")
              .update({ ghl_contact_id: ghlContactId })
              .eq("id", lead.id)
          }
        } else {
          const errorText = await ghlResponse.text()
          console.error("GHL API error:", errorText)
        }
      } catch (ghlError) {
        console.error("GHL submission failed:", ghlError)
        // Don't fail the request if GHL fails
      }
    } else {
      console.warn("GHL_LOCATION_API_KEY not configured - skipping GHL submission")
    }

    // Send notification via GHL webhook (backup method if direct API isn't configured)
    if (!GHL_API_KEY && process.env.GHL_WEBHOOK_URL) {
      try {
        await fetch(process.env.GHL_WEBHOOK_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: data.name,
            first_name: firstName,
            last_name: lastName,
            email: data.email,
            phone: data.phone,
            company: data.company,
            message: data.message,
            source: "RocketOpp Contact Form",
            submitted_at: new Date().toISOString(),
          }),
        })
      } catch (webhookError) {
        console.error("Webhook submission failed:", webhookError)
      }
    }

    return NextResponse.json({
      success: true,
      leadId: lead?.id,
      ghlContactId,
    })
  } catch (error) {
    console.error("Contact submission failed:", error)
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    )
  }
}
