// ============================================================
// RocketOpp Blog Post - Premium Reading Experience
// ============================================================
// Beautiful typography, reading progress, and engagement features
// ============================================================

import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { supabaseAdmin } from '@/lib/db/supabase'
import {
  ArrowLeft,
  Clock,
  Tag,
  Linkedin,
  Twitter,
  ArrowRight,
  Eye,
  Calendar,
  Bookmark,
  Share2,
  ChevronRight,
  Zap,
  Copy,
  CheckCircle2,
  MessageSquare,
  Heart
} from 'lucide-react'
import { Metadata } from 'next'

export const revalidate = 60

interface BlogPost {
  id: string
  slug: string
  title: string
  meta_description: string
  excerpt: string
  content: string
  category: string
  tags: string[]
  reading_time: number
  seo_keywords: string[]
  related_services: string[]
  published_at: string
  views: number
  featured_image?: string
}

async function getBlogPost(slug: string): Promise<BlogPost | null> {
  const { data, error } = await supabaseAdmin
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .single()

  if (error || !data) {
    return null
  }

  // Increment views (non-blocking)
  supabaseAdmin
    .from('blog_posts')
    .update({ views: (data.views || 0) + 1 })
    .eq('id', data.id)
    .then(() => {})

  return data
}

async function getRelatedPosts(currentSlug: string, category: string, tags: string[]): Promise<BlogPost[]> {
  const { data } = await supabaseAdmin
    .from('blog_posts')
    .select('id, slug, title, excerpt, category, reading_time, published_at, views, featured_image')
    .eq('status', 'published')
    .neq('slug', currentSlug)
    .or(`category.eq.${category}`)
    .order('published_at', { ascending: false })
    .limit(3)

  return data || []
}

