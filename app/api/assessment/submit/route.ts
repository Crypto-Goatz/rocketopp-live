// ============================================================
// Assessment Submit API - Final lead capture
// ============================================================

import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
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

    // Validate required fields
    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    // Send to GHL webhook
    const webhookUrl = process.env.ASSESSMENT_WEBHOOK_URL ||
      'https://services.leadconnectorhq.com/hooks/6MSqx0trfxgLxeHBJE1k/webhook-trigger/16e971d9-d576-4b5d-a90f-4cf8224c67e9'

    const webhookPayload = {
      name: name || '',
      email,
      phone: phone || '',
      company_name: companyName || '',
      website: website || '',
      zip_code: zipCode || '',
      blueprint_url: blueprintUrl || '',
      assessment_summary: typeof assessmentSummary === 'string'
        ? assessmentSummary
        : JSON.stringify(assessmentSummary, null, 2),
      conversation_history: conversationHistory || '',
      source: 'rocketopp-ai-assessment',
      timestamp: new Date().toISOString(),
    }

    const webhookResponse = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(webhookPayload),
    })

    if (!webhookResponse.ok) {
      console.error('Webhook failed:', webhookResponse.status)
    }

    return NextResponse.json({
      success: true,
      message: 'Assessment submitted successfully',
    })
  } catch (error) {
    console.error('Assessment submit error:', error)
    return NextResponse.json(
      { error: 'Failed to submit assessment' },
      { status: 500 }
    )
  }
}
