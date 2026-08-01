import { ogCard, OG_SIZE, OG_CONTENT_TYPE } from '@/lib/og-card'
import { getProductBySlug } from '@/lib/marketplace/products'

/** Per-product marketplace card. */
export const runtime = 'nodejs'
export const alt = 'RocketOpp Marketplace'
export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const product = await getProductBySlug(slug).catch(() => null)
  return ogCard({
    eyebrow: 'Marketplace',
    title: product?.name || 'RocketOpp Marketplace',
    footnote: 'rocketopp.com/marketplace',
    accent: '#c084fc',
  })
}
