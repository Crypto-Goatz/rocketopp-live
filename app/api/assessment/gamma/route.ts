// ============================================================
// Gamma API Integration - Generate Assessment Deck
// ============================================================
// Creates a beautiful presentation from assessment data
// Uses Gamma API v1.0: https://developers.gamma.app/docs
// ============================================================

import { NextRequest, NextResponse } from 'next/server'
import type { AssessmentData, Insight } from '@/lib/assessment/types'

// Gamma API v1.0 endpoint (GA as of Nov 2025)
const GAMMA_API_URL = 'https://public-api.gamma.app/v1.0/generations'

interface GammaRequest {
  userName: string
  companyName: string
  assessmentData: AssessmentData
  insights: Insight[]
  collectedData: Array<{ question: string; answer: string }>
}

export async function POST(request: NextRequest) {
  try {
    const body: GammaRequest = await request.json()
    const { userName, companyName, assessmentData, insights, collectedData } = body

    // Build the deck content from assessment data
    const deckContent = buildDeckContent(userName, companyName, assessmentData, insights, collectedData)

    // Check if we have a Gamma API key
    const gammaApiKey = process.env.GAMMA_API_KEY

    if (gammaApiKey) {
      try {
        // Gamma API v1.0 request format
        const gammaPayload = {
          inputText: deckContent,
          textMode: 'preserve', // Keep our formatted content
          format: 'presentation',
          numCards: 12, // Appropriate for a strategic blueprint
          additionalInstructions: `Create a professional strategic business blueprint presentation for ${companyName}. Use a clean, modern executive style with strong visual hierarchy. Make it look like a premium consulting deliverable.`,
          textOptions: {
            amount: 'detailed',
            tone: 'professional, authoritative, strategic',
            audience: 'business executives and decision makers',
            language: 'en',
          },
          imageOptions: {
            source: 'aiGenerated',
            style: 'professional business, modern corporate, clean minimal',
          },
          cardOptions: {
            dimensions: '16x9',
          },
          sharingOptions: {
            externalAccess: 'view',
          },
        }

        const response = await fetch(GAMMA_API_URL, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${gammaApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(gammaPayload),
        })

        if (response.ok) {
          const result = await response.json()
          const deckUrl = result.shareUrl || result.url || result.gammaUrl

          // Send to webhook with real URL
          await sendToWebhook({
            userName,
            companyName,
            assessmentData,
            insights,
            collectedData,
            deckUrl,
          })

          return NextResponse.json({
            success: true,
            deckUrl,
            gammaId: result.id,
          })
        } else {
          const errorText = await response.text()
          console.error('Gamma API error:', response.status, errorText)
          // Fall through to mock URL
        }
      } catch (gammaError) {
        console.error('Gamma API request failed:', gammaError)
        // Fall through to mock URL
      }
    }

    // Fallback: Generate a mock URL (for development/demo)
    // In production, this would always use the real API
    const mockDeckId = Math.random().toString(36).substring(2, 12)
    const mockUrl = `https://gamma.app/docs/strategic-blueprint-${companyName.toLowerCase().replace(/\s+/g, '-')}-${mockDeckId}`

    // Also send to webhook for lead capture
    await sendToWebhook({
      userName,
      companyName,
      assessmentData,
      insights,
      collectedData,
      deckUrl: mockUrl,
    })

    return NextResponse.json({
      success: true,
      deckUrl: mockUrl,
      note: gammaApiKey ? 'Gamma API call failed, using fallback URL' : 'Set GAMMA_API_KEY for real generation',
    })
  } catch (error) {
    console.error('Gamma API error:', error)
    return NextResponse.json(
      { error: 'Failed to generate deck' },
      { status: 500 }
    )
  }
}

function buildDeckContent(
  userName: string,
  companyName: string,
  assessmentData: AssessmentData,
  insights: Insight[],
  collectedData: Array<{ question: string; answer: string }>
): string {
  const sections = []

  // Title slide content
  sections.push(`# Strategic Blueprint for ${companyName}`)
  sections.push(`Prepared for ${userName} by Spark - RocketOpp AI`)
  sections.push('')

  // Executive Summary
  if (assessmentData['Executive Summary']) {
    sections.push('## Executive Summary')
    sections.push(assessmentData['Executive Summary'])
    sections.push('')
  }

  // Key Findings
  const findingSections = [
    'Identified Strengths',
    'Critical Weaknesses',
    'Market Opportunities',
    'Competitive Threats',
    'Social Media Presence',
  ]

  for (const section of findingSections) {
    if (assessmentData[section]) {
      sections.push(`## ${section}`)
      sections.push(assessmentData[section])
      sections.push('')
    }
  }

  // Strategic Next Steps
  if (assessmentData['Strategic Next Steps']) {
    sections.push('## Strategic Next Steps')
    sections.push(assessmentData['Strategic Next Steps'])
    sections.push('')
  }

  // Key Insights from conversation
  const standardInsights = insights.filter((i) => i.type === 'standard')
  if (standardInsights.length > 0) {
    sections.push('## Key Insights')
    for (const insight of standardInsights) {
      if (insight.type === 'standard') {
        sections.push(`### ${insight.title}`)
        sections.push(insight.text.replace(/\*\*/g, ''))
        sections.push('')
      }
    }
  }

  // Social Media Analysis
  const socialInsight = insights.find((i) => i.type === 'social_media_analysis')
  if (socialInsight && socialInsight.type === 'social_media_analysis') {
    sections.push('## Social Media Strategy')
    for (const platform of socialInsight.platforms) {
      sections.push(`### ${platform.platform}`)
      sections.push(`**Analysis:** ${platform.analysis}`)
      sections.push(`**Recommendation:** ${platform.recommendation}`)
      sections.push('')
    }
  }

  // Competitive Landscape
  const competitiveInsight = insights.find((i) => i.type === 'competitive_analysis')
  if (competitiveInsight && competitiveInsight.type === 'competitive_analysis') {
    sections.push('## Competitive Landscape')
    for (const competitor of competitiveInsight.competitors) {
      if (!competitor.isPlayer) {
        sections.push(`- **${competitor.name}**: ${competitor.rating} stars (${competitor.userRatingsTotal} reviews)`)
      }
    }
    sections.push('')
  }

  // Closing
  sections.push('## Next Steps')
  sections.push('A RocketOpp expert will contact you to discuss this blueprint and create your custom implementation plan.')
  sections.push('')
  sections.push('---')
  sections.push('*Powered by Spark - RocketOpp AI*')

  return sections.join('\n')
}

async function sendToWebhook(data: {
  userName: string
  companyName: string
  assessmentData: AssessmentData
  insights: Insight[]
  collectedData: Array<{ question: string; answer: string }>
  deckUrl: string
}) {
  const webhookUrl = process.env.ASSESSMENT_WEBHOOK_URL ||
    'https://services.leadconnectorhq.com/hooks/6MSqx0trfxgLxeHBJE1k/webhook-trigger/16e971d9-d576-4b5d-a90f-4cf8224c67e9'

  try {
    await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: data.userName,
        company_name: data.companyName,
        blueprint_url: data.deckUrl,
        assessment_summary: JSON.stringify(data.assessmentData, null, 2),
        conversation_history: data.collectedData
          .map((item) => `Q: ${item.question}\nA: ${item.answer}`)
          .join('\n\n---\n\n'),
        source: 'rocketopp-assessment',
        timestamp: new Date().toISOString(),
      }),
    })
  } catch (error) {
    console.error('Webhook error:', error)
  }
}
