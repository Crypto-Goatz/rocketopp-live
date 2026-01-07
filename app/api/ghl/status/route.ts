import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth/session'
import { ghl } from '@/lib/ghl/client'

export async function GET() {
  try {
    const user = await getSession()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if GHL is configured
    if (!process.env.GHL_LOCATION_ID || !process.env.GHL_LOCATION_PIT) {
      return NextResponse.json({
        connected: false,
        error: 'GHL not configured',
        message: 'Missing GHL_LOCATION_ID or GHL_LOCATION_PIT environment variables'
      })
    }

    // Test connection by fetching location info
    const { location } = await ghl.location.get()

    return NextResponse.json({
      connected: true,
      location: {
        id: location.id,
        name: location.name,
        email: location.email,
        phone: location.phone,
        website: location.website,
        timezone: location.timezone,
      }
    })
  } catch (error: any) {
    console.error('GHL status check error:', error)
    return NextResponse.json({
      connected: false,
      error: error.message || 'Failed to connect to GHL'
    })
  }
}
