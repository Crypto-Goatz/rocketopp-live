import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth/session'
import { supabaseAdmin } from '@/lib/db/supabase'

// Get user's Google connection
export async function GET(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: connection } = await supabaseAdmin
      .from('user_google_connections')
      .select('id, services, connected_at, status, ga4_property_id, search_console_site')
      .eq('user_id', session.id)
      .single()

    return NextResponse.json({
      success: true,
      connection: connection || null,
    })
  } catch (error: any) {
    console.error('Get connection error:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

// Delete (disconnect) Google connection
export async function DELETE(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { error: deleteError } = await supabaseAdmin
      .from('user_google_connections')
      .delete()
      .eq('user_id', session.id)

    if (deleteError) {
      throw deleteError
    }

    return NextResponse.json({
      success: true,
      message: 'Google connection removed',
    })
  } catch (error: any) {
    console.error('Delete connection error:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

// Update connection settings (GA4 property, etc.)
export async function PATCH(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { ga4_property_id, search_console_site, ads_customer_id } = body

    const updates: Record<string, any> = {}
    if (ga4_property_id !== undefined) updates.ga4_property_id = ga4_property_id
    if (search_console_site !== undefined) updates.search_console_site = search_console_site
    if (ads_customer_id !== undefined) updates.ads_customer_id = ads_customer_id

    const { error: updateError } = await supabaseAdmin
      .from('user_google_connections')
      .update(updates)
      .eq('user_id', session.id)

    if (updateError) {
      throw updateError
    }

    return NextResponse.json({
      success: true,
      message: 'Connection updated',
    })
  } catch (error: any) {
    console.error('Update connection error:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
