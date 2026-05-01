/**
 * GET /api/serp/history?keywordId=X&limit=30
 *
 * Returns the most recent N ranking snapshots for a keyword, oldest-first
 * so the UI can plot a left-to-right line chart without reversing.
 */

import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/db/supabase'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const keywordId = searchParams.get('keywordId')
  const limit = Math.max(1, Math.min(365, parseInt(searchParams.get('limit') ?? '60', 10)))
  if (!keywordId) {
    return NextResponse.json({ error: 'keywordId required' }, { status: 400 })
  }

  const { data, error } = await supabaseAdmin
    .from('serp_rankings')
    .select('id, position, ai_overview, ai_cited, ai_overview_position, checked_at, url, title')
    .eq('keyword_id', keywordId)
    .order('checked_at', { ascending: false })
    .limit(limit)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  // Reverse so the chart can plot oldest → newest left-to-right.
  return NextResponse.json({ history: (data ?? []).reverse() })
}
