"use server"

import { openai } from "@ai-sdk/openai"
import { generateText } from "ai"
import type { Industry, PrimaryNeed } from "@/lib/personalization-store"

const getIndustryDisplayName = (industry: Industry | null): string => {
  if (!industry || industry === "other") return "Your Industry"
  return industry
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
}

const getPrimaryNeedDisplayName = (need: PrimaryNeed | null, companyName: string | null): string => {
  if (!need) return "Your Primary Need"
  switch (need) {
    case "website-help":
      return companyName ? `The ${companyName}'s Website` : "My Company's Website"
    case "online-marketing":
      return "Online Marketing"
    case "automating-tasks":
      return "Automating Tasks"
    case "customer-management":
      return "Customer Management"
    case "leads-sales":
      return "Leads & Sales"
    case "app-development":
      return "App Development"
    case "ai-integration":
      return companyName ? `Integrating AI into ${companyName}` : "Integrating AI into My Company"
    default:
      return "Specific Area of Focus"
  }
}

export interface PersonalizationDataForAssessment {
  industry: Industry | null
  userName: string | null
  companyName: string | null
  zipCode: string | null
  primaryNeed: PrimaryNeed | null
  // hasWebsite and websiteAddress removed from data expected by this action
  userTitle: string | null
}

export interface CompetitorProfile {
  competitorName: string
  onlinePresenceStrengths: string[]
  onlinePresenceWeaknesses: string[]
  opportunityForYou: string
}

export interface AiAssessment {
  assessmentTitle: string
  introduction: string
  localMarketSnapshot: {
    zipCode: string
    industry: string
    overview: string
    competitorProfiles: CompetitorProfile[]
    opportunityInsights: string[]
  }
  strategicProposal: {
    title: string
    focusArea: string
    campaignConcept: {
      name: string
      description: string
      keyServices: string[]
      expectedOutcome: string
    }
  }
  // websiteAudit section removed
  nextSteps: string
  rawResponse?: string
}

export async function generateAiAssessmentAction(
  data: PersonalizationDataForAssessment,
): Promise<{ assessment?: AiAssessment; error?: string }> {
  if (!process.env.OPENAI_API_KEY) {
    console.error("OPENAI_API_KEY is not set.")
    return { error: "AI service is currently unavailable. Please try again later." }
  }

  const industryDisplayName = getIndustryDisplayName(data.industry)
  const primaryNeedDisplayName = getPrimaryNeedDisplayName(data.primaryNeed, data.companyName)

  const prompt = `
    You are an expert business strategy consultant working for RocketOpp, a cutting-edge digital solutions provider specializing in website development, AI integration, and online marketing.
    Your task is to generate a personalized AI Assessment for a potential client.

    Client Details:
    - Name: ${data.userName || "Valued Client"}
    - Company Name: ${data.companyName || "Your Company"}
    - Industry: ${industryDisplayName}
    - Zip Code: ${data.zipCode || "Their Local Area"}
    - Primary Need: ${primaryNeedDisplayName}
    - Title: ${data.userTitle || "Key Decision Maker"}
    
    Assessment Requirements:
    1.  **Local Market Snapshot**:
        *   Provide a brief overview of the digital landscape for the client's industry, considering a typical area like their zip code.
        *   Identify three *hypothetical but realistic types* of local competitors (e.g., "The Established Local Player," "The Niche Online Specialist," "The Budget-Friendly Option"). For each:
            *   Describe typical online presence strengths.
            *   Describe typical online presence weaknesses.
            *   Suggest an opportunity for the client's company, with RocketOpp's help, to outperform them.
        *   Include 2-3 *illustrative* opportunity insights or statistics relevant to their industry and primary need (e.g., "Businesses in ${industryDisplayName} leveraging AI for customer service report an average 25% increase in satisfaction."). These should be plausible but not require real-time data.
    2.  **Strategic Proposal for RocketOpp Services**:
        *   Focus on the client's stated "Primary Need."
        *   Develop a creative and compelling campaign concept. Give it a catchy name.
        *   Describe the campaign, outlining key RocketOpp services that would be involved (e.g., "AI-Powered Content Strategy," "Hyper-Local SEO Optimization," "Interactive Web Platform Development").
        *   Explain the expected outcome and benefits for the client.
    3.  **Tone**: Professional, insightful, optimistic, and slightly futuristic, reflecting RocketOpp's brand.

    Output Format:
    Return a JSON object (and only the JSON object, no surrounding text or markdown backticks) with the following structure:
    {
      "assessmentTitle": "Your Custom AI-Powered Growth Plan for [CompanyName]",
      "introduction": "A brief intro personalized with user name and company name.",
      "localMarketSnapshot": {
        "zipCode": "[UserZipCode]",
        "industry": "[UserIndustryDisplayName]",
        "overview": "A general overview of the digital landscape for this industry in a typical area like yours.",
        "competitorProfiles": [
          {
            "competitorName": "Typical Competitor A (e.g., 'Local Biz Solutions')",
            "onlinePresenceStrengths": ["Strong local SEO", "Active social media"],
            "onlinePresenceWeaknesses": ["Outdated website design", "No clear call to action"],
            "opportunityForYou": "How RocketOpp can help [CompanyName] outperform them."
          }
          // ... 2 more competitor profiles
        ],
        "opportunityInsights": [
          "Illustrative statistic 1: e.g., 'Businesses in [UserIndustryDisplayName] with a modern website see X% more engagement.'",
          "Illustrative statistic 2: e.g., 'Local searches for ''[relevant keyword]'' have increased by Y% in areas similar to yours.'"
        ]
      },
      "strategicProposal": {
        "title": "RocketOpp's Strategic Blueprint for Your Success",
        "focusArea": "[UserPrimaryNeedDisplayName]",
        "campaignConcept": {
          "name": "Creative Campaign Name (e.g., 'Digital Dominance for [CompanyName]')",
          "description": "A detailed, creative campaign idea tailored to their primary need and industry.",
          "keyServices": ["Service 1 (e.g., Advanced Website Redevelopment)", "Service 2 (e.g., AI-Powered SEO Strategy)"],
          "expectedOutcome": "How this campaign will help achieve their goals."
        }
      },
      "nextSteps": "Encouragement to schedule a call to discuss the plan in detail and how RocketOpp can bring it to life."
    }

    Ensure all placeholder values like [CompanyName], [UserZipCode], [UserIndustryDisplayName], [UserPrimaryNeedDisplayName] are filled with the actual client data provided above.
    Make the competitor names and insights creative and relevant to the client's industry.
    The language should be engaging and clearly articulate the value RocketOpp provides.
    `

  try {
    const { text } = await generateText({
      model: openai("gpt-4o"),
      prompt: prompt,
    })

    let jsonText = text
    const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/)
    if (jsonMatch && jsonMatch[1]) {
      jsonText = jsonMatch[1]
    }

    const assessment = JSON.parse(jsonText) as AiAssessment
    return { assessment }
  } catch (e: any) {
    console.error("Error generating AI assessment:", e)
    console.error("Raw AI Response that caused error:", text)
    return {
      error: `Failed to generate AI assessment. ${e.message}`,
      assessment: { rawResponse: text } as AiAssessment,
    }
  }
}
