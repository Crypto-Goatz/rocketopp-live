/**
 * Hand-built ("coded") blog articles.
 *
 * The blog index and /blog/[slug] read from the `blog_posts` table, which stores a
 * body of markup. That is right for written posts, but wrong for a data report —
 * this one carries four interactive charts, a legend the reader can toggle, and a
 * table view of every series. None of that survives a string column.
 *
 * So those articles live as real routes under app/blog/<slug>/page.tsx and register
 * here. The registry exists so the index card, the sitemap and the related-posts
 * rail can see them without knowing they are code rather than rows.
 *
 * ADDING ONE: create app/blog/<slug>/page.tsx (a folder route beats [slug] in Next's
 * matcher, so the existing /blog/<slug> links resolve to it automatically) and add
 * an entry below.
 */

export type FeaturedArticle = {
  slug: string
  title: string
  excerpt: string
  category: string
  tags: string[]
  readingTime: number
  /** ISO date. Drives ordering against DB posts and the sitemap lastModified. */
  publishedAt: string
  /** Shown on the index card in place of a view count. */
  kicker: string
  /** Card + hero art. Same /brand/blog/*.svg set the DB posts use. */
  heroImage: string
}

export const FEATURED_ARTICLES: FeaturedArticle[] = [
  {
    slug: 'ai-search-vs-google',
    title: "AI search vs Google: where the queries went — and where the clicks didn't",
    excerpt:
      'Google’s search volume is up, not down. What collapsed is the click. A sourced, dated data report on the shift — with every interpolation labelled as an interpolation.',
    category: 'Marketing',
    tags: ['AI Search', 'AEO', 'SEO', 'Data Report'],
    readingTime: 8,
    publishedAt: '2026-07-29T12:00:00.000Z',
    kicker: 'Data Report',
    heroImage: '/brand/blog/seo-sxo.svg',
  },
]

export function findFeatured(slug: string): FeaturedArticle | undefined {
  return FEATURED_ARTICLES.find((a) => a.slug === slug)
}
