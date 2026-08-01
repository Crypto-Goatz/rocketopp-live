import { ogCard, OG_SIZE, OG_CONTENT_TYPE } from '@/lib/og-card'

/** Segment Open Graph card. File-convention images apply to the segment they
 *  sit in — a parent's card is NOT inherited — so each of these needs its own. */
export const runtime = 'nodejs'
export const alt = "EcoSpray Solutions — spray foam insulation, Pittsburgh"
export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE

export default function Image() {
  return ogCard({
    eyebrow: "Client",
    title: "EcoSpray Solutions — spray foam insulation, Pittsburgh",
    accent: '#22d3ee',
  })
}
