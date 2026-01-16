// ============================================================
// RocketOpp Blog - Premium Design with Luna Crush Aesthetic
// ============================================================
// Beautiful, data-driven blog listing with extreme attention to detail
// ============================================================

import Link from 'next/link'
import Image from 'next/image'
import { supabaseAdmin } from '@/lib/db/supabase'
import {
  ArrowRight,
  Clock,
  Tag,
  TrendingUp,
  Flame,
  Eye,
  Sparkles,
  ChevronRight,
  Zap,
  BookOpen,
  Calendar,
  ArrowUpRight
} from 'lucide-react'

export const metadata = {
  title: 'Insights & Intelligence | RocketOpp Blog',
  description: 'Deep dives into AI, automation, and digital transformation. Expert analysis and actionable strategies to accelerate your business growth.',
}

export const revalidate = 60 // Revalidate every minute for fresh content

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
  featured_image?: string
}

async function getBlogPosts(): Promise<BlogPost[]> {
  const { data, error } = await supabaseAdmin
    .from('blog_posts')
    .select('id, slug, title, excerpt, category, tags, reading_time, published_at, views, featured_image')
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .limit(30)

  if (error) {
    console.error('Error fetching blog posts:', error)
    return []
  }

  return data || []
}

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffTime = Math.abs(now.getTime() - date.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays === 1) return 'Today'
  if (diffDays === 2) return 'Yesterday'
  if (diffDays <= 7) return `${diffDays} days ago`

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
  })
}

