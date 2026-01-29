// ============================================================
// Assessment Submit API - Final lead capture
// ============================================================
// CRITICAL: This endpoint captures leads from the Rocket AI Assessment
// Sends to GHL webhook for email automation + follow-up calls
// ============================================================

import { NextRequest, NextResponse } from 'next/server'
import { GHL_WEBHOOK_URL } from '@/lib/ghl/webhook'

interface Competitor {
  name: string
  rating: number
  userRatingsTotal: number
  isPlayer: boolean
}

export async function POST(request: NextRequest) {
  console.log('[Assessment Submit] Received submission request')

  try {
    const body = await request.json()
    const {
      name,
      email,
      phone,
      companyName,
      website,
      zipCode,
      industry,
      assessmentSummary,
      insights,
      conversationHistory,
      competitors,
    } = body

    console.log('[Assessment Submit] Processing lead:', { name, email, companyName })

    // Validate required fields
    if (!email) {
      console.error('[Assessment Submit] Missing email')
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    // Format assessment for email template
    const summary = assessmentSummary || {}
    const executiveSummary = summary['Executive Summary'] || 'Assessment completed. Our team will provide detailed insights.'
    const strengths = summary['Identified Strengths'] || ''
    const weaknesses = summary['Critical Weaknesses'] || ''
    const opportunities = summary['Market Opportunities'] || ''
    const threats = summary['Competitive Threats'] || ''
    const socialPresence = summary['Social Media Presence'] || ''
    const nextSteps = summary['Strategic Next Steps'] || ''

    // Format competitors list
    const competitorList = (competitors || [])
      .filter((c: Competitor) => !c.isPlayer)
      .map((c: Competitor) => `${c.name} (${c.rating}★, ${c.userRatingsTotal} reviews)`)
      .join(', ')

    // Build webhook payload with all data for email automation
    const webhookPayload = {
      // Contact fields (GHL standard)
      first_name: name?.split(' ')[0] || '',
      last_name: name?.split(' ').slice(1).join(' ') || '',
      full_name: name || '',
      email,
      phone: phone || '',
      company_name: companyName || '',
      website: website || '',

      // Custom fields for email templates
      zip_code: zipCode || '',
      industry: industry || '',

      // Assessment sections (for email body)
      executive_summary: executiveSummary,
      identified_strengths: strengths,
      critical_weaknesses: weaknesses,
      market_opportunities: opportunities,
      competitive_threats: threats,
      social_media_presence: socialPresence,
      strategic_next_steps: nextSteps,
      competitors_analyzed: competitorList || 'None identified',

      // Full data (for detailed follow-up)
      assessment_summary_json: JSON.stringify(assessmentSummary || {}, null, 2),
      conversation_history: conversationHistory || '',
      insights_json: JSON.stringify(insights || [], null, 2),

      // Source tracking
      source: 'AI Assessment',
      lead_source: 'rocketopp-ai-assessment',
      form_name: 'Rocket AI Assessment',
      page_url: 'https://rocketopp.com/assessment',

      // Tags for GHL automation
      tags: ['AI Assessment', 'Website Lead', 'Hot Lead', 'Blueprint Requested'],

      // Metadata
      timestamp: new Date().toISOString(),
      submitted_at: new Date().toISOString(),

      // Trigger flags for GHL workflows
      send_blueprint_email: true,
      schedule_followup_call: phone ? true : false,
    }

    console.log('[Assessment Submit] Sending to GHL webhook...')
    console.log('[Assessment Submit] Payload keys:', Object.keys(webhookPayload))

    // Send to GHL webhook
    const webhookResponse = await fetch(GHL_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(webhookPayload),
    })

    const webhookStatus = webhookResponse.status
    console.log('[Assessment Submit] GHL webhook response:', webhookStatus)

    if (!webhookResponse.ok) {
      const errorText = await webhookResponse.text().catch(() => 'Unknown error')
      console.error('[Assessment Submit] Webhook failed:', webhookStatus, errorText)
      // Still return success to user - lead data is logged
    } else {
      console.log('[Assessment Submit] Lead successfully sent to GHL!')
    }

    return NextResponse.json({
      success: true,
      message: 'Assessment submitted successfully',
      leadCaptured: webhookResponse.ok,
    })
  } catch (error) {
    console.error('[Assessment Submit] Error:', error)
    return NextResponse.json(
      { error: 'Failed to submit assessment' },
      { status: 500 }
    )
  }
}
