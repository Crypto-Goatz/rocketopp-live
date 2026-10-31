import { NextRequest, NextResponse } from "next/server"
import { checkBotId } from "botid/server"
import { createClient } from "@supabase/supabase-js"
import { notifyFormSubmission, FormSources } from "@/lib/crm/notify"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

/**
 * The forms that post here. "free_website" is the free-website consultation (Mike, 2026-10-31: the site now leads with one
 * offer — a free website for service businesses after a free consultation; the only ongoing cost is the $49/mo lead tool).
 */
const FORMS: Record<string, { formName: string; source: string; tags: string[] }> = {
  contact: { formName: "Contact Form", source: "contact_form", tags: ["Website Lead", "Contact Form"] },
  free_website: { formName: "Free Website Consultation", source: "free_website", tags: ["Website Lead", "Free Website Consultation"] },
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const form = FORMS[String(data.form ?? "contact")] ?? FORMS.contact

    if (!data.name || !data.email) {
      return NextResponse.json(
        { success: false, error: "Name and email are required" },
        { status: 400 }
      )
    }

    /*
      BotID: an automated submission never reaches the CRM or Mike's inbox. But it is KEPT, flagged, not thrown away: this
      form is the business's one door, and a person BotID misjudges (a privacy browser, a corporate proxy) would otherwise be
      told "Access denied." and vanish without a trace. Flagged rows sit in contact_submissions with is_spam = true.
    */
    const bot = await checkBotId()
    if (bot.isBot) {
      const { error } = await supabase.from("contact_submissions").insert({
        form_name: form.formName, name: data.name, email: data.email, phone: data.phone || null, company: data.company || null,
        message: data.message || null, page_url: request.headers.get("referer") || null, source: form.source,
        user_agent: request.headers.get("user-agent"), is_spam: true,
      })
      if (error) console.error("Flagged submission not stored:", error)
      return NextResponse.json({ success: false, error: "We couldn't verify this submission. Please call or email us instead." }, { status: 403 })
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
        form_name: form.formName,
        name: data.name,
        first_name: firstName,
        last_name: lastName,
        email: data.email,
        phone: data.phone || null,
        company: data.company || null,
        message: data.message || null,
        page_url: request.headers.get("referer") || "https://rocketopp.com/contact",
        source: form.source,
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
      // rk_hp is the renamed trap field (company_website was autofilled by browsers); accept both while old tabs exist.
      honeypot: data.rk_hp ?? data.company_website,
      submissionId: lead?.id,
      userAgent: request.headers.get("user-agent"),
      source: form.source === "free_website" ? "rocketopp-free-website" : FormSources.CONTACT_FORM,
      formName: form.formName,
      pageUrl: request.headers.get("referer") || "https://rocketopp.com/contact",
      tags: form.tags,
    })

    // notifyFormSubmission writes the CRM id / failure reason back onto this row.
    if (!lead?.id && !result.received) {
      return NextResponse.json(
        { success: false, error: "We couldn't save your message" },
        { status: 502 }
      )
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
