import type { NextRequest } from 'next/server'
import { ogCard } from '@/lib/og-card'

/**
 * Parameterised Open Graph card.
 *
 * The file-convention opengraph-image only applies to the segment it sits in —
 * it does NOT rescue a nested page that declares its own `openGraph` block,
 * because Next replaces that object wholesale. Dozens of static pages do exactly
 * that, so rather than scatter an opengraph-image.tsx into every folder, they
 * point `openGraph.images` at this route with their own title.
 *
 *   /api/og?title=SXO&eyebrow=Services&accent=%23fbbf24
 */
export const runtime = 'nodejs'

const MAX = 120

export function GET(req: NextRequest) {
  const p = req.nextUrl.searchParams
  const raw = (p.get('title') || 'RocketOpp').slice(0, MAX)
  const eyebrow = (p.get('eyebrow') || undefined)?.slice(0, 40)
  const footnote = (p.get('footnote') || 'rocketopp.com').slice(0, 60)
  const accent = /^#[0-9a-fA-F]{6}$/.test(p.get('accent') || '')
    ? (p.get('accent') as string)
    : '#ff6b35'

  return ogCard({ title: raw, eyebrow, footnote, accent })
}
