import { ogCard, OG_SIZE, OG_CONTENT_TYPE } from '@/lib/og-card'

/**
 * Site-wide Open Graph card. Cascades to every route that does not define its
 * own opengraph-image, which is how 60+ pages get a real card without editing
 * 60+ metadata blocks.
 */
export const runtime = 'nodejs'
export const alt = 'RocketOpp — Enterprise AI systems, startup speed, real pricing'
export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE

export default function Image() {
  return ogCard({
    eyebrow: 'RocketOpp',
    title: 'Enterprise AI systems. Startup speed. Real pricing.',
    footnote: 'rocketopp.com · Western PA',
  })
}
