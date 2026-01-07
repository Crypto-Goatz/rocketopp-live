import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Generate URL-friendly slug from title
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 100)
}

// POST - Import posts from CSV data
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { posts } = body

    if (!posts || !Array.isArray(posts) || posts.length === 0) {
      return NextResponse.json({ error: 'No posts to import' }, { status: 400 })
    }

    const importedPosts = []
    const errors = []

    for (const post of posts) {
      try {
        // Validate required fields
        if (!post.title || !post.content) {
          errors.push({ title: post.title, error: 'Missing title or content' })
          continue
        }

        // Generate slug
        const baseSlug = generateSlug(post.title)
        let slug = baseSlug
        let counter = 1

        // Check for slug uniqueness
        while (true) {
          const { data: existing } = await supabase
            .from('blog_posts')
            .select('id')
            .eq('slug', slug)
            .single()

          if (!existing) break
          slug = `${baseSlug}-${counter++}`
        }

        // Prepare post data
        const postData = {
          slug,
          title: post.title,
          content: post.content,
          category: post.category || 'General',
          meta_description: post.meta_description || post.excerpt || post.title.substring(0, 160),
          tags: post.tags ? post.tags.split(';').map((t: string) => t.trim()) : [],
          seo_keywords: post.keywords ? post.keywords.split(';').map((k: string) => k.trim()) : [],
          status: 'draft',
          views: 0,
          linkedin_posted: false,
          twitter_posted: false,
          facebook_posted: false,
          created_at: new Date().toISOString()
        }

        const { data, error } = await supabase
          .from('blog_posts')
          .insert(postData)
          .select()
          .single()

        if (error) {
          errors.push({ title: post.title, error: error.message })
        } else {
          importedPosts.push(data)
        }
      } catch (err: any) {
        errors.push({ title: post.title, error: err.message })
      }
    }

    return NextResponse.json({
      success: true,
      imported: importedPosts.length,
      failed: errors.length,
      posts: importedPosts,
      errors
    })
  } catch (error: any) {
    console.error('Error importing posts:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
