/**
 * POST /api/recommend
 *
 * Body: { issueIds: string[] }
 *
 * Returns a ranked, deduped list of product slugs for the selected Layer-2
 * issues, plus a short personalized rationale.
 *
 * Ranking is deterministic (slugsForIssues) so the page always works. AI
 * (Groq via lib/ai-call) is used only to re-order within that set and write
 * the rationale — if it's down, we return the deterministic order with a
 * templated rationale. AI can never introduce a slug outside the catalog.
 */

import { NextRequest, NextResponse } from 'next/server'
import { askAIForJson } from '@/lib/ai-call'
import { PRODUCTS } from '@/lib/store/products'
import { slugsForIssues, getIssue, RECOMMEND_DISCOUNT_PCT } from '@/lib/recommend/issue-map'

export const runtime = 'nodejs'

interface Body {
  issueIds?: string[]
}

interface AIShape {
  slugs?: string[]
  rationale?: string
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as Body
    const issueIds = (body.issueIds || []).filter(Boolean)

    if (issueIds.length === 0) {
      return NextResponse.json({ error: 'No issues selected' }, { status: 400 })
    }

    // Deterministic base recommendation (always valid catalog slugs).
    const baseSlugs = slugsForIssues(issueIds)
    if (baseSlugs.length === 0) {
      return NextResponse.json({ error: 'No matching services' }, { status: 400 })
    }

    const issueLabels = issueIds
      .map((id) => getIssue(id)?.label)
      .filter(Boolean) as string[]

    const catalog = PRODUCTS.filter((p) => baseSlugs.includes(p.slug)).map((p) => ({
      slug: p.slug,
      name: p.name,
      tagline: p.tagline,
    }))

    const prompt = [
      'You are a solutions consultant for RocketOpp, an AI + web growth agency.',
      'A small-business owner selected these problems:',
      issueLabels.map((l) => `- ${l}`).join('\n'),
      '',
      'Here are the ONLY services you may recommend (use the exact slug):',
      JSON.stringify(catalog),
      '',
      'Return STRICT JSON: {"slugs": string[], "rationale": string}.',
      '- "slugs": the given slugs re-ordered best-fit first. Do NOT invent slugs. Do NOT add any not in the list.',
      '- "rationale": 2 short sentences, warm and specific, tying their problems to the recommended services. No pricing talk.',
    ].join('\n')

    const { data } = await askAIForJson<AIShape>(prompt, {
      maxTokens: 400,
      temperature: 0.4,
      timeoutMs: 9000,
    })

    // Honor AI order but only for slugs that exist in our base set; append any
    // base slugs the AI dropped so we never lose a valid recommendation.
    let slugs = baseSlugs
    if (data?.slugs?.length) {
      const allowed = new Set(baseSlugs)
      const aiOrder = data.slugs.filter((s) => allowed.has(s))
      slugs = [...new Set([...aiOrder, ...baseSlugs])]
    }

    const rationale =
      (typeof data?.rationale === 'string' && data.rationale.trim()) ||
      `Based on what you told us, these are the systems that move the needle fastest. Every one is ${RECOMMEND_DISCOUNT_PCT}% off on this page.`

    return NextResponse.json({ slugs, rationale, discountPct: RECOMMEND_DISCOUNT_PCT })
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'unknown error'
    console.error('[api/recommend] error:', msg)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
