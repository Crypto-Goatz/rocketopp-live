// ============================================================
// RocketOpp Blog - AI Content Generation Engine
// ============================================================
// Generates SEO-optimized blog posts using Claude AI
// Supports topic suggestions, keyword research, and auto-publishing
// ============================================================

import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { supabaseAdmin } from '@/lib/db/supabase'

const anthropic = new Anthropic()

// SEO configuration for optimal content
const SEO_CONFIG = {
  CATEGORIES: [
    'AI & Automation',
    'Digital Transformation',
    'Marketing',
    'Technology',
    'Business Strategy',
    'Case Studies'
  ],
  MIN_WORDS: 1800,
  MAX_WORDS: 2800,
  MIN_READING_TIME: 7,
  MAX_READING_TIME: 12,
  MIN_HEADINGS: 6,
  MAX_HEADINGS: 10,
  MIN_FAQS: 5,
  MAX_FAQS: 8
}

// Topics pool for daily generation - Traffic-focused, service-aligned content
const TOPIC_POOL = [
  // AI & Automation (High-intent traffic drivers)
  { topic: 'How to Automate Your Business in 2026: Complete Guide', category: 'AI & Automation', keywords: ['business automation', 'automate business', 'automation tools', 'workflow automation'] },
  { topic: 'AI Chatbots vs Human Support: Which is Better for Business?', category: 'AI & Automation', keywords: ['AI chatbot', 'business chatbot', 'customer service automation', 'AI support'] },
  { topic: 'How AI Agents Are Revolutionizing Small Business Operations', category: 'AI & Automation', keywords: ['AI agents', 'business automation', 'small business AI', 'workflow automation'] },
  { topic: 'Building Your First AI-Powered Marketing Funnel', category: 'Marketing', keywords: ['AI marketing', 'marketing funnel', 'lead generation', 'automated marketing'] },
  { topic: 'The Complete Guide to CRM Automation in 2026', category: 'Technology', keywords: ['CRM automation', 'sales automation', 'customer management', 'CRM tools'] },
  { topic: 'How to Implement Conversational AI for Customer Service', category: 'AI & Automation', keywords: ['conversational AI', 'chatbots', 'customer service', 'AI support'] },
  { topic: 'Automating Lead Follow-Up: The Complete Guide', category: 'AI & Automation', keywords: ['lead follow up', 'sales automation', 'lead nurturing', 'automated sales'] },
  { topic: 'How to Generate Leads While You Sleep', category: 'Marketing', keywords: ['lead generation', 'passive leads', 'automated marketing', '24/7 marketing'] },

  // Website & SEO (Service-focused traffic)
  { topic: 'Website Redesign ROI: Is It Worth the Investment?', category: 'Digital Transformation', keywords: ['website redesign', 'website ROI', 'business website', 'web design cost'] },
  { topic: 'Local SEO Strategies That Actually Work in 2026', category: 'Marketing', keywords: ['local SEO', 'SEO strategies', 'local business SEO', 'Google My Business'] },
  { topic: 'Website Speed Benchmarks: How Fast Should Your Site Load?', category: 'Technology', keywords: ['website speed', 'page load time', 'website performance', 'Core Web Vitals'] },
  { topic: 'E-commerce Website Mistakes That Kill Conversions', category: 'Business Strategy', keywords: ['ecommerce website', 'conversion optimization', 'online store', 'ecommerce mistakes'] },
  { topic: 'Why Local Businesses Are Winning with AI-Powered SEO', category: 'Marketing', keywords: ['local SEO', 'AI SEO', 'local business', 'search optimization'] },

  // App Development
  { topic: 'Mobile App vs Web App: Which Should You Build?', category: 'Technology', keywords: ['mobile app vs web app', 'app development', 'business app', 'custom software'] },
  { topic: 'Custom App Development Cost Guide for 2026', category: 'Business Strategy', keywords: ['app development cost', 'custom app pricing', 'software development cost'] },

  // Comparison Posts (High traffic potential)
  { topic: 'GoHighLevel vs HubSpot: Complete CRM Comparison', category: 'Technology', keywords: ['GoHighLevel vs HubSpot', 'CRM comparison', 'best CRM', 'CRM review'] },
  { topic: 'Top 10 Business Automation Platforms Compared', category: 'Technology', keywords: ['automation platforms', 'business automation tools', 'automation software'] },
  { topic: 'AI Writing Tools Comparison: Which Should You Use?', category: 'AI & Automation', keywords: ['AI writing tools', 'AI content', 'ChatGPT alternatives', 'AI comparison'] },

  // Industry-Specific
  { topic: 'AI Tools Every Real Estate Agent Needs in 2026', category: 'AI & Automation', keywords: ['real estate AI', 'realtor automation', 'real estate technology'] },
  { topic: 'How Law Firms Are Using AI to Win More Cases', category: 'AI & Automation', keywords: ['legal AI', 'law firm automation', 'legal technology'] },
  { topic: 'Healthcare Practice Automation: Implementation Guide', category: 'Digital Transformation', keywords: ['healthcare automation', 'medical practice software', 'healthcare technology'] },

  // Original topics
  { topic: 'AI Content Creation: Best Practices for Authentic Brand Voice', category: 'Marketing', keywords: ['AI content', 'content creation', 'brand voice', 'content marketing'] },
  { topic: 'Digital Transformation Roadmap for Service-Based Businesses', category: 'Digital Transformation', keywords: ['digital transformation', 'service business', 'business modernization'] },
  { topic: 'Measuring ROI on AI Investments: A Practical Framework', category: 'Business Strategy', keywords: ['AI ROI', 'technology investment', 'business metrics', 'AI analytics'] },
  { topic: 'The Rise of No-Code AI Tools: What Business Owners Need to Know', category: 'Technology', keywords: ['no-code AI', 'AI tools', 'business tools', 'automation platforms'] },
  { topic: 'Personalizing Customer Journeys with Machine Learning', category: 'Marketing', keywords: ['personalization', 'machine learning', 'customer journey', 'AI marketing'] },
  { topic: 'The Future of Email Marketing: AI-Driven Campaigns', category: 'Marketing', keywords: ['email marketing', 'AI email', 'campaign automation', 'email optimization'] },
  { topic: 'Building a Data-Driven Culture in Your Organization', category: 'Business Strategy', keywords: ['data-driven', 'business analytics', 'organizational culture', 'data strategy'] },
  { topic: 'Voice AI: The Next Frontier in Customer Engagement', category: 'Technology', keywords: ['voice AI', 'voice assistants', 'customer engagement', 'voice technology'] },
  { topic: 'Scaling Your Business with Intelligent Process Automation', category: 'AI & Automation', keywords: ['process automation', 'business scaling', 'IPA', 'workflow optimization'] }
]

