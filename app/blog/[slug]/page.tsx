import { notFound } from 'next/navigation'
import Link from 'next/link'
import { supabaseAdmin } from '@/lib/db/supabase'
import { ArrowLeft, Clock, Tag, Share2, Linkedin, Twitter, ArrowRight } from 'lucide-react'
import { Metadata } from 'next'

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

  // Increment views
  await supabaseAdmin
    .from('blog_posts')
    .update({ views: (data.views || 0) + 1 })
    .eq('id', data.id)

  return data
}

async function getRelatedPosts(currentSlug: string, category: string, tags: string[]): Promise<BlogPost[]> {
  const { data } = await supabaseAdmin
    .from('blog_posts')
    .select('id, slug, title, excerpt, category, reading_time, published_at')
    .eq('status', 'published')
    .neq('slug', currentSlug)
    .or(`category.eq.${category},tags.ov.{${tags.join(',')}}`)
    .limit(3)

  return data || []
}

// Generate metadata
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const post = await getBlogPost(slug)

  if (!post) {
    return { title: 'Post Not Found' }
  }

  return {
    title: `${post.title} | RocketOpp Blog`,
    description: post.meta_description,
    keywords: post.seo_keywords,
    openGraph: {
      title: post.title,
      description: post.meta_description,
      type: 'article',
      publishedTime: post.published_at,
      tags: post.tags,
      url: `https://rocketopp.com/blog/${post.slug}`,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.meta_description,
    },
  }
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

// Simple markdown to HTML converter
function renderMarkdown(content: string): string {
  return content
    // Headers
    .replace(/^### (.*$)/gim, '<h3 class="text-xl font-bold text-white mt-8 mb-4">$1</h3>')
    .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-bold text-white mt-10 mb-4">$1</h2>')
    .replace(/^# (.*$)/gim, '<h1 class="text-3xl font-bold text-white mt-10 mb-4">$1</h1>')
    // Bold
    .replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>')
    // Italic
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    // Blockquotes
    .replace(/^> (.*$)/gim, '<blockquote class="border-l-4 border-orange-500 pl-4 py-2 my-6 text-zinc-300 italic bg-orange-500/5 rounded-r-lg">$1</blockquote>')
    // Unordered lists
    .replace(/^\- (.*$)/gim, '<li class="ml-4 text-zinc-300 mb-2">$1</li>')
    // Links
    .replace(/\[([^\]]+)\]\(([^\)]+)\)/g, '<a href="$2" class="text-orange-400 hover:text-orange-300 underline" target="_blank" rel="noopener">$1</a>')
    // Paragraphs (double newlines)
    .replace(/\n\n/g, '</p><p class="text-zinc-300 leading-relaxed mb-4">')
    // Wrap in paragraph
    .replace(/^(.+)$/gm, (match) => {
      if (match.startsWith('<')) return match
      return `<p class="text-zinc-300 leading-relaxed mb-4">${match}</p>`
    })
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = await getBlogPost(slug)

  if (!post) {
    notFound()
  }

  const relatedPosts = await getRelatedPosts(post.slug, post.category, post.tags)
  const shareUrl = `https://rocketopp.com/blog/${post.slug}`

  // Schema.org structured data
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.meta_description,
    datePublished: post.published_at,
    author: {
      '@type': 'Organization',
      name: 'RocketOpp',
      url: 'https://rocketopp.com',
    },
    publisher: {
      '@type': 'Organization',
      name: 'RocketOpp',
      url: 'https://rocketopp.com',
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': shareUrl,
    },
    keywords: post.seo_keywords.join(', '),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <div className="min-h-screen bg-black">
        {/* Header */}
        <header className="border-b border-white/10 bg-zinc-950/80 backdrop-blur-xl sticky top-0 z-50">
          <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
            <Link href="/blog" className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors">
              <ArrowLeft className="w-4 h-4" />
              Back to Blog
            </Link>
            <div className="flex items-center gap-3">
              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                title="Share on LinkedIn"
              >
                <Linkedin className="w-4 h-4 text-zinc-400" />
              </a>
              <a
                href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(post.title)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                title="Share on Twitter"
              >
                <Twitter className="w-4 h-4 text-zinc-400" />
              </a>
            </div>
          </div>
        </header>

        {/* Article */}
        <article className="max-w-4xl mx-auto px-6 py-12">
          {/* Meta */}
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-orange-500/10 text-orange-400 border border-orange-500/20">
              {post.category}
            </span>
            <span className="flex items-center gap-1 text-sm text-zinc-500">
              <Clock className="w-4 h-4" />
              {post.reading_time} min read
            </span>
            <span className="text-sm text-zinc-500">
              {formatDate(post.published_at)}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
            {post.title}
          </h1>

          {/* Excerpt */}
          <p className="text-xl text-zinc-400 mb-8 leading-relaxed">
            {post.excerpt}
          </p>

          {/* Gradient divider */}
          <div className="h-1 w-20 bg-gradient-to-r from-orange-500 to-red-500 rounded-full mb-10" />

          {/* Content */}
          <div
            className="prose prose-invert prose-orange max-w-none"
            dangerouslySetInnerHTML={{ __html: renderMarkdown(post.content) }}
          />

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-10 pt-6 border-t border-white/10">
              {post.tags.map(tag => (
                <span key={tag} className="flex items-center gap-1 px-3 py-1 rounded-full text-xs bg-white/5 text-zinc-400">
                  <Tag className="w-3 h-3" />
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Related Services */}
          {post.related_services && post.related_services.length > 0 && (
            <div className="mt-10 p-6 rounded-2xl bg-gradient-to-br from-orange-500/10 to-red-500/10 border border-orange-500/20">
              <h3 className="text-lg font-bold text-white mb-4">Related Services</h3>
              <div className="flex flex-wrap gap-3">
                {post.related_services.map(service => (
                  <Link
                    key={service}
                    href={`/services`}
                    className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white text-sm transition-colors"
                  >
                    {service}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </article>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <section className="border-t border-white/10 py-12">
            <div className="max-w-4xl mx-auto px-6">
              <h2 className="text-2xl font-bold text-white mb-6">Related Articles</h2>
              <div className="grid md:grid-cols-3 gap-6">
                {relatedPosts.map(related => (
                  <Link
                    key={related.id}
                    href={`/blog/${related.slug}`}
                    className="group block p-4 rounded-xl bg-zinc-900/50 border border-white/10 hover:border-orange-500/30 transition-all"
                  >
                    <span className="text-xs text-orange-400 mb-2 block">{related.category}</span>
                    <h3 className="font-medium text-white group-hover:text-orange-400 transition-colors mb-2 line-clamp-2">
                      {related.title}
                    </h3>
                    <span className="text-xs text-zinc-500">{related.reading_time} min read</span>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* CTA */}
        <section className="border-t border-white/10 py-16 bg-gradient-to-b from-transparent to-orange-500/5">
          <div className="max-w-3xl mx-auto px-6 text-center">
            <h2 className="text-2xl font-bold text-white mb-4">
              Want to Stay Ahead of the Curve?
            </h2>
            <p className="text-zinc-400 mb-6">
              Let&apos;s discuss how we can help you leverage the latest trends for your business.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white font-medium rounded-xl hover:opacity-90 transition-opacity"
            >
              Get in Touch
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      </div>
    </>
  )
}
