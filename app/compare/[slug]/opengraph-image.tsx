import { ogCard, OG_SIZE, OG_CONTENT_TYPE } from '@/lib/og-card'
import { getBuilder } from '@/lib/aeo/builders'

/** Per-competitor card, so "RocketOpp vs Wix" pastes as itself. */
export const runtime = 'nodejs'
export const alt = 'RocketOpp comparison'
export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const b = getBuilder(slug)
  return ogCard({
    eyebrow: 'Comparison',
    title: b ? `RocketOpp vs ${b.name}` : 'RocketOpp comparisons',
    footnote: 'rocketopp.com/compare',
    accent: '#38bdf8',
  })
}