function formatViews(views: number): string {
  if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M`
  if (views >= 1000) return `${(views / 1000).toFixed(1)}K`
  return views.toString()
}

// Category colors for visual distinction
const categoryColors: Record<string, { bg: string; text: string; border: string }> = {
  'AI & Automation': { bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/20' },
  'Digital Transformation': { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/20' },
  'Marketing': { bg: 'bg-green-500/10', text: 'text-green-400', border: 'border-green-500/20' },
  'Technology': { bg: 'bg-cyan-500/10', text: 'text-cyan-400', border: 'border-cyan-500/20' },
  'Business Strategy': { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/20' },
  'Case Studies': { bg: 'bg-pink-500/10', text: 'text-pink-400', border: 'border-pink-500/20' },
  default: { bg: 'bg-orange-500/10', text: 'text-orange-400', border: 'border-orange-500/20' },
}

function getCategoryStyle(category: string) {
  return categoryColors[category] || categoryColors.default
}

export default async function BlogPage() {
  const posts = await getBlogPosts()
  const featuredPost = posts[0]
  const recentPosts = posts.slice(1, 4)
  const remainingPosts = posts.slice(4)

  // Get unique categories
  const categories = [...new Set(posts.map(p => p.category))].filter(Boolean)

  // Calculate total views
  const totalViews = posts.reduce((acc, post) => acc + (post.views || 0), 0)

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      {/* Ambient Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-500/5 rounded-full blur-[128px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-[128px]" />
      </div>

      {/* Header */}
      <header className="relative border-b border-white/5 bg-[#0A0A0A]/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity" />
                <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
                  <Zap className="w-5 h-5 text-white" />
                </div>
              </div>
              <div>
                <span className="font-bold text-white text-lg">RocketOpp</span>
                <span className="hidden sm:inline text-zinc-500 text-sm ml-2">/ Intelligence</span>
              </div>
            </Link>

            <nav className="flex items-center gap-1">
              <Link
                href="/services"
                className="px-4 py-2 text-zinc-400 hover:text-white text-sm font-medium transition-colors rounded-lg hover:bg-white/5"
              >
                Services
              </Link>
              <Link
                href="/blog"
                className="px-4 py-2 text-white text-sm font-medium bg-white/5 rounded-lg"
              >
                Blog
              </Link>
              <Link
                href="/contact"
                className="px-4 py-2 text-zinc-400 hover:text-white text-sm font-medium transition-colors rounded-lg hover:bg-white/5"
              >
                Contact
              </Link>
              <Link
                href="/contact"
                className="ml-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white text-sm font-medium rounded-lg hover:opacity-90 transition-opacity hidden sm:block"
              >
                Get Started
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-16 md:py-24 overflow-hidden">
        <div className="relative max-w-7xl mx-auto px-6">
          <div className="max-w-3xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 mb-6">
              <Sparkles className="w-4 h-4 text-orange-400" />
              <span className="text-sm text-zinc-300">AI-Powered Insights</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Intelligence that
              <span className="block bg-gradient-to-r from-orange-400 via-red-400 to-purple-400 bg-clip-text text-transparent">
                Drives Growth
              </span>
            </h1>

            <p className="text-xl text-zinc-400 leading-relaxed mb-8 max-w-2xl">
              Deep analysis and actionable strategies on AI, automation, and digital transformation.
              Stay ahead with expert insights updated daily.
            </p>

            {/* Stats Bar */}
            <div className="flex flex-wrap items-center gap-6 md:gap-8">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-orange-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{posts.length}</p>
                  <p className="text-xs text-zinc-500">Articles</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                  <Eye className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{formatViews(totalViews)}</p>
                  <p className="text-xs text-zinc-500">Total Views</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                  <Flame className="w-5 h-5 text-red-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{categories.length}</p>
                  <p className="text-xs text-zinc-500">Categories</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Pills */}
      {categories.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 pb-8">
          <div className="flex flex-wrap gap-2">
            <button className="px-4 py-2 rounded-full text-sm font-medium bg-white text-black transition-all">
              All Posts
            </button>
            {categories.map(category => {
              const style = getCategoryStyle(category)
              return (
                <button
                  key={category}
                  className={`px-4 py-2 rounded-full text-sm font-medium ${style.bg} ${style.text} border ${style.border} hover:bg-white/10 transition-all`}
                >
                  {category}
                </button>
              )
            })}
          </div>
        </section>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 pb-20">
        {posts.length === 0 ? (
          <div className="text-center py-32">
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-white/5 flex items-center justify-center">
              <BookOpen className="w-10 h-10 text-zinc-600" />
            </div>
            <h2 className="text-xl font-semibold text-white mb-2">No Articles Yet</h2>
            <p className="text-zinc-500">Check back soon for fresh insights.</p>
          </div>
        ) : (
          <>
            {/* Featured Post */}
            {featuredPost && (
              <section className="mb-12">
                <Link
                  href={`/blog/${featuredPost.slug}`}
                  className="group relative block rounded-3xl overflow-hidden bg-gradient-to-br from-zinc-900 to-zinc-950 border border-white/5 hover:border-orange-500/20 transition-all duration-500"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 via-transparent to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  <div className="relative grid md:grid-cols-2 gap-8 p-8 md:p-12">
                    {/* Content */}
                    <div className="flex flex-col justify-center">
                      <div className="flex items-center gap-3 mb-6">
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-orange-500 to-red-500 text-white">
                          Featured
                        </span>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryStyle(featuredPost.category).bg} ${getCategoryStyle(featuredPost.category).text} border ${getCategoryStyle(featuredPost.category).border}`}>
                          {featuredPost.category}
                        </span>
                      </div>

                      <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 group-hover:text-orange-400 transition-colors leading-tight">
                        {featuredPost.title}
                      </h2>

                      <p className="text-lg text-zinc-400 mb-6 line-clamp-3 leading-relaxed">
                        {featuredPost.excerpt}
                      </p>

                      <div className="flex items-center gap-6 text-sm text-zinc-500 mb-6">
                        <span className="flex items-center gap-1.5">
                          <Clock className="w-4 h-4" />
                          {featuredPost.reading_time} min read
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Calendar className="w-4 h-4" />
                          {formatDate(featuredPost.published_at)}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Eye className="w-4 h-4" />
                          {formatViews(featuredPost.views || 0)} views
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-orange-400 font-medium group-hover:gap-3 transition-all">
                        Read Article
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>

                    {/* Visual Element */}
                    <div className="relative hidden md:flex items-center justify-center">
                      <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 via-red-500/20 to-purple-500/20 rounded-2xl blur-2xl" />
                      <div className="relative w-full aspect-video rounded-2xl bg-gradient-to-br from-zinc-800 to-zinc-900 border border-white/10 flex items-center justify-center overflow-hidden">
                        {featuredPost.featured_image ? (
                          <Image
                            src={featuredPost.featured_image}
                            alt={featuredPost.title}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="text-center p-8">
                            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-orange-500/20 to-red-500/20 flex items-center justify-center">
                              <Sparkles className="w-8 h-8 text-orange-400" />
                            </div>
                            <p className="text-sm text-zinc-500">AI-Generated Insights</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              </section>
            )}

            {/* Recent Posts Row */}
            {recentPosts.length > 0 && (
              <section className="mb-12">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-orange-400" />
                    Recent
                  </h2>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  {recentPosts.map((post, index) => (
                    <Link
                      key={post.id}
                      href={`/blog/${post.slug}`}
                      className="group relative flex flex-col rounded-2xl overflow-hidden bg-zinc-900/50 border border-white/5 hover:border-orange-500/20 hover:bg-zinc-900 transition-all duration-300"
                    >
                      {/* Top gradient line */}
                      <div className="h-1 bg-gradient-to-r from-orange-500 via-red-500 to-purple-500 opacity-50 group-hover:opacity-100 transition-opacity" />

                      <div className="flex flex-col flex-1 p-6">
                        {/* Category & Index */}
                        <div className="flex items-center justify-between mb-4">
                          <span className={`px-2.5 py-1 rounded-lg text-xs font-medium ${getCategoryStyle(post.category).bg} ${getCategoryStyle(post.category).text}`}>
                            {post.category}
                          </span>
                          <span className="text-xs text-zinc-600 font-mono">#{String(index + 2).padStart(2, '0')}</span>
                        </div>

                        {/* Title */}
                        <h3 className="text-lg font-semibold text-white group-hover:text-orange-400 transition-colors mb-3 line-clamp-2 leading-snug">
                          {post.title}
                        </h3>

                        {/* Excerpt */}
                        <p className="text-sm text-zinc-500 mb-4 line-clamp-2 flex-1">
                          {post.excerpt}
                        </p>

                        {/* Meta */}
                        <div className="flex items-center justify-between pt-4 border-t border-white/5">
                          <div className="flex items-center gap-3 text-xs text-zinc-500">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {post.reading_time}m
                            </span>
                            <span>{formatDate(post.published_at)}</span>
                          </div>
                          <ArrowUpRight className="w-4 h-4 text-zinc-600 group-hover:text-orange-400 transition-colors" />
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* All Posts Grid */}
            {remainingPosts.length > 0 && (
              <section>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-white">All Articles</h2>
                  <span className="text-sm text-zinc-500">{remainingPosts.length} posts</span>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {remainingPosts.map((post) => (
                    <Link
                      key={post.id}
                      href={`/blog/${post.slug}`}
                      className="group flex flex-col rounded-xl overflow-hidden bg-zinc-900/30 border border-white/5 hover:border-white/10 hover:bg-zinc-900/50 transition-all duration-300"
                    >
                      <div className="flex flex-col flex-1 p-5">
                        {/* Category */}
                        <span className={`self-start px-2 py-0.5 rounded text-xs font-medium ${getCategoryStyle(post.category).bg} ${getCategoryStyle(post.category).text} mb-3`}>
                          {post.category}
                        </span>

                        {/* Title */}
                        <h3 className="font-medium text-white group-hover:text-orange-400 transition-colors mb-2 line-clamp-2 leading-snug">
                          {post.title}
                        </h3>

                        {/* Excerpt */}
                        <p className="text-sm text-zinc-500 mb-4 line-clamp-2 flex-1">
                          {post.excerpt}
                        </p>

                        {/* Meta */}
                        <div className="flex items-center gap-4 text-xs text-zinc-600">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {post.reading_time} min
                          </span>
                          <span className="flex items-center gap-1">
                            <Eye className="w-3 h-3" />
                            {formatViews(post.views || 0)}
                          </span>
                          <span className="ml-auto">{formatDate(post.published_at)}</span>
                        </div>

                        {/* Tags */}
                        {post.tags && post.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mt-4 pt-4 border-t border-white/5">
                            {post.tags.slice(0, 3).map(tag => (
                              <span key={tag} className="text-xs text-zinc-600 bg-white/5 px-2 py-0.5 rounded">
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </main>

      {/* Newsletter CTA */}
      <section className="relative border-t border-white/5 py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-orange-500/5 to-transparent" />
        <div className="relative max-w-3xl mx-auto px-6 text-center">
          <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
            <Zap className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Transform Your Business?
          </h2>
          <p className="text-zinc-400 mb-8 text-lg">
            Join forward-thinking companies leveraging AI and automation for exponential growth.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold rounded-xl hover:opacity-90 transition-opacity shadow-lg shadow-orange-500/20"
          >
            Start Your Journey
            <ChevronRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-zinc-500 text-sm">
              <span>© {new Date().getFullYear()} RocketOpp.</span>
              <span>AI-Powered Growth.</span>
            </div>
            <nav className="flex items-center gap-6 text-sm text-zinc-500">
              <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
              <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
              <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
            </nav>
          </div>
        </div>
      </footer>
    </div>
  )
}
