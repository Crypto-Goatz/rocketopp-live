import { NextRequest, NextResponse } from "next/server"
import { checkBotId } from "botid/server"
import { createClient } from "@supabase/supabase-js"
import { notifyFormSubmission, FormSources } from "@/lib/crm/notify"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

/**
 * The forms that post here. "free_website" is the old free-website consultation (retired 2026-11-23; kept so open tabs
 * still land). "year_end" is the year-end website offer form (Mike, 2026-11-23) — see handleYearEnd below.
 */
const FORMS: Record<string, { formName: string; source: string; tags: string[] }> = {
  contact: { formName: "Contact Form", source: "contact_form", tags: ["Website Lead", "Contact Form"] },
  free_website: { formName: "Free Website Consultation", source: "free_website", tags: ["Website Lead", "Free Website Consultation"] },
  year_end: { formName: "Year-End Website Offer", source: "rocketopp-year-end-form", tags: ["website-prospect", "site-form", "ye-249"] },
}

/*
  THE YEAR-END OFFER (Mike, 2026-11-23). The price lives ONLY here, server-side, and is returned after a real submit —
  the page HTML and JS never contain it ("Fill out your details to reveal the price"). The opportunity goes into the same
  pipeline + stage the daily-scan website prospects sit in (Rocket Life-Cycle -> Lead, confirmed via
  GET /opportunities/pipelines 2026-11-23). NO email is sent by the site or the CRM: Mike's Mac outreach runner picks up
  the `site-form` tag and sends one personal email.
*/
const YEAR_END = {
  price: 249,
  reveal: { price: "$249", headline: "$249 — flat, custom website, through December 31.", next: "Check your inbox — Mike is sending you the details.", bookUrl: "https://rocketappointments.com/book" },
  pipelineId: "k2sd9EgTSSG0PYtfMGXR",
  pipelineStageId: "002233d5-a478-4889-8998-8dbd4d16ee75",
  crmSource: "rocketopp.com year-end form",
}

const clean = (v: unknown, max = 200) => (typeof v === "string" ? v.trim().slice(0, max) : "")

async function handleYearEnd(request: NextRequest, data: Record<string, unknown>) {
  const form = FORMS.year_end
  const firstName = clean(data.firstName, 80)
  const lastName = clean(data.lastName, 80)
  const email = clean(data.email, 200).toLowerCase()
  const phone = clean(data.phone, 40)
  const business = clean(data.business, 160)
  const noWebsite = data.noWebsite === true
  const website = noWebsite ? "" : clean(data.website, 300)
  const city = clean(data.city, 100)
  const state = clean(data.state, 40)
  const trade = clean(data.trade, 120)
  const fullName = `${firstName} ${lastName}`.trim()
  const pageUrl = request.headers.get("referer") || "https://rocketopp.com"
  const agent = request.headers.get("user-agent")

  if (!firstName || !email || !business) {
    return NextResponse.json({ success: false, error: "First name, email and business name are required" }, { status: 400 })
  }

  const bot = await checkBotId()
  if (bot.isBot) {
    const { error } = await supabase.from("contact_submissions").insert({
      form_name: form.formName, name: fullName, email, phone: phone || null, company: business,
      message: trade || null, page_url: pageUrl, source: form.source, user_agent: agent, is_spam: true,
    })
    if (error) console.error("Flagged submission not stored:", error)
    return NextResponse.json({ success: false, error: "We couldn't verify this submission. Please call or email us instead." }, { status: 403 })
  }

  const note = [
    "Year-end website form — rocketopp.com",
    `Name: ${fullName}`,
    `Business: ${business}`,
    `Email: ${email}`,
    `Phone: ${phone || "—"}`,
    `Current website: ${noWebsite ? "I don't have one yet" : website || "—"}`,
    `City: ${city || "—"}`,
    `State: ${state || "—"}`,
    `What the business does: ${trade || "—"}`,
    `Page: ${pageUrl}`,
    `Price shown: ${YEAR_END.reveal.price}`,
    `Submitted: ${new Date().toISOString()}`,
  ].join("\n")

  const result = await notifyFormSubmission({
    email, firstName, lastName, fullName, phone: phone || undefined, company: business,
    message: trade || undefined,
    website: website || undefined, city: city || undefined, state: state || undefined,
    honeypot: typeof data.rk_hp === "string" ? data.rk_hp : undefined,
    userAgent: agent,
    source: form.source, formName: form.formName, crmSource: YEAR_END.crmSource, pageUrl,
    tags: form.tags, additiveTags: true, quiet: true,
    extras: { website: noWebsite ? "none" : website, city, state, trade },
    opportunity: { pipelineId: YEAR_END.pipelineId, pipelineStageId: YEAR_END.pipelineStageId, monetaryValue: YEAR_END.price, name: `${business} — year-end website` },
    note,
  })

  if (!result.received) {
    return NextResponse.json({ success: false, error: "We couldn't save your details" }, { status: 502 })
  }
  return NextResponse.json({ success: true, reveal: YEAR_END.reveal, contactId: result.contactId, opportunityId: result.opportunityId ?? null })
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    if (data?.form === "year_end") return await handleYearEnd(request, data)
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
