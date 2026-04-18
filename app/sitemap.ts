/**
 * Comprehensive, priority-tiered sitemap for rocketopp.com.
 * Auto-includes dynamic marketplace products + categories + blog posts
 * from Supabase. Thank-you / auth-gated / utility routes are excluded.
 */

import type { MetadataRoute } from 'next'
import { supabaseAdmin } from '@/lib/db/supabase'

type Freq = 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never'

const BASE = 'https://rocketopp.com'

// Priority tiers, ordered roughly by business value
const PAGES: Array<{ path: string; priority: number; freq: Freq }> = [
  // Tier 1 — landing
  { path: '/',                                                   priority: 1.00, freq: 'weekly' },

  // Tier 2 — top-funnel conversion pages
  { path: '/health-check',                                       priority: 0.95, freq: 'weekly' },
  { path: '/marketplace',                                        priority: 0.95, freq: 'daily' },
  { path: '/rocket-mcp',                                         priority: 0.95, freq: 'weekly' },
  { path: '/services',                                           priority: 0.95, freq: 'weekly' },
  { path: '/ai-assessment',                                      priority: 0.90, freq: 'monthly' },
  { path: '/pitch-idea',                                         priority: 0.90, freq: 'weekly' },
  { path: '/request-app',                                        priority: 0.90, freq: 'weekly' },

  // Tier 3 — service pages (deep SEO landing pages)
  { path: '/services/website-development',                       priority: 0.90, freq: 'monthly' },
  { path: '/services/website-development/conversion-optimization', priority: 0.80, freq: 'monthly' },
  { path: '/services/website-development/seo-services',          priority: 0.80, freq: 'monthly' },
  { path: '/services/website-design',                            priority: 0.85, freq: 'monthly' },
  { path: '/services/sxo',                                       priority: 0.90, freq: 'monthly' },
  { path: '/services/ai-automation',                             priority: 0.90, freq: 'monthly' },
  { path: '/services/ai-applications',                           priority: 0.85, freq: 'monthly' },
  { path: '/services/ai-integration',                            priority: 0.85, freq: 'monthly' },
  { path: '/services/ai-crm',                                    priority: 0.85, freq: 'monthly' },
  { path: '/services/automation',                                priority: 0.85, freq: 'monthly' },
  { path: '/services/crm-automation',                            priority: 0.90, freq: 'monthly' },
  { path: '/services/mcp-integration',                           priority: 0.90, freq: 'monthly' },
  { path: '/services/sop-automation',                            priority: 0.80, freq: 'monthly' },
  { path: '/services/app-development',                           priority: 0.80, freq: 'monthly' },
  { path: '/services/ppc-management',                            priority: 0.90, freq: 'monthly' },
  { path: '/services/online-marketing',                          priority: 0.80, freq: 'monthly' },
  { path: '/services/search-optimization',                       priority: 0.85, freq: 'monthly' },
  { path: '/services/web-marketing',                             priority: 0.80, freq: 'monthly' },
  { path: '/services/web-marketing/seo',                         priority: 0.80, freq: 'monthly' },
  { path: '/services/web-marketing/ppc',                         priority: 0.80, freq: 'monthly' },
  { path: '/services/web-marketing/content-marketing',           priority: 0.80, freq: 'monthly' },
  { path: '/services/web-marketing/social-media',                priority: 0.80, freq: 'monthly' },

  // Tier 4 — product + supporting
  { path: '/marketplace/lease-to-own',                           priority: 0.80, freq: 'weekly' },
  { path: '/rocket-clients',                                     priority: 0.80, freq: 'weekly' },
  { path: '/apps',                                               priority: 0.80, freq: 'weekly' },
  { path: '/applications',                                       priority: 0.75, freq: 'monthly' },

  // Tier 5 — company / trust pages
  { path: '/about',                                              priority: 0.80, freq: 'monthly' },
  { path: '/contact',                                            priority: 0.85, freq: 'monthly' },
  { path: '/consultation',                                       priority: 0.75, freq: 'monthly' },
  { path: '/experience',                                         priority: 0.65, freq: 'monthly' },
  { path: '/personalized',                                       priority: 0.65, freq: 'monthly' },
  { path: '/ai-for-business',                                    priority: 0.80, freq: 'monthly' },
  { path: '/ai-solution',                                        priority: 0.75, freq: 'monthly' },

  // Tier 6 — case studies
  { path: '/clients/ecospray',                                   priority: 0.85, freq: 'monthly' },

  // Tier 7 — content hubs
  { path: '/blog',                                               priority: 0.85, freq: 'daily' },

  // Tier 8 — utility (indexable, low priority)
  { path: '/login',                                              priority: 0.40, freq: 'yearly' },
  { path: '/register',                                           priority: 0.50, freq: 'yearly' },
  { path: '/privacy',                                            priority: 0.30, freq: 'yearly' },
  { path: '/terms',                                              priority: 0.30, freq: 'yearly' },
]

async function dynamicProducts(): Promise<MetadataRoute.Sitemap> {
  try {
    const { data } = await supabaseAdmin
      .from('marketplace_products')
      .select('slug, updated_at, status')
      .in('status', ['active', 'coming_soon'])
    if (!data) return []
    return data.map((p) => ({
      url: `${BASE}/marketplace/${p.slug}`,
      lastModified: p.updated_at ? new Date(p.updated_at) : new Date(),
      changeFrequency: 'weekly' as Freq,
      priority: p.status === 'active' ? 0.90 : 0.70,
    }))
  } catch { return [] }
}

async function dynamicCategories(): Promise<MetadataRoute.Sitemap> {
  try {
    const { data } = await supabaseAdmin.from('marketplace_categories').select('slug')
    if (!data) return []
    return data.map((c) => ({
      url: `${BASE}/marketplace?category=${c.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as Freq,
      priority: 0.70,
    }))
  } catch { return [] }
}

async function dynamicBlog(): Promise<MetadataRoute.Sitemap> {
  try {
    const { data } = await supabaseAdmin
      .from('blog_posts')
      .select('slug, updated_at, published_at, status')
      .eq('status', 'published')
    if (!data) return []
    return data.map((p) => ({
      url: `${BASE}/blog/${p.slug}`,
      lastModified: new Date(p.updated_at || p.published_at || Date.now()),
      changeFrequency: 'weekly' as Freq,
      priority: 0.75,
    }))
  } catch { return [] }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()

  const staticRoutes: MetadataRoute.Sitemap = PAGES.map((p) => ({
    url: `${BASE}${p.path}`,
    lastModified: now,
    changeFrequency: p.freq,
    priority: p.priority,
  }))

  const [products, categories, blog] = await Promise.all([
    dynamicProducts(),
    dynamicCategories(),
    dynamicBlog(),
  ])

  return [...staticRoutes, ...products, ...categories, ...blog]
}
