import { ogCard, OG_SIZE, OG_CONTENT_TYPE } from '@/lib/og-card'

/** Segment Open Graph card. File-convention images apply to the segment they
 *  sit in — a parent's card is NOT inherited — so each of these needs its own. */
export const runtime = 'nodejs'
export const alt = "Book a 15-minute call"
export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE

export default function Image() {
  return ogCard({
    eyebrow: "RocketOpp",
    title: "Book a 15-minute call",
    accent: '#34d399',
  })
}
