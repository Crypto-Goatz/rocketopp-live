"use server"

import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"
import { z } from "zod"

const AiResponseSchema = z.object({
  solution: z.string().min(50, "Solution text must be substantial."), // Increased min length
  imageConcept: z.string().min(1, "Image concept cannot be empty."),
})

export interface AiSearchResult {
  originalQuery: string
  solutionText: string
  imageQuery: string
  error?: string
}

export async function aiSearchAction(userQuery: string): Promise<AiSearchResult> {
  if (!userQuery || userQuery.trim() === "") {
    return {
      originalQuery: userQuery,
      solutionText: "",
      imageQuery: "",
      error: "Query cannot be empty.",
    }
  }

  try {
    const prompt = `
You are a highly knowledgeable and articulate AI assistant for RocketOpp, a company specializing in innovative web design, digital marketing, and AI solutions.
A user has presented the following problem or question: "${userQuery}"

Your primary task is to provide a comprehensive and detailed solution or perspective related to RocketOpp's services (web design, marketing, AI).
This solution should be:
- Between 850 and 2000 words in length.
- Actionable, insightful, and optimistic.
- Structured logically. You can use paragraphs, and where appropriate for clarity (e.g., for steps, key considerations, or benefits), use bullet points.
- Professionally toned, reflecting RocketOpp's expertise.
- Directly address the user's query, offering specific ways RocketOpp could assist or how relevant technologies/strategies could be applied.

Your secondary task is to suggest a simple, descriptive concept for an image that visually represents THE USER'S STATED PROBLEM: "${userQuery}".
- The imageConcept MUST directly and clearly visualize this problem.
- It should be a concise phrase.
- For example, if the user's problem is 'my business has very low online visibility', a good imageConcept could be 'magnifying glass failing to find a small business icon among many larger ones' or 'business owner looking at an empty website traffic graph'.
- If the user's problem is 'struggling to convert website visitors into customers', a good imageConcept could be 'website visitors bouncing off a webpage like a trampoline' or 'leaky sales funnel with customers falling out'.

Return your response STRICTLY as a valid JSON object with two keys: "solution" (string) and "imageConcept" (string).
Do NOT include any text or explanations outside of this JSON object.

Example JSON structure:
{
  "solution": "Addressing your challenge of [user's specific challenge, e.g., 'low website traffic'] requires a multi-faceted approach. RocketOpp specializes in crafting bespoke strategies to significantly enhance online visibility and drive targeted engagement. Here's a detailed breakdown of how we can help:\\n\\n**1. Comprehensive SEO Audit & Strategy Development:**\\nWe begin by conducting an in-depth audit of your current online presence... (continue with detailed explanation, benefits, steps, etc., ensuring total length is 850-2000 words)...\\n\\n**2. Advanced Content Marketing:**\\nHigh-quality, relevant content is the cornerstone of modern SEO and audience engagement... (details)...\\n\\n**3. Technical SEO Optimization:**\\nEnsuring your website is technically sound is crucial for search engine crawlers and user experience... (details)...\\n\\n**4. Targeted PPC Campaigns (Optional but Recommended):**\\nWhile organic growth is key, Pay-Per-Click advertising can provide an immediate boost... (details)...\\n\\nBy implementing these strategies, RocketOpp can help transform your online presence, turning your website into a powerful engine for growth. We are confident that a tailored plan will address your concerns about low website traffic effectively and deliver measurable results.",
  "imageConcept": "Small, dim light bulb (representing low visibility) being gradually brightened by a focused beam of light (representing RocketOpp's solution)"
}
`
    // console.log("Sending prompt to AI:", prompt)

    const { text } = await generateText({
      model: openai("gpt-4o"),
      prompt: prompt,
      temperature: 0.65, // Slightly lower for more focused, detailed response
      maxTokens: 3500, // Increased to accommodate longer responses (approx 2000 words + prompt + JSON)
    })

    // console.log("Raw AI response text:", text)

    let parsedResponse
    try {
      const jsonMatch = text.match(/{[\s\S]*}/)
      if (!jsonMatch) {
        throw new Error("No JSON object found in AI response.")
      }
      parsedResponse = JSON.parse(jsonMatch[0])
    } catch (parseError) {
      console.error("Failed to parse AI response JSON:", parseError)
      console.error("Problematic AI response:", text)
      return {
        originalQuery: userQuery,
        solutionText:
          "I had a little trouble formatting my thoughts perfectly into the required structure. However, for your query: " +
          userQuery +
          ", RocketOpp can definitely assist with innovative and detailed solutions. Please contact us for a personalized discussion!",
        imageQuery: "creative abstract solution for " + userQuery.substring(0, 30), // Fallback image
        error: "AI response format error. The AI's output could not be parsed as expected.",
      }
    }

    const validationResult = AiResponseSchema.safeParse(parsedResponse)

    if (!validationResult.success) {
      console.error("AI response validation failed:", validationResult.error.flatten())
      // Provide more specific feedback if possible, e.g., if solution is too short
      let specificError = "AI response validation error."
      if (
        validationResult.error.issues.some((issue) => issue.path.includes("solution") && issue.code === "too_small")
      ) {
        specificError = "The AI's solution was too brief. It needs to be more detailed."
      }

      return {
        originalQuery: userQuery,
        solutionText: `The AI provided a response, but it didn't fully meet the structural or content requirements (e.g., length, format). RocketOpp is capable of addressing: "${userQuery}" with a comprehensive strategy. We encourage a direct consultation for optimal results.`,
        imageQuery: "abstract technology concept related to " + userQuery.substring(0, 30),
        error: specificError,
      }
    }

    return {
      originalQuery: userQuery,
      solutionText: validationResult.data.solution,
      imageQuery: validationResult.data.imageConcept,
    }
  } catch (error) {
    console.error("Error in AI Search Action:", error)
    let errorMessage = "An unexpected error occurred while contacting the AI service."
    if (error instanceof Error) {
      errorMessage = error.message
    }
    return {
      originalQuery: userQuery,
      solutionText: "",
      imageQuery: "",
      error: `AI service error: ${errorMessage}`,
    }
  }
}
