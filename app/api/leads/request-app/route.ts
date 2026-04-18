import { NextRequest, NextResponse } from "next/server"
import { notifyFormSubmission, FormSources } from "@/lib/crm/notify"

interface RequestAppForm {
  firstName: string
  lastName: string
  email: string
  phone?: string
  company?: string
  appType: string
  budget?: string
  timeline?: string
  description: string
}

export async function POST(request: NextRequest) {
  try {
    const body: RequestAppForm = await request.json()

    // Validate required fields
    if (!body.firstName || !body.email || !body.appType || !body.description) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Format app type for readability
    const appTypeLabels: Record<string, string> = {
      "mobile-ios": "iOS Mobile App",
      "mobile-android": "Android Mobile App",
      "mobile-cross": "Cross-Platform Mobile App",
      "web-app": "Web Application",
      "saas": "SaaS Platform",
      "ai-powered": "AI-Powered Application",
      "enterprise": "Enterprise Solution",
      "ecommerce": "E-Commerce Platform",
      "other": "Other / Not Sure Yet",
    }

    const budgetLabels: Record<string, string> = {
      "15k-25k": "$15,000 - $25,000 (MVP)",
      "25k-50k": "$25,000 - $50,000",
      "50k-100k": "$50,000 - $100,000",
      "100k-250k": "$100,000 - $250,000",
      "250k+": "$250,000+",
      "not-sure": "Not Sure / Need Guidance",
    }

    const timelineLabels: Record<string, string> = {
      "asap": "ASAP - Ready to Start",
      "1-month": "Within 1 Month",
      "1-3-months": "1-3 Months",
      "3-6-months": "3-6 Months",
      "exploring": "Just Exploring Options",
    }

    const result = await notifyFormSubmission({
      email: body.email,
      firstName: body.firstName,
      lastName: body.lastName,
      fullName: `${body.firstName} ${body.lastName}`,
      phone: body.phone,
      company: body.company,
      message: body.description,
      source: FormSources.REQUEST_APP,
      formName: "Request App Form",
      pageUrl: "https://rocketopp.com/request-app",
      tags: ["App Request", "Website Lead", body.appType].filter(Boolean) as string[],
      extras: {
        app_type: appTypeLabels[body.appType] || body.appType,
        budget_range: budgetLabels[body.budget || ""] || body.budget || "Not specified",
        timeline: timelineLabels[body.timeline || ""] || body.timeline || "Not specified",
      },
    })

    console.log("[Request App] notify result:", {
      success: result.success,
      contactId: result.contactId,
      mikeEmailed: result.mikeEmailed,
    })

    return NextResponse.json({
      success: true,
      message: "Your app request has been submitted successfully!",
    })
  } catch (error) {
    console.error("[Request App] Error:", error)
    return NextResponse.json(
      { error: "Failed to submit request" },
      { status: 500 }
    )
  }
}
