import { NextRequest, NextResponse } from "next/server"

// GHL Webhook for lead capture
const GHL_WEBHOOK_URL = process.env.LEADS_WEBHOOK_URL ||
  "https://services.leadconnectorhq.com/hooks/6MSqx0trfxgLxeHBJE1k/webhook-trigger/16e971d9-d576-4b5d-a90f-4cf8224c67e9"

interface LeadForm {
  firstName: string
  lastName?: string
  email: string
  phone?: string
  company?: string
  service?: string
  project?: string
  source?: string
  formName?: string
  pageUrl?: string
  tags?: string[]
  customFields?: Record<string, string>
}

export async function POST(request: NextRequest) {
  try {
    const body: LeadForm = await request.json()

    // Validate required fields
    if (!body.firstName || !body.email) {
      return NextResponse.json(
        { error: "Missing required fields: firstName and email are required" },
        { status: 400 }
      )
    }

    // Build webhook payload
    const webhookPayload = {
      // Contact Info
      first_name: body.firstName,
      last_name: body.lastName || "",
      full_name: body.lastName ? `${body.firstName} ${body.lastName}` : body.firstName,
      email: body.email,
      phone: body.phone || "",
      company_name: body.company || "",

      // Inquiry Details
      service_interested: body.service || "",
      project_description: body.project || "",

      // Source Tracking
      source: body.source || "rocketopp-website",
      form_name: body.formName || "General Inquiry",
      page_url: body.pageUrl || "https://rocketopp.com",

      // Tags
      tags: body.tags || ["Website Lead"],

      // Custom fields
      ...(body.customFields || {}),

      // Metadata
      submitted_at: new Date().toISOString(),
    }

    // Send to GHL Webhook
    try {
      const response = await fetch(GHL_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(webhookPayload),
      })

      if (!response.ok) {
        console.error("[Leads API] Webhook response not OK:", response.status)
      }
    } catch (webhookError) {
      console.error("[Leads API] Webhook error:", webhookError)
      // Don't fail the request if webhook fails
    }

    return NextResponse.json({
      success: true,
      message: "Lead submitted successfully!",
    })
  } catch (error) {
    console.error("[Leads API] Error:", error)
    return NextResponse.json(
      { error: "Failed to submit lead" },
      { status: 500 }
    )
  }
}

// Also allow OPTIONS for CORS if needed
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  })
}