interface GenerateRequest {
  topic?: string
  category?: string
  keywords?: string[]
  autoPublish?: boolean
}

interface GeneratedPost {
  title: string
  slug: string
  meta_description: string
  excerpt: string
  content: string
  category: string
  tags: string[]
  seo_keywords: string[]
  reading_time: number
  related_services: string[]
}

// Generate URL-friendly slug from title
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
    .substring(0, 80)
}

// Calculate reading time (average 200 words per minute)
function calculateReadingTime(content: string): number {
  const words = content.split(/\s+/).length
  return Math.ceil(words / 200)
}

// Get a random topic from pool (avoiding recent topics)
async function selectTopic(): Promise<{ topic: string; category: string; keywords: string[] }> {
  // Get recently published slugs to avoid repetition
  const { data: recentPosts } = await supabaseAdmin
    .from('blog_posts')
    .select('slug, title')
    .order('created_at', { ascending: false })
    .limit(10)

  const recentTitles = recentPosts?.map(p => p.title.toLowerCase()) || []

  // Filter out recent topics
  const availableTopics = TOPIC_POOL.filter(t =>
    !recentTitles.some(recent => recent.includes(t.topic.toLowerCase().split(':')[0]))
  )

  // If all topics used recently, use full pool
  const pool = availableTopics.length > 0 ? availableTopics : TOPIC_POOL

  // Random selection
  return pool[Math.floor(Math.random() * pool.length)]
}

