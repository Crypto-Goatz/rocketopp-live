import { NextRequest, NextResponse } from "next/server"
import { notifyFormSubmission, FormSources } from "@/lib/crm/notify"

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

    const result = await notifyFormSubmission({
      email: body.email,
      firstName: body.firstName,
      lastName: body.lastName,
      fullName: `${body.firstName} ${body.lastName}`,
      phone: body.phone,
      company: body.company,
      message: body.briefDescription,
      source: FormSources.PITCH_IDEA,
      formName: "Pitch Idea Form",
      pageUrl: "https://rocketopp.com/pitch-idea",
      tags,
      extras: {
        idea_stage: ideaStageLabels[body.ideaStage || ""] || body.ideaStage || "Not specified",
        industry: industryLabels[body.industry] || body.industry,
        partnership_type: partnershipLabels[body.partnershipType || ""] || body.partnershipType || "Not specified",
        target_market: body.targetMarket || "Not specified",
        lead_priority: priority,
        is_ai_idea: isAIIdea,
        is_partnership_interest: isEquityPartnership,
      },
    })

    console.log("[Pitch Idea] notify result:", {
      success: result.success,
      contactId: result.contactId,
      mikeEmailed: result.mikeEmailed,
      priority,
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
