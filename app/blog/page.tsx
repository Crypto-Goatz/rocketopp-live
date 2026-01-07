import Link from 'next/link'
import { supabaseAdmin } from '@/lib/db/supabase'
import { ArrowRight, Clock, Tag, TrendingUp } from 'lucide-react'

export const metadata = {
  title: 'Blog | RocketOpp - AI & Technology Insights',
  description: 'Stay ahead with the latest insights on AI, technology trends, digital transformation, and business growth strategies.',
}

interface BlogPost {
  id: string
  slug: string
  title: string
  excerpt: string
  category: string
  tags: string[]
  reading_time: number
  published_at: string
  views: number
}

async function getBlogPosts(): Promise<BlogPost[]> {
  const { data, error } = await supabaseAdmin
    .from('blog_posts')
    .select('id, slug, title, excerpt, category, tags, reading_time, published_at, views')
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .limit(20)

  if (error) {
    console.error('Error fetching blog posts:', error)
    return []
  }

  return data || []
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

export default async function BlogPage() {
  const posts = await getBlogPosts()

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="border-b border-white/10 bg-zinc-950/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-white">RocketOpp</span>
          </Link>
          <nav className="flex items-center gap-6">
            <Link href="/services" className="text-zinc-400 hover:text-white transition-colors text-sm">
              Services
            </Link>
            <Link href="/blog" className="text-white text-sm">
              Blog
            </Link>
            <Link href="/contact" className="text-zinc-400 hover:text-white transition-colors text-sm">
              Contact
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-orange-500/5 to-transparent" />
        <div className="relative max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Insights & Trends
          </h1>
          <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
            Stay ahead of the curve with our latest insights on AI, technology, and digital transformation.
          </p>
        </div>
      </section>

      {/* Posts Grid */}
      <section className="max-w-7xl mx-auto px-6 pb-20">
        {posts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-zinc-500">No posts yet. Check back soon!</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post, index) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className={`group block bg-zinc-900/50 rounded-2xl border border-white/10 overflow-hidden hover:border-orange-500/30 transition-all ${
                  index === 0 ? 'md:col-span-2 lg:col-span-2' : ''
                }`}
              >
                {/* Gradient banner */}
                <div className="h-2 bg-gradient-to-r from-orange-500 to-red-500" />

                <div className="p-6">
                  {/* Category */}
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-orange-500/10 text-orange-400 border border-orange-500/20 mb-4">
                    {post.category}
                  </span>

                  {/* Title */}
                  <h2 className={`font-bold text-white group-hover:text-orange-400 transition-colors mb-3 ${
                    index === 0 ? 'text-2xl' : 'text-lg'
                  }`}>
                    {post.title}
                  </h2>

                  {/* Excerpt */}
                  <p className="text-zinc-400 text-sm mb-4 line-clamp-2">
                    {post.excerpt}
                  </p>

                  {/* Meta */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-xs text-zinc-500">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {post.reading_time} min read
                      </span>
                      <span>{formatDate(post.published_at)}</span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-zinc-600 group-hover:text-orange-400 group-hover:translate-x-1 transition-all" />
                  </div>

                  {/* Tags */}
                  {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-white/5">
                      {post.tags.slice(0, 3).map(tag => (
                        <span key={tag} className="flex items-center gap-1 text-xs text-zinc-500">
                          <Tag className="w-3 h-3" />
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* CTA */}
      <section className="border-t border-white/10 py-16">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">
            Ready to Transform Your Business?
          </h2>
          <p className="text-zinc-400 mb-6">
            Let&apos;s discuss how AI and automation can accelerate your growth.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white font-medium rounded-xl hover:opacity-90 transition-opacity"
          >
            Get Started
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  )
}
