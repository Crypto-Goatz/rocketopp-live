import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    // Store conversion
    await supabase.from('analytics_events').insert({
      visitor_id: data.visitor_id,
      session_id: data.session_id,
      event_name: 'conversion',
      event_category: 'conversion',
      event_label: data.type,
      event_value: data.value,
      properties: {
        conversion_type: data.type,
        currency: data.currency,
        metadata: data.metadata,
        utm: data.utm,
      },
      page: data.page,
      created_at: data.timestamp,
    })

    // If it's a lead, also store in leads table
    if (data.type === 'lead' && data.metadata?.email) {
      await supabase.from('analytics_leads').insert({
        visitor_id: data.visitor_id,
        session_id: data.session_id,
        email: data.metadata.email,
        name: data.metadata.name,
        phone: data.metadata.phone,
        company: data.metadata.company,
        source: data.metadata.source || 'conversion',
        page: data.page,
        utm_source: data.utm?.source,
        utm_medium: data.utm?.medium,
        utm_campaign: data.utm?.campaign,
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Conversion tracking error:', error)
    return NextResponse.json({ error: 'Failed to track' }, { status: 500 })
  }
}
