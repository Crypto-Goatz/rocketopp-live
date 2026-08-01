import { ogCard, OG_SIZE, OG_CONTENT_TYPE } from '@/lib/og-card'

/**
 * This article is a folder route, so it beats app/blog/[slug] in the matcher —
 * including that segment's opengraph-image. It needs its own card.
 */
export const runtime = 'nodejs'
export const alt = 'AI search vs Google — where the queries went and where the clicks did not'
export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE

export default function Image() {
  return ogCard({
    eyebrow: 'Data Report',
    title: 'AI search vs Google: the queries stayed. The clicks left.',
    footnote: 'rocketopp.com · sourced & dated',
    accent: '#fbbf24',
  })
}
