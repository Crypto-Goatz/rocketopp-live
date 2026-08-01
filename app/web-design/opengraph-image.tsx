import { ogCard, OG_SIZE, OG_CONTENT_TYPE } from '@/lib/og-card'

/** Segment Open Graph card. File-convention images apply to the segment they
 *  sit in — a parent's card is NOT inherited — so each of these needs its own. */
export const runtime = 'nodejs'
export const alt = "Web design near Greensburg, Murrysville & Monroeville PA"
export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE

export default function Image() {
  return ogCard({
    eyebrow: "Web Design",
    title: "Web design near Greensburg, Murrysville & Monroeville PA",
    accent: '#34d399',
  })
}