// Generate blog content using Claude
async function generateBlogContent(
  topic: string,
  category: string,
  keywords: string[]
): Promise<GeneratedPost> {
  const systemPrompt = `You are an expert content strategist and SEO copywriter for RocketOpp, a company specializing in AI-powered automation and digital transformation for businesses.

Your task is to write SEO-optimized, engaging blog content that:
- Establishes RocketOpp as a thought leader
- Provides actionable value to readers
- Incorporates keywords naturally (0.6-1.2% density)
- Uses proper markdown formatting
- Includes compelling headers every 180-260 words
- Maintains a professional yet approachable tone
- Reading level: Grade 7-9 (accessible but not dumbed down)

Output must be valid JSON matching this structure exactly:
{
  "title": "Compelling SEO title (55-65 chars)",
  "meta_description": "Engaging meta description with keyword (150-160 chars)",
  "excerpt": "2-3 sentence summary that hooks the reader",
  "content": "Full markdown content with H2s, H3s, lists, blockquotes",
  "tags": ["tag1", "tag2", "tag3", "tag4", "tag5"],
  "related_services": ["AI Automation", "Digital Transformation"]
}`

  const userPrompt = `Write a comprehensive blog post about: "${topic}"

Category: ${category}
Target Keywords: ${keywords.join(', ')}

Requirements:
- ${SEO_CONFIG.MIN_WORDS}-${SEO_CONFIG.MAX_WORDS} words
- ${SEO_CONFIG.MIN_HEADINGS}-${SEO_CONFIG.MAX_HEADINGS} H2 sections
- Include a FAQ section with ${SEO_CONFIG.MIN_FAQS}-${SEO_CONFIG.MAX_FAQS} questions
- Use bullet points and numbered lists
- Include at least one blockquote
- End with a strong call-to-action mentioning RocketOpp's services
- Make it practical and actionable, not just theoretical

Primary keyword "${keywords[0]}" must appear:
- In the title
- In the first 100 words
- In at least one H2 heading
- In the conclusion

Return ONLY valid JSON, no additional text.`

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 8192,
    messages: [
      { role: 'user', content: userPrompt }
    ],
    system: systemPrompt
  })

  // Extract text content
  const textContent = response.content.find(block => block.type === 'text')
  if (!textContent || textContent.type !== 'text') {
    throw new Error('No text content in AI response')
  }

  // Parse JSON response
  let parsed: Partial<GeneratedPost>
  try {
    // Clean potential markdown code blocks
    let jsonText = textContent.text.trim()
    if (jsonText.startsWith('```json')) {
      jsonText = jsonText.replace(/^```json\n?/, '').replace(/\n?```$/, '')
    } else if (jsonText.startsWith('```')) {
      jsonText = jsonText.replace(/^```\n?/, '').replace(/\n?```$/, '')
    }
    parsed = JSON.parse(jsonText)
  } catch (e) {
    console.error('Failed to parse AI response:', textContent.text.substring(0, 500))
    throw new Error('Failed to parse AI-generated content')
  }

  // Validate required fields
  if (!parsed.title || !parsed.content) {
    throw new Error('Missing required fields in AI response')
  }

  return {
    title: parsed.title,
    slug: generateSlug(parsed.title),
    meta_description: parsed.meta_description || '',
    excerpt: parsed.excerpt || '',
    content: parsed.content,
    category: category,
    tags: parsed.tags || keywords,
    seo_keywords: keywords,
    reading_time: calculateReadingTime(parsed.content),
    related_services: parsed.related_services || ['AI Automation', 'Digital Transformation']
  }
}

