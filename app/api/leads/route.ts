import { NextRequest, NextResponse } from "next/server"
import { checkBotId } from "botid/server"
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
  honeypot?: string
  company_website?: string
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

    // BotID is configured for this path on the client (instrumentation-client.ts) but this route never asked
    // the server verdict, so direct POSTs walked straight into the CRM and its auto-reply (2026-11-04: seven
    // gibberish-name leads thanked by email before noon). The verdict is passed into the one spam gate so a
    // flagged submission is still stored (is_spam) and logged, never silently dropped.
    const bot = await checkBotId().catch(() => ({ isBot: false }))
    const result = await notifyFormSubmission({
      bot: bot.isBot,
      email: body.email,
      firstName: body.firstName,
      lastName: body.lastName,
      fullName: body.lastName ? `${body.firstName} ${body.lastName}` : body.firstName,
      phone: body.phone,
      company: body.company,
      service: body.service,
      project: body.project,
      honeypot: body.honeypot ?? body.company_website,
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

    // Nothing stored, nothing in the CRM, nothing in Mike's inbox: say so, so the
    // form shows the phone/email fallback instead of a false "thank you".
    if (!result.received && !result.spam) {
      return NextResponse.json({ success: false, error: "We couldn't save your submission" }, { status: 502 })
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
