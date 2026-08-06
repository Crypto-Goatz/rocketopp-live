import { NextRequest, NextResponse } from "next/server"
import { checkBotId } from "botid/server"
import { createClient } from "@supabase/supabase-js"
import { notifyFormSubmission, FormSources } from "@/lib/crm/notify"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    // BotID: block automated submissions before touching the CRM or sending mail.
    const bot = await checkBotId()
    if (bot.isBot) {
      return NextResponse.json({ success: false, error: "Access denied." }, { status: 403 })
    }

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
      // NOTE: contact_submissions has form_name/page_url/raw/is_spam — it has
      // no `status` or `metadata` column. Inserting those made every write here
      // fail silently (the error is only console.logged), so contact-form
      // submissions were reaching the CRM but never being recorded locally.
      .insert({
        form_name: "Contact Form",
        name: data.name,
        first_name: firstName,
        last_name: lastName,
        email: data.email,
        phone: data.phone || null,
        company: data.company || null,
        message: data.message || null,
        page_url: request.headers.get("referer") || "https://rocketopp.com/contact",
        source: "contact_form",
        user_agent: request.headers.get("user-agent"),
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
      honeypot: data.company_website,
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
