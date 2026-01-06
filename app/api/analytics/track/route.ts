import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

interface TrackingPayload {
  type: 'pageview' | 'event' | 'lead'
  data: Record<string, unknown>
  visitor_id: string
  session_id: string
  timestamp: string
}

export async function POST(request: NextRequest) {
  try {
    const payload: TrackingPayload = await request.json()
    const { type, data, visitor_id, session_id, timestamp } = payload

    // Get additional context from request
    const userAgent = request.headers.get('user-agent') || ''
    const referer = request.headers.get('referer') || ''
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] ||
               request.headers.get('x-real-ip') ||
               'unknown'

    // Parse user agent for device info
    const deviceInfo = parseUserAgent(userAgent)

    // Get geolocation from IP (using Vercel's edge headers if available)
    const country = request.headers.get('x-vercel-ip-country') || undefined
    const city = request.headers.get('x-vercel-ip-city') || undefined
    const region = request.headers.get('x-vercel-ip-country-region') || undefined

    if (type === 'lead') {
      // Store lead in database
      const { error } = await supabase.from('analytics_leads').insert({
        visitor_id,
        session_id,
        email: data.email,
        phone: data.phone,
        name: data.name,
        company: data.company,
        source: data.source,
        page: data.page,
        utm_source: (data.utm as Record<string, string>)?.source,
        utm_medium: (data.utm as Record<string, string>)?.medium,
        utm_campaign: (data.utm as Record<string, string>)?.campaign,
        utm_term: (data.utm as Record<string, string>)?.term,
        utm_content: (data.utm as Record<string, string>)?.content,
        user_agent: userAgent,
        device_type: deviceInfo.deviceType,
        browser: deviceInfo.browser,
        os: deviceInfo.os,
        ip_address: ip,
        country,
        city,
        region,
        referrer: referer,
        created_at: timestamp,
      })

      if (error) {
        console.error('Error storing lead:', error)
      }
    } else if (type === 'pageview') {
      // Store pageview in database
      const { error } = await supabase.from('analytics_pageviews').insert({
        visitor_id,
        session_id,
        path: data.path,
        title: data.title,
        referrer: data.referrer || referer,
        utm_source: (data.utm as Record<string, string>)?.source,
        utm_medium: (data.utm as Record<string, string>)?.medium,
        utm_campaign: (data.utm as Record<string, string>)?.campaign,
        user_agent: userAgent,
        device_type: deviceInfo.deviceType,
        browser: deviceInfo.browser,
        os: deviceInfo.os,
        ip_address: ip,
        country,
        city,
        created_at: timestamp,
      })

      if (error) {
        console.error('Error storing pageview:', error)
      }
    } else if (type === 'event') {
      // Store event in database
      const { error } = await supabase.from('analytics_events').insert({
        visitor_id,
        session_id,
        event_name: data.name,
        event_category: data.category,
        event_label: data.label,
        event_value: data.value,
        properties: data.properties,
        page: typeof window !== 'undefined' ? window.location.pathname : null,
        created_at: timestamp,
      })

      if (error) {
        console.error('Error storing event:', error)
      }
    }

    // Return 1x1 transparent pixel for beacon requests
    return new NextResponse(null, {
      status: 204,
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
      },
    })
  } catch (error) {
    console.error('Analytics tracking error:', error)
    return new NextResponse(null, { status: 204 })
  }
}

// Parse user agent for device/browser info
function parseUserAgent(ua: string): {
  deviceType: string
  browser: string
  os: string
} {
  const result = {
    deviceType: 'desktop',
    browser: 'unknown',
    os: 'unknown',
  }

  // Device type
  if (/mobile/i.test(ua)) {
    result.deviceType = 'mobile'
  } else if (/tablet|ipad/i.test(ua)) {
    result.deviceType = 'tablet'
  }

  // Browser detection
  if (/chrome/i.test(ua) && !/edge|edg/i.test(ua)) {
    result.browser = 'Chrome'
  } else if (/firefox/i.test(ua)) {
    result.browser = 'Firefox'
  } else if (/safari/i.test(ua) && !/chrome/i.test(ua)) {
    result.browser = 'Safari'
  } else if (/edge|edg/i.test(ua)) {
    result.browser = 'Edge'
  } else if (/opera|opr/i.test(ua)) {
    result.browser = 'Opera'
  }

  // OS detection
  if (/windows/i.test(ua)) {
    result.os = 'Windows'
  } else if (/macintosh|mac os/i.test(ua)) {
    result.os = 'macOS'
  } else if (/linux/i.test(ua)) {
    result.os = 'Linux'
  } else if (/android/i.test(ua)) {
    result.os = 'Android'
  } else if (/iphone|ipad|ipod/i.test(ua)) {
    result.os = 'iOS'
  }

  return result
}

// Also handle GET for pixel tracking
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const type = searchParams.get('t') || 'pageview'
  const data = searchParams.get('d')

  if (data) {
    try {
      const parsed = JSON.parse(atob(data))
      // Process as POST
      return POST(
        new NextRequest(request.url, {
          method: 'POST',
          body: JSON.stringify({
            type,
            data: parsed,
            visitor_id: searchParams.get('vid') || '',
            session_id: searchParams.get('sid') || '',
            timestamp: new Date().toISOString(),
          }),
          headers: request.headers,
        })
      )
    } catch {
      // Invalid data
    }
  }

  // Return 1x1 transparent GIF
  const gif = Buffer.from('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', 'base64')
  return new NextResponse(gif, {
    headers: {
      'Content-Type': 'image/gif',
      'Cache-Control': 'no-store, no-cache, must-revalidate',
    },
  })
}
