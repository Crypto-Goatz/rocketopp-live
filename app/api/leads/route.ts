import { NextRequest, NextResponse } from "next/server"
import { notifyFormSubmission, FormSources } from "@/lib/crm/notify"

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

    const result = await notifyFormSubmission({
      email: body.email,
      firstName: body.firstName,
      lastName: body.lastName,
      fullName: body.lastName ? `${body.firstName} ${body.lastName}` : body.firstName,
      phone: body.phone,
      company: body.company,
      service: body.service,
      project: body.project,
      source: body.source || FormSources.GENERAL,
      formName: body.formName || "General Inquiry",
      pageUrl: body.pageUrl || "https://rocketopp.com",
      tags: body.tags || ["Website Lead"],
      customFields: body.customFields,
    })

    console.log("[Leads API] notify result:", {
      success: result.success,
      contactId: result.contactId,
      mikeEmailed: result.mikeEmailed,
    })

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
