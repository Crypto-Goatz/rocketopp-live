import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { notifyFormSubmission, FormSources } from "@/lib/crm/notify"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    if (!data.name || !data.email) {
      return NextResponse.json(
        { success: false, error: "Name and email are required" },
        { status: 400 }
      )
    }

    const nameParts = data.name.trim().split(" ")
    const firstName = nameParts[0]
    const lastName = nameParts.slice(1).join(" ") || ""

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
    }

    const result = await notifyFormSubmission({
      email: data.email,
      firstName,
      lastName,
      fullName: data.name,
      phone: data.phone,
      company: data.company,
      message: data.message,
      source: FormSources.CONTACT_FORM,
      formName: "Contact Form",
      pageUrl: request.headers.get("referer") || "https://rocketopp.com/contact",
      tags: ["Website Lead", "Contact Form"],
    })

    if (lead?.id && result.contactId) {
      await supabase
        .from("contact_submissions")
        .update({ ghl_contact_id: result.contactId })
        .eq("id", lead.id)
    }

    return NextResponse.json({
      success: true,
      leadId: lead?.id,
      ghlContactId: result.contactId,
      mikeEmailed: result.mikeEmailed,
    })
  } catch (error) {
    console.error("Contact submission failed:", error)
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    )
  }
}
