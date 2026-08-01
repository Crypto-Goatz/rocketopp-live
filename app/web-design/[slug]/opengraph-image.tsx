import { ogCard, OG_SIZE, OG_CONTENT_TYPE } from '@/lib/og-card'
import { getArea } from '@/lib/local/areas'

/** Per-town card for the local service-area pages. */
export const runtime = 'nodejs'
export const alt = 'RocketOpp web design'
export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const area = getArea(slug)
  return ogCard({
    eyebrow: 'Web Design',
    title: area ? `Web design in ${area.name}, PA` : 'Web design in Western PA',
    footnote: 'rocketopp.com · Western PA',
    accent: '#34d399',
  })
}
