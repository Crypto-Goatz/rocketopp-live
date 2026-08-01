import { ImageResponse } from 'next/og'
import { supabaseAdmin } from '@/lib/db/supabase'
import { findFeatured } from '@/lib/blog-featured'

/**
 * Per-post Open Graph card, rendered as a real PNG.
 *
 * Why this exists: the hero art in public/brand/blog is SVG, which is right for
 * an on-page image but does NOT unfurl — Slack, iMessage, LinkedIn, WhatsApp and
 * X all refuse SVG in og:image. Without this route every shared article fell
 * back to the generic site card, so twenty different posts pasted identically.
 *
 * Next resolves this file to <meta property="og:image"> automatically, so it
 * also overrides whatever generateMetadata sets. Title and category come from
 * the post, so the card actually says what was shared.
 */
export const runtime = 'nodejs'
export const alt = 'RocketOpp article'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

const CATEGORY_NAMES: Record<string, string> = {
  'agency-growth': 'Agency Growth',
  'ai-automation': 'AI & Automation',
  'saas-building': 'Building SaaS',
  'crm-strategy': 'CRM Strategy',
  'hipaa-compliance': 'HIPAA & Compliance',
  'mcp-ecosystem': 'MCP & Integrations',
  'product-updates': 'Product Updates',
  'seo-sxo': 'SEO & SXO',
}

const ACCENTS: Record<string, string> = {
  'agency-growth': '#22d3ee',
  'ai-automation': '#a78bfa',
  'saas-building': '#f43f5e',
  'crm-strategy': '#38bdf8',
  'hipaa-compliance': '#34d399',
  'mcp-ecosystem': '#c084fc',
  'product-updates': '#fb923c',
  'seo-sxo': '#fbbf24',
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  let title = 'RocketOpp'
  let categorySlug = ''
  let readingTime: number | null = null

  const coded = findFeatured(slug)
  if (coded) {
    title = coded.title
    categorySlug = 'seo-sxo'
    readingTime = coded.readingTime
  } else {
    const { data } = await supabaseAdmin
      .from('blog_posts')
      .select('title, category_slug, reading_time')
      .eq('slug', slug)
      .eq('status', 'published')
      .single()
    if (data) {
      title = data.title
      categorySlug = data.category_slug || ''
      readingTime = data.reading_time
    }
  }

  const accent = ACCENTS[categorySlug] || '#ff6b35'
  const category = CATEGORY_NAMES[categorySlug] || 'Insights'

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: '#0A0A0A',
          padding: '64px 72px',
          position: 'relative',
        }}
      >
        {/* Accent wash */}
        <div
          style={{
            position: 'absolute',
            top: -220,
            right: -160,
            width: 620,
            height: 620,
            borderRadius: 620,
            background: accent,
            opacity: 0.16,
            display: 'flex',
          }}
        />

        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div
            style={{
              display: 'flex',
              width: 44,
              height: 44,
              borderRadius: 12,
              background: 'linear-gradient(135deg, #ff6b35, #e11d48)',
            }}
          />
          <div style={{ display: 'flex', fontSize: 26, fontWeight: 700, color: '#fff' }}>
            RocketOpp
          </div>
          <div
            style={{
              display: 'flex',
              marginLeft: 12,
              padding: '6px 16px',
              borderRadius: 999,
              border: `1px solid ${accent}66`,
              color: accent,
              fontSize: 18,
              fontWeight: 600,
            }}
          >
            {category}
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            fontSize: title.length > 78 ? 54 : 66,
            lineHeight: 1.12,
            fontWeight: 800,
            color: '#fff',
            letterSpacing: '-0.02em',
            maxWidth: 1000,
          }}
        >
          {title}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', fontSize: 22, color: '#a1a1aa' }}>
            rocketopp.com{readingTime ? `  ·  ${readingTime} min read` : ''}
          </div>
          <div
            style={{
              display: 'flex',
              height: 8,
              width: 220,
              borderRadius: 8,
              background: `linear-gradient(90deg, #ff6b35, ${accent})`,
            }}
          />
        </div>
      </div>
    ),
    size,
  )
}
