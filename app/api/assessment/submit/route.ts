// ============================================================
// Assessment Submit API - Final lead capture
// ============================================================
// CRITICAL: This endpoint captures leads from the Rocket AI Assessment
// Sends to GHL webhook for email automation + follow-up calls
// ============================================================

import { NextRequest, NextResponse } from 'next/server'
import { notifyFormSubmission, FormSources } from '@/lib/crm/notify'

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

    const result = await notifyFormSubmission({
      email,
      fullName: name || '',
      phone: phone || undefined,
      company: companyName || undefined,
      source: FormSources.ASSESSMENT,
      formName: 'Rocket AI Assessment',
      pageUrl: 'https://rocketopp.com/assessment',
      tags: ['AI Assessment', 'Website Lead', 'Hot Lead', 'Blueprint Requested'],
      extras: {
        website: website || '',
        zip_code: zipCode || '',
        industry: industry || '',
        executive_summary: executiveSummary,
        identified_strengths: strengths,
        critical_weaknesses: weaknesses,
        market_opportunities: opportunities,
        competitive_threats: threats,
        social_media_presence: socialPresence,
        strategic_next_steps: nextSteps,
        competitors_analyzed: competitorList || 'None identified',
        conversation_history: (conversationHistory || '').slice(0, 4000),
      },
      customFields: {
        assessment_summary_json: JSON.stringify(assessmentSummary || {}).slice(0, 8000),
        insights_json: JSON.stringify(insights || []).slice(0, 8000),
        send_blueprint_email: true,
        schedule_followup_call: Boolean(phone),
      },
    })

    console.log('[Assessment Submit] notify result:', result)

    return NextResponse.json({
      success: true,
      message: 'Assessment submitted successfully',
      leadCaptured: result.success,
      mikeEmailed: result.mikeEmailed,
    })
  } catch (error) {
    console.error('[Assessment Submit] Error:', error)
    return NextResponse.json(
      { error: 'Failed to submit assessment' },
      { status: 500 }
    )
  }
}