// Save post to database
async function savePost(post: GeneratedPost, autoPublish: boolean): Promise<string> {
  const { data, error } = await supabaseAdmin
    .from('blog_posts')
    .insert({
      ...post,
      status: autoPublish ? 'published' : 'draft',
      published_at: autoPublish ? new Date().toISOString() : null,
      views: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })
    .select('id')
    .single()

  if (error) {
    console.error('Database error:', error)
    throw new Error('Failed to save blog post')
  }

  return data.id
}

// Log pipeline run
async function logPipelineRun(
  status: 'success' | 'error',
  postsGenerated: number,
  error?: string
): Promise<void> {
  await supabaseAdmin
    .from('content_pipeline_runs')
    .insert({
      started_at: new Date().toISOString(),
      completed_at: new Date().toISOString(),
      status,
      topics_fetched: 1,
      posts_generated: postsGenerated,
      posts_published: postsGenerated,
      logs: [{ timestamp: new Date().toISOString(), message: status === 'success' ? 'Post generated successfully' : error }],
      error: error || null,
      created_at: new Date().toISOString()
    })
}

export async function POST(request: NextRequest) {
  // Verify cron secret or admin auth
  const authHeader = request.headers.get('authorization')
  const cronSecret = process.env.CRON_SECRET
  const isCron = authHeader === `Bearer ${cronSecret}`

  // For non-cron requests, you could add admin auth check here
  // For now, allow direct calls in development

  try {
    const body: GenerateRequest = await request.json().catch(() => ({}))

    // Select topic (use provided or auto-select)
    let selectedTopic: { topic: string; category: string; keywords: string[] }

    if (body.topic) {
      selectedTopic = {
        topic: body.topic,
        category: body.category || 'AI & Automation',
        keywords: body.keywords || ['AI', 'automation', 'business']
      }
    } else {
      selectedTopic = await selectTopic()
    }

    console.log(`[Blog Generator] Generating post: ${selectedTopic.topic}`)

    // Generate content
    const post = await generateBlogContent(
      selectedTopic.topic,
      selectedTopic.category,
      selectedTopic.keywords
    )

    // Check for duplicate slug
    const { data: existing } = await supabaseAdmin
      .from('blog_posts')
      .select('id')
      .eq('slug', post.slug)
      .single()

    if (existing) {
      post.slug = `${post.slug}-${Date.now().toString(36)}`
    }

    // Save to database
    const autoPublish = body.autoPublish !== false // Default to true
    const postId = await savePost(post, autoPublish)

    // Log success
    await logPipelineRun('success', 1)

    console.log(`[Blog Generator] Post created: ${post.title} (ID: ${postId})`)

    return NextResponse.json({
      success: true,
      post: {
        id: postId,
        title: post.title,
        slug: post.slug,
        category: post.category,
        reading_time: post.reading_time,
        status: autoPublish ? 'published' : 'draft',
        url: `/blog/${post.slug}`
      }
    })

  } catch (error) {
    console.error('[Blog Generator] Error:', error)

    // Log failure
    await logPipelineRun('error', 0, error instanceof Error ? error.message : 'Unknown error')

    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate blog post' },
      { status: 500 }
    )
  }
}

// GET endpoint for testing/status
export async function GET() {
  const { data: recentPosts } = await supabaseAdmin
    .from('blog_posts')
    .select('id, title, slug, status, created_at')
    .order('created_at', { ascending: false })
    .limit(5)

  const { data: pipelineRuns } = await supabaseAdmin
    .from('content_pipeline_runs')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(5)

  return NextResponse.json({
    status: 'ready',
    topicPool: TOPIC_POOL.length,
    recentPosts,
    recentRuns: pipelineRuns
  })
}