// Generate metadata
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const post = await getBlogPost(slug)

  if (!post) {
    return { title: 'Post Not Found | RocketOpp' }
  }

  return {
    title: `${post.title} | RocketOpp Blog`,
    description: post.meta_description || post.excerpt,
    keywords: post.seo_keywords,
    authors: [{ name: 'RocketOpp', url: 'https://rocketopp.com' }],
    openGraph: {
      title: post.title,
      description: post.meta_description || post.excerpt,
      type: 'article',
      publishedTime: post.published_at,
      tags: post.tags,
      url: `https://rocketopp.com/blog/${post.slug}`,
      images: post.featured_image ? [{ url: post.featured_image }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.meta_description || post.excerpt,
    },
  }
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

function formatViews(views: number): string {
  if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M`
  if (views >= 1000) return `${(views / 1000).toFixed(1)}K`
  return views.toString()
}

// Enhanced markdown to HTML converter with premium styling
function renderMarkdown(content: string): string {
  return content
    // Code blocks
    .replace(/```(\w+)?\n([\s\S]*?)```/gm, '<pre class="bg-zinc-900 rounded-xl p-4 my-6 overflow-x-auto border border-white/5"><code class="text-sm text-zinc-300 font-mono">$2</code></pre>')
    // Inline code
    .replace(/`([^`]+)`/g, '<code class="bg-zinc-800 text-orange-400 px-1.5 py-0.5 rounded text-sm font-mono">$1</code>')
    // Headers
    .replace(/^#### (.*$)/gim, '<h4 class="text-lg font-bold text-white mt-8 mb-3">$1</h4>')
    .replace(/^### (.*$)/gim, '<h3 class="text-xl font-bold text-white mt-10 mb-4">$1</h3>')
    .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-bold text-white mt-12 mb-5 pb-2 border-b border-white/10">$1</h2>')
    .replace(/^# (.*$)/gim, '<h1 class="text-3xl font-bold text-white mt-12 mb-5">$1</h1>')
    // Bold
    .replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>')
    // Italic
    .replace(/\*(.*?)\*/g, '<em class="text-zinc-200">$1</em>')
    // Blockquotes
    .replace(/^> (.*$)/gim, '<blockquote class="border-l-4 border-orange-500 pl-6 py-4 my-8 bg-gradient-to-r from-orange-500/5 to-transparent rounded-r-lg"><p class="text-lg text-zinc-300 italic leading-relaxed">$1</p></blockquote>')
    // Horizontal rule
    .replace(/^---$/gim, '<hr class="border-t border-white/10 my-10" />')
    // Unordered lists
    .replace(/^- (.*$)/gim, '<li class="flex items-start gap-3 mb-3"><span class="text-orange-400 mt-1.5">•</span><span class="text-zinc-300">$1</span></li>')
    // Ordered lists
    .replace(/^\d+\. (.*$)/gim, '<li class="flex items-start gap-3 mb-3 text-zinc-300"><span class="text-orange-400 font-semibold">$1</span></li>')
    // Links
    .replace(/\[([^\]]+)\]\(([^\)]+)\)/g, '<a href="$2" class="text-orange-400 hover:text-orange-300 underline decoration-orange-500/30 hover:decoration-orange-400 transition-colors" target="_blank" rel="noopener">$1</a>')
    // Paragraphs (handle newlines)
    .split('\n\n')
    .map(para => {
      if (para.startsWith('<')) return para
      if (para.trim() === '') return ''
      return `<p class="text-zinc-300 leading-relaxed mb-6 text-lg">${para}</p>`
    })
    .join('\n')
}

// Category colors
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

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = await getBlogPost(slug)

  if (!post) {
    notFound()
  }

  const relatedPosts = await getRelatedPosts(post.slug, post.category, post.tags)
  const shareUrl = `https://rocketopp.com/blog/${post.slug}`
  const categoryStyle = getCategoryStyle(post.category)

  // Schema.org structured data
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.meta_description || post.excerpt,
    datePublished: post.published_at,
    image: post.featured_image,
    author: {
      '@type': 'Organization',
      name: 'RocketOpp',
      url: 'https://rocketopp.com',
    },
    publisher: {
      '@type': 'Organization',
      name: 'RocketOpp',
      url: 'https://rocketopp.com',
      logo: {
        '@type': 'ImageObject',
        url: 'https://rocketopp.com/logo.png',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': shareUrl,
    },
    keywords: post.seo_keywords?.join(', '),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <div className="min-h-screen bg-[#0A0A0A]">
        {/* Ambient Background */}
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/3 w-[600px] h-[600px] bg-orange-500/3 rounded-full blur-[150px]" />
          <div className="absolute bottom-0 right-1/3 w-[600px] h-[600px] bg-purple-500/3 rounded-full blur-[150px]" />
        </div>

        {/* Header */}
        <header className="relative border-b border-white/5 bg-[#0A0A0A]/80 backdrop-blur-xl sticky top-0 z-50">
          <div className="max-w-4xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <Link
                href="/blog"
                className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors group"
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                <span className="text-sm font-medium">Back to Blog</span>
              </Link>

              {/* Share Buttons */}
              <div className="flex items-center gap-2">
                <a
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-xl bg-white/5 hover:bg-blue-500/20 hover:text-blue-400 transition-all"
                  title="Share on LinkedIn"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
                <a
                  href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(post.title)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-xl bg-white/5 hover:bg-sky-500/20 hover:text-sky-400 transition-all"
                  title="Share on Twitter"
                >
                  <Twitter className="w-4 h-4" />
                </a>
                <button
                  className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 transition-all"
                  title="Copy link"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Article Hero */}
        <section className="relative pt-12 pb-8">
          <div className="max-w-4xl mx-auto px-6">
            {/* Category & Meta */}
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <span className={`px-3 py-1.5 rounded-lg text-sm font-medium ${categoryStyle.bg} ${categoryStyle.text} border ${categoryStyle.border}`}>
                {post.category}
              </span>
              <div className="flex items-center gap-4 text-sm text-zinc-500">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4" />
                  {post.reading_time} min read
                </span>
                <span className="flex items-center gap-1.5">
                  <Eye className="w-4 h-4" />
                  {formatViews(post.views || 0)} views
                </span>
              </div>
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-[1.1] tracking-tight">
              {post.title}
            </h1>

            {/* Excerpt */}
            <p className="text-xl md:text-2xl text-zinc-400 leading-relaxed mb-8">
              {post.excerpt}
            </p>

            {/* Meta Row */}
            <div className="flex flex-wrap items-center gap-6 pb-8 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="font-medium text-white">RocketOpp</p>
                  <p className="text-sm text-zinc-500">AI & Automation Insights</p>
                </div>
              </div>
              <div className="ml-auto text-right">
                <p className="text-sm text-zinc-500">Published</p>
                <p className="text-white">{formatDate(post.published_at)}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Image */}
        {post.featured_image && (
          <section className="max-w-5xl mx-auto px-6 mb-12">
            <div className="relative aspect-video rounded-2xl overflow-hidden bg-zinc-900 border border-white/5">
              <Image
                src={post.featured_image}
                alt={post.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          </section>
        )}

        {/* Article Content */}
        <article className="relative max-w-4xl mx-auto px-6 pb-16">
          {/* Main Content */}
          <div
            className="prose-custom"
            dangerouslySetInnerHTML={{ __html: renderMarkdown(post.content) }}
          />

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="mt-12 pt-8 border-t border-white/10">
              <p className="text-sm text-zinc-500 mb-4">Topics</p>
              <div className="flex flex-wrap gap-2">
                {post.tags.map(tag => (
                  <span
                    key={tag}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm bg-white/5 text-zinc-300 border border-white/10 hover:border-orange-500/30 transition-colors"
                  >
                    <Tag className="w-3 h-3" />
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Related Services CTA */}
          {post.related_services && post.related_services.length > 0 && (
            <div className="mt-12 p-8 rounded-2xl bg-gradient-to-br from-orange-500/10 via-red-500/5 to-purple-500/10 border border-orange-500/20">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center flex-shrink-0">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-2">Need Help With This?</h3>
                  <p className="text-zinc-400 mb-4">
                    We offer expert services in these areas. Let&apos;s discuss how we can help transform your business.
                  </p>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {post.related_services.map(service => (
                      <span
                        key={service}
                        className="px-3 py-1.5 rounded-lg text-sm bg-white/10 text-white"
                      >
                        {service}
                      </span>
                    ))}
                  </div>
                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white font-medium rounded-xl hover:opacity-90 transition-opacity"
                  >
                    Get in Touch
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Share Section */}
          <div className="mt-12 pt-8 border-t border-white/10">
            <div className="flex items-center justify-between">
              <p className="text-zinc-400">Share this article</p>
              <div className="flex items-center gap-2">
                <a
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-colors"
                >
                  <Linkedin className="w-4 h-4" />
                  LinkedIn
                </a>
                <a
                  href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(post.title)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-sky-500/10 text-sky-400 hover:bg-sky-500/20 transition-colors"
                >
                  <Twitter className="w-4 h-4" />
                  Twitter
                </a>
              </div>
            </div>
          </div>
        </article>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <section className="border-t border-white/5 py-16 bg-zinc-950/50">
            <div className="max-w-4xl mx-auto px-6">
              <h2 className="text-2xl font-bold text-white mb-8">Continue Reading</h2>
              <div className="grid md:grid-cols-3 gap-6">
                {relatedPosts.map(related => {
                  const relatedStyle = getCategoryStyle(related.category)
                  return (
                    <Link
                      key={related.id}
                      href={`/blog/${related.slug}`}
                      className="group flex flex-col rounded-2xl overflow-hidden bg-zinc-900/50 border border-white/5 hover:border-orange-500/20 transition-all"
                    >
                      <div className="h-1 bg-gradient-to-r from-orange-500 to-red-500 opacity-50 group-hover:opacity-100 transition-opacity" />
                      <div className="p-5 flex flex-col flex-1">
                        <span className={`self-start px-2 py-0.5 rounded text-xs font-medium ${relatedStyle.bg} ${relatedStyle.text} mb-3`}>
                          {related.category}
                        </span>
                        <h3 className="font-semibold text-white group-hover:text-orange-400 transition-colors mb-2 line-clamp-2">
                          {related.title}
                        </h3>
                        <p className="text-sm text-zinc-500 line-clamp-2 mb-4 flex-1">{related.excerpt}</p>
                        <div className="flex items-center justify-between text-xs text-zinc-500">
                          <span>{related.reading_time} min read</span>
                          <ChevronRight className="w-4 h-4 text-zinc-600 group-hover:text-orange-400 transition-colors" />
                        </div>
                      </div>
                    </Link>
                  )
                })}
              </div>
            </div>
          </section>
        )}

        {/* Final CTA */}
        <section className="relative border-t border-white/5 py-20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-orange-500/5 to-transparent" />
          <div className="relative max-w-3xl mx-auto px-6 text-center">
            <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
              <MessageSquare className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">
              Let&apos;s Start a Conversation
            </h2>
            <p className="text-zinc-400 mb-8 text-lg">
              Ready to leverage AI and automation for your business? We&apos;d love to hear about your challenges and goals.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold rounded-xl hover:opacity-90 transition-opacity shadow-lg shadow-orange-500/20"
            >
              Schedule a Call
              <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-white/5 py-8">
          <div className="max-w-4xl mx-auto px-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <Link href="/" className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
                  <Zap className="w-4 h-4 text-white" />
                </div>
                <span className="font-bold text-white">RocketOpp</span>
              </Link>
              <nav className="flex items-center gap-6 text-sm text-zinc-500">
                <Link href="/blog" className="hover:text-white transition-colors">Blog</Link>
                <Link href="/services" className="hover:text-white transition-colors">Services</Link>
                <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
              </nav>
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}
