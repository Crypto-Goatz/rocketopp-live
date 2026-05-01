/**
 * DELETE /api/serp/keywords/[id]  — soft-archive (active=false)
 * PATCH  /api/serp/keywords/[id]  — { label?, notes?, active?, location?, device? }
 */

import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/db/supabase'

interface Ctx {
  params: Promise<{ id: string }>
}

export async function DELETE(_req: NextRequest, ctx: Ctx) {
  const { id } = await ctx.params
  const { error } = await supabaseAdmin
    .from('serp_keywords')
    .update({ active: false })
    .eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}

export async function PATCH(req: NextRequest, ctx: Ctx) {
  const { id } = await ctx.params
  const body = await req.json().catch(() => ({}))
  const patch: Record<string, unknown> = {}
  for (const key of ['label', 'notes', 'active', 'location', 'device']) {
    if (key in body) patch[key] = body[key]
  }
  if (Object.keys(patch).length === 0) {
    return NextResponse.json({ error: 'no patch fields' }, { status: 400 })
  }
  const { data, error } = await supabaseAdmin
    .from('serp_keywords')
    .update(patch)
    .eq('id', id)
    .select()
    .single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ keyword: data })
}
