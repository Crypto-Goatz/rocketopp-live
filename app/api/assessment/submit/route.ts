// ============================================================
// Assessment Submit API - Final lead capture
// ============================================================
// CRITICAL: This endpoint captures leads from the AI Assessment
// Sends to GHL webhook for immediate lead processing
// ============================================================

import { NextRequest, NextResponse } from 'next/server'

// GHL Webhook for RocketOpp location
const GHL_WEBHOOK_URL = 'https://services.leadconnectorhq.com/hooks/6MSqx0trfxgLxeHBJE1k/webhook-trigger/16e971d9-d576-4b5d-a90f-4cf8224c67e9'

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
      blueprintUrl,
      assessmentSummary,
      conversationHistory,
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

    // Build webhook payload
    const webhookPayload = {
      // Contact fields (GHL standard)
      first_name: name?.split(' ')[0] || '',
      last_name: name?.split(' ').slice(1).join(' ') || '',
      full_name: name || '',
      email,
      phone: phone || '',
      company_name: companyName || '',
      website: website || '',

      // Custom fields
      zip_code: zipCode || '',
      blueprint_url: blueprintUrl || '',
      assessment_summary: typeof assessmentSummary === 'string'
        ? assessmentSummary
        : JSON.stringify(assessmentSummary, null, 2),
      conversation_history: conversationHistory || '',

      // Source tracking
      source: 'AI Assessment',
      lead_source: 'rocketopp-ai-assessment',
      form_name: 'Rocket AI Assessment',
      page_url: 'https://rocketopp.com/assessment',

      // Tags for GHL automation
      tags: ['AI Assessment', 'Website Lead', 'Hot Lead'],

      // Metadata
      timestamp: new Date().toISOString(),
      submitted_at: new Date().toISOString(),
    }

    console.log('[Assessment Submit] Sending to GHL webhook...')

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
