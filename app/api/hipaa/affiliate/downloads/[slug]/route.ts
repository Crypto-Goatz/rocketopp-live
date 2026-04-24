/**
 * GET /api/hipaa/affiliate/downloads/[slug]?ref=<affiliate-slug>
 *
 * Serves affiliate marketing-kit assets as downloadable markdown.
 * Each asset injects the affiliate's full referral URL so they don't
 * have to hand-edit before sharing.
 */

import { NextRequest, NextResponse } from 'next/server'
import { nprmOnepager } from '@/lib/affiliate-kit/nprm-onepager'
import { tier1Explainer } from '@/lib/affiliate-kit/tier1-explainer'
import { linkedinPosts } from '@/lib/affiliate-kit/linkedin-posts'
import { emailSequence } from '@/lib/affiliate-kit/email-sequence'

export const runtime = 'nodejs'

const GENERATORS: Record<string, (refUrl: string) => { filename: string; body: string }> = {
  'nprm-onepager':    nprmOnepager,
  'tier1-explainer':  tier1Explainer,
  'linkedin-posts':   linkedinPosts,
  'email-sequence':   emailSequence,
}

export async function GET(req: NextRequest, ctx: { params: Promise<{ slug: string }> }) {
  const { slug } = await ctx.params
  const gen = GENERATORS[slug]
  if (!gen) return NextResponse.json({ error: 'unknown_asset' }, { status: 404 })

  const refSlug = req.nextUrl.searchParams.get('ref') || ''
  const refUrl  = refSlug
    ? `https://rocketopp.com/hipaa?ref=${encodeURIComponent(refSlug)}`
    : 'https://rocketopp.com/hipaa'

  const { filename, body } = gen(refUrl)

  return new NextResponse(body, {
    status: 200,
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Cache-Control': 'public, max-age=60',
    },
  })
}
