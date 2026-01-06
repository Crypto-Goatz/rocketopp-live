"use server"

import { generateText } from "ai"
import { createGroq } from "@ai-sdk/groq"

const groq = createGroq({
  apiKey: process.env.GROQ_API_KEY,
})

interface PersonalizedContentInput {
  firstName: string
  industry: string
  companyName: string
}

interface PersonalizedContent {
  headline: string
  subheadline: string
  painPoints: string[]
  solutions: string[]
  benefits: string[]
  cta: string
  industryInsight: string
}

export async function generatePersonalizedContent(input: PersonalizedContentInput): Promise<PersonalizedContent> {
  const displayIndustry = input.industry
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")

  const prompt = `You are an award-winning CRO (Conversion Rate Optimization) expert and marketing guru with 25 years of experience helping businesses grow through AI and technology. Your job is to create highly personalized, conversion-focused content for a visitor to RocketOpp's website.

VISITOR INFORMATION:
- First Name: ${input.firstName}
- Industry: ${displayIndustry}
- Company Name: ${input.companyName || "Not provided"}

ROCKETOPP SERVICES:
1. AI-Powered CRM (starting at $5,000 - 90% less than industry standard)
2. Custom Website Design & Development
3. SEO & Conversion Rate Optimization
4. Business Automation & AI Integration
5. Digital Marketing Services

YOUR TASK:
Create personalized content that speaks directly to ${input.firstName}'s ${displayIndustry} business challenges. The content should:
1. Acknowledge specific pain points common in the ${displayIndustry} industry
2. Present RocketOpp's solutions as the perfect fit
3. Use persuasive, benefit-driven language
4. Create urgency without being pushy
5. Feel personal and tailored, not generic

Respond in this exact JSON format (no markdown, just pure JSON):
{
  "headline": "A powerful, personalized headline that includes their name and speaks to their industry (max 15 words)",
  "subheadline": "A compelling subheadline that hints at transformation (max 25 words)",
  "painPoints": ["3 specific challenges ${displayIndustry} businesses commonly face"],
  "solutions": ["3 RocketOpp solutions that directly address those pain points"],
  "benefits": ["3 tangible benefits with specific metrics when possible"],
  "cta": "A compelling call-to-action phrase (max 6 words)",
  "industryInsight": "A powerful, data-driven insight about the ${displayIndustry} industry and AI adoption (1-2 sentences)"
}`

  try {
    const { text } = await generateText({
      model: groq("llama-3.3-70b-versatile"),
      prompt,
      temperature: 0.7,
      maxTokens: 1000,
    })

    // Parse the JSON response
    const cleanedText = text.replace(/```json\n?|\n?```/g, "").trim()
    const content = JSON.parse(cleanedText) as PersonalizedContent

    return content
  } catch (error) {
    console.error("Failed to generate personalized content:", error)

    // Return fallback content
    return {
      headline: `${input.firstName}, Transform Your ${displayIndustry} Business with AI`,
      subheadline: `Discover how RocketOpp's enterprise-grade solutions can revolutionize ${input.companyName || "your company"}`,
      painPoints: [
        "Struggling with manual processes that waste hours daily",
        "Losing leads due to slow follow-up times",
        "Competitors using technology you don't have access to",
      ],
      solutions: [
        "AI-powered automation that works 24/7",
        "Instant lead capture and nurturing systems",
        "Enterprise technology at small business prices",
      ],
      benefits: [
        "Save 20+ hours per week on repetitive tasks",
        "Increase conversion rates by up to 300%",
        "Access the same tools Fortune 500 companies use",
      ],
      cta: "Start Your Free AI Assessment",
      industryInsight: `The ${displayIndustry} industry is rapidly evolving, and businesses that embrace AI are seeing 3x faster growth than those who don't.`,
    }
  }
}
