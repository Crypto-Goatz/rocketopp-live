// AI Blog Generator using Claude
import Anthropic from '@anthropic-ai/sdk'
import { ContentOpportunity } from '../lunarcrush/client'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export interface GeneratedPost {
  slug: string
  title: string
  metaDescription: string
  excerpt: string
  content: string
  tags: string[]
  category: string
  readingTime: number
  seoKeywords: string[]
  relatedServices: string[]
  linkedinPost: string
  twitterPost: string
}

const SERVICES = [
  'Rocket+ - AI-powered CRM automation',
  'MCPFED - MCP server directory',
  'RocketPost - Social media automation',
  'CRO9 - Conversion optimization toolkit',
  'RocketEQ - Agency management'
]

async function generateBlogPost(opportunity: ContentOpportunity): Promise<GeneratedPost> {
  const sentimentText = opportunity.sentiment >= 3.5 ? 'Positive' : 'Neutral'
  
  const prompt = 'You are an expert content writer for RocketOpp, an AI App Marketplace. Generate a high-quality, SEO-optimized blog post about "' + opportunity.topic + '".\n\n' +
    'CONTEXT:\n' +
    '- Topic: ' + opportunity.topic + '\n' +
    '- Category: ' + opportunity.category + '\n' +
    '- Sentiment: ' + sentimentText + '\n' +
    '- Reasoning: ' + opportunity.reasoning + '\n\n' +
    'ROCKETOPP SERVICES:\n' + SERVICES.join('\n') + '\n\n' +
    'REQUIREMENTS:\n' +
    '1. Title: Engaging, includes keyword, under 60 chars\n' +
    '2. Meta description: 150-160 chars\n' +
    '3. Content: 800-1200 words with H2/H3 headers\n' +
    '4. Include practical tips and examples\n' +
    '5. Mention RocketOpp services naturally\n\n' +
    'OUTPUT FORMAT (JSON only):\n' +
    '{"slug":"url-slug","title":"Title","metaDescription":"Description","excerpt":"Short excerpt","content":"Markdown content","tags":["tag1"],"category":"' + opportunity.category + '","readingTime":5,"seoKeywords":["kw1"],"relatedServices":["Rocket+"],"linkedinPost":"LinkedIn text [LINK]","twitterPost":"Tweet [LINK]"}'

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 4000,
    messages: [{ role: 'user', content: prompt }]
  })

  const resContent = response.content[0]
  if (resContent.type !== 'text') throw new Error('Unexpected response type')

  let jsonStr = resContent.text
  const jsonMatch = jsonStr.match(/```(?:json)?\s*([\s\S]*?)```/)
  if (jsonMatch) jsonStr = jsonMatch[1]

  const post = JSON.parse(jsonStr.trim())
  return {
    slug: post.slug || generateSlug(post.title),
    title: post.title,
    metaDescription: post.metaDescription || post.meta_description,
    excerpt: post.excerpt,
    content: post.content,
    tags: post.tags || [],
    category: post.category || opportunity.category,
    readingTime: post.readingTime || 5,
    seoKeywords: post.seoKeywords || [],
    relatedServices: post.relatedServices || [],
    linkedinPost: post.linkedinPost || '',
    twitterPost: post.twitterPost || ''
  }
}

async function generateDailyContent(opportunities: ContentOpportunity[]): Promise<GeneratedPost[]> {
  const posts: GeneratedPost[] = []
  for (const opp of opportunities) {
    try {
      posts.push(await generateBlogPost(opp))
    } catch (e) {
      console.error('Failed to generate post for ' + opp.topic, e)
    }
  }
  return posts
}

function generateSlug(title: string): string {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').substring(0, 100)
}

export const blogGenerator = { generateBlogPost, generateDailyContent }
