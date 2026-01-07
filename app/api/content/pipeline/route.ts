import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/db/supabase'
import { lunarcrush } from '@/lib/lunarcrush/client'
import { blogGenerator } from '@/lib/content/blog-generator'

// This can be called via:
// 1. Manual trigger from admin dashboard
// 2. Vercel Cron job (daily)
// 3. Direct API call with secret

const PIPELINE_SECRET = process.env.CONTENT_PIPELINE_SECRET || process.env.SESSION_SECRET

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}))

  // Accept dashboard triggers or verify secret
  const authHeader = request.headers.get('authorization')
  const providedSecret = authHeader?.replace('Bearer ', '') || body.secret
  const isDashboardTrigger = body.action === 'generate'

  if (!isDashboardTrigger && providedSecret !== PIPELINE_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const runId = crypto.randomUUID()
  const logs: string[] = []

  const log = (message: string) => {
    const timestamp = new Date().toISOString()
    const logEntry = `[${timestamp}] ${message}`
    logs.push(logEntry)
    console.log(logEntry)
  }

  try {
    // Create pipeline run record
    await supabaseAdmin.from('content_pipeline_runs').insert({
      id: runId,
      status: 'running',
    })

    log('Starting content pipeline...')

    // Step 1: Fetch trending topics
    log('Fetching trending topics from LunarCrush...')
    const opportunities = await lunarcrush.getBestContentOpportunities(3)
    log(`Found ${opportunities.length} content opportunities`)

    await supabaseAdmin
      .from('content_pipeline_runs')
      .update({ topics_fetched: opportunities.length })
      .eq('id', runId)

    if (opportunities.length === 0) {
      log('No suitable topics found. Exiting.')
      await supabaseAdmin.from('content_pipeline_runs').update({
        status: 'completed',
        completed_at: new Date().toISOString(),
        logs,
      }).eq('id', runId)

      return NextResponse.json({ success: true, message: 'No topics found', runId })
    }

    // Step 2: Generate blog posts
    log('Generating blog posts...')
    const generatedPosts = await blogGenerator.generateDailyContent(opportunities)
    log(`Generated ${generatedPosts.length} blog posts`)

    await supabaseAdmin
      .from('content_pipeline_runs')
      .update({ posts_generated: generatedPosts.length })
      .eq('id', runId)

    // Step 3: Save and publish posts
    let publishedCount = 0
    const publishedSlugs: string[] = []

    for (const post of generatedPosts) {
      try {
        // Check if slug already exists
        const { data: existing } = await supabaseAdmin
          .from('blog_posts')
          .select('id')
          .eq('slug', post.slug)
          .single()

        if (existing) {
          log(`Skipping "${post.title}" - slug already exists`)
          continue
        }

        // Find the matching opportunity for source data
        const sourceOpp = opportunities.find(o =>
          post.title.toLowerCase().includes(o.topic.toLowerCase()) ||
          o.title.toLowerCase().includes(post.title.toLowerCase().slice(0, 20))
        )

        // Insert the post
        const { error } = await supabaseAdmin.from('blog_posts').insert({
          slug: post.slug,
          title: post.title,
          meta_description: post.metaDescription,
          excerpt: post.excerpt,
          content: post.content,
          tags: post.tags,
          category: post.category,
          reading_time: post.readingTime,
          seo_keywords: post.seoKeywords,
          related_services: post.relatedServices,
          linkedin_post: post.linkedinPost,
          twitter_post: post.twitterPost,
          source_topic: sourceOpp?.topic,
          source_data: sourceOpp ? {
            sentiment: sourceOpp.sentiment,
            interactions: sourceOpp.interactions,
            trend: sourceOpp.trend,
            reasoning: sourceOpp.reasoning,
          } : {},
          status: 'published',
          published_at: new Date().toISOString(),
        })

        if (error) {
          log(`Failed to save "${post.title}": ${error.message}`)
        } else {
          publishedCount++
          publishedSlugs.push(post.slug)
          log(`Published: "${post.title}" → /blog/${post.slug}`)
        }
      } catch (e: any) {
        log(`Error publishing "${post.title}": ${e.message}`)
      }
    }

    await supabaseAdmin
      .from('content_pipeline_runs')
      .update({ posts_published: publishedCount })
      .eq('id', runId)

    // Step 4: Post to LinkedIn (if configured)
    // This requires a LinkedIn connection to be set up
    // For now, we'll just prepare the posts
    let linkedinPostCount = 0

    // TODO: Get admin user's LinkedIn connection
    // const connection = await linkedin.getActiveConnection(ADMIN_USER_ID)
    // if (connection) {
    //   for (const post of generatedPosts) {
    //     if (post.linkedinPost && publishedSlugs.includes(post.slug)) {
    //       const postUrl = `https://rocketopp.com/blog/${post.slug}`
    //       const text = post.linkedinPost.replace('[LINK]', postUrl)
    //       const result = await linkedin.createPost(
    //         connection.access_token,
    //         connection.linkedin_id,
    //         text,
    //         { url: postUrl, title: post.title, description: post.excerpt }
    //       )
    //       if (result.success) linkedinPostCount++
    //     }
    //   }
    // }

    log(`LinkedIn posts sent: ${linkedinPostCount}`)

    // Complete the run
    await supabaseAdmin.from('content_pipeline_runs').update({
      status: 'completed',
      completed_at: new Date().toISOString(),
      linkedin_posts_sent: linkedinPostCount,
      logs,
    }).eq('id', runId)

    log('Pipeline completed successfully!')

    return NextResponse.json({
      success: true,
      runId,
      summary: {
        topicsFetched: opportunities.length,
        postsGenerated: generatedPosts.length,
        postsPublished: publishedCount,
        linkedinPostsSent: linkedinPostCount,
        publishedSlugs,
      },
    })
  } catch (error: any) {
    log(`Pipeline failed: ${error.message}`)

    await supabaseAdmin.from('content_pipeline_runs').update({
      status: 'failed',
      completed_at: new Date().toISOString(),
      error: error.message,
      logs,
    }).eq('id', runId)

    return NextResponse.json({
      success: false,
      error: error.message,
      runId,
    }, { status: 500 })
  }
}

// GET endpoint to check pipeline status
export async function GET(request: NextRequest) {
  const url = new URL(request.url)
  const runId = url.searchParams.get('runId')

  if (runId) {
    const { data } = await supabaseAdmin
      .from('content_pipeline_runs')
      .select('*')
      .eq('id', runId)
      .single()

    return NextResponse.json(data || { error: 'Run not found' })
  }

  // Return recent runs
  const { data } = await supabaseAdmin
    .from('content_pipeline_runs')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(10)

  return NextResponse.json({ runs: data || [] })
}
