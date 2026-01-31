import { NextRequest, NextResponse } from "next/server"
import { GHL_WEBHOOK_URL } from "@/lib/ghl/webhook"

interface PitchIdeaForm {
  firstName: string
  lastName: string
  email: string
  phone?: string
  company?: string
  ideaStage?: string
  industry: string
  partnershipType?: string
  briefDescription: string
  targetMarket?: string
}

export async function POST(request: NextRequest) {
  try {
    const body: PitchIdeaForm = await request.json()

    // Validate required fields
    if (!body.firstName || !body.email || !body.industry || !body.briefDescription) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Format labels for readability
    const ideaStageLabels: Record<string, string> = {
      "concept": "Just an idea / Concept",
      "research": "Done some research",
      "wireframes": "Have wireframes or mockups",
      "specs": "Have detailed specifications",
      "prototype": "Have a prototype/MVP",
      "existing": "Have an existing product to improve",
    }

    const industryLabels: Record<string, string> = {
      "ai": "AI / Machine Learning",
      "saas": "SaaS / Business Software",
      "healthcare": "Healthcare / MedTech",
      "fintech": "FinTech / Finance",
      "ecommerce": "E-Commerce / Retail",
      "education": "Education / EdTech",
      "productivity": "Productivity / Automation",
      "social": "Social / Community",
      "entertainment": "Entertainment / Media",
      "other": "Other",
    }

    const partnershipLabels: Record<string, string> = {
      "equity": "Equity Partnership (we build for stake)",
      "revenue": "Revenue Share Agreement",
      "cofounder": "Co-Founder Arrangement",
      "custom": "Custom Development (I pay for development)",
      "unsure": "Not sure - let's discuss options",
    }

    // Determine priority based on AI/partnership type
    const isAIIdea = body.industry === "ai"
    const isEquityPartnership = body.partnershipType === "equity" || body.partnershipType === "revenue"
    const priority = isAIIdea && isEquityPartnership ? "High" : isAIIdea || isEquityPartnership ? "Medium" : "Normal"

    // Build tags
    const tags = [
      "Pitch Idea",
      "Website Lead",
      industryLabels[body.industry] || body.industry,
    ]

    if (isAIIdea) tags.push("AI Interest")
    if (isEquityPartnership) tags.push("Partnership Interest")
    if (body.partnershipType === "cofounder") tags.push("Co-Founder Potential")

    // Send to GHL Webhook
    const webhookPayload = {
      // Contact Info
      first_name: body.firstName,
      last_name: body.lastName,
      full_name: `${body.firstName} ${body.lastName}`,
      email: body.email,
      phone: body.phone || "",
      company_name: body.company || "",

      // Idea Details
      idea_stage: ideaStageLabels[body.ideaStage || ""] || body.ideaStage || "Not specified",
      industry: industryLabels[body.industry] || body.industry,
      partnership_type: partnershipLabels[body.partnershipType || ""] || body.partnershipType || "Not specified",
      idea_description: body.briefDescription,
      target_market: body.targetMarket || "Not specified",

      // Priority & Classification
      lead_priority: priority,
      is_ai_idea: isAIIdea,
      is_partnership_interest: isEquityPartnership,

      // Source Tracking
      source: "rocketopp-pitch-idea",
      form_name: "Pitch Idea Form",
      page_url: "https://rocketopp.com/pitch-idea",

      // Tags
      tags,

      // Notes for CRM
      notes: `
APP IDEA SUBMISSION
==================
Industry: ${industryLabels[body.industry] || body.industry}
Stage: ${ideaStageLabels[body.ideaStage || ""] || "Not specified"}
Partnership: ${partnershipLabels[body.partnershipType || ""] || "Not specified"}
Target Market: ${body.targetMarket || "Not specified"}

BRIEF DESCRIPTION:
${body.briefDescription}

PRIORITY: ${priority}
${isAIIdea ? "** AI IDEA - HIGH INTEREST **" : ""}
${isEquityPartnership ? "** PARTNERSHIP INTEREST **" : ""}

NEXT STEPS:
1. Send NDA for signature
2. Schedule discovery call
3. Review idea details after NDA
      `.trim(),

      // Metadata
      submitted_at: new Date().toISOString(),
    }

    try {
      await fetch(GHL_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(webhookPayload),
      })
    } catch (webhookError) {
      console.error("[Pitch Idea] Webhook error:", webhookError)
      // Don't fail the request if webhook fails - still return success
    }

    // Log for monitoring
    console.log("[Pitch Idea] New submission:", {
      name: `${body.firstName} ${body.lastName}`,
      email: body.email,
      industry: body.industry,
      priority,
      isAIIdea,
      isEquityPartnership,
    })

    return NextResponse.json({
      success: true,
      message: "Your idea has been submitted successfully! We'll be in touch within 48-72 hours.",
    })
  } catch (error) {
    console.error("[Pitch Idea] Error:", error)
    return NextResponse.json(
      { error: "Failed to submit idea" },
      { status: 500 }
    )
  }
}
