import { NextRequest, NextResponse } from "next/server"

// GHL Webhook for lead capture
const GHL_WEBHOOK_URL = process.env.LEADS_WEBHOOK_URL ||
  "https://services.leadconnectorhq.com/hooks/6MSqx0trfxgLxeHBJE1k/webhook-trigger/16e971d9-d576-4b5d-a90f-4cf8224c67e9"

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

    // Send to GHL Webhook
    const webhookPayload = {
      // Contact Info
      first_name: body.firstName,
      last_name: body.lastName,
      full_name: `${body.firstName} ${body.lastName}`,
      email: body.email,
      phone: body.phone || "",
      company_name: body.company || "",

      // App Request Details
      app_type: appTypeLabels[body.appType] || body.appType,
      budget_range: budgetLabels[body.budget || ""] || body.budget || "Not specified",
      timeline: timelineLabels[body.timeline || ""] || body.timeline || "Not specified",
      project_description: body.description,

      // Source Tracking
      source: "rocketopp-request-app",
      form_name: "Request App Form",
      page_url: "https://rocketopp.com/request-app",

      // Tags
      tags: ["App Request", "Website Lead", body.appType].filter(Boolean),

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
      console.error("[Request App] Webhook error:", webhookError)
      // Don't fail the request if webhook fails - still return success
    }

    // Also send notification email (backup)
    try {
      // This could be enhanced with Resend or another email service
      console.log("[Request App] New submission:", {
        name: `${body.firstName} ${body.lastName}`,
        email: body.email,
        appType: body.appType,
      })
    } catch (emailError) {
      console.error("[Request App] Email error:", emailError)
    }

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
