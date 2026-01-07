import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// GET - Fetch all posts with stats
export async function GET(request: NextRequest) {
  try {
    // Fetch posts
    const { data: posts, error } = await supabase
      .from('blog_posts')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error

    // Calculate stats
    const stats = {
      total_posts: posts?.length || 0,
      published: posts?.filter(p => p.status === 'published').length || 0,
      scheduled: posts?.filter(p => p.status === 'scheduled').length || 0,
      drafts: posts?.filter(p => p.status === 'draft').length || 0,
      total_views: posts?.reduce((sum, p) => sum + (p.views || 0), 0) || 0
    }

    return NextResponse.json({ posts, stats })
  } catch (error: any) {
    console.error('Error fetching posts:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// PUT - Update post (publish, schedule)
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { postId, action, scheduled_at } = body

    if (!postId) {
      return NextResponse.json({ error: 'Post ID required' }, { status: 400 })
    }

    let updateData: any = {}

    if (action === 'publish') {
      updateData = {
        status: 'published',
        published_at: new Date().toISOString()
      }

      // TODO: Trigger social posts via GHL when publishing
      // await postToSocialViaGHL(postId)

    } else if (action === 'schedule') {
      if (!scheduled_at) {
        return NextResponse.json({ error: 'Schedule date required' }, { status: 400 })
      }
      updateData = {
        status: 'scheduled',
        scheduled_at: new Date(scheduled_at).toISOString()
      }
    }

    const { data, error } = await supabase
      .from('blog_posts')
      .update(updateData)
      .eq('id', postId)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ post: data })
  } catch (error: any) {
    console.error('Error updating post:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// DELETE - Delete post
export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json()
    const { postId } = body

    if (!postId) {
      return NextResponse.json({ error: 'Post ID required' }, { status: 400 })
    }

    const { error } = await supabase
      .from('blog_posts')
      .delete()
      .eq('id', postId)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error deleting post:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
